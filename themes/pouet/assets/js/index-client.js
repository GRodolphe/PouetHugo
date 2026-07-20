// Lazy, cached loader for the per-language search index emitted by
// layouts/index.json (/index.json, /fr/index.json). Shared by palette.js
// and popovers.js. A failed fetch clears the cache so a retry is possible.
var pouetIndex = (function () {
  var promise = null;
  function load() {
    if (!promise) {
      var lang = document.documentElement.lang;
      var url = lang === 'en' ? '/index.json' : '/' + lang + '/index.json';
      promise = fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('index http ' + r.status);
          return r.json();
        })
        .catch(function (err) { promise = null; throw err; });
    }
    return promise;
  }
  return { load: load };
})();
