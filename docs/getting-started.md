# Getting started

## Prerequisites

- [Hugo extended](https://gohugo.io/installation/) ≥ 0.139 (the theme uses SCSS-free asset pipes, but `hugo-extended` is what CI and Cloudflare builds pin)
- Git
- Node.js LTS - optional; only needed for `build.js` (Cloudflare Pages) and `npm test`

## Create your site

On GitHub, click **Use this template** to get your own repository, then:

```bash
git clone https://github.com/<you>/<your-blog>.git
cd <your-blog>
hugo server -D        # drafts on, http://localhost:1313
```

You should see the demo site: two sample posts in each language, a CVE tracker with two famous CVEs, and one sample slide deck.

## Personalization checklist

Work top to bottom; each step is independent.

### 1. Site identity - `hugo.toml`

Every key is commented in the file itself; the full reference is in [configuration.md](configuration.md). The minimum:

```toml
baseURL = 'https://your-domain.example/'
title = "yourname"                    # this is the brand mark in the nav

[params.author]
name = "Your Name"
handle = "you"
email = "you@your-domain.example"
github = "your-github-handle"
```

### 2. Your voice - `i18n/en.toml` and `i18n/fr.toml`

The homepage hero, the entire about page, and the footer taglines are i18n strings, not hardcoded template text. The shipped copy is a plausible security-blog placeholder - rewrite it. The interesting groups are commented: `# Homepage`, `# About`, `# Footer`.

### 3. Logo - `static/img/logo.svg`

One SVG drives the nav, the footer, the favicon, and (by default) the about-page portrait. Replace it. If you want a different about-page portrait, set `params.author.avatar` (see [configuration.md](configuration.md)).

### 4. Content

```bash
# delete the samples
rm -r content/en/posts/writing-posts content/fr/posts/writing-posts
rm content/en/posts/hello-pouet.md content/fr/posts/hello-pouet.md

# write your first post (a page bundle: folder + index.md + images)
hugo new content/en/posts/my-first-post/index.md
```

The archetype pre-fills the frontmatter. Everything a post can do is demonstrated in the sample post before you delete it, and documented in [content.md](content.md).

### 5. The extra pages

- `/cves/` - edit `data/cves.yaml` (or empty the list)
- `/slides/` - drop PDFs in `static/slides/` and list them in `data/slides.yaml`
- `/links/` - edit the `links:` frontmatter in `content/*/links.md`
- `/pouet/` - an unlisted easter-egg page; delete `content/en/pouet.md` if you don't want it

Any page you remove should also be dropped from the menu in `hugo.toml` and (if it's in the list) from the `$bgPages` slice in `themes/pouet/layouts/_default/baseof.html`.

### 6. French, or not

The template is bilingual EN + FR out of the box. To keep it, translate your posts under `content/fr/`. To go monolingual, follow the deletion steps in [i18n.md](i18n.md) - it's a config-block and a directory, nothing else.

## Running the tests

```bash
npm install
npm test          # node --test, exercises the palette's fuzzy matcher
```

## Building for production

```bash
hugo --gc --minify
```

Output goes to `public/` (gitignored). For hosting, see [deployment.md](deployment.md).
