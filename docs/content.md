# Content guide

## Posts

Posts live under `content/en/posts/` and `content/fr/posts/`. Two shapes:

- **Page bundle** (recommended): a folder with an `index.md` and its images. Images are referenced by filename only (`![caption](diagram.svg)`), and they travel with the post.
- **Single file**: a plain `my-post.md` for image-less notes.

Translations are paired by path: `content/en/posts/my-post/` and `content/fr/posts/my-post/` are the same post in Hugo's eyes, which is what powers the language switch and hreflang tags. A post that exists in only one language simply doesn't offer the switch.

```bash
hugo new content/en/posts/my-post/index.md
```

### Frontmatter

The archetype (`themes/pouet/archetypes/default.md`) pre-fills everything:

| Field | Type | Effect |
|---|---|---|
| `title` | string | Everywhere |
| `date` | date | Sorting, byline, archives grouping |
| `draft` | bool | Hidden unless `hugo server -D` |
| `author` | string | Byline on the post page |
| `description` | string | List blurbs, meta description, search index |
| `tags` | list | Chips on lists, `/tags/` taxonomy pages, palette search |
| `postKind` | string | Post-type chip: `writeup`, `tool`, `essay`, `guide`... free-form |
| `cve` | string | CVE chip (brand color) next to the title and in the home terminal |
| `noindex` | bool | Adds `<meta name="robots" content="noindex, nofollow">`, excludes from the search index |
| `ogimage` | string | Filename of a bundle image to use as the social card instead of the generated one |

`postKind` is deliberately not named `kind`: that key is reserved by Hugo ≥ 0.144.

### Inside a post

- ` ```language ` fences get Catppuccin Mocha highlighting. Every fence should have a language tag.
- ` ```mermaid ` fences render as diagrams client-side and re-theme with dark mode.
- Images get a click-to-zoom overlay automatically.
- Internal links to other posts get hover preview cards.

The sample post `content/en/posts/writing-posts/` demonstrates all of it.

## Fixed pages

Each fixed page is a small content file selecting a layout; the layout does the work.

### About - `content/*/about.md`

The layout renders `params.author` (handle, github, linkedin, avatar) and the `about_*` i18n strings. To change the text, edit `i18n/*.toml`, not the layout.

### Archives - `content/*/archives.md`

All posts grouped by year with jump links and totals. No configuration.

### CVE tracker - `content/*/cves.md` + `data/cves.yaml`

```yaml
- id: "CVE-2021-44228"
  description: "Log4Shell: ..."
  date: "2021-12-10"     # publication date, newest first on the page
  cwe: "CWE-502"
  cvss: 10.0             # number; drives the severity chip
  nist: "https://www.cve.org/CVERecord?id=CVE-2021-44228"
```

### Slides - `content/*/slides.md` + `data/slides.yaml` + `static/slides/*.pdf`

```yaml
- title: "My talk"
  description: "One-liner shown on the card."
  date: "2026-07-20"
  kind: "talk"           # talk | rump | lecture... free-form, drives the filter
  lang: "en"             # en | fr, drives the filter
  file: "my-talk.pdf"    # filename under static/slides/
```

Decks render in an inline pdf.js viewer (loaded from jsdelivr at view time).

### Links - `content/*/links.md`

The links are frontmatter on the page itself:

```yaml
links:
  - title: "Hugo documentation"
    url: "https://gohugo.io/documentation/"
    description: "..."
    tags: ["reference", "hugo"]   # filter chips; multi-select with any/all modes
    date: 2026-07-20              # sort order
```

### Pouet - `content/en/pouet.md`

An unlisted easter-egg page (`noindex`, excluded from lists and sitemap) with a GSAP letter animation. Keep it, repurpose it, or delete it.

## Writing conventions the theme rewards

- Put a `description` on every post; every list and the search index use it.
- Use blockquotes for TL;DR blocks at the top of writeups.
- Annotate taint traces in code blocks with `SOURCE` / `PROPAGATION` / `SINK` comments.
- Short italic captions right under images.

The full voice and structure conventions, including a section-by-section template for security writeups, are in the [writing guide](writing-guide.md).
