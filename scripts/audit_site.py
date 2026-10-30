"""Audit every generated page and share card without network dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json
import hashlib
import re
import struct
import zipfile
import xml.etree.ElementTree as ET

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

def audit_readme(failures):
    readme = (ROOT / 'README.md').read_text(encoding='utf-8')
    previews = ROOT / 'site/static/previews'
    manifest = json.loads((previews / 'manifest.json').read_text(encoding='utf-8'))
    version = json.loads((ROOT / 'plugins/foreman/.claude-plugin/plugin.json').read_text(encoding='utf-8'))['version']
    if manifest['version'] != version:
        failures.append('README card version differs from plugin manifest')
    for name in [manifest['screenshot'], manifest['card']]:
        if 'docs/previews/' + name not in readme:
            failures.append('README does not use current preview: ' + name)
        source = previews / name
        if hashlib.sha256(source.read_bytes()).hexdigest() != manifest['images'][name]:
            failures.append('README image hash differs: ' + name)
    for file, expected in manifest['inputs'].items():
        source = ROOT / file
        data = source.read_bytes() if source.suffix == '.webp' else source.read_text(encoding='utf-8').replace('\r\n', '\n').encode('utf-8')
        if hashlib.sha256(data).hexdigest() != expected:
            failures.append('README preview is stale for ' + file + '; run node scripts/capture_readme.cjs and rebuild')
    skill = (ROOT / 'plugins/foreman/skills/foreman/SKILL.md').read_text(encoding='utf-8')
    card = re.search(r'Send it exactly as written[^\n]*\n\n```\n(.*?)\n```', skill, re.S).group(1)
    if hashlib.sha256(card.encode('utf-8')).hexdigest() != manifest['cardTextHash']:
        failures.append('README terminal card differs from current skill')
    plugin_readme = (ROOT / 'plugins/foreman/README.md').read_text(encoding='utf-8')
    for name in [manifest['screenshot'], manifest['card']]:
        if '/previews/' + name not in plugin_readme:
            failures.append('Plugin README preview is stale: ' + name)
    for alias, name in [('screenshot.png', manifest['screenshot']), ('card.png', manifest['card'])]:
        if (DOCS / alias).read_bytes() != (previews / name).read_bytes():
            failures.append('legacy preview URL is stale: ' + alias)
    for link in re.findall(r'\]\(([^)]+)\)', readme) + re.findall(r'src="([^"]+)"', readme):
        parts = urlsplit(link)
        if not parts.scheme and parts.path and not (ROOT / unquote(parts.path)).is_file():
            failures.append('README has a missing local file: ' + link)


def main():
    failures = []; cards = set(); titles = set(); indexable = set(); count = 0
    version = json.loads((ROOT / "plugins/foreman/.claude-plugin/plugin.json").read_text(encoding="utf-8"))["version"]
    for path in DOCS.rglob('*.html'):
        count += 1; rel = path.relative_to(DOCS).as_posix()
        route = '/' + (rel[:-10] if rel.endswith('index.html') else rel)
        raw = path.read_text(encoding='utf-8')
        page = Page(raw)
        def check(ok, message):
            if not ok: failures.append(f'{rel}: {message}')
        check(page.canonical == [BASE + route], 'canonical must match page')
        title = re.findall(r'<title>(.*?)</title>', raw, re.S)
        check(len(title) == 1 and bool(title[0].strip()), 'missing or duplicate title')
        if title:
            check(title[0] not in titles, 'title reused across pages'); titles.add(title[0])
        check('lang="en"' in raw and 'viewport' in page.meta, 'missing language or viewport')
        if 'noindex' not in page.meta.get('robots', ''): indexable.add(BASE + route)
        for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', raw, re.S):
            data = json.loads(block)
            for node in data.get('@graph', []):
                if node.get('@type') == 'SoftwareApplication':
                    check(node.get('softwareVersion') == version, 'structured-data version mismatch')
                    for key in ['image', 'screenshot']:
                        check(local(node[key]).is_file(), 'missing structured-data asset: ' + key)
                if node.get('@type') == 'WebPage': check(node.get('url') == BASE + route, 'structured-data URL mismatch')
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
    sitemap = ET.parse(DOCS / 'sitemap.xml')
    sitemap_urls = {e.text for e in sitemap.findall('.//{*}loc')}
    if sitemap_urls != indexable: failures.append('sitemap does not match indexable pages')
    if 'Sitemap: ' + BASE + '/sitemap.xml' not in (DOCS / 'robots.txt').read_text(encoding='utf-8'):
        failures.append('robots.txt does not point at the canonical sitemap')
    with zipfile.ZipFile(ROOT / 'dist/foreman.skill') as archive:
        for name in archive.namelist():
            if name.endswith('/'): continue
            source = ROOT / 'plugins/foreman/skills' / name
            if archive.read(name).replace(b'\r\n',b'\n') != source.read_bytes().replace(b'\r\n',b'\n'):
                failures.append('skill archive differs: ' + name)
    audit_readme(failures)
    if failures: raise SystemExit('\n'.join(failures))
    print(f'{count} pages: unique 1200x630 cards, canonical and social metadata, local links and anchors pass. Skill archive and README previews match source.')

if __name__ == '__main__': main()
