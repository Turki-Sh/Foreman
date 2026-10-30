"""Four focused product demonstrations, with localized watch assets."""
import json,html
from pathlib import Path
import film_assets
ROOT=Path(__file__).resolve().parents[1]
BASE=film_assets.BASE
MEDIA=film_assets.MEDIA
FILMS=json.loads((ROOT/'films/series/manifest.json').read_text(encoding='utf-8-sig'))
def get(slug):return next((f for f in FILMS if 'film-'+f['slug']==slug),None)
def catalog(code):return json.loads((ROOT/'films/series'/f'{code}.json').read_text(encoding='utf-8-sig'))
def video(f):return MEDIA+f['slug']+'-en-1080-v1.mp4'
def poster(f):return MEDIA+f['slug']+'-poster-v1.jpg'
def caption_path(f,code,ext='vtt'):return MEDIA+'captions/'+f['slug']+'/'+code+'.'+ext
def cues(f,code='en'):return [dict(text=catalog(code)[s],startMs=i*5000,endMs=(i+1)*5000-100) for i,s in enumerate(f['cues'])]
def files():
 out={};sounds={'en':'[Instrumental music]'}
 for p in (ROOT/'films').glob('music-*.json'):sounds.update(json.loads(p.read_text(encoding='utf-8-sig')))
 for f in FILMS:
  for l in json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8')):
   code=l['code'];cc=cues(f,code);cc[0]['startMs']=1000;cc=[dict(text=sounds[code],startMs=0,endMs=1000)]+cc
   for ext in ['vtt','srt']:
    body='' if ext=='srt' else 'WEBVTT\n\n'
    for i,c in enumerate(cc,1):body+=f'{i}\n{film_assets.stamp(c["startMs"],ext=="srt")} --> {film_assets.stamp(c["endMs"],ext=="srt")}\n{c["text"]}\n\n'
    out[caption_path(f,code,ext).lstrip('/')]=body.rstrip()+'\n'
 return out
def player(f):
 locales=json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))
 tracks=''.join(f'<track kind="captions" src="{caption_path(f,l["code"])}" srclang="{l["tag"]}" label="{html.escape(l["name"])}{(" · Beta" if l["code"]!="en" else "")}">' for l in locales)
 return f'<video id="foreman-film" width="1920" height="1080" controls playsinline preload="metadata" poster="{poster(f)}" aria-label="{html.escape(f["title"])}"><source src="{video(f)}" type="video/mp4">{tracks}</video>'
def transcript(f):
 return '<ol>'+''.join(f'<li id="t={i*5}"><a href="#t={i*5}" data-film-time="{i*5}">00:{i*5:02}</a><p>{html.escape(s)}</p></li>' for i,s in enumerate(f['cues']))+'</ol>'
def related(current=None):
 items=[]
 for f in FILMS:
  if current==f['slug']:continue
  items.append(f'<a class="film-card" href="/films/{f["slug"]}/"><img src="{poster(f)}" width="1280" height="720" loading="lazy" alt=""><h3>{f["title"]}</h3><p>{f["description"]}</p><span>Watch film <b aria-hidden="true">↗</b></span></a>')
 return '<section class="film-library wrap"><h2>More films</h2><div class="film-grid">'+''.join(items)+'</div></section>'
def schema(f,meta):
 locales=json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))
 return {'@type':'VideoObject','@id':BASE+meta['path']+'#film','name':f['title'],'description':f['description'],'thumbnailUrl':[BASE+poster(f)],'contentUrl':BASE+video(f),'uploadDate':'2026-10-30T06:00:00Z','duration':'PT40S','inLanguage':'en','isFamilyFriendly':True,'creator':{'@type':'Person','name':'Turki Alshuaibi','url':'https://turkialshuaibi.com/'},'caption':[BASE+caption_path(f,l['code']) for l in locales],'transcript':' '.join(f['cues'])}
def sitemap_entries(locales):
 out=[]
 for f in FILMS:
  for l in locales:
   code=l['code'];c=catalog(code);route=('/'+code if code!='en' else '')+'/films/'+f['slug']+'/'
   out.append(f'<url><loc>{BASE+route}</loc><video:video><video:thumbnail_loc>{BASE+poster(f)}</video:thumbnail_loc><video:title>{html.escape(c[f["title"]])}</video:title><video:description>{html.escape(c[f["description"]])}</video:description><video:content_loc>{BASE+video(f)}</video:content_loc><video:duration>40</video:duration><video:family_friendly>yes</video:family_friendly></video:video></url>')
 return '\n'.join(out)+'\n'
