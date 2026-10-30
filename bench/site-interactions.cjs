const { chromium } = require('playwright-core');
// Run against a local preview: node bench/site-interactions.cjs http://127.0.0.1:3217
const base = (process.argv[2] || 'http://127.0.0.1:3217').replace(/\/$/, '');
const out = [];
const ok = (c, m) => out.push((c ? 'PASS ' : 'FAIL ') + m);
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  // motion played
  ok(await p.isVisible('#hero-h'), 'hero is visible immediately');
  // tabs by click and keys
  await p.click('#tab-survey');
  ok(await p.evaluate(() => !document.getElementById('p-survey').hidden && document.getElementById('p-blueprint').hidden), 'clicking Survey shows its panel');
  await p.focus('#tab-survey'); await p.keyboard.press('ArrowRight');
  ok(await p.evaluate(() => document.activeElement.id === 'tab-stress' && !document.getElementById('p-stress').hidden), 'ArrowRight moves to Stress test');
  await p.keyboard.press('Home');
  ok(await p.evaluate(() => document.activeElement.id === 'tab-blueprint'), 'Home returns to Blueprint');
  // theme
  await p.click('.theme');
  ok(await p.evaluate(() => document.documentElement.dataset.theme === 'dark' && localStorage.getItem('foreman-theme') === 'dark'), 'theme toggles to dark and is remembered');
  await p.reload({ waitUntil: 'networkidle' });
  ok(await p.evaluate(() => document.documentElement.dataset.theme === 'dark'), 'dark survives a reload');
  await p.click('.theme');
  ok(await p.evaluate(() => !document.documentElement.dataset.theme), 'theme toggles back to light');
  // copy
  await p.click('button.copy[data-for="cc"]');
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok(clip.includes('/plugin install foreman@alshuaibi'), 'copy puts both install lines on the clipboard');
  ok((await p.textContent('button.copy[data-for="cc"]')) === 'Copied', 'copy button says Copied');
  // scrolled header
  await p.evaluate(() => scrollTo(0, 600)); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.documentElement.hasAttribute('data-scrolled')), 'header turns to vellum on scroll');
  const bg = await p.evaluate(() => getComputedStyle(document.querySelector('.bar .wrap')).backdropFilter);
  ok(bg.includes('blur') || await p.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches), 'header uses blur or the requested reduced-transparency fallback: ' + bg);
  // foreman stamp
  await p.click('.foreman'); await p.click('.foreman');
  ok(await p.evaluate(() => document.querySelectorAll('.inked').length === 2), 'the foreman stamps the sheet twice');
  // every internal link resolves
  const links = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0]))]);
  for (const l of links) { const r = await ctx.request.get(base + l); ok(r.status() === 200, 'link ' + l + ' -> ' + r.status()); }
  // mobile menu
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(base + '/modes/', { waitUntil: 'networkidle' });
  ok(await p.isVisible('.menubtn') && !(await p.isVisible('.nav')), 'phone shows the menu button, not the nav');
  await p.click('.menubtn');
  await p.waitForTimeout(400);
  ok(await p.evaluate(() => document.documentElement.hasAttribute('data-menu') && document.activeElement.closest('#menu') !== null), 'menu opens and focus moves into it');
  await p.keyboard.press('Escape');
  ok(await p.evaluate(() => !document.documentElement.hasAttribute('data-menu') && document.activeElement.classList.contains('menubtn')), 'Escape closes it and returns focus');
  const tap = await p.evaluate(() => [...document.querySelectorAll('.bar a, .bar button')].filter(e => e.offsetParent).map(e => { const r = e.getBoundingClientRect(); return [e.className || e.textContent.trim(), Math.round(r.width), Math.round(r.height)]; }));
  ok(tap.every(([, w, h]) => w >= 24 && h >= 24), 'header targets at least 24px: ' + JSON.stringify(tap));
  ok(errs.length === 0, 'no page errors ' + errs.join(' | '));

  // Clean autoplay: hover, keyboard and reduced motion still stop playback.
  const bc = await b.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const bp = await bc.newPage(); const berr = []; bp.on('pageerror', e => berr.push(String(e)));
  await bp.goto(base + '/');
  await bp.locator('#session-replay').scrollIntoViewIfNeeded();
  await bp.mouse.move(0, 0);
  const active = () => bp.locator('[data-replay-frame]').evaluateAll(es=>es.findIndex(e=>!e.hidden));
  const height = (await bp.locator('#session-replay').boundingBox()).height;
  ok(await bp.locator('.agent-marks a').count() === 5, 'five agent marks are present');
  ok(await bp.locator('.replay-toggle,.replay-steps,.replay-provenance,.replay-bottom').count() === 0, 'replay controls and captions are removed');
  const first = await active();
  await bp.waitForTimeout(7200);
  ok(await active() !== first, 'recorded session advances automatically');
  await bp.locator('#session-replay').hover();
  const held = await active(); await bp.waitForTimeout(7200);
  ok(await active() === held, 'hover pauses the recorded session');
  await bp.mouse.move(0, 0);
  await bp.focus('#session-replay');
  const focused = await active(); await bp.waitForTimeout(7200);
  ok(await active() === focused, 'keyboard focus pauses the recorded session');
  await bp.keyboard.press('Space'); await bp.keyboard.press('Space');
  await bp.waitForTimeout(7200);
  ok(await active() !== focused, 'Space can resume playback without a visible toolbar');
  ok(Math.abs((await bp.locator('#session-replay').boundingBox()).height-height)<1, 'replay height remains stable');
  // the step viewer: every step shows the real thing it produced
  await bp.click('#step-5'); await bp.waitForTimeout(100);
  ok(await bp.evaluate(() => !document.getElementById('v-5').hidden && document.getElementById('v-1').hidden && document.getElementById('step-5').getAttribute('aria-selected') === 'true'), 'clicking Build shows what the build produced');
  await bp.focus('#step-5'); await bp.keyboard.press('ArrowDown');
  ok(await bp.evaluate(() => document.activeElement.id === 'step-6' && !document.getElementById('v-6').hidden), 'ArrowDown moves to Verify');
  ok(await bp.evaluate(() => [...document.querySelectorAll('.viewer img')].every(i => i.getAttribute('width') && i.getAttribute('height') && i.alt.length > 20)), 'every viewer image has a size and a real description');
  ok(berr.length === 0, 'no showcase errors ' + berr.join('|'));

  // reduced motion leaves the page finished
  const rm = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const q = await rm.newPage(); await q.goto(base + '/', { waitUntil: 'networkidle' });
  ok(!(await q.evaluate(() => document.documentElement.classList.contains('play'))), 'reduced motion: no entrance, page at rest');
  ok(await q.evaluate(() => document.getAnimations().length === 0 && !document.querySelector('[data-replay-frame]').hidden), 'reduced motion: the showcase is still, and complete');
  // no JS: content is all there
  const nj = await b.newContext({ javaScriptEnabled: false }); const r = await nj.newPage(); await r.goto(base + '/');
  ok((await r.isVisible('#hero-h')) && (await r.isVisible('#p-blueprint')) && (await r.isVisible('.terminal-file')), 'without JavaScript the page is complete');
    ok(await r.locator('[role="tabpanel"]:visible').count() === 11, 'no JavaScript: all three modes and all eight step artifacts remain readable');
  ok(await r.locator('.rows a[tabindex="0"]').count() === 8, 'no JavaScript: every step link remains keyboard reachable');
  await bp.focus('#step-5'); await bp.keyboard.press('Space');
  ok(await bp.evaluate(() => !document.getElementById('v-5').hidden), 'Space activates a step tab');
  const missing = await ctx.request.get(base + '/does-not-exist');
  ok(missing.status() === 404 && (await missing.text()).includes('<footer'), 'unknown paths return a real 404 with site chrome');
  await b.close();
  console.log(out.join('\n')); if (out.some(line => line.startsWith('FAIL'))) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
