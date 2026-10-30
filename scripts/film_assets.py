"""Authored film metadata, captions and watch-page markup."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://foreman.turkialshuaibi.com'
MEDIA = '/media/films/'
VIDEO = MEDIA + 'before-the-code-en-1080-v1.mp4'
POSTER = MEDIA + 'before-the-code-poster-v1.jpg'

def captions(code='en'):
    return json.loads((ROOT / 'films/captions' / (code + '.json')).read_text(encoding='utf-8-sig'))

def stamp(ms, srt=False):
    whole, milli = divmod(ms, 1000)
    minute, second = divmod(whole, 60)
    hour, minute = divmod(minute, 60)
    return f'{hour:02}:{minute:02}:{second:02}{"," if srt else "."}{milli:03}'

def files():
    result = {}
    for path in sorted((ROOT / 'films/captions').glob('*.json')):
        cues = captions(path.stem)
        for extension in ['vtt','srt']:
            srt = extension == 'srt'
            body = '' if srt else 'WEBVTT\n\n'
            for index, cue in enumerate(cues,1):
                body += f'{index}\n{stamp(cue["startMs"],srt)} --> {stamp(cue["endMs"],srt)}\n{cue["text"]}\n\n'
            result['media/films/captions/' + path.stem + '.' + extension] = body.rstrip() + '\n'
    return result

def player():
    locales = json.loads((ROOT/'site/i18n/locales.json').read_text(encoding='utf8'))
    tracks = ''.join(f'<track kind="captions" src="{MEDIA}captions/{l["code"]}.vtt" srclang="{l["tag"]}" label="{html.escape(l["name"])}{(" · Beta" if l["code"]!="en" else "")}">' for l in locales)
    return f'<video id="foreman-film" width="1920" height="1080" controls playsinline preload="metadata" poster="{POSTER}" aria-label="Before the code, a film by Turki Alshuaibi"><source src="{VIDEO}" type="video/mp4">{tracks}<a href="{VIDEO}">Download film</a></video>'

def transcript():
    rows = []
    for cue in captions():
        seconds=cue['startMs']/1000
        token=f'{seconds:g}'
        anchor='' if seconds in {0,6,13,22,30,38,48} else f' id="t={token}"'
        rows.append(f'<li{anchor}><a href="#t={token}" data-film-time="{token}">{int(seconds)//60:02}:{int(seconds)%60:02}</a><p>{html.escape(cue["text"])}</p></li>')
    return '<ol>' + ''.join(rows) + '</ol>'

def schema(meta):
    return {
        '@type':'VideoObject','@id':BASE+'/films/#film',
        'name':'Before the code.','description':meta['description'],
        'thumbnailUrl':[BASE+POSTER], 'contentUrl':BASE+VIDEO,
        'uploadDate':'2026-10-30T05:22:00Z','duration':'PT1M',
        'inLanguage':'en','isFamilyFriendly':True,
        'creator':{'@type':'Person','name':'Turki Alshuaibi','url':'https://turkialshuaibi.com/'},
        'caption': [BASE+MEDIA+'captions/'+p.stem+'.vtt' for p in sorted((ROOT/'films/captions').glob('*.json'))],
        'transcript':' '.join(c['text'] for c in captions()),
        'hasPart':[{'@type':'Clip','name':name,'startOffset':start,'endOffset':end,'url':BASE+'/films/#t='+str(start)} for start,end,name in [(0,6,'Before the code.'),(6,13,'The request'),(13,22,'References'),(22,30,'Visual system'),(30,38,'Build brief'),(38,48,'The build'),(48,54,'Toolbelt')]]
    }

def video_sitemap(locales, description):
    items=[]
    for locale in locales:
        code=locale['code']
        catalog={} if code=='en' else json.loads((ROOT/'site/i18n'/f'{code}.json').read_text(encoding='utf8'))
        route='/films/' if code=='en' else '/'+code+'/films/'
        items.append(f'<url><loc>{BASE+route}</loc><video:video><video:thumbnail_loc>{BASE+POSTER}</video:thumbnail_loc><video:title>{html.escape(catalog.get("Before the code.","Before the code."))}</video:title><video:description>{html.escape(catalog.get(description,description))}</video:description><video:content_loc>{BASE+VIDEO}</video:content_loc><video:duration>60</video:duration><video:family_friendly>yes</video:family_friendly></video:video></url>')
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n'+'\n'.join(items)+'\n</urlset>\n'
