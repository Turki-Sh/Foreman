# Contributing to Foreman

Every change is reviewed and merged by Turki Alshuaibi.

Contributions are open in some areas and closed in others. This page says which, so nobody spends an evening on a change that was never going to land.

## Most valuable thing you can send

**A failure the playbook did not intercept.** You ran a build, it went wrong, and Foreman never asked you the question that would have prevented it. That changes what the playbook asks every future user.

Post it on the [meta issue](https://github.com/Turki-Sh/Foreman/issues/1):

- What you were building, in one line
- Which phase you were in, or "after shipping"
- What broke
- **What question would have prevented it**

That last line is the contribution. If it becomes a gate, a constraint, or a failure mode, you are credited in the changelog.

## Open, send a pull request

**Install paths for agents I cannot test.** `AGENTS.md` maps tools to the directory they read skills from. Those paths move, and I do not run every agent. If Foreman loads in Cursor, Windsurf, Codex, Copilot, Cline, Gemini CLI or anything else, and the documented path is wrong or missing, correct it. Say which version you tested on.

**Factual corrections.** A DNS instruction that no longer matches a registrar's panel. A host that changed its build settings. A dead link. A Lighthouse threshold that moved.

**Bugs in the templates.** `assets/` ships a 404, a head block, a brand harness, a reference board, robots.txt, sitemap.xml and llms.txt. If one is invalid, inaccessible, or wrong in a browser I did not check, fix it.

**Translations.** Open an issue first so we agree on scope before you translate fourteen reference files.

## Closed, open an issue instead

**New reference documents.** Fourteen is past the point where an agent reliably loads them all, which is why the irreducible move from each one is repeated inside `SKILL.md`. New material has to displace something, or prove it belongs in the skill itself.

**New tools for the toolbelt.** A tool earns a place by being something people ask for on its own, outside a session. Open an issue with the request people actually make, in their words.

**Changes to the eight steps, the three modes, or their gates.**

**Options and alternatives.** A rule that offers three ways to do something is not a rule. If a rule produced a bad result for you, show me the build. That moves me. A pull request adding a second option does not.

**Anything executable.** Foreman ships no scripts, no hooks, no MCP servers and no network calls. CI enforces this.

## Before you open a pull request

The `validate` workflow runs on every pull request. It fails if:

- The manifests disagree or drop a required field
- Any copy of the version disagrees with `plugin.json`
- A skill's frontmatter is missing, does not parse, or its description exceeds the limit
- `SKILL.md` or a toolbelt file names a file that does not exist
- Anything executable appears under `plugins/`
- `dist/foreman.skill` has drifted from the source skill
- `docs/` differs from what `scripts/build_site.py` builds from `site/`
- An em dash or en dash appears in the prose

If you change anything under `plugins/foreman/skills/foreman/`, rebuild the bundle in a commit after it, from the committed files:

```
git -c core.autocrlf=false archive --format=zip -o dist/foreman.skill HEAD:plugins/foreman/skills foreman
```

If you change the site, edit `site/` and run `python scripts/build_site.py`. Never edit `docs/` by hand.

One concern per pull request. A branch that fixes a Windsurf path and rewrites the brief template will be asked to split.

## Writing style

The playbook is run by an agent, not read by a person.

- Plain verbs, sentence case, no filler.
- Do not justify a decision to the reader. If an ordering needs defending, the ordering is wrong.
- No em dashes.
- Specific beats clever. Numbers beat adjectives.

## Licence

Foreman is MIT. Contributions are accepted under the same licence, and the copyright notice travels with any copy. There is no contributor licence agreement to sign.

## Credit

Anything that changes the playbook gets its contributor named in `CHANGELOG.md` against the release it shipped in. A failure report that becomes a gate counts.
