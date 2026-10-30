"""Verify translated routes, equivalent-page links, social images and catalogs."""
import hashlib
import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from localize import locale_data, path_for, BASE
from build_site import page_meta, read

class Tags(HTMLParser):
    def __init__(self,raw):
        super().__init__();self.tags=[];self.feed(raw)
    def handle_starttag(self,t,a):self.tags.append((t,dict(a)))

def main():
    locales=locale_data();source=json.loads(read(ROOT/'site/i18n/source.json'))
    assert len(locales)==33
    failures=[];count=0;hashes=set()
    for locale in locales:
        code=locale['code']
        if code!='en':
            catalog=json.loads(read(ROOT/'site/i18n'/f'{code}.json'))
            assert set(source)<=set(catalog),(code,'incomplete catalog')
            assert all(isinstance(v,str) and v.strip() for v in catalog.values()),(code,'empty value')
        for src in (ROOT/'site/pages').glob('*.html'):
            meta,_=page_meta(read(src));route=path_for(code,meta['path'])
            target=ROOT/'docs'/route.lstrip('/')
            if not route.endswith('.html'):target=target/'index.html'
            raw=read(target);tags=Tags(raw).tags;count+=1
            def check(ok,message):
                if not ok:failures.append(f'{route}: {message}')
            doc=next(a for t,a in tags if t=='html')
            check(doc.get('lang')==locale['tag'],'document language')
            check(doc.get('dir')==('rtl' if code=='ar' else 'ltr'),'document direction')
            alternates={a['hreflang']:a['href'] for t,a in tags if t=='link' and a.get('rel')=='alternate'}
            expected={l['tag']:BASE+path_for(l['code'],meta['path']) for l in locales}
            expected['x-default']=BASE+meta['path']
            check(alternates==expected,'reciprocal hreflang set')
            choices=[a for t,a in tags if t=='a' and 'lang-choice' in a.get('class','').split()]
            check(len(choices)==33,'footer language count')
            check({a['href'] for a in choices}=={path_for(l['code'],meta['path']) for l in locales},'footer equivalent-page destinations')
            selected=[a for a in choices if a.get('aria-current')=='true']
            check(len(selected)==1 and selected[0]['href']==route,'current language')
            check(raw.count('class="lang-beta"')==(32 if code=='en' else 33),'Beta labels')
            check('AI translations' not in raw and 'AI-translated' not in raw,'unrequested translation label')
            image=next(a['content'] for t,a in tags if t=='meta' and a.get('property')=='og:image')
            image_path=ROOT/'docs'/image.removeprefix(BASE+'/')
            if image_path.exists():
                digest=hashlib.sha256(image_path.read_bytes()).hexdigest()
                check(digest not in hashes,'duplicate social image bytes');hashes.add(digest)
            else:check(False,'missing social image')
            check('id="locale-messages"' in raw,'localized dynamic labels')
    manifest=json.loads(read(ROOT/'site/static/og/localized-manifest.json'))
    check(len(manifest['cards'])==32*len(list((ROOT/'site/pages').glob('*.html'))),'localized art count')
    check(len({card['artHash'] for card in manifest['cards']})==32*len(list((ROOT/'site/pages').glob('*.html'))),'art compositions must differ beyond text')
    if failures:raise SystemExit('\n'.join(failures))
    print(f'{count} localized pages, 33 languages, {len(manifest['cards'])} distinct localized compositions: language audit passed.')

if __name__=='__main__':main()
