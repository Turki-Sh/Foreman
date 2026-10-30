from pathlib import Path
import sys,json,subprocess,os
b=Path(os.environ['FOREMAN_FILM_WORKSPACE'])/'cinema';sys.path.insert(0,str(b.parent/'tts/packages'))
import numpy as np,soundfile as sf
from scipy.signal import find_peaks
from scipy.ndimage import uniform_filter1d
r=Path(__file__).resolve().parents[2];out=b/'audio12';out.mkdir(exist_ok=True);sr=48000
subprocess.run(['ffmpeg','-y','-v','error','-i',str(b/'glass11/clap-loop.mp3'),'-af','highpass=f=170,lowpass=f=11000','-ar',str(sr),'-ac','2',str(out/'source.wav')],check=True)
x,_=sf.read(out/'source.wav');env=uniform_filter1d(np.max(abs(x),axis=1),240)
peaks,_=find_peaks(env,distance=int(.17*sr),prominence=.008);peaks=sorted(peaks,key=lambda p:env[p],reverse=True)[:6]
samples=[]
for i,p in enumerate(peaks):
 a=max(0,p-int(.012*sr));sample=x[a:min(len(x),a+int((.15 if i%2 else .24)*sr))].copy()
 sample[:96]*=np.linspace(0,1,96)[:,None];n=min(len(sample)//3,2400);sample[-n:]*=np.linspace(1,0,n)[:,None]
 sample/=max(np.max(abs(sample)),1e-6);samples.append(sample)
assert len(samples)>=4
films=json.loads((r/'films/production/src/cinema-timings.json').read_text());report=[]
patterns=[[0,3,4,6,8,11,12,14],[0,2,5,8,10,12,15],[0,4,7,8,12,14,15],[0,3,6,8,11,12,14],[0,2,4,7,8,10,12,15]]
for fi,f in enumerate(films):
 slug=f['slug'];voice,_=sf.read(b/'audio7'/f'{slug}-voice.wav');fx,_=sf.read(b/'audio10'/f'{slug}-effects.wav');n=len(voice);bed=np.zeros((n,2));bpm=[132,128,138,130,134][fi];step=60/bpm/4;events=[]
 for shot,(start,dur) in enumerate(zip(f['starts'],f['durations'])):
  for k in range(int(dur/step)+1):
   sub=k%16
   if sub not in patterns[fi]:continue
   time=start+k*step+(0.008 if sub%2 else 0)
   if time>start+dur-.10 or (fi==2 and shot==0 and time<.5):continue
   sample=samples[(0 if sub in [4,12] else (k+fi)%len(samples))];gain=(.20 if sub in [4,12] else .11 if sub%4==0 else .055)
   if shot in [0,7]:gain*=.65
   a=round(time*sr);z=min(n,a+len(sample))
   if z>a:bed[a:z]+=sample[:z-a]*gain
   events.append({'time':round(time,3),'sample':(0 if sub in [4,12] else (k+fi)%len(samples)),'gain':gain})
 duck=np.ones(n)
 for start,speech in zip(f['starts'],f['speechDurations']):duck[round((start+.1)*sr):round((start+.1+speech)*sr)]=.78
 bed*=uniform_filter1d(duck,2400)[:,None];bed[-12000:]*=np.linspace(1,0,12000)[:,None]
 # Actual library transients, with no generated oscillator, noise or pitched bed.
 mix=np.column_stack([voice,voice])+fx+bed;sf.write(out/f'{slug}-beat.wav',bed,sr,subtype='PCM_24');sf.write(out/f'{slug}-mix.wav',mix,sr,subtype='PCM_24')
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/f'{slug}-mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=6','-ar','48000','-c:a','aac','-b:a','256k',str(r/'films/production/public/cinema/audio'/f'{slug}.m4a')],check=True)
 report.append(dict(film=slug,bpm=bpm,pattern=patterns[fi],events=events,source='https://freesound.org/people/ecfike/sounds/202158/',license='CC0'))
(out/'arrangements.json').write_text(json.dumps(report,indent=2));print('Five transient-led percussion arrangements ready.')
