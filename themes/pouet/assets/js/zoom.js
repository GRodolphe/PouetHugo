// Image zoom overlay for the pouet theme.
// Click a post image to view it full-size on a dimmed backdrop; click
// anywhere or press Esc to close. Dependency-free; transitions are gated
// on .js-motion so prefers-reduced-motion users get an instant toggle.

(function () {
  if (window.__pouetZoomInit) return;
  window.__pouetZoomInit = true;

  var overlay = null;
  var lastFocus = null;

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function close() {
    if (!overlay) return;
    var el = overlay;
    overlay = null;
    document.body.style.removeProperty('overflow');
    document.removeEventListener('keydown', onKey);
    el.classList.remove('is-open');
    // Let clicks pass through while the overlay fades out, so a quick
    // follow-up click on another image isn't swallowed.
    el.style.pointerEvents = 'none';
    if (lastFocus && document.contains(lastFocus) && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
    lastFocus = null;
    if (document.documentElement.classList.contains('js-motion')) {
      el.addEventListener('transitionend', function (ev) {
        // The child img transitions too; only the overlay's own end counts.
        if (ev.target === el) el.remove();
      });
      // Safety net if transitionend never fires (e.g. tab backgrounded).
      setTimeout(function () { el.remove(); }, 400);
    } else {
      el.remove();
    }
  }

  function open(img) {
    var el = document.createElement('div');
    el.className = 'zoom-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', img.alt || 'Image');

    var big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt || '';
    el.appendChild(big);

    el.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog so aria-modal actually means something;
    // close() hands it back.
    lastFocus = document.activeElement;
    el.tabIndex = -1;
    document.body.appendChild(el);
    el.focus();
    overlay = el;

    // Two frames so the browser paints the initial state before the
    // .is-open transition starts.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        // Bail if close() already ran; otherwise we'd fade the dead
        // overlay back in.
        if (el !== overlay) return;
        el.classList.add('is-open');
      });
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var img = e.target.closest('.post-body img');
    // Linked images keep their link behavior.
    if (!img || img.closest('a')) return;
    open(img);
  });
})();
