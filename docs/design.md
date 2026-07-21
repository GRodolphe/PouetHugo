# Design notes

Why the template is the way it is. Useful when deciding what to keep, and a map of every seam where the original blog's identity was cut out.

## Origin

PouetHugo is extracted from a production security blog (bilingual EN/FR, Cloudflare Pages, custom theme). The extraction goal: keep every feature and the visual identity, remove every trace of the person, and make each personalization point a documented config knob instead of an edit-the-template chore.

## What was parameterized

| Was hardcoded | Now |
|---|---|
| Brand mark text in nav/footer | `title` + `params.brandSuffix` |
| Logo/favicon/portrait image paths | `params.logo`, `params.favicon`, `params.author.avatar` |
| LinkedIn link in the about layout | `params.author.linkedin` (hidden when absent) |
| Terminal prompt (`user@local`) on the home page | `params.author.handle` |
| Console easter-egg message (had email + GitHub URL in JS) | `egg_message` i18n string, injected via a meta tag |
| Author name in the archetype | `site.Params.author.name` |

The hero and about-page copy was already i18n strings; it was de-personalized into plausible placeholder text rather than lorem ipsum, so the demo site reads like a real blog.

## Deliberate choices

- **`postKind`, not `kind`.** The source blog used `kind` frontmatter, which Hugo reserved in 0.144 - it hard-errors on modern Hugo. The rename is the one intentional behavioral divergence from the source.
- **Neutral, brandable defaults.** The hero, about, and footer copy ship as generic technical-writer placeholder text (i18n strings, EN + FR). The CVE tracker remains as an optional feature: any menu item can be hidden with `enabled = false`, and deleting `content/*/cves.md` + `data/cves.yaml` removes it entirely.
- **Single layout set** (`layouts/_default/`). The former `layouts/page/` duplicates were removed - unused on current Hugo, and on the oldest supported Hugo (0.139.4) they shadowed the maintained `_default/` layouts with stale hardcoded copy (rendering English on the French about page). Removal was verified to produce byte-identical output on both 0.139.4 and current Hugo. The pre-0.158 language config keys (`languageCode`/`languageName`) are still kept for the 0.139-to-current compatibility window. See [deployment.md](deployment.md).
- **JS globals renamed** (`__pouet*`, `pouetFuzzy`, `pouetIndex`) - purely cosmetic consistency; the code is the source blog's.
- **No CMS, no comments, no external search.** The palette index is built by Hugo; adding a service is left to the user.
- **Sample content is disposable by design**: two posts per language exercising every feature, two famous public CVEs as tracker examples, one generated placeholder PDF. Deleting all of it is step one of adoption.

## Supply chain

CI builds with both the oldest supported and the latest Hugo. Releases attach SLSA Build L3 provenance via the slsa-github-generator reusable workflow, OpenSSF Scorecard runs weekly, and Dependabot watches the actions and npm pins. GSAP is vendored; mermaid and pdf.js are CDN-loaded at pinned versions on the pages that need them.
