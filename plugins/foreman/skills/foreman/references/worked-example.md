# Worked example

A compressed run, step 1 to frozen brief, so you can see the shape and the standard. Do not reuse this content. Reuse the moves.

## Step 1: Orient

> **FOREMAN · 1/8 · ORIENT**
>
> What are you building, and what do you already have for it? Copy, CV, screenshots, a logo, a domain, anything.

**Them:** A portfolio site. I have my CV and some screenshots from a robotics project.

Logged: no written copy, no logo, no domain, one project with visuals, one CV to mine.

> **✓ LOCKED · 1/8 ORIENT** · portfolio · has: CV, project screenshots · missing: copy, logo, domain

## Step 2: Decide

> **FOREMAN · 2/8 · DECISIONS**
>
> Who is the one reader you actually care about, and what should they do after ninety seconds?

**Them:** Research group leads. I want them to email me about a PhD position.

**You:** Then the site has one job and one action. What have you actually built that a group lead would care about?

**Them:** A sim-to-real transfer pipeline for a quadruped. It cut retraining time.

**You:** By how much, and what was the hard part?

**Them:** About 60 percent. The hard part was domain randomization limits, we kept overfitting to the sim.

That exchange is the whole step. A number and a real constraint replaced "passionate about robotics".

Non-goals agreed: no blog, no contact form (email link only), no analytics, no scroll-triggered animation. Hover and focus states stayed out of the non-goals, deliberately.

## The push, which arrives here almost every time

**Them:** Can you just build a first version and we iterate on it?

**You:** Ten more minutes and the first version is one we keep. Building now gets us the site every generated portfolio already is, and then we argue with it instead of writing it. Pick a register: institutional, academic, editorial, or playful.

**Them:** Academic, but not dusty.

One question, no negotiation, no apology, no explanation of the playbook. The build did not start.

## Step 3: Lock the look

Built `brand.html` with three variants using their real bio text. They picked the second: technical, high contrast, one accent.

Locked: `#0B0D10` background, `#151A20` surface, `#EDF1F5` text, `#8B95A1` muted, `#5B8DEF` accent. Display face for headings only, system stack for body, three sizes at 3.25rem / 1.25rem / 1rem. Focus ring drawn in the accent at 2px.

State rule: every link, button, and card transitions on hover and focus, 160ms, one easing curve, transform and opacity only.

Signature element, specified in five parts rather than named in one:

- **What:** the quadruped's gait plotted as an SVG, drawn from their real logged data.
- **Where:** the hero, right of the name.
- **Does:** the trace draws itself once on load, 1.8s, then holds.
- **At 375px:** moves below the hero line, half height, same trace.
- **Reduced motion:** the completed trace, rendered instantly. Checked first, because it is the version that gets screenshotted.

That single element carries the personality. Everything else stays quiet.

> **✓ LOCKED · 3/8 LOOK** · #0B0D10 / #151A20 / #EDF1F5 / #8B95A1 / #5B8DEF · 3 sizes · gait trace in hero

## Step 4: The brief

Brief written and frozen. Copy final, tokens verbatim, signature element specified, motion rule explicit, budget set, non-goals explicit, acceptance criteria testable.

**Handoff line to them:** paste this into your coding agent, let it build, come back with what breaks.

## What went wrong later, and how it got handled

The coding agent shipped an 8 MB hero. Lighthouse mobile came back at 51. The fix was not a new prompt, it was one constraint the brief had left out: hero media under 1.5 MB with a poster fallback. That constraint now lives in `references/performance-and-access.md` and goes into every brief.

It also replaced the gait trace with a stock lab photo, which is the other thing coding agents do to a signature element. Caught at step 6 by reading the brief's five-part spec against the page. The reason it was catchable is that the spec existed. "A cool hero animation" is not something you can hold anyone to.
