# Governance

PouetHugo is a small, maintainer-led open source project. This document records how it is run, who holds access, and how decisions and permissions are handled. It exists so the process is public rather than implicit.

## Roles

**Users** run the template to build their own sites. They need no permissions and are the audience for the documentation.

**Contributors** propose changes through pull requests. Anyone can be a contributor. Contributors need no special repository access: forks and pull requests are enough. Expectations are in [CONTRIBUTING.md](CONTRIBUTING.md).

**Maintainers** review and merge pull requests, triage issues, cut releases, and hold write access to the repository. Maintainers are responsible for keeping the template building on the supported Hugo range, keeping both languages in sync, and responding to security reports per [SECURITY.md](SECURITY.md).

## Current maintainers

| Name | GitHub | Role |
|---|---|---|
| Rodolphe G | [@GRodolphe](https://github.com/GRodolphe) | Lead maintainer, admin |

People with access to sensitive resources (repository administration, the ability to publish releases, and any deployment or package credentials) are limited to the maintainers listed above. The machine-readable record of this is in [SECURITY-INSIGHTS.yml](SECURITY-INSIGHTS.yml).

## Access and permissions

- New collaborators are granted the least privilege needed for their work, and nothing by default. Read or triage access is the starting point; write access is granted deliberately.
- Multi-factor authentication is required for every account with write access to the repository or the ability to publish releases.
- The primary branch (`main`) is protected: direct pushes are blocked, the branch cannot be deleted, and required status checks must pass before a change merges.

## Escalating permissions

Write access is not granted on request. A person is considered for maintainer (write) access only after a track record of reviewed, merged contributions to the project. The decision is made by the existing maintainers. This keeps the set of people who can change the codebase small and known, which is the point of the control.

## Decision making

Day-to-day changes are decided by maintainer review on pull requests. Larger or breaking changes should be raised in a public issue first so the direction can be discussed before code is written. When maintainers disagree, the lead maintainer decides.

## Changing this document

Governance changes go through the same pull request and review process as code.
