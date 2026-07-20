// Hover preview cards for internal post links inside a post body.
// Reuses the cached search index (index-client.js). Fine pointers only.
(function () {
  if (window.__pouetPopoverInit) return;
  window.__pouetPopoverInit = true;
  if (!matchMedia('(pointer: fine)').matches) return;

  var body = document.querySelector('.post-body');
  if (!body) return;

  var motion = document.documentElement.classList.contains('js-motion');
  var card = document.createElement('div');
  card.id = 'link-preview';
  card.setAttribute('aria-hidden', 'true');
  document.body.appendChild(card);

  var byUrl = null;
  var timer = null;
  var hoverSeq = 0;

  function normalize(path) {
    return path.charAt(path.length - 1) === '/' ? path : path + '/';
  }

  function isPostLink(a) {
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) !== '/' || href.indexOf('#') !== -1) return false;
    var lang = document.documentElement.lang;
    var prefix = lang === 'en' ? '/posts/' : '/' + lang + '/posts/';
    var n = normalize(href);
    return n.indexOf(prefix) === 0 && n !== prefix;
  }

  function show(a) {
    var entry = byUrl && byUrl[normalize(a.getAttribute('href'))];
    if (!entry) return;
    card.innerHTML = '';
    var t = document.createElement('strong');
    t.textContent = entry.title;
    var d = document.createElement('span');
    d.className = 'preview-date';
    d.textContent = entry.date;
    var s = document.createElement('p');
    s.textContent = entry.summary;
    card.appendChild(t);
    card.appendChild(d);
    card.appendChild(s);

    var r = a.getBoundingClientRect();
    card.style.display = 'block';
    var left = Math.min(Math.max(r.left, 8), window.innerWidth - card.offsetWidth - 8);
    var top = r.top - card.offsetHeight - 10;
    if (top < 8) top = r.bottom + 10;
    card.style.left = left + 'px';
    card.style.top = (top + window.scrollY) + 'px';
    if (motion) {
      requestAnimationFrame(function () { card.classList.add('visible'); });
    } else {
      card.classList.add('visible');
    }
  }

  function hide() {
    hoverSeq++;
    clearTimeout(timer);
    card.classList.remove('visible');
    card.style.display = 'none';
  }

  body.addEventListener('mouseover', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !isPostLink(a)) return;
    clearTimeout(timer);
    var seq = ++hoverSeq;
    timer = setTimeout(function () {
      if (byUrl) { show(a); return; }
      pouetIndex.load().then(function (data) {
        byUrl = {};
        data.forEach(function (en) { byUrl[normalize(en.url)] = en; });
        // Only show if no hide()/newer hover invalidated this hover.
        if (seq === hoverSeq) show(a);
      }).catch(function () { /* no index, no popovers */ });
    }, 300);
  });

  body.addEventListener('mouseout', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    if (e.relatedTarget && a.contains(e.relatedTarget)) return;
    hide();
  });
})();
