# Composition and choreography (step 3)

## Why this file exists

A brief that stops at constraints has handed two things to the coding agent without noticing: where everything goes, and what happens in the first two seconds. Those are the two things a reader actually experiences, and an agent left to decide them alone decides the average: a centred column of full-width sections, everything arriving at once, nothing moving until you scroll.

Every constraint in `performance-and-access.md` can pass while the page still reads as generated, because a Lighthouse score has nothing to say about composition or about time.

## Resolution, not style

The prompts that reliably produce crafted pages share one property, and it is not their look. Most of them happen to be dark with a video ground, and that is an accident of where they came from. Copying it would install a new default, which is the failure this whole playbook exists to prevent.

What they actually share is **resolution**. Every value is decided and written down. Not "a nice entrance" but a sixteen-row delay table. Not "generous spacing" but a 20 and 35 pixel gutter declared by four separate elements through three different mechanisms, with a note that they must match exactly or the alignment visibly breaks.

**Copy the resolution. Never copy the values.** A page built on someone else's easing curve, gutter, and accent is a clone with a new name on it.

## What carries the page

Decide this before anything is placed, because everything else follows from it. Four answers, and a page has one:

- **Media.** Photography or video, full bleed, carrying the emotional weight so the interface can be almost nothing. Only available to someone who has real images. Adopting it without them produces an empty page with a stock photograph in it.
- **Type.** The words are the picture. Scale, measure, and restraint do the work. The cheapest of the four and the least forgiving, because there is nowhere for a spacing mistake to hide.
- **Structure.** Rules, grids, marks, an axis, deliberate asymmetry. The page reads as drawn.
- **An artifact.** One thing from their own subject: a plot from their data, an instrument, a diagram, a treatment of their own photograph. See the signature element in `design-direction.md`.

Whichever it is gets one line in `BRAND.md`. And when the answer is media at full bleed, say so completely: no scrim, no tint, no gradient, no blur, no blend mode over it. A dark gradient dropped over an image is the reflex that turns a photograph into a background.

## 1. The spacing backbone

Pick one gutter, two values, one for phones and one above. Then every element that touches the edge of the page uses it: the nav padding, the first character of the headline, the left edge of the footer, the edge of the widest section.

Different mechanisms are fine and often necessary, padding on one element and an absolute offset on another. Only the result matters: a vertical line down each side that everything lands on. When one element sits at 24px and its neighbour at 32px, nobody can name what is wrong and everybody sees it.

The pair goes in `BRAND.md`. It is the value most often left to the framework, and framework defaults do not agree with each other.

## 2. The layer stack

Name the layers back to front with their z-index before any of them exists: ground, structure, content, chrome, overlays. Three lines.

Pages otherwise acquire z-index by accident, one `z-50` at a time, and the first day something has to sit above something else the whole stack gets renegotiated in a hurry.

## 3. Composition, not a stack

The default shape is a centred column of full-width sections in the order every other page uses. It is not wrong. It is the one that gets chosen by nobody.

Three archetypes worth naming, and there are more:

- **The frame.** One viewport, nothing scrolls, everything placed. Copy in one corner, the artifact in another, and the diagonal between them is the composition. Demands that every element earn its place, because nothing can hide below the fold.
- **The column, decided.** Sections that scroll, where at least one thing breaks the container: a full-bleed element, an asymmetric split, an overlap, type that runs to the edge. Everything else stays quiet.
- **The document.** Deliberately plain. One measure, generous leading, no decoration. Legitimate, and only legitimate when chosen, because it is also what you get by giving up.

Whichever it is, write one sentence a stranger could draw from. "Copy top left, the gait trace bottom right, nothing centred." That sentence is worth more to the build than three paragraphs of adjectives.

Two decisions inside it that get made by default otherwise: whether the hero content is vertically centred or sits at the bottom of the frame, and whether the composition is symmetrical. Centred and symmetrical is the default of defaults.

## 4. The choreography

The largest single gap between a generated page and a made one, and it costs almost nothing.

A made page arrives in an order. Elements do not appear together; they arrive across roughly one to two and a half seconds in a sequence that means something. A generated page appears all at once and then sits there.

The table goes in `BRAND.md`, one row per element, in arrival order:

| Element | Motion | Duration | Delay |
|---|---|---|---|
| Wordmark | fade, rise 14px | 700ms | 100ms |
| Nav items 1 to 4 | fade | 550ms | 180 / 225 / 270 / 315ms |
| Headline | rise out of a mask | 1150ms | 300ms |
| The artifact | fade, rise | 1150ms | 660ms |
| Footer copy | fade, rise | 720ms | 980ms |

Rules for it:

- **Two easing curves for the whole site.** One for entrances, one for interactions, reused everywhere without exception. Two curves read as a system. Five read as five people.
- **The order is a claim about what matters.** Decide it rather than going top to bottom. One well-built example brings the labels in before the shapes they point at, so the reader is already looking at the right place when the shape lands.
- **Under 2.5 seconds, ending on the primary action.** Longer is a loading screen. The last thing to arrive is the thing you want them to do.
- **Nothing arrives on scroll.** Every section fading up as it enters the viewport is the decoration ruled out in `design-direction.md`. The choreography happens once, on load, and after that the page is a page.
- **The resting state is the finished state.** Every element ends at full opacity with no transform, and the page is complete if the animation never runs at all. Build that state first and let the entrance play from it, rather than starting at `opacity: 0` and hoping.
- **Reduced motion is the same page at its resting state**, arriving at once. Not a lesser version of it.

## 5. The interaction inventory

One table listing every interactive behaviour on the site, written before any of it is built:

| What | Trigger | Behaviour |
|---|---|---|
| Primary action | hover | lift 1px, opacity 0.92, 160ms |
| Primary action | focus | 2px accent ring, 3px offset |
| Nav item | hover | colour to full, underline at 0.25em offset |
| Card | hover | border to accent |

If a behaviour is not on the table it does not exist. If a control is not on the table it has no behaviour, which catches the dead-button failure from rule 7 before anything is built rather than after.

## 6. Specify behaviour as an algorithm

Anything that actually does something gets named constants and a per-frame description, never an adjective. "A subtle trail effect" produces something nobody wanted. The same thing given a head radius, a sample distance, a decay factor per frame, a point cap, and the shape of the mark produces what was meant.

Same rule as the five-part signature element spec in `design-direction.md`, extended to everything else on the page with behaviour in it.

## 7. Mark the tuned values

Some numbers in a build are arbitrary and some were arrived at. Say which. A coding agent tidying up will round 0.92 to 0.9 and 15.6px to 16px, and the page gets quietly worse in a way nobody can point at later.

Anything tuned goes into `BRAND.md` with the word exact beside it.

## 8. Declare the compromises you are keeping

Every real design has one: a treatment that misbehaves at a single width, a glyph that sits wrong, a fallback that is visibly a fallback. Write them down as known and accepted, so the next agent does not tidy them into something worse.

## Gate

Before this step closes, `BRAND.md` contains: what carries the page, the gutter pair, the layer stack, one sentence describing the composition, the choreography table, and the interaction inventory. Six decisions. None of them can be inferred from a palette, and all six are otherwise made by the coding agent on your behalf.
