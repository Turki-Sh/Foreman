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
  assert.equal(await p.locator('.film-cc-list [role=option]').count(),34);assert.equal(await p.locator('.film-controls select').count(),0);
  assert.equal(await p.locator('.bar .nav a[href="/film/"]').count(),1);
  assert.equal(await p.locator('#menu a[href="/film/"]').count(),1);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'page overflow '+width+' '+f.slug);
  await p.locator('.film-big-play').click();await p.waitForFunction(()=>document.querySelector('video').currentTime>.15);await p.locator('.film-toggle').click();
  const v=p.locator('video');assert.equal(await v.evaluate(v=>v.paused),true);
  await p.locator('.film-cc').click();assert.equal(await p.locator('.film-cc-list').isVisible(),true);
  const css=await p.locator('.film-cc-list').evaluate(e=>({overflow:getComputedStyle(e).overflowY,width:getComputedStyle(e).scrollbarWidth,scroll:e.scrollHeight>e.clientHeight}));assert.deepEqual(css,{overflow:'auto',width:'thin',scroll:true});
  await p.locator('.film-cc-list [role=option][aria-selected=true]').press('End');await p.locator('.film-cc-list [role=option]').last().press('Enter');assert.equal(await v.evaluate(v=>v.textTracks[32].mode),'hidden');assert.equal(await p.locator('.film-cc-list').isVisible(),false);
  await p.locator('.film-cc').click();await p.locator('.film-cc-list [role=option][aria-selected=true]').press('Escape');assert.equal(await p.locator('.film-cc').evaluate(e=>e===document.activeElement),true);
  await p.locator('.film-cc').click();await p.locator('.film-cc-list [role=option]').filter({hasText:'CC off'}).click();assert.equal(await v.evaluate(v=>Array.from(v.textTracks).filter(t=>t.mode!=='disabled').length),0);assert.equal(await p.locator('.film-subtitles').isVisible(),false);
  const timeline=p.locator('.film-timeline');const box=await timeline.boundingBox();await timeline.click({position:{x:box.width*.63,y:box.height/2}});await p.waitForFunction(()=>!document.querySelector('video').seeking);assert.ok(Math.abs(await v.evaluate(v=>v.currentTime)-f.duration*.63)<.5);
  await p.locator('.film-speed').click();await p.locator('.film-speed-list [data-value="1.25"]').click();assert.equal(await v.evaluate(v=>v.playbackRate),1.25);
  await p.locator('.film-speed').click();await p.locator('.film-speed-list [aria-selected=true]').press('End');await p.locator('.film-speed-list [data-value="1.5"]').press('Enter');assert.equal(await v.evaluate(v=>v.playbackRate),1.5);
  await p.locator('.film-speed').click();await p.locator('.film-cc').click();assert.equal(await p.locator('.film-speed-list').isVisible(),false);
  await p.locator('.film-cc-list [data-value="0"]').click();await timeline.click({position:{x:box.width*(f.starts[4]+.5)/f.duration,y:box.height/2}});await p.waitForFunction(()=>!document.querySelector('video').seeking);await p.waitForFunction(()=>document.querySelector('.film-subtitles').textContent.length>0).catch(async e=>{console.log('CAPTION FAILURE',p.url(),await p.locator('video').evaluate(v=>({time:v.currentTime,tracks:[...v.textTracks].filter(t=>t.mode!=='disabled').map(t=>({mode:t.mode,language:t.language,cues:[...t.cues||[]].map(c=>[c.startTime,c.endTime])}))})));throw e});
  const insets=await p.locator('.film-subtitles span').evaluate(e=>{const r=e.getBoundingClientRect(),screen=e.closest('.film-screen').getBoundingClientRect();return {left:r.left-screen.left,right:screen.right-r.right,bottom:screen.bottom-r.bottom,overflow:e.scrollWidth>e.clientWidth}});assert.ok(insets.left>=10&&insets.right>=10&&insets.bottom>=8);assert.equal(insets.overflow,false);
  await p.locator('.film-mute').click();assert.equal(await v.evaluate(v=>v.muted),true);
  if(out&&f.slug==='find-your-direction'){await p.locator('.film-cc').click();await p.screenshot({path:path.join(out,'captions-'+width+'.png')});await p.locator('.film-cc-list [role=option][aria-selected=true]').press('Escape')}
  checks.push({film:f.slug,width,playback:true,seeking:true,captions:33,customScroll:true,customSpeed:true,captionInsets:true,keyboard:true,overflow:false});
 }
 await p.setViewportSize({width:390,height:844});await p.goto(base+'/ar/film/find-your-direction/?t=16',{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('video').readyState>=1&&!document.querySelector('video').seeking);assert.ok(Math.abs(await p.locator('video').evaluate(v=>v.currentTime)-16)<.3);assert.equal(await p.locator('video').evaluate(v=>Array.from(v.textTracks).find(t=>t.mode==='hidden').language),'ar');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.waitForFunction(()=>document.querySelector('.film-subtitles').textContent.length>0).catch(async e=>{console.log('CAPTION FAILURE',p.url(),await p.locator('video').evaluate(v=>({time:v.currentTime,tracks:[...v.textTracks].filter(t=>t.mode!=='disabled').map(t=>({mode:t.mode,language:t.language,cues:[...t.cues||[]].map(c=>[c.startTime,c.endTime])}))})));throw e});if(out)await p.screenshot({path:path.join(out,'arabic-mobile.png')});
 for(const width of [320,700,850,1024]){
  await p.setViewportSize({width,height:900});await p.goto(base+'/film/before-you-share/?t=5',{waitUntil:'networkidle'});await p.waitForFunction(()=>document.querySelector('.film-subtitles').textContent.length>0).catch(async e=>{console.log('CAPTION FAILURE',p.url(),await p.locator('video').evaluate(v=>({time:v.currentTime,tracks:[...v.textTracks].filter(t=>t.mode!=='disabled').map(t=>({mode:t.mode,language:t.language,cues:[...t.cues||[]].map(c=>[c.startTime,c.endTime])}))})));throw e});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);
  for(const name of ['cc','speed']){await p.locator('.film-'+name).click();const r=await p.locator('.film-'+name+'-list').boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width,'menu within viewport '+width);await p.locator('.film-'+name+'-list [aria-selected=true]').press('Escape')}
  if(width===320){await p.locator('.menubtn').click();assert.equal(await p.locator('#menu a[href="/film/"]').isVisible(),true);await p.locator('.menubtn').click()}
 }
 await p.setViewportSize({width:1440,height:1000});await p.locator('.film-full').click();assert.equal(await p.evaluate(()=>!!document.fullscreenElement),true);await p.locator('.film-full').click();
 if(out){await p.locator('.film-speed').click();await p.screenshot({path:path.join(out,'speed-desktop.png')});await p.locator('.film-speed-list [aria-selected=true]').press('Escape')}

 for(const width of [390,1440]){await p.setViewportSize({width,height:1000});await p.goto(base+'/film/',{waitUntil:'networkidle'});assert.equal(await p.locator('.film-card').count(),5);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);if(out)await p.screenshot({path:path.join(out,'collection-'+width+'.png'),fullPage:true})}
 await p.goto(base+'/films/find-your-direction/',{waitUntil:'networkidle'});assert.ok(p.url().endsWith('/film/find-your-direction/'));
 await p.locator('.theme').click();assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');if(out)await p.screenshot({path:path.join(out,'watch-dark.png')});
 assert.deepEqual(errors,[]);await b.close();const report={checks,arabicDefaultCaptions:true,momentDeepLink:true,legacyRedirect:true,collectionCards:5,scriptErrors:errors};if(out)fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exit(1)});
