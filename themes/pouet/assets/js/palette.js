// Ctrl+K command palette. Fuzzy-searches the build-time index (pouetIndex)
// plus static commands from the palette partial's <template>. Requires
// fuzzy.js and index-client.js to be loaded first.
(function () {
  if (window.__pouetPaletteInit) return;
  window.__pouetPaletteInit = true;

  var dlg = document.getElementById('palette');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var input = document.getElementById('palette-input');
  var list = document.getElementById('palette-results');
  var btn = document.getElementById('palette-btn');
  var tpl = document.getElementById('palette-commands');

  var entries = null;
  var failed = false;
  var results = [];
  var selected = 0;

  var commands = Array.prototype.map.call(tpl.content.querySelectorAll('li'), function (li) {
    return { title: li.textContent, cmd: li.getAttribute('data-cmd'), section: 'cmd' };
  });

  function run(item) {
    dlg.close();
    if (item.cmd === 'theme') {
      document.getElementById('theme-toggle').click();
      return;
    }
    if (item.cmd === 'lang') {
      var alt = document.querySelector('.lang-switch a:not(.active)');
      if (alt) location.href = alt.href;
      return;
    }
    location.href = item.url;
  }

  function render() {
    var q = input.value.trim();
    var i, s;
    var content = [];
    var pool = entries || [];
    for (i = 0; i < pool.length; i++) {
      var e = pool[i];
      var hay = e.title + ' ' + (e.tags ? e.tags.join(' ') : '') + ' ' + (e.summary || '');
      s = pouetFuzzy.score(q, hay);
      if (s >= 0) content.push({ item: e, score: s });
    }
    // Query: best score first. Empty query: newest first (undated pages last).
    content.sort(function (a, b) {
      return (b.score - a.score) || (b.item.date || '').localeCompare(a.item.date || '');
    });
    var cmds = [];
    for (i = 0; i < commands.length; i++) {
      s = pouetFuzzy.score(q, commands[i].title);
      if (s >= 0) cmds.push({ item: commands[i], score: s });
    }
    // Commands always render after content so they stay reachable even on
    // an empty query (they'd otherwise sort below the slice cutoff).
    results = content.slice(0, 10).concat(cmds);
    selected = 0;
    draw(q);
  }

  function draw(q) {
    list.innerHTML = '';
    if (failed && !entries) {
      var note = document.createElement('li');
      note.className = 'palette-note';
      note.textContent = list.getAttribute('data-msg-unavailable');
      list.appendChild(note);
    }
    if (!results.length) {
      var empty = document.createElement('li');
      empty.className = 'palette-note';
      empty.textContent = list.getAttribute('data-msg-empty');
      list.appendChild(empty);
      return;
    }
    results.forEach(function (r, i) {
      var li = document.createElement('li');
      li.className = 'palette-item' + (i === selected ? ' selected' : '');
      var title = document.createElement('span');
      title.className = 'palette-title';
      var pos = q ? pouetFuzzy.positions(q, r.item.title) : null;
      if (pos) {
        var last = 0;
        pos.forEach(function (p) {
          title.appendChild(document.createTextNode(r.item.title.slice(last, p)));
          var m = document.createElement('mark');
          m.textContent = r.item.title[p];
          title.appendChild(m);
          last = p + 1;
        });
        title.appendChild(document.createTextNode(r.item.title.slice(last)));
      } else {
        title.textContent = r.item.title;
      }
      var meta = document.createElement('span');
      meta.className = 'palette-meta';
      meta.textContent = r.item.section + (r.item.date ? ' · ' + r.item.date : '');
      li.appendChild(title);
      li.appendChild(meta);
      li.addEventListener('click', function () { run(r.item); });
      li.addEventListener('mousemove', function () { select(i); });
      list.appendChild(li);
    });
  }

  function select(i) {
    if (i === selected || !results.length) return;
    selected = i;
    var items = list.querySelectorAll('.palette-item');
    Array.prototype.forEach.call(items, function (el, j) {
      el.classList.toggle('selected', j === selected);
    });
    if (items[selected]) items[selected].scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (dlg.open) return;
    dlg.showModal();
    input.value = '';
    if (entries === null && !failed) {
      pouetIndex.load().then(function (data) {
        entries = data;
        if (dlg.open) render();
      }).catch(function () {
        failed = true;
        if (dlg.open) render();
      });
    }
    render();
  }

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (dlg.open) { dlg.close(); } else { open(); }
    }
  });
  if (btn) btn.addEventListener('click', open);

  input.addEventListener('input', render);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(Math.min(selected + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(Math.max(selected - 1, 0)); }
    else if (e.key === 'Enter' && results[selected]) { run(results[selected].item); }
  });

  // Click on the backdrop (the dialog element itself) closes.
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
})();
