"""Export visible website copy; original recordings and code stay in English."""
import json
import re
import sys
from pathlib import Path
from localize import Localizer, normalize, SKIP, SOURCE_CLASSES, ATTRS
from build_site import build

ROOT=Path(__file__).resolve().parents[1]
entries={}
class Extractor(Localizer):
    def __init__(self,path):super().__init__('en',{});self.path=path
    def collect(self,value):
        value=normalize(value)
        if re.search('[A-Za-z]{2}',value):
            entries.setdefault(value,[])
            if self.path not in entries[value]:entries[value].append(self.path)
    def translate(self,value):self.collect(value);return value
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        blocked=self.blocked() or tag in SKIP or bool(set(data.get('class','').split()) & SOURCE_CLASSES)
        if not blocked:
            for key,value in attrs:
                if key in ATTRS and value:self.collect(value)
        if tag=='meta' and (data.get('name')=='description' or data.get('property')=='og:image:alt'):
            self.collect(data['content'])
        super().handle_starttag(tag,attrs)

for path,content in build(localized=False).items():
    if path.endswith('.html') and not path.startswith('samples/'):
        Extractor(path).feed(content)
for label in ['Languages','Close','Copied','Select text to copy','Scroll page','Switch to the light sheet','Switch to the night sheet','Stamp again. Last stamp:','Approved','Checked','Ready','Original session in English','Release notes in English']:
    entries.setdefault(label,['shared'])
target=ROOT/'site/i18n/source.json'
if '--check' in sys.argv:
    current=json.loads(target.read_text(encoding='utf8'))
    missing=set(entries)-set(current)
    if missing:raise SystemExit('Uncatalogued source copy: '+repr(sorted(missing)))
    print(f'{len(entries)} current source strings are catalogued.')
else:
    target.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(f'Exported {len(entries)} source strings. Update every locale catalog before building.')
