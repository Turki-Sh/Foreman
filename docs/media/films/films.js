(() => {
 const video=document.getElementById('foreman-film');
 if(!video)return;
 const language=document.documentElement.lang.toLowerCase();
 const track=[...video.querySelectorAll('track')].find(t=>t.srclang.toLowerCase()===language);
 if(track&&language!=='en'){track.default=true;track.track.mode='showing';}
 const captionLink=document.querySelector('[data-film-captions]');
 const captionDownload=()=>{
  const selected=[...video.querySelectorAll('track')].find(t=>t.track.mode==='showing')||track;
  if(selected&&captionLink)captionLink.href=selected.src.replace('.vtt','.srt');
 };
 video.textTracks.addEventListener('change',captionDownload);captionDownload();
 const seek=(time,play)=>{
  if(!Number.isFinite(time)||time<0||(Number.isFinite(video.duration)&&time>=video.duration))return;
  const apply=()=>{video.currentTime=time;if(play)video.play().catch(()=>{});};
  if(video.readyState>=1)apply();else{video.addEventListener('loadedmetadata',apply,{once:true});video.load();}
 };
 document.querySelectorAll('[data-film-time]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();history.replaceState(null,'',link.href);seek(Number(link.dataset.filmTime),true);video.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}));
 const time=()=>{const match=location.hash.match(/^#t=(\d+(?:\.\d+)?)$/);if(match)seek(Number(match[1]),false);};
 addEventListener('hashchange',time);time();
})();
