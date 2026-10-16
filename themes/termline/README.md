# termline

[English](README.md) | [简体中文](README.zh-CN.md)

A minimal, line-driven terminal theme for [Hugo](https://gohugo.io/).

![termline screenshot](images/screenshot.png)

## Features

- Responsive terminal-inspired layout with light and dark color schemes
- English and Simplified Chinese interface strings
- Client-side search backed by Hugo's JSON home output
- Archives, tags, post covers, pagination, and reading metadata
- Dedicated About and journeys page templates
- Markdown alerts, syntax highlighting, Mermaid diagrams, and image lightbox
- Project-level CSS, JavaScript, and template hook overrides

## Requirements

- Hugo Extended `0.163.3` or newer

## Installation

### Git submodule

The distributable theme lives on the `theme` branch with its files at the
repository root:

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

To update it later:

```bash
git submodule update --remote --merge themes/termline
```

### Manual installation

Download the `theme` branch or a release archive and extract it to
`themes/termline/` in your Hugo site.

## Quick Start

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

Create a post and start Hugo:

```bash
hugo new content posts/hello.md
hugo server
```

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
