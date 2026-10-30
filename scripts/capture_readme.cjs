// Recreate README images from the current local site and the exact skill card.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const {chromium} = require(require.resolve('playwright-core', {paths: [path.join(root, 'bench'), __dirname]}));
const base = process.argv[2] || 'http://127.0.0.1:3217';
const out = path.join(root, 'site/static/previews');
const read = p => fs.readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
(async () => {
  const version = JSON.parse(read('plugins/foreman/.claude-plugin/plugin.json')).version;
  const skillPath = 'plugins/foreman/skills/foreman/SKILL.md';
  const cardText = read(skillPath).match(/Send it exactly as written[^\n]*\n\n```\n([\s\S]*?)\n```/)[1];
  fs.mkdirSync(out, {recursive:true});
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1040},deviceScaleFactor:1,reducedMotion:'reduce'});
    await page.goto(base, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.opening-scene').evaluate(e => e.decode());
    const screenshot = 'site-2026-10-30.png';
    await page.screenshot({path:path.join(out,screenshot)});
    const card = `card-${version}.png`;
    await page.setViewportSize({width:1200,height:1600});
    await page.setContent(`<html><head><style>body{margin:0;background:#080808;color:#eee}article{width:max-content;padding:40px}p{font:18px Consolas,monospace;color:#aaa;margin:0 0 32px}pre{font:18px/1.4 Consolas,monospace;margin:0;white-space:pre}</style></head><body><article><p>› help me build my portfolio</p><pre>${escape(cardText)}</pre></article></body></html>`);
    await page.locator('article').screenshot({path:path.join(out,card)});
    const inputs = {};
    for (const file of ['docs/index.html','docs/site.css','docs/opening.css','docs/mono.css','docs/site.js','docs/media/architecture.webp',skillPath,'scripts/capture_readme.cjs']) {
      inputs[file] = sha(file.endsWith('.webp') ? fs.readFileSync(path.join(root,file)) : read(file));
    }
    const manifest = {version,screenshot,card,cardTextHash:sha(cardText),inputs,images:{}};
    for (const file of [screenshot,card]) manifest.images[file] = sha(fs.readFileSync(path.join(out,file)));
    fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
    console.log(`Captured current homepage and exact Foreman ${version} card.`);
  } finally {await browser.close();}
})().catch(e => {console.error(e);process.exitCode=1;});
