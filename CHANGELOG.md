# Changelog

All notable changes to Foreman. Versioning: the major number changes when the session flow changes, the minor when references or assets are added, the patch for corrections.

## 1.4.0, 25 August 2026

The release that answers the three reports in the tracker, plus the two failure
modes the playbook was causing itself: steering toward pages with no life in
them, and assuming every site is somebody's portfolio.

Added:
- **Four rules at the top of `SKILL.md` that outrank the rest of the file.**
  No site code before the brief is frozen, one step per message, reasoning
  stays in the chat, gates hold under pressure. They sit above the step list
  because an agent that reads the whole file and then builds anyway has not
  disobeyed anything specific enough to disobey.
- **The step stamp.** Every message opens with `FOREMAN · 3/8 · LOOK`, and a
  cleared gate is stamped once with what is now fixed. The user can follow the
  build from the stamps alone. The stamp is also the agent's own anchor: it
  cannot skip to the build without writing down that it did.
- **A scripted answer to "just build it."** Compress to four exchanges, never
  to zero. "Pick for me" is answered with named options, never with one
  finished result.
- **"Refuse the unfinished page" in `design-direction.md`,** with a five-point
  check: type that does real work, vertical rhythm, one thing that breaks the
  column, detail at the small scale, and a response on every interactive
  element. Simple was never the failure. Unresolved is, and in a screenshot
  the two are identical.
- **Motion rules.** State changes always, the signature once, decoration never.
  `prefers-reduced-motion` is the same page at its resting frame, and the
  resting frame gets designed first because it is every screenshot anyone takes.
- **A five-part signature element spec** in the brief: what, where, what it
  does, at 375px, and under reduced motion. An unspecified signature element
  is the first thing a coding agent downgrades to a static image.
- **Hover, focus, transition, and selection states in `brand-harness.html`,**
  plus `--dur` and `--ease` tokens per variant, so the owner picks a look with
  its behaviour attached rather than a still frame.
- Verification now checks the register word, the hover and focus states, the
  reduced-motion frame, and whether the coding agent substituted the signature
  element or padded the page with filler copy.
- **`references/vibe-coded-tells.md`,** a tenth reference. The patterns that mark
  a page as generated, in layout, colour, type, copy, motion, affordances, and
  in the source. It includes the tells that are absences rather than elements:
  no empty state, no error state, no loading state, buttons that do nothing,
  content that never varies in length. A rejection list at step 3 and a
  checklist at step 6, with a search for the locked hex values in the built CSS,
  because framework palette names in the class strings are proof the tokens
  never shipped.
- **`references/reference-library.md`,** an eleventh reference, and the
  reference step that uses it. Offered once with the skip attached, because
  most people have no references and will not go looking unless handed
  somewhere to look. Around fifty places sorted by what each is good for:
  galleries, product and interface, motion, type, colour, and the non-web
  sources that produce the least derivative results, since nothing there can
  be copied directly and only the principle survives the trip. The agent sends
  the three or four rows that match what is being built, never the whole file,
  because a list of forty links is a way of not choosing.
- **Icon sets.** Ten of them by voice rather than by popularity, the note that
  most personal sites need three brand glyphs and not a set at all, and the
  rules that go in the brief: one family, one stroke, tokens not defaults,
  never an icon carrying meaning alone.
- **Rule 5: no em dashes, anywhere.** Not in the agent's messages, not in the
  brief, not in the site copy, not in alt text, a meta description, a commit
  message, or a filename. En dashes included, ranges get the word "to". It is
  the loudest punctuation tell of generated text, and one of them in the line
  at the top of the page undoes a great deal of the rest of the playbook. It
  now sits in the brief as a constraint, in the verification checklist as a
  search, and in `vibe-coded-tells.md` as what it is.
- **A one-line introduction on the first message.** The session opens by naming
  itself and saying who runs the decisions, then asks the two orient questions.
  One line, never a tour of the eight steps. The name appears exactly twice in
  a session, here and at the close.

Changed:
- **Phases are steps, numbered 1 to 8.** The file said seven phases and had
  eight, numbered from zero, which made "step 3 of 8" impossible to stamp
  correctly. Renumbered across the skill, the references, the README, and the
  site.
- `no animation` is no longer offered as a default non-goal. It shipped pages
  that felt like a PDF. The default non-goal is `no scroll-triggered animation`,
  and the brief now states that state transitions are not on that list.
- The brief tells the coding agent to use the copy verbatim and to add no
  explanatory sentences of its own. Filler copy in an empty-looking section is
  how a page ends up explaining itself to its reader.
- `content-interview.md` extends the no-justification rule to the agent's own
  messages: no preambles, no recaps, no defending an unchallenged constraint,
  no apologising for asking. It reads as doubt and it reopens settled gates.
- `worked-example.md` shows the stamps, the specified signature element, and
  the "just build it" push being turned down in three sentences.
- **The playbook no longer assumes every site is a portfolio.** The content
  interview opens by establishing what kind of page this is, with a table of
  six common kinds and what the top of each owes its reader. The table is
  explicitly examples rather than a menu, since most real sites are two rows
  at once and plenty are no row at all. When it is not listed the question does
  not change: what did this reader come for, and what do they need in the first
  five seconds of having it. "The hero line" is now
  "the first thing the reader reads", which on a restaurant page is the hours
  and the address, not a sentence about craft. Project entries became content
  units, the bio became the about section, and `brand-harness.html` no longer
  puts `[REAL HERO LINE]` in the `h1` of a page that may not have one.
- Fabricated evidence is now called out by name and refused rather than
  restyled: invented metrics, logo rows of non-customers, testimonials from
  people who do not exist, charts with no data. It is attached to the owner's
  real name, which makes it their problem and not a styling question.

Credit: issue #3 (a reference step), issue #4 (the site looks too simple), and
issue #5 (the AI over explains) in the tracker.

## 1.3.0, 11 August 2026

Added:
- `references/design-direction.md` now refuses the single accented word. Colouring one word of a headline in the brand colour is one of the strongest tells that a machine set the type, along with the one-word gradient, swoosh, and highlighter block. The section gives the structural alternatives that are actual decisions.
- Gates for phases 4, 5, 6, and 7. The playbook claimed seven gated phases and only had four.
- A hard number for the hero media cap, 1.5 MB, in `performance-and-access.md` and in the brief template, which previously read `[X] MB`. This is the constraint whose absence produces the failure in `worked-example.md`.

Changed:
- The failure-modes list names the agent's own version of the first failure: presenting a finished visual system instead of variants the owner chose from.
- `assets/brand-harness.html` now fills all three variants. It previously shipped one filled variant and two empty stubs, so the side-by-side comparison the file exists for could not happen without extra work.
- The Close section can now truthfully say the repository is linked in the skill, because it is.

## 1.2.0, 10 August 2026

Added:
- `references/worked-example.md`: a full run from Phase 0 to a frozen brief, plus the failure that followed.
- `references/bilingual-rtl.md`: second languages as a layout problem, RTL mirroring, type, URL structure.
- `references/stack-choice.md`: what to recommend, what to refuse, how to end the stack debate.
- An opening script for Phase 0, so the first message is consistent.
- A single attribution line at the end of a successful ship.

Changed:
- Skill slug is now `foreman` (was `foreman-by-turki-alshuaibi`). Attribution moved to `displayName`, the author field, and the README, where it belongs.
- Description broadened to cover redesigns, hosting, DNS, Open Graph, indexing, Lighthouse, and RTL, which are the moments people actually ask for help.
- Packaged as a Claude Code plugin marketplace.

## 1.1.0, 10 August 2026

Added:
- `references/content-interview.md`: Phase 1 question sequence, hero line test, project entry shape, bio standards.
- `references/metadata-and-404.md`: head block, OG image rules, JSON-LD, crawl files, and a real 404 spec.
- `references/performance-and-access.md`: image, video, font, and JavaScript constraints, accessibility floor, and the budget to write into the brief.
- `assets/head-metadata.html`, `assets/404.html`, `assets/robots.txt`, `assets/sitemap.xml`, `assets/llms.txt`.

Changed:
- Phase 1 and Phase 3 now pull constraints from the references instead of asserting standards without teaching them.
- Version and date surfaced in the frontmatter and the body.

## 1.0.0, 6 August 2026

First release, from the Agentic Design enrichment session.
- Seven-phase session flow with gates, written for a brain agent rather than a reader.
- `references/design-direction.md`, `references/build-brief.md`, `references/verify-and-ship.md`.
- `assets/brand-harness.html`.
