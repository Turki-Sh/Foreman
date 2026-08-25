# The build brief (step 4)

The brief is the actual artifact of this step. You write it, they correct it, then it freezes. Aim for 600 to 1000 words.

## It goes on disk, in two files

A brief that lives in the chat is gone the moment the context is. Write it into their project:

- **`BRAND.md`**: locked tokens including `--on-accent`, the material sentence the palette came from, the type scale with its letter-spacing, the composition, the gutter, the layer stack, the choreography table, the interaction inventory, the signature element spec, and the icon rules. Re-read before every visual change. This file is why the tokens survive the build, and why the page has a shape and a first two seconds that somebody chose.
- **`BRIEF.md`**: everything else, in the template below, pointing at `BRAND.md` for the visual system instead of repeating it. Two copies of a hex value disagree within a week.

Both are documents rather than site code, so rule 1 permits them. They are also the only two files that exist at the end of this step.

The split matters because the two are read differently. The brief is read once, at the start, to understand the job. `BRAND.md` is opened again every time a colour or a size is about to be chosen, which is exactly when an agent reaches for its defaults.

## Two rules that outrank the template

**1. Include context the coding agent cannot derive, exclude instructions it can.**

Give it who the owner is, what the site must accomplish, the locked tokens, what is off limits, and how success will be judged. Leave component structure, package choices, and file organization to it. Over-prescribing implementation makes output worse, not better, and it wastes the one thing the coding agent is genuinely better at than both of you.

The exception is the signature element and the motion rule. Those are the two things a coding agent silently downgrades, so they get specified rather than described.

**2. Acceptance criteria beat adjectives.**

"Clean and modern" is unfalsifiable and will be interpreted as the current default look. "Lighthouse mobile 95+, no layout shift when the hero loads, readable at 375px, tab order matches visual order" is a test the coding agent can run against its own output.

## Template

```
PROJECT
Site for: [name]. Audience: [who]. Register: [one word].
The one action a visitor should take: [action].

STACK
[framework], static build, deployed to [host] from [git repo].

CONTENT
[Final copy, written by the owner, not generated, and assigned to a slot.]
Opening: [one sentence]
Support: [one sentence]
Action: [label, destination]
Below the fold: [everything else, in order]
Cut: [what is not on the page]
Do not move copy between slots. Do not put a fourth thing in the hero.
Use this copy verbatim. Do not add headings, taglines, captions, alt-text
prose, or explanatory sentences that are not here. Nothing on the page
explains why the page is the way it is. If a section looks like it needs
more words, ask me instead of writing them.
No em dashes and no en dashes anywhere in the output, including alt text,
the meta description, the 404 copy, and any string you generate yourself.
Commas, full stops, or two sentences. Hyphens in compound words are fine.

SHAPE
This site is [one non-scrolling viewport / one scrolling page / several pages].
It is carried by [media / type / structure / an artifact].
The composition, in one sentence: [something a stranger could draw].
Page gutter: [x]px below [breakpoint], [y]px above, on every element that
touches the edge. Layer stack, back to front: [ground, structure, content,
chrome, overlays] with their z-index.

CHOREOGRAPHY
See the table in BRAND.md. One row per element: what moves, how long, and its
delay. Entrance easing [curve], interaction easing [curve], and no others.
The page must be complete if the animation never runs: build the resting state
first and play the entrance from it. Nothing animates on scroll.

DESIGN TOKENS
See BRAND.md. Locked, not suggestions, and not to be substituted.
The same values, for reference:
Background [hex] / Surface [hex] / Text [hex] / Muted [hex] / Accent [hex]
Text on accent: [hex]. Do not use the background colour for this by default.
These came from [the material sentence: "warm paper, graphite, and the red of
a library date stamp"]. Every value was contrast-checked. Substituting any of
them for a framework palette name, or for something that reads better to you,
is the one change that undoes this whole brief.
Display font: [name]. Body font: [name].
Type scale: [3 sizes], hero at [ratio] of body, chosen against the actual
length of the opening line rather than in the abstract.
Letter-spacing: [value] at display sizes, [value] for body. Two weights only.
Focus ring: [accent], never the browser default, never removed.

SIGNATURE ELEMENT (build this as specified, do not simplify it)
What it is: [the one thing this page is remembered by].
Where it lives: [section].
What it does: [what moves or changes, what starts it, how long it takes].
At 375px: [what it becomes on a phone].
With prefers-reduced-motion: [the resting frame, which must look finished
on its own].

MOTION
Every interactive element has a hover state, a focus state, and a
transition between them: [duration]ms, [easing], transform and opacity only.
Nothing else on the page moves. No scroll-triggered animation, no parallax,
no counters, no carousels.
When you hand this back, point at the hover and focus state of the primary
action, the nav, and a card. If you cannot point at them, they are not built.

QUALITY FLOOR
Responsive to 375px. Visible keyboard focus, tab order matches visual order.
Contrast passes WCAG AA. prefers-reduced-motion respected.
Lighthouse mobile 95+. Hero media under 1.5 MB with a poster fallback.
Custom 404 that is unmistakably this site: same nav, same tokens, same type,
same footer, and not a bare word on an empty background. A plain sentence
about what happened, a link home, and the primary action. Real 404 status,
not a 200.

NON-NEGOTIABLES
[Three to six lines. The things that are the point of this build and that a
tidy-up would quietly remove. Values marked exact were tuned and are not to be
rounded. Known compromises we are keeping, so nobody fixes them into something
worse.]

EVERY CONTROL WORKS
Every button, link, tab, toggle, and input does what it looks like it does.
If a feature is not built, remove its control rather than styling it. No
href="#", no input without a backend, no tab with one state, no status dot
with nothing behind it. A dead control costs more than a missing one.

EVERY ELEMENT JUSTIFIES ITSELF
For anything you add, be able to say in one sentence what it does for the
reader. That covers pill badges, eyebrow labels, 01 / 02 / 03 markers,
dividers, icons, and cards. A pill is the shape of something small,
interactive, and one of several; it is not a decoration for a heading. If a
section looks bare, make it shorter. Do not fill it, and never invent a
statistic, a testimonial, a logo row, or a chart to fill it.

NON-GOALS
No [contact form / analytics / carousel / scroll animation / blog] in v1.
State transitions and the signature element are not in this list.

FOOTER
Version [x.y.z] and last updated [date], in the footer and in the JSON-LD,
from one source. Copyright year generated, not typed. If either changes,
every place it appears changes in the same commit.

HOW TO WORK WITH ME
Build this to the standard you would use for the client who pays the most.
It does not drop because this is a first pass.
When you hand it back, show me: the hover and focus states on the primary
action, the nav, and a card; the page at 375px; the 404 reached from a bad
URL; and every control clicked.
One concern per turn. Commit after each working step with a descriptive message.
Do not refactor anything I did not ask you to touch.
Do not substitute the tokens or the fonts for something you prefer.
Do not offer to do steps that require my accounts or credentials.
Ask before assuming anything about my background or my content.
```

## Before you freeze it

Read the brief back against the register word from step 2. If a stranger read only this brief, would they produce something recognizably theirs, or the generic version of this category? If it is the generic version, the missing piece is almost always in the content or the signature element, not in the instructions.

Check the hero against its slots. If the opening slot holds more than one sentence, or the hero holds more than three things, the build will read as stacked and no amount of type work will fix it.

Read the palette back against `palette.md` as well. If it is a dark ground with grey neutrals and a blue or violet accent, and nobody can say what real thing it came from, the brief is about to produce the site every other build produced. That is worth reopening step 3 for, even at this stage, because it is cheaper here than anywhere later.

Then read the shape and the choreography back. If the brief does not say where anything goes or what happens when the page loads, the coding agent decides both, and it decides a centred column that appears all at once. Those two omissions produce more of the generated look than the palette does.

Then read it a second time for the opposite failure. If every specific instruction were followed exactly, would the result have any life in it? A brief that locks five hex values, three type sizes, and nothing else describes a document. The signature element and the motion rule are what stop it being one.
