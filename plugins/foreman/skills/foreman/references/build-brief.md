# The build brief (step 4)

The brief is the actual artifact of this step. You write it, they correct it, then it freezes. Aim for 600 to 1000 words.

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
[Final copy for every section. Written by the owner, not generated.]
Use this copy verbatim. Do not add headings, taglines, captions, alt-text
prose, or explanatory sentences that are not here. Nothing on the page
explains why the page is the way it is. If a section looks like it needs
more words, ask me instead of writing them.
No em dashes and no en dashes anywhere in the output, including alt text,
the meta description, the 404 copy, and any string you generate yourself.
Commas, full stops, or two sentences. Hyphens in compound words are fine.

DESIGN TOKENS (locked, do not substitute)
Background [hex] / Surface [hex] / Text [hex] / Muted [hex] / Accent [hex]
Display font: [name]. Body font: [name].
Type scale: [3 sizes], hero at [ratio] of body.
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

QUALITY FLOOR
Responsive to 375px. Visible keyboard focus, tab order matches visual order.
Contrast passes WCAG AA. prefers-reduced-motion respected.
Lighthouse mobile 95+. Hero media under 1.5 MB with a poster fallback.
Custom 404 reusing the site layout, with a way back.

NON-GOALS
No [contact form / analytics / carousel / scroll animation / blog] in v1.
State transitions and the signature element are not in this list.

HOW TO WORK WITH ME
One concern per turn. Commit after each working step with a descriptive message.
Do not refactor anything I did not ask you to touch.
Do not substitute the tokens or the fonts for something you prefer.
Do not offer to do steps that require my accounts or credentials.
Ask before assuming anything about my background or my content.
```

## Before you freeze it

Read the brief back against the register word from step 2. If a stranger read only this brief, would they produce something recognizably theirs, or the generic version of this category? If it is the generic version, the missing piece is almost always in the content or the signature element, not in the instructions.

Then read it a second time for the opposite failure. If every specific instruction were followed exactly, would the result have any life in it? A brief that locks five hex values, three type sizes, and nothing else describes a document. The signature element and the motion rule are what stop it being one.
