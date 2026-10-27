#!/usr/bin/env python3
"""How Foreman behaves in real sessions, read from the agents' own transcripts.

    python bench/field.py                          Claude Code and Codex sessions on this machine
    python bench/field.py --root <folder>          transcripts someone shared with you
    python bench/field.py --since 2026-10-01       only sessions modified since a date

Claude Code keeps sessions as JSONL under ~/.claude/projects, Codex under
~/.codex/sessions. This finds the ones where Foreman actually spoke, meaning an
agent message that opens with its stamp or carries its opening card, not a
session that only mentions it, and prints aggregate counts only: how many
sessions, which mode, how far they got, how many owner messages and questions
came before any site code, and how often a rule broke. It prints no message
text, so the output is safe to paste into an issue or a session report.

The same measures as the bench, on sessions nobody staged.
"""
import argparse
import json
import re
import statistics
from collections import Counter
from datetime import datetime
from pathlib import Path

SITE_EXT = {".html", ".htm", ".css", ".js", ".jsx", ".tsx", ".ts", ".vue", ".svelte", ".astro"}
THROWAWAY = {"brand.html", "board.html"}
DOT = "·"
OPENS = re.compile(r"^\s*(\*\*)?FOREMAN " + DOT)
STAMP = re.compile(r"FOREMAN " + DOT + r" (?:(SURVEY|STRESS TEST) " + DOT + r" )?(\d)/8")
TOOLSTAMP = re.compile(r"FOREMAN " + DOT + r" (BOARD|PUNCH LIST|PALETTE|LAUNCH)")
CARD = "PLAYBOOK  Foreman"
PATCH = re.compile(r"\*\*\* (?:Add|Update) File: ([^\n\\\"]+)")


def events(f):
    """Yield ('user', text), ('agent', text) and ('write', path) from either format."""
    with f.open(encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if '"assistant"' not in line and '"user"' not in line and "tool_call" not in line and "tool_use" not in line:
                continue
            try:
                e = json.loads(line)
            except ValueError:
                continue
            if e.get("type") in ("user", "assistant"):  # Claude Code
                msg = e.get("message", {})
                content = msg.get("content")
                if isinstance(content, str):
                    if e["type"] == "user":
                        yield ("user", content)
                    continue
                for c in content or []:
                    if c.get("type") == "text":
                        yield ("agent" if e["type"] == "assistant" else "user", c["text"])
                    elif c.get("type") == "tool_use" and c.get("name") in ("Write", "Edit", "MultiEdit"):
                        yield ("write", (c.get("input") or {}).get("file_path", ""))
            elif e.get("type") == "response_item":  # Codex
                p = e.get("payload") or {}
                if p.get("type") == "message" and p.get("role") in ("user", "assistant"):
                    for c in p.get("content") or []:
                        t = c.get("text") or ""
                        if p["role"] == "user" and t.lstrip().startswith("<"):
                            continue  # environment context, not the owner typing
                        yield ("agent" if p["role"] == "assistant" else "user", t)
                elif p.get("type") in ("custom_tool_call", "function_call"):
                    blob = p.get("input") or p.get("arguments") or ""
                    for m in PATCH.finditer(blob if isinstance(blob, str) else json.dumps(blob)):
                        yield ("write", m.group(1).strip())


def analyse(f):
    seq = list(events(f))
    agent = [t for k, t in seq if k == "agent"]
    if not any(OPENS.search(t) or CARD in t for t in agent):
        return None
    modes, steps, tools = Counter(), [0], Counter()
    for t in agent:
        if not (OPENS.search(t) or CARD in t):
            continue
        for m in STAMP.finditer(t):
            modes[(m.group(1) or "BLUEPRINT").lower()] += 1
            steps.append(int(m.group(2)))
        for m in TOOLSTAMP.finditer(t):
            tools[m.group(1).lower()] += 1
        if CARD in t:
            steps.append(1)
    start = next(i for i, (k, t) in enumerate(seq) if k == "agent" and (OPENS.search(t) or CARD in t))
    owner, questions, multi, code_after = 0, 0, 0, None
    for k, v in seq[start:]:
        if k == "user":
            owner += 1
        elif k == "agent":
            q = len(re.findall(r"\?(?=\s|$|\*|\))", v))
            questions += q
            multi += q > 1
        elif k == "write" and Path(v).suffix.lower() in SITE_EXT and Path(v).name not in THROWAWAY:
            code_after = owner
            break
    return {
        "mode": modes.most_common(1)[0][0] if modes else None,
        "furthest_step": max(steps),
        "tools": dict(tools),
        "owner_messages_before_code": code_after,
        "questions_before_code": questions,
        "messages_with_several_questions": multi,
        "em_dashes": sum(t.count("\u2014") for t in agent if OPENS.search(t) or CARD in t),
        "wrote_brief": any(k == "write" and Path(v).name in ("BRIEF.md", "BRAND.md") for k, v in seq),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", action="append", help="folder of JSONL transcripts; repeatable")
    ap.add_argument("--since", help="YYYY-MM-DD")
    ap.add_argument("--include-tests", action="store_true",
                    help="count headless test sessions run from temp folders, such as the bench's own")
    args = ap.parse_args()
    roots = [Path(r) for r in args.root] if args.root else [Path.home() / ".claude" / "projects", Path.home() / ".codex" / "sessions"]
    since = datetime.fromisoformat(args.since).timestamp() if args.since else 0
    found = []
    for root in roots:
        if not root.exists():
            continue
        for f in root.rglob("*.jsonl"):
            if f.stat().st_mtime < since:
                continue
            if not args.include_tests and any(s in str(f) for s in ("AppData-Local-Temp", "fmb-", "-tmp-", "Temp" + chr(92))):
                continue
            with f.open(encoding="utf-8", errors="replace") as fh:
                if not any("FOREMAN" in line or CARD in line for line in fh):
                    continue
            a = analyse(f)
            if a:
                a["source"] = "codex" if ".codex" in str(f) else "claude-code"
                found.append(a)
    print(f"sessions where Foreman spoke: {len(found)}  {dict(Counter(a['source'] for a in found))}")
    if not found:
        return
    med = lambda xs: statistics.median(xs) if xs else "n/a"
    print("modes:", dict(Counter(a["mode"] for a in found if a["mode"])))
    print("tools used on their own:", dict(sum((Counter(a["tools"]) for a in found), Counter())))
    print("furthest step reached:", dict(sorted(Counter(a["furthest_step"] for a in found).items())))
    built = [a for a in found if a["owner_messages_before_code"] is not None]
    print(f"sessions that reached site code: {len(built)}")
    print("median owner messages before code:", med([a["owner_messages_before_code"] for a in built]))
    print("median questions before code:", med([a["questions_before_code"] for a in found]))
    print("sessions with a message asking several questions:", sum(1 for a in found if a["messages_with_several_questions"]))
    print("sessions with em dashes in Foreman's messages:", sum(1 for a in found if a["em_dashes"]))
    print("sessions that wrote BRIEF.md or BRAND.md:", sum(1 for a in found if a["wrote_brief"]))


if __name__ == "__main__":
    main()
