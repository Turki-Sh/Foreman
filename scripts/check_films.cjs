const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8'));
const base=process.env.FILM_BASE_URL||'http://127.0.0.1:3234';
const output=process.env.FILM_QA_DIR;
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 for(const locale of locales){
  const route=(locale.code==='en'?'':'/'+locale.code)+'/films/';
  await page.goto(base+route,{waitUntil:'load'});
  await page.locator('video').evaluate(v=>v.readyState>=1?null:new Promise((resolve,reject)=>{v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',reject,{once:true})}));
  const state=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,tracks:document.querySelectorAll('track').length,duration:document.querySelector('video').duration,lang:document.documentElement.lang}));
  assert(state.scroll<=state.width+1,locale.code+' overflow');assert.equal(state.tracks,33);assert.equal(state.lang,locale.tag);assert(Math.abs(state.duration-60)<.2);
  await page.locator('[data-film-time="30"]').first().click();
  await page.waitForFunction(()=>Math.abs(document.querySelector('video').currentTime-30)<3);
  const result=await page.locator('video').evaluate(v=>({time:v.currentTime,paused:v.paused,error:v.error?.message,showing:[...v.textTracks].filter(t=>t.mode==='showing').map(t=>t.language)}));
  assert(!result.error&&result.time>=30&&!result.paused,locale.code+' chapter seek');
  if(locale.code!=='en')assert(result.showing.includes(locale.tag),locale.code+' default caption');
  assert((await page.locator('[data-film-captions]').getAttribute('href')).endsWith('/'+locale.code+'.srt'));
  await page.locator('video').evaluate(v=>v.pause());
  await page.locator('.film-transcript summary').click();assert(await page.locator('.film-transcript').getAttribute('open')!==null);
  assert.equal(await page.locator('.film-transcript li').count(),14);
  if(output&&['en','ar','ja'].includes(locale.code)){
   fs.mkdirSync(output,{recursive:true});await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(output,locale.code+'-mobile.png')});
   await page.locator('.theme').click();await page.screenshot({path:path.join(output,locale.code+'-mobile-alternate.png')});
  }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/films/');
 if(output)await page.screenshot({path:path.join(output,'en-desktop.png')});
 assert.equal(errors.length,0,errors.join('\n'));await browser.close();
 console.log('33 film editions: mobile overflow, playback, chapter seeking, language captions, downloads and transcript controls passed.');
})().catch(e=>{console.error(e);process.exitCode=1});
