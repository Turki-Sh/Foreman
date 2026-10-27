# AGENTS.md

Instructions for any coding agent that reads this repository.

Foreman is a build playbook, not a library. It contains no code to run, no dependencies to install, and no build step. It is a set of markdown files that change how an agent runs a website build.

## If you are an agent reading this repo

The entire product is one file plus the files it reads when they are needed:

```
plugins/foreman/skills/foreman/SKILL.md
plugins/foreman/skills/foreman/references/    14 files, read when the step arrives
plugins/foreman/skills/foreman/toolbelt/      4 tools: board, punch list, palette, launch
plugins/foreman/skills/foreman/assets/        7 fillable templates
plugins/foreman/skills/{board,punch-list,palette,launch}/SKILL.md
                                              thin wrappers that make the tools slash commands in Claude Code
```

Read `SKILL.md` and follow it. It tells you to interview the user before writing any code. That instruction is the product, and skipping to the build is the one failure that makes the rest of the file pointless.

Do not summarize the playbook back to the user and do not explain what a step is for. Mark each message with the step stamp `SKILL.md` defines, and nothing else.

No em dashes and no en dashes anywhere in this repository or in anything a session produces. CI fails the build on one. Use a comma, a full stop, or two sentences.

## Installing it for your human

Foreman needs no adapter. Copy one folder, `plugins/foreman/skills/foreman/`, to wherever your tool looks for skills, rules, or instructions. The toolbelt and the modes are inside it. The four wrapper folders beside it are optional: copy them next to it if your tool turns skills into commands.

| Tool | Destination |
|---|---|
| Claude Code | `/plugin marketplace add Turki-Sh/Foreman` then `/plugin install foreman@alshuaibi`. Outside an interactive terminal, `/plugin` does not exist: use `claude plugin marketplace add Turki-Sh/Foreman` then `claude plugin install foreman@alshuaibi` |
| Claude apps | Upload `dist/foreman.skill` in the skills settings |
| Universal skills directory | `~/.agents/skills/foreman/` |
| Cursor | `~/.cursor/rules/` or `.cursor/rules/` in the project |
| Codex | `~/.codex/skills/foreman/` or reference it from `AGENTS.md` |
| GitHub Copilot | `.github/copilot-instructions.md`, or point it at `SKILL.md` |
| Windsurf | `.windsurfrules`, or the workspace rules directory |
| Gemini CLI | `GEMINI.md`, or the extensions directory |
| Cline, Continue, Roo | The custom instructions or rules field |
| Anything else | Paste `SKILL.md` into the conversation |

Paths move as tools change. If the table is stale for your tool, the rule that always works is: put `SKILL.md` where your tool reads standing instructions, and keep `references/` and `assets/` next to it so relative paths resolve.

## If your tool cannot load reference files

`SKILL.md` is self-contained enough to run on its own. The eight governing rules, the three modes, the eight steps, the gates, and the failure modes are all in it. The fourteen reference files add depth to individual steps, and the toolbelt files are needed only for the four tools. A session driven by `SKILL.md` alone is still a Foreman session.

## What this repo is not

Do not treat this as a template to copy into a user's project. Nothing here belongs in their site. `assets/` holds starting points that get filled in and moved, and `brand-harness.html` and `reference-board.html` are throwaway files that get deleted once their decisions are made.

## Releasing

`plugins/foreman/.claude-plugin/plugin.json` is the one source for the version. Every other copy must match it in the same commit, and the `validate` workflow fails when one does not:

1. `plugins/foreman/skills/foreman/SKILL.md`: frontmatter `version` and `updated`, the body line under the title, and the `PLAYBOOK` row in the card
2. The `metadata.version` of the four wrapper skills in `plugins/foreman/skills/`
3. `.claude-plugin/marketplace.json`: the metadata block and the plugin entry
4. The version badge in `README.md`, and a `CHANGELOG.md` entry

The site in `docs/` is generated. Edit `site/`, never `docs/` directly, then run `python scripts/build_site.py`, which takes the version, the date, and every count (steps, modes, tools, references, assets) from the manifest and the folders, and writes the pages, the sitemap, and `llms.txt`. CI rebuilds it and fails if `docs/` differs.

Then rebuild `dist/foreman.skill` from the committed files, so line endings match what CI unpacks:

```
git -c core.autocrlf=false archive --format=zip -o dist/foreman.skill HEAD:plugins/foreman/skills foreman
```

Before you push, run `python scripts/validate.py`. It is the same check CI runs: manifests, frontmatter that parses, every copy of the version, the card's width, the badges against the folders, and every file the skill names.

Before a release that changes the skill, run the bench on every scenario and compare with the last release's results (`bench/README.md`). A measure that got worse needs a line in the changelog saying why, or the release waits. Never put a number in the README or on the site that did not come from a clean bench run.

Counts in prose go stale the same way as versions. The README badges, `AGENTS.md`, and `CONTRIBUTING.md` carry the counts by hand, and the validate workflow checks the badges.

## Contributing

The most valuable issue is a failure mode the playbook did not intercept: a build that broke in a way Foreman should have asked about. See the repository README.
