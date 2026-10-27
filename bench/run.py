#!/usr/bin/env python3
"""Run Foreman's benchmark: real Claude Code sessions, played out against a
simulated owner, with and without Foreman installed.

    python bench/run.py --scenarios all --conditions baseline,natural --repeats 1

Each run is one scenario under one condition. Conditions:

    baseline    the same agent and model, no Foreman installed
    natural     Foreman installed, the owner types their opening as they would
    survey      Foreman installed, started with /foreman:foreman survey
    blueprint   Foreman installed, started with /foreman:foreman blueprint
    stress      Foreman installed, started with /foreman:foreman stress test

The agent can read and write files in its project folder and nothing else: no
shell, no web. Both conditions get the same limits, so a difference in the
result is a difference Foreman made.

Isolation matters. Claude Code loads the user's own CLAUDE.md and rules on
every run, even with project-only settings, and a personal rule such as "no em
dashes" would quietly help the baseline. So by default the runner uses a fresh
config folder and needs its own login in the environment: CLAUDE_CODE_OAUTH_TOKEN
(from `claude setup-token`) or ANTHROPIC_API_KEY. --allow-user-config skips the
isolation for testing the harness itself, and marks every result as not clean.

Standard library only. Each run folder holds the owner's files, everything the
agent built, every turn, and the cost reported by Claude Code.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

BENCH = Path(__file__).resolve().parent
ROOT = BENCH.parent
PLUGIN = ROOT / "plugins" / "foreman"
SCENARIOS = BENCH / "scenarios"
SITE_EXT = {".html", ".htm", ".css", ".js", ".jsx", ".tsx", ".ts", ".vue", ".svelte", ".astro"}
THROWAWAY = {"brand.html", "board.html"}
MODE_PREFIX = {"survey": "/foreman:foreman survey", "blueprint": "/foreman:foreman blueprint", "stress": "/foreman:foreman stress test"}


def claude():
    exe = shutil.which("claude")
    if not exe:
        sys.exit("claude is not on PATH")
    return exe


def site_files(folder):
    out = []
    for p in folder.rglob("*"):
        if p.is_file() and p.suffix.lower() in SITE_EXT and p.name not in THROWAWAY and "node_modules" not in p.parts:
            out.append(p.relative_to(folder).as_posix())
    return sorted(out)


def agent_turn(args, env, cwd, message, session, use_plugin):
    # The same short list of built-in tools for every condition, and no MCP
    # servers, so neither side can reach for something the other lacks.
    cmd = [claude(), "-p", message, "--output-format", "stream-json", "--verbose",
           "--model", args.agent_model, "--permission-mode", "acceptEdits",
           "--tools", "Read,Write,Edit,Glob,Grep,Skill", "--strict-mcp-config", "--setting-sources", "project"]
    if use_plugin:
        cmd += ["--plugin-dir", str(PLUGIN)]
    if session:
        cmd += ["--resume", session]
    start = time.time()
    proc = subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True, encoding="utf-8",
                          errors="replace", stdin=subprocess.DEVNULL, timeout=args.turn_timeout)
    turn = {"message": message, "text": "", "tools": [], "cost_usd": 0.0, "ms": int((time.time() - start) * 1000),
            "session": session, "error": None, "usage": {}}
    texts = []
    for line in proc.stdout.splitlines():
        try:
            e = json.loads(line)
        except ValueError:
            continue
        if e.get("type") == "system" and e.get("subtype") == "init":
            turn["session"] = e.get("session_id") or turn["session"]
        elif e.get("type") == "assistant":
            for c in e.get("message", {}).get("content", []):
                if c.get("type") == "text":
                    texts.append(c["text"])
                elif c.get("type") == "tool_use":
                    inp = c.get("input", {})
                    turn["tools"].append({"name": c.get("name"), "file": inp.get("file_path") or inp.get("path"),
                                          "skill": inp.get("skill")})
        elif e.get("type") == "result":
            turn["cost_usd"] = e.get("total_cost_usd") or 0.0
            turn["usage"] = e.get("usage") or {}
            turn["session"] = e.get("session_id") or turn["session"]
            if e.get("is_error"):
                turn["error"] = e.get("result") or "error"
            if e.get("result"):
                texts = [e["result"]]
    turn["text"] = "\n\n".join(t for t in texts if t).strip()
    if proc.returncode != 0 and not turn["text"]:
        turn["error"] = (proc.stderr or "claude exited " + str(proc.returncode))[-2000:]
    return turn


def owner_reply(args, env, scenario, history, neutral):
    template = (BENCH / "simulated-user.md").read_text(encoding="utf-8")
    system = template.format(
        persona=scenario["persona"],
        facts="\n".join("- " + f for f in scenario["facts"]),
        taste=scenario["taste"],
        files=", ".join(scenario.get("files", {})) or "none",
    )
    # The last ten exchanges are plenty for the owner to answer from, and keep
    # the prompt small. It goes in on stdin: a long session would overflow the
    # Windows command line.
    convo = []
    for h in history[-10:]:
        convo.append(f"YOU SAID:\n{h['message']}\n\nTHE AGENT REPLIED:\n{h['text']}")
    prompt = "\n\n---\n\n".join(convo) + "\n\n---\n\nWrite your next message to the agent, and nothing else."
    cmd = [claude(), "-p", "--model", args.user_model, "--system-prompt", system, "--tools", "",
           "--strict-mcp-config", "--no-session-persistence", "--setting-sources", "project"]
    proc = subprocess.run(cmd, cwd=neutral, env=env, input=prompt, capture_output=True, text=True, encoding="utf-8",
                          errors="replace", timeout=args.turn_timeout)
    return (proc.stdout or "").strip() or "Go on."


def run_one(args, env, scenario, condition, repeat, root):
    name = f"{scenario['id']}__{condition}__r{repeat}"
    folder = root / name
    site = folder / "site"
    site.mkdir(parents=True, exist_ok=True)
    neutral = folder / "owner"
    neutral.mkdir(exist_ok=True)
    for fname, body in scenario.get("files", {}).items():
        (site / fname).write_text(body, encoding="utf-8")
    use_plugin = condition != "baseline"
    message = scenario["opening"]
    if condition in MODE_PREFIX:
        message = f"{MODE_PREFIX[condition]} {message}"
    history, session, built_at = [], None, None
    started = time.time()
    for i in range(args.max_turns):
        turn = agent_turn(args, env, site, message, session, use_plugin)
        session = turn["session"]
        turn["index"] = i
        turn["site_files"] = site_files(site)
        history.append(turn)
        print(f"  {name} turn {i}: {len(turn['text'])} chars, {len(turn['tools'])} tool calls, ${turn['cost_usd']:.3f}"
              + (f", ERROR {turn['error'][:120]}" if turn["error"] else ""), flush=True)
        if turn["error"]:
            break
        if turn["site_files"] and built_at is None:
            built_at = i
        if built_at is not None and i - built_at >= args.after_build:
            break
        reply = owner_reply(args, env, scenario, history, neutral)
        if reply.strip().upper().startswith("DONE"):
            history.append({"index": i + 1, "message": "DONE", "text": "", "tools": [], "cost_usd": 0.0, "owner_done": True})
            break
        message = reply
    meta = {
        "scenario": scenario["id"], "condition": condition, "repeat": repeat,
        "agent_model": args.agent_model, "user_model": args.user_model,
        "foreman_version": json.loads((PLUGIN / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))["version"],
        "clean": not args.allow_user_config, "started": datetime.fromtimestamp(started).isoformat(timespec="seconds"),
        "seconds": int(time.time() - started), "turns": len([h for h in history if not h.get("owner_done")]),
        "cost_usd": round(sum(h.get("cost_usd") or 0 for h in history), 4), "built": bool(site_files(site)),
    }
    (folder / "turns.json").write_text(json.dumps(history, indent=1, ensure_ascii=False), encoding="utf-8")
    (folder / "meta.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    shutil.rmtree(neutral, ignore_errors=True)
    return meta


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--scenarios", default="all", help="comma-separated ids, or all")
    ap.add_argument("--conditions", default="baseline,natural")
    ap.add_argument("--repeats", type=int, default=1)
    ap.add_argument("--agent-model", default="sonnet")
    ap.add_argument("--user-model", default="haiku")
    ap.add_argument("--max-turns", type=int, default=30, help="owner messages before a run is cut off")
    ap.add_argument("--after-build", type=int, default=2, help="turns allowed once site files exist")
    ap.add_argument("--turn-timeout", type=int, default=900)
    ap.add_argument("--out", default=str(BENCH / "runs"))
    ap.add_argument("--allow-user-config", action="store_true", help="test the harness with your own config; results are not clean")
    args = ap.parse_args()

    ids = [p.stem for p in sorted(SCENARIOS.glob("*.json"))] if args.scenarios == "all" else args.scenarios.split(",")
    conditions = args.conditions.split(",")
    for c in conditions:
        if c not in ("baseline", "natural", *MODE_PREFIX):
            sys.exit(f"unknown condition {c}")

    env = dict(os.environ)
    if not args.allow_user_config:
        if not (env.get("CLAUDE_CODE_OAUTH_TOKEN") or env.get("ANTHROPIC_API_KEY")):
            sys.exit("Clean runs need their own login: set CLAUDE_CODE_OAUTH_TOKEN (from `claude setup-token`) "
                     "or ANTHROPIC_API_KEY. Use --allow-user-config only to test the harness.")
        cfg = BENCH / ".config"
        cfg.mkdir(exist_ok=True)
        env["CLAUDE_CONFIG_DIR"] = str(cfg)

    root = Path(args.out) / datetime.now().strftime("%Y%m%d-%H%M%S")
    root.mkdir(parents=True, exist_ok=True)
    (root / "plan.json").write_text(json.dumps({"scenarios": ids, "conditions": conditions, **vars(args)}, indent=1), encoding="utf-8")
    print(f"run folder: {root}")
    total = 0.0
    for sid in ids:
        scenario = json.loads((SCENARIOS / f"{sid}.json").read_text(encoding="utf-8"))
        for c in conditions:
            for r in range(1, args.repeats + 1):
                meta = run_one(args, env, scenario, c, r, root)
                total += meta["cost_usd"]
                print(f"{sid} / {c} / r{r}: {meta['turns']} turns, built={meta['built']}, ${meta['cost_usd']:.2f}, {meta['seconds']}s", flush=True)
    print(f"done. total reported cost ${total:.2f}. score it with: python bench/score.py {root}")


if __name__ == "__main__":
    main()
