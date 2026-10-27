#!/usr/bin/env python3
"""Score every run in a run folder, then summarise by condition.

    python bench/score.py bench/runs/20261027-120000

Writes score.json into each run and results.json plus summary.md into the run
folder. Every number in the summary is counted from the runs, never estimated.

Two kinds of measure:
  process   from the transcript: how many messages before any site code, how
            many questions, whether a brief was written, em dashes in the chat
  artifact  from the built site, in a real browser (bench/checks.cjs): dead
            links, overflow at 375px, contrast failures, metadata, a 404,
            hover and focus rules, the default AI palette, em dashes, stock
            SaaS words, and numbers on the page the owner never gave
"""
import colorsys
import json
import re
import statistics
import subprocess
import sys
from pathlib import Path

BENCH = Path(__file__).resolve().parent
SITE_EXT = {".html", ".htm", ".css", ".js", ".jsx", ".tsx", ".ts", ".vue", ".svelte", ".astro"}
THROWAWAY = {"brand.html", "board.html"}
WRITES = {"Write", "Edit", "MultiEdit", "NotebookEdit"}
# Framework defaults recognised on sight (references/palette.md).
DEFAULT_HEX = {"6366f1", "8b5cf6", "7c3aed", "4f46e5", "3b82f6", "2563eb", "0066ff"}
SLOP = ["seamless", "effortless", "unlock", "supercharge", "elevate", "revolutioniz", "cutting-edge", "game-changer",
        "game changer", "empower", "next-level", "world-class", "unleash", "transform your", "to the next level",
        "harness the power", "in today's", "dive into", "look no further", "boost your", "streamline your"]


def numbers(text):
    out = set()
    for m in re.finditer(r"(?<![\w.])(\d[\d,]*(?:\.\d+)?)\s*(%|percent)?", text):
        raw = m.group(1).replace(",", "").rstrip(".")
        if not raw:
            continue
        if len(raw.split(".")[0]) < 2 and not m.group(2):
            continue
        out.add(raw + ("%" if m.group(2) else ""))
    return out


def allowed_numbers(scenario):
    blob = " ".join([scenario["opening"], scenario["persona"], scenario["taste"], *scenario["facts"], *scenario.get("files", {}).values()])
    found = numbers(blob)
    plain = {n.rstrip("%") for n in found}
    return found | plain | {n + "%" for n in plain}


def parse_color(c):
    if not c:
        return None
    m = re.match(r"rgba?\(([^)]+)\)", c)
    if not m:
        return None
    parts = [float(x) for x in re.split(r"[,\s/]+", m.group(1).strip()) if x]
    if len(parts) > 3 and parts[3] == 0:
        return None
    return tuple(int(v) for v in parts[:3])


def describe(rgb):
    r, g, b = (v / 255 for v in rgb)
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    f = lambda v: v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    lum = 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    return {"hue": round(h * 360), "sat": round(s, 2), "light": round(l, 2), "lum": round(lum, 3), "hex": "%02x%02x%02x" % rgb}


def palette(colors):
    ground = parse_color(colors.get("ground")) or (255, 255, 255)
    g = describe(ground)
    # The accent is the first saturated colour among the main action, a link in
    # the text, and the heading, else the most saturated colour the page declares.
    accent = None
    for key in ("cta", "link", "heading"):
        c = parse_color(colors.get(key))
        if c:
            d = describe(c)
            if d["sat"] > 0.25 and 0.15 < d["light"] < 0.85:
                accent = d
                break
    if accent is None:
        declared = []
        for v in colors.get("root_vars", {}).values():
            for m in re.findall(r"#([0-9a-fA-F]{6})\b", v):
                d = describe(tuple(int(m[i:i + 2], 16) for i in (0, 2, 4)))
                if d["sat"] > 0.25 and 0.15 < d["light"] < 0.85:
                    declared.append(d)
        if declared:
            accent = max(declared, key=lambda d: d["sat"])
    hexes = set()
    for v in list(colors.get("root_vars", {}).values()) + [colors.get(k) for k in ("ground", "cta", "link", "heading")]:
        if not v:
            continue
        for m in re.findall(r"#([0-9a-fA-F]{6})\b", v):
            hexes.add(m.lower())
        c = parse_color(v)
        if c:
            hexes.add(describe(c)["hex"])
    ground_kind = "dark" if g["lum"] < 0.06 else ("light" if g["lum"] > 0.55 else "mid")
    dark_blue_violet = ground_kind == "dark" and accent is not None and 200 <= accent["hue"] <= 290
    cream_terracotta = ground_kind == "light" and 30 <= g["hue"] <= 60 and 0.1 <= g["sat"] and accent is not None and 5 <= accent["hue"] <= 30
    return {
        "ground": ground_kind, "ground_hex": g["hex"], "accent_hex": accent["hex"] if accent else None,
        "accent_hue": accent["hue"] if accent else None,
        "framework_default_hex": sorted(hexes & DEFAULT_HEX),
        "default_look": bool(dark_blue_violet or cream_terracotta or (hexes & DEFAULT_HEX)),
    }


def process(turns):
    code_turn, questions, multi = None, 0, 0
    agent = [t for t in turns if not t.get("owner_done")]
    for t in agent:
        wrote_site = any(x.get("name") in WRITES and x.get("file") and Path(x["file"]).suffix.lower() in SITE_EXT
                         and Path(x["file"]).name not in THROWAWAY for x in t.get("tools", []))
        if wrote_site:
            code_turn = t["index"]
            break
        q = len(re.findall(r"\?(?=\s|$|\*|\))", t.get("text", "")))
        questions += q
        multi += q > 1
    text = "\n".join(t.get("text", "") for t in agent)
    return {
        "foreman_loaded": any(x.get("skill", "") and str(x.get("skill")).startswith("foreman") for t in agent for x in t.get("tools", []))
                          or "FOREMAN" in text,
        "messages_before_code": code_turn,
        "questions_before_code": questions,
        "messages_with_several_questions": multi,
        "dashes_in_chat": text.count("\u2014") + text.count("\u2013"),
    }


def artifact(site, scenario, shots):
    node = subprocess.run(["node", str(BENCH / "checks.cjs"), str(site), str(shots)], capture_output=True, text=True,
                          encoding="utf-8", errors="replace", timeout=600)
    try:
        raw = json.loads(node.stdout.strip().splitlines()[-1])
    except (ValueError, IndexError):
        return {"error": (node.stderr or node.stdout)[-800:]}
    if raw.get("error") or not raw.get("per_page"):
        return {"error": raw.get("error"), "pages": len(raw.get("pages", []))}
    pages = raw["per_page"]
    main = pages.get(raw["main"]) or next(iter(pages.values()))
    text = "\n".join(p["text"] for p in pages.values())
    visible = text + " " + " ".join(p["alts"] + " " + p["description"] for p in pages.values())
    allowed = allowed_numbers(scenario)
    invented = sorted(n for n in numbers(text) if n not in allowed and not re.fullmatch(r"20[0-3]\d", n.rstrip("%")))
    meta = main["meta"]
    checked = sum(p["contrast"]["checked"] for p in pages.values())
    failed = sum(p["contrast"]["failed"] for p in pages.values())
    return {
        "pages": len(raw["pages"]),
        "console_errors": sum(p["console_errors"] for p in pages.values()),
        "dead_links": sum(p["dead_links"] for p in pages.values()),
        "broken_links": sum(len(p["broken_links"]) for p in pages.values()),
        "overflow_375": any(p["overflow_375"] for p in pages.values()),
        "contrast_failures": failed, "contrast_checked": checked,
        "contrast_examples": [e for p in pages.values() for e in p["contrast"]["examples"]][:5],
        "metadata": meta, "metadata_score": f"{sum(meta.values())}/{len(meta)}",
        "metadata_complete": all(meta.values()),
        "has_404_page": raw["has_404_page"], "robots": raw["robots"], "sitemap": raw["sitemap"],
        "hover_rules": main["css"]["hover_rules"], "focus_rules": main["css"]["focus_rules"],
        "gradient_text": sum(p["gradient_text"] for p in pages.values()),
        "dashes_on_page": visible.count("\u2014") + visible.count("\u2013"),
        "slop_words": sorted({w for w in SLOP if w in visible.lower()}),
        "invented_numbers": invented,
        "palette": palette(main["colors"]),
        "fonts": main["fonts"],
    }


def score_run(folder):
    meta = json.loads((folder / "meta.json").read_text(encoding="utf-8"))
    turns = json.loads((folder / "turns.json").read_text(encoding="utf-8"))
    scenario = json.loads((BENCH / "scenarios" / f"{meta['scenario']}.json").read_text(encoding="utf-8"))
    site = folder / "site"
    s = {"meta": meta, "process": process(turns),
         "brief_written": (site / "BRIEF.md").exists() and (site / "BRAND.md").exists(),
         "artifact": artifact(site, scenario, folder / "shots") if meta["built"] else None}
    (folder / "score.json").write_text(json.dumps(s, indent=1, ensure_ascii=False), encoding="utf-8")
    return s


def pct(xs):
    xs = [x for x in xs if x is not None]
    return f"{round(100 * sum(1 for x in xs if x) / len(xs))}% ({sum(1 for x in xs if x)}/{len(xs)})" if xs else "n/a"


def med(xs):
    xs = [x for x in xs if x is not None]
    return statistics.median(xs) if xs else "n/a"


def summarise(scores):
    by = {}
    for s in scores:
        by.setdefault(s["meta"]["condition"], []).append(s)
    rows, results = [], {}
    for cond, ss in by.items():
        built = [s for s in ss if s["artifact"] and not s["artifact"].get("error")]
        a = lambda k: [s["artifact"][k] for s in built]
        r = {
            "runs": len(ss),
            "clean": all(s["meta"]["clean"] for s in ss),
            "built": pct([s["meta"]["built"] for s in ss]),
            "foreman_loaded": pct([s["process"]["foreman_loaded"] for s in ss]),
            "median_messages_before_code": med([s["process"]["messages_before_code"] for s in ss]),
            "median_questions_before_code": med([s["process"]["questions_before_code"] for s in ss]),
            "brief_written": pct([s["brief_written"] for s in ss]),
            "sites_with_invented_numbers": pct([bool(x) for x in a("invented_numbers")]),
            "sites_in_default_ai_palette": pct([s["artifact"]["palette"]["default_look"] for s in built]),
            "sites_with_dead_links": pct([x > 0 for x in a("dead_links")]),
            "sites_overflowing_at_375": pct(a("overflow_375")),
            "sites_failing_contrast": pct([x > 0 for x in a("contrast_failures")]),
            "sites_with_complete_metadata": pct(a("metadata_complete")),
            "sites_with_a_404": pct(a("has_404_page")),
            "sites_with_em_or_en_dashes": pct([x > 0 for x in a("dashes_on_page")]),
            "sites_with_stock_saas_words": pct([bool(x) for x in a("slop_words")]),
            "median_cost_usd": med([s["meta"]["cost_usd"] for s in ss]),
            "median_minutes": med([round(s["meta"]["seconds"] / 60, 1) for s in ss]),
        }
        results[cond] = r
    keys = list(next(iter(results.values())).keys()) if results else []
    conds = list(results)
    rows.append("| | " + " | ".join(conds) + " |")
    rows.append("|---|" + "---|" * len(conds))
    for k in keys:
        rows.append(f"| {k.replace('_', ' ')} | " + " | ".join(str(results[c][k]) for c in conds) + " |")
    return results, "\n".join(rows)


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: python bench/score.py <run folder>")
    root = Path(sys.argv[1])
    scores = []
    for folder in sorted(p for p in root.iterdir() if (p / "meta.json").exists()):
        print("scoring", folder.name, flush=True)
        scores.append(score_run(folder))
    results, table = summarise(scores)
    clean = all(s["meta"]["clean"] for s in scores)
    (root / "results.json").write_text(json.dumps({"clean": clean, "by_condition": results}, indent=1), encoding="utf-8")
    note = "" if clean else "\n**Not a clean run.** The agent ran with the operator's own Claude Code instructions loaded. Use these numbers to test the harness, never in documentation.\n"
    (root / "summary.md").write_text(f"# Bench results, {root.name}\n{note}\n{table}\n", encoding="utf-8")
    print(table)


if __name__ == "__main__":
    main()
