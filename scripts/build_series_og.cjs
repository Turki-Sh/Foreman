// Render page-specific social cards from the final films. Locale editions use
// different frame pairs and layouts, rather than only replacing the headline.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8'));
const films=JSON.parse(fs.readFileSync(path.join(root,'films/cinema/manifest.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const data=p=>'data:image/webp;base64,'+fs.readFileSync(p).toString('base64');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const dir=path.join(root,'site/static/og'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'localized-manifest.json'),'utf8'));
 manifest.cards=manifest.cards.filter(c=>c.page!=='films'&&!c.page.startsWith('film-'));
 for(const f of [null,...films]){
  const key=f?'film-'+f.slug:'films',title=f?f.title:'Films';
  const frames=f?Array.from({length:7},(_,i)=>data(path.join(root,'site/static/media/films/stills13',f.slug+'-'+i+'.webp'))):films.map(x=>'data:image/jpeg;base64,'+fs.readFileSync(path.join(root,'site/static',x.poster.slice(1))).toString('base64'));
  for(let n=0;n<locales.length;n++){
   const l=locales[n],cat=l.code==='en'?{}:JSON.parse(fs.readFileSync(path.join(root,'site/i18n',l.code+'.json'),'utf8'));
   const count=f?2:3;const art=Array.from({length:count},(_,i)=>`<img src="${frames[(n+i*(2+Math.floor(n/7)))%frames.length]}" style="top:${(f?120:75)+i*(f?230:168)+(n%4)*7}px;left:${565+i*22+(n%5)*7}px;transform:rotate(${(i?5:-6)+(n%7)-3}deg)">`).join('');
   const dark=f&&['find-your-direction','colour-that-works'].includes(f.slug),bg=dark?'#05070b':'#fff',fg=dark?'#fff':'#080b10';
   await page.setContent(`<html lang="${l.tag}"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:${bg};color:${fg};font-family:"Segoe UI",Arial,"Yu Gothic","Microsoft YaHei",sans-serif}.art{position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at 95% 75%,${dark?'#162444':'#dbedff'},transparent 65%)}.art img{position:absolute;width:560px;height:315px;object-fit:cover;border:1px solid #8885;border-radius:16px;box-shadow:0 18px 50px #0004}header{position:absolute;left:48px;top:40px;font-size:24px}h1{position:absolute;left:48px;top:158px;width:470px;font-size:68px;line-height:1.08;font-weight:450;letter-spacing:-2px;margin:0;direction:${l.code==='ar'?'rtl':'ltr'}}.play{position:absolute;left:50px;top:450px;border:1px solid #8888;border-radius:50%;width:56px;height:56px;display:grid;place-items:center;font-size:20px}footer{position:absolute;bottom:28px;left:48px;font-size:16px;line-height:1.6}.language{position:absolute;right:40px;top:45px;font-size:16px}</style></head><body><div class="art">${art}</div><header>Foreman</header><h1>${esc(cat[title]||title)}</h1><div class="play">▶</div><span class="language">${esc(l.name)}${l.code==='en'?'':' · Beta'}</span><footer>Turki Alshuaibi<br>foreman.turkialshuaibi.com/film/</footer></body></html>`);
   await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>{const h=document.querySelector('h1');let size=68;while(h.getBoundingClientRect().height>255&&size>31)h.style.fontSize=--size+'px'});
   const file=key+(l.code==='en'?'-v13':`-${l.code}-v13`)+'.png';await page.screenshot({path:path.join(dir,file)});
   if(l.code!=='en')manifest.cards.push({file,locale:l.code,page:key,artHash:crypto.createHash('sha256').update(art).digest('hex')});
  }
  console.log(key+' social cards rendered');
 }
 await browser.close();fs.writeFileSync(path.join(dir,'localized-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
