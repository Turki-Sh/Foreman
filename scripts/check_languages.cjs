const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {chromium}=require(require.resolve('playwright-core',{paths:[path.join(root,'bench'),__dirname]}));
const locales=JSON.parse(fs.readFileSync(path.join(root,'site/i18n/locales.json'),'utf8'));
const routes=['','modes/','board/','punch-list/','palette/','launch/','install/','changelog/','404.html'];
const out=process.env.LANGUAGE_QA_DIR || path.join(root,'bench/language-qa');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
 const failures=[],errors=[];let checked=0;
 page.on('pageerror',e=>errors.push(String(e)));
 for(const locale of locales){
  for(const route of routes){
   const url='http://127.0.0.1:3217/'+(locale.code==='en'?'':locale.code+'/')+route;
   await page.goto(url,{waitUntil:'load'});
   const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main *,footer *')].filter(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return b.width && (b.right>innerWidth+2 || b.left < -2) && s.position!=='absolute' && !e.closest('pre,svg,.log,.chat,.session-replay,.footer-bottom,.footer-code')}).slice(0,5).map(e=>e.tagName+'.'+e.className)}));
   if(overflow.scroll>overflow.width+2)failures.push({url,...overflow});
   checked++;
  }
 }
 // Interactions and representative visual checks in both themes.
 for(const code of ['en','ar','de','el','ja','th','zh-hans']){
  const prefix=code==='en'?'':code+'/';
  await page.goto('http://127.0.0.1:3217/'+prefix+'modes/',{waitUntil:'load'});
  await page.locator('.lang-button').click();
  if(!await page.locator('#language-picker').evaluate(e=>e.matches(':popover-open')))failures.push({code,reason:'picker did not open'});
  const links=await page.locator('.lang-choice').count();if(links!==33)failures.push({code,links});
  await page.screenshot({path:path.join(out,code+'-picker-mobile.png')});
  await page.keyboard.press('Escape');
  if(await page.locator('#language-picker').evaluate(e=>e.matches(':popover-open')))failures.push({code,reason:'Escape did not close'});
  await page.goto('http://127.0.0.1:3217/'+prefix,{waitUntil:'load'});
  await page.screenshot({path:path.join(out,code+'-home-mobile.png')});
  await page.locator('.theme').click();
  await page.screenshot({path:path.join(out,code+'-home-dark-mobile.png')});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(out,code+'-home-dark-desktop.png')});
  await page.locator('.theme').click();
  await page.screenshot({path:path.join(out,code+'-home-desktop.png')});
  await page.setViewportSize({width:375,height:812});
 }
 await browser.close();
 const report={checked,failures,errors};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));if(failures.length||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
