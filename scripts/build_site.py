#!/usr/bin/env python3
"""Build the site in docs/ from the sources in site/.

Every version, date and count on the site comes from the plugin manifest and
from the folders of the skill itself, so the site cannot claim a number the
playbook does not have. Edit site/, never docs/, then run:

    python scripts/build_site.py            write docs/
    python scripts/build_site.py --check    fail if docs/ is out of date (CI)

Standard library only.
"""
import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
DOCS = ROOT / "docs"
SKILL = ROOT / "plugins" / "foreman" / "skills" / "foreman"
BASE = "https://foreman.turkialshuaibi.com"
REPO = "https://github.com/Turki-Sh/Foreman"
LISTINGS = [
    REPO,
    "https://www.claudepluginhub.com/plugins/turki-sh-foreman-plugins-foreman",
    "https://pluginworld.ai/plugins/claude-code/turki-sh/foreman",
    "https://awesomeclaudeplugins.com/Turki-Sh/Foreman",
]
AUTHOR = {
    "@type": "Person",
    "@id": "https://turkialshuaibi.com/#person",
    "name": "Turki Alshuaibi",
    "url": "https://turkialshuaibi.com/",
    "jobTitle": "AI Engineer and Designer",
    "sameAs": [
        "https://github.com/Turki-Sh",
        "https://linkedin.com/in/turki-alshuaibi",
        "https://orcid.org/0009-0003-7476-9170",
    ],
}


WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"]


def read(path):
    return path.read_text(encoding="utf-8").replace("\r\n", "\n")


def facts():
    """The numbers the site states, each from one source."""
    plugin = json.loads(read(ROOT / "plugins" / "foreman" / ".claude-plugin" / "plugin.json"))
    skill = read(SKILL / "SKILL.md")
    updated = re.search(r"^  updated: (\d{4}-\d{2}-\d{2})$", skill, re.M).group(1)
    failure = skill.split("## Failure modes to intercept")[1].split("\n## ")[0]
    d = date.fromisoformat(updated)
    return {
        "version": plugin["version"],
        "updated_iso": updated,
        "updated": f"{d.day} {d.strftime('%B')} {d.year}",
        "year": str(d.year),
        "steps": re.search(r"Step 1 of (\d+)", skill).group(1),
        "steps_word": WORDS[int(re.search(r"Step 1 of (\d+)", skill).group(1))],
        "modes": str(len(re.findall(r"^\| \*\*[A-Z][a-z]+( [a-z]+)?\*\* \|", skill, re.M))),
        "tools": str(len(list((SKILL / "toolbelt").glob("*.md")))),
        "references": str(len(list((SKILL / "references").glob("*.md")))),
        "assets": str(len([p for p in (SKILL / "assets").iterdir() if p.is_file()])),
        "failure_modes": str(len(re.findall(r"^- ", failure, re.M))),
    }


def page_meta(text):
    """Pages open with an HTML comment of key: value lines."""
    m = re.match(r"<!--\n(.*?)\n-->\n", text, re.S)
    meta = dict(line.split(": ", 1) for line in m.group(1).splitlines() if line.strip())
    return meta, text[m.end():]


def inline_md(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s


def changelog_html():
    """The subset of Markdown CHANGELOG.md uses: headings, paragraphs, lists."""
    lines = read(ROOT / "CHANGELOG.md").split("\n")
    out, para, items, toc = [], [], [], []

    def flush():
        if para:
            out.append(f"<p>{inline_md(' '.join(para))}</p>")
            para.clear()
        if items:
            out.append("<ul>" + "".join(f"<li>{inline_md(i)}</li>" for i in items) + "</ul>")
            items.clear()

    for line in lines[3:]:
        if line.startswith("## "):
            flush()
            title = line[3:].strip()
            ver = title.split(",")[0]
            slug = "v" + ver.replace(".", "-")
            toc.append((slug, title))
            out.append(f'<h2 id="{slug}"><a href="#{slug}">{html.escape(title)}</a></h2>')
        elif line.startswith("- "):
            if para:
                flush()
            items.append(line[2:].strip())
        elif line.startswith("  ") and items:
            items[-1] += " " + line.strip()
        elif not line.strip():
            flush()
        elif line.endswith(":") and not line.startswith(" "):
            flush()
            out.append(f'<p class="kind">{inline_md(line)}</p>')
        else:
            para.append(line.strip())
    flush()
    nav = "".join(f'<li><a href="#{s}">{html.escape(t)}</a></li>' for s, t in toc)
    return f'<ol class="versions">{nav}</ol>\n<div class="log">\n' + "\n".join(out) + "\n</div>"


def jsonld(meta, f):
    url = BASE + meta["path"]
    software = {
        "@type": "SoftwareApplication",
        "@id": BASE + "/#software",
        "name": "Foreman",
        "alternateName": "Foreman by Turki Alshuaibi",
        "description": "A build playbook that turns a coding agent into the foreman of a website build: "
        "it interviews the owner, forces the design and scope decisions, locks a visual system, "
        "writes the brief, then builds or hands it over, and verifies, ships and indexes the site.",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "url": BASE + "/",
        "softwareVersion": f["version"],
        "dateModified": f["updated_iso"],
        "datePublished": "2026-08-06",
        "license": "https://opensource.org/licenses/MIT",
        "isAccessibleForFree": True,
        "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
        "downloadUrl": REPO + "/raw/main/dist/foreman.skill",
        "installUrl": BASE + "/install/",
        "screenshot": BASE + "/screenshot.png",
        "image": BASE + "/og/home.png",
        "featureList": [
            "Survey, Blueprint and Stress test modes",
            "Board: a reference board chosen for the brief",
            "Punch list: an audit of any site for what makes it look AI-generated",
            "Palette: colours from a named material, contrast checked",
            "Launch: domain, DNS, SSL, metadata, sitemap and indexing",
        ],
        "sameAs": LISTINGS,
        "author": {"@id": AUTHOR["@id"]},
        "creator": {"@id": AUTHOR["@id"]},
    }
    webpage = {
        "@type": "WebPage",
        "@id": url + "#page",
        "url": url,
        "name": meta["title"],
        "description": meta["description"],
        "isPartOf": {"@id": BASE + "/#website"},
        "about": {"@id": BASE + "/#software"},
        "dateModified": "2026-10-30",
        "inLanguage": "en",
    }
    graph = [webpage]
    if meta["path"] == "/":
        graph += [
            {"@type": "WebSite", "@id": BASE + "/#website", "url": BASE + "/", "name": "Foreman",
             "publisher": {"@id": AUTHOR["@id"]}, "inLanguage": "en"},
            software,
            AUTHOR,
        ]
    else:
        webpage["breadcrumb"] = {"@id": url + "#crumbs"}
        graph.append({
            "@type": "BreadcrumbList",
            "@id": url + "#crumbs",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Foreman", "item": BASE + "/"},
                {"@type": "ListItem", "position": 2, "name": meta["crumb"], "item": url},
            ],
        })
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, indent=2, ensure_ascii=False)


def render(template, values):
    def sub(m):
        key = m.group(1)
        if key not in values:
            raise KeyError(f"unknown placeholder {{{{{key}}}}}")
        return values[key]
    return re.sub(r"\{\{([a-z_]+)\}\}", sub, template)


def build():
    f = facts()
    partials = {p.stem: read(p) for p in (SITE / "partials").glob("*.html")}
    files = {}
    pages = []
    # The home page first, then the rest by name, so the sitemap reads in order.
    for src in sorted((SITE / "pages").glob("*.html"), key=lambda p: (p.stem != "index", p.stem)):
        meta, body = page_meta(read(src))
        slug = src.stem
        pages.append((slug, meta))
        values = dict(f)
        values.update({
            "title": html.escape(meta["title"]),
            "description": html.escape(meta["description"]),
            "canonical": BASE + meta["path"],
            "og_image": f"{BASE}/og/{meta.get('og', slug)}.png",
            "og_alt": html.escape(meta.get("og_alt", meta["title"])),
            "page": slug,
            "robots": meta.get("robots", "index, follow"),
            "jsonld": '<script type="application/ld+json">\n' + jsonld(meta, f) + "\n</script>" if slug != "404" else "",
        })
        if slug == "changelog":
            values["changelog"] = changelog_html()
        # Every partial but the layout and the head is available to a page as
        # {{name}}: the header, the footer, the install block, and the drawings.
        for name, text in partials.items():
            if name not in ("layout", "head"):
                values[name] = render(text, values)
        if slug not in ("index", "404"):
            values["header"] = values["header"].replace(f'href="/{slug}/"', f'href="/{slug}/" aria-current="page"')
        values["body"] = render(body, values)
        values["head"] = render(partials["head"], values)
        out = render(partials["layout"], values)
        target = "404.html" if slug == "404" else ("index.html" if slug == "index" else f"{slug}/index.html")
        files[target] = out

    for name in ("site.css", "site.js", "opening.css", "mono.css"):
        files[name] = read(SITE / "static" / name)

    for asset in sorted((SITE / "static" / "marks").glob("*")):
        if asset.is_file():
            files["marks/" + asset.name] = read(asset)

    for asset in sorted((SITE / "static" / "icons").glob("*")):
        if asset.is_file():
            files[asset.name] = read(asset) if asset.suffix == ".svg" else asset.read_bytes()

    for asset in sorted((SITE / "static" / "og").glob("*.png")):
        files["og/" + asset.name] = asset.read_bytes()
    if (SITE / "static" / "og" / "home.png").exists():
        files["og.png"] = (SITE / "static" / "og" / "home.png").read_bytes()

    # Page-specific media remains source-owned and is copied without text decoding.
    for asset in sorted((SITE / "static" / "media").rglob("*")):
        if asset.is_file():
            files["media/" + asset.relative_to(SITE / "static" / "media").as_posix()] = asset.read_bytes()

    # Preserve the reviewed reference-guided example as a reproducible static build.
    example = ROOT / "bench" / "examples" / "dana-reference-guided" / "site"
    for asset in sorted(example.rglob("*")):
        if asset.is_file():
            files["samples/dana-reference/" + asset.relative_to(example).as_posix()] = read(asset) if asset.suffix in {".html", ".css", ".js", ".svg", ".txt"} else asset.read_bytes()

    urls = [(BASE + m["path"], m.get("priority", "0.7")) for s, m in pages if s != "404"]
    files["sitemap.xml"] = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url>\n    <loc>{u}</loc>\n    <lastmod>2026-10-30</lastmod>\n    <priority>{p}</priority>\n  </url>\n" for u, p in urls)
        + "</urlset>\n"
    )
    files["llms.txt"] = render(read(SITE / "llms.txt"), dict(f, pages="\n".join(
        f"- [{m['title']}]({BASE}{m['path']}): {m['description']}" for s, m in pages if s != "404")))
    full = [render(read(SITE / "llms-full-head.txt"), f)]
    for part in ["SKILL.md"] + [f"toolbelt/{p.name}" for p in sorted((SKILL / "toolbelt").glob("*.md"))]:
        full.append(f"\n\n---\n\n# File: plugins/foreman/skills/foreman/{part}\n\n" + read(SKILL / part))
    files["llms-full.txt"] = "".join(full)
    return files


def main():
    check = "--check" in sys.argv
    stale = []
    for rel, content in build().items():
        path = DOCS / rel
        if check:
            current = (path.read_bytes() if isinstance(content, bytes) else read(path)) if path.exists() else None
            if current != content:
                stale.append(rel)
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        if isinstance(content, bytes):
            path.write_bytes(content)
        else:
            path.write_text(content, encoding="utf-8", newline="\n")
    if check:
        if stale:
            print("docs/ is out of date. Run python scripts/build_site.py and commit:")
            print("\n".join("  " + s for s in stale))
            sys.exit(1)
        print("docs/ matches site/")
    else:
        print("built docs/")


if __name__ == "__main__":
    main()
