#!/usr/bin/env python3
"""A blind review: two sites built from the same brief, side by side, with no
way to tell which one had Foreman. A person picks; the key stays hidden until
the picks are in.

    python bench/review.py <run folder>                      write review/index.html
    python bench/review.py <run folder> --tally picks.json   unblind and count

The page shows each pair at desktop and phone width and offers A, B, or no
difference. "Copy my picks" puts the answers on the clipboard as JSON; save them
as picks.json and run --tally. Numbers from this belong in documentation only
with the reviewer's count beside them: one reviewer's preference is one
reviewer's preference.
"""
import html
import json
import random
import shutil
import sys
from pathlib import Path


def pairs(root):
    by = {}
    for f in root.iterdir():
        meta = f / "meta.json"
        shot = f / "shots" / "desktop.png"
        if meta.exists() and shot.exists():
            m = json.loads(meta.read_text(encoding="utf-8"))
            by.setdefault(m["scenario"], {})[m["condition"]] = f
    for sid, conds in sorted(by.items()):
        if "baseline" in conds:
            for c, f in conds.items():
                if c != "baseline":
                    yield sid, conds["baseline"], c, f


def build(root):
    out = root / "review"
    out.mkdir(exist_ok=True)
    rng = random.SystemRandom()
    key, cards = {}, []
    for i, (sid, base, cond, other) in enumerate(pairs(root), 1):
        swap = rng.random() < 0.5
        left, right = (other, base) if swap else (base, other)
        pid = f"p{i}"
        key[pid] = {"scenario": sid, "A": "baseline" if left is base else cond, "B": "baseline" if right is base else cond}
        for side, f in (("A", left), ("B", right)):
            for w in ("desktop", "phone"):
                shutil.copy(f / "shots" / f"{w}.png", out / f"{pid}-{side}-{w}.png")
        brief = json.loads((Path(__file__).resolve().parent / "scenarios" / f"{sid}.json").read_text(encoding="utf-8"))
        cards.append(f"""
<section>
  <h2>{i}. {html.escape(brief['title'])}</h2>
  <p class="brief">{html.escape(brief['opening'])}</p>
  <div class="pair">
    <figure><figcaption>A</figcaption><img src="{pid}-A-desktop.png" alt="Site A, desktop"><img class="ph" src="{pid}-A-phone.png" alt="Site A, phone"></figure>
    <figure><figcaption>B</figcaption><img src="{pid}-B-desktop.png" alt="Site B, desktop"><img class="ph" src="{pid}-B-phone.png" alt="Site B, phone"></figure>
  </div>
  <fieldset><legend>Which would you rather ship for this person?</legend>
    <label><input type="radio" name="{pid}" value="A"> A</label>
    <label><input type="radio" name="{pid}" value="B"> B</label>
    <label><input type="radio" name="{pid}" value="same"> No real difference</label>
  </fieldset>
</section>""")
    (root / "review-key.json").write_text(json.dumps(key, indent=1), encoding="utf-8")
    page = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blind review</title><style>
body{{margin:0;font:16px/1.5 system-ui,sans-serif;color:#111;background:#fafaf8}}main{{max-width:1500px;margin:0 auto;padding:2rem 1.25rem 5rem}}
h1{{font-size:1.6rem;margin:0 0 .25rem}}.lede{{color:#555;margin:0 0 2rem;max-width:70ch}}
section{{border-top:1px solid #ddd;padding:2rem 0}}h2{{font-size:1.1rem;margin:0}}.brief{{color:#555;margin:.25rem 0 1rem}}
.pair{{display:grid;grid-template-columns:1fr 1fr;gap:1rem}}figure{{margin:0;background:#fff;border:1px solid #ddd;padding:.75rem}}
figcaption{{font-weight:700;margin-bottom:.5rem}}img{{display:block;width:100%;height:auto;border:1px solid #eee}}
img.ph{{width:38%;margin-top:.5rem}}fieldset{{border:0;padding:0;margin:1rem 0 0;display:flex;gap:1.5rem;flex-wrap:wrap}}
legend{{font-weight:600;margin-bottom:.5rem}}button{{font:inherit;padding:.7rem 1.1rem;background:#111;color:#fff;border:0;cursor:pointer;position:sticky;bottom:1rem}}
@media(max-width:800px){{.pair{{grid-template-columns:1fr}}}}
</style></head><body><main>
<h1>Blind review</h1><p class="lede">Each pair was built from the same request by the same agent and model. One of each pair had Foreman. Pick the one you would rather ship for the person who asked, without guessing which is which.</p>
{''.join(cards)}
<button type="button" id="copy">Copy my picks</button>
</main><script>
document.getElementById('copy').addEventListener('click', () => {{
  const picks = {{}};
  for (const r of document.querySelectorAll('input:checked')) picks[r.name] = r.value;
  const text = JSON.stringify(picks);
  navigator.clipboard.writeText(text).then(() => {{ document.getElementById('copy').textContent = 'Copied ' + Object.keys(picks).length + ' picks'; }},
    () => prompt('Copy these picks:', text));
}});
</script></body></html>"""
    (out / "index.html").write_text(page, encoding="utf-8")
    print(f"{len(key)} pairs. Open {out / 'index.html'}; the key is in {root / 'review-key.json'}, so do not open it first.")


def tally(root, picks_file):
    key = json.loads((root / "review-key.json").read_text(encoding="utf-8"))
    picks = json.loads(Path(picks_file).read_text(encoding="utf-8"))
    counts = {}
    for pid, choice in picks.items():
        k = key[pid]
        cond = k["A"] if k["A"] != "baseline" else k["B"]
        c = counts.setdefault(cond, {"foreman": 0, "baseline": 0, "same": 0})
        if choice == "same":
            c["same"] += 1
        else:
            c["foreman" if k[choice] != "baseline" else "baseline"] += 1
    for cond, c in counts.items():
        n = sum(c.values())
        print(f"{cond} against baseline, {n} pairs: Foreman preferred {c['foreman']}, baseline preferred {c['baseline']}, no difference {c['same']}")
    (root / "review-results.json").write_text(json.dumps(counts, indent=1), encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    root = Path(sys.argv[1])
    if "--tally" in sys.argv:
        tally(root, sys.argv[sys.argv.index("--tally") + 1])
    else:
        build(root)
