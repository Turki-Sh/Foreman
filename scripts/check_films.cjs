// Browser integration checks for the five final films and custom caption menu.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const films=JSON.parse(fs.readFileSync(path.join(root,'films/cinema/manifest.json'),'utf8'));
const base=process.env.FILM_BASE_URL||'http://127.0.0.1:3237';const out=process.env.FILM_QA_DIR;
(async()=>{
 const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));const checks=[];
 for(const width of [1440,390])for(const f of films){
  await p.setViewportSize({width,height:width===390?844:1000});await p.goto(base+'/film/'+f.slug+'/',{waitUntil:'networkidle'});await p.waitForSelector('.film-player');
  assert.equal(await p.locator('.film-cc-list [role=option]').count(),34);assert.equal(await p.locator('select.film-cc').count(),0);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'page overflow '+width+' '+f.slug);
  await p.locator('.film-big-play').click();await p.waitForFunction(()=>document.querySelector('video').currentTime>.15);await p.locator('.film-toggle').click();
  const v=p.locator('video');assert.equal(await v.evaluate(v=>v.paused),true);
  await p.locator('.film-cc').click();assert.equal(await p.locator('.film-cc-list').isVisible(),true);
  const css=await p.locator('.film-cc-list').evaluate(e=>({overflow:getComputedStyle(e).overflowY,width:getComputedStyle(e).scrollbarWidth,scroll:e.scrollHeight>e.clientHeight}));assert.deepEqual(css,{overflow:'auto',width:'thin',scroll:true});
  await p.locator('[role=option][aria-selected=true]').press('End');await p.locator('[role=option]').last().press('Enter');assert.equal(await v.evaluate(v=>v.textTracks[32].mode),'showing');assert.equal(await p.locator('.film-cc-list').isVisible(),false);
  await p.locator('.film-cc').click();await p.locator('[role=option][aria-selected=true]').press('Escape');assert.equal(await p.locator('.film-cc').evaluate(e=>e===document.activeElement),true);
  await p.locator('.film-cc').click();await p.locator('[role=option]').filter({hasText:'CC off'}).click();assert.equal(await v.evaluate(v=>Array.from(v.textTracks).filter(t=>t.mode==='showing').length),0);
  const timeline=p.locator('.film-timeline');const box=await timeline.boundingBox();await timeline.click({position:{x:box.width*.63,y:box.height/2}});await p.waitForFunction(()=>!document.querySelector('video').seeking);assert.ok(Math.abs(await v.evaluate(v=>v.currentTime)-f.duration*.63)<.5);
  await p.locator('.film-speed').selectOption('1.25');assert.equal(await v.evaluate(v=>v.playbackRate),1.25);
  await p.locator('.film-mute').click();assert.equal(await v.evaluate(v=>v.muted),true);
  if(out&&f.slug==='find-your-direction'){await p.locator('.film-cc').click();await p.screenshot({path:path.join(out,'captions-'+width+'.png')});await p.locator('[role=option][aria-selected=true]').press('Escape')}
  checks.push({film:f.slug,width,playback:true,seeking:true,captions:33,customScroll:true,keyboard:true,overflow:false});
 }
 await p.setViewportSize({width:390,height:844});await p.goto(base+'/ar/film/find-your-direction/?t=16',{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('video').readyState>=1&&!document.querySelector('video').seeking);assert.ok(Math.abs(await p.locator('video').evaluate(v=>v.currentTime)-16)<.3);assert.equal(await p.locator('video').evaluate(v=>Array.from(v.textTracks).find(t=>t.mode==='showing').language),'ar');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 if(out)await p.screenshot({path:path.join(out,'arabic-mobile.png')});
 for(const width of [390,1440]){await p.setViewportSize({width,height:1000});await p.goto(base+'/film/',{waitUntil:'networkidle'});assert.equal(await p.locator('.film-card').count(),5);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);if(out)await p.screenshot({path:path.join(out,'collection-'+width+'.png'),fullPage:true})}
 await p.goto(base+'/films/find-your-direction/',{waitUntil:'networkidle'});assert.ok(p.url().endsWith('/film/find-your-direction/'));
 await p.locator('.theme').click();assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');if(out)await p.screenshot({path:path.join(out,'watch-dark.png')});
 assert.deepEqual(errors,[]);await b.close();const report={checks,arabicDefaultCaptions:true,momentDeepLink:true,legacyRedirect:true,collectionCards:5,scriptErrors:errors};if(out)fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
