# Generic, Configurable Template Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the appsec-researcher persona copy with neutral, brandable template copy (EN + FR), make each nav menu item enable/disable-able, and remove the dead `page/*` layout duplicates.

**Architecture:** All rendered copy comes from `i18n/en.toml` + `i18n/fr.toml` via `{{ i18n "…" }}` in the active `_default/*` layouts, so genericizing = editing strings. Menus render from `.Site.Menus.main` in two partials; a per-item `enabled` menu param gates both. The `page/*` directory is dead (verified) and gets deleted behind a byte-identical build gate.

**Tech Stack:** Hugo (extended, pinned `0.164.0` in `node_modules`; system `hugo` works), TOML i18n + config, Go HTML templates.

## Global Constraints

- Copy lives in i18n; the active layouts are `_default/*` (never `page/*`).
- Neutral voice: a generic "developer & writer" who publishes articles, small projects, and notes. Placeholder-obvious but tasteful.
- Preserve all `<span class="pixel">` / `<span class="serif">` accent markup and `<br>` structure inside `hero_title` (rendered `safeHTML`).
- Keep untouched: `egg_message`, tooltip strings, all structural UI strings, and disposable sample content (`content/*/posts/**`, `content/*/links.md` entries, `data/cves.yaml`, `data/slides.yaml`).
- Hugo `default` treats `false` as empty — menu guard must be `ne .Params.enabled false`, never `.Params.enabled | default true`.
- Each task ends by building clean (`hugo`) and committing.

---

### Task 1: Genericize persona copy (i18n EN + FR, home terminal, chip doc)

**Files:**
- Modify: `i18n/en.toml`
- Modify: `i18n/fr.toml`
- Modify: `themes/pouet/layouts/index.html` (lines 26, 28, 33)
- Modify: `docs/content.md` (line 29)

**Interfaces:**
- Consumes: nothing.
- Produces: neutral copy rendered on every active page in both languages.

- [ ] **Step 1: Rewrite the persona keys in `i18n/en.toml`**

Replace each key's `other = "…"` line with the new value below (keys not listed stay as-is):

```toml
[posts_lede]
other = "posts across articles, notes, and deep-dives. Filter by tag."

[cve_lede]
other = "A chronological index of tracked CVEs. Sorted newest first."

[about_hero]
other = "A bit <span class=\"pixel\">about me,</span> and what I write here."

[about_lede]
other = "I'm a developer and writer. This is where I publish articles, share small projects, and keep notes on what I'm learning."

[about_focus]
other = "I like understanding how things actually work - taking an idea apart, figuring it out, and writing up what I found so it's useful to someone else later."

[about_disclosure]
other = "Most of what I publish starts as a note to myself, then gets cleaned up enough to share."

[about_writes_body]
other = "Articles and tutorials, notes on the tools I use, the occasional project write-up, and short essays about the craft."

[about_based]
other = "Remote"

[about_focus_label]
other = "Writing"

[footer_tagline]
other = "Articles, projects, and notes."

[footer_disclosure]
other = "Say hello anytime."

[footer_built]
other = "built with hugo"

[hero_status]
other = "currently · writing something new"

[hero_eyebrow]
other = "writing · projects · notes"

[hero_title]
other = "The things I <span class=\"pixel\">make,</span><br>the things I <span class=\"pixel\">learn,</span><br><span class=\"serif\">and the notes I take along the way.</span>"

[hero_body]
other = "A notebook for technical writing. Here I publish articles, share small projects, and think out loud about what I'm working on."
```

(Unchanged persona-adjacent keys kept intentionally: `cve_eyebrow`, `cve_hero`, `about_eyebrow`, `about_writes`, `about_contact`, `about_contact_body`, `links_lede` — already neutral.)

- [ ] **Step 2: Rewrite the matching keys in `i18n/fr.toml`**

```toml
[posts_lede]
other = "articles, notes et analyses. Filtrer par tag."

[cve_lede]
other = "Un index chronologique des CVE suivies. Les plus récentes en premier."

[about_hero]
other = "Un mot <span class=\"pixel\">sur moi,</span> et ce que j'écris ici."

[about_lede]
other = "Je suis développeur et je rédige ici : des articles, des petits projets à partager, et des notes sur ce que j'apprends."

[about_focus]
other = "J'aime comprendre comment les choses fonctionnent vraiment - décortiquer une idée, la saisir, puis écrire ce que j'ai trouvé pour que ce soit utile à quelqu'un d'autre plus tard."

[about_disclosure]
other = "La plupart de mes textes commencent comme des notes pour moi-même, puis sont mis au propre pour être partagés."

[about_writes_body]
other = "Des articles et tutoriels, des notes sur les outils que j'utilise, quelques comptes-rendus de projets, et parfois un essai sur le métier."

[about_based]
other = "À distance"

[about_focus_label]
other = "Écriture"

[footer_tagline]
other = "Articles, projets et notes."

[footer_disclosure]
other = "N'hésitez pas à dire bonjour."

[footer_built]
other = "construit avec hugo"

[hero_status]
other = "en ce moment · j'écris quelque chose"

[hero_eyebrow]
other = "écriture · projets · notes"

[hero_title]
other = "Ce que je <span class=\"pixel\">fabrique,</span><br>ce que j'<span class=\"pixel\">apprends,</span><br><span class=\"serif\">et les notes que je prends en chemin.</span>"

[hero_body]
other = "Un carnet pour l'écriture technique. J'y publie des articles, partage des petits projets, et réfléchis à voix haute à ce sur quoi je travaille."
```

- [ ] **Step 3: De-persona the home terminal in `themes/pouet/layouts/index.html`**

Line 26: change `~/research/{{ now.Year }} - zsh` to `~/{{ now.Year }} - zsh`.
Lines 28 and 33 (both identical): change `{{ .Site.Params.author.handle | default "me" }}@lab` to `{{ .Site.Params.author.handle | default "me" }}@local`.

- [ ] **Step 4: Fix the "Red CVE chip" wording in `docs/content.md`**

Line 29: change `| Red CVE chip next to the title and in the home terminal |` to `| CVE chip (brand color) next to the title and in the home terminal |`.

- [ ] **Step 5: Verify no persona terms remain in chrome**

Run: `grep -rniE "appsec|application[- ]security|vulnerabilit|reachability|responsible disclosure|red accent|accents rouges|@lab|~/research" i18n/ themes/pouet/layouts/index.html docs/content.md`
Expected: no output (exit 1).

- [ ] **Step 6: Build clean**

Run: `hugo --gc --minify`
Expected: exits 0, no theme ERROR/WARN.

- [ ] **Step 7: Spot-check rendered output, EN + FR**

Run:
```bash
grep -o "A notebook for technical writing" public/index.html
grep -o "Un carnet pour l'écriture technique" public/fr/index.html
grep -o "built with hugo" public/index.html
```
Expected: each prints its match (neutral copy rendered in both languages).

- [ ] **Step 8: Commit**

```bash
git add i18n/en.toml i18n/fr.toml themes/pouet/layouts/index.html docs/content.md
git commit -m "feat: genericize persona copy into neutral template copy"
```

---

### Task 2: Per-item menu enable/disable

**Files:**
- Modify: `themes/pouet/layouts/partials/nav/menu-links.html`
- Modify: `themes/pouet/layouts/partials/footer.html` (lines 13–15)
- Modify: `hugo.toml` (CVE menu blocks, EN ~line 76 and FR ~line 128)
- Modify: `docs/configuration.md` (menu section, ~line 49)

**Interfaces:**
- Consumes: nothing.
- Produces: menu items carrying `params.enabled = false` are omitted from nav + footer, both languages.

- [ ] **Step 1: Guard the nav renderer**

Replace the whole body of `themes/pouet/layouts/partials/nav/menu-links.html` (keep the leading comment) so the range skips disabled items:
```go-html-template
{{- /* Main menu links. Context: the current page. Rendered in both the
       desktop nav bar and the mobile overlay, so the active-state logic lives
       in one place. An item with `enabled = false` in its menu params is
       omitted here (and in the footer). */ -}}
{{ range .Site.Menus.main }}
{{ if ne .Params.enabled false }}
<a href="{{ .URL | relLangURL }}"{{ if or ($.IsMenuCurrent "main" .) ($.HasMenuCurrent "main" .) }} class="active"{{ end }}{{ with .Params }}{{ with .tooltip }} data-tooltip="{{ . }}"{{ end }}{{ end }}>{{ .Name }}</a>
{{ end }}
{{ end }}
```

- [ ] **Step 2: Guard the footer renderer**

In `themes/pouet/layouts/partials/footer.html`, replace lines 13–15:
```go-html-template
        {{ range .Site.Menus.main }}
        <a href="{{ .URL | relLangURL }}">{{ .Name }}</a>
        {{ end }}
```
with:
```go-html-template
        {{ range .Site.Menus.main }}{{ if ne .Params.enabled false }}
        <a href="{{ .URL | relLangURL }}">{{ .Name }}</a>
        {{ end }}{{ end }}
```

- [ ] **Step 3: Add a commented `enabled` example to the CVE menu blocks in `hugo.toml`**

In the EN CVE block, under `[languages.en.menu.main.params]` (the block whose `tooltip = "the paper trail"`), add a commented line:
```toml
      [languages.en.menu.main.params]
        tooltip = "the paper trail"
        # enabled = false   # hide this item from nav + footer
```
Do the same in the FR CVE block (`tooltip = "les preuves"`):
```toml
      [languages.fr.menu.main.params]
        tooltip = "les preuves"
        # enabled = false   # masquer cet élément du menu et du pied de page
```

- [ ] **Step 4: Document the toggle in `docs/configuration.md`**

In the menu subsection (after the tooltip example, ~line 60), add:
```markdown
Any menu item can be hidden without deleting its block by setting `enabled = false` in its params:

    [[languages.en.menu.main]]
      name = "CVE"
      url = "/cves/"
      weight = 4
      [languages.en.menu.main.params]
        enabled = false   # omit or true = shown

Disabled items disappear from both the top nav and the footer. To remove the CVE feature entirely: set its menu item `enabled = false` (or delete the block), then delete `content/en/cves.md`, `content/fr/cves.md`, and `data/cves.yaml`.
```

- [ ] **Step 5: Verify the default build still shows all items**

Run: `hugo --gc --minify && grep -c 'href="/cves/"' public/index.html`
Expected: build exits 0; count ≥ 1 (CVE still shown by default).

- [ ] **Step 6: Verify disabling hides the item in nav AND footer**

Run:
```bash
hugo --gc --minify -p 'languages.en.menu.main[3].params.enabled=false' && grep -c 'href="/cves/"' public/index.html
```
Expected: `0` (CVE gone from the EN home page's nav + footer). Then restore a clean build: `hugo --gc --minify`.
(If the `-p` array override is not honored by the installed Hugo, instead temporarily add `enabled = false` under the EN CVE block's params in `hugo.toml`, rebuild, confirm `0`, then revert the edit.)

- [ ] **Step 7: Commit**

```bash
git add themes/pouet/layouts/partials/nav/menu-links.html themes/pouet/layouts/partials/footer.html hugo.toml docs/configuration.md
git commit -m "feat: make each menu item enable/disable-able via config"
```

---

### Task 3: Remove the dead `page/*` layout duplicates

**Files:**
- Delete: `themes/pouet/layouts/page/` (whole directory)

**Interfaces:**
- Consumes: nothing.
- Produces: single source of truth for layouts (`_default/*`); removes stale hardcoded persona English from dead files.

- [ ] **Step 1: Snapshot the current build**

Run:
```bash
hugo --gc --minify --quiet && find public -type f | sort | xargs sha256sum > /tmp/pouet-public-before.sha256 && wc -l /tmp/pouet-public-before.sha256
```
Expected: prints a line count (N files hashed).

- [ ] **Step 2: Delete the dead directory**

Run: `git rm -r themes/pouet/layouts/page/`
Expected: git stages the deletions.

- [ ] **Step 3: Rebuild and diff the output against the snapshot**

Run:
```bash
hugo --gc --minify --quiet && find public -type f | sort | xargs sha256sum > /tmp/pouet-public-after.sha256 && diff /tmp/pouet-public-before.sha256 /tmp/pouet-public-after.sha256 && echo "IDENTICAL — page/* was dead"
```
Expected: `IDENTICAL — page/* was dead` (no diff). **If diff shows any change, `page/*` was NOT fully dead — run `git checkout themes/pouet/layouts/page/` to restore, and drop this task.**

- [ ] **Step 4: Confirm no stale persona English survives in layouts**

Run: `grep -rniE "appsec|application-security|I break software|vulnerabilities I" themes/pouet/layouts/`
Expected: no output (exit 1).

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: remove dead page/* layout duplicates"
```

---

## Final verification (after all tasks)

- [ ] `hugo server` → home, about, footer show neutral copy in **EN and FR**; the terminal reads `~/2026` and `handle@local`.
- [ ] Temporarily set the CVE menu item `enabled = false` in `hugo.toml` → CVE gone from nav + footer in both languages, site builds; revert.
- [ ] `grep -rniE "appsec|application[- ]security|vulnerabilit|reachability|responsible disclosure|red accent|accents rouges|@lab|~/research" i18n/ themes/pouet/ docs/content.md docs/configuration.md` → no output (sample content under `content/` and `data/` intentionally excluded).

## Self-Review

- **Spec coverage:** §A copy → Task 1 (i18n EN+FR). §B page/* removal → Task 3 (gated). §C terminal → Task 1 step 3. §D menu toggle → Task 2. §E CVE (toggle via D + `cve_lede` genericized in Task 1 + removal documented in Task 2 step 4). §F docs → Task 1 step 4 + Task 2 step 4. All covered.
- **Placeholder scan:** none — every changed string and edit is spelled out verbatim.
- **Type/name consistency:** the guard `ne .Params.enabled false` is identical in Task 2 steps 1 and 2; `enabled` param name matches across template, hugo.toml example, and docs.
- **Scope note:** disposable sample content (`content/**`, `data/*.yaml`) intentionally excluded per `docs/design.md` ("sample content is disposable by design"); the final grep scopes to chrome only.
