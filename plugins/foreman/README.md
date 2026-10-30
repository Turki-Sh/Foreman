# Foreman by Turki Alshuaibi

[![Listed on ClaudePluginHub](https://www.claudepluginhub.com/badge/turki-sh-foreman-plugins-foreman)](https://www.claudepluginhub.com/plugins/turki-sh-foreman-plugins-foreman?ref=badge)
A build playbook for shipping real websites with coding agents. Your agent interviews you, forces the design and scope decisions you would otherwise skip, locks a visual system, writes one build brief, builds it or hands it over, then verifies, ships, and indexes the site.

Site and docs: [foreman.turkialshuaibi.com](https://foreman.turkialshuaibi.com/)

![The current Foreman homepage with clear navigation, an architectural scene and recorded coding session.](https://foreman.turkialshuaibi.com/previews/site-2026-10-30.png)

## Install

In Claude Code, both lines, in this order:

```
/plugin marketplace add Turki-Sh/Foreman
/plugin install foreman@alshuaibi
```

Where your Claude Code surface does not support `/plugin`, run the same two steps in your shell, then start a new session:

```
claude plugin marketplace add Turki-Sh/Foreman
claude plugin install foreman@alshuaibi
```

To update from your shell, run `claude plugin marketplace update alshuaibi`, then `claude plugin update foreman@alshuaibi`. Or select **Update now** for Foreman in the `/plugin` panel. [Official instructions](https://code.claude.com/docs/en/discover-plugins).

Other agents (Cursor, Windsurf, Codex, Copilot, Gemini CLI) and the Claude apps: see the [install page](https://foreman.turkialshuaibi.com/install/).

### Use Foreman with your team (optional)

If Foreman is part of this project's workflow, install it at project scope. Run these commands from the project directory:

```sh
claude plugin marketplace add Turki-Sh/Foreman
claude plugin install foreman@alshuaibi --scope project
```

This records Foreman in `.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "foreman@alshuaibi": true
  }
}
```

Keep any existing settings and other plugin entries. Review the diff, then commit `.claude/settings.json` so collaborators receive the configuration. Each collaborator still runs the two commands above once on their machine; committing settings does not download the plugin for them.

For personal use, keep the default user-scope installation. Project sharing is optional and works in private repositories too. Keep credentials and personal overrides out of the shared file.

[Claude Code installation scopes](https://code.claude.com/docs/en/discover-plugins#choose-an-install-scope) · [Shared settings](https://code.claude.com/docs/en/settings#settings-files-and-who-they-affect)

## Usage

Say what you are building, in plain words:

```
help me build my portfolio
```

It answers with the Foreman card and one question, never with code. If it starts writing HTML, it did not load.

![The opening Foreman card: the wordmark, the version, the step, the method, the mode line, and the first question.](https://foreman.turkialshuaibi.com/previews/card-3.0.1.png)

Say **survey** for the fewest questions (the agent researches your repo, site and CV instead of asking) or **stress test** for the most. Blueprint is the default. Every decision gets made in all three.

Run a tool on its own:

```
/foreman:punch-list https://your-site.com
/foreman:board a landing page for a note-taking app, technical
/foreman:palette
/foreman:launch
```

## What's inside

Five skills, all markdown:

| Skill | What it does |
|---|---|
| `/foreman:foreman` | The full session: eight gated steps from the first question to a site that is live and indexed, in Survey, Blueprint or Stress test mode |
| `/foreman:board` | A reference board: real sites chosen for your brief, as a list or a visual board with screenshots, ending in named principles |
| `/foreman:punch-list` | Audits any site for what makes it look AI-generated or unfinished, ranked, with a fix for each |
| `/foreman:palette` | Three palettes from a material you name, contrast checked, on your real content |
| `/foreman:launch` | Domain, DNS, SSL, metadata, the share card, a real 404, the sitemap and indexing |

Plus fourteen references loaded only when their step arrives, including design standards (colour theory, proportion and the golden ratio, type scale, spacing, motion timing), and seven fillable templates.

Nothing executes: no scripts, no hooks, no MCP servers, no network calls. Read the skill before you trust it: [`skills/foreman/SKILL.md`](skills/foreman/SKILL.md).

Full documentation: the [repository README](https://github.com/Turki-Sh/Foreman) and [foreman.turkialshuaibi.com](https://foreman.turkialshuaibi.com/).

MIT, by [Turki Alshuaibi](https://turkialshuaibi.com/).
