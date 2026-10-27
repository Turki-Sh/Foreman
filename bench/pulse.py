#!/usr/bin/env python3
"""Foreman's pulse: what the public numbers say this week, appended to a log.

    python bench/pulse.py                   print, and append to bench/pulse/log.jsonl
    python bench/pulse.py --log PATH        append somewhere else (a private folder, a vault)

Reads GitHub through the gh CLI, so it needs `gh auth login`. Traffic, clones
and referrers need push access to the repository, which means the maintainer.
GitHub keeps traffic for 14 days only, so run this at least every two weeks or
the gap is lost for good.

Nothing here touches a user. Foreman itself sends nothing anywhere; these are
numbers GitHub already shows the maintainer.
"""
import argparse
import json
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO = "Turki-Sh/Foreman"


def gh(path):
    p = subprocess.run(["gh", "api", path, "-H", "Accept: application/vnd.github+json"], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if p.returncode != 0:
        return {"error": p.stderr.strip()[:200]}
    return json.loads(p.stdout or "null")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--log", default=str(Path(__file__).resolve().parent / "pulse" / "log.jsonl"))
    args = ap.parse_args()

    repo = gh(f"repos/{REPO}")
    if "error" in repo:
        sys.exit("gh could not read the repository: " + repo["error"])
    views = gh(f"repos/{REPO}/traffic/views")
    clones = gh(f"repos/{REPO}/traffic/clones")
    referrers = gh(f"repos/{REPO}/traffic/popular/referrers")
    paths = gh(f"repos/{REPO}/traffic/popular/paths")
    releases = gh(f"repos/{REPO}/releases")
    issues = gh(f"repos/{REPO}/issues?state=all&per_page=100")

    downloads = {}
    if isinstance(releases, list):
        for r in releases:
            for a in r.get("assets", []):
                downloads[f"{r['tag_name']}/{a['name']}"] = a.get("download_count", 0)
    reports = [i for i in issues if isinstance(i, dict) and "pull_request" not in i] if isinstance(issues, list) else []
    labels = {}
    for i in reports:
        for l in i.get("labels", []):
            labels[l["name"]] = labels.get(l["name"], 0) + 1

    entry = {
        "date": date.today().isoformat(),
        "stars": repo.get("stargazers_count"),
        "forks": repo.get("forks_count"),
        "watchers": repo.get("subscribers_count"),
        "open_issues": repo.get("open_issues_count"),
        "views_14d": views.get("count") if isinstance(views, dict) else None,
        "unique_visitors_14d": views.get("uniques") if isinstance(views, dict) else None,
        "clones_14d": clones.get("count") if isinstance(clones, dict) else None,
        "unique_cloners_14d": clones.get("uniques") if isinstance(clones, dict) else None,
        "referrers": [{"from": r["referrer"], "views": r["count"], "uniques": r["uniques"]} for r in referrers] if isinstance(referrers, list) else [],
        "top_paths": [{"path": p["path"], "views": p["count"]} for p in paths][:10] if isinstance(paths, list) else [],
        "release_downloads": downloads,
        "issues_total": len(reports),
        "issues_by_label": labels,
    }
    log = Path(args.log)
    log.parent.mkdir(parents=True, exist_ok=True)
    with log.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

    print(f"{entry['date']}: {entry['stars']} stars, {entry['forks']} forks")
    print(f"last 14 days: {entry['views_14d']} views from {entry['unique_visitors_14d']} visitors, "
          f"{entry['clones_14d']} clones by {entry['unique_cloners_14d']}")
    for r in entry["referrers"][:6]:
        print(f"  from {r['from']}: {r['views']} views, {r['uniques']} people")
    if downloads:
        print("release downloads:", ", ".join(f"{k} {v}" for k, v in downloads.items()))
    print(f"issues: {entry['issues_total']} total", entry["issues_by_label"] or "")
    print(f"appended to {log}")


if __name__ == "__main__":
    main()
