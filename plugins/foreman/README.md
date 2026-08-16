# Foreman

A build playbook for shipping real websites with coding agents. The plugin ships one skill, `foreman:foreman`.

Install in Claude Code:

```
/plugin marketplace add Turki-Sh/Foreman
/plugin install foreman@alshuaibi
```

`/plugin` is a terminal-only dialog. Where it is unavailable, run `claude plugin marketplace add Turki-Sh/Foreman` then `claude plugin install foreman@alshuaibi`.

Then say: help me build my portfolio.

It triggers on web build and rebuild requests, and on the parts people get stuck on afterwards: hosting, domains, DNS, SSL, custom 404s, Open Graph previews, sitemaps and indexing, Lighthouse scores, RTL layouts, and why an AI-built site looks generic.

Read the skill before you trust it: [`skills/foreman/SKILL.md`](skills/foreman/SKILL.md). Nothing here executes.

Full documentation and background: the [repository root README](https://github.com/Turki-Sh/Foreman).

MIT, Turki Alshuaibi.
