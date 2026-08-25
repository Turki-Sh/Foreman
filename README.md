# Foreman

**A build playbook for shipping real websites with coding agents.**
Not tied to any one agent: it is a folder of markdown, so it runs on Claude Code, Cursor, Windsurf, Codex, Copilot, Gemini CLI, or a chat window with no skills support at all.

[![Agent Skill](https://img.shields.io/badge/agent-any-1B4DD1?style=flat&logo=markdown&logoColor=white)](AGENTS.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-one%20command-D97757?style=flat&logo=claude&logoColor=white)](https://code.claude.com/docs/en/plugins)
[![Steps](https://img.shields.io/badge/steps-8-1B4DD1?style=flat)](#what-is-in-the-box)
[![References](https://img.shields.io/badge/references-9-1B4DD1?style=flat)](#what-is-in-the-box)
[![Assets](https://img.shields.io/badge/assets-6-1B4DD1?style=flat)](#what-is-in-the-box)
[![Version](https://img.shields.io/badge/version-1.3.0-1B4DD1?style=flat&logo=semanticrelease&logoColor=white)](CHANGELOG.md)
[![Validate](https://img.shields.io/github/actions/workflow/status/Turki-Sh/Foreman/validate.yml?style=flat&logo=githubactions&logoColor=white&label=validate)](https://github.com/Turki-Sh/Foreman/actions/workflows/validate.yml)
[![Scripts](https://img.shields.io/badge/executable%20code-none-16A34A?style=flat&logo=markdown&logoColor=white)](#no-scripts)
[![License](https://img.shields.io/badge/license-MIT-3DA639?style=flat&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Author](https://img.shields.io/badge/by-Turki%20Alshuaibi-1B4DD1?style=flat)](https://turkialshuaibi.com/)

**[foreman.turkialshuaibi.com](https://foreman.turkialshuaibi.com/)**

<p align="center">
  <a href="https://foreman.turkialshuaibi.com/">
    <img src="docs/screenshot.png" alt="The Foreman site: a technical sheet on white paper, with a hand-drawn wireframe annotated with the decisions the interview forces." width="820">
  </a>
</p>

<p align="center"><i>Foreman's own site, built by running Foreman. If the playbook cannot produce one good page, it is not worth installing.</i></p>

Coding agents removed the cost of writing a site. They did not remove the cost of deciding what it should be. So the internet now has thousands of sites that were built in an afternoon and look like each other: the same cream background, the same serif hero, the same three cards, the same accent, no domain, no metadata, no 404.

Foreman is the missing half. It turns the agent you are already talking to into a foreman: it interviews you, forces the decisions you would have delegated, locks a visual system before any code exists, writes one high-quality build brief, then asks whether to build it there or hand it over, and walks you through verification, DNS, and indexing until the thing is actually live.

You do not read Foreman. Your agent does.

## Install

Foreman is one folder of markdown. Nothing compiles, nothing runs, so it installs anywhere an agent reads files.

**Claude Code.** Both lines, in this order.

```
/plugin marketplace add Turki-Sh/Foreman
/plugin install foreman@alshuaibi
```

`/plugin` is a terminal-only dialog. If your session answers "/plugin isn't available in this environment", run the same two steps as shell commands and restart the session.

```
claude plugin marketplace add Turki-Sh/Foreman
claude plugin install foreman@alshuaibi
```

**Claude apps.** Download [`foreman.skill`](https://github.com/Turki-Sh/Foreman/raw/main/dist/foreman.skill) and upload it as a skill.

**Cursor, Windsurf, Codex, Copilot, Gemini CLI, Cline, or any other coding agent.** Clone the repo and copy the skill folder where your agent looks for skills or rules.

```
git clone https://github.com/Turki-Sh/Foreman.git
cp -r Foreman/plugins/foreman/skills/foreman ~/.agents/skills/
```

Common destinations: `~/.agents/skills/`, `~/.cursor/rules/`, `~/.codex/skills/`, or a `.github/` folder in the project. See [AGENTS.md](AGENTS.md) for per-tool paths and for what to do if your agent has no skills directory at all.

**Any assistant with no skills support, including the web chat you already have open.** Paste [`SKILL.md`](plugins/foreman/skills/foreman/SKILL.md) into the conversation and say "run this on me." The steps work without the references; the references only deepen them.

## Then say

> help me build my portfolio

The agent should answer with two questions, not with code. That is the whole point.

## What changes

| | Without Foreman | With Foreman |
|---|---|---|
| First move | Generates a page | Asks what the site is for and who reads it |
| Copy | Written by the model | Extracted from you, with numbers |
| Design | Whatever the model defaults to | Locked tokens you chose from three variants |
| Scope | Everything it can think of | Explicit non-goals, written before the build |
| Done | It renders on your laptop | 375px, keyboard, Lighthouse, incognito, real 404 |
| Live | "Deployed" | DNS, SSL, sitemap, Open Graph, submitted and indexed |

## What is in the box

**Session flow.** Eight steps with gates, written for the agent, not for you. It does not advance until each gate is met, it stamps which step you are on in every message, and it writes no line of the site until the brief is frozen.

**Thirteen references**, loaded only when the step arrives: content interview, design direction, the palette workflow, composition and choreography, the reference library, vibe-coded tells, stack choice, the build brief, performance and accessibility, metadata and 404, bilingual and RTL, verify and ship, and a full worked example.

**Six fillable assets:** a brand harness with three variants, a head metadata block with Open Graph and JSON-LD, a custom 404, robots.txt, sitemap.xml, and llms.txt.

<a id="no-scripts"></a>
**No executable code.** Foreman ships no scripts, no hooks, no MCP servers, and no slash commands. It is markdown and fill-in-the-blank templates, so you can read every line of it before you trust it. The one `<script>` tag in the repo is a `type="application/ld+json"` structured data block inside `assets/head-metadata.html`: inert JSON meant for your site's `<head>`, not code that runs when you install this.

**See it run before you install it.** [The worked example](plugins/foreman/skills/foreman/references/worked-example.md) is a full session from the first question to a frozen brief, including the thing that went wrong afterwards.

## The three ideas it enforces

1. **The agent's ceiling is your brief.** Model choice is a rounding error next to the quality of the specification.
2. **Non-goals are the highest-leverage lines you will write.** Agents over-build by default, and one line prevents it.
3. **Decisions are yours, typing is theirs.** Delegate the implementation. Delegating the judgment is what produces the default look.

## Contributing

Contributions are open in some areas and closed in others. [CONTRIBUTING.md](CONTRIBUTING.md) says which.

The most useful thing you can send is a failure the playbook did not intercept: your build broke, and Foreman never asked the question that would have prevented it. Post it on the [meta thread](https://github.com/Turki-Sh/Foreman/issues/1). The most useful pull request is an install path for an agent I cannot test.

## Author

Built by **Turki Alshuaibi**, AI engineer. Everything in it came from shipping, and from watching capable engineers get stuck in the same handful of places, which are the failure modes listed at the end of the skill.

[![Portfolio](https://img.shields.io/badge/Portfolio-turkialshuaibi.com-FFB400?style=flat&logo=astro&logoColor=white)](https://turkialshuaibi.com/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/turki-alshuaibi)
[![GitHub](https://img.shields.io/badge/GitHub-Turki--Sh-181717?style=flat&logo=github&logoColor=white)](https://github.com/Turki-Sh)
[![Email](https://img.shields.io/badge/Email-turki@turkialshuaibi.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:turki@turkialshuaibi.com)

## License

MIT. Use it, fork it, teach with it, ship client work with it.

MIT does require attribution: the copyright notice travels with any copy or substantial portion. Beyond that legal minimum, if Foreman shaped a site you are proud of, a line in your README or a link in the post is the thing that actually helps. Credit costs you nothing and it is how a playbook finds the next person who needs it.
