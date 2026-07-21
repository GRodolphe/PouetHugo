// Console note for people who look under the hood. Once per session so
// multi-page browsing doesn't spam the console. The message comes from
// the `egg_message` i18n string via a <meta> tag rendered in head.html;
// an empty message disables the egg entirely.
(function () {
  try {
    if (sessionStorage.getItem('__pouetEgg')) return;
    sessionStorage.setItem('__pouetEgg', '1');
  } catch (e) { /* private mode: just print every page */ }

  var meta = document.querySelector('meta[name="egg-message"]');
  var msg = meta && meta.getAttribute('content');
  if (!msg) return;

  var banner = [
    '                        _    _ ',
    ' _ __   ___  _   _  ___| |_ | |',
    "| '_ \\ / _ \\| | | |/ _ \\ __|| |",
    '| |_) | (_) | |_| |  __/ |_ |_|',
    '| .__/ \\___/ \\__,_|\\___|\\__|(_)',
    '|_|'
  ].join('\n');

  console.log('%c' + banner, 'color:#6366F1;font-family:monospace;line-height:1.2');
  console.log('%c' + msg, 'color:#9AA2A8;font-family:monospace');
})();
