(async function() {
  // Module scripts run after DOM parse, so the blocks are already there.
  // Bail before fetching mermaid (~660KB parsed) on pages with no diagrams.
  if (!document.querySelector('pre > code.language-mermaid')) return;

  let mermaid;
  try {
    mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@11.15.0/dist/mermaid.esm.min.mjs')).default;
  } catch (e) {
    // CDN unreachable: leave the raw code blocks readable.
    console.error('[mermaid] failed to load', e);
    return;
  }

  const pouetLight = {
    theme: 'base',
    themeVariables: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '14px',
      primaryColor: '#FDE3E8',
      primaryTextColor: '#0F1113',
      primaryBorderColor: '#F14D6C',
      secondaryColor: '#EEF1F3',
      secondaryTextColor: '#4B5358',
      secondaryBorderColor: 'rgba(15,17,19,0.14)',
      tertiaryColor: '#DCE8EE',
      tertiaryTextColor: '#4B5358',
      tertiaryBorderColor: 'rgba(15,17,19,0.14)',
      lineColor: '#9AA2A8',
      textColor: '#0F1113',
      mainBkg: '#FDE3E8',
      nodeBorder: '#F14D6C',
      clusterBkg: '#F6F8F9',
      clusterBorder: 'rgba(15,17,19,0.14)',
      titleColor: '#0F1113',
      edgeLabelBackground: '#FFFFFF',
      nodeTextColor: '#0F1113',
      actorLineColor: '#9AA2A8',
      signalColor: '#0F1113',
      labelBoxBkgColor: '#FFFFFF',
      labelBoxBorderColor: 'rgba(15,17,19,0.14)',
      labelTextColor: '#0F1113',
      loopTextColor: '#4B5358',
      noteBkgColor: '#DCE8EE',
      noteTextColor: '#0F1113',
      noteBorderColor: 'rgba(15,17,19,0.14)',
      activationBorderColor: '#F14D6C',
      activationBkgColor: '#FDE3E8',
      sequenceNumberColor: '#FFFFFF',
      sectionBkgColor: '#FDE3E8',
      altSectionBkgColor: '#F6F8F9',
      sectionBkgColor2: '#DCE8EE',
      taskBorderColor: '#F14D6C',
      taskBkgColor: '#FDE3E8',
      taskTextColor: '#0F1113',
      taskTextDarkColor: '#0F1113',
      taskTextClickableColor: '#F14D6C',
      activeTaskBorderColor: '#C93955',
      activeTaskBkgColor: '#F14D6C',
      doneTaskBkgColor: '#EEF1F3',
      doneTaskBorderColor: '#9AA2A8',
      critBorderColor: '#C93955',
      critBkgColor: '#F14D6C',
      todayLineColor: '#F14D6C',
      relationColor: '#9AA2A8',
      relationLabelColor: '#4B5358',
    }
  };

  const pouetDark = {
    theme: 'base',
    themeVariables: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '14px',
      primaryColor: 'rgba(241,77,108,0.15)',
      primaryTextColor: '#F2F4F5',
      primaryBorderColor: '#FF6B84',
      secondaryColor: '#1C1F22',
      secondaryTextColor: '#B0B8BE',
      secondaryBorderColor: 'rgba(255,255,255,0.14)',
      tertiaryColor: '#1A2228',
      tertiaryTextColor: '#B0B8BE',
      tertiaryBorderColor: 'rgba(255,255,255,0.14)',
      lineColor: '#6C757B',
      textColor: '#F2F4F5',
      mainBkg: 'rgba(241,77,108,0.15)',
      nodeBorder: '#FF6B84',
      clusterBkg: '#161819',
      clusterBorder: 'rgba(255,255,255,0.14)',
      titleColor: '#F2F4F5',
      edgeLabelBackground: '#131517',
      nodeTextColor: '#F2F4F5',
      actorLineColor: '#6C757B',
      signalColor: '#F2F4F5',
      labelBoxBkgColor: '#131517',
      labelBoxBorderColor: 'rgba(255,255,255,0.14)',
      labelTextColor: '#F2F4F5',
      loopTextColor: '#B0B8BE',
      noteBkgColor: '#1A2228',
      noteTextColor: '#F2F4F5',
      noteBorderColor: 'rgba(255,255,255,0.14)',
      activationBorderColor: '#FF6B84',
      activationBkgColor: 'rgba(241,77,108,0.15)',
      sequenceNumberColor: '#131517',
      sectionBkgColor: 'rgba(241,77,108,0.15)',
      altSectionBkgColor: '#161819',
      sectionBkgColor2: '#1A2228',
      taskBorderColor: '#FF6B84',
      taskBkgColor: 'rgba(241,77,108,0.15)',
      taskTextColor: '#F2F4F5',
      taskTextDarkColor: '#F2F4F5',
      taskTextClickableColor: '#FF6B84',
      activeTaskBorderColor: '#FF8FA3',
      activeTaskBkgColor: '#FF6B84',
      doneTaskBkgColor: '#1C1F22',
      doneTaskBorderColor: '#6C757B',
      critBorderColor: '#FF8FA3',
      critBkgColor: '#FF6B84',
      todayLineColor: '#FF6B84',
      relationColor: '#6C757B',
      relationLabelColor: '#B0B8BE',
    }
  };

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function initMermaid() {
    mermaid.initialize({
      startOnLoad: false,
      ...( isDark() ? pouetDark : pouetLight ),
    });
  }

  // --- Zoom / Pan / Fullscreen controller ---
  function attachControls(wrap) {
    var state = { scale: 1, x: 0, y: 0, panning: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 };
    var container = wrap.querySelector('.mermaid-container');
    var inner = wrap.querySelector('.mermaid-inner');
    var label = wrap.querySelector('.mermaid-zoom-level');
    var MIN = 0.25, MAX = 4, STEP = 0.25;

    function apply() {
      inner.style.transform = 'translate(' + state.x + 'px,' + state.y + 'px) scale(' + state.scale + ')';
      label.textContent = Math.round(state.scale * 100) + '%';
    }

    function zoom(delta) {
      state.scale = Math.min(MAX, Math.max(MIN, state.scale + delta));
      apply();
    }

    function reset() {
      state.scale = 1; state.x = 0; state.y = 0;
      container.classList.remove('panning');
      apply();
    }

    wrap.querySelector('[data-action="zoom-in"]').addEventListener('click', function() { zoom(STEP); });
    wrap.querySelector('[data-action="zoom-out"]').addEventListener('click', function() { zoom(-STEP); });
    wrap.querySelector('[data-action="reset"]').addEventListener('click', reset);

    // Fullscreen toggle
    wrap.querySelector('[data-action="fullscreen"]').addEventListener('click', function() {
      var fs = document.createElement('div');
      fs.className = 'mermaid-fullscreen';
      var fsInner = document.createElement('div');
      fsInner.className = 'mermaid-inner';
      // Clone the SVG into fullscreen
      var svg = inner.querySelector('svg');
      if (svg) fsInner.appendChild(svg.cloneNode(true));

      // Single close path for both the button and Escape, so the keydown
      // listener never outlives the overlay.
      function onKey(e) { if (e.key === 'Escape') close(); }
      function close() {
        document.body.removeChild(fs);
        document.removeEventListener('keydown', onKey);
      }

      var fsControls = document.createElement('div');
      fsControls.className = 'mermaid-controls';
      var closeBtn = document.createElement('button');
      closeBtn.textContent = '\u00d7';
      closeBtn.title = 'Close';
      closeBtn.addEventListener('click', close);
      fsControls.appendChild(closeBtn);

      fs.appendChild(fsInner);
      fs.appendChild(fsControls);
      document.body.appendChild(fs);

      // Pan in fullscreen
      var fsState = { scale: 1, x: 0, y: 0, panning: false, startX: 0, startY: 0, startPanX: 0, startPanY: 0 };
      function fsApply() {
        fsInner.style.transform = 'translate(' + fsState.x + 'px,' + fsState.y + 'px) scale(' + fsState.scale + ')';
      }
      fs.addEventListener('pointerdown', function(e) {
        if (e.target.closest('.mermaid-controls')) return;
        fsState.panning = true; fsState.startX = e.clientX; fsState.startY = e.clientY;
        fsState.startPanX = fsState.x; fsState.startPanY = fsState.y;
        fs.classList.add('grabbing'); fs.setPointerCapture(e.pointerId);
      });
      fs.addEventListener('pointermove', function(e) {
        if (!fsState.panning) return;
        fsState.x = fsState.startPanX + (e.clientX - fsState.startX);
        fsState.y = fsState.startPanY + (e.clientY - fsState.startY);
        fsApply();
      });
      fs.addEventListener('pointerup', function() { fsState.panning = false; fs.classList.remove('grabbing'); });
      fs.addEventListener('wheel', function(e) {
        e.preventDefault();
        fsState.scale = Math.min(MAX, Math.max(MIN, fsState.scale + (e.deltaY < 0 ? STEP : -STEP)));
        fsApply();
      }, { passive: false });

      // Escape to close
      document.addEventListener('keydown', onKey);
    });

    // Wheel zoom on inline diagram
    container.addEventListener('wheel', function(e) {
      e.preventDefault();
      zoom(e.deltaY < 0 ? STEP : -STEP);
    }, { passive: false });

    // Pan with pointer drag
    container.addEventListener('pointerdown', function(e) {
      if (e.target.closest('.mermaid-controls')) return;
      state.panning = true; state.startX = e.clientX; state.startY = e.clientY;
      state.startPanX = state.x; state.startPanY = state.y;
      container.classList.add('grabbing', 'panning');
      container.setPointerCapture(e.pointerId);
    });
    container.addEventListener('pointermove', function(e) {
      if (!state.panning) return;
      state.x = state.startPanX + (e.clientX - state.startX);
      state.y = state.startPanY + (e.clientY - state.startY);
      apply();
    });
    container.addEventListener('pointerup', function() {
      state.panning = false;
      container.classList.remove('grabbing', 'panning');
    });

    apply();
  }

  function wrapDiagram(mermaidEl) {
    var wrap = document.createElement('div');
    wrap.className = 'mermaid-wrap';

    var controls = document.createElement('div');
    controls.className = 'mermaid-controls';
    controls.innerHTML =
      '<button data-action="zoom-out" title="Zoom out">\u2212</button>' +
      '<span class="mermaid-zoom-level">100%</span>' +
      '<button data-action="zoom-in" title="Zoom in">+</button>' +
      '<button data-action="reset" title="Reset">\u21ba</button>' +
      '<button data-action="fullscreen" title="Fullscreen">\u26f6</button>';

    var container = document.createElement('div');
    container.className = 'mermaid-container';
    var inner = document.createElement('div');
    inner.className = 'mermaid-inner';

    // Move SVG content into inner
    while (mermaidEl.firstChild) inner.appendChild(mermaidEl.firstChild);

    container.appendChild(inner);
    wrap.appendChild(controls);
    wrap.appendChild(container);

    // Transfer data attribute
    wrap.setAttribute('data-mermaid-src', mermaidEl.getAttribute('data-mermaid-src') || '');
    mermaidEl.replaceWith(wrap);

    attachControls(wrap);
    return wrap;
  }

  async function runAndWrap() {
    initMermaid();
    try {
      await mermaid.run({ querySelector: '.mermaid' });
    } catch (e) {
      // One bad diagram rejects the whole run; the others still rendered.
      console.error('[mermaid]', e);
    } finally {
      // Wrap every diagram with zoom controls, including on partial failure.
      var rendered = document.querySelectorAll('.mermaid[data-mermaid-src]');
      for (var j = 0; j < rendered.length; j++) {
        wrapDiagram(rendered[j]);
      }
    }
  }

  async function renderDiagrams() {
    var blocks = document.querySelectorAll('pre > code.language-mermaid');
    if (!blocks.length) return;

    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      var pre = block.parentElement;
      var container = document.createElement('div');
      container.className = 'mermaid';
      var source = block.textContent;
      container.setAttribute('data-mermaid-src', source);
      container.textContent = source;
      pre.replaceWith(container);
    }
    await runAndWrap();
  }

  renderDiagrams();

  // Re-render on theme toggle
  var toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', function() {
    setTimeout(async function() {
      var diagrams = document.querySelectorAll('.mermaid-wrap[data-mermaid-src]');
      if (!diagrams.length) return;

      // Unwrap back to plain .mermaid divs for re-render
      for (var i = 0; i < diagrams.length; i++) {
        var wrap = diagrams[i];
        var plain = document.createElement('div');
        plain.className = 'mermaid';
        var src = wrap.getAttribute('data-mermaid-src');
        plain.setAttribute('data-mermaid-src', src);
        plain.textContent = src;
        wrap.replaceWith(plain);
      }

      await runAndWrap();
    }, 50);
  });
})();
