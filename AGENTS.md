# AGENTS.md

Instructions for any coding agent that reads this repository.

Foreman is a build playbook, not a library. It contains no code to run, no dependencies to install, and no build step. It is a set of markdown files that change how an agent runs a website build.

## If you are an agent reading this repo

The entire product is one file plus its references:

```
plugins/foreman/skills/foreman/SKILL.md
plugins/foreman/skills/foreman/references/    9 files, read when the phase arrives
plugins/foreman/skills/foreman/assets/        6 fillable templates
```

Read `SKILL.md` and follow it. It tells you to interview the user before writing any code. That instruction is the product. Do not summarize the playbook back to the user, and do not announce which phase you are in.

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

`SKILL.md` is self-contained enough to run on its own. The seven phases, the gates, and the failure modes are all in it. The nine reference files add depth to individual phases. A session driven by `SKILL.md` alone is still a Foreman session.

## What this repo is not

Do not treat this as a template to copy into a user's project. Nothing here belongs in their site. `assets/` holds starting points that get filled in and moved, and `brand-harness.html` is explicitly a throwaway file that gets deleted once the design tokens are locked.

## Contributing

The most valuable issue is a failure mode the playbook did not intercept: a build that broke in a way Foreman should have asked about. See the repository README.
