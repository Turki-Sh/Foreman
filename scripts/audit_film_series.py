"""Verify final video delivery and unique thumbnail assets."""
import hashlib,json,subprocess,sys
from pathlib import Path
from series_assets import FILMS,video,poster
ROOT=Path(__file__).resolve().parents[1];DOCS=ROOT/'docs'
hashes=set()
for f in FILMS:
 movie=DOCS/video(f).lstrip('/');data=movie.read_bytes()
 assert 0<data.find(b'moov')<data.find(b'mdat'),'MP4 must support fast start'
 assert len(data)<50_000_000
 thumb=(DOCS/poster(f).lstrip('/')).read_bytes();h=hashlib.sha256(thumb).hexdigest();assert h not in hashes;hashes.add(h)
 assert (DOCS/f['frames'].lstrip('/')).is_file()
 if '--media' in sys.argv:
  m=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)],text=True))
  v=next(s for s in m['streams'] if s['codec_type']=='video');a=next(s for s in m['streams'] if s['codec_type']=='audio')
  assert (v['width'],v['height'],v['codec_name'],v['pix_fmt'],v['r_frame_rate'])==(1920,1080,'h264','yuv420p','60/1')
  assert v['level']<=42 and v['color_space']=='bt709' and a['codec_name']=='aac'
  assert abs(float(m['format']['duration'])-f['duration'])<.1
print('Five final films: distinct thumbnails, seek previews and fast-start MP4 delivery passed.')
