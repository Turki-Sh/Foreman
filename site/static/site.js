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

  // The board: one drawing, from its first decision to live, in about eleven
  // seconds. Every element's resting state is the finished drawing, so the
  // page is complete without this; the sequence plays from it, once.
  const board = document.getElementById('board');
  if (board) {
    const $ = s => board.querySelector(s);
    const $$ = s => [...board.querySelectorAll(s)];
    const PHASES = [[0, '1 of 8', 'Orient'], [500, '2 of 8', 'Decide'], [3200, '3 of 8', 'Look'], [5400, '4 of 8', 'Brief'],
      [6200, '5 of 8', 'Build'], [8400, '6 of 8', 'Verify'], [10000, '7 of 8', 'Ship'], [10900, '8 of 8', 'Index']];
    const END = 11600;
    const rail = $$('.rail .s');
    const sheetOut = $('[data-sheet]');
    const phaseOut = $('[data-phase]');
    const setPhase = t => {
      let i = 0;
      PHASES.forEach((p, k) => { if (t >= p[0]) i = k; });
      sheetOut.textContent = PHASES[i][1];
      phaseOut.textContent = PHASES[i][2];
      rail.forEach((r, k) => { r.dataset.state = k < i ? 'done' : k === i ? 'now' : 'next'; });
    };

    if (reduce) {
      setPhase(END);
    } else {
      const anims = [];
      const IN = 'cubic-bezier(.22,.61,.36,1)';
      const POP = 'cubic-bezier(.3,1.5,.5,1)';
      const A = (el, kf, start, dur, easing = IN) => {
        if (!el) return null;
        const a = el.animate(kf, { delay: start, duration: dur, fill: 'both', easing });
        anims.push(a);
        return a;
      };
      const len = el => { try { return Math.ceil(el.getTotalLength()); } catch (e) { return 600; } };
      const draw = (el, start, dur) => {
        const L = len(el);
        A(el, [{ strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 }], start, dur);
      };
      const rise = [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }];
      const pop = [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'scale(1)' }];

      // Decide: each decision arrives as a keyed note, and locks.
      for (const [n, t] of [[1, 600], [2, 1250], [3, 1900], [5, 2500], [4, 4500]]) {
        const li = $(`[data-note="${n}"]`);
        A(li, rise, t, 450);
        A(li.querySelector('.lock'), pop, t + 600, 280, POP);
        const key = $(`.key[data-key="${n}"]`);
        if (key) { key.style.transformBox = 'fill-box'; key.style.transformOrigin = 'center'; A(key, pop, t + 150, 360, POP); }
      }
      $$('.chips i').forEach((c, i) => A(c, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], 4800 + i * 130, 320, POP));

      // Look: the page is drawn, line by line, then the lines fade back as the build arrives.
      $$('.plan .draw').forEach((p, i) => draw(p, 3200 + i * 95, 700));
      A($('.plan .lines'), [{ opacity: 1 }, { opacity: 1, offset: 0.66 }, { opacity: 0.3 }], 3000, 4800);

      // Brief: frozen, and stamped.
      A($('.stamp-brief'), [{ opacity: 0, transform: 'rotate(-16deg) scale(1.7)' }, { opacity: 1, transform: 'rotate(-7deg) scale(1)' }], 5500, 420, POP);

      // Build: the drawing fills in as the page, and the gait trace is plotted.
      A($('.plan .render'), [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], 6200, 1500, 'cubic-bezier(.65,0,.35,1)');
      draw($('.plan .trace'), 7600, 800);

      // Verify: two defects marked in red, then fixed and marked in green.
      for (const [v, t] of [['a', 8500], ['b', 8950]]) {
        const [cNo, tNo, cOk, tOk] = $(`.verify[data-v="${v}"]`).children;
        const L = len(cNo);
        const span = 9700 - t;
        const k = 300 / span;
        A(cNo, [
          { opacity: 1, strokeDasharray: `${L} ${L}`, strokeDashoffset: L },
          { opacity: 1, strokeDasharray: `${L} ${L}`, strokeDashoffset: 0, offset: k },
          { opacity: 1, strokeDasharray: `${L} ${L}`, strokeDashoffset: 0, offset: 0.9 },
          { opacity: 0, strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 },
        ], t, span);
        A(tNo, [{ opacity: 0 }, { opacity: 1, offset: k }, { opacity: 1, offset: 0.9 }, { opacity: 0 }], t + 150, span - 150);
        draw(cOk, 9700, 320);
        A(tOk, [{ opacity: 0 }, { opacity: 1 }], 9800, 240);
      }

      // Ship and index: the address arrives and the drawing is stamped live.
      A($('.plan .url'), [{ opacity: 0 }, { opacity: 1 }], 10100, 300);
      A($('.stamp-live'), [{ opacity: 0, transform: 'rotate(-14deg) scale(1.7)' }, { opacity: 1, transform: 'rotate(-6deg) scale(1)' }], 10400, 420, POP);

      // One clock for the title block, the rail and the controls.
      const clock = $('.titleblock').animate([{ opacity: 1 }, { opacity: 1 }], { duration: END });
      anims.push(clock);
      root.classList.remove('pre');

      const ctl = document.createElement('button');
      ctl.type = 'button';
      $('.titleblock .ctl').appendChild(ctl);
      const label = () => {
        const s = clock.playState;
        ctl.textContent = s === 'finished' ? 'Replay' : s === 'paused' ? 'Play' : 'Pause';
        ctl.setAttribute('aria-label', s === 'finished' ? 'Replay the drawing' : s === 'paused' ? 'Play the drawing' : 'Pause the drawing');
      };
      let raf = 0;
      const tick = () => {
        setPhase(clock.currentTime || 0);
        label();
        raf = clock.playState === 'running' ? requestAnimationFrame(tick) : 0;
      };
      const play = () => { anims.forEach(a => a.play()); if (!raf) raf = requestAnimationFrame(tick); };
      const seek = t => { anims.forEach(a => { a.currentTime = t; }); play(); };
      ctl.addEventListener('click', () => {
        const s = clock.playState;
        if (s === 'running') { anims.forEach(a => a.pause()); setPhase(clock.currentTime); label(); }
        else if (s === 'finished') seek(0);
        else play();
      });
      clock.finished.then(() => { setPhase(END); label(); });

      // Each step on the rail jumps the drawing to that point.
      rail.forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = s.className;
        b.dataset.at = s.dataset.at;
        b.innerHTML = s.innerHTML;
        b.setAttribute('aria-label', 'Jump to step ' + s.textContent.replace(/\s+/g, ' ').trim());
        b.addEventListener('click', () => seek(Number(b.dataset.at)));
        s.replaceWith(b);
      });
      rail.length = 0;
      rail.push(...$$('.rail .s'));
      tick();
    }
  }

  // The building rises with the steps: pointing at a step lights its floor.
  const wrap = document.querySelector('.steps-wrap');
  if (wrap) {
    const levels = [...wrap.querySelectorAll('.building .lvl')];
    for (const row of wrap.querySelectorAll('.row')) {
      row.addEventListener('mouseenter', () => {
        wrap.setAttribute('data-hover', '');
        levels.forEach(l => l.classList.toggle('on', Number(l.dataset.step) <= Number(row.dataset.step)));
      });
      row.addEventListener('mouseleave', () => {
        wrap.removeAttribute('data-hover');
        levels.forEach(l => l.classList.remove('on'));
      });
    }
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
