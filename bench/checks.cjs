// Measure a built site the way a visitor meets it. Prints one JSON object.
//   node bench/checks.cjs <site-folder> [<screenshot-folder>]
// Needs playwright-core and an installed Chrome (npm install --prefix bench).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const site = path.resolve(process.argv[2]);
const shots = process.argv[3] ? path.resolve(process.argv[3]) : null;
const THROWAWAY = new Set(['brand.html', 'board.html']);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2' };

function pages(dir, rel = '') {
  let out = [];
  for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const r = path.posix.join(rel, e.name);
    if (e.isDirectory()) out = out.concat(pages(dir, r));
    else if (/\.html?$/i.test(e.name) && !THROWAWAY.has(e.name)) out.push(r);
  }
  return out;
}

function serve(root) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let f = path.join(root, p);
    if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) {
      const nf = path.join(root, '404.html');
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => server.listen(0, '127.0.0.1', () => r(server)));
}

// Runs inside the page.
function measure() {
  const lum = c => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (a === 0) return null;
    const f = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return { L: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a, rgb: [r, g, b] };
  };
  const own = e => {
    const s = getComputedStyle(e);
    if (s.backgroundImage && s.backgroundImage !== 'none') return 'image';
    const l = lum(s.backgroundColor);
    return l && l.a > 0.9 ? l : null;
  };
  // What is painted under the text, not only its ancestors: a transparent
  // header over a hero sits on a sibling, so read the stack at the text's
  // centre when it is on screen, and fall back to the ancestors otherwise.
  const bgOf = el => {
    for (let e = el; e; e = e.parentElement) { const b = own(e); if (b) return b; if (getComputedStyle(e).position === 'sticky' || getComputedStyle(e).position === 'fixed') break; }
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x >= 0 && y >= 0 && x < innerWidth && y < innerHeight) {
      for (const e of document.elementsFromPoint(x, y)) {
        if (e === el || el.contains(e) || e.contains(el)) continue;
        const b = own(e); if (b) return b;
      }
    }
    for (let e = el; e; e = e.parentElement) { const b = own(e); if (b) return b; }
    return lum('rgb(255, 255, 255)');
  };
  let checked = 0, failed = 0; const fails = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!(el instanceof HTMLElement) || !el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) continue;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || +s.opacity === 0) continue;
    const fg = lum(s.color); const bg = bgOf(el);
    if (!fg || bg === 'image' || !bg) continue;
    checked++;
    const ratio = (Math.max(fg.L, bg.L) + 0.05) / (Math.min(fg.L, bg.L) + 0.05);
    const size = parseFloat(s.fontSize), bold = +s.fontWeight >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (ratio < need) { failed++; if (fails.length < 5) fails.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 40)}" ${ratio.toFixed(2)}`); }
  }
  let hover = 0, focus = 0, outlineNone = 0, gradientText = 0;
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    const walk = list => { for (const r of list) {
      if (r.cssRules) walk(r.cssRules);
      const sel = r.selectorText || '';
      if (sel.includes(':hover')) hover++;
      if (sel.includes(':focus')) focus++;
      if (r.style && /none|0/.test(r.style.outlineStyle || r.style.outline || '') && sel.includes(':focus')) outlineNone++;
    } };
    walk(rules);
  }
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if ((s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') && /gradient/.test(s.backgroundImage)) gradientText++;
  }
  const q = s => document.querySelector(s);
  const attr = (s, a) => (q(s) && q(s).getAttribute(a)) || '';
  const ogImage = attr('meta[property="og:image"]', 'content');
  const cta = [...document.querySelectorAll('a, button')].find(e => { const b = lum(getComputedStyle(e).backgroundColor); return b && b.a > 0.9 && e.offsetParent; });
  const rootVars = {};
  const rs = getComputedStyle(document.documentElement);
  for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const r of rules) if (r.selectorText === ':root' && r.style) for (const n of r.style) if (n.startsWith('--')) rootVars[n] = rs.getPropertyValue(n).trim(); }
  return {
    text: document.body ? document.body.innerText : '',
    alts: [...document.querySelectorAll('img[alt]')].map(i => i.alt).join(' '),
    description: attr('meta[name="description"]', 'content'),
    meta: {
      title: !!(document.title || '').trim(),
      description: !!attr('meta[name="description"]', 'content'),
      canonical: !!q('link[rel="canonical"]'),
      og_title: !!q('meta[property="og:title"]'),
      og_image: !!ogImage,
      og_image_absolute: /^https?:\/\//.test(ogImage),
      twitter_card: !!q('meta[name="twitter:card"]'),
      json_ld: !!q('script[type="application/ld+json"]'),
      lang: !!document.documentElement.lang,
      viewport: !!q('meta[name="viewport"]'),
      favicon: !!q('link[rel~="icon"]'),
    },
    dead_links: [...document.querySelectorAll('a')].filter(a => { const h = a.getAttribute('href'); return h === null || h === '' || h === '#' || /^javascript:/i.test(h); }).length,
    internal_links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && !/^(https?:|mailto:|tel:|#|javascript:|\/\/)/i.test(h)),
    contrast: { checked, failed, examples: fails },
    css: { hover_rules: hover, focus_rules: focus, focus_outline_removed: outlineNone },
    gradient_text: gradientText,
    colors: {
      ground: getComputedStyle(document.body).backgroundColor,
      heading: q('h1') ? getComputedStyle(q('h1')).color : null,
      cta: cta ? getComputedStyle(cta).backgroundColor : null,
      link: (q('main p a, p a, article a, main a') || q('a')) ? getComputedStyle(q('main p a, p a, article a, main a') || q('a')).color : null,
      root_vars: rootVars,
    },
    fonts: { body: getComputedStyle(document.body).fontFamily, heading: q('h1') ? getComputedStyle(q('h1')).fontFamily : null },
    h1_count: document.querySelectorAll('h1').length,
  };
}

(async () => {
  const list = pages(site);
  const out = { pages: list, main: null, per_page: {}, status_404: null, has_404_page: fs.existsSync(path.join(site, '404.html')), robots: fs.existsSync(path.join(site, 'robots.txt')), sitemap: fs.existsSync(path.join(site, 'sitemap.xml')) };
  if (!list.length) { console.log(JSON.stringify(out)); return; }
  const main = list.includes('index.html') ? 'index.html' : list[0];
  out.main = main;
  const server = await serve(site);
  const base = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, channel: process.env.CHROME_CHANNEL || 'chrome' });
  try {
    const desk = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const phone = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', isMobile: true });
    for (const p of list.filter(p => p !== '404.html').slice(0, +(process.env.MAX_PAGES || 6))) {
      const page = await desk.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(base + p, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => errors.push(String(e)));
      await page.waitForTimeout(400);
      const m = await page.evaluate(measure);
      const broken = [];
      for (const h of [...new Set(m.internal_links)].slice(0, 40)) {
        const u = new URL(h, base + p).href;
        const r = await desk.request.get(u).catch(() => null);
        if (!r || r.status() >= 400) broken.push(h);
      }
      const ph = await phone.newPage();
      await ph.goto(base + p, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
      await ph.waitForTimeout(300);
      // Against the device's 375, not innerWidth: in a mobile context the layout
      // viewport stretches to fit wide content, so innerWidth grows with the bug.
      const overflow = await ph.evaluate(() => document.documentElement.scrollWidth - 375);
      if (shots && p === main) {
        fs.mkdirSync(shots, { recursive: true });
        await page.screenshot({ path: path.join(shots, 'desktop.png') });
        await ph.screenshot({ path: path.join(shots, 'phone.png') });
      }
      out.per_page[p] = { ...m, console_errors: errors.length, broken_links: broken, overflow_375: overflow > 1 ? overflow : 0 };
      await page.close(); await ph.close();
    }
    const r = await desk.request.get(base + 'this-page-does-not-exist-7f3a/').catch(() => null);
    out.status_404 = r ? r.status() : null;
  } finally {
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(out));
})().catch(e => { console.log(JSON.stringify({ error: String(e) })); process.exit(0); });
