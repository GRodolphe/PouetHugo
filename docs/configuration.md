# Configuration reference

Everything lives in `hugo.toml`. This page lists each key and where it surfaces in the UI.

## Top level

| Key | Effect |
|---|---|
| `baseURL` | Canonical URLs, RSS links, sitemap. Overridden at build time by `build.js` on Cloudflare Pages |
| `title` | Browser title and the brand mark rendered in the nav and footer |
| `theme` | Must stay `pouet` (the theme directory name) |
| `defaultContentLanguage` | Which language lives at `/` (the other gets a prefix, e.g. `/fr/`) |
| `enableRobotsTXT` | Serves the theme's `robots.txt` |

## Outputs

```toml
[outputs]
home = ["html", "rss", "json"]
```

The `json` output is the search index (`/index.json`, one per language) consumed by the command palette and the link-preview popovers. Removing it disables both features gracefully.

## `[params]`

| Key | Effect |
|---|---|
| `subtitle` | Home page `<title>` suffix |
| `description` | Meta description fallback for pages without their own |
| `logo` | SVG used for the nav/footer brand mark; also the favicon and about-page portrait defaults |
| `favicon` | Favicon path |
| `brandSuffix` | The accent glyph after the brand name (default `!`) |
| `brandColor` | Optional. Base/brand color for the whole UI. Unset = built-in indigo `#6366F1`. Any CSS color; deep/ink/soft and dark variants are auto-derived. Retints CSS only - logo/diagram/OG-card assets are static (see [theming.md](theming.md)) |

## `[params.author]`

| Key | Effect |
|---|---|
| `name` | `<meta name="author">`, archetype default byline |
| `handle` | Terminal prompt on the home page (`handle@local`), copyright line |
| `email` | Footer contact + about page |
| `github` | Footer "elsewhere" link + about page. Remove the key to hide both |
| `linkedin` | About page link (LinkedIn slug, not URL). Remove to hide |
| `avatar` | About-page portrait. Defaults to `params.logo` |
| `website` | Author URL in the JSON-LD structured data (Person / article author) |

## Languages and menus

Each `[languages.<code>]` block carries its own `contentDir`, `params` (subtitle/description), and `menu.main`. Menu entries support a per-item tooltip shown by the cursor-tooltip feature:

```toml
[[languages.en.menu.main]]
  name = "Posts"
  url = "/posts/"
  weight = 2
  [languages.en.menu.main.params]
    tooltip = "ls ./posts"
```

Add/remove menu entries freely; the footer site map ranges over the same menu. See [i18n.md](i18n.md) for adding or removing whole languages.

Any menu item can be hidden without deleting its block by setting `enabled = false` in its params:

```toml
[[languages.en.menu.main]]
  name = "CVE"
  url = "/cves/"
  weight = 4
  [languages.en.menu.main.params]
    enabled = false   # omit or true = shown
```

Disabled items disappear from both the top nav and the footer. To remove the CVE feature entirely: set its menu item `enabled = false` (or delete the block), then delete `content/en/cves.md`, `content/fr/cves.md`, and `data/cves.yaml`.

The template intentionally keeps the pre-0.158 keys `languageCode`/`languageName` (instead of `locale`/`label`) so the same config builds on Hugo 0.139, which some hosts still pin. Recent Hugo versions print deprecation warnings for them; that is expected. See [deployment.md](deployment.md).

## Markup

```toml
[markup.goldmark.renderer]
unsafe = true
```

Raw HTML in markdown is allowed - the hero/about i18n strings use `<span>` accents, and writeups often need `<details>` or `<kbd>`. Turn it off only if untrusted people can commit content.

```toml
[markup.highlight]
noClasses = false
```

Syntax highlighting emits CSS classes styled by the theme's `syntax.css` (Catppuccin Mocha). The `style` key is a fallback and does not affect what you see; to change colors, swap `syntax.css` (see [theming.md](theming.md)).

## Taxonomies

`tags` and `categories`. The post-type chip (writeup, tool, essay...) is the plain `postKind` frontmatter field, not a taxonomy - it's a label, not a browsable index. Note: it's `postKind` rather than `kind` because `kind` is a reserved frontmatter key in Hugo ≥ 0.144.

## i18n strings

All UI copy - navigation labels, the homepage hero, the about page, footer, tooltips, palette strings, and the console easter egg (`egg_message`) - lives in `i18n/en.toml` and `i18n/fr.toml`, grouped by commented sections. Strings may contain HTML (rendered with `safeHTML` where the layouts expect it).
