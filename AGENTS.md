# AGENTS.md

Instructions for any coding agent that reads this repository.

Foreman is a build playbook, not a library. It contains no code to run, no dependencies to install, and no build step. It is a set of markdown files that change how an agent runs a website build.

## If you are an agent reading this repo

The entire product is one file plus its references:

```
plugins/foreman/skills/foreman/SKILL.md
plugins/foreman/skills/foreman/references/    13 files, read when the step arrives
plugins/foreman/skills/foreman/assets/        6 fillable templates
```

Read `SKILL.md` and follow it. It tells you to interview the user before writing any code. That instruction is the product, and skipping to the build is the one failure that makes the rest of the file pointless.

Do not summarize the playbook back to the user and do not explain what a step is for. Mark each message with the step stamp `SKILL.md` defines, and nothing else.

No em dashes and no en dashes anywhere in this repository or in anything a session produces. CI fails the build on one. Use a comma, a full stop, or two sentences.

## Installing it for your human

Foreman needs no adapter. Copy one folder to wherever your tool looks for skills, rules, or instructions.

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

`SKILL.md` is self-contained enough to run on its own. The eight governing rules, the eight steps, the gates, and the failure modes are all in it. The thirteen reference files add depth to individual steps. A session driven by `SKILL.md` alone is still a Foreman session.

## What this repo is not

Do not treat this as a template to copy into a user's project. Nothing here belongs in their site. `assets/` holds starting points that get filled in and moved, and `brand-harness.html` is explicitly a throwaway file that gets deleted once the design tokens are locked.

## Releasing

The version string lives in six places. Change all six in the same commit, or the site starts claiming a version that is not the one people install.

1. `plugins/foreman/skills/foreman/SKILL.md` frontmatter `version` and `updated`
2. The same file's body line under the title
3. The `PLAYBOOK` row inside the first-message card in that file
4. `plugins/foreman/.claude-plugin/plugin.json`
5. `.claude-plugin/marketplace.json` (both the metadata block and the plugin entry)
6. `docs/index.html`: the JSON-LD `softwareVersion` and the footer stamp

Also on every release: `docs/sitemap.xml` `lastmod`, a `CHANGELOG.md` entry, and a rebuild of `dist/foreman.skill` with
`cd plugins/foreman/skills && zip -r ../../../dist/foreman.skill foreman -x '*.DS_Store'`.

Counts in prose go stale the same way. The number of steps, the number of reference files, and the number of failure modes appear in `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `docs/index.html`, and `docs/llms.txt`.

## Contributing

The most valuable issue is a failure mode the playbook did not intercept: a build that broke in a way Foreman should have asked about. See the repository README.
