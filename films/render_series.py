import json,subprocess
from pathlib import Path
r=Path.cwd();out=r/'site/static/media/films';prod=r/'films/production'
for f in json.loads((r/'films/series/manifest.json').read_text()):
 dest=prod/'out'/f"{f['slug']}-master.mp4"
 subprocess.run(['npx.cmd','remotion','render','src/index.ts',f['id'],str(dest),'--codec=h264','--crf=18','--concurrency=4','--log=error'],cwd=prod,check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(dest),'-c:v','libx264','-preset','medium','-crf','20','-profile:v','high','-level:v','4.1','-vf','scale=in_range=pc:out_range=tv','-color_range','tv','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',str(out/f"{f['slug']}-en-1080-v1.mp4")],check=True)
 subprocess.run(['ffmpeg','-y','-v','error','-ss',str({'find-your-direction':17.5,'fix-what-feels-wrong':27.5,'colour-that-works':22.5,'before-you-share':17.5}[f['slug']]),'-i',str(dest),'-frames:v','1','-vf','scale=1280:720',str(out/f"{f['slug']}-poster-v1.jpg")],check=True)
 for i in range(8):
  subprocess.run(['ffmpeg','-y','-v','error','-ss',str(i*5+2.5),'-i',str(out/f"{f['slug']}-en-1080-v1.mp4"),'-frames:v','1','-vf','scale=960:540',str(out/'stills'/f"{f['slug']}-{i}.webp")],check=True)
 print('Rendered '+f['slug'],flush=True)
