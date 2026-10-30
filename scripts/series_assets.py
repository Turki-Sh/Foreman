"""Current Foreman films: one delivery manifest for pages, captions and discovery."""
import html,json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE='https://foreman.turkialshuaibi.com'
MEDIA='/media/films/'
FILMS=json.loads((ROOT/'films/cinema/manifest.json').read_text(encoding='utf8'))
LOCALES=json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))
def get(slug):return next((f for f in FILMS if 'film-'+f['slug']==slug),None)
def catalog(code):return {} if code=='en' else json.loads((ROOT/'site/i18n'/f'{code}.json').read_text(encoding='utf8'))
def video(f):return f['video']
def poster(f):return f['poster']
def caption_path(f,code,ext='vtt'):return MEDIA+'captions/'+f['slug']+'/'+code+'.'+ext
def cues(f,code='en'):return json.loads((ROOT/'films/cinema/captions'/f['slug']/f'{code}.json').read_text(encoding='utf8'))
def stamp(ms,srt=False):
 h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
 return f'{h:02}:{m:02}:{s:02}{"," if srt else "."}{ms:03}'
def files():
 out={}
 for f in FILMS:
  for l in LOCALES:
   for ext in ['vtt','srt']:
    body='' if ext=='srt' else 'WEBVTT\n\n'
    for i,c in enumerate(cues(f,l['code']),1):body+=f'{i}\n{stamp(c["startMs"],ext=="srt")} --> {stamp(c["endMs"],ext=="srt")}\n{c["text"]}\n\n'
    out[caption_path(f,l['code'],ext).lstrip('/')]=body.rstrip()+'\n'
 return out

def player(f):
 tracks=''.join(f'<track kind="captions" src="{caption_path(f,l["code"])}" srclang="{l.get("tag",l["code"])}" label="{html.escape(l["name"])}{(" · Beta" if l["code"]!="en" else "")}">' for l in LOCALES)
 data={k:f[k] for k in ['slug','title','duration','starts','durations','frames']}
 return f'<video data-foreman-film id="foreman-film" width="1920" height="1080" controls playsinline preload="metadata" poster="{poster(f)}" aria-label="{html.escape(f["title"])}"><source src="{video(f)}" type="video/mp4">{tracks}</video><script>window.FOREMAN_FILMS={json.dumps([data],ensure_ascii=False).replace("<",chr(92)+"u003c")};</script>'
def transcript(f):
 return '<ol>'+''.join(f'<li><a href="?t={round(f["starts"][i],3)}" data-film-time="{round(f["starts"][i],3)}">{int(f["starts"][i])//60:02}:{int(f["starts"][i])%60:02}</a><p>{html.escape(c["text"])}</p></li>' for i,c in enumerate(cues(f)))+'</ol>'
def cards(current=None):
 return '<div class="film-grid">'+''.join(f'<a class="film-card" href="/film/{f["slug"]}/"><div class="film-card-image"><img src="{poster(f)}" width="1920" height="1080" loading="lazy" alt=""><span aria-hidden="true" class="film-card-play">▶</span></div><h3>{f["title"]}</h3><p>{f["description"]}</p><span>Watch film <b aria-hidden="true">↗</b></span></a>' for f in FILMS if f['slug']!=current)+'</div>'
def related(current=None):return '<section class="film-library wrap"><h2>More films</h2>'+cards(current)+'</section>'
def schema(f,meta):
 url=BASE+meta['path']
 return {'@type':'VideoObject','@id':url+'#film','url':url,'mainEntityOfPage':{'@id':url+'#page'},'name':f['title'],'description':f['description'],'thumbnailUrl':[BASE+poster(f)],'contentUrl':BASE+video(f),'uploadDate':'2026-10-30T15:00:00+03:00','duration':f'PT{f["duration"]:.3f}S','inLanguage':'en','isFamilyFriendly':True,'creator':{'@type':'Person','@id':'https://turkialshuaibi.com/#person','name':'Turki Alshuaibi','url':'https://turkialshuaibi.com/'},'about':{'@type':'SoftwareApplication','@id':BASE+'/#software','name':'Foreman','url':BASE+'/'},'caption':[BASE+caption_path(f,l['code']) for l in LOCALES],'transcript':' '.join(c['text'] for c in cues(f)),'hasPart':[{'@type':'Clip','name':c['text'],'startOffset':round(f['starts'][i],3),'endOffset':round(f['starts'][i]+f['durations'][i],3),'url':url+'?t='+str(round(f['starts'][i],3))} for i,c in enumerate(cues(f))],'potentialAction':{'@type':'SeekToAction','target':url+'?t={seek_to_second_number}','startOffset-input':'required name=seek_to_second_number'}}
def collection_schema():
 return {'@type':'ItemList','@id':BASE+'/film/#films','name':'Foreman films by Turki Alshuaibi','numberOfItems':len(FILMS),'itemListElement':[{'@type':'ListItem','position':i+1,'name':f['title'],'url':BASE+'/film/'+f['slug']+'/'} for i,f in enumerate(FILMS)]}
def video_sitemap(locales):
 out=[]
 for f in FILMS:
  for l in locales:
   code=l['code'];c=catalog(code);route=('/'+code if code!='en' else '')+'/film/'+f['slug']+'/'
   out.append(f'<url><loc>{BASE+route}</loc><video:video><video:thumbnail_loc>{BASE+poster(f)}</video:thumbnail_loc><video:title>{html.escape(c.get(f["title"],f["title"]))}</video:title><video:description>{html.escape(c.get(f["description"],f["description"]))}</video:description><video:content_loc>{BASE+video(f)}</video:content_loc><video:duration>{math.ceil(f["duration"])}</video:duration><video:publication_date>2026-10-30T15:00:00+03:00</video:publication_date><video:family_friendly>yes</video:family_friendly></video:video></url>')
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n'+'\n'.join(out)+'\n</urlset>\n'
def redirects(locales):
 out={}
 for l in locales:
  prefix='' if l['code']=='en' else '/'+l['code']
  aliases={'/films/':'/film/','/films/before-the-code/':'/film/before-the-code/'}
  aliases.update({'/films/'+f['slug']+'/':'/film/'+f['slug']+'/' for f in FILMS})
  for old,new in aliases.items():
   target=prefix+new;out[(prefix+old).strip('/')+'/index.html']=f'<!doctype html><html lang="{l.get("tag",l["code"])}"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url={target}"><link rel="canonical" href="{BASE+target}"><meta name="robots" content="noindex,follow"><title>Foreman</title></head><body><a href="{target}">Foreman</a></body></html>\n'
 return out
