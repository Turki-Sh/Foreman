"""Five independently edited Foley scores. No oscillator, generated noise or music bed."""
from pathlib import Path
import sys,json,subprocess,hashlib,re,shutil,os
b=Path(os.environ['FOREMAN_FILM_WORKSPACE']).resolve()/'cinema';sys.path.insert(0,str(b.parent/'tts/packages'))
import numpy as np,soundfile as sf
r=Path(__file__).resolve().parents[2]
films=json.loads((r/'films/production/src/cinema-timings.json').read_text())
out=b/'audio10'; sr=48000
device_credit='Apple iPhone 15 Pro Max Black by polyman. CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ . Source https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7 . Screen, camera, lighting and animation modified.'
# shot, local seconds, recording ID, peak dBFS, stereo position, speed, max length, visible action
# Local times follow the actual composition, including its 0.66 easing multiplier.
scores=[
[(0,.02,166,-27,-.25,1.35,.36,'prompt enters'),(0,1.72,2541,-22,.3,1,.12,'submit press'),
 (0,2.65,481,-22,0,1,.12,'opening phrase punctuation'),
 (1,.46,1109,-21,0,1,.2,'cursor selects direction'),(1,.72,481,-25,-.1,1,.12,'selection settles'),
 (2,.12,2531,-32,-.15,1.15,.72,'terminal input'),(2,.52,2541,-26,-.15,1,.12,'response row one'),(2,.87,2541,-29,0,1.08,.12,'response row two'),(2,1.22,1120,-25,.15,1,.15,'response row three'),
 (3,.0,2380,-27,-.3,1.2,.42,'references arrive'),(3,.28,1530,-29,.2,1.25,.3,'reference motion'),(3,1.1,1109,-24,.25,1,.15,'reference selected'),
 (4,.05,1104,-27,-.2,1,.3,'brief opens'),(4,.55,2368,-35,0,1.1,.55,'brief review'),(4,2.1,2857,-24,0,1.1,.15,'approved brief'),
 (5,.72,166,-25,-.2,1.4,.38,'device handoff begins'),(5,1.28,481,-20,0,.95,.12,'website reveal lands'),
 (6,.35,1120,-26,-.25,1,.15,'first check'),(6,.85,1120,-25,0,1.05,.15,'second check'),(6,1.35,1120,-24,.25,1.1,.15,'third check'),
 (7,.03,481,-23,0,1,.12,'brand arrives'),(7,.42,1109,-29,0,1,.15,'brand settles')],
[(0,.02,1530,-26,-.3,1.1,.42,'reference row arrives'),(0,.18,2380,-31,.25,1.4,.3,'second reference overlaps'),(0,.99,1109,-24,.2,1,.15,'cursor reaches reference'),
 (1,.0,2386,-29,-.25,1.2,.65,'saved references pile'),(1,.6,1104,-31,.15,1.2,.25,'browsing gesture'),
 (2,.02,166,-30,0,1.5,.3,'enter brief'),(2,.15,2531,-33,-.15,1.1,.65,'brief typed'),(2,.5,2541,-28,-.1,1,.12,'research row one'),(2,.85,2541,-29,0,1.04,.12,'research row two'),(2,1.2,1120,-26,.1,1,.15,'research complete'),
 (3,.0,166,-26,-.15,1.5,.32,'move into reference'),(3,.32,1109,-23,.1,1,.15,'headline annotation lands'),
 (4,.08,1530,-27,-.25,1.1,.4,'reference card arrives'),(4,.52,2541,-29,.25,1,.12,'hierarchy principle'),(4,.92,2541,-28,.25,1.04,.12,'spacing principle'),(4,1.32,1120,-25,.25,1,.15,'next step principle'),
 (5,.0,1104,-25,-.2,1,.3,'direction sheet arrives'),(5,.18,1124,-29,0,1,.09,'direction row two'),(5,.36,1120,-26,.2,1,.15,'direction row three'),
 (6,.0,166,-27,.15,1.3,.38,'build reveal'),(6,.28,481,-24,0,1,.12,'chosen direction becomes site'),(7,.03,1109,-24,0,1,.15,'Board close')],
[(0,.03,1109,-29,0,1,.15,'site loads'),
 (1,.15,2364,-28,-.1,1.2,.14,'problem isolated'),
 (2,.08,2531,-32,-.15,1.1,.65,'inspection request'),(2,.5,2541,-29,-.1,1,.12,'inspect row one'),(2,.85,2541,-29,0,1,.12,'inspect row two'),(2,1.2,1120,-26,.1,1,.15,'inspect row three'),
 (3,.91,2539,-29,-.25,1.2,.35,'headline rewrite begins'),(3,1.25,2541,-22,-.1,1,.12,'new headline settles'),(3,1.82,166,-31,.35,1.6,.3,'competing buttons leave'),(3,2.51,1109,-21,-.2,1,.15,'one CTA remains'),
 (4,.05,1530,-29,-.2,1.3,.3,'mobile layout shown'),(4,.42,1120,-27,.3,1,.15,'mobile readability'),
 (5,.12,1124,-26,-.2,1,.09,'priority one'),(5,.37,1124,-25,0,1.05,.09,'priority two'),(5,.62,1120,-23,.2,1,.15,'priority three'),
 (6,.03,166,-28,.1,1.4,.32,'corrected page revealed'),(6,.31,481,-21,0,1,.12,'improved page lands'),(7,.04,1109,-25,0,1,.15,'Punch list close')],
[(0,.06,1489,-32,-.15,1.6,.75,'pigments move through frame'),
 (1,.02,1124,-27,-.3,.8,.12,'ink material'),(1,.4,1530,-24,0,1,.42,'paper material arrives'),(1,.8,1527,-28,.3,1.2,.55,'polished material arrives'),
 (2,.05,166,-30,-.1,1.5,.3,'palette enters interface'),(2,.15,1124,-28,-.25,1,.09,'surface role'),(2,.67,1124,-27,-.08,1.06,.09,'text role'),(2,1.19,1109,-25,.12,1,.15,'action role'),(2,1.71,1120,-24,.28,1,.15,'feedback role'),
 (3,.15,1124,-29,-.25,1,.09,'surface selection'),(3,.67,1124,-28,-.08,1.06,.09,'text selection'),(3,1.19,1109,-25,.12,1,.15,'action selection'),(3,1.71,1120,-24,.28,1,.15,'feedback selection'),
 (4,1.5,1120,-23,.2,1,.15,'contrast value changes'),
 (5,1.15,2585,-21,0,1,.1,'exact light-to-dark switch'),
 (6,.08,2531,-34,-.2,1.1,.5,'tokens shown'),(6,.51,2541,-29,-.1,1,.12,'token row one'),(6,.86,2541,-29,0,1,.12,'token row two'),(6,1.21,2541,-28,.1,1,.12,'token row three'),(6,1.56,1120,-26,.2,1,.15,'tokens complete'),
 (7,.04,481,-25,0,1,.12,'palette close')],
[(0,.02,166,-30,.15,1.3,.38,'site opening'),
 (1,.08,1120,-28,-.25,1,.15,'domain ready'),(1,.23,1120,-28,-.12,1.03,.15,'HTTPS ready'),(1,.38,1120,-27,0,1.06,.15,'share ready'),(1,.53,1120,-27,.12,1.09,.15,'404 ready'),
 (2,.08,1530,-30,0,1.4,.3,'address appears'),(2,.52,1109,-26,-.3,1,.15,'domain check'),(2,1.02,1109,-25,0,1.04,.15,'DNS check'),(2,1.52,2857,-24,.3,1.1,.15,'HTTPS check'),
 (3,.02,166,-27,-.15,1.4,.35,'share preview moves in'),(3,.6,1124,-28,0,1,.09,'share preview settles'),
 (4,1.94,1109,-22,-.2,1,.15,'back-home button press'),(4,2.2,166,-28,.15,1.8,.28,'home reveal follows click'),
 (5,.03,1530,-28,-.1,1.3,.32,'search result arrives'),(5,.35,2541,-29,.2,1,.12,'search listing detail'),
 (6,.08,1120,-27,-.25,1,.15,'final domain check'),(6,.23,1120,-26,-.12,1.03,.15,'final HTTPS check'),(6,.38,1120,-25,0,1.06,.15,'final share check'),(6,.53,1120,-24,.12,1.09,.15,'final 404 check'),
 (7,.03,2857,-23,0,1.1,.15,'ready state close')]
]

def prepare(id,speed,maxlen):
 x,rate=sf.read(out/'sources'/f'mixkit-{id}.wav');assert rate==sr
 level=np.max(np.abs(x),axis=1);on=np.flatnonzero(level>max(level.max()*.035,.0001))
 a=max(0,int(on[0])-96);z=min(len(x),int(on[-1])+2400);x=x[a:z]
 # Editing existing recordings only: time resampling, broad filtering and fades.
 idx=np.arange(0,len(x),speed);x=np.column_stack([np.interp(idx,np.arange(len(x)),x[:,ch]) for ch in range(2)])
 x=x[:round(maxlen*sr)]
 # Remove DC/sub energy and soften overly sharp recordings without adding a sound.
 from scipy.signal import butter,sosfilt
 x=sosfilt(butter(2,140,fs=sr,btype='high',output='sos'),x,axis=0)
 x=sosfilt(butter(2,8500,fs=sr,btype='low',output='sos'),x,axis=0)
 n=min(round(.004*sr),len(x)//4);x[:n]*=np.linspace(0,1,n)[:,None]
 n=min(round(.04*sr),len(x)//3);x[-n:]*=np.linspace(1,0,n)[:,None]
 return x/max(np.max(np.abs(x)),1e-6)

reports=[]
for f,events in zip(films,scores):
 voice,rate=sf.read(b/'audio7'/f'{f["slug"]}-voice.wav');assert rate==sr
 if voice.ndim==1:voice=np.column_stack([voice,voice])
 fx=np.zeros_like(voice);cue=[]
 for shot,local,id,db,pan,speed,maxlen,action in events:
  at=f['starts'][shot]+local;x=prepare(id,speed,maxlen)
  # Gentle stereo placement; mono compatibility retained.
  x*=10**(db/20);x[:,0]*=np.sqrt(1-pan);x[:,1]*=np.sqrt(1+pan)
  a=round(at*sr);z=min(len(fx),a+len(x));fx[a:z]+=x[:z-a]
  cue.append(dict(time=round(at,4),shot=shot,local=local,source=f'mixkit-{id}',action=action,peakDBFS=db,pan=pan,speed=speed,maxLength=maxlen))
 # Phrase-based, slow gain changes prevent syllable pumping. Every mix has its own cues.
 duck=np.ones(len(fx))
 for start,dur in zip(f['starts'],f['speechDurations']):
  a=round((start+.1)*sr);z=min(len(fx),round((start+.1+dur)*sr));duck[a:z]=.80
 from scipy.ndimage import uniform_filter1d
 duck=uniform_filter1d(duck,size=round(.09*sr),mode='nearest');fx*=duck[:,None]
 sf.write(out/f'{f["slug"]}-effects.wav',fx,sr,subtype='PCM_24')
 sf.write(out/f'{f["slug"]}-mix.wav',voice+fx,sr,subtype='PCM_24')
 dest=out/f'{f["slug"]}.m4a'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/f'{f["slug"]}-mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=6','-ar','48000','-c:a','aac','-b:a','256k',str(dest)],check=True)
 # Private review exports only. Keep old export and do not overwrite source renders.
 folder=b.parent/'tts/drafts/cinema'/f['slug']
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(folder/'preview.mp4'),'-i',str(dest),'-map','0:v:0','-map','1:a:0','-map_metadata','-1','-metadata','title='+f['title'],'-metadata','artist=Turki Alshuaibi','-metadata','comment=Revision 10: individually edited library Foley, no music. Sources and licenses in credits-audio10.txt. '+device_credit,'-c','copy','-movflags','+faststart',str(folder/'preview-audio10.mp4')],check=True)
 reports.append(dict(slug=f['slug'],events=cue,music=False,sharedLoop=False,syntheticSounds=False,voice='revision 7, unchanged',duration=f['duration'],effectsSHA256=hashlib.sha256((out/f'{f["slug"]}-effects.wav').read_bytes()).hexdigest()))
(out/'score.json').write_text(json.dumps(reports,indent=2))
used={e['source'] for f in reports for e in f['events']}
sources=[x for x in json.loads((out/'sources.json').read_text()) if x['id'] in used]
credits='Foreman films, audio revision 10.\nEach film uses its own timed arrangement of library recordings. No music, Tunetank track, synthesized noise or automatic scene-end impacts.\nNarration and picture timing remain unchanged from revision 7.\nRecordings edited with trims, gain, fades, filtering, timing and stereo placement. Raw sources retained privately, not redistributed.\n\nMixkit Sound Effects Free License: https://mixkit.co/license/#sfxFree\n'
for x in sources:credits+=f'\n{x["id"]}: {x["name"]}\n{x["source"]}\n'
credits+='\n'+device_credit+'\nScreen content and terminal exchanges are authored demonstrations, not live agent recordings.\n'
(out/'credits.txt').write_text(credits,encoding='utf8')
review=b.parent/'tts/drafts/cinema'
shutil.copy(out/'credits.txt',review/'credits-audio10.txt')
s=(review/'index.html').read_text(encoding='utf8')
s=re.sub(r'Revision 9\.[^<]+','Revision 10. Five individually edited soundtracks. English narration, library sound effects, no music. Captions in 33 languages.',s)
s=re.sub(r'preview\.mp4(?:\?v=\d+)?','preview-audio10.mp4?v=10',s)
s=re.sub(r'Percussion: .*?Content ID registered\.<br>','',s)
s=s.replace('href="credits.txt"','href="credits-audio10.txt"')
s=s.replace('<footer>','<footer>Sound effects from Mixkit, edited individually for each film. <a href="credits-audio10.txt">Sound credits</a>.<br>')
(review/'revision10.html').write_text(s,encoding='utf8')
print(json.dumps([dict(film=x['slug'],cues=len(x['events']),uniqueSources=len({e['source'] for e in x['events']})) for x in reports],indent=2))
