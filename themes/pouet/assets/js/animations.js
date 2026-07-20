// GSAP animation init for the pouet theme.
// Loaded with `defer`, runs after DOMContentLoaded automatically (defer scripts
// fire before DOMContentLoaded). We still wrap in an init guard so we don't
// double-bind if something re-runs this file.

(function () {
  if (window.__pouetAnimInit) return;
  window.__pouetAnimInit = true;

  // Bail entirely if user prefers reduced motion. The head-inline script gates
  // .js-motion the same way, so the CSS opacity:0 rule never applied either.
  if (!document.documentElement.classList.contains('js-motion')) return;

  if (typeof gsap === 'undefined') {
    // Lift the CSS gate (.js-motion [data-animate] { opacity: 0 }) so a failed
    // script load degrades to a static page instead of a blank one.
    document.documentElement.classList.remove('js-motion');
    console.warn('[animations] gsap not loaded');
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Defaults applied to every tween unless overridden.
  gsap.defaults({ ease: 'power2.out', duration: 0.5 });

  // Chrome animations (nav + main fade) only play once per session so they
  // don't re-trigger on every internal navigation. Per-page content (hero,
  // terminal, scroll reveals) still animates normally on each load.
  var seenSession = false;
  try { seenSession = sessionStorage.getItem('__pouetSeen') === '1'; } catch (e) {}
  try { sessionStorage.setItem('__pouetSeen', '1'); } catch (e) {}

  // --- Universal: main fade-in ---
  // Provides a clean baseline so per-section staggers don't start mid-paint.
  var main = document.querySelector('main');
  if (main) {
    if (seenSession) {
      gsap.set(main, { opacity: 1 });
    } else {
      gsap.fromTo(main, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }
  }

  // --- Nav: fade down on load ---
  var nav = document.querySelector('[data-animate="nav"]');
  if (nav) {
    if (seenSession) {
      gsap.set(nav, { opacity: 1, y: 0 });
    } else {
      gsap.fromTo(nav,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }

  // --- Homepage hero: stagger fade + y-translate ---
  var heroItems = document.querySelectorAll('[data-animate="hero-item"]');
  if (heroItems.length) {
    gsap.fromTo(heroItems,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.1 }
    );
  }

  // --- Homepage terminal: fade in, then typewrite each log line ---
  var term = document.querySelector('[data-animate="term"]');
  if (term) {
    var termLines = term.querySelectorAll('[data-animate="term-line"]');

    // Capture original HTML and width-reserving placeholder for each line.
    // We swap textContent with an empty string then reveal char by char.
    // Using innerHTML round-tripping preserves the nested spans (.warn, .cve, .path).
    var lineHTMLs = [];
    termLines.forEach(function (line) {
      lineHTMLs.push(line.innerHTML);
      // Reserve vertical space by keeping line non-empty with a single zero-width space (U+200B).
      line.innerHTML = '​';
      line.style.minHeight = '1.4em';
    });

    var tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(term,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    termLines.forEach(function (line, i) {
      var fullHTML = lineHTMLs[i];
      // Approximate char count from the rendered text (strip tags for timing only).
      var tmp = document.createElement('div');
      tmp.innerHTML = fullHTML;
      var charCount = tmp.textContent.length;
      // Cap per-line duration so longer post titles don't drag.
      var dur = Math.min(0.05 * charCount, 0.6);

      tl.to(line, {
        opacity: 1,
        duration: dur,
        ease: 'none',
        onStart: function () { line.innerHTML = ''; },
        onUpdate: function () {
          // Progress is the tween's current 0..1 ratio.
          var p = this.progress();
          var n = Math.floor(p * charCount);
          // Reveal first `n` chars of the original text, then on completion swap to full HTML.
          line.textContent = tmp.textContent.substring(0, n);
        },
        onComplete: function () {
          // Restore full HTML so nested spans render with their styling.
          line.innerHTML = fullHTML;
        }
      }, '>0.05');
    });
  }

  // --- Scroll reveal: single elements ---
  document.querySelectorAll('[data-animate="reveal"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 12 },
      {
        opacity: 1, y: 0, duration: 0.6,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // --- Scroll reveal: staggered children of a parent ---
  document.querySelectorAll('[data-animate="reveal-children"]').forEach(function (parent) {
    var children = parent.querySelectorAll('[data-animate="reveal-child"]');
    if (!children.length) return;
    // The CSS gate hides every [data-animate] element including the parent
    // itself. We never animate the parent, so reveal it immediately;
    // otherwise the children fade inside an invisible container.
    gsap.set(parent, { opacity: 1 });
    gsap.fromTo(children,
      { opacity: 0, y: 8 },
      {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.06,
        scrollTrigger: { trigger: parent, start: 'top 85%', once: true }
      }
    );
  });

  // --- Post body: scroll reveal for headings and code blocks ---
  // These elements aren't tagged with data-animate (they come from Markdown),
  // so we apply opacity:0 inline before creating the ScrollTrigger.
  var postBody = document.querySelector('.post-body');
  if (postBody) {
    var revealTargets = postBody.querySelectorAll('h2, h3, pre');
    revealTargets.forEach(function (el) {
      // Set y offset (opacity:0 already applied via CSS).
      if (el.tagName !== 'PRE') gsap.set(el, { y: 6 });
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.5,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  // --- Mermaid coordination ---
  // Mermaid renders async after page load and replaces `pre > code.language-mermaid`
  // with `.mermaid-wrap` blocks. Watch for those, fade them in, and refresh ScrollTrigger
  // (page height changes after diagrams render).
  if (postBody && typeof ScrollTrigger !== 'undefined') {
    var observer = new MutationObserver(function (mutations) {
      var newWraps = [];
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains('mermaid-wrap')) {
            newWraps.push(n);
          }
        });
      });
      if (newWraps.length) {
        newWraps.forEach(function (el) {
          // CSS already set opacity:0 on .mermaid-wrap.
          gsap.to(el, {
            opacity: 1, duration: 0.5,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
        });
        ScrollTrigger.refresh();
      }
    });
    observer.observe(postBody, { childList: true, subtree: true });
  }

  // --- Geometric thin-line constellation background ---
  // Slow-drifting nodes connected by hairlines when within range. Pure
  // abstract / minimal. Brand pink hairlines; nodes are bare dots.
  var pixelCanvas = document.getElementById('pixel-bg');
  if (pixelCanvas) {
    var pctx = pixelCanvas.getContext('2d');
    var PW, PH;
    var nodes = [];
    var NODE_COUNT = 42;
    var LINK_DIST = 160; // max distance to draw a connecting line
    var LINK_DIST2 = LINK_DIST * LINK_DIST;

    function rand(min, max) { return min + Math.random() * (max - min); }

    function spawnNode() {
      return {
        x: Math.random() * PW,
        y: Math.random() * PH,
        vx: rand(-0.18, 0.18),
        vy: rand(-0.18, 0.18)
      };
    }

    function pixelResize() {
      var dpr = window.devicePixelRatio || 1;
      var w = window.innerWidth;
      var h = window.innerHeight;
      if (w === PW && h === PH) return;
      pixelCanvas.width = w * dpr;
      pixelCanvas.height = h * dpr;
      pixelCanvas.style.width = w + 'px';
      pixelCanvas.style.height = h + 'px';
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      PW = w;
      PH = h;
      // Scale node count to viewport area; cap to NODE_COUNT for big screens.
      // Keep existing nodes (clamped into the new bounds) and only add/remove
      // the difference, so a resize doesn't teleport the whole constellation -
      // mobile URL-bar show/hide fires resize on every scroll direction change.
      var target = Math.min(NODE_COUNT, Math.round((w * h) / 28000));
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].x > PW) nodes[i].x = PW;
        if (nodes[i].y > PH) nodes[i].y = PH;
      }
      while (nodes.length > target) nodes.pop();
      while (nodes.length < target) nodes.push(spawnNode());
    }
    pixelResize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(pixelResize, 150);
    });

    function pixelDraw() {
      pctx.clearRect(0, 0, PW, PH);

      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var lineRGB = '241,77,108';                        // brand pink, both themes
      var dotRGB = isDark ? '230,235,240' : '40,45,50';  // subtle dot

      // Update positions + wrap edges.
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) n.x = PW;
        if (n.x > PW) n.x = 0;
        if (n.y < 0) n.y = PH;
        if (n.y > PH) n.y = 0;
      }

      // Draw connecting hairlines (alpha fades with distance). One constant
      // strokeStyle + globalAlpha per line avoids allocating and parsing a new
      // rgba() string per line per frame.
      pctx.lineWidth = 1;
      pctx.strokeStyle = 'rgb(' + lineRGB + ')';
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var dx = nodes[a].x - nodes[b].x;
          var dy = nodes[a].y - nodes[b].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST2) {
            var t = 1 - Math.sqrt(d2) / LINK_DIST;
            pctx.globalAlpha = t * 0.22;
            pctx.beginPath();
            pctx.moveTo(nodes[a].x, nodes[a].y);
            pctx.lineTo(nodes[b].x, nodes[b].y);
            pctx.stroke();
          }
        }
      }

      // Draw dots last so they sit on the line intersections.
      pctx.globalAlpha = 0.45;
      pctx.fillStyle = 'rgb(' + dotRGB + ')';
      for (var k = 0; k < nodes.length; k++) {
        pctx.beginPath();
        pctx.arc(nodes[k].x, nodes[k].y, 1.4, 0, Math.PI * 2);
        pctx.fill();
      }
      pctx.globalAlpha = 1;
    }

    // Throttle the canvas to ~30fps locally. Capping the global ticker
    // (gsap.ticker.fps) would drop every other animation on the page to
    // 30fps as well.
    var lastDraw = 0;
    gsap.ticker.add(function (time) {
      if (time - lastDraw < 1 / 30) return;
      lastDraw = time;
      pixelDraw();
    });
  }

  // --- Reading progress bar (smoothed) ---
  // Moved out of single.html so it runs everywhere the bar exists (only meaningful
  // on post pages, but cheap on others - quickTo is a no-op if .post-body is absent).
  var bar = document.getElementById('reading-progress');
  var body = document.querySelector('.post-body');
  if (bar && body) {
    // scaleX with a numeric 0..1 value: quickTo only tweens numbers, and the
    // transform stays off layout/paint. The bar is width:100% + scaleX(0) in CSS.
    var setScale = gsap.quickTo(bar, 'scaleX', { duration: 0.2, ease: 'power2.out' });
    function update() {
      var rect = body.getBoundingClientRect();
      var top = -rect.top;
      var total = rect.height - window.innerHeight;
      // A post shorter than the viewport is fully visible, hence fully read.
      setScale(total <= 0 ? 1 : Math.min(Math.max(top / total, 0), 1));
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
