# Writing guide

The conventions the sample content follows. They come from the blog this template was extracted from; adopt them, adapt them, or delete this file. If you use an AI assistant for drafting, this file also works as its style instructions (the source blog keeps it as `CLAUDE.md` at the repo root for that reason).

Posts target security practitioners - people who already know what XSS, CSRF, and postMessage are. Write for that audience: don't explain the basics, do explain the specifics.

## Voice

Casual and direct. First person. Dry humor is fine; theatrics are not.

- Good: "Three lines. That's all it took."
- Bad: "This is where most developers miss the point."
- Good: "The attack, step by step:"
- Bad: "Here's the full attack, step by step:"

## What to Cut

Strip anything that inflates without adding meaning:

- Filler transitions: "Got it? Great.", "Let me walk you through..."
- Qualifiers that state the obvious: "critical", "dangerous", "completely" - the context already implies severity
- Redundant adjectives: "concrete changes" is just "changes"
- Saying the same thing twice in one sentence
- Dramatic openers. "JS execution in the origin opens doors. Here are the main ones." beats a paragraph of wind-up.

## What to Keep

- Short punchy sentences for punchlines
- Technical precision - don't dumb down the actual mechanics
- Blockquotes for genuine quotes and meme captions
- Mermaid diagrams for flow and sequence
- Annotated code blocks for taint traces (SOURCE / PROPAGATION / SINK pattern)

## Formatting Rules

- No emojis
- No em dashes. Use a regular hyphen (`-`) or restructure the sentence
- Section headers: `## Title Case` in English; natural sentence case in French
- Meme images go right after the moment they punctuate, with a short italic caption
- Image references in page bundles use the filename only (`![caption](thisisfine.png)`), not a path

## Code Blocks

- Language tag on every fence
- The theme disables font ligatures so `===` and `!==` stay three characters - don't fight it
- Highlighting is Catppuccin Mocha via `syntax.css`; never inline styles

## Bilingual (EN / FR)

- Each post exists in both `content/en/posts/` and `content/fr/posts/` as paired bundles
- Keep the FR tone as casual as the EN - not more formal
- Don't translate CVSS labels or technical acronyms
- Avoid anglicisms in French when a French verb exists ("imposer", not "enforcer")
- Feminine agreement for technical nouns where natural: "une vulnérabilité"

## Post Structure (Security Writeups)

1. Disclosure notice blockquote
2. TL;DR bullets
3. How it started (short, sets the scene)
4. Technical background (only what's needed to understand the vuln)
5. Vulnerable code (annotated)
6. Sink-to-source analysis (mermaid + annotated code block)
7. Attack flow (mermaid + PoC snippet)
8. Impact (flat list of subsections, no nested drama)
9. The fix (before/after code blocks)
10. Timeline table
11. Lessons learned (two audiences: hunters and developers)
12. References
