# Features

Where each feature lives and how to customize or disable it. All JS is vanilla (ES5-safe where it matters), loaded `defer`, and initialized idempotently - safe with view transitions and back/forward cache.

## Command palette

`themes/pouet/assets/js/palette.js`, `fuzzy.js`, `index-client.js`, `layouts/partials/palette.html`, `layouts/index.json`

Ctrl+K / Cmd+K (or the `>_` nav button) opens a fuzzy search over a build-time JSON index of all posts and pages, generated per language by the `json` home output. Below the results: commands (toggle theme, switch language). Strings under `# Command palette` in `i18n/*.toml`.

- The fuzzy matcher is scored (word-start and consecutive-run bonuses) and covered by `tests/fuzzy.test.mjs`.
- Disable: remove the `json` output from `hugo.toml` (the palette shows "index unavailable") or remove the button and script includes from `nav.html`/`baseof.html`.

## Hover preview cards

`themes/pouet/assets/js/popovers.js`

Internal links inside post bodies get a preview card (title, date, blurb) on hover, resolved from the same JSON index. Pointer-leave races are handled; touch devices are unaffected.

## View transitions and theme wipe

`themes/pouet/layouts/_default/baseof.html` (inline script), CSS in `site.css`

Cross-page navigations use the View Transitions API where supported. The theme toggle plays a circular wipe from the button. Both are skipped when `document.startViewTransition` is missing or the visitor prefers reduced motion; double-clicks during a wipe are guarded.

## Dark / light mode

Inline script in `head.html` (pre-paint, no flash) + toggle in `nav.html`

Persisted in `localStorage`, defaults to the system preference. Sets `data-theme` on `<html>`; everything themes off CSS custom properties, and mermaid diagrams re-render with a matching palette.

## Animations

`themes/pouet/assets/js/animations.js` + bundled GSAP/ScrollTrigger in `assets/js/vendor/`

Scroll reveals and hero staggers keyed off `data-animate` attributes; a pixel-canvas background on the pages listed in `$bgPages` (in `baseof.html`); the hero animation plays once per session. Everything is gated on the `js-motion` class, which is only added when the visitor does not prefer reduced motion.

- Disable all motion: remove the GSAP/animations script tags from `baseof.html`. The site is fully functional without them.

## Image zoom

`themes/pouet/assets/js/zoom.js`, `layouts/_default/_markup/render-image.html`

Every content image opens in a fullscreen overlay on click. Esc or click closes.

## Mermaid diagrams

`themes/pouet/assets/js/mermaid-init.js`, `layouts/partials/mermaid.html`

` ```mermaid ` fences are rendered client-side. Mermaid (v11) is imported from jsdelivr **only on pages that contain a diagram**, with light and dark theme variants that follow the site theme live. Self-hosting: download the ESM build, drop it under `assets/js/vendor/`, and change the import in `mermaid-init.js`.

## Slides viewer

`layouts/partials/slides/main.html` + `slides/scripts.html`

The slides page renders `data/slides.yaml` as filterable cards; clicking one opens an inline pdf.js viewer (pdf.js from jsdelivr, loaded on demand).

## Cursor tooltips

`themes/pouet/assets/js/tooltip.js`

Elements with a `data-tooltip` attribute get a terminal-style cursor tooltip. Menu entries define theirs in `hugo.toml` (`menu.main.params.tooltip`); buttons use i18n strings.

## Reading progress

The thin bar under the nav (`#reading-progress`) tracks scroll position on post pages.

## Console easter egg

`themes/pouet/assets/js/egg.js`

Prints an ASCII banner and the `egg_message` i18n string to the console, once per session. Empty `egg_message` = disabled.

## Social cards (og:image)

`layouts/partials/og-card.html`, `assets/img/og-base.png`, `assets/fonts/JetBrainsMono-*.ttf`

Every page gets a 1200x630 social card generated at build time: the title (wrapped, max 4 lines), date and site title, and the domain from `baseURL` drawn onto `og-base.png` with `images.Text`. A post can override it with `ogimage: "my-card.png"` frontmatter pointing at a bundle image.

One gotcha, documented in the partial itself: don't add `images` frontmatter or bundle images matching Hugo's cover/feature/thumbnail patterns, or Hugo's internal opengraph template will emit a second `og:image` alongside the generated one.

## Structured data (JSON-LD)

`layouts/partials/jsonld.html`

Emits `WebSite` on the home pages, `BlogPosting` (with author, keywords, and the social-card image) on posts, and `Person` (from `params.author`) on the about pages. Nothing on other pages.

## RSS + SEO

- RSS per language at `/index.xml` and `/fr/index.xml`.
- Canonical URLs, `hreflang` alternates, `x-default`, OpenGraph tags, `robots.txt`, sitemap, custom 404 (per language).
- `noindex: true` frontmatter opts a page out of indexing and the search index.

## Analytics

Off by default. Setting `params.measuredSiteId` loads the measured.site script in production builds only (`hugo.IsProduction`), so local dev never ships it.

## External network calls, summarized

For CSP writers and the privacy-conscious, the full list of runtime origins: Google Fonts (stylesheet + fonts), jsdelivr (mermaid, pdf.js - only on pages that use them), and measured.site (only if you opt in). GSAP is bundled, not fetched.
