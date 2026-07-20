# Contributing

Thanks for considering a contribution. This is a Hugo blog template, so most contributions are theme fixes, documentation, accessibility and performance improvements, or bilingual copy corrections.

## Ways to contribute

- **Report a bug or request a feature**: open an issue using one of the [issue templates](https://github.com/GRodolphe/PouetHugo/issues/new/choose).
- **Ask a question or discuss a change**: open an issue before large changes so the approach can be agreed in public before you spend time on it.
- **Report a vulnerability**: do not open a public issue. Follow [SECURITY.md](SECURITY.md).

## Development setup

```bash
git clone https://github.com/<you>/PouetHugo.git
cd PouetHugo
hugo server -D        # http://localhost:1313
npm install && npm test   # the fuzzy-matcher test suite
```

Requirements are in [docs/getting-started.md](docs/getting-started.md).

## What makes a contribution acceptable

A change is ready to merge when:

1. **It builds on both supported Hugo versions.** CI runs `hugo` on the oldest supported version (0.139) and the latest. Don't rely on features missing from 0.139, or keep the dual-layout compatibility shims intact (see [docs/deployment.md](docs/deployment.md)).
2. **Tests pass and cover new logic.** Run `npm test`. Any change to the theme JavaScript that adds or changes behavior should add or update a test under `tests/`. Major changes are expected to include the tests that exercise them.
3. **It follows the writing guide.** Prose and sample content follow [docs/writing-guide.md](docs/writing-guide.md): no em dashes, Title Case headers in English, sentence case in French, no emojis.
4. **It keeps the template generic.** No personal branding, no hardcoded identity. Anything site-specific belongs in `hugo.toml`, `i18n/`, or `content/`, not the theme.
5. **Both languages stay in sync.** A change to EN sample content or UI strings should have its FR counterpart.

## Testing

The automated suite (`npm test`, which runs `node --test`) runs locally and in CI on every pull request. Status checks must pass before a pull request can merge. See [docs/features.md](docs/features.md) for where each piece of behavior lives.

## Pull request process

1. Branch off `main`.
2. Make your change, with tests and both-language updates where relevant.
3. Sign off your commits (see below).
4. Open a pull request and fill in the template. Describe what changed and why, and how you verified it.
5. Pull requests require review before merge (see [GOVERNANCE.md](GOVERNANCE.md)). Automated status checks must be green.

## Developer Certificate of Origin (DCO)

Contributions must be made under the project's MIT license, and you must have the right to submit them. We use the [Developer Certificate of Origin](https://developercertificate.org/): certify your right to contribute by adding a `Signed-off-by` line to each commit.

```bash
git commit -s -m "your message"
```

This appends `Signed-off-by: Your Name <your@email>` using your `git config user.name` and `user.email`. Pull requests whose commits are not signed off will be asked to amend.

By signing off, you assert the statements in the DCO: that you wrote the change or otherwise have the right to submit it under the project's license.
