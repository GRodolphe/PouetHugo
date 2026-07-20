// Fuzzy subsequence scorer for the command palette. Plain script: declares
// a global `pouetFuzzy` (works in the browser and under node's vm in tests).
var pouetFuzzy = (function () {
  // Score `query` against `text`. Higher is better; -1 means no match;
  // empty query scores 0. All query chars must appear in order.
  // Bonuses: consecutive matches, word-start matches. Small penalties for
  // a late first match and for long haystacks, so tight titles win.
  function score(query, text) {
    if (!query) return 0;
    var q = query.toLowerCase();
    var t = text.toLowerCase();
    var qi = 0, s = 0, streak = 0, first = -1;
    for (var ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) {
        if (first < 0) first = ti;
        var prev = ti === 0 ? ' ' : t[ti - 1];
        var wordStart = prev === ' ' || prev === '-' || prev === '/' || prev === '.';
        s += 1 + streak * 2 + (wordStart ? 3 : 0);
        streak++;
        qi++;
      } else {
        streak = 0;
      }
    }
    if (qi < q.length) return -1;
    return s - first * 0.05 - (t.length - q.length) * 0.01;
  }

  // Greedy match indices of `query` within `text` (same walk as score),
  // used to highlight matched chars. Null when `text` alone doesn't
  // contain the query as a subsequence (e.g. it matched via tags).
  function positions(query, text) {
    var q = query.toLowerCase();
    var t = text.toLowerCase();
    var out = [], qi = 0;
    for (var ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) { out.push(ti); qi++; }
    }
    return qi === q.length ? out : null;
  }

  return { score: score, positions: positions };
})();
