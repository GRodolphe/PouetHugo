# Security model

The design, external interfaces, security assessment, and threat model for the PouetHugo template. It exists so users can reason about what they are deploying, and it backs the OSPS Baseline security-assessment controls (see [osps-baseline.md](osps-baseline.md)).

## What this software is

A Hugo static-site template. It compiles markdown and configuration into static HTML, CSS, and JavaScript. There is no server, no database, no user accounts, and no runtime backend. A deployed site is a directory of static files served by a host of the user's choosing.

## Actors and actions

| Actor | Interacts how | Trusted? |
|---|---|---|
| **Author / maintainer** | Writes content and config, runs `hugo`, deploys `public/` | Trusted. Has full control of output |
| **Site visitor** | Requests static pages; runs the theme's client-side JS in their browser | Untrusted input consumer. Receives only static, author-authored content |
| **Build system** (local or Cloudflare/GitHub CI) | Runs Hugo and the release pipeline | Trusted, but hardened (pinned actions, least-privilege tokens, SLSA provenance) |
| **Contributor** | Proposes changes via pull request | Untrusted until reviewed. Changes are gated by CI, CodeQL, dependency review, and maintainer approval |

The core security property: a visitor never supplies input that the build consumes. The site is fully static, so classic web-app injection classes (SQLi, SSRF, server-side template injection) have no surface here.

## External interfaces

What a built site talks to at runtime, and why. This is the complete outbound list for a default deployment (useful for writing a Content-Security-Policy):

| Origin | Purpose | When |
|---|---|---|
| `fonts.googleapis.com`, `fonts.gstatic.com` | Web fonts | Every page |
| `cdn.jsdelivr.net` | mermaid (diagrams) and pdf.js (slides), at pinned versions | Only on pages that contain a diagram or a slide deck |
| `www.measured.site` | Privacy-friendly analytics | Only if the user sets `measuredSiteId`, and only in production builds |

Build-time interfaces: the Hugo binary, the npm registry (via `package-lock.json`) for the optional `hugo-extended` and `cross-spawn` build helpers, and GitHub Actions (pinned by commit SHA). Self-hosting the two CDN libraries is documented in [features.md](features.md) and removes the jsdelivr dependency entirely.

## Security assessment

A structured pass over where things could go wrong, and the current control:

- **Client-side JavaScript.** All theme JS is vanilla, loaded `defer`, and initialized idempotently. It reads from the same-origin build-time JSON index and the DOM, never from `location`-derived or third-party input in a way that reaches a sink. The one dynamic surface, the command palette's fuzzy matcher, operates on the static index and is covered by `tests/`. No `eval`, no `innerHTML` from untrusted data.
- **Raw HTML in markdown.** `unsafe = true` lets the author write raw HTML (used by the hero and about strings). This trusts the author, which is correct for a single-author blog. If untrusted people can commit content, this is the setting to reconsider; it is called out in `SECURITY.md`.
- **Third-party runtime scripts.** mermaid and pdf.js load from jsdelivr at pinned versions, only on pages that use them. A CDN compromise is the main residual runtime risk; pinning the version limits it and self-hosting removes it.
- **Supply chain (build).** Actions are pinned by commit SHA, workflow tokens are least-privilege, dependencies are lock-pinned and monitored, and releases carry SLSA L3 provenance and an SBOM. See the [dependency policy](dependencies.md).
- **Secrets.** The template ships none. Analytics is an opt-in site id (not a secret). Deploy credentials live in the host, not the repo.

## Threat model and attack surface

Framed as who could attack what:

1. **Malicious visitor -> deployed site.** Surface: static files only. No server logic to exploit. Reflected/stored injection requires an input path into the build; there is none. Residual: whatever the user's host and CSP allow. Mitigation: the site is static; users are pointed at the outbound-origin list above to write a strict CSP.
2. **Malicious dependency or CDN -> visitor.** Surface: `hugo-extended`/`cross-spawn` at build time; mermaid/pdf.js/fonts at runtime. Mitigation: lock-pinned build deps with Dependabot + dependency review; SHA-pinned actions; version-pinned CDN libs with a self-hosting escape hatch.
3. **Malicious contributor -> repository/consumers.** Surface: pull requests. Mitigation: branch protection, required status checks, CodeQL and dependency-review on PRs, DCO sign-off, and maintainer review before merge (GOVERNANCE.md).
4. **Build tampering -> release consumers.** Surface: the release pipeline. Mitigation: isolated SLSA L3 provenance generator, least-privilege tokens, and verifiable artifacts (SECURITY.md shows the `slsa-verifier` command).

### Out of scope

The security of the user's chosen host, DNS, TLS termination, and any content the user adds are outside this template's control. This document covers the template as shipped.
