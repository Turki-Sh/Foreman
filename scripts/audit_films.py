"""Validate the collection, all localized watch pages and current caption assets."""
import json,re,sys,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
from series_assets import FILMS,LOCALES,BASE,video,poster,cues,files
ROOT=Path(__file__).resolve().parents[1];DOCS=ROOT/'docs'
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
def main():
 for l in LOCALES:
  code=l['code'];prefix='' if code=='en' else code+'/'
  collection=(DOCS/prefix/'film/index.html').read_text(encoding='utf8');cp=Page(collection)
  assert len([a for t,a in cp.tags if t=='a' and a.get('class')=='film-card'])==5
  assert not any(t=='video' for t,a in cp.tags),'collection should link to dedicated watch pages'
  for f in FILMS:
   route='/'+prefix+'film/'+f['slug']+'/'
   raw=(DOCS/route.lstrip('/')/'index.html').read_text(encoding='utf8');p=Page(raw)
   vids=[a for t,a in p.tags if t=='video'];assert len(vids)==1 and 'controls' in vids[0] and 'autoplay' not in vids[0]
   assert vids[0]['poster']==poster(f)
   tracks=[a for t,a in p.tags if t=='track'];assert len(tracks)==33
   assert {a['srclang'] for a in tracks}=={x['tag'] for x in LOCALES}
   assert len([a for a in tracks if 'default' in a])==1
   assert next(a for a in tracks if 'default' in a)['srclang']==l['tag']
   assert all((DOCS/a['src'].lstrip('/')).is_file() for a in tracks)
   graph=json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',raw,re.S)[1])['@graph']
   v=next(n for n in graph if n['@type']=='VideoObject')
   assert v['@id']==BASE+route+'#film' and v['contentUrl']==BASE+video(f)
   assert v['duration']==f'PT{f["duration"]:.3f}S' and v['inLanguage']=='en'
   cc=cues(f,code);english=cues(f);assert len(cc)==8
   for i,(c,e) in enumerate(zip(cc,english)):
    assert c['text'].strip() and '\ufffd' not in c['text']
    assert c['startMs']==e['startMs'] and c['endMs']==e['endMs']
    assert 0<=c['startMs']<c['endMs']<=f['duration']*1000
    assert not i or cc[i-1]['endMs']<=c['startMs']
    assert not any(x in c['text'] for x in ['\u2013','\u2014'])
   assert v['transcript']==' '.join(c['text'] for c in cc)
   assert len(v['caption'])==33 and v['creator']['name']=='Turki Alshuaibi'
   assert len(v['hasPart'])==8 and all(c['url'].startswith(BASE+route+'?t=') for c in v['hasPart'])
   assert len([a for t,a in p.tags if t=='a' and 'data-film-time' in a])==8
   legacy=(DOCS/prefix/'films'/f['slug']/'index.html').read_text(encoding='utf8');assert f'url={route}' in legacy
 for name,content in files().items():assert (DOCS/name).read_text(encoding='utf8')==content,name
 sitemap=ET.parse(DOCS/'video-sitemap.xml').getroot();assert len(sitemap)==165
 assert all('/film/' in n.text for n in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'))
 assert 'video-sitemap.xml' in (DOCS/'robots.txt').read_text()
 print('Film pages passed: 33 collections, 165 watch pages, 165 synchronized caption tracks, transcripts, key moments, redirects and video sitemap.')
if __name__=='__main__':main()
