"""Static, offline localization. Catalogs are reviewed source, never runtime requests."""
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://foreman.turkialshuaibi.com'
I18N = ROOT / 'site/i18n'
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
SKIP = {'script','style','pre','code','svg'}
SOURCE_CLASSES = {'chat','fm','session-replay','log','footer-code'}
ROUTES = {'/','/modes/','/board/','/punch-list/','/palette/','/launch/','/install/','/changelog/','/404.html'}
ATTRS = {'alt','aria-label','title'}

def normalize(value):
    return re.sub(r'\s+', ' ', value).strip()

def path_for(code, route):
    return route if code == 'en' else '/' + code + route

def locale_data():
    return json.loads((I18N / 'locales.json').read_text(encoding='utf8'))

def picker(code, route, catalog, locales):
    t = lambda s: html.escape(catalog.get(s,s))
    current = next(l for l in locales if l['code'] == code)
    flag = lambda l: f'<img class="lang-flag" src="/flags/{l["flag"]}.svg" width="20" height="15" alt="" loading="lazy">'
    choices = []
    for lang in locales:
        selected = ' aria-current="true"' if lang['code'] == code else ''
        beta = '<small class="lang-beta">Beta</small>' if lang['code'] != 'en' else ''
        choices.append(f'<li><a class="lang-choice" href="{path_for(lang["code"],route)}" hreflang="{lang["tag"]}" lang="{lang["tag"]}"{selected}>{flag(lang)}<span>{lang["name"]}</span>{beta}</a></li>')
    return f'''<div class="lang-pick"><button class="lang-button" type="button" popovertarget="language-picker" aria-label="{t('Languages')}: {current['name']}">{flag(current)}<span lang="{current['tag']}">{current['name']}</span>{'<small class="lang-beta">Beta</small>' if code != 'en' else ''}<span aria-hidden="true">⌃</span></button>
<div id="language-picker" popover="auto" class="lang-sheet" role="dialog" aria-labelledby="language-picker-title"><div class="lang-sheet-head"><p id="language-picker-title">{t('Languages')}</p><button type="button" class="lang-close" popovertarget="language-picker" popovertargetaction="hide" aria-label="{t('Close')}">×</button></div><ul class="lang-choices">{''.join(choices)}</ul></div></div>'''

class Localizer(HTMLParser):
    def __init__(self, code, catalog):
        super().__init__(convert_charrefs=True)
        self.code, self.catalog = code, catalog
        self.stack, self.out = [], []

    def blocked(self):
        return any(skip for _,skip in self.stack)

    def translate(self, value):
        key = normalize(html.unescape(value))
        if key not in self.catalog:
            if self.code!='en' and re.search(r'[A-Za-z]{2}',key): raise ValueError(f'{self.code}: uncatalogued visible text: {key}')
            return html.escape(value,quote=False)
        lead = re.match(r'^\s*',value).group()
        tail = re.search(r'\s*$',value).group()
        return lead + html.escape(self.catalog[key],quote=False) + tail

    def handle_starttag(self,tag,attrs):
        data = dict(attrs)
        source = bool(set(data.get('class','').split()) & SOURCE_CLASSES)
        blocked = self.blocked() or tag in SKIP or source
        result = []
        for key,value in attrs:
            if value is not None and not blocked and key in ATTRS:
                value = self.catalog.get(normalize(value),value)
            if key == 'href' and value and value.startswith('/') and not value.startswith('//'):
                route = re.split('[?#]',value,1)[0]
                if route in ROUTES: value = path_for(self.code,value)
            result.append((key,value))
        if source or tag in {'pre','code'}:
            result = [(k,v) for k,v in result if k not in {'lang','dir'}] + [('lang','en'),('dir','ltr')]
        if tag == 'html':
            locale = next(l for l in locale_data() if l['code'] == self.code)
            result = [(k,v) for k,v in result if k not in {'lang','dir'}] + [('lang',locale['tag']),('dir','rtl' if self.code=='ar' else 'ltr')]
        self.out.append('<'+tag+''.join(' '+k+(('="'+html.escape(v,quote=True)+'"') if v is not None else '') for k,v in result)+'>')
        if tag not in VOID: self.stack.append((tag,blocked))

    def handle_endtag(self,tag):
        self.out.append('</'+tag+'>')
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self,data):
        raw = any(tag in {'script','style'} for tag,_ in self.stack)
        self.out.append(data if raw else (html.escape(data,quote=False) if self.blocked() else self.translate(data)))
    def handle_entityref(self,name): self.out.append('&'+name+';')
    def handle_charref(self,name): self.out.append('&#'+name+';')
    def handle_comment(self,data): self.out.append('<!--'+data+'-->')
    def handle_decl(self,data): self.out.append('<!'+data+'>')

def localize(files, pages):
    locales = locale_data()
    source = json.loads((I18N/'source.json').read_text(encoding='utf8'))
    for slug, meta in pages:
        route = meta['path']
        target = '404.html' if slug=='404' else ('index.html' if slug=='index' else slug+'/index.html')
        original = files[target]
        for lang in locales:
            code = lang['code']
            catalog = {} if code=='en' else json.loads((I18N/(code+'.json')).read_text(encoding='utf8'))
            missing = set(source)-set(catalog) if code!='en' else set()
            if missing: raise ValueError(f'{code}: {len(missing)} missing translations')
            parser = Localizer(code,catalog)
            # Resolve entities before text translation, without changing script contents.
            parser.feed(original)
            out = ''.join(parser.out)
            out=re.sub(r'aria-valuetext="50 percent reference-guided portfolio"',lambda _: 'aria-valuetext="50% '+html.escape(catalog.get('With Foreman','With Foreman'),quote=True)+'"',out)
            canonical = BASE+path_for(code,route)
            image = BASE+'/og/'+meta.get('og',slug)+(('-'+code+'-v3') if code!='en' else '-v2')+'.png'
            for key,english in [('title',meta['title']),('description',meta['description']),('og_alt',meta.get('og_alt',meta['title']))]:
                localized = html.escape(catalog.get(english,english),quote=True)
                if key=='title':
                    out = re.sub(r'<title>.*?</title>',lambda _: '<title>'+localized+'</title>',out,flags=re.S)
                    for name in ['og:title','twitter:title']:
                        out = re.sub(r'((?:name|property)="'+name+r'" content=")[^"]*',lambda m:m[1]+localized,out)
                else:
                    for name in (['description','og:description','twitter:description'] if key=='description' else ['og:image:alt']):
                        out = re.sub(r'((?:name|property)="'+name+r'" content=")[^"]*',lambda m:m[1]+localized,out)
            out = re.sub(r'(<link rel="canonical" href=")[^"]*',lambda m:m[1]+canonical,out)
            out = re.sub(r'((?:name|property)="og:url" content=")[^"]*',lambda m:m[1]+canonical,out)
            for name in ['og:image','twitter:image']:
                out = re.sub(r'((?:name|property)="'+name+r'" content=")[^"]*',lambda m:m[1]+image,out)
            def schema(match):
                data=json.loads(match[1])
                for node in data.get('@graph',[]):
                    if node.get('@type')=='WebPage':
                        node.update({'@id':canonical+'#page','url':canonical,'inLanguage':lang['tag'],'name':catalog.get(meta['title'],meta['title']),'description':catalog.get(meta['description'],meta['description'])})
                        node['primaryImageOfPage']={'@type':'ImageObject','url':image,'width':1200,'height':630}
                        if 'breadcrumb' in node:node['breadcrumb']={'@id':canonical+'#crumbs'}
                    if node.get('@type')=='WebSite':node['inLanguage']=[l['tag'] for l in locales]
                    if node.get('@type')=='SoftwareApplication':
                        node['inLanguage']='en'
                        node['description']=catalog.get(meta['description'],meta['description'])
                        node['installUrl']=BASE+path_for(code,'/install/')
                        node['image']=image
                    if node.get('@type')=='BreadcrumbList':
                        node['@id']=canonical+'#crumbs'
                        for item in node['itemListElement']:
                            item['item']=BASE+path_for(code,item['item'][len(BASE):])
                            item['name']=catalog.get(item['name'],item['name'])
                return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,indent=2)+'</script>'
            out=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,out,flags=re.S)
            alternates='\n'.join(f'<link rel="alternate" hreflang="{l["tag"]}" href="{BASE}{path_for(l["code"],route)}">' for l in locales)
            alternates+=f'\n<link rel="alternate" hreflang="x-default" href="{BASE+route}">'
            social=f'<meta name="twitter:image:alt" content="{html.escape(catalog.get(meta.get("og_alt",meta["title"]),meta.get("og_alt",meta["title"])),quote=True)}">\n'
            social+=f'<meta property="og:locale" content="{lang["og"]}">\n'+ '\n'.join(f'<meta property="og:locale:alternate" content="{l["og"]}">' for l in locales if l['code']!=code)
            if slug!='404':out=out.replace('content="index, follow"','content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"')
            out=out.replace('</head>',alternates+'\n'+social+'\n<link rel="stylesheet" href="/languages.css?v=1">\n</head>')
            marker='<div class="footer-signoff">'
            out=out.replace(marker,picker(code,route,catalog,locales)+marker)
            jskeys=['Copied','Select text to copy','Scroll page','Switch to the light sheet','Switch to the night sheet','Stamp again. Last stamp:','Approved','Checked','Ready','With Foreman']
            messages={s:catalog.get(s,s) for s in jskeys}
            out=out.replace('<script src="/site.js', '<script type="application/json" id="locale-messages">'+json.dumps(messages,ensure_ascii=False).replace('<','\\u003c')+'</script>\n<script src="/site.js')
            if code!='en':
                out=out.replace('<div class="log"', '<p class="source-language">'+html.escape(catalog['Release notes in English'])+'</p><div class="log"')
            files[target if code=='en' else code+'/'+target]=out
    files['languages.css']=(ROOT/'site/static/languages.css').read_text(encoding='utf8')
    for flag in (ROOT/'site/static/flags').glob('*.svg'): files['flags/'+flag.name]=flag.read_bytes()
    return locales
