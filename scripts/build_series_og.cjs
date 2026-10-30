const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8'));
const films=JSON.parse(fs.readFileSync(path.join(root,'films/series/manifest.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const dir=path.join(root,'site/static/og'),manifest=JSON.parse(fs.readFileSync(path.join(dir,'localized-manifest.json'),'utf8'));
 manifest.cards=manifest.cards.filter(c=>!films.some(f=>c.page==='film-'+f.slug));
 for(const f of films){
  const frames=Array.from({length:7},(_,i)=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,'site/static/media/films/stills',f.slug+'-'+i+'.webp')).toString('base64'));
  for(let n=0;n<locales.length;n++){
   const l=locales[n],cat=JSON.parse(fs.readFileSync(path.join(root,'films/series',l.code+'.json'),'utf8'));
   const art=[0,1].map(i=>`<img src="${frames[(n+i*3)%7]}" style="top:${160+i*205+(n%3)*7}px;left:${550+i*50+(n%5)*9}px;transform:rotate(${(i?5:-7)+(n%7)}deg)">`).join('');
   await page.setContent(`<html lang="${l.tag}"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:${f.slug==='fix-what-feels-wrong'?'#17191b':'#f5f4f0'};color:${f.slug==='fix-what-feels-wrong'?'white':'#17191b'};font-family:"Segoe UI",Arial,"Yu Gothic","Microsoft YaHei",sans-serif}.art{position:absolute;inset:0;overflow:hidden}.art img{position:absolute;width:540px;height:304px;object-fit:cover;border:1px solid #8886;border-radius:10px;box-shadow:0 20px 45px #0003}header{position:absolute;left:50px;top:42px;font-size:24px}h1{position:absolute;left:50px;top:160px;width:460px;font-size:66px;line-height:1.08;font-weight:400;letter-spacing:-2px;margin:0;direction:${l.code==='ar'?'rtl':'ltr'}}.play{position:absolute;left:52px;top:430px;border:1px solid #8888;border-radius:50%;width:60px;height:60px;display:grid;place-items:center;font-size:23px}footer{position:absolute;bottom:28px;left:50px;font-size:17px}.language{position:absolute;right:40px;top:45px;font-size:17px}</style></head><body><div class="art">${art}</div><header>Foreman / ${esc(f.tool)}</header><h1>${esc(cat[f.title])}</h1><div class="play">▶</div><span class="language">${esc(l.name)}${l.code==='en'?'':' · Beta'}</span><footer>Turki Alshuaibi<br>foreman.turkialshuaibi.com/films/</footer></body></html>`);
   await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>{const h=document.querySelector('h1');let size=66;while(h.getBoundingClientRect().height>235&&size>33)h.style.fontSize=--size+'px'});
   const file='film-'+f.slug+(l.code==='en'?'-v2':`-${l.code}-v3`)+'.png';await page.screenshot({path:path.join(dir,file)});
   if(l.code!=='en')manifest.cards.push({file,locale:l.code,page:'film-'+f.slug,artHash:crypto.createHash('sha256').update(art).digest('hex')});
  }
 }
 await browser.close();fs.writeFileSync(path.join(dir,'localized-manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log('132 unique series social cards generated.');
})().catch(e=>{console.error(e);process.exitCode=1});
