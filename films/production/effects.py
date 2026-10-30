"""Sparse non-musical interaction sounds. No tones, chords, melody or rhythm bed."""
from pathlib import Path
import json, subprocess, wave
import numpy as np
ROOT=Path(__file__).resolve().parents[2]
PROD=Path(__file__).resolve().parent
SR=48000
films=[('before-the-code',60,[6,13,22,30,35,38,48,54])]+[(f['slug'],40,[5,10,15,20,25,30,35]) for f in json.loads((ROOT/'films/series/manifest.json').read_text(encoding='utf8'))]
for index,(slug,duration,events) in enumerate(films):
 rng=np.random.default_rng(7100+index);mix=np.zeros((duration*SR,2))
 for j,at in enumerate(events):
  # Short filtered-noise click and an airy movement tail. Non-pitched foley.
  length=.045 if j%2==0 else .22
  t=np.arange(int(length*SR))/SR
  noise=rng.normal(0,1,len(t))
  kernel=6 if j%2==0 else 80
  noise=np.convolve(noise,np.ones(kernel)/kernel,mode='same')
  envelope=np.exp(-t/(.008 if j%2==0 else .055))*(1-np.exp(-t*1400))
  sound=noise*envelope*(.16 if j%2==0 else .22)
  start=int(at*SR)
  pan=(-.18 if j%2 else .18)
  mix[start:start+len(sound),0]+=sound*np.sqrt((1-pan)/2)
  mix[start:start+len(sound),1]+=sound*np.sqrt((1+pan)/2)
 wav=PROD/'out'/f'{slug}-effects.wav';wav.parent.mkdir(exist_ok=True)
 with wave.open(str(wav),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
 audio=PROD/'public'/f'{slug}-effects.m4a'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(wav),'-c:a','aac','-b:a','192k',str(audio)],check=True)
 # Replace music in the local draft without re-encoding the video picture.
 movie=ROOT/'site/static/media/films'/f'{slug}-en-1080-v1.mp4'
 temporary=PROD/'out'/f'{slug}-effects-only.mp4'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(movie),'-i',str(audio),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart','-t',str(duration),str(temporary)],check=True)
 movie.write_bytes(temporary.read_bytes())
 print(slug+': instrumental score replaced with sparse effects')
