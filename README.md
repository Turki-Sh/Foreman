# Foreman

**A build playbook for shipping real websites with coding agents, by Turki Alshuaibi.**
Not tied to any one agent: it is a folder of markdown, so it runs on Claude Code, Cursor, Windsurf, Codex, Copilot, Gemini CLI, or a chat window with no skills support at all.

[![Agent Skill](https://img.shields.io/badge/agent-any-1B4DD1?style=flat&logo=markdown&logoColor=white)](AGENTS.md)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-one%20command-D97757?style=flat&logo=claude&logoColor=white)](https://code.claude.com/docs/en/plugins)
[![Steps](https://img.shields.io/badge/steps-8-1B4DD1?style=flat)](#what-is-in-the-box)
[![Modes](https://img.shields.io/badge/modes-3-1B4DD1?style=flat)](#three-modes)
[![Tools](https://img.shields.io/badge/tools-4-1B4DD1?style=flat)](#the-toolbelt)
[![References](https://img.shields.io/badge/references-14-1B4DD1?style=flat)](#what-is-in-the-box)
[![Assets](https://img.shields.io/badge/assets-7-1B4DD1?style=flat)](#what-is-in-the-box)
[![Version](https://img.shields.io/badge/version-3.0.0-1B4DD1?style=flat&logo=semanticrelease&logoColor=white)](CHANGELOG.md)
[![Validate](https://img.shields.io/github/actions/workflow/status/Turki-Sh/Foreman/validate.yml?style=flat&logo=githubactions&logoColor=white&label=validate)](https://github.com/Turki-Sh/Foreman/actions/workflows/validate.yml)
[![Scripts](https://img.shields.io/badge/executable%20code-none-16A34A?style=flat&logo=markdown&logoColor=white)](#no-scripts)
[![License](https://img.shields.io/badge/license-MIT-3DA639?style=flat&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Author](https://img.shields.io/badge/by-Turki%20Alshuaibi-1B4DD1?style=flat)](https://turkialshuaibi.com/)

**[foreman.turkialshuaibi.com](https://foreman.turkialshuaibi.com/)**

<p align="center">
  <a href="https://foreman.turkialshuaibi.com/">
    <img src="https://foreman.turkialshuaibi.com/screenshot.png" alt="The Foreman site: a technical sheet on white paper, with a hand-drawn wireframe annotated with the decisions the interview forces." width="820">
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

Already installed? `/plugin marketplace update alshuaibi` brings you to the latest version.

**Claude apps.** Download [`foreman.skill`](https://github.com/Turki-Sh/Foreman/raw/main/dist/foreman.skill) and upload it as a skill. The toolbelt is inside it.

**Cursor, Windsurf, Codex, Copilot, Gemini CLI, Cline, or any other coding agent.** Clone the repo and copy the skill folder where your agent looks for skills or rules. The toolbelt travels inside that folder.

```
git clone https://github.com/Turki-Sh/Foreman.git
cp -r Foreman/plugins/foreman/skills/foreman ~/.agents/skills/
```

Common destinations: `~/.agents/skills/`, `~/.cursor/rules/`, `~/.codex/skills/`, or a `.github/` folder in the project. See [AGENTS.md](AGENTS.md) for per-tool paths and for what to do if your agent has no skills directory at all.

**Any assistant with no skills support, including the web chat you already have open.** Paste [`SKILL.md`](plugins/foreman/skills/foreman/SKILL.md) into the conversation and say "run this on me." The steps work without the references; the references only deepen them.

## Usage

Start a build in plain words:

> help me build my portfolio

The agent should answer with the Foreman card and a question, not with code. That is the whole point.

<p align="center">
  <img src="https://foreman.turkialshuaibi.com/card.png" alt="The opening Foreman card in a terminal: the wordmark, the version, the step, the method, the mode line, and the first question." width="640">
</p>

Choose how deep it goes by saying the word at any point: **survey** for the fewest questions, **stress test** for the most. In Claude Code you can also start in a mode with `/foreman:foreman survey`.

Call a tool on its own, without the interview:

```
/foreman:punch-list https://your-site.com
/foreman:board a portfolio for a robotics researcher, academic
/foreman:palette
/foreman:launch
```

Or just ask: "why does my site look AI-made?", "give me a reference board", "pick me a palette", "my domain will not load". Outside Claude Code, the same words reach the same tools.

## Three modes

A mode changes how many questions Foreman asks and who does the legwork. It never changes which decisions get made.

| Mode | For | Before any code exists |
|---|---|---|
| **Survey** | You want it moving, or you already have most of the material | About four exchanges. The agent reads your repo, your site and your CV, looks at your category, and sends one decision sheet with a source on every line. You correct it |
| **Blueprint** | The default, and most builds | The full interview, one question at a time |
| **Stress test** | A launch where a weak decision is expensive | The full interview, every answer pushed once, a pre-mortem before the brief freezes, and a full punch list before it ships |

Even in Survey, three things stay yours: you pick the palette from variants, the copy comes from your own sentences, and you sign off the brief. Fewer questions never means the agent takes the obvious answer.

## The toolbelt

Four tools that run on their own or in the middle of a session.

| Tool | What it does |
|---|---|
| **[Board](https://foreman.turkialshuaibi.com/board/)** | Real sites chosen for your brief, as a list or a visual board with screenshots, ending in the principles worth taking from them |
| **[Punch list](https://foreman.turkialshuaibi.com/punch-list/)** | Audits any site, including ones Foreman never touched, for what makes it look AI-generated or unfinished, ranked, with a fix for each |
| **[Palette](https://foreman.turkialshuaibi.com/palette/)** | Three palettes from a material you name, contrast checked, on your real content |
| **[Launch](https://foreman.turkialshuaibi.com/launch/)** | Domain, DNS, SSL, the share card, a real 404, the sitemap and indexing, one step at a time |

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

**Session flow.** Eight steps with gates, written for the agent, not for you, at three depths. It does not advance until each gate is met, it stamps which step you are on in every message, and it writes no line of the site until the brief is frozen.

**Four tools** in `toolbelt/`: board, punch list, palette, and launch. In Claude Code each is also a slash command.

**Fourteen references**, loaded only when the step arrives: content interview, design direction, the palette workflow, composition and choreography, the reference library, vibe-coded tells, design standards (colour theory, proportion and the golden ratio, type scale and measure, spacing, gestalt, motion timing, optical correction), stack choice, the build brief, performance and accessibility, metadata and 404, bilingual and RTL, verify and ship, and a full worked example.

**Seven fillable assets:** a brand harness with three variants, a reference board, a head metadata block with Open Graph and JSON-LD, a custom 404, robots.txt, sitemap.xml, and llms.txt.

<a id="no-scripts"></a>
**No executable code.** Foreman ships no scripts, no hooks, no MCP servers, and no network calls. Its four slash commands are markdown skills like the rest of it. You can read every line before you trust it. The one `<script>` tag in the plugin is a `type="application/ld+json"` structured data block inside `assets/head-metadata.html`: inert JSON meant for your site's `<head>`, not code that runs when you install this. CI fails the build if anything executable appears.

**See it run before you install it.** [The worked example](plugins/foreman/skills/foreman/references/worked-example.md) is a full session from the first question to a frozen brief, the same opening in Survey, and the thing that went wrong afterwards.

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
