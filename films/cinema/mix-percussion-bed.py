from pathlib import Path
import sys,json,subprocess,shutil,os
b=Path(os.environ['FOREMAN_FILM_WORKSPACE'])/'cinema';sys.path.insert(0,str(b.parent/'tts/packages'))
import numpy as np,soundfile as sf
from scipy.ndimage import uniform_filter1d
r=Path(__file__).resolve().parents[2];out=b/'audio11';out.mkdir(exist_ok=True);sr=48000
films=json.loads((r/'films/production/src/cinema-timings.json').read_text())
# Individual tempos, loop entry points and shot energy contours.
settings=[(122,0,[.45,.72,.50,.85,.48,1,.68,.38]),(114,2,[.48,.67,.40,.72,.55,.85,.75,.26]),(126,5,[.18,.25,.48,.88,.65,.95,.85,.28]),(118,3,[.60,.55,.78,.85,.38,.55,.85,.25]),(120,6,[.32,.48,.68,.72,.48,.75,.90,.35])]
report=[]
for f,(bpm,offset,energy) in zip(films,settings):
 slug=f['slug'];loopfile=out/f'{slug}-loop.wav'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(b/'glass11/clap-loop.mp3'),'-af',f'atempo={bpm/126},highpass=f=120,lowpass=f=9500','-ar',str(sr),'-ac','2',str(loopfile)],check=True)
 loop,_=sf.read(loopfile);beat=60/bpm;target=round(8*beat*sr)
 # Trim/pad to the documented eight-beat period; rotation changes the phrase entry.
 loop=np.pad(loop,((0,max(0,target-len(loop))),(0,0)))[:target]
 loop=np.roll(loop,-round(offset*beat*sr),axis=0)
 loop*=.032/max(np.sqrt(np.mean(loop**2)),1e-8)
 voice,_=sf.read(b/'audio7'/f'{slug}-voice.wav');fx,_=sf.read(b/'audio10'/f'{slug}-effects.wav')
 n=len(voice);bed=np.tile(loop,(int(np.ceil(n/len(loop)))+1,1))[:n]
 env=np.zeros(n);duck=np.ones(n)
 for i,(start,dur,speech) in enumerate(zip(f['starts'],f['durations'],f['speechDurations'])):
  a=round(start*sr);z=min(n,round((start+dur)*sr));env[a:z]=energy[i]
  x=round((start+.1)*sr);y=min(n,round((start+.1+speech)*sr));duck[x:y]=.64
 # Intentional short breaks before the payoff, not a loop running unchanged.
 breaks=[(f['starts'][5]-.22,f['starts'][5]),(f['starts'][7]-.16,f['starts'][7])]
 if slug=='fix-what-feels-wrong':breaks.append((0,.75))
 if slug=='colour-that-works':breaks.append((f['starts'][5]+.98,f['starts'][5]+1.15))
 for a,z in breaks:env[max(0,round(a*sr)):min(n,round(z*sr))]=0
 env=uniform_filter1d(env,round(.035*sr));duck=uniform_filter1d(duck,round(.10*sr))
 env[:4800]*=np.linspace(0,1,4800);env[-int(.6*sr):]*=np.linspace(1,0,int(.6*sr))
 bed*=env[:,None]*duck[:,None]
 # Prevent any unexpected source peak from overwhelming the narration.
 peak=np.max(np.abs(bed));bed*=min(1,.16/max(peak,1e-8))
 mix=np.column_stack([voice,voice])+fx+bed
 sf.write(out/f'{slug}-beat.wav',bed,sr,subtype='PCM_24');sf.write(out/f'{slug}-mix.wav',mix,sr,subtype='PCM_24')
 dest=r/'films/production/public/cinema/audio'/f'{slug}.m4a'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(out/f'{slug}-mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=6','-ar','48000','-c:a','aac','-b:a','256k',str(dest)],check=True)
 report.append(dict(film=slug,bpm=bpm,entryBeat=offset,shotEnergy=energy,breaks=breaks,source='https://freesound.org/people/ecfike/sounds/202158/',license='CC0',recording='Clap Percussion Loop.wav by ecfike',content='Recorded finger snaps, hand claps and clothing percussion',actionEffects='Revision 10 individual cue sequences retained'))
(out/'arrangements.json').write_text(json.dumps(report,indent=2));print('Five distinct body-percussion arrangements mixed with existing action sounds.')
