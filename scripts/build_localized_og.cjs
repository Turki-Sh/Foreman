// Original page-specific vector compositions, varied structurally for each locale.
// Rasterize locally so social crawlers receive a complete 1200x630 PNG.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8')).filter(l=>l.code!=='en');
const headlines={home:['Every good build','starts as a drawing.'],modes:['Three modes, one set of decisions.'],board:['Find a direction worth building.'],'punch-list':['Find what needs fixing.'],palette:['Choose colour with a reason.'],launch:['Get the site online.'],install:['Install Foreman.'],changelog:['Changelog.'],'404':['Off the plans.']};
const lost='data:image/webp;base64,'+fs.readFileSync(path.join(root,'site/static/media/foreman-lost.webp')).toString('base64');
const output=path.join(root,'site/static/og');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rect=(x,y,w,h,fill='#fff',r=8,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const line=(d,color='#c5c5c5',w=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const txt=(x,y,t,size=16,color='#777')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Arial,sans-serif">${esc(t)}</text>`;
const defs=`<defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fdfdfd"/><stop offset=".33" stop-color="#aaa"/><stop offset=".55" stop-color="#fafafa"/><stop offset="1" stop-color="#888"/></linearGradient><filter id="shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-opacity=".12"/></filter><radialGradient id="halo"><stop stop-color="#e5e1eb"/><stop offset="1" stop-color="#fafafa"/></radialGradient></defs>`;
function block(x,y,w,d,h){return `<g><path d="M${x} ${y}l${w} ${-w*.45} ${d} ${d*.45} ${-w} ${w*.45}Z" fill="#faf9f5"/><path d="M${x} ${y}v${h}l${d} ${d*.45}v${-h}Z" fill="#c6c3bc"/><path d="M${x+d} ${y+d*.45}l${w} ${-w*.45}v${h}l${-w} ${w*.45}Z" fill="#e2dfd8"/></g>`;}
function art(kind,n){
 const a=n%8,b=Math.floor(n/8),phase=n*.21;
 let s=`<circle cx="860" cy="335" r="280" fill="url(#halo)"/>`;
 if(kind==='home'){
  s+=`<g transform="translate(${580+b*8} ${205-a*2})">`;
  const positions=[[0,165],[85,115],[180,100],[290,135],[370,190],[185,255]];
  positions.forEach(([x,y],i)=>{const h=45+((n*23+i*41)%170),w=55+((n*13+i*11)%55);s+=block(x,y-h/2,w,65,h);});
  s+=line(`M0 360L200 270L480 395M60 385L265 292`,'#bbb',1)+'</g>';
 }else if(kind==='modes'){
  for(let i=0;i<3;i++){
   const x=605+i*170,y=130+((n+i*2)%5)*16,h=240+i*50-a*3;
   s+=`<g transform="rotate(${(i-1)*(3+b)} ${x+65} ${y+120})" filter="url(#shadow)">${rect(x,y,135,h,i===b%3?'#171717':'#fff',16,'stroke="#ddd"')}${txt(x+20,y+38,String(i+1).padStart(2,'0'),18,i===b%3?'#eee':'#555')}`;
   for(let j=0;j<3+i*2;j++)s+=rect(x+20,y+65+j*28,65+((n+j*11)%30),8,i===b%3?'#999':'#bbb',4);
   s+='</g>';
  }
  s+=line(`M660 530H1050M660 530V490M855 530V${460-a*3}M1050 530V490`,'#aaa',2);
 }else if(kind==='board'){
  s+=`<g transform="rotate(${-9+a} 840 315)">`;
  for(let i=0;i<4;i++){
   let x=595+(i%2)*245,y=115+Math.floor(i/2)*215;
   s+=`<g filter="url(#shadow)">${rect(x,y,224,195,i===1?'#161616':'#fff',10)}`;
   if(i===0)s+=block(x+20,y+50,75+a*4,70,70+b*8);
   if(i===1)s+=txt(x+20,y+95,'Aa',72,'#fff')+line(`M${x+20} ${y+135}h${140+a*4}`,'#888',5);
   if(i===2)for(let j=0;j<4;j++)s+=rect(x+14+j*49,y+18,42,105,['#e5dfd4','#b5a99b','#929095','#3c3c43'][(j+b)%4],3);
   if(i===3)for(let j=0;j<3;j++)s+=rect(x+20,y+20+j*38,80+((n+j*17)%100),20,'#ddd',3);
   s+=line(`M${x+20} ${y+164}h${100+a*7}`,'#aaa',3)+'</g>';
  }s+='</g>';
 }else if(kind==='punch-list'){
  let x=595,y=150+a*3;
  s+=`<g transform="rotate(${-4+b*2} 850 320)" filter="url(#shadow)">${rect(x,y,505,350,'#fff',16,'stroke="#ddd"')}${rect(x,y,505,35,'#eee',16)}`;
  for(let i=0;i<3;i++)s+=`<circle cx="${615+i*16}" cy="${y+18}" r="4" fill="#bbb"/>`;
  s+=rect(x+30,y+70,180+a*8,18,'#333',2)+rect(x+30,y+106,160,8,'#bbb',2)+rect(x+30,y+126,140,8,'#ccc',2)+rect(x+30,y+160,110,35,'#222',18)+rect(x+325,y+65,145,135,'#eee',6);
  for(let i=0;i<3;i++)s+=rect(x+30+i*150,y+230,130,80,'#f0f0f0',6);
  s+='</g>'+rect(607,y+146,147,61,'none',20,'stroke="#a16b55" stroke-width="2"')+line(`M755 ${y+175}H790V${y+205}H1060`,'#a16b55',2);
  s+=rect(906,y+185,200,55,'#f5eae3',10)+txt(925,y+220,'01  /  AA',20,'#80503d');
  s+=`<circle cx="${665+a*20}" cy="${y+286}" r="33" fill="none" stroke="#687f91" stroke-width="2"/>`;
 }else if(kind==='palette'){
  const palettes=[['#f1eee7','#c4b9a6','#938980','#5b5651','#242222'],['#ececf0','#c7c6d2','#9996ad','#676277','#34313f'],['#f2eee8','#d5c4ae','#b19a7d','#7c6c59','#3f3931'],['#e9eef0','#bbc7ce','#8c9aa5','#5b6875','#2d343e']];
  palettes[b].forEach((c,i)=>{let angle=(i-2)*(11+a),x=820,y=110+(n%3)*10;s+=`<g transform="rotate(${angle} 890 500)" filter="url(#shadow)">${rect(x,y,155,400,'#fff',14,'stroke="#ddd"')}${rect(x+10,y+10,135,282,c,7)}${txt(x+20,y+330,c.toUpperCase(),15)}<circle cx="890" cy="493" r="5" fill="#999"/></g>`;});
 }else if(kind==='launch'){
  s+=`<g transform="rotate(${a*4-10+b*5} 860 320)"><ellipse cx="860" cy="320" rx="${210+a*5}" ry="${100+b*18}" fill="none" stroke="#bdbbc3" stroke-width="2"/><path d="M840 405L814 550H906L880 405Z" fill="#d8d1e8" opacity=".6"/><path d="M860 105C800 174 805 310 823 410H897C915 310 920 174 860 105Z" fill="url(#metal)" stroke="#aaa"/><path d="M820 300L770 400V442L828 407M900 300L950 400V442L892 407" fill="#bbb"/><circle cx="860" cy="250" r="33" fill="#272731" stroke="#eee" stroke-width="8"/>${line('M836 380H884','#777',4)}</g>`;
  for(let i=0;i<3;i++){const ang=phase+i*2.1,x=860+235*Math.cos(ang),y=320+160*Math.sin(ang);s+=`<circle cx="${x}" cy="${y}" r="21" fill="#fff" stroke="#ccc"/>`+line(`M${x-8} ${y}l6 6 11-13`,'#555',2);}
 }else if(kind==='install'){
  for(let i=2;i>=0;i--)s+=`<g transform="rotate(${-12+a+i*3} 790 300)">${rect(620+i*20,150+i*14,300,280,'url(#metal)',14,'stroke="#bbb"')}${rect(645+i*20,175+i*14,170,125,'#fff',4)}${txt(665+i*20,220+i*14,'SKILL.md',22,'#444')}</g>`;
  s+=`<g filter="url(#shadow)">${rect(770-b*10,330+a*3,345,176,'#171717',18)}${txt(795-b*10,395+a*3,'> foreman',28,'#eee')}${line(`M795 ${440+a*3}h${100+a*12}`,'#666',7)}</g>`;
 }else if(kind==='changelog'){
  s+=line(`M650 110V530`,'#bbb',2);
  for(let i=0;i<3;i++){let y=135+i*125,x=700+((n+i*3)%5)*12;s+=`<circle cx="650" cy="${y+35}" r="${i===0?11:7}" fill="#333"/><g filter="url(#shadow)">${rect(x,y,360,92,i===b%3?'#222':'#fff',12,'stroke="#ddd"')}${txt(x+25,y+50,'0'+(3-i),30,i===b%3?'#fff':'#333')}${line(`M${x+100} ${y+33}h${160+a*4}M${x+100} ${y+56}h${120+a*5}`,i===b%3?'#777':'#ccc',5)}</g>`;}
 }else{
  s+=txt(610,390,'404',190,'#ddd')+`<image href="${lost}" x="${630+a*8}" y="${85+b*12}" width="440" height="440" preserveAspectRatio="xMidYMid meet"/>`;
  for(let i=0;i<3;i++)s+=block(610+i*170,470+((n+i)%3)*17,35+a*2,40,30+b*8);
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">${defs}${s}</svg>`;
}
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const meta=[];
 for(const file of fs.readdirSync(path.join(root,'site/pages')).filter(f=>f.endsWith('.html')&&f!=='films.html'&&!f.startsWith('film-'))){
  const source=fs.readFileSync(path.join(root,'site/pages',file),'utf8');
  const m=Object.fromEntries(source.match(/<!--\s*([\s\S]*?)-->/)[1].trim().split(/\r?\n/).map(l=>{const at=l.indexOf(': ');return[l.slice(0,at),l.slice(at+2)]}));
  meta.push({key:m.og||file.replace('.html',''),title:m.title,description:m.description});
 }
 const existingManifest=JSON.parse(fs.readFileSync(path.join(output,'localized-manifest.json'),'utf8'));
 const manifest={width:1200,height:630,cards:existingManifest.cards.filter(c=>c.page==='films'||c.page.startsWith('film-'))};
 for(let n=0;n<locales.length;n++){
  const lang=locales[n];
  if(process.argv[2] && lang.code!==process.argv[2])continue;
  const catalog=JSON.parse(fs.readFileSync(path.join(root,`site/i18n/${lang.code}.json`),'utf8'));
  for(const m of meta){
   const visual=art(m.key,n), title=headlines[m.key].map(t=>catalog[t]||t).join(' '), file=`${m.key}-${lang.code}-v3.png`;
   await page.setContent(`<html lang="${lang.tag}"><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#fafafa;color:#171717;font-family:"Segoe UI",Arial,"Microsoft YaHei","Yu Gothic","Malgun Gothic",sans-serif}.art{position:absolute;inset:0}.copy{position:absolute;left:56px;top:150px;width:500px;direction:${lang.code==='ar'?'rtl':'ltr'}}h1{font-size:49px;font-weight:400;letter-spacing:-1.5px;line-height:1.16;margin:0;text-wrap:balance;overflow-wrap:anywhere}header{position:absolute;top:42px;left:56px;display:flex;align-items:center;gap:13px;font-size:24px;font-weight:600}header img{width:32px;height:32px}footer{position:absolute;bottom:32px;left:56px;right:56px;display:flex;justify-content:space-between;align-items:center;font-size:16px;color:#666}small{font-size:12px;border:1px solid #bbb;padding:4px 6px;border-radius:5px;margin-inline-start:8px} .native{font-size:18px;color:#333}</style></head><body><div class="art">${visual}</div><header><img src="data:image/svg+xml;base64,${fs.readFileSync(path.join(root,'site/static/icons/favicon.svg')).toString('base64')}">Foreman</header><div class="copy"><h1>${esc(title)}</h1></div><footer><span>foreman.turkialshuaibi.com/${lang.code}/</span><span class="native" lang="${lang.tag}">${lang.name}<small>Beta</small></span></footer></body></html>`);
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>{const el=document.querySelector('h1');let size=49;while(el.getBoundingClientRect().height>340 && size>30)el.style.fontSize=--size+'px'});
   await page.screenshot({path:path.join(output,file)});
   manifest.cards.push({file,locale:lang.code,page:m.key,artHash:crypto.createHash('sha256').update(visual).digest('hex')});
  }
  console.log(lang.code+' '+meta.length+' cards');
 }
 await browser.close();
 fs.writeFileSync(path.join(output,'localized-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(manifest.cards.length+' original localized compositions');
})().catch(e=>{console.error(e);process.exitCode=1});
