# Changelog

All notable changes to this template are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security
- Force `adm-zip` to `^0.6.0` via an npm override, remediating GHSA-xcpc-8h2w-3j85 (high) in a transitive build-time dependency of `hugo-extended`.

### Added
- OSPS Baseline compliance: governance, contribution, support, and security process documentation (`GOVERNANCE.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `CHANGELOG.md`, `CODEOWNERS`, issue and pull request templates).
- `SECURITY-INSIGHTS.yml` (OpenSSF Security Insights 2.2.0) with machine-readable security metadata.
- Security assessment and threat model (`docs/security-model.md`), dependency policy (`docs/dependencies.md`), and a VEX document.
- `dependency-review` workflow on pull requests; SBOM generation attached to releases.
- Baseline compliance matrix (`docs/osps-baseline.md`).

## [1.0.0] - 2026-07-20

### Added
- Initial release of the PouetHugo template: bilingual (EN/FR) Hugo blog with the `pouet` theme.
- Command palette, cross-page view transitions, theme-toggle wipe, hover preview cards, mermaid diagrams, image zoom, Catppuccin Mocha syntax highlighting.
- Data-driven CVE tracker, inline-PDF slides viewer, and tag-filtered links pages.
- Build-time social cards (og:image), JSON-LD structured data, per-language RSS and search index.
- CI building Hugo 0.139 and latest plus a JavaScript test suite; SLSA Build L3 release provenance; OpenSSF Scorecard, CodeQL, and Dependabot.
- Full documentation under `docs/` and a project wiki.

[Unreleased]: https://github.com/GRodolphe/PouetHugo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/GRodolphe/PouetHugo/releases/tag/v1.0.0
