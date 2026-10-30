"""Audit every generated page and share card without network dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json
import struct
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
BASE = 'https://foreman.turkialshuaibi.com'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta = {}; self.links = []; self.ids = set(); self.canonical = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta': self.meta[a.get('property', a.get('name', ''))] = a.get('content', '')
        if a.get('id'): self.ids.add(a['id'])
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical.append(a['href'])
        if tag in ('a', 'link', 'img', 'script'):
            value = a.get('href') or a.get('src')
            if value: self.links.append(value)

def local(url):
    path = DOCS / unquote(urlsplit(url).path).lstrip('/')
    return path / 'index.html' if path.is_dir() else path

def main():
    failures = []; cards = set(); count = 0
    for path in DOCS.rglob('*.html'):
        count += 1; rel = path.relative_to(DOCS).as_posix()
        route = '/' + (rel[:-10] if rel.endswith('index.html') else rel)
        page = Page(path.read_text(encoding='utf-8'))
        def check(ok, message):
            if not ok: failures.append(f'{rel}: {message}')
        check(page.canonical == [BASE + route], 'canonical must match page')
        for key in ['description','og:title','og:description','og:url','og:image','og:image:alt','twitter:card','twitter:title','twitter:description','twitter:image']:
            check(bool(page.meta.get(key)), 'missing ' + key)
        check(page.meta.get('og:url') == BASE + route, 'OG URL mismatch')
        card = page.meta.get('og:image','')
        check(card.startswith(BASE + '/og/'), 'OG image must be absolute')
        check(card not in cards, 'share card reused across pages'); cards.add(card)
        check(page.meta.get('twitter:image') == card, 'Twitter image mismatch')
        file = local(card)
        check(file.is_file(), 'missing share card')
        if file.is_file(): check(struct.unpack('>II',file.read_bytes()[16:24]) == (1200,630), 'share card dimensions')
        if '404' in rel or rel.startswith('samples/'):
            check('noindex' in page.meta.get('robots',''), 'example/error page must be noindex')
        for href in page.links:
            url = urljoin(BASE + route, href); parts = urlsplit(url)
            if parts.netloc != urlsplit(BASE).netloc or parts.scheme not in ('http','https'): continue
            target = local(url); check(target.is_file(), 'broken local resource ' + href)
            if target.is_file() and parts.fragment and target.suffix == '.html':
                check(unquote(parts.fragment) in Page(target.read_text(encoding='utf-8')).ids, 'missing anchor ' + href)
    with zipfile.ZipFile(ROOT / 'dist/foreman.skill') as archive:
        for name in archive.namelist():
            if name.endswith('/'): continue
            source = ROOT / 'plugins/foreman/skills' / name
            if archive.read(name).replace(b'\r\n',b'\n') != source.read_bytes().replace(b'\r\n',b'\n'):
                failures.append('skill archive differs: ' + name)
    if failures: raise SystemExit('\n'.join(failures))
    print(f'{count} pages: unique 1200x630 cards, canonical and social metadata, local links and anchors pass. Skill archive matches source.')

if __name__ == '__main__': main()
