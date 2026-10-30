"""Audit all four film deliveries and all 132 localized watch pages."""
import json,re,subprocess,sys
from pathlib import Path
from series_assets import FILMS,cues,files,video,poster,BASE
from audit_films import Page
ROOT=Path(__file__).resolve().parents[1];DOCS=ROOT/'docs'
locales=json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))
for f in FILMS:
 data=(DOCS/video(f).lstrip('/')).read_bytes();assert data.find(b'moov')<data.find(b'mdat')
 assert len(data)<50_000_000
 if '--media' in sys.argv:
  m=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(DOCS/video(f).lstrip('/'))],text=True));v=next(s for s in m['streams'] if s['codec_type']=='video');a=next(s for s in m['streams'] if s['codec_type']=='audio')
  assert (v['width'],v['height'],v['codec_name'],v['pix_fmt'])==(1920,1080,'h264','yuv420p');assert v['level']<=41;assert a['codec_name']=='aac';assert 39.9<float(m['format']['duration'])<40.2
 for l in locales:
  code=l['code'];route=('/'+code if code!='en' else '')+'/films/'+f['slug']+'/'
  raw=(DOCS/route.lstrip('/')/'index.html').read_text(encoding='utf8');page=Page(raw)
  tracks=[a for t,a in page.tags if t=='track'];assert len(tracks)==33
  assert all((DOCS/a['src'].lstrip('/')).exists() for a in tracks)
  if code!='en':assert next(a for a in tracks if 'default' in a)['srclang']==l['tag']
  vv=next(a for t,a in page.tags if t=='video');assert vv['poster']==poster(f) and 'controls' in vv and 'autoplay' not in vv
  schema=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',raw,re.S)[1]);v=next(n for n in schema['@graph'] if n['@type']=='VideoObject')
  assert v['@id']==BASE+route+'#film';assert v['contentUrl']==BASE+video(f);assert v['duration']=='PT40S'
  assert v['transcript']==' '.join(c['text'] for c in cues(f,code));assert len(v['caption'])==33;assert v['creator']['name']=='Turki Alshuaibi'
  assert len([a for t,a in page.tags if t=='a' and 'data-film-time' in a])==8
for name,content in files().items():assert (DOCS/name).read_text(encoding='utf8')==content
print('Four films: 132 watch pages, 264 caption files, transcripts, metadata and delivery contract passed.')
