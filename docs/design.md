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
- **Security-blog flavor kept.** The CVE tracker, disclosure footer line, and appsec placeholder copy stay: they are the template's niche. Everything is editable text or deletable pages for people who want a plain tech blog.
- **Dual layouts kept** (`layouts/page/` + `layouts/_default/`) for the 0.139-to-current compatibility window, along with the pre-0.158 language config keys. See [deployment.md](deployment.md).
- **JS globals renamed** (`__pouet*`, `pouetFuzzy`, `pouetIndex`) - purely cosmetic consistency; the code is the source blog's.
- **No CMS, no comments, no external search.** The palette index is built by Hugo; adding a service is left to the user.
- **Sample content is disposable by design**: two posts per language exercising every feature, two famous public CVEs as tracker examples, one generated placeholder PDF. Deleting all of it is step one of adoption.

## Supply chain

CI builds with both the oldest supported and the latest Hugo. Releases attach SLSA Build L3 provenance via the slsa-github-generator reusable workflow, OpenSSF Scorecard runs weekly, and Dependabot watches the actions and npm pins. GSAP is vendored; mermaid and pdf.js are CDN-loaded at pinned versions on the pages that need them.
