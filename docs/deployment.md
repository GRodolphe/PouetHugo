# Deployment

The output of `hugo --gc --minify` (the `public/` directory) is a fully static site; any static host works. Details for the two common paths:

## Cloudflare Pages (what the template is wired for)

1. Create a Pages project pointed at your repository.
2. Build command: `npm run build` (runs `build.js`), output directory: `public` (also declared in `wrangler.toml`).
3. Set the `PRODUCTION_URL` environment variable to your canonical URL (e.g. `https://blog.example.com/`).

`build.js` picks the base URL per deploy: `PRODUCTION_URL` on the production branch, the per-deploy `CF_PAGES_URL` on previews (so preview links work), and falls back to `hugo.toml`'s `baseURL`. The Hugo binary comes from the `hugo-extended` npm package pinned in `package.json` - bump that pin to upgrade your production Hugo deliberately rather than implicitly.

Pushing to `main` deploys production; pull requests get preview deploys automatically.

## GitHub Pages

A ready-made workflow ships at `.github/workflows/pages.yml`, trigger set to `workflow_dispatch` so it does nothing until you opt in:

1. In the repo settings, set Pages "Source" to "GitHub Actions".
2. In `pages.yml`, replace the `workflow_dispatch` trigger with `push: {branches: [main]}` (the swap is commented in the file).
3. If the site lives at `https://<user>.github.io/<repo>/`, set `baseURL` accordingly.

## Anywhere else

Netlify, Vercel, an nginx box: build command `hugo --gc --minify`, publish `public/`. Set `baseURL` (or pass `-b`) to the canonical URL.

## The Hugo version-skew caveat

The template is built to work across a wide Hugo range (0.139 to current), and CI builds both ends on every push. Two things exist specifically for that:

- **Duplicate layouts**: the custom page layouts exist as both `layouts/page/*.html` and `layouts/_default/*.html` because template lookup for single pages changed across Hugo versions - older versions resolve `_default/`, newer ones prefer `page/`. If you edit one, edit its twin (they are line-for-line identical apart from that lookup difference).
- **Deprecation warnings on recent Hugo**: `languageCode`/`languageName` and a few template functions used by the layouts were deprecated after 0.156 but still work. The warnings are expected; the modern replacements don't exist on 0.139, and compatibility wins until the old forms are actually removed.

If you only ever build with a recent Hugo, you can collapse the duplicate layouts and modernize the config keys - nothing else depends on them.
