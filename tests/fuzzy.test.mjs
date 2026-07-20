import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// fuzzy.js is a plain browser script declaring a top-level `var pouetFuzzy`;
// running it in this context makes that a global we can grab.
vm.runInThisContext(
  readFileSync(new URL('../themes/pouet/assets/js/fuzzy.js', import.meta.url), 'utf8')
);
const { score, positions } = globalThis.pouetFuzzy;

test('query chars must all appear in order', () => {
  assert.equal(score('xss', 'dom clobbering'), -1);
  assert.ok(score('xss', 'DOM XSS via postMessage') > 0);
});

test('empty query scores zero (matches everything)', () => {
  assert.equal(score('', 'anything'), 0);
});

test('case-insensitive', () => {
  assert.ok(score('SEMGREP', 'semgrep architecture') > 0);
});

test('word-start and consecutive matches outrank scattered ones', () => {
  assert.ok(score('dom', 'DOM XSS via postMessage') > score('dom', 'download my music'));
});

test('earlier matches outrank later ones', () => {
  assert.ok(score('sem', 'Semgrep architecture') > score('sem', 'the assembly of semantics'));
});

test('positions returns greedy match indices', () => {
  assert.deepEqual(positions('dx', 'dom xss'), [0, 4]);
  assert.equal(positions('zz', 'dom xss'), null);
});
