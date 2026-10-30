# Security

The installed Foreman plugin contains no executable code: no scripts, no hooks, no MCP servers, no network calls. CI fails the build if any appear under `plugins/`. What it does contain is instructions that a coding agent follows, and instructions can be a security problem too.

## What counts as a vulnerability here

- Any text in the skill, the toolbelt, the references, or the templates that could lead an agent to run a command, fetch or send data, read files outside the user's project, or act on an account, when the user did not ask for it.
- Any template in `assets/` that would ship something unsafe into a user's site: a script, an inline event handler, a third-party request, or a field that leaks data.
- Anything in the repo that would let someone impersonate the project: a changed install path, marketplace name, or download link that points somewhere other than this repository.

Ordinary disagreements with the playbook's advice are not vulnerabilities. Post those on the [meta issue](https://github.com/Turki-Sh/Foreman/issues/1).

## How to report

Report privately through GitHub: the **Security** tab of this repository, then **Report a vulnerability**. If that is not available to you, email turki@turkialshuaibi.com with "Foreman security" in the subject.

Please include the file and line, what an agent would do because of it, and how you saw it happen. You will get a reply within seven days, and a fix ships as a patch release with credit in the changelog unless you would rather not be named.

## Supported versions

Only the latest release is supported. In your shell, run `claude plugin marketplace update alshuaibi`, then `claude plugin update foreman@alshuaibi`. Or select **Update now** for Foreman in the `/plugin` panel. See the [official update instructions](https://code.claude.com/docs/en/discover-plugins).
