// Foreman site. Progressive enhancement only: every page is complete without
// this file, and every behaviour here is something a person asked for by
// pointing, clicking, or loading the page once.

(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // The header turns to drafting vellum once the page moves under it.
  const onScroll = () => {
    if (scrollY > 8) root.setAttribute('data-scrolled', '');
    else root.removeAttribute('data-scrolled');
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
    if (meta) meta.content = t === 'dark' ? '#0A2444' : '#FFFFFF';
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
    const close = (focusBack) => {
      root.removeAttribute('data-menu');
      menuBtn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('inert', '');
      if (focusBack) menuBtn.focus();
    };
    menu.setAttribute('inert', '');
    menuBtn.addEventListener('click', () => {
      const open = !root.hasAttribute('data-menu');
      if (!open) return close(false);
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

  // The one entrance, on the home page: each drawn path gets its true length,
  // then the page plays once. Without this, everything is already in place.
  const paths = document.querySelectorAll('.drawing .ink-path');
  if (paths.length && !reduce.matches) {
    for (const p of paths) p.style.setProperty('--len', Math.ceil(p.getTotalLength()));
    root.classList.add('play');
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
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', e => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
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

  // The foreman in the footer signs off the sheet. Each press stamps the next
  // mark somewhere on the blueprint, the way a drawing collects its approvals.
  const foreman = document.querySelector('.foreman');
  if (foreman) {
    const marks = ['Approved', 'Checked', 'As built', 'Signed off', 'Shipped'];
    let n = 0;
    foreman.addEventListener('click', () => {
      const sheet = foreman.closest('.sheetfoot');
      const old = sheet.querySelectorAll('.inked');
      if (old.length >= 3) old[0].remove();
      const s = document.createElement('span');
      s.className = 'inked';
      s.textContent = marks[n++ % marks.length];
      s.setAttribute('aria-hidden', 'true');
      const w = sheet.clientWidth, h = sheet.clientHeight;
      s.style.left = Math.round(w * (0.08 + Math.random() * 0.5)) + 'px';
      s.style.top = Math.round(h * (0.12 + Math.random() * 0.35)) + 'px';
      s.style.setProperty('--r', (Math.random() * 16 - 8).toFixed(1) + 'deg');
      s.style.transform = 'rotate(var(--r))';
      sheet.appendChild(s);
      foreman.setAttribute('aria-label', 'Stamp the sheet again. Last stamp: ' + s.textContent);
    });
  }
})();
