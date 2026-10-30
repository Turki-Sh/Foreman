"""Check every film edition, caption track and the published delivery contract."""
import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from film_assets import captions, files, BASE, VIDEO, POSTER

ROOT=Path(__file__).resolve().parents[1]
DOCS=ROOT/'docs'
locales=json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))

class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.tags=[];self.feed(text)
    def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))

def main():
    english=captions()
    assert len(english)==14
    assert {p.stem for p in (ROOT/'films/captions').glob('*.json')}=={l['code'] for l in locales}
    for locale in locales:
        code=locale['code'];cues=captions(code)
        assert len(cues)==len(english),(code,'cue count')
        for i,(cue,source) in enumerate(zip(cues,english)):
            assert set(cue)==set(source),(code,i,'schema')
            assert cue['text'].strip() and '\ufffd' not in cue['text'],(code,i,'empty or broken text')
            assert all(cue[k]==source[k] for k in source if k!='text'),(code,i,'timing')
            assert cue['startMs']<cue['endMs']<=60000
            assert not any(c in cue['text'] for c in ['\u2013','\u2014'])
            if i:assert cues[i-1]['endMs']<=cue['startMs'],(code,i,'overlap')
        route=('' if code=='en' else code+'/')+'films/index.html'
        raw=(DOCS/route).read_text(encoding='utf8');page=Page(raw)
        video=[a for t,a in page.tags if t=='video']
        assert len(video)==1 and 'controls' in video[0] and 'autoplay' not in video[0]
        assert video[0]['poster']==POSTER
        tracks=[a for t,a in page.tags if t=='track']
        assert len(tracks)==33 and {a['srclang'] for a in tracks}=={l['tag'] for l in locales}
        for a in tracks:assert (DOCS/a['src'].lstrip('/')).is_file(),(code,a['src'])
        import re
        graphs=[json.loads(s) for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>',raw,re.S)]
        videos=[n for g in graphs for n in g['@graph'] if n.get('@type')=='VideoObject']
        assert len(videos)==1
        data=videos[0]
        assert data['contentUrl']==BASE+VIDEO and data['duration']=='PT1M' and data['inLanguage']=='en'
        assert data['creator']['name']=='Turki Alshuaibi' and len(data['caption'])==33
        assert data['transcript']==' '.join(c['text'] for c in cues)
        assert all(c['url'].startswith(BASE+('/' if code=='en' else '/'+code+'/')+'films/#t=') for c in data['hasPart'])
    for name,content in files().items():assert (DOCS/name).read_text(encoding='utf8')==content,name
    sitemap=ET.parse(DOCS/'video-sitemap.xml')
    assert len(sitemap.getroot())==33*5
    assert 'video-sitemap.xml' in (DOCS/'robots.txt').read_text()
    movie=DOCS/VIDEO.lstrip('/')
    data=movie.read_bytes()
    assert data.find(b'moov')<data.find(b'mdat'),'MP4 must be fast-start'
    assert len(data)<50_000_000,'unexpected delivery size'
    if '--media' in sys.argv:
        meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)],text=True))
        v=next(s for s in meta['streams'] if s['codec_type']=='video')
        a=next(s for s in meta['streams'] if s['codec_type']=='audio')
        assert (v['width'],v['height'],v['codec_name'],v['pix_fmt'])==(1920,1080,'h264','yuv420p')
        assert v['level']<=41 and a['codec_name']=='aac'
        assert 59.9<float(meta['format']['duration'])<60.2
    print('Film audit passed: 33 watch pages, 33 caption languages, transcript, metadata, chapters, sitemap and fast-start MP4.')

if __name__=='__main__':main()
