# termline

[English](README.md) | [简体中文](README.zh-CN.md)

A minimal, line-driven terminal theme for [Hugo](https://gohugo.io/).

<p align="center">
  <img src="images/screenshot.png" alt="termline light theme screenshot" width="49%">
  <img src="images/screenshot-dark.png" alt="termline dark theme screenshot" width="49%">
</p>

## Features

- Responsive terminal-inspired layout with light and dark color schemes
- English and Simplified Chinese interface strings
- Client-side search backed by Hugo's JSON home output
- Archives, tags, post covers, pagination, and reading metadata
- Dedicated About and journeys page templates
- Markdown alerts, syntax highlighting, Mermaid diagrams, and image lightbox
- Project-level CSS, JavaScript, and template hook overrides

## Getting Started

Choose the path that matches your goal:

- Clone `main` to preview the complete demonstration site.
- Install `theme` when adding termline to your own Hugo site.

### 1. Prepare the environment

- [Git](https://git-scm.com/)
- Hugo Extended `0.163.3` or newer
- PowerShell 7 is recommended for the repository scripts

Confirm that Hugo is available:

```powershell
hugo version
```

### 2. Preview the complete repository

The `main` branch includes generic content, development configuration, and a
quick-start script:

```powershell
git clone --branch main https://github.com/wobushi041/hugo-theme-termline.git
Set-Location .\hugo-theme-termline
.\scripts\dev.ps1
```

The script starts at `http://127.0.0.1:1313/`. If the port is occupied, it
selects the next available port. You can also choose a starting port:

```powershell
.\scripts\dev.ps1 -Port 1414
```

`scripts/dev.ps1` exists only on `main`; the `theme` branch contains the
installable theme files only.

### 3. Install into an existing Hugo site

#### Git submodule

The distributable theme lives on the `theme` branch with its files at the
repository root:

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

To update it later:

```bash
git submodule update --remote --merge themes/termline
```

#### Manual installation

Download the `theme` branch or a release archive and extract it to
`themes/termline/` in your Hugo site.

### 4. Configure the site

Enable the theme and JSON search index in your site's `hugo.toml`:

```toml
baseURL = "https://example.org/"
title = "Example Site"
theme = "termline"
defaultContentLanguage = "en"

[outputs]
home = ["HTML", "RSS", "JSON"]

[params]
contentTypeName = "posts"
showMenuItems = 6
fullWidthTheme = false
centerTheme = true
autoCover = true
showLastUpdated = false

[languages]
[languages.en]
label = "English"
weight = 1

[languages.en.params]
subtitle = "A minimal terminal blog"

[languages.en.params.logo]
logoText = "termline"
logoHomeLink = "/"
```

### 5. Create a post and start Hugo

```bash
hugo new content posts/hello.md
hugo server
```

Open the local address printed in the terminal. To include draft posts, run:

```bash
hugo server --buildDrafts
```

### 6. Build the static site

```bash
hugo
```

The generated site is written to `public/` and can be deployed to any static
hosting service.

## Configuration

### Footer

```toml
[params.termline.footer]
showPoweredBy = true
owner = "Example Author"
```

With `showPoweredBy = true`, the footer renders the copyright owner followed
by `Theme termline` and `Powered by Hugo`. Set it to `false` to display only
the copyright. A site-level `copyright` value replaces the generated footer.

### Site assets

Leave a value empty to omit that asset:

```toml
[params.termline.assets]
favicon = "/favicon.ico"
faviconSvg = "/favicon.svg"
appleTouchIcon = "/apple-touch-icon.png"
defaultOgImage = "/og-image.png"
```

### ICP and public security registration

These optional fields are intended for sites that need mainland China filing
links:

```toml
[params.termline.beian]
icpNumber = ""
icpURL = "https://beian.miit.gov.cn/"
policeNumber = ""
policeURL = ""
policeIcon = ""
```

## Page Templates

### About page

Create `content/about.md`:

```toml
+++
title = "About"
type = "about"
profileName = "Example Author"
motto = "A minimal terminal blog."
mottos = ["A minimal terminal blog.", "Line-driven and focused."]
avatar = "/images/avatar.svg"
heroBackground = "/images/banner.jpg"
+++
```

The theme includes a neutral avatar template at `static/images/avatar.svg`.
Override it by placing your own file at the same path in the Hugo project.

### Archives page

Create `content/archives.md`:

```toml
+++
title = "Archives"
type = "archives"
+++
```

### Journeys page

Create `content/journeys.md`:

```toml
+++
title = "Journeys"
type = "journeys"
homeCity = ""
startDate = ""
provinces = []
spots = []
cityCoordinates = {}
+++
```

## Customization and Hooks

Hugo gives project files precedence over theme files, so customizations can
remain outside the theme and survive theme updates.

### CSS and JavaScript

Create either of these files in the root of your Hugo project:

- `assets/custom/custom.css` — loaded after the theme styles
- `assets/custom/custom.js` — loaded after the theme scripts

### Template hooks

Override a hook by creating the matching file under
`layouts/partials/hooks/` in your Hugo project:

| Hook | Placement |
| --- | --- |
| `head-end.html` | End of `<head>` |
| `body-start.html` | Start of `<body>` |
| `header-after.html` | After the site header |
| `content-before.html` | Before the main content block |
| `content-after.html` | After the main content block |
| `footer-before.html` | Before the site footer |
| `body-end.html` | End of `<body>` |

## Support and Contributions

Use the repository issue tracker for bug reports and feature requests. Pull
requests are welcome; please run the repository's full verification script
before submitting theme changes.

## License and Attribution

`termline` is released under the [MIT License](LICENSE). It is derived in part
from [Terminal](https://github.com/panr/hugo-theme-terminal) by panr. Bundled
third-party components and their licenses are listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
