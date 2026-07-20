# Theming

## Design tokens - `themes/pouet/assets/css/tokens.css`

Every color, radius, and spacing step is a CSS custom property on `:root`, with a dark-mode override block keyed off `[data-theme="dark"]`. The layers:

- **Brand**: `--brand-red` (#F14D6C) and its deep/ink/soft variants. Change these four and the whole site follows - chips, links, buttons, the wipe, the logo accent.
- **Neutrals**: an 11-step gray ramp (`--neutral-050` ... `--neutral-900`).
- **Semantic surfaces and text**: `--bg-app`, `--bg-paper`, `--fg-1`, `--fg-2`, `--fg-accent`... Layouts and `site.css` only use semantic tokens, so retheming means editing tokens, not hunting selectors.
- **Signal colors, radii, spacing**: `--ok`/`--warn`/`--danger`/`--info`, `--r-*`, 4-pt spacing scale.

## Fonts

Loaded from Google Fonts in `head.html`:

| Font | Role |
|---|---|
| Space Grotesk | Display and body |
| JetBrains Mono | Code, terminal, chips, metadata |
| Press Start 2P | The `pixel` accent spans |
| Instrument Serif | The `serif` accent spans in the hero |

To change fonts: edit the `<link>` in `head.html` and the `--font-*` tokens in `tokens.css`. To self-host: put the files under `themes/pouet/assets/` and swap the link for `@font-face` rules (keep them out of `tokens.css`'s critical path - a `<link>` in head is fine).

Font ligatures are globally disabled for code (`font-variant-ligatures: none`) so `===`, `!==`, and arrows read as typed.

## Syntax highlighting - `themes/pouet/assets/css/syntax.css`

Catppuccin Mocha, applied via Chroma CSS classes in both light and dark mode (code blocks stay dark on the light theme, deliberately). To use another palette, generate a Chroma stylesheet:

```bash
hugo gen chromastyles --style=<style> > themes/pouet/assets/css/syntax.css
```

then re-add the `.chroma` block padding/radius from the top of the current file.

## Logo and favicon

`static/img/logo.svg` drives the nav, footer, favicon, and about-page portrait (all four are params, so they can diverge - see [configuration.md](configuration.md)). The brand mark text next to the logo is `title` + `brandSuffix` from `hugo.toml`; the suffix renders in brand red via the `.bang` class.

## The console banner

The ASCII art in `themes/pouet/assets/js/egg.js` spells "pouet!". If you rebrand, regenerate yours with any figlet-style tool and keep the string array shape.
