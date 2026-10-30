// Foreman site. Progressive enhancement only: every page is complete without
// this file, and every behaviour here is something a person asked for by
// pointing, clicking, or loading the page once.

(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The header turns to drafting vellum once the page moves under it.
  const onScroll = () => {
    if (scrollY > 8) root.setAttribute('data-scrolled', '');
    else root.removeAttribute('data-scrolled');
    const barY = 45;
    const darkSection = [...document.querySelectorAll('section.blue, .site-footer')].some(el => { const b = el.getBoundingClientRect(); return b.top <= barY && b.bottom > barY; });
    root.dataset.barTone = darkSection ? 'dark' : 'light';
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Theme. The initial value is set in <head> before first paint; this wires
  // the button and remembers the choice.
  const meta = document.querySelector('meta[name="theme-color"]');
  const setTheme = t => {
    if (t === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    for (const b of document.querySelectorAll('.theme')) {
      b.setAttribute('aria-pressed', String(t === 'dark'));
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to the light sheet' : 'Switch to the night sheet');
    }
    if (meta) meta.content = t === 'dark' ? '#000000' : '#FFFFFF';
  };
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  for (const b of document.querySelectorAll('.theme')) {
    b.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
      try { localStorage.setItem('foreman-theme', next); } catch (e) {}
    });
  }

  // Menu on narrow screens: the same links, on a sheet under the bar.
  const menuBtn = document.querySelector('.menubtn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    const close = focusBack => {
      root.removeAttribute('data-menu');
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('inert', '');
      if (focusBack) menuBtn.focus();
    };
    menu.setAttribute('inert', '');
    menuBtn.addEventListener('click', () => {
      if (root.hasAttribute('data-menu')) return close(false);
      root.setAttribute('data-menu', '');
      menuBtn.setAttribute('aria-expanded', 'true');
      menu.removeAttribute('inert');
      const first = menu.querySelector('a');
      if (first) first.focus({ preventScroll: true });
    });
    addEventListener('keydown', e => { if (e.key === 'Escape' && root.hasAttribute('data-menu')) close(true); });
    menu.addEventListener('click', e => { if (e.target.closest('a')) close(false); });
    matchMedia('(min-width: 52.01rem)').addEventListener('change', e => { if (e.matches) close(false); });
  }

  // The headline reveal follows the cursor. Pointer devices only.
  const drawn = document.querySelector('.drawn');
  if (drawn && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let frame = 0;
    drawn.addEventListener('pointermove', e => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = drawn.getBoundingClientRect();
        drawn.style.setProperty('--mx', (e.clientX - r.left).toFixed(1) + 'px');
        drawn.style.setProperty('--my', (e.clientY - r.top).toFixed(1) + 'px');
      });
    });
  }

  if (!reduce && document.querySelector('.enter')) root.classList.add('play');

  // Unobtrusive recorded excerpts. Hover or keyboard focus pauses playback.
  const replay = document.getElementById('session-replay');
  if (replay) {
    const frames = [...replay.querySelectorAll('[data-replay-frame]')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0, visible = false, hovered = false, focused = false, stopped = false, timer;
    const schedule = () => {
      clearTimeout(timer);
      if (!motion.matches && !stopped && !hovered && !focused && visible && !document.hidden) {
        timer = setTimeout(() => {
          current = (current + 1) % frames.length;
          frames.forEach((frame, i) => { frame.hidden = i !== current; });
          schedule();
        }, 7000);
      }
    };
    replay.addEventListener('mouseenter', () => { hovered = true; schedule(); });
    replay.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    replay.addEventListener('focusin', () => { focused = true; schedule(); });
    replay.addEventListener('focusout', e => { focused = replay.contains(e.relatedTarget); schedule(); });
    replay.addEventListener('keydown', e => {
      if (e.key === ' ' && e.target === replay) {
        e.preventDefault(); stopped = !stopped; focused = false; schedule();
      }
    });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, {threshold: .15}).observe(replay);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule);
  }

  // A native range supplies touch and keyboard semantics for the visual comparison.
  for (const range of document.querySelectorAll('.compare-range')) {
    const update = () => {
      range.closest('.comparison').style.setProperty('--split', range.value + '%');
      range.setAttribute('aria-valuetext', (100 - Number(range.value)) + ' percent reference-guided portfolio');
    };
    range.addEventListener('input', update);
    const position = e => {
      const box = range.getBoundingClientRect();
      range.value = Math.round(Math.max(0, Math.min(100, (e.clientX - box.left) / box.width * 100)));
      update();
    };
    range.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault(); range.focus({preventScroll:true});
      range.setPointerCapture(e.pointerId); position(e);
    });
    range.addEventListener('pointermove', e => {
      if (range.hasPointerCapture(e.pointerId)) position(e);
    });
    update();
  }

  // Mode tabs: real tabs, with arrow keys.
  for (const list of document.querySelectorAll('[role="tablist"]')) {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      for (const t of tabs) {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      }
      if (focus) tab.focus();
    };
    const active = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
    if (active) select(active, false);
    tabs.forEach((t, i) => {
      t.addEventListener('click', e => { e.preventDefault(); select(t, false); });
      t.addEventListener('keydown', e => {
        if (e.key === ' ' && t.tagName === 'A') { e.preventDefault(); select(t, false); }
        const k = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  }

  // Copy buttons. When the clipboard is blocked, select the text and say how.
  for (const b of document.querySelectorAll('.copy')) {
    b.addEventListener('click', () => {
      const el = document.getElementById(b.dataset.for);
      const text = el.textContent.trim();
      const label = b.textContent;
      const done = msg => {
        b.textContent = msg;
        b.setAttribute('data-done', '');
        setTimeout(() => { b.textContent = label; b.removeAttribute('data-done'); }, 1600);
      };
      const fallback = () => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        done(navigator.platform.includes('Mac') ? 'Press Cmd+C' : 'Press Ctrl+C');
      };
      if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(text).then(() => done('Copied'), fallback);
      else fallback();
    });
  }

  // Star count. The link always works; the number appears only once it is
  // worth showing, so a small count never argues against the project.
  const star = document.getElementById('star');
  if (star && navigator.onLine) {
    const threshold = Number(star.dataset.threshold || 100);
    fetch('https://api.github.com/repos/' + star.dataset.repo, { headers: { Accept: 'application/vnd.github+json' } })
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(d => {
        const n = d.stargazers_count;
        if (typeof n !== 'number' || n < threshold) return;
        const out = star.querySelector('.count');
        out.textContent = n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
        out.hidden = false;
      })
      .catch(() => {});
  }

})();

// Size the optical rim to the actual capsule, rather than stretching its corners.
(() => {
 const bar = document.querySelector('.bar .wrap');
 const map = document.getElementById('nav-glass-map');
 if (!bar || !map || !window.ResizeObserver) return;
 let previous = '';
 const draw = () => {
  const w = Math.round(bar.clientWidth), h = Math.round(bar.clientHeight);
  if (!w || !h || previous === w + ':' + h) return;
  previous = w + ':' + h;
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const context = canvas.getContext('2d'); if (!context) return;
  const pixels = context.createImageData(w, h), radius = h / 2;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
   const cx = Math.max(radius, Math.min(w - radius, x + .5));
   const dx = x + .5 - cx, dy = y + .5 - radius, length = Math.hypot(dx,dy);
   const depth = radius - length;
   const rim = depth > 0 && depth < 7 ? Math.sin(Math.PI * depth / 7) * 95 : 0;
   const offset = (y * w + x) * 4;
   pixels.data[offset] = 128 + (length ? dx / length * rim : 0);
   pixels.data[offset + 1] = 128 + (length ? dy / length * rim : 0);
   pixels.data[offset + 2] = 128; pixels.data[offset + 3] = 255;
  }
  context.putImageData(pixels,0,0); map.setAttribute('href',canvas.toDataURL());
 };
 new ResizeObserver(draw).observe(bar); draw();
})();
