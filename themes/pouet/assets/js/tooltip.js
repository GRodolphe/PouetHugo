// Cursor-trailing typewriter tooltip (deepreview.app-style). Any element
// with [data-tooltip] gets its text typed into a floating monospace bubble
// that eases after the pointer. Keyboard focus shows the same bubble pinned
// under the focused element. Reduced motion: instant text, no lerp.
(function () {
  if (window.__pouetTooltipInit) return;
  window.__pouetTooltipInit = true;

  var tip = document.getElementById('cursor-tooltip');
  if (!tip) return;
  var textEl = tip.querySelector('.tooltip-text');
  var motion = document.documentElement.classList.contains('js-motion');
  var finePointer = matchMedia('(pointer: fine)').matches;

  var OFFSET = 18;
  var mouseX = 0, mouseY = 0, curX = -1, curY = -1;
  var visible = false, anchored = false, rafId = null;
  var typeTimer = null, deleteTimer = null;
  var currentEl = null;

  function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

  function place(x, y) {
    var r = tip.getBoundingClientRect();
    tip.style.left = clamp(x, 8, window.innerWidth - r.width - 8) + 'px';
    tip.style.top = clamp(y, 8, window.innerHeight - r.height - 8) + 'px';
  }

  function follow() {
    if (anchored) { rafId = null; return; }
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    place(curX, curY);
    rafId = visible ? requestAnimationFrame(follow) : null;
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX + OFFSET;
    mouseY = e.clientY + OFFSET;
  });

  function show(text, anchorRect) {
    clearInterval(typeTimer);
    clearInterval(deleteTimer);
    tip.style.display = 'block';
    visible = true;
    anchored = !!anchorRect;
    if (anchorRect) {
      textEl.textContent = text;
      place(anchorRect.left, anchorRect.bottom + 8);
      return;
    }
    if (curX < 0) { curX = mouseX; curY = mouseY; }
    if (!motion) {
      textEl.textContent = text;
      place(mouseX, mouseY);
    } else {
      textEl.textContent = '';
      var i = 0;
      typeTimer = setInterval(function () {
        if (i < text.length) { textEl.textContent += text[i++]; }
        else { clearInterval(typeTimer); }
      }, 65);
    }
    if (rafId === null && motion) rafId = requestAnimationFrame(follow);
    if (!motion) place(mouseX, mouseY);
  }

  function hide() {
    clearInterval(typeTimer);
    clearInterval(deleteTimer);
    currentEl = null;
    if (!motion || anchored) {
      textEl.textContent = '';
      tip.style.display = 'none';
      visible = false;
      return;
    }
    var i = textEl.textContent.length;
    deleteTimer = setInterval(function () {
      if (i > 0) {
        textEl.textContent = textEl.textContent.slice(0, --i);
      } else {
        clearInterval(deleteTimer);
        tip.style.display = 'none';
        visible = false;
      }
    }, 38);
  }

  function isFocusVisible(el) {
    try { return el.matches(':focus-visible'); } catch (e) { return true; }
  }

  if (finePointer) {
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tooltip]') : null;
      if (!el || el === currentEl) return;
      currentEl = el;
      show(el.getAttribute('data-tooltip'), null);
    });
    document.addEventListener('mouseout', function (e) {
      var el = e.target.closest ? e.target.closest('[data-tooltip]') : null;
      if (!el) return;
      if (e.relatedTarget && el.contains(e.relatedTarget)) return;
      hide();
    });
  }

  document.addEventListener('focusin', function (e) {
    var el = e.target.closest ? e.target.closest('[data-tooltip]') : null;
    if (el && isFocusVisible(el)) show(el.getAttribute('data-tooltip'), el.getBoundingClientRect());
  });
  document.addEventListener('focusout', function (e) {
    var el = e.target.closest ? e.target.closest('[data-tooltip]') : null;
    if (el) hide();
  });
})();
