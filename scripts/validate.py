#!/usr/bin/env python3
"""The checks that keep Foreman honest about itself. CI runs this on every push
and pull request, and it runs the same way locally:

    python scripts/validate.py

Standard library only. Exits 1 and lists every failure, not just the first.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / "plugins" / "foreman" / "skills"
SKILL = SKILLS / "foreman"
fail = []


def text(path):
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def check_manifests():
    mk = json.loads(text(ROOT / ".claude-plugin" / "marketplace.json"))
    for k in ("name", "owner", "plugins"):
        if k not in mk:
            fail.append(f'marketplace.json is missing "{k}"')
    for p in mk.get("plugins", []):
        for k in ("name", "source", "description"):
            if k not in p:
                fail.append(f'a marketplace plugin entry is missing "{k}"')
    pl = json.loads(text(ROOT / "plugins" / "foreman" / ".claude-plugin" / "plugin.json"))
    if "name" not in pl:
        fail.append('plugin.json is missing "name"')
    if not any(p.get("name") == pl.get("name") for p in mk.get("plugins", [])):
        fail.append("plugin.json's name is not listed in marketplace.json")
    return pl["version"], mk


def check_frontmatter():
    for p in sorted(SKILLS.glob("*/SKILL.md")):
        m = re.match(r"^---\n(.*?)\n---\n", text(p), re.S)
        if not m:
            fail.append(f"{p.relative_to(ROOT)} has no frontmatter")
            continue
        fm = m.group(1)
        name = re.search(r"^name:\s*(\S+)\s*$", fm, re.M)
        if not name or name.group(1) != p.parent.name:
            fail.append(f"{p.relative_to(ROOT)}: name must match its folder, {p.parent.name}")
        d = re.search(r"^description:\s*(.+)$", fm, re.M)
        if not d:
            fail.append(f"{p.relative_to(ROOT)}: no description")
            continue
        if len(d.group(1)) > 1024:
            fail.append(f"{p.relative_to(ROOT)}: description is {len(d.group(1))} characters, the limit is 1024")
        # A plain YAML scalar cannot hold ": " or " #". A skill whose
        # frontmatter does not parse is a skill that never loads.
        for line in fm.splitlines():
            key, _, value = line.partition(": ")
            if key in ("description", "when_to_use") and (": " in value or " #" in value):
                fail.append(f'{p.relative_to(ROOT)}: {key} contains ": " or " #", which breaks YAML')


def check_versions(version, mk):
    skill = text(SKILL / "SKILL.md")
    found = {
        "marketplace.json metadata": mk["metadata"]["version"],
        "marketplace.json plugin entry": mk["plugins"][0].get("version"),
        "SKILL.md frontmatter": re.search(r"^  version: (\S+)$", skill, re.M).group(1),
        "SKILL.md title line": re.search(r"^Version (\S+) ", skill, re.M).group(1),
        "SKILL.md card": re.search(r"PLAYBOOK  Foreman (\S+) by", skill).group(1),
        "README version badge": re.search(r"badge/version-([0-9.]+)-", text(ROOT / "README.md")).group(1),
        "CHANGELOG top entry": re.search(r"^## ([0-9.]+),", text(ROOT / "CHANGELOG.md"), re.M).group(1),
    }
    for p in sorted(SKILLS.glob("*/SKILL.md")):
        m = re.search(r"^  version: (\S+)$", text(p), re.M)
        found[str(p.relative_to(ROOT))] = m.group(1) if m else "nothing"
    for where, v in found.items():
        if v != version:
            fail.append(f"{where} says {v}, plugin.json says {version}")


def check_card():
    skill = text(SKILL / "SKILL.md")
    card = re.search(r"Send it exactly as written[^\n]*\n\n```\n(.*?)\n```", skill, re.S).group(1)
    box = [l for l in card.splitlines() if l.startswith(("|", "+"))]
    widths = {len(l) for l in box}
    if len(widths) != 1:
        fail.append(f"the card's box rows are not all one width: {sorted(widths)}")
    for alt in ("Survey. Say blueprint or stress test to switch", "Stress test. Say survey or blueprint to switch"):
        if len(alt) != len("Blueprint. Say survey or stress test to switch"):
            fail.append(f"the MODE line '{alt}' is not the width of the Blueprint one")


def check_badges():
    real = {
        "references": len(list((SKILL / "references").glob("*.md"))),
        "assets": len([p for p in (SKILL / "assets").iterdir() if p.is_file()]),
        "tools": len(list((SKILL / "toolbelt").glob("*.md"))),
    }
    readme = text(ROOT / "README.md")
    for k, n in real.items():
        m = re.search(rf"badge/{k}-(\d+)-", readme)
        if not m or int(m.group(1)) != n:
            fail.append(f"README's {k} badge says {m.group(1) if m else 'nothing'}, the folder holds {n}")
    wrappers = {p.parent.name for p in SKILLS.glob("*/SKILL.md")} - {"foreman"}
    tools = {p.stem for p in (SKILL / "toolbelt").glob("*.md")}
    if wrappers != tools:
        fail.append(f"each tool needs a wrapper skill and each wrapper a tool: tools {sorted(tools)}, wrappers {sorted(wrappers)}")


def check_references():
    # Files a session creates in the user's project, and getdesign.md, which is
    # a website. Neither is a file we ship.
    made = {"CHANGELOG.md", "brand.html", "board.html", "BRIEF.md", "BRAND.md", "DESIGN.md", "getdesign.md"}
    files = [SKILL / "SKILL.md"] + sorted((SKILL / "toolbelt").glob("*.md")) + sorted((SKILL / "references").glob("*.md"))
    for f in files:
        for name in sorted(set(re.findall(r"`([A-Za-z0-9./-]+\.(?:md|html|txt|xml))`", text(f)))):
            if name in made:
                continue
            tries = [f.parent / name, SKILL / name, SKILL / "references" / name, SKILL / "assets" / name, SKILL / "toolbelt" / name]
            if not any(p.resolve().is_file() for p in tries):
                fail.append(f"{f.relative_to(ROOT)} names {name}, which does not exist")


def main():
    version, mk = check_manifests()
    check_frontmatter()
    check_versions(version, mk)
    check_card()
    check_badges()
    check_references()
    if fail:
        print("\n".join(fail))
        sys.exit(1)
    print(f"Foreman {version}: manifests, frontmatter, versions, the card, badges and file references all check out")


if __name__ == "__main__":
    main()
