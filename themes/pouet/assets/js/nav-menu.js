// Mobile nav menu for the pouet theme.
// A hamburger button (shown only <=820px, and only when JS is present) opens a
// full-screen overlay holding the main links + language switch + Subscribe.
// Dependency-free; the link-reveal stagger uses GSAP when it's loaded and
// falls back to a CSS transition otherwise. All motion is gated on .js-motion,
// so prefers-reduced-motion users get an instant open/close.

(function () {
  if (window.__pouetNavMenuInit) return;
  window.__pouetNavMenuInit = true;

  var root = document.documentElement;
  var toggle = document.getElementById('nav-toggle');
  var overlay = document.getElementById('nav-overlay');
  if (!toggle || !overlay) return;

  var closeBtn = document.getElementById('nav-close');
  var links = overlay.querySelectorAll('.nav-overlay-links a');
  var BREAKPOINT = 820;
  var isOpen = false;
  var lastFocus = null;

  var motion = root.classList.contains('js-motion');
  var useGsap = motion && typeof gsap !== 'undefined';
  // Tell the CSS to stand down its fallback link stagger when GSAP drives it.
  if (useGsap) root.classList.add('nav-gsap');

  // Labels are localized on the buttons (i18n). Swap the toggle's label with
  // state so screen readers announce the right action.
  var labelOpen = toggle.getAttribute('aria-label');
  var labelClose = closeBtn ? closeBtn.getAttribute('aria-label') : labelOpen;

  // Make the overlay focusable as a fallback target for focus management.
  if (!overlay.hasAttribute('tabindex')) overlay.setAttribute('tabindex', '-1');

  function onKey(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    // Trap focus within the overlay while it's open.
    var f = overlay.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0];
    var last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;
    root.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', labelClose);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    if (useGsap && links.length) {
      gsap.killTweensOf(links);
      gsap.fromTo(links,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.05, clearProps: 'transform' }
      );
    }

    // Move focus into the dialog so aria-modal actually means something;
    // close() hands it back.
    (closeBtn || overlay).focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', labelOpen);
    document.body.style.removeProperty('overflow');
    document.removeEventListener('keydown', onKey);
    if (useGsap) gsap.killTweensOf(links);
    if (lastFocus && document.contains(lastFocus) && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    } else {
      toggle.focus();
    }
    lastFocus = null;
  }

  toggle.addEventListener('click', function () {
    if (isOpen) { close(); } else { open(); }
  });
  if (closeBtn) closeBtn.addEventListener('click', close);

  // Click a link -> let it navigate, but close too so a same-page / hash target
  // (or a bfcache restore) doesn't leave the overlay stuck open. Click on the
  // empty backdrop -> close.
  overlay.addEventListener('click', function (e) {
    var hit = e.target.closest ? e.target.closest('a, button') : null;
    if (!hit) { close(); return; }
    if (hit.tagName === 'A') close();
  });

  // If the viewport grows past the breakpoint while open (rotate / resize),
  // close so we don't leave a stuck full-screen panel on a wide screen.
  window.addEventListener('resize', function () {
    if (isOpen && window.innerWidth > BREAKPOINT) close();
  });
})();
