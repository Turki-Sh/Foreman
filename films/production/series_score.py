from pathlib import Path
import numpy as np,wave,subprocess
root=Path('films/production');sr=48000;duration=40
for version in range(4):
 rng=np.random.default_rng(900+version);mix=np.zeros((sr*duration,2));beat=[.625,.5,.75,.625][version]
 chords=[[48,55,62,67],[50,57,60,65],[53,60,64,69],[45,52,59,64]]
 def note(n,at,g=.12,length=2,pan=0):
  t=np.arange(int(length*sr))/sr;hz=440*2**((n-69)/12)
  sound=(np.sin(2*np.pi*hz*t)*np.exp(-t/1.2)+.22*np.sin(4*np.pi*hz*t)*np.exp(-t/.4))*(1-np.exp(-t*110))
  start=int(at*sr);sound=sound[:len(mix)-start]*g
  if start>=len(mix):return
  mix[start:start+len(sound),0]+=sound*np.sqrt((1-pan)/2);mix[start:start+len(sound),1]+=sound*np.sqrt((1+pan)/2)
 for k,at in enumerate(np.arange(0,35,beat)):
  chord=chords[(version+int(at//10))%4]
  note(chord[[0,2,1,3,2,1,3,1][k%8]]+12,at,.095 if k%2 else .125,2,(-.3 if k%2 else .3))
  if k%4==0:note(chord[0]-12,at,.15,2.5)
  if version in [1,3] and k%2==0:
   t=np.arange(int(.2*sr))/sr;s=np.sin(2*np.pi*(50*t+.2*(1-np.exp(-t*30))))*np.exp(-t*25)*.18;start=int(at*sr);mix[start:start+len(s)]+=s[:,None]
 for i,n in enumerate(chords[version]):note(n+12,35+i*.12,.11,4.5,i*.2-.3)
 for at in [5,10,15,20,25,30,35]:
  t=np.arange(int(.12*sr))/sr;s=rng.normal(0,1,len(t));s=np.convolve(s,np.ones(20)/20,mode='same')*np.exp(-t*45)*.035;start=int(at*sr);mix[start:start+len(s)]+=s[:,None]
 for delay,g in [(.12,.12),(.24,.08)]:
  n=int(delay*sr);mix[n:]+=mix[:-n,::-1]*g
 fade=np.minimum(np.arange(len(mix))/sr/0.05,1)*np.clip((duration-np.arange(len(mix))/sr)/1.2,0,1);mix*=fade[:,None]
 mix*=.7/max(abs(mix).max(),.01)
 wav=root/'out'/f'series-{version}.wav';wav.parent.mkdir(exist_ok=True)
 with wave.open(str(wav),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(wav),'-af','loudnorm=I=-17:TP=-2:LRA=9','-c:a','aac','-b:a','192k',str(root/'public'/f'series-{version}.m4a')],check=True)
print('Four original scores generated, 40 seconds each.')
