# OSPS Baseline compliance

This project implements the [OpenSSF Open Source Project Security (OSPS) Baseline](https://baseline.openssf.org/), version 2025-02-25, across all three maturity levels. The table below maps every control to its evidence in this repository.

Two controls are honest partials, called out in the notes:

- **OSPS-AC-01.01 (MFA)** is an account/organization setting, not a repository file. It is enforced for maintainers and attested in `SECURITY-INSIGHTS.yml` and `GOVERNANCE.md`.
- **OSPS-QA-07.01 (non-author approval)** is configured in branch protection (one approving review, code-owner review required), but a single-maintainer project cannot produce a second approver. The policy is in place and enforced as soon as a second maintainer exists.

Legend: **Met** / **Configured** (policy and settings in place, full effect needs a second maintainer) / **N/A** (does not apply, with reason).

## Level 1

| Control | Status | Evidence |
|---|---|---|
| OSPS-AC-01.01 Require MFA for sensitive resources | Met (attested) | `GOVERNANCE.md`, `SECURITY-INSIGHTS.yml` |
| OSPS-AC-02.01 Minimal default permissions for collaborators | Met | `GOVERNANCE.md` (Access and permissions) |
| OSPS-AC-03.01 Prevent direct commits to primary branch | Met | Branch protection: required PR + status checks |
| OSPS-AC-03.02 Confirm before deleting primary branch | Met | Branch protection: deletions blocked |
| OSPS-BR-01.01 Sanitize/validate CI/CD inputs | Met | Workflows use no untrusted interpolation; actions SHA-pinned |
| OSPS-BR-03.01 Encrypted channels for official URIs | Met | All project URIs are HTTPS |
| OSPS-DO-01.01 User guides for basic functionality | Met | `README.md`, `docs/`, project wiki |
| OSPS-DO-02.01 Instructions for reporting defects | Met | `CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/`, `SUPPORT.md` |
| OSPS-GV-02.01 Public discussion mechanism | Met | GitHub Issues; `CONTRIBUTING.md`, `GOVERNANCE.md` |
| OSPS-GV-03.01 Document the contribution process | Met | `CONTRIBUTING.md` |
| OSPS-LE-02.01 OSI/FSF license for source | Met | `LICENSE` (MIT) |
| OSPS-LE-02.02 OSI/FSF license for released assets | Met | `LICENSE` (MIT); release archive is MIT |
| OSPS-LE-03.01 License in LICENSE file | Met | `LICENSE` |
| OSPS-LE-03.02 License included with released assets | Met | `git archive` release includes `LICENSE` |
| OSPS-QA-01.01 Source publicly readable at static URL | Met | Public GitHub repository |
| OSPS-QA-01.02 Public change record with authorship | Met | Git history |
| OSPS-QA-02.01 Document direct language dependencies | Met | `docs/dependencies.md` |
| OSPS-QA-04.01 List subprojects | Met | None; stated in `docs/dependencies.md`, `SECURITY-INSIGHTS.yml` |
| OSPS-QA-05.01 Exclude generated executables from VCS | Met | `.gitignore` (`public/`, `resources/`, `node_modules/`) |
| OSPS-VM-02.01 Publish security contact | Met | `SECURITY.md`, `SECURITY-INSIGHTS.yml` |

## Level 2

| Control | Status | Evidence |
|---|---|---|
| OSPS-AC-04.01 CI/CD tasks default to minimal permissions | Met | Top-level `permissions: contents: read` on all workflows |
| OSPS-BR-02.01 Unique version identifier per release | Met | Semantic-version tags and releases |
| OSPS-BR-04.01 Descriptive changelog | Met | `CHANGELOG.md` |
| OSPS-BR-05.01 Standardized dependency tooling | Met | npm + `package-lock.json` + Dependabot |
| OSPS-BR-06.01 Signed releases / signed hashes | Met | SLSA provenance over SHA-256 subjects |
| OSPS-DO-06.01 Describe dependency selection/tracking | Met | `docs/dependencies.md` |
| OSPS-GV-01.01 List members with sensitive access | Met | `GOVERNANCE.md`, `SECURITY-INSIGHTS.yml` |
| OSPS-GV-01.02 Document roles and responsibilities | Met | `GOVERNANCE.md` |
| OSPS-GV-03.02 Contribution guide with acceptance requirements | Met | `CONTRIBUTING.md` (What makes a contribution acceptable) |
| OSPS-LE-01.01 Contributors assert authorization (DCO/CLA) | Met | DCO sign-off in `CONTRIBUTING.md`, PR template |
| OSPS-QA-03.01 Required status checks before merge | Met | Branch protection required checks |
| OSPS-QA-06.01 Automated test suite before accepting commits | Met | CI runs `node --test` on pull requests |
| OSPS-SA-01.01 Design doc of actors and actions | Met | `docs/security-model.md` (Actors and actions) |
| OSPS-SA-02.01 Document external software interfaces | Met | `docs/security-model.md` (External interfaces) |
| OSPS-SA-03.01 Security assessment | Met | `docs/security-model.md` (Security assessment) |
| OSPS-VM-01.01 Coordinated vuln policy with timeframe | Met | `SECURITY.md` (90-day coordinated disclosure) |
| OSPS-VM-03.01 Private vulnerability reporting | Met | GitHub private vulnerability reporting |
| OSPS-VM-04.01 Publicly publish vulnerability data | Met | `SECURITY.md` (publish as GitHub Security Advisories) |

## Level 3

| Control | Status | Evidence |
|---|---|---|
| OSPS-AC-04.02 Minimum necessary permissions per CI/CD job | Met | Job-scoped `permissions` in `release.yml`, `codeql.yml`, `scorecard.yml` |
| OSPS-BR-02.02 Release assets have unique identifiers | Met | Version-named release assets |
| OSPS-DO-03.01 Instructions to verify release integrity | Met | `SECURITY.md` (`slsa-verifier` command) |
| OSPS-DO-04.01 Describe support scope and duration | Met | `SUPPORT.md` |
| OSPS-DO-05.01 State when releases stop getting security updates | Met | `SUPPORT.md`, `SECURITY.md` (Supported versions) |
| OSPS-GV-04.01 Policy: review before escalated permissions | Met | `GOVERNANCE.md` (Escalating permissions) |
| OSPS-QA-02.02 Compiled assets delivered with SBOM | Met | CycloneDX SBOM attached to each release (`release.yml`) |
| OSPS-QA-04.02 Subprojects as strict as primary | N/A | No subprojects |
| OSPS-QA-06.02 Document when and how tests run | Met | `CONTRIBUTING.md` (Testing) |
| OSPS-QA-06.03 Policy: major changes include tests | Met | `CONTRIBUTING.md`, PR template |
| OSPS-QA-07.01 Non-author approval before merge | Configured | Branch protection (1 review + code-owner); `GOVERNANCE.md`. Full effect needs a second maintainer |
| OSPS-SA-03.02 Threat modeling / attack surface analysis | Met | `docs/security-model.md` (Threat model) |
| OSPS-VM-04.02 Non-exploitable vulns in a VEX document | Met | `docs/vex.openvex.json` |
| OSPS-VM-05.01 Remediation threshold policy for SCA | Met | `SECURITY.md` (Vulnerability management policy) |
| OSPS-VM-05.02 Address SCA violations before release | Met | `SECURITY.md`, Dependabot |
| OSPS-VM-05.03 Auto-evaluate changes vs dependency policy | Met | `.github/workflows/dependency-review.yml` |
| OSPS-VM-06.01 Remediation threshold policy for SAST | Met | `SECURITY.md` (Vulnerability management policy) |
| OSPS-VM-06.02 Auto-evaluate code changes for weaknesses | Met | `.github/workflows/codeql.yml` |

## Verifying this yourself

The OpenSSF publishes an evaluator, [`osps-baseline` via the `baseline` CLI / Allstar-style tooling and the OSPS Baseline evaluator](https://github.com/ossf/security-baseline), plus the machine-readable `SECURITY-INSIGHTS.yml` in this repo that automated tools consume. Branch-protection controls are visible under the repository's Settings > Branches.
