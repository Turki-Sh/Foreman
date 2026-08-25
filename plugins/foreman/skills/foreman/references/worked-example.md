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

## The copy they paste

**Them:** Here is what I have. "Advancing autonomous locomotion research. I work on reinforcement learning for legged robots."

**You:** The second sentence is closer, and the first would be true on any lab's page. What does the group lead learn from "advancing autonomous locomotion research" that they did not already assume?

**Them:** Nothing, I suppose.

**You:** Then the page opens with the sim-to-real number instead, in your words. Nothing invented, the line moves up.

The fix cost no new writing. It almost never does. The true sentence is usually already in the draft, one row below the abstraction it is propping up.

## The push, which arrives here almost every time

**Them:** Can you just build a first version and we iterate on it?

**You:** Ten more minutes and the first version is one we keep. Building now gets us the site every generated portfolio already is, and then we argue with it instead of writing it. Pick a register: institutional, academic, editorial, or playful.

**Them:** Academic, but not dusty.

One question, no negotiation, no apology, no explanation of the playbook. The build did not start.

## Step 3: Lock the look

**You:** Before any colour. Name a thing, not a colour. What object or place has the colour this site should have?

**Them:** The lab, I suppose. The rig is anodised aluminium, everything is that grey-green, and the emergency stop is a really specific orange-red.

That answer is the palette. Nothing in it came from a hex picker, and none of it is where an agent lands on its own.

Built `brand.html` with three variants on their real bio text: one on aluminium light, one on rig green at mid-tone, one warm dark. Different ground mode, different accent family, different place for the personality. They picked the first.

Locked: `#E9E6E1` ground, `#DFDBD5` surface, `#1F1A18` text, `#6B605C` muted, `#A8371A` accent, `#F7F3F0` on-accent. The neutrals are warm because the accent is, not grey. Every pair checked before they saw it: 13.8, 4.9, 12.5, 5.2, and 5.9 on the button label.

The sentence that goes in the brief with them: **anodised aluminium, warm graphite, and the orange on the emergency stop.**

Display face for headings only, system stack for body, three sizes at 3.25rem / 1.25rem / 1rem. Focus ring drawn in the accent at 2px. Accent budget: the primary action, links in body copy, the focus ring, and the trace in the hero. Four places.

State rule: every link, button, and card transitions on hover and focus, 160ms, one easing curve, transform and opacity only.

Signature element, specified in five parts rather than named in one:

- **What:** the quadruped's gait plotted as an SVG, drawn from their real logged data.
- **Where:** the hero, right of the name.
- **Does:** the trace draws itself once on load, 1.8s, then holds.
- **At 375px:** moves below the hero line, half height, same trace.
- **Reduced motion:** the completed trace, rendered instantly. Checked first, because it is the version that gets screenshotted.

That single element carries the personality. Everything else stays quiet.

> **✓ LOCKED · 3/8 LOOK** · aluminium, warm graphite, e-stop orange · #E9E6E1 / #DFDBD5 / #1F1A18 / #6B605C / #A8371A · 3 sizes · gait trace in hero

## Step 4: The brief

Brief written and frozen. Copy final, tokens verbatim, signature element specified, motion rule explicit, budget set, non-goals explicit, acceptance criteria testable.

Saved as `BRIEF.md` and `BRAND.md` in their repo.

**The question, asked rather than assumed:** the brief is frozen and saved. I can build it here, or you hand those two files to a coding agent yourself. Which?

They said build it here. A fresh sub-agent got the two files and nothing else, on the argument that a clean context building from a brief beats a long one building from a recollection of what was decided forty messages ago.

## What went wrong later, and how it got handled

The build shipped an 8 MB hero. Lighthouse mobile came back at 51. The fix was not a new prompt, it was one constraint the brief had left out: hero media under 1.5 MB with a poster fallback. That constraint now lives in `references/performance-and-access.md` and goes into every brief.

It also replaced the gait trace with a stock lab photo, which is the other thing that happens to a signature element, and it happens whether the builder is another agent or you. Caught at step 6 by reading the brief's five-part spec against the page. The reason it was catchable is that the spec existed. "A cool hero animation" is not something you can hold anyone to.

The first build came back in under two minutes and looked finished in a screenshot. It had no hover states, a "See the data" button with no destination, and a 404 that was the word 404 on the background colour. None of that is visible in a screenshot, which is why step 5 asks for the six things by name before anyone discusses how it looks. The build was not fast. It was unfinished in the places nobody photographs.
