# Design: Configurable brand color (default → indigo)

Date: 2026-07-21
Status: Approved (brainstorming) — pending spec review

## Goal

1. Change the shipped brand/base color from the current pink-red to **indigo `#6366F1`**.
2. Make the brand color **configurable** through a single Hugo param so a site owner can retint the whole UI without editing CSS.

## Background

The brand color is exposed through four CSS custom properties in
`themes/pouet/assets/css/tokens.css`, defined for both light (`:root`) and dark
(`[data-theme="dark"]`) themes:

| Token | Role |
|-------|------|
| `--brand-red` | primary accent (links, buttons, active nav, focus border, `--fg-accent`, `--danger`) |
| `--brand-red-deep` | subtle deep variant |
| `--brand-red-ink` | darker/richer variant — hover fills, chip text, post-link hover |
| `--brand-red-soft` | pale tint — chip backgrounds |

Every consumer in `site.css` reads these through `var(--brand-red*)`, so the
visible UI has a **single chokepoint**. `--fg-accent`, `--border-focus`, and
`--danger` are already defined as `var(--brand-red)`, so they follow the base
token automatically.

The same color is *also* hardcoded in a "long tail" outside the CSS variable
system: `mermaid-init.js`, `og-card.html`, `static/img/logo.svg`, `egg.js`,
`animations.js`, and two lines in `site.css` (`.term .crit` / `.term .cve`).

## Scope (decided during brainstorming)

- **Configurable (param-driven):** the CSS UI only — the `--brand-red*` family
  and the focus ring, in both themes.
- **Default value change (static, NOT param-wired):** the long tail is flipped
  from pink to indigo so the shipped default site is visually coherent. These
  stay hardcoded; wiring them to the param is explicitly out of scope.

## Approach

### A. The param — `params.brandColor`

Chosen mechanism: **hand-tuned indigo defaults in `tokens.css` + an additive
inline `<style>` override in `head.html`**.

- `tokens.css` ships the indigo family as plain hexes (no `color-mix`), so the
  **default site is bulletproof in every browser**.
- When (and only when) `.Site.Params.brandColor` is set, `head.html` emits a
  small inline `<style>` **after** the three CSS `<link>`s (wins by source
  order). It sets `--brand-red` to the given color and **derives** the other
  three tokens + focus ring via CSS `color-mix()`, for both `:root` and
  `[data-theme="dark"]`.

Derivation (light):
```css
:root{
  --brand-red:       <color>;
  --brand-red-deep:  color-mix(in srgb, <color>, black 4%);
  --brand-red-ink:   color-mix(in srgb, <color>, black 18%);
  --brand-red-soft:  color-mix(in srgb, <color>, white 88%);
  --shadow-focus:    0 0 0 3px color-mix(in srgb, <color>, transparent 75%);
}
```
Derivation (dark — base lifted toward white for legibility on dark surfaces):
```css
[data-theme="dark"]{
  --brand-red:       color-mix(in srgb, <color>, white 25%);
  --brand-red-deep:  color-mix(in srgb, <color>, white 20%);
  --brand-red-ink:   color-mix(in srgb, <color>, white 42%);
  --brand-red-soft:  color-mix(in srgb, <color>, transparent 82%);
  --shadow-focus:    0 0 0 3px color-mix(in srgb, <color>, transparent 70%);
}
```

**Graceful degradation:** `--brand-red` is a plain color, so it always applies.
On a browser without `color-mix` (pre-2023), the three derived declarations are
invalid and dropped, so those tokens fall back to the indigo defaults from
`tokens.css`. Acceptable for the rare custom-color-on-ancient-browser case; the
default (indigo) path never touches `color-mix` at all.

**Rejected alternative:** templating `tokens.css` via `resources.ExecuteAsTemplate`.
More DRY, but it makes even the default site depend on `color-mix` for its
shades and converts a static, cacheable asset into a per-build template. The
inline-override keeps the default path plain-hex and additive.

### B. New default palette (`tokens.css`)

Replace the pink family with hand-tuned indigo. Also replace the two hardcoded
pink `rgba()`s in this file (light `--shadow-focus`, dark `--brand-red-soft`).

| Token | Light (current → new) | Dark (current → new) |
|-------|----------------------|----------------------|
| `--brand-red` | `#F14D6C` → `#6366F1` | `#FF6B84` → `#8A8CF4` |
| `--brand-red-deep` | `#EF4D6A` → `#5457EA` | `#FF5F7A` → `#7E80F2` |
| `--brand-red-ink` | `#C93955` → `#4F46E5` | `#FF8FA3` → `#A5A7F7` |
| `--brand-red-soft` | `#FDE3E8` → `#E7E9FE` | `rgba(241,77,108,.15)` → `rgba(99,102,241,.15)` |
| `--shadow-focus` | `rgba(241,77,108,.25)` → `rgba(99,102,241,.25)` | `rgba(255,107,132,.3)` → `rgba(138,140,244,.3)` |

(Exact hexes final-tuned during implementation; the ramp follows the
Tailwind-style indigo scale for harmony.)

### C. Long-tail default swap (static)

Flip hardcoded pink → indigo so the shipped default is coherent. Mapping:

| Pink | Indigo |
|------|--------|
| `#F14D6C` | `#6366F1` |
| `#FDE3E8` | `#E7E9FE` |
| `#C93955` | `#4F46E5` |
| `#FF6B84` | `#8A8CF4` |
| `#FF8FA3` | `#A5A7F7` |
| `#FF5F7A` | `#7E80F2` |
| `241,77,108` | `99,102,241` |

Files:
- `static/img/logo.svg` — `p!` mark fill `#F14D6C` → `#6366F1`.
- `themes/pouet/assets/js/mermaid-init.js` — all pink hexes/rgba in the light and
  dark theme blocks, per the mapping.
- `themes/pouet/layouts/partials/og-card.html` — meta-line text `#FF6B84` →
  `#8A8CF4` (drawn on a dark base image, so the bright/dark-mode indigo).
- `themes/pouet/assets/js/egg.js` — console banner `#F14D6C` → `#6366F1`.
- `themes/pouet/assets/js/animations.js` — hero canvas `lineRGB` `'241,77,108'`
  → `'99,102,241'`.
- `themes/pouet/assets/css/site.css` — `.term .crit` / `.term .cve` `#FF8FA3` →
  `#A5A7F7`. Kept hardcoded (not tokenized) to preserve their role as a bright
  accent legible on the dark-styled terminal, in both site themes.

### D. Config + docs

- `hugo.toml` — add a commented `brandColor` example under `[params]`, noting the
  built-in default is indigo and that unset = default.
- `docs/configuration.md` — add `brandColor` to the `[params]` table.
- `docs/theming.md` — short "change the brand color" note (set `brandColor`;
  shades are auto-derived; long-tail assets are static).

## Error handling / edge cases

- `brandColor` unset → indigo defaults, no inline style, no `color-mix` dependency.
- Any CSS color value accepted (hex, `rgb()`, named). Hugo does no validation;
  an invalid value simply produces an inert `--brand-red` (documented caveat).
- Setting `brandColor` to exactly `#6366F1` yields `color-mix`-derived shades
  that differ imperceptibly from the hand-tuned defaults — a known, negligible
  non-issue.

## Testing / verification

- `hugo` builds clean with no `brandColor`, and with `brandColor = "#6366F1"` and
  a contrasting value (e.g. `#12B5A5`).
- Manual check in browser (light + dark): nav/buttons/links/chips/focus ring
  retint; logo, a mermaid diagram, and an OG card render indigo by default.
- Grep confirms no stray pink hex (`F14D6C`, `EF4D6A`, `C93955`, `FDE3E8`,
  `FF6B84`, `FF5F7A`, `FF8FA3`, `241,77,108`) remains in theme assets.

## Files touched

`tokens.css`, `head.html`, `site.css`, `hugo.toml`, `static/img/logo.svg`,
`mermaid-init.js`, `og-card.html`, `egg.js`, `animations.js`,
`docs/configuration.md`, `docs/theming.md`.
