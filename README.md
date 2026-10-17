# hugo-theme-termline

[English](README.md) | [简体中文](README.zh-CN.md)

A minimal, line-driven terminal theme for [Hugo](https://gohugo.io/).

<p align="center">
  <img src="themes/termline/images/screenshot.png" alt="termline light theme screenshot" width="49%">
  <img src="themes/termline/images/screenshot-dark.png" alt="termline dark theme screenshot" width="49%">
</p>

## Overview

This repository is a Hugo project for developing, previewing, and verifying
the `termline` theme. The project root contains generic demonstration content,
development scripts, and project-level override examples. The independently
installable theme lives in `themes/termline/`.

```text
main
├─ hugo.toml + content/       → project configuration and generic demo content
├─ layouts/ + assets/         → project-level override examples
├─ scripts/                   → development and verification scripts
└─ themes/termline/           → complete distributable theme
                               ↓
theme branch                  → installable theme at repository root
```

The repository contains no real blog content or personal site data. For the
complete configuration reference, see the [theme documentation](themes/termline/README.md).

## Highlights

- Responsive terminal-inspired layout with light and dark color schemes
- English and Simplified Chinese interface strings
- Client-side search, archives, tags, covers, and pagination
- About and journeys page templates
- Markdown alerts, syntax highlighting, Mermaid diagrams, and image lightbox
- Project-level CSS, JavaScript, and template hook overrides

## Usage

Clone the complete `main` branch to preview the theme. If you already have a
Hugo site, install the theme directly from the `theme` branch.

### 1. Prepare the environment

- [Git](https://git-scm.com/)
- Hugo Extended `0.163.3` or newer
- PowerShell 7 is recommended for the repository scripts

Confirm that Hugo is available:

```powershell
hugo version
```

### 2. Preview the theme

Clone the development repository from PowerShell:

```powershell
git clone --branch main https://github.com/wobushi041/hugo-theme-termline.git
Set-Location .\hugo-theme-termline
.\scripts\dev.ps1
```

The script starts the development server at `http://127.0.0.1:1313/`. If that
port is already in use, it automatically selects the next available port.

You can also choose a starting port:

```powershell
.\scripts\dev.ps1 -Port 1414
```

Press `Ctrl+C` to stop the server. `scripts/dev.ps1` exists only on the `main`
development branch; the streamlined `theme` branch contains installable theme
files only.

### 3. Install into an existing Hugo site

Git submodule is the recommended installation method:

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

Update the theme later with:

```bash
git submodule update --remote --merge themes/termline
```

Alternatively, download the `theme` branch or a release archive and extract it
to `themes/termline/` in your site.

### 4. Configure the site

Enable the theme and the JSON home output required by search in `hugo.toml`:

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

### 5. Create a post and start the site

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

## Repository Structure

| Path | Purpose |
| --- | --- |
| `content/` | Generic demonstration pages and posts used to exercise the theme |
| `assets/custom/` | Project-level CSS and JavaScript override examples |
| `layouts/partials/hooks/` | Project-level template hook examples |
| `themes/termline/` | Complete theme and the source of the `theme` branch |
| `scripts/dev.ps1` | Local development server with automatic port selection |
| `scripts/verify-theme.ps1` | Full structure, privacy, override, asset, and build verification |

The generic demonstration content under `content/` exists only to exercise the
theme. Personal content and configuration should stay in the consuming Hugo
project.

## Override Contract

Hugo gives project files precedence over theme files. This repository keeps the
supported override locations visible at the project root:

- `assets/custom/custom.css`
- `assets/custom/custom.js`
- `layouts/partials/hooks/*.html`

See [Customization and Hooks](themes/termline/README.md#customization-and-hooks)
for the complete list of hook slots.

## Distribution

The `main` branch is the development repository. The publish workflow exports
`themes/termline/` to the `theme` branch, where the theme files live directly at
the repository root.

```text
main: themes/termline/   →   theme: /
```

Before publishing a release or tag, run the full verification:

```powershell
.\scripts\verify-theme.ps1
```

## Contributing

Issues and pull requests are welcome. Keep demonstration content generic and
anonymous, and place theme runtime changes under `themes/termline/`; use the
project root only for development configuration and override examples.

## License and Attribution

`termline` is released under the [MIT License](LICENSE). It is derived in part
from [Terminal](https://github.com/panr/hugo-theme-terminal) by panr. Bundled
third-party components and their licenses are listed in
[THIRD_PARTY_NOTICES.md](themes/termline/THIRD_PARTY_NOTICES.md).
