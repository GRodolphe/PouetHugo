# Configurable Brand Color Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the shipped brand color from pink-red to indigo `#6366F1`, and let a site owner retint the whole UI via a single `params.brandColor` Hugo param.

**Architecture:** The brand color lives in four CSS custom properties in `tokens.css`, consumed everywhere in `site.css` via `var(--brand-red*)`. We ship hand-tuned indigo defaults there (plain hex, no `color-mix`), add an additive inline `<style>` override in `head.html` that derives the family from `params.brandColor` via CSS `color-mix()` when set, and flip the hardcoded-pink "long tail" (logo SVG, mermaid, OG card, console, canvas, terminal accents) to indigo so the default ships coherent.

**Tech Stack:** Hugo (extended, pinned `0.164.0` in `node_modules`; system `hugo` also works), CSS custom properties + `color-mix()`, vanilla JS assets, TOML config.

## Global Constraints

- Default brand color is indigo `#6366F1`. Unset `brandColor` = this default, with **no `color-mix` dependency** on the default path.
- The param drives the **CSS UI only**. The long-tail assets are flipped to indigo statically but are **not** wired to the param.
- Indigo ramp (used verbatim everywhere below):
  - Light: base `#6366F1`, deep `#5457EA`, ink `#4F46E5`, soft `#E7E9FE`, focus `rgba(99,102,241,0.25)`
  - Dark: base `#8A8CF4`, deep `#7E80F2`, ink `#A5A7F7`, soft `rgba(99,102,241,0.15)`, focus `rgba(138,140,244,0.3)`
- Pink→indigo mapping for static swaps: `#F14D6C`→`#6366F1`, `#FDE3E8`→`#E7E9FE`, `#C93955`→`#4F46E5`, `#FF6B84`→`#8A8CF4`, `#FF8FA3`→`#A5A7F7`, `#FF5F7A`→`#7E80F2`, `241,77,108`→`99,102,241`.
- Each task ends by building the site clean (`hugo`) and committing.

---

### Task 1: New indigo defaults in `tokens.css`

**Files:**
- Modify: `themes/pouet/assets/css/tokens.css` (light block lines 8–11 + 76; dark block lines 113–116 + 156)

**Interfaces:**
- Consumes: nothing.
- Produces: the `--brand-red`, `--brand-red-deep`, `--brand-red-ink`, `--brand-red-soft`, and `--shadow-focus` tokens now resolve to indigo. All later tasks and all `var(--brand-red*)` consumers in `site.css` inherit this automatically.

- [ ] **Step 1: Edit the light-theme brand block**

In `themes/pouet/assets/css/tokens.css`, replace lines 8–11:
```css
  --brand-red:       #F14D6C;
  --brand-red-deep:  #EF4D6A;
  --brand-red-ink:   #C93955;
  --brand-red-soft:  #FDE3E8;
```
with:
```css
  --brand-red:       #6366F1;
  --brand-red-deep:  #5457EA;
  --brand-red-ink:   #4F46E5;
  --brand-red-soft:  #E7E9FE;
```

- [ ] **Step 2: Edit the light-theme focus ring**

Replace line 76:
```css
  --shadow-focus: 0 0 0 3px rgba(241,77,108,0.25);
```
with:
```css
  --shadow-focus: 0 0 0 3px rgba(99,102,241,0.25);
```

- [ ] **Step 3: Edit the dark-theme brand block**

Replace lines 113–116:
```css
  --brand-red:       #FF6B84;
  --brand-red-deep:  #FF5F7A;
  --brand-red-ink:   #FF8FA3;
  --brand-red-soft:  rgba(241, 77, 108, 0.15);
```
with:
```css
  --brand-red:       #8A8CF4;
  --brand-red-deep:  #7E80F2;
  --brand-red-ink:   #A5A7F7;
  --brand-red-soft:  rgba(99, 102, 241, 0.15);
```

- [ ] **Step 4: Edit the dark-theme focus ring**

Replace line 156:
```css
  --shadow-focus: 0 0 0 3px rgba(255, 107, 132, 0.3);
```
with:
```css
  --shadow-focus: 0 0 0 3px rgba(138, 140, 244, 0.3);
```

- [ ] **Step 5: Verify no pink remains in `tokens.css`**

Run: `grep -nE "F14D6C|EF4D6A|C93955|FDE3E8|FF6B84|FF5F7A|FF8FA3|241, ?77, ?108|255, ?107, ?132" themes/pouet/assets/css/tokens.css`
Expected: no output (exit code 1).

- [ ] **Step 6: Build the site clean**

Run: `hugo --gc --minify`
Expected: exits 0, no ERROR/WARN lines about the theme.

- [ ] **Step 7: Commit**

```bash
git add themes/pouet/assets/css/tokens.css
git commit -m "feat: default brand tokens to indigo"
```

---

### Task 2: Configurable `params.brandColor` (override + config + docs)

**Files:**
- Modify: `themes/pouet/layouts/partials/head.html` (after the three stylesheet `<link>`s, ~line 24)
- Modify: `hugo.toml` (`[params]` block, after `brandSuffix`, ~line 28)
- Modify: `docs/configuration.md` (`[params]` table, ~line 32)
- Modify: `docs/theming.md` (Brand bullet, ~line 8)

**Interfaces:**
- Consumes: the `--brand-red*` tokens from Task 1.
- Produces: `.Site.Params.brandColor` (string, any CSS color; unset by default). When set, overrides the four brand tokens + focus ring in both themes.

- [ ] **Step 1: Add the inline override to `head.html`**

In `themes/pouet/layouts/partials/head.html`, immediately after the line:
```html
<link rel="stylesheet" href="{{ $syntax.RelPermalink }}">
```
insert:
```html
{{ with .Site.Params.brandColor }}{{ $c := . | safeCSS }}
<style>
:root{
  --brand-red: {{ $c }};
  --brand-red-deep: color-mix(in srgb, {{ $c }}, black 4%);
  --brand-red-ink: color-mix(in srgb, {{ $c }}, black 18%);
  --brand-red-soft: color-mix(in srgb, {{ $c }}, white 88%);
  --shadow-focus: 0 0 0 3px color-mix(in srgb, {{ $c }}, transparent 75%);
}
[data-theme="dark"]{
  --brand-red: color-mix(in srgb, {{ $c }}, white 25%);
  --brand-red-deep: color-mix(in srgb, {{ $c }}, white 20%);
  --brand-red-ink: color-mix(in srgb, {{ $c }}, white 42%);
  --brand-red-soft: color-mix(in srgb, {{ $c }}, transparent 85%);
  --shadow-focus: 0 0 0 3px color-mix(in srgb, {{ $c }}, transparent 70%);
}
</style>
{{ end }}
```

- [ ] **Step 2: Document the param in `hugo.toml`**

In `hugo.toml`, after the `brandSuffix = "!"` line (~line 28), insert:
```toml
# Brand/base color for the whole UI (links, buttons, chips, focus rings).
# Unset = the built-in indigo default. Any CSS color works; deep/ink/soft
# shades and the dark-mode variant are derived automatically via color-mix.
# brandColor = "#6366F1"
```

- [ ] **Step 3: Add `brandColor` to the configuration docs table**

In `docs/configuration.md`, in the `[params]` table, add a row after the `brandSuffix` row:
```markdown
| `brandColor` | Optional. Base/brand color for the whole UI. Unset = built-in indigo `#6366F1`. Any CSS color; deep/ink/soft and dark variants are auto-derived. Retints CSS only — logo/diagram/OG-card assets are static (see [theming.md](theming.md)) |
```

- [ ] **Step 4: Correct the Brand bullet in `docs/theming.md`**

In `docs/theming.md`, replace the Brand bullet (~line 8):
```markdown
- **Brand**: `--brand-red` (#F14D6C) and its deep/ink/soft variants. Change these four and the whole site follows - chips, links, buttons, the wipe, the logo accent.
```
with:
```markdown
- **Brand**: `--brand-red` (#6366F1, indigo) and its deep/ink/soft variants. Change these four and the CSS UI follows - chips, links, buttons, the wipe. To retint without editing CSS, set `brandColor` in `hugo.toml` (see [configuration.md](configuration.md)); the shades and dark-mode variant are derived from it. The logo (`static/img/logo.svg`), mermaid diagrams (`mermaid-init.js`), and OG cards (`og-card.html`) carry the color as static values - edit those files to match a custom brand.
```

- [ ] **Step 5: Verify the default path emits NO override**

Run: `hugo --gc --minify && grep -rl "color-mix" public/ | head`
Expected: no output — with `brandColor` unset, no inline override is rendered.

- [ ] **Step 6: Verify the override renders when the param is set**

Run:
```bash
hugo --gc --minify -p params.brandColor="#12B5A5" && grep -rl "color-mix(in srgb" public/*.html | head
```
Expected: at least one file listed (the home page HTML contains the inline override). Then restore a clean default build: `hugo --gc --minify`.

- [ ] **Step 7: Commit**

```bash
git add themes/pouet/layouts/partials/head.html hugo.toml docs/configuration.md docs/theming.md
git commit -m "feat: add configurable brandColor param"
```

---

### Task 3: Flip the hardcoded-pink long tail to indigo

**Files:**
- Modify: `static/img/logo.svg` (line 2)
- Modify: `themes/pouet/assets/js/mermaid-init.js` (lines 20–119, per inventory)
- Modify: `themes/pouet/layouts/partials/og-card.html` (line 50)
- Modify: `themes/pouet/assets/js/egg.js` (line 24)
- Modify: `themes/pouet/assets/js/animations.js` (line 250)
- Modify: `themes/pouet/assets/css/site.css` (lines 574, 577)

**Interfaces:**
- Consumes: the pink→indigo mapping in Global Constraints.
- Produces: no code interface; makes the shipped default visually coherent.

- [ ] **Step 1: Logo SVG**

In `static/img/logo.svg` line 2, change `fill="#F14D6C"` to `fill="#6366F1"`.

- [ ] **Step 2: Mermaid light theme block**

In `themes/pouet/assets/js/mermaid-init.js`, apply the mapping to the light block (lines 20–64): every `#FDE3E8`→`#E7E9FE`, `#F14D6C`→`#6366F1`, `#C93955`→`#4F46E5`. Affected lines: 20, 22, 31, 32, 47, 48, 50, 53, 54, 57, 58, 59, 62, 63, 64.

- [ ] **Step 3: Mermaid dark theme block**

In the same file, dark block (lines 75–119): every `rgba(241,77,108,0.15)`→`rgba(99,102,241,0.15)`, `#FF6B84`→`#8A8CF4`, `#FF8FA3`→`#A5A7F7`. Affected lines: 75, 77, 86, 87, 102, 103, 105, 108, 109, 112, 113, 114, 117, 118, 119.

- [ ] **Step 4: OG card meta-line color**

In `themes/pouet/layouts/partials/og-card.html` line 50, change `"color" "#FF6B84"` to `"color" "#8A8CF4"`.

- [ ] **Step 5: Console banner**

In `themes/pouet/assets/js/egg.js` line 24, change `color:#F14D6C` to `color:#6366F1`.

- [ ] **Step 6: Hero canvas line**

In `themes/pouet/assets/js/animations.js` line 250, change `var lineRGB = '241,77,108';` to `var lineRGB = '99,102,241';`.

- [ ] **Step 7: Terminal crit/cve accents**

In `themes/pouet/assets/css/site.css`, change line 574 `.term .crit   { color: #FF8FA3; font-weight: 600; }` and line 577 `.term .cve    { color: #FF8FA3; }` — both `#FF8FA3`→`#A5A7F7`.

- [ ] **Step 8: Verify no legacy pink remains in theme or static assets**

Run: `grep -rnE "F14D6C|EF4D6A|C93955|FDE3E8|FF6B84|FF5F7A|FF8FA3|241, ?77, ?108|255, ?107, ?132" themes/ static/`
Expected: no output (exit code 1).

- [ ] **Step 9: Build the site clean**

Run: `hugo --gc --minify`
Expected: exits 0, no theme ERROR/WARN.

- [ ] **Step 10: Commit**

```bash
git add static/img/logo.svg themes/pouet/assets/js/mermaid-init.js themes/pouet/layouts/partials/og-card.html themes/pouet/assets/js/egg.js themes/pouet/assets/js/animations.js themes/pouet/assets/css/site.css
git commit -m "feat: flip long-tail brand assets to indigo"
```

---

## Final verification (after all tasks)

- [ ] `hugo server` and eyeball the home page in **light and dark**: nav/buttons/links/chips/focus ring are indigo; the `p!` logo is indigo; a page with a mermaid diagram renders indigo; a post's OG card (`public/.../*.png`) shows the indigo meta line.
- [ ] Set `brandColor = "#12B5A5"` in `hugo.toml`, reload: the whole UI retints teal, shades derived. Revert.
- [ ] `grep -rnE "F14D6C|EF4D6A|C93955|FDE3E8|FF6B84|FF5F7A|FF8FA3|241, ?77, ?108|255, ?107, ?132" themes/ static/` → no output.

## Self-Review

- **Spec coverage:** §A param → Task 2. §B defaults → Task 1. §C long tail → Task 3. §D config/docs → Task 2 steps 2–4. Docs `theming.md` inaccuracy (found during planning) → Task 2 step 4. All covered.
- **Placeholder scan:** none — every step has exact paths, values, and commands.
- **Type consistency:** `brandColor` param name and the five override token names match `tokens.css` (Task 1) and `head.html` (Task 2). Indigo hexes identical across Global Constraints, Task 1, and Task 3.
