"""Original score for Before the code. No samples or external recordings.

Deterministic additive felt-key instrument, soft pulse, brushed noise and
stereo delay. The phrase opens sparsely, gains rhythm through the references,
rests for approval and resolves under the end card.
"""
import wave
from pathlib import Path
import numpy as np

SR=48000
DURATION=60
rng=np.random.default_rng(3001)
mix=np.zeros((SR*DURATION,2),np.float64)

def place(signal,at,gain=.1,pan=0):
    start=round(at*SR)
    if start>=len(mix):return
    signal=signal[:len(mix)-start]*gain
    mix[start:start+len(signal),0]+=signal*np.sqrt((1-pan)/2)
    mix[start:start+len(signal),1]+=signal*np.sqrt((1+pan)/2)

def key(note,at,gain=.1,length=4,pan=0):
    t=np.arange(round(length*SR))/SR
    hz=440*2**((note-69)/12)
    attack=1-np.exp(-t*140)
    sound=np.zeros_like(t)
    for harmonic,level,decay in [(1,1,1.8),(2,.26,1.1),(3,.11,.65),(4,.025,.35)]:
        sound+=level*np.sin(2*np.pi*hz*harmonic*(1+harmonic*.00012)*t)*np.exp(-t/decay)
    sound*=attack*np.minimum(1,(length-t)*4)
    place(sound,at,gain,pan)
    for delay,g in [(.1875,.13),(.375,.09),(.75,.05)]:place(sound,at+delay,gain*g,-pan)

def pad(notes,at,length,gain=.035):
    t=np.arange(round((length+2)*SR))/SR
    env=np.minimum(1,t/1.5)*np.clip((length+2-t)/2,0,1)
    for j,n in enumerate(notes):
        hz=440*2**((n-69)/12)
        s=(np.sin(2*np.pi*hz*t)+.22*np.sin(2*np.pi*hz*1.0018*t)+.14*np.sin(2*np.pi*hz*.998*t))*env
        place(s,at,gain,j/(len(notes)-1)*1.2-.6)

# D minor nine, B-flat major seven, F major nine, C suspended.
chords=[[50,57,60,64,69],[46,53,57,60,65],[53,60,64,67,72],[48,55,60,62,67]]
for bar in range(18):
    at=bar*3
    chord=chords[(bar//2)%4]
    pad(chord[:3],at,3,.017 if at<6 else .024)
    motif=[2,4,3,1,3,4,2,3]
    for step,degree in enumerate(motif):
        time=at+step*.375
        if time<6 and step not in [0,4]:continue
        if 30<=time<38 and step not in [0,4]:continue
        level=.08 if time<13 else .11
        if 30<=time<38:level=.055
        key(chord[degree]+12,time,level,3,(-.3 if step%2 else .3))
    if at>=6:
        key(chord[0]-12,at,.14,2.7,0)
    if 13<=at<30 or 39<=at<54:
        for beat in [0,1.5]:
            t=np.arange(round(.24*SR))/SR
            phase=2*np.pi*(46*t+13*(1-np.exp(-t*35))/35)
            place(np.sin(phase)*np.exp(-t*19),at+beat,.19)
        for beat in [.75,2.25]:
            noise=rng.normal(0,1,round(.12*SR));noise=np.diff(noise,prepend=0)
            place(noise*np.exp(-np.arange(len(noise))/SR*65),at+beat,.012,.25)
# A held, open D minor nine at the closing identity.
pad([50,57,60,64,69],54,4,.025)
for i,n in enumerate([62,69,72,76]):key(n,54+i*.14,.1,5.8,i*.2-.3)

# Quiet paper sweeps and a low approval impact at meaningful transitions.
for at in [5.7,12.7,21.7,29.7,37.7,47.7,53.7]:
    t=np.arange(round(.5*SR))/SR
    noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(50)/50,mode='same')
    envelope=np.sin(np.pi*t/.5)**3
    place(noise*envelope,at,.08,-.2)
key(38,35,.13,2.5)
# Stereo ambience, no algorithmically random melody or sampled music.
for delay,amount in [(.071,.12),(.113,.09),(.179,.06)]:
    shift=round(delay*SR)
    mix[shift:]+=mix[:-shift,::-1]*amount
time=np.arange(len(mix))/SR
fade=np.minimum(1,time/.12)*np.clip((60-time)/2.2,0,1)
mix*=fade[:,None]
mix=np.tanh(mix*1.3)
mix*=.72/max(np.max(np.abs(mix)),1e-9)
target=Path(__file__).resolve().parent/'public/score.wav'
target.parent.mkdir(exist_ok=True)
with wave.open(str(target),'wb') as out:
    out.setnchannels(2);out.setsampwidth(2);out.setframerate(SR)
    out.writeframes((mix*32767).astype('<i2').tobytes())
print(target)
