"""Fetch permitted free device frames for local rendering, not redistribution."""
from pathlib import Path
from urllib.request import Request,urlopen
root=Path(__file__).resolve().parents[1]/'production/public/cinema/rev12'
root.mkdir(parents=True,exist_ok=True)
assets={'ipad':'apple-ipad-pro-11-2018','macbook':'apple-macbook-pro-16-2021'}
for name,slug in assets.items():
    url=f'https://www.webmobilefirst.com/img/mockups/mockup-{slug}-transparent.png'
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as response:data=response.read()
    if not data.startswith(b'\x89PNG'):raise ValueError('Expected a PNG device frame')
    (root/f'{name}.png').write_bytes(data)
    print(name, len(data), 'bytes')
