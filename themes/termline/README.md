# termline

`termline` is a minimal, line-driven terminal theme for [Hugo](https://gohugo.io/).

## Requirements

- Hugo Extended `0.163.3` or newer

## Installation

You can install `termline` from the distribution branch or copy the theme
directory from the development branch.

### As a Git submodule

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

The `theme` branch contains the theme files at its repository root, matching
Hugo's expected `themes/termline` layout.

### Manual copy

Download or clone the `main` branch, then copy its `themes/termline` directory
into your Hugo site's `themes/termline` directory.

## Configuration

In your site's `hugo.toml`:

```toml
theme = "termline"

[params.termline.footer]
showPoweredBy = true
owner = "Example Author"

[params.termline.assets]
favicon = "/favicon.ico"
faviconSvg = "/favicon.svg"
appleTouchIcon = "/apple-touch-icon.png"
defaultOgImage = "/og-image.png"

[params.termline.beian]
icpNumber = ""
icpURL = "https://beian.miit.gov.cn/"
policeNumber = ""
policeURL = ""
policeIcon = ""
```

## Front Matter Specifications

### About Page (`content/about.md`)

```toml
+++
title = "About"
type = "about"
profileName = "Author"
motto = "A minimal terminal blog."
mottos = ["A minimal terminal blog.", "Line-driven and focused."]
avatar = "/images/avatar.svg"
heroBackground = "/images/banner.jpg"
+++
```

### Archives Page (`content/archives.md`)

```toml
+++
title = "Archives"
type = "archives"
+++
```

### Journeys Page (`content/journeys.md`)

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

## Customization & Hooks

### Resource Overrides

- `assets/custom/custom.css` — Custom CSS injected after theme base styles.
- `assets/custom/custom.js` — Custom JavaScript bundled and loaded after theme scripts.

### Template Hooks

Override these partials in your site (`layouts/partials/hooks/*.html`):

1. `head-end.html` — Injected at the end of `<head>`
2. `body-start.html` — Injected at the start of `<body>`
3. `header-after.html` — Injected after header component
4. `content-before.html` — Injected before main content block
5. `content-after.html` — Injected after main content block
6. `footer-before.html` — Injected before footer component
7. `body-end.html` — Injected at the end of `<body>`

## License & Attribution

- Licensed under [MIT](LICENSE).
- Derived from [Terminal](https://github.com/panr/hugo-theme-terminal) by panr.
- See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for bundled open source notices.
