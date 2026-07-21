# Vendored fonts

Self-hosted, Latin-subset `woff2` files replacing the Google Fonts CDN
stylesheet, built via `themes/pouet/assets/css/fonts.css` (see `head.html`).
All four families are licensed under the SIL Open Font License 1.1 (see
`OFL.txt` for the full text - the license body is identical across OFL fonts;
only the copyright preamble differs per family). If redistributing this
template independently of the upstream projects, verify the current
copyright preamble for each family at its `fonts.google.com/specimen/<name>`
page before shipping.

| File | Family | Weight(s) | Style |
|---|---|---|---|
| `SpaceGrotesk-variable.woff2` | Space Grotesk | 400-700 (variable) | normal |
| `JetBrainsMono-variable.woff2` | JetBrains Mono | 400-700 (variable) | normal |
| `PressStart2P-400.woff2` | Press Start 2P | 400 | normal |
| `InstrumentSerif-400-normal.woff2` | Instrument Serif | 400 | normal |
| `InstrumentSerif-400-italic.woff2` | Instrument Serif | 400 | italic |
| `JetBrainsMono-Regular.ttf`, `JetBrainsMono-Bold.ttf` | JetBrains Mono | 400 / 700 | normal (used only by `og-card.html` for generated social images, not the site CSS) |

Latin subset only (covers EN + FR). To support a language needing Latin
Extended or another script, fetch the additional subset from
`https://fonts.googleapis.com/css2?family=<Family>&text=<sample text>` and
add the matching `@font-face` block(s) to `fonts.css`.
