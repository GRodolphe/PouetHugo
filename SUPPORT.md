# Support

## Getting help

- **Documentation**: start with the [README](README.md), the [docs/](docs/) directory, and the [project wiki](https://github.com/GRodolphe/PouetHugo/wiki).
- **Questions and bugs**: open an issue using the [issue templates](https://github.com/GRodolphe/PouetHugo/issues/new/choose).
- **Security reports**: do not open a public issue. Follow [SECURITY.md](SECURITY.md).

This is a template, so "support" mostly means the documentation plus issue triage. There is no paid support or SLA.

## Release support scope and duration

- Releases are versioned with semantic version tags (for example `v1.0.0`). See [CHANGELOG.md](CHANGELOG.md).
- **The latest release is the supported release.** Fixes, including security fixes, land on `main` and go out in the next tagged release. There are no long-term-support branches.
- Older releases stop receiving updates as soon as a newer release exists. If you are on an older tag, the supported upgrade path is to move to the latest tag; because this is a template you own the copy in your own repository, so upgrading is a merge or cherry-pick on your side.
- The supported Hugo range for a given release is stated in that release and in [docs/deployment.md](docs/deployment.md).

## What "end of support" means here

Because you fork or template this repository into your own, your deployed site keeps working regardless of this project's activity. "End of support" only means this upstream repository stops shipping new fixes for a given version once a newer version exists. The security-update boundary is the same: only the latest release receives security fixes.
