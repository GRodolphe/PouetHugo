# Dependencies

How the template's dependencies are selected, tracked, and kept current. This backs the OSPS Baseline dependency controls.

## Selection principles

- **Prefer none.** The template has almost no build dependencies on purpose. A static-site template should not pull a tree of packages.
- **Pin everything.** Direct dependencies are pinned to exact versions; GitHub Actions are pinned to commit SHAs; runtime CDN libraries are pinned to explicit versions.
- **Justify each one.** A dependency earns its place by removing real work or risk, not convenience.

## Direct dependencies

### Build (npm, optional)

Declared in `package.json` with an exact `package-lock.json`. Only needed for the Cloudflare Pages build helper and the test runner; local `hugo` needs none of them.

| Package | Why |
|---|---|
| `hugo-extended` | Pins the Hugo binary used by CI and Cloudflare so production builds are reproducible. The pinned version is also the "latest" end of the supported range |
| `cross-spawn` | Cross-platform process spawning in `build.js` |

### Runtime (browser)

Loaded by the built site, not installed:

| Library | Source | Pinned | Loaded |
|---|---|---|---|
| mermaid | jsdelivr | yes (explicit version in `mermaid-init.js`) | only on pages with a diagram |
| pdf.js | jsdelivr | yes (explicit version in `slides/scripts.html`) | only on the slides page |
| GSAP + ScrollTrigger | vendored in `assets/js/vendor/` | n/a (committed) | site-wide |
| Google Fonts | fonts.googleapis.com | n/a | site-wide |

Self-hosting mermaid and pdf.js is documented in [features.md](features.md); doing so removes the only third-party runtime fetches besides fonts.

### Tooling

GitHub Actions used by CI, release, and security workflows are pinned by commit SHA (with the human-readable tag in a trailing comment). Hugo itself is the primary build tool; the supported version range is in [deployment.md](deployment.md).

## Tracking and updates

- **Dependabot** (`.github/dependabot.yml`) opens weekly pull requests for npm and GitHub Actions updates, including security advisories.
- **Dependency review** (`.github/workflows/dependency-review.yml`) runs on every pull request and blocks the introduction of a dependency with a known high or critical vulnerability.
- **SBOM.** Each release ships a CycloneDX SBOM (see the release workflow), so consumers have a machine-readable inventory of what a given version contains.

## Transitive overrides

When a transitive dependency has an advisory but its parent pins a range that excludes the fix, we lift it with an npm [`overrides`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides) entry rather than waiting on the parent. Current overrides:

| Package | Forced to | Why |
|---|---|---|
| `adm-zip` | `^0.6.0` | `hugo-extended` pins `^0.5.17`, which excludes the fix for GHSA-xcpc-8h2w-3j85 (high; crafted ZIP triggers a 4 GB allocation). adm-zip is used only at install time to unpack the Hugo binary; the override is verified to still produce a working build. |

## Remediation policy

The thresholds are stated in [SECURITY.md](../SECURITY.md): high or critical advisories are remediated before the next release; a pull request cannot introduce a known-vulnerable dependency.
