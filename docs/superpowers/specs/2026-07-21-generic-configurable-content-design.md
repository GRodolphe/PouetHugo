# Design: Generic, configurable template content & navigation

Date: 2026-07-21
Status: Draft — pending user review

## Goal

Turn the site's appsec-researcher persona into a **neutral, brandable template**:

1. Replace persona-specific copy with generic technical-blog copy, in **EN + FR**.
2. Keep copy **customisable** where it belongs — genericized, well-commented
   `i18n/*.toml` strings (the idiomatic Hugo home for translatable copy).
3. Make **each nav menu item enable/disable-able** from config.
4. Make the **CVE section** optional (toggle + genericized copy).

Decisions taken during brainstorming (user away; proceeded on recommended
options — open to change at review): full sweep · i18n mechanism · CVE
toggleable+genericized · per-item menu flag.

## Findings (current state) — verified against built output

- **Copy lives in `i18n/en.toml` + `i18n/fr.toml`** and is consumed by the
  layouts via `{{ i18n "…" }}`. The persona runs through: `hero_status/eyebrow/
  title/body`, all `about_*`, `footer_tagline`, `footer_disclosure`,
  `footer_built` (literally "quiet red accents"), `posts_lede`,
  `cve_eyebrow/hero/lede`, `links_lede`.
- **Active layouts are `_default/*.html`.** Verified: the built EN about page
  contains `I'm` (straight apostrophe) — only producible by `{{ i18n "about_lede" }}`
  — not `page/about.html`'s literal `I&rsquo;m`; and the FR about page renders
  French (`casse du logiciel`), which only the i18n path can produce. The
  `_default/*` layouts are correctly i18n-driven and **bilingual already works**.
  (My initial "About is English-only" read was wrong.)
- **`themes/pouet/layouts/page/*.html` is a DEAD duplicate directory.** Some files
  are byte-identical to `_default/*` (`links`, `slides`, `pouet`); others are
  stale — `page/about.html` and `page/cves.html` hardcode the old English persona
  copy, `page/single.html` is a 3-line stub, `page/archives.html` diverges too.
  None of them render. They are template cruft carrying stale persona text.
- **Home terminal** (`index.html`, active): path `~/research/{{ now.Year }}` and
  host `{{ handle }}@lab` are persona flavor (literal, not i18n).
- **Menus** defined in `hugo.toml` (`[[languages.<lang>.menu.main]]`), rendered in
  two places: `partials/nav/menu-links.html` and `partials/footer.html`, both via
  `{{ range .Site.Menus.main }}`.
- **CVE** is data-driven: `data/cves.yaml` (two famous public CVEs, already
  labelled "replace with your own"), content stubs `content/*/cves.md`, active
  layout `_default/cves.html` (i18n), and `cve_*` strings.
- **Keep as-is:** `egg_message` (the template's own attribution, not persona),
  tooltip strings, structural UI strings.

## Approach

### A. Genericize copy (`i18n/en.toml` + `i18n/fr.toml`)

Rewrite persona keys to neutral, brandable copy — a generic "technical writer /
maker" voice, tasteful but placeholder-obvious so a new owner edits with
confidence. Because the active layouts already read i18n, **editing the strings
retints every active page in both languages.** Keys changed (both languages):
`posts_lede`, `cve_eyebrow`, `cve_hero`, `cve_lede`, all `about_*`,
`footer_tagline`, `footer_disclosure`, `footer_built`, `hero_status`,
`hero_eyebrow`, `hero_title`, `hero_body`, `links_lede`. Structural/keep keys
untouched.

Direction (EN samples — exact final strings, EN + FR, land in the plan):

| Key | From | To (draft) |
|-----|------|-----------|
| `hero_status` | currently · reading CVEs with coffee | currently · writing something new |
| `hero_eyebrow` | application security · independent research | writing · projects · notes |
| `hero_body` | An appsec engineer's notebook. … how modern software actually breaks. | A notebook for technical writing. Here I publish articles, share small projects, and think out loud about what I'm working on. |
| `about_lede` | I'm an application-security engineer… | I'm a developer and writer. This is where I publish articles, share projects, and keep notes on what I'm learning. |
| `footer_tagline` | Application security research, writeups, and small tools. | Articles, projects, and notes. |
| `footer_built` | built with hugo and quiet red accents | built with hugo |

FR mirrors EN in tone. `<span class="pixel">`/`<span class="serif">` accent
markup is preserved in `hero_title` (rendered `safeHTML`).

### B. Remove the dead `page/*` duplicate layouts (cleanup)

The active `_default/*` layouts already use i18n, so section A is sufficient for
rendered output. But `page/*` still holds stale hardcoded persona English in dead
files, which a template user could edit by mistake and which trips a persona
grep. **Delete `themes/pouet/layouts/page/`**, gated by a hard safety check:
build → snapshot `public/` → delete → rebuild → assert `public/` byte-identical.
If anything differs, restore and keep only the copy edits. (Clearly separable —
easy to drop from scope at review.)

### C. De-persona the home terminal (`index.html`)

- `~/research/{{ now.Year }}` → neutral `~/{{ now.Year }}`.
- `{{ handle }}@lab` host → keep the handle, neutralize host to `@local`
  (two occurrences, lines 28 & 33). Kept static — not a new param (YAGNI).

### D. Per-item menu enable/disable

Support an `enabled` menu param. In `hugo.toml`, any item may carry:
```toml
[languages.en.menu.main.params]
  enabled = false   # omit or true = shown
```
Both renderers filter on it. Because Hugo's `default` treats `false` as empty,
the guard is explicit:
```go-html-template
{{ range .Site.Menus.main }}{{ if ne .Params.enabled false }}
  … existing link …
{{ end }}{{ end }}
```
(`enabled` unset → `nil ≠ false` → shown; `true` → shown; `false` → hidden.)
Applied in `partials/nav/menu-links.html` and `partials/footer.html`.

### E. CVE optional + genericized

- **Toggle:** covered by D — set `enabled = false` on the CVE menu item to remove
  it from nav/footer.
- **Copy:** genericize `cve_*` (drop first person → "tracked CVEs").
- **Full removal (documented, not a build flag):** delete `content/*/cves.md` +
  `data/cves.yaml` + the CVE menu block. Hugo-idiomatic; no bespoke
  section-disable logic (YAGNI). `data/cves.yaml` keeps its two famous public CVEs
  as ready-to-replace examples.

### F. Docs

- `docs/configuration.md`: document the menu `enabled` param; how to add / remove
  / disable menu items; CVE removal steps.
- `docs/features.md` / `docs/content.md`: adjust persona references; note CVE is
  optional; note layouts live in `_default/` (after page/* removal).
- `docs/writing-guide.md`: only if it quotes the persona copy directly.

## Non-goals / YAGNI

- No new params for the terminal path/host (neutral static defaults).
- No build-time "section disable" engine — content/data removal + menu toggle.
- No promoting copy to `hugo.toml` params (idiomatic i18n instead).

## Testing / verification

- `hugo` builds clean; `hugo server` shows neutral copy on home, about (EN **and**
  FR), footer, CVE.
- Set `enabled = false` on a menu item → gone from both nav bar and footer, both
  languages; site still builds.
- `page/*` deletion: `public/` byte-identical before vs after (safety gate).
- Grep shows no residual persona terms anywhere in the repo (theme, layouts,
  i18n, content): `appsec`, `application-security`, `vulnerabilit`,
  `reachability`, `disclosure`, `red accents` / `accents rouges`, `@lab`,
  `~/research`.

## Files touched

`i18n/en.toml`, `i18n/fr.toml`, `themes/pouet/layouts/index.html`,
`themes/pouet/layouts/partials/nav/menu-links.html`,
`themes/pouet/layouts/partials/footer.html`, `hugo.toml` (menu param example),
delete `themes/pouet/layouts/page/` (gated), `docs/configuration.md`,
`docs/features.md`/`docs/content.md`.

## Relationship to the brand-color work

Independent of, but complementary to,
`2026-07-21-configurable-brand-color-design.md`. `footer_built`'s "red accents"
line is corrected here as part of the copy sweep. Both ship together in one
implementation pass once specs are approved.
