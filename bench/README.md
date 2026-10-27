# The bench

How Foreman measures itself, so that every number in its documentation was counted and every release can show what it changed.

Three instruments, each answering a different question:

| Instrument | Question | Source |
|---|---|---|
| **Bench** (`run.py`, `score.py`, `review.py`) | Does Foreman produce better sites than the same agent without it, and did this release improve or regress? | Staged sessions against simulated owners |
| **Field** (`field.py`, session reports) | How does it behave in sessions nobody staged? | Real transcripts and the session report form |
| **Pulse** (`pulse.py`) | Is anyone finding and installing it? | GitHub's own numbers |

## The loop

1. **Before every release,** run the bench on all scenarios, baseline against natural at minimum. Compare with the last release's `results.json`. A metric that gets worse blocks the release until the changelog explains why.
2. **Every failure someone reports becomes a scenario,** or a fact in an existing one, so it is tested on every release after. This is how a field failure stops recurring.
3. **Every two weeks, run the pulse.** GitHub keeps traffic for 14 days only, so a missed fortnight is lost for good.
4. **Documentation gets numbers only from clean bench runs,** each with its run count, model, date and Foreman version beside it, and a link to the raw results. A number from a run that was not clean, or one somebody estimated, never ships.

## Running the bench

One-time setup:

```
npm install --prefix bench
```

That installs `playwright-core`, which drives your installed Chrome to measure each built site.

Clean runs need their own login. Claude Code loads your personal `CLAUDE.md` and rules even with project-only settings, and a personal rule such as "no em dashes" would quietly help the baseline. So the runner uses a fresh config folder and reads its credentials from the environment: `CLAUDE_CODE_OAUTH_TOKEN` (from `claude setup-token`, which bills your subscription) or `ANTHROPIC_API_KEY` (which bills the API).

```
python bench/run.py --scenarios all --conditions baseline,natural
python bench/score.py bench/runs/<timestamp>
python bench/review.py bench/runs/<timestamp>
```

The conditions are `baseline` (no Foreman), `natural` (Foreman installed, the owner types as they would), and `survey`, `blueprint` and `stress`, which start in that mode. `--repeats` runs each pair more than once; models vary between runs, so a single run is an anecdote.

**Cost.** A harness test on 27 October 2026 with Sonnet as the agent and Haiku as the owner reported $1.27 for a baseline run that built a page in three turns, and $0.22 to $0.26 per turn for the first four turns of a Foreman session. How many turns a full Foreman session takes before the build has not been measured yet; if it is 15 to 25, a Foreman run costs several dollars at API prices. The first full run replaces these figures.

`--allow-user-config` runs with your own Claude Code setup for testing the harness. Its results are marked not clean, and the summary says so.

## What it measures

**From the transcript:**

| Measure | Meaning |
|---|---|
| foreman loaded | The agent opened with Foreman's card or stamp, or called its skill |
| messages before code | Owner messages before the first site file was written. Zero means it built straight away |
| questions before code | Question marks in the agent's messages before then |
| brief written | `BRIEF.md` and `BRAND.md` both exist at the end |

**From the built site, in a real browser at 1280 and 375 pixels wide:**

| Measure | Meaning |
|---|---|
| invented numbers | A number on the page with two or more digits, or a percentage, that appears nowhere in what the owner said or gave. Years are ignored |
| default AI palette | A near-black ground with a blue-to-violet accent, cream with terracotta, or a framework default hex (`#6366F1` and its neighbours) |
| dead links | Links to `#`, to nothing, or to `javascript:` |
| overflow at 375 | The page scrolls sideways on a phone |
| contrast failures | Visible text below 4.5:1, or 3:1 for large text, against its real background |
| complete metadata | Title, description, canonical, Open Graph title and an absolute image, Twitter card, JSON-LD, `lang`, viewport, favicon |
| a 404 | The site ships its own `404.html` |
| em or en dashes | Either character in the visible text, the alt text or the description |
| stock SaaS words | "seamless", "effortless", "unlock", "supercharge" and similar, listed in `score.py` |

**From people, via `review.py`:** a blind side-by-side of each pair, A and B shuffled, with the key kept apart until the picks are in.

## What it cannot tell you

- The owner is a model playing a person from a fact sheet. It answers more consistently than a person would, and it never gets bored at question nine.
- The agents can read and write files and nothing else: no shell, no web. That keeps the two sides equal and the sites static, and it leaves out builds with frameworks.
- The checks are heuristics, and each one is listed above so a reader can disagree with it. Taste is the blind review's job, and a single reviewer's preference stays a single reviewer's.
- Eight scenarios is a small sample. Report it as eight, never as a percentage alone.

## Field and pulse

```
python bench/field.py          real Foreman sessions in this machine's Claude Code and Codex history
python bench/pulse.py          stars, forks, traffic, referrers and downloads, appended to bench/pulse/log.jsonl
```

`field.py` prints counts only, never message text, so its output can go in a session report. Test sessions run from temp folders are skipped unless you pass `--include-tests`.
