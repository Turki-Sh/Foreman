(()=>{
// Adapted from Turki Alshuaibi's Itqan FilmPlayer: chapter thread, ambient light,
// pointer seeking, keyboard controls and moment links. Standalone review adapter.
const icons={play:'<path d="m8 5 11 7-11 7z" fill="currentColor"/>',pause:'<path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="4"/>',volume:'<path d="m3 9 4 0 5-4v14l-5-4H3zM16 8q5 4 0 8"/>',full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',share:'<path d="M12 16V3m-5 5 5-5 5 5M5 13v8h14v-8"/>'};
const svg=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${icons[n]}</svg>`;
const escapeText=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const chevron='<svg class="film-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>';
const clock=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
document.querySelectorAll('video').forEach((v,index)=>{
 const section=v.closest('section'),film=window.FOREMAN_FILMS?.[index];if(!film)return;const figure=document.createElement('figure');figure.className='film-player';figure.style.setProperty('--fa',['#70aaff','#f1ad75','#77d2b2','#b9a9ff','#91ccff'][index]);figure.style.setProperty('--c','var(--fa)');figure.dataset.status='idle';figure.tabIndex=0;
 v.before(figure);figure.innerHTML='<div class="film-ambient"></div><div class="film-screen"></div>';figure.querySelector('.film-screen').append(v);v.controls=false;v.preload='metadata';v.setAttribute('aria-label',film.title);
 const screen=figure.querySelector('.film-screen');screen.insertAdjacentHTML('beforeend',`<button class="film-hit" aria-label="Play or pause"></button><button class="film-big-play" aria-label="Play ${film.title}"><svg class="film-ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" pathLength="1"/></svg>${svg('play')}</button><div class="film-subtitles" hidden><span dir="auto"></span></div>`);
 figure.insertAdjacentHTML('beforeend',`<div class="film-controls"><button class="film-btn film-toggle" aria-label="Play">${svg('play')}</button><div class="film-timeline" role="slider" tabindex="0" aria-label="Seek ${film.title}" aria-valuemin="0" aria-valuenow="0" aria-valuetext="0:00" aria-valuemax="${film.duration}"><div class="film-thread">${film.starts.map((s,i)=>`<span class="film-seg" style="--a:${s/film.duration};--l:${film.durations[i]/film.duration};--sc:${['#8dbeff','#b1cfff','#a2c5ff','#7de4d3','#f0bb80','#b8b3ff','#95cbdc','#e0e8f8'][i]};left:${100*s/film.duration}%;width:${100*film.durations[i]/film.duration}%"><i></i></span>`).join('')}<span class="film-pen"></span></div><div class="film-peek" hidden><span class="film-peek-frame"></span><span class="film-peek-time"></span></div></div><span class="film-clock">0:00 / ${clock(film.duration)}</span><button class="film-btn film-mute" aria-label="Mute">${svg('volume')}</button><div class="film-menu film-captions"><button type="button" class="film-choice film-cc" id="cc-${index}" aria-label="Captions" aria-haspopup="listbox" aria-expanded="false" aria-controls="cc-list-${index}"><span class="film-choice-label">English</span>${chevron}</button><div class="film-menu-list film-cc-list" id="cc-list-${index}" role="listbox" aria-label="Caption language" hidden>${['CC off',...Array.from(v.querySelectorAll('track')).map(tr=>tr.label)].map((label,i)=>`<button type="button" role="option" tabindex="-1" aria-selected="false" data-value="${i-1}"><bdi>${escapeText(label.split(' · ')[0])}</bdi>${label.includes(' · Beta')?'<small>Beta</small>':''}<span class="film-selected" aria-hidden="true">✓</span></button>`).join('')}</div></div><div class="film-menu film-rates"><button type="button" class="film-choice film-speed" aria-label="Playback speed" aria-haspopup="listbox" aria-expanded="false" aria-controls="speed-list-${index}"><span class="film-choice-label">1×</span>${chevron}</button><div class="film-menu-list film-speed-list" id="speed-list-${index}" role="listbox" aria-label="Playback speed" hidden>${[1,1.25,1.5].map(rate=>`<button type="button" role="option" tabindex="-1" aria-selected="false" data-value="${rate}"><span>${rate}×</span><span class="film-selected" aria-hidden="true">✓</span></button>`).join('')}</div></div><button class="film-btn film-share" aria-label="Copy link to this moment">${svg('share')}</button><button class="film-btn film-full" aria-label="Fullscreen">${svg('full')}</button></div><div class="film-feedback" role="status"></div>`);
 const toggle=()=>v.paused?v.play():v.pause();figure.querySelector('.film-toggle').onclick=toggle;figure.querySelector('.film-hit').onclick=toggle;figure.querySelector('.film-big-play').onclick=toggle;
 v.onplay=()=>{document.querySelectorAll('video').forEach(o=>{if(o!==v)o.pause()});figure.dataset.status='playing';figure.querySelector('.film-toggle').innerHTML=svg('pause');figure.querySelector('.film-toggle').ariaLabel='Pause';};
 v.onpause=()=>{figure.dataset.status='paused';figure.querySelector('.film-toggle').innerHTML=svg('play');figure.querySelector('.film-toggle').ariaLabel='Play';};v.onended=()=>{figure.dataset.status='ended';};
 const timeline=figure.querySelector('.film-timeline');v.ontimeupdate=()=>{timeline.style.setProperty('--p',v.currentTime/film.duration);timeline.setAttribute('aria-valuenow',v.currentTime.toFixed(1));timeline.setAttribute('aria-valuetext',clock(v.currentTime)+' of '+clock(film.duration));figure.querySelector('.film-clock').textContent=clock(v.currentTime)+' / '+clock(film.duration);};
 const seek=x=>{const r=timeline.getBoundingClientRect();return Math.max(0,Math.min(film.duration,(x-r.left)/r.width*film.duration))};let dragging=false;
 timeline.onpointerdown=e=>{dragging=true;timeline.setPointerCapture(e.pointerId);v.currentTime=seek(e.clientX)};timeline.onpointerup=()=>dragging=false;timeline.onpointercancel=()=>dragging=false;
 timeline.onpointermove=e=>{const at=seek(e.clientX);if(dragging)v.currentTime=at;const peek=figure.querySelector('.film-peek');peek.hidden=false;const r=timeline.getBoundingClientRect();peek.style.left=Math.max(96,Math.min(r.width-96,e.clientX-r.left))+'px';const n=Math.min(Math.floor(film.duration)-1,Math.floor(at));const frame=peek.querySelector('.film-peek-frame');frame.style.backgroundImage=`url(${film.frames || film.slug+"/frames12.jpg"})`;frame.style.backgroundPosition=`${-(n%8)*192}px ${-Math.floor(n/8)*108}px`;peek.querySelector('.film-peek-time').textContent=clock(at)};timeline.onpointerleave=()=>figure.querySelector('.film-peek').hidden=true;
 figure.querySelector('.film-mute').onclick=e=>{v.muted=!v.muted;e.currentTarget.setAttribute('aria-label',v.muted?'Unmute':'Mute');e.currentTarget.style.opacity=v.muted?.45:1};
 v.onvolumechange=()=>{const btn=figure.querySelector('.film-mute');btn.setAttribute('aria-label',v.muted?'Unmute':'Mute');btn.style.opacity=v.muted?.45:1};
 // Share selection, dismissal and keyboard behavior across both menus.
 const menus=[];
 const makeMenu=(container,onSelect)=>{
  const button=container.querySelector('.film-choice'),list=container.querySelector('[role=listbox]'),options=[...list.querySelectorAll('[role=option]')];
  const close=(restore=false)=>{list.hidden=true;button.setAttribute('aria-expanded','false');if(restore)button.focus()};
  const select=value=>{const option=options.find(o=>o.dataset.value===String(value));if(!option)return;options.forEach(o=>o.setAttribute('aria-selected',String(o===option)));button.querySelector('.film-choice-label').textContent=option.firstElementChild.textContent;button.title=button.getAttribute('aria-label')+': '+option.firstElementChild.textContent;};
  const open=()=>{
   menus.forEach(menu=>menu.close());list.hidden=false;button.setAttribute('aria-expanded','true');list.style.translate='0px 0px';
   const bounds=list.getBoundingClientRect(),frame=figure.getBoundingClientRect();
   const left=Math.max(8,frame.left),right=Math.min(innerWidth-8,frame.right);
   list.style.translate=(bounds.left<left?left-bounds.left:bounds.right>right?right-bounds.right:0)+'px 0px';
   const option=options.find(o=>o.getAttribute('aria-selected')==='true')||options[0];option.focus({preventScroll:true});option.scrollIntoView({block:'nearest'});
  };
  button.onclick=()=>list.hidden?open():close();
  button.onkeydown=e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();e.stopPropagation();open()}};
  options.forEach(option=>option.onclick=()=>{onSelect(Number(option.dataset.value));select(option.dataset.value);close(true)});
  list.onkeydown=e=>{
   e.stopPropagation();if(e.key==='Escape'){e.preventDefault();close(true);return}if(e.key==='Tab'){close();return}
   const at=options.indexOf(document.activeElement);let next=at;
   if(e.key==='ArrowDown')next=(at+1)%options.length;if(e.key==='ArrowUp')next=(at-1+options.length)%options.length;
   if(e.key==='Home')next=0;if(e.key==='End')next=options.length-1;
   if(next!==at){e.preventDefault();options[next].focus({preventScroll:true});options[next].scrollIntoView({block:'nearest'})}
  };
  document.addEventListener('pointerdown',e=>{if(!container.contains(e.target))close()});
  container.addEventListener('focusout',e=>{if(!container.contains(e.relatedTarget))close()});
  const menu={close,select};menus.push(menu);return menu;
 };
 // Keep WebVTT timing and native fullscreen support, render inline captions with a safe inset.
 const subtitles=figure.querySelector('.film-subtitles'),captionText=subtitles.querySelector('span');
 const tracks=[...v.textTracks];let selectedTrack=-1,nativeFullscreen=false;
 const renderCaption=()=>{
  const track=tracks[selectedTrack];
  const text=track?[...track.cues||[]].filter(c=>v.currentTime>=c.startTime&&v.currentTime<c.endTime).map(c=>c.getCueAsHTML?c.getCueAsHTML().textContent:c.text).join(' '):'';
  captionText.textContent=text;captionText.lang=track?.language||'';subtitles.hidden=!text||nativeFullscreen;
 };
 const chooseCC=n=>{selectedTrack=n;tracks.forEach((tr,i)=>tr.mode=i===n?(nativeFullscreen?'showing':'hidden'):'disabled');renderCaption()};
 tracks.forEach(track=>track.addEventListener('cuechange',renderCaption));
 v.querySelectorAll('track').forEach(track=>track.addEventListener('load',renderCaption));
 v.addEventListener('seeked',renderCaption);
 v.addEventListener('webkitbeginfullscreen',()=>{nativeFullscreen=true;chooseCC(selectedTrack)});
 v.addEventListener('webkitendfullscreen',()=>{nativeFullscreen=false;chooseCC(selectedTrack)});
 const ccMenu=makeMenu(figure.querySelector('.film-captions'),chooseCC);
 const defaultTrack=[...v.querySelectorAll('track')].findIndex(t=>t.default);chooseCC(defaultTrack<0?0:defaultTrack);ccMenu.select(selectedTrack);
 const speedMenu=makeMenu(figure.querySelector('.film-rates'),rate=>v.playbackRate=rate);speedMenu.select(v.playbackRate);
 v.addEventListener('ratechange',()=>speedMenu.select(v.playbackRate));
 figure.querySelector('.film-full').onclick=()=>document.fullscreenElement?document.exitFullscreen():figure.requestFullscreen();
 figure.querySelector('.film-share').onclick=async()=>{const u=new URL(location.href);u.hash=film.slug;u.searchParams.set('t',Math.floor(v.currentTime));try{await navigator.clipboard.writeText(u.href);figure.querySelector('.film-feedback').textContent='Moment link copied';}catch{figure.querySelector('.film-feedback').textContent='Could not copy. Copy this page address instead.';}};
 figure.onkeydown=e=>{if(e.target.closest('button,select,[role=listbox]'))return;if([' ','k','ArrowLeft','ArrowRight','m','f'].includes(e.key)){e.preventDefault();if(e.key===' '||e.key==='k')toggle();if(e.key==='ArrowLeft')v.currentTime=Math.max(0,v.currentTime-5);if(e.key==='ArrowRight')v.currentTime=Math.min(film.duration,v.currentTime+5);if(e.key==='m')v.muted=!v.muted;if(e.key==='f')figure.querySelector('.film-full').click();}};
 const c=document.createElement('canvas');c.width=8;c.height=5;const cx=c.getContext('2d',{willReadFrequently:true});v.addEventListener('timeupdate',()=>{if(v.readyState<2)return;cx.drawImage(v,0,0,8,5);const data=cx.getImageData(0,0,8,5).data;let a=[0,0,0];for(let i=0;i<data.length;i+=4){a[0]+=data[i];a[1]+=data[i+1];a[2]+=data[i+2]}figure.style.setProperty('--amb',a.map(x=>Math.round(x/40)).join(' '))});
 if(location.hash==='#'+film.slug || document.querySelectorAll('video').length===1){const moment=()=>{v.currentTime=Math.min(film.duration,Number(new URLSearchParams(location.search).get('t'))||0)};if(v.readyState>=1)moment();else v.addEventListener('loadedmetadata',moment,{once:true});}
 document.querySelectorAll('[data-film-time]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();v.currentTime=Number(a.dataset.filmTime);v.play();figure.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}));
 section?.classList.add('has-player');
});

})();
