param(
  [switch]$PrepareScreenshot
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
$themeRoot = Join-Path $repoRoot "themes/termline"
$themesDir = Join-Path $repoRoot "themes"
$tempBase = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath()).TrimEnd('\', '/')
$fixtureRoot = Join-Path $tempBase ("hugo-theme-termline-" + [guid]::NewGuid().ToString("N"))
$outputRoot = Join-Path $fixtureRoot "public"
$retainFixture = $false
$privacyPatterns = @(
  [pscustomobject]@{
    Name = "non-example email address"
    Pattern = '(?i)\b[A-Z0-9._%+-]+@(?!example\.(?:com|org|net|invalid)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b'
  },
  [pscustomobject]@{
    Name = "ICP registration number"
    Pattern = '(?i)[\u4e00-\u9fff]*ICP(?:备)?\d+号(?:-\d+)?'
  },
  [pscustomobject]@{
    Name = "public security registration number"
    Pattern = '公网安备\s*\d{15,20}号?'
  },
  [pscustomobject]@{
    Name = "private key"
    Pattern = '-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----'
  },
  [pscustomobject]@{
    Name = "GitHub access token"
    Pattern = '(?i)\b(?:github_pat_|gh[pousr]_)[A-Za-z0-9_]{20,}\b'
  }
)

function Assert-Exists {
  param([string]$Root, [string]$RelativePath)
  $path = Join-Path $Root $RelativePath
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required path: $path"
  }
}

function Assert-NotExists {
  param([string]$Root, [string]$RelativePath)
  $path = Join-Path $Root $RelativePath
  if (Test-Path -LiteralPath $path) {
    throw "Forbidden path exists: $path"
  }
}

function Assert-NoPrivateData {
  param([string]$Text, [string]$Context)
  foreach ($rule in $privacyPatterns) {
    if ([regex]::IsMatch($Text, $rule.Pattern)) {
      throw "$($rule.Name) found in $Context"
    }
  }
}

function Write-FixtureFile {
  param([string]$RelativePath, [string]$Content)
  $path = Join-Path $fixtureRoot $RelativePath
  $parent = Split-Path -Parent $path
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  [System.IO.File]::WriteAllText(
    $path,
    $Content,
    [System.Text.UTF8Encoding]::new($false)
  )
}

function Get-PngSize {
  param([string]$Path)
  [byte[]]$bytes = [System.IO.File]::ReadAllBytes($Path)
  if ($bytes.Length -lt 24 -or
      $bytes[0] -ne 137 -or $bytes[1] -ne 80 -or
      $bytes[2] -ne 78 -or $bytes[3] -ne 71) {
    throw "Invalid PNG file: $Path"
  }

  $width = [System.Net.IPAddress]::NetworkToHostOrder(
    [System.BitConverter]::ToInt32($bytes, 16)
  )
  $height = [System.Net.IPAddress]::NetworkToHostOrder(
    [System.BitConverter]::ToInt32($bytes, 20)
  )

  return [pscustomobject]@{ Width = $width; Height = $height }
}

$versionText = (& hugo version) | Out-String
if ($LASTEXITCODE -ne 0 -or $versionText -notmatch 'v(?<version>\d+\.\d+\.\d+)') {
  throw "Unable to determine Hugo version"
}
if ([version]$Matches.version -lt [version]"0.163.3") {
  throw "Hugo 0.163.3 or newer is required; found $($Matches.version)"
}

if (-not $PrepareScreenshot) {
  foreach ($path in @(
    "hugo.toml",
    "theme.toml",
    "LICENSE",
    "THIRD_PARTY_NOTICES.md",
    "README.md",
    "README.zh-CN.md",
    "archetypes",
    "assets",
    "i18n/en.toml",
    "i18n/zh-cn.toml",
    "layouts",
    "static",
    "static/images/avatar.svg",
    "images/screenshot.png",
    "images/screenshot-dark.png",
    "images/tn.png"
  )) {
    Assert-Exists $themeRoot $path
  }

  foreach ($path in @(
    "hugo.toml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE",
    ".github/workflows\build.yml",
    ".github/workflows\publish-theme.yml",
    "scripts/dev.ps1",
    "scripts/verify-theme.ps1",
    "assets/custom\custom.css",
    "assets/custom\custom.js"
  )) {
    Assert-Exists $repoRoot $path
  }

  $hooks = @(
    "head-end",
    "body-start",
    "header-after",
    "content-before",
    "content-after",
    "footer-before",
    "body-end"
  )
  $baseTemplate = Get-Content -LiteralPath (
    Join-Path $themeRoot "layouts/_default\baseof.html"
  ) -Raw

  foreach ($hook in $hooks) {
    $relative = "layouts/partials\hooks\$hook.html"
    Assert-Exists $themeRoot $relative
    Assert-Exists $repoRoot $relative

    $needle = "partial `"hooks/$hook.html`""
    $count = [regex]::Matches(
      $baseTemplate,
      [regex]::Escape($needle)
    ).Count
    if ($count -ne 1) {
      throw "Expected one call to $needle, found $count"
    }
  }

  foreach ($path in @(
    "raw",
    "exampleSite",
    "archetypes",
    "layouts/_default",
    "layouts/about",
    "layouts/archives",
    "layouts/journeys",
    "static",
    "public",
    "resources",
    ".hugo_build.lock",
    ".github/workflows\deploy.yml"
  )) {
    Assert-NotExists $repoRoot $path
  }

  $trackedForbidden = (& git -C $repoRoot ls-files -- `
    raw exampleSite public resources .hugo_build.lock) | Out-String
  if ($LASTEXITCODE -ne 0) {
    throw "git ls-files failed"
  }
  if (-not [string]::IsNullOrWhiteSpace($trackedForbidden)) {
    throw "Forbidden tracked paths:`n$trackedForbidden"
  }

  foreach ($path in @(
    "content/_index.md",
    "content/about.md",
    "content/archives.md",
    "content/journeys.md",
    "content/links.md",
    "content/posts/hello-termline.md",
    "content/posts/markdown-syntax-preview.md"
  )) {
    Assert-Exists $repoRoot $path
  }

  $rootConfig = Get-Content -LiteralPath (Join-Path $repoRoot "hugo.toml") -Raw
  if (-not $rootConfig.Contains('theme = "termline"')) {
    throw 'Root hugo.toml must declare theme = "termline"'
  }

  $themeReadme = Get-Content -LiteralPath (
    Join-Path $themeRoot "README.md"
  ) -Raw
  $submoduleCommand = 'git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline'
  if (-not $themeReadme.Contains($submoduleCommand)) {
    throw "Theme README is missing the distributable submodule command"
  }

  $themeMetadata = Get-Content -LiteralPath (
    Join-Path $themeRoot "theme.toml"
  ) -Raw
  foreach ($needle in @(
    'name = "termline"',
    'min_version = "0.163.3"',
    '[original]',
    'name = "Terminal"'
  )) {
    if (-not $themeMetadata.Contains($needle)) {
      throw "theme.toml is missing: $needle"
    }
  }

  $head = Get-Content -LiteralPath (
    Join-Path $themeRoot "layouts/partials\head.html"
  ) -Raw
  $footer = Get-Content -LiteralPath (
    Join-Path $themeRoot "layouts/partials\footer.html"
  ) -Raw
  if (-not $head.Contains('resources.Get "custom/custom.css"')) {
    throw "head.html does not consume custom/custom.css"
  }
  if (-not $footer.Contains('resources.Get "custom/custom.js"')) {
    throw "footer.html does not consume custom/custom.js"
  }

  $runtimeRoots = @(
    "layouts",
    "assets",
    "static",
    "i18n",
    "hugo.toml"
  )
  foreach ($relativeRoot in $runtimeRoots) {
    $target = Join-Path $themeRoot $relativeRoot
    if (-not (Test-Path -LiteralPath $target)) { continue }

    $item = Get-Item -LiteralPath $target
    $files = if ($item.PSIsContainer) {
      Get-ChildItem -LiteralPath $target -Recurse -File
    } else {
      $item
    }

    foreach ($file in $files) {
      if ($file.Extension -in @(
        ".png", ".jpg", ".jpeg", ".gif", ".ico", ".woff2"
      )) { continue }

      $text = Get-Content -LiteralPath $file.FullName -Raw
      Assert-NoPrivateData $text $file.FullName
    }
  }

  $repoContent = Join-Path $repoRoot "content"
  if (Test-Path -LiteralPath $repoContent) {
    $contentFiles = Get-ChildItem -LiteralPath $repoContent -Recurse -File
    foreach ($file in $contentFiles) {
      $text = Get-Content -LiteralPath $file.FullName -Raw
      Assert-NoPrivateData $text $file.FullName
    }
  }

  $screenshot = Get-PngSize (
    Join-Path $themeRoot "images/screenshot.png"
  )
  if ($screenshot.Width -ne 1500 -or $screenshot.Height -ne 1000) {
    throw "screenshot.png must be 1500x1000"
  }

  $darkScreenshot = Get-PngSize (
    Join-Path $themeRoot "images/screenshot-dark.png"
  )
  if ($darkScreenshot.Width -ne 1500 -or $darkScreenshot.Height -ne 1000) {
    throw "screenshot-dark.png must be 1500x1000"
  }

  $thumbnail = Get-PngSize (
    Join-Path $themeRoot "images/tn.png"
  )
  if ($thumbnail.Width -ne 900 -or $thumbnail.Height -ne 600) {
    throw "tn.png must be 900x600"
  }
}

try {
  New-Item -ItemType Directory -Path $fixtureRoot -Force | Out-Null

  Write-FixtureFile "hugo.toml" @'
baseURL = "https://example.org/"
title = "termline Smoke Test"
theme = "termline"
defaultContentLanguage = "en"

[outputs]
home = ["HTML", "RSS", "JSON"]

[markup.goldmark.renderer]
unsafe = true

[params]
contentTypeName = "posts"

[languages]
[languages.en]
label = "English"
weight = 1

[languages.en.params.logo]
logoText = "termline"
logoHomeLink = "/"
'@

  $fixtureFiles = @{
    "content/_index.md" = @'
+++
title = "Home"
+++

A neutral site generated only for final verification.
'@
    "content/posts/hello.md" = @'
+++
title = "Hello"
date = 2026-01-01T00:00:00Z
tags = ["hugo"]
+++

A complete anonymous article.

```mermaid
flowchart LR
  Source --> Theme --> Output
```
'@
    "content/about.md" = @'
+++
title = "About"
type = "about"
+++

Anonymous theme information.
'@
    "content/archives.md" = @'
+++
title = "Archives"
type = "archives"
+++
'@
    "content/journeys.md" = @'
+++
title = "Journeys"
type = "journeys"
+++
'@
    "content/links.md" = @'
+++
title = "Links"
type = "links"
+++
'@
    "assets/custom\custom.css" = @'
body { --termline-smoke-css: 1; }
'@
    "assets/custom\custom.js" = @'
window.__termlineSmokeJs = true;
'@
    "layouts/partials\hooks\body-end.html" = @'
<div id="termline-smoke-hook"></div>
'@
  }

  foreach ($entry in $fixtureFiles.GetEnumerator()) {
    Write-FixtureFile $entry.Key $entry.Value
  }

  & hugo --source $fixtureRoot --themesDir $themesDir --theme termline `
    --destination $outputRoot --cleanDestinationDir --gc --minify
  if ($LASTEXITCODE -ne 0) {
    throw "Hugo final build failed with exit code $LASTEXITCODE"
  }

  if ($PrepareScreenshot) {
    $retainFixture = $true
    Write-Output $fixtureRoot
    return
  }

  foreach ($path in @(
    "index.html",
    "404.html",
    "index.json",
    "index.xml",
    "posts/hello/index.html",
    "about\index.html",
    "archives\index.html",
    "journeys\index.html",
    "links\index.html"
  )) {
    Assert-Exists $outputRoot $path
  }

  $renderedFiles = Get-ChildItem -LiteralPath $outputRoot -Recurse -File |
    Where-Object { $_.Extension -in @(".html", ".css", ".js", ".xml", ".json") }
  $renderedText = (
    $renderedFiles | ForEach-Object {
      Get-Content -LiteralPath $_.FullName -Raw
    }
  ) -join "`n"

  foreach ($marker in @(
    "termline-smoke-hook",
    "--termline-smoke-css",
    "__termlineSmokeJs",
    "Theme <a href=",
    "hugo-theme-termline",
    "Powered by <a href="
  )) {
    if (-not $renderedText.Contains($marker)) {
      throw "Rendered override marker missing: $marker"
    }
  }

  Assert-NoPrivateData $renderedText "rendered anonymous site"

  Write-Host "termline final verification passed."
}
finally {
  if (-not $retainFixture -and (Test-Path -LiteralPath $fixtureRoot)) {
    $resolvedFixture = [System.IO.Path]::GetFullPath($fixtureRoot)
    $safePrefix = $tempBase + [System.IO.Path]::DirectorySeparatorChar
    if (-not $resolvedFixture.StartsWith(
      $safePrefix,
      [System.StringComparison]::OrdinalIgnoreCase
    )) {
      throw "Refusing to remove path outside temp: $resolvedFixture"
    }

    Remove-Item -LiteralPath $resolvedFixture -Recurse -Force
  }
}
