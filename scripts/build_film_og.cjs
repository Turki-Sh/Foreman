// Film-specific social cards. Each edition has a distinct frame arrangement.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8'));
const frames=fs.readdirSync(path.join(root,'site/static/media/films/stills')).filter(f=>f.endsWith('.webp')).sort().map(f=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,'site/static/media/films/stills',f)).toString('base64'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const dir=path.join(root,'site/static/og');
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,'localized-manifest.json'),'utf8'));
 manifest.cards=manifest.cards.filter(c=>c.page!=='films');
 for(let n=0;n<locales.length;n++){
  const l=locales[n],catalog=l.code==='en'?{}:JSON.parse(fs.readFileSync(path.join(root,'site/i18n',l.code+'.json'),'utf8'));
  const title=catalog['Before the code.']||'Before the code.';
  const art=[0,1,2].map((i)=>{const frame=(n+i*3)%frames.length;return `<img src="${frames[frame]}" style="left:${565+i*70+(n%4)*9}px;top:${100+i*155-(n%3)*12}px;transform:rotate(${(i-1)*9+(n%7)-3}deg);z-index:${i}">`}).join('');
  await page.setContent(`<html lang="${l.tag}"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#f8f8f6;color:#111;font-family:"Segoe UI",Arial,"Yu Gothic","Microsoft YaHei",sans-serif}.art{position:absolute;inset:0;overflow:hidden}.art img{position:absolute;width:470px;height:264px;object-fit:cover;box-shadow:0 20px 45px #0003;border:1px solid #aaa;border-radius:6px}header{position:absolute;top:42px;left:54px;font-size:23px;font-weight:500}h1{position:absolute;top:164px;left:54px;max-width:490px;margin:0;font-weight:400;font-size:69px;line-height:1.07;letter-spacing:-3px;direction:${l.code==='ar'?'rtl':'ltr'}}.play{position:absolute;left:57px;top:412px;width:66px;height:66px;border-radius:100%;background:#111;display:grid;place-items:center;color:white;font-size:24px}footer{position:absolute;bottom:30px;left:54px;font-size:15px;color:#555}.language{position:absolute;top:47px;right:54px;color:#555;font-size:17px}</style></head><body><div class="art">${art}</div><header>Foreman / ${esc(catalog.Films||'Films')}</header><h1>${esc(title)}</h1><div class="play">▶</div><div class="language">${esc(l.name)}${l.code==='en'?'':' · Beta'}</div><footer>Turki Alshuaibi<br>foreman.turkialshuaibi.com/films/</footer></body></html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{const h=document.querySelector('h1');let size=69;while(h.getBoundingClientRect().height>218&&size>36)h.style.fontSize=--size+'px'});
  const file=l.code==='en'?'films-v2.png':`films-${l.code}-v3.png`;
  await page.screenshot({path:path.join(dir,file)});
  if(l.code!=='en')manifest.cards.push({file,locale:l.code,page:'films',artHash:crypto.createHash('sha256').update(art).digest('hex')});
 }
 await browser.close();
 fs.writeFileSync(path.join(dir,'localized-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log('33 film cards with distinct frame compositions');
})().catch(e=>{console.error(e);process.exitCode=1});
