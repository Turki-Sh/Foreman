# Vibe-coded tells

Read this at step 3, when the direction is being chosen, and again at step 6, when you are looking at what the coding agent actually built.

A vibe-coded page is not a badly built page. It usually builds clean, scores fine, and ships. What it lacks is a decision. Every element on it is the default that arrived with the framework, the component library, or the model, and the visitor recognises the whole assembly instantly without being able to name a single part of it.

**The test, for every item below: was it chosen?** Any one of these is legitimate when the owner picked it for a reason they can say out loud. The tell is not the pattern. The tell is the pattern arriving unrequested, in a stack with fifteen others that also arrived unrequested.

## The page everyone ships

You will recognise this in one screenshot, because it is roughly forty percent of what has been generated in the last two years:

A small pill badge at the top of the hero, often with a sparkle. A two-line headline with one word in a violet-to-blue gradient. A one-line subhead that restates the headline in longer words. Two buttons, a filled primary and a ghost "Learn more". Below that, a blurred purple orb, or a browser mockup floating at a slight angle. Then a logo row in grayscale. Then three cards with a Lucide icon, a three-word title, and two lines of body. Then a stats band. Then testimonials. Then an FAQ. Then a footer with four columns, three of which link to pages that do not exist.

If the page being built has that skeleton, the skeleton came from the model, not from the brief.

## Layout

- **Everything is a card.** Rounded rectangle, one-pixel border, `shadow-lg`, on content that has no reason to be boxed. Cards nested inside cards is the advanced form.
- **Everything centred, everything symmetrical.** Centred nav, centred hero, centred sections, centred footer, nothing ever breaking the column. Symmetry is a choice roughly one page in ten should make, and it is what nine of them ship.
- **The three-up feature grid**, repeated down the page at the same size, which says every one of those nine things matters exactly as much as the other eight. Nothing on a real page matters equally.
- **Bento grids applied to content with no size hierarchy.** A bento layout is a claim about importance. If all the tiles hold comparable things, it is a grid wearing a costume.
- **Every section is the same section.** Eyebrow label, heading, one-line subhead, a row of things, alternating background colour. Five times. The alternating background is doing the work that spacing and type should be doing.
- **One centred column, one max width, top to bottom.** See the unfinished page in `design-direction.md`.

## Colour and surface

- **The default indigo.** `#6366F1`, `#8B5CF6`, `#7C3AED`, `#3B82F6`, and the violet-to-blue gradient between them. Framework defaults, recognised on sight. The full list, and the workflow that stops you arriving there, is in `palette.md`.
- **Gradient text on the headline**, especially on one word. Covered in `design-direction.md` as its own failure.
- **A generated backdrop.** A moody abstract image made to fill a slot, because the page needed something behind it and nobody had a photograph. It is the same failure as the stock hero, arriving by a longer route, and it looks like it.
- **Blurred orbs and mesh blobs** behind the hero, at low opacity, in the accent colour. They are there because the background was empty and nobody decided what should fill it.
- **Glassmorphism everywhere**: `backdrop-blur` plus a white ten-percent border, applied to nav, cards, and modals alike, whether or not anything is behind them to blur.
- **Shadows with no light source.** Every element lit from directly above at the same intensity, including elements sitting on top of other shadowed elements.
- **No colour budget.** Four or five saturated hues competing, none of them subordinate, often neon on a dark ground. A palette is a ranking: one accent, one surface, one text, and a rule for when the accent is allowed to appear. Colour used as energy rather than as structure is colour nobody assigned a job.
- **Multicoloured accent bars.** A different coloured stripe down the side of each card, or a row of tabs each in its own hue, encoding nothing. If the colours do not map to categories the reader can name, they are stickers.
- **Dark mode as an inversion.** Grey text on grey surfaces, contrast never re-decided, the accent unchanged from the light theme where it was already the weakest colour. Dark mode also hides weak structure, which is why generated pages default to it.

## Type

- **One weight relationship.** Bold headings, regular body, nothing else, at sizes that step by 1.2x so nothing dominates.
- **`tracking-tight` on everything** as a substitute for choosing a face.
- **The system default face at every size.** Inter and Geist are good faces and are also what the page ships with when nobody chose.
- **Headlines that do not scale between breakpoints,** so the phone gets the desktop hierarchy squeezed.

## Copy

- **SaaS vocabulary with no referent:** effortless, seamless, unlock, supercharge, transform your workflow, powered by AI.
- **Three-word value props.** "Fast. Simple. Secure." Every product claims all three and none of them is a claim.
- **Confident and unfalsifiable.** Read any sentence and ask what would have to be true for it to be false. If nothing, it is filler.
- **Fabricated evidence**, which is the worst of these and the most common: "trusted by 10,000+ teams" with a grayscale logo row, testimonials from people who do not exist with generated avatars, a stats band reading 99.9% and 10x, a pricing table for a product that cannot take money. This is not a design problem. Shipping it attached to their real name is a reputational one, and you refuse it outright rather than styling it better.
- **Features named after the implementation.** "Real-time sync engine" tells the reader what the code does. They wanted to know what they get.
- **An FAQ answering questions nobody asked**, which exists to fill vertical space.
- **Em dashes.** The single most reliable punctuation tell, and the one a reader registers without knowing why. Banned outright by rule 5 in `SKILL.md`, in the copy and in your own messages alike.
- **Emoji as section icons.**
- **The page explaining itself,** covered in `content-interview.md`.

## Motion

- **The page arrives all at once and then sits there.** No entrance at all, nothing staggered, no order to how it appeared. This is not restraint, it is the absence of a decision about time, and it is the most common thing separating a made page from a generated one. See `composition-and-choreography.md`.
- **Every section fades up on scroll**, same duration, same easing, same stagger, whether or not the section is worth arriving at.
- **`scale(1.05)` on hover**, on every card, universally.
- **The animated gradient border.**
- **Marquee logo scrollers**, counters that count up on entry, typewriter effects in the hero, confetti, cursor-following glows.

Each of these fails the delete test in `design-direction.md`: remove it and nothing is lost. Compare with the state transitions in the same file, which are not decoration and whose absence is felt immediately.

## Affordances that lie

Separate from the dead button, and more damaging, because the visitor does not find out by clicking.

- **Status dots that never change.** A green dot next to something with no live state behind it. The dot is a promise that the page is reporting on something, and it is not.
- **Cards styled to be clickable that are not.** Hover lift, cursor pointer, chevron in the corner, and nothing happens. A page that raises a card under the cursor has said the card does something.
- **Metrics and dashboards as decoration.** A chart with invented data, a progress ring at 78 percent of nothing, a sparkline with no series. Same class as the fabricated testimonial, and it belongs in the same bin.
- **Toggles, filters, and tabs wired to nothing**, or wired to a single state.
- **Emoji standing in for an icon system.** A different emoji beside each nav item is not a set. It has no weight, no size relationship, no shared stroke, and it renders differently on every platform the visitor might use.

The shared property is a component carrying an implication it does not honour. Every one of these is a decision skipped rather than a decision made, and the reader's model of the page breaks the moment they test one.

## What is missing, which is the loudest tell

The strongest signal is not on the page. It is what the page has no version of, because generated work is designed against ideal data and the happy path only.

- **No empty state.** What the page looks like with zero projects, zero results, zero items.
- **No error state.** What the form does when it fails, what the page does when the fetch does not return.
- **No loading state**, or a spinner where a skeleton belongs.
- **No 404.** Covered in `metadata-and-404.md`.
- **Buttons that do nothing.** Nav links pointing at `#`, a newsletter input with no backend, a "Get started" that scrolls back to the hero. Click every one at step 6.
- **Content that never varies in length.** Every card is exactly two lines because the copy was written to fit the card. Real content is ragged, and a layout that only works on tidy content is not finished.
- **No focus states**, and often `outline: none` with nothing put back.
- **Nothing considered at 375px** beyond the columns collapsing to one.

## Source-level tells

You are reviewing the coding agent's output, so you can look rather than guess:

- Component library defaults untouched: the shipped radius, the shipped shadow, the shipped palette, the shipped spacing scale.
- A full icon set imported for four icons, every icon at the default size and the default stroke width. See the icon section in `design-direction.md` for what to do instead.
- An animation library added for effects that are two CSS transitions.
- Class strings carrying framework palette names (`indigo-600`, `slate-800`) rather than the locked tokens from step 3. This one is worth a direct search, because it is proof the tokens were not used, and it is the most common way a locked palette silently does not ship.
- A design system pasted in whole. Another company's hex values, radius scale, and easing curve arriving together, unmodified, is the same failure as the framework defaults, with a more respectable source. See `reference-library.md`.
- Placeholder content still in the tree: lorem, `example.com`, an unnamed avatar, a `TODO` in a section that shipped.

## How to use this list

At step 3, it is a rejection list. If the direction being assembled contains six of these, stop and go back to the brand harness, because what is being built is the average of the internet with their name on it.

At step 6, walk it as a checklist against the real page, and be specific in what you send back. "This looks vibe coded" is unactionable. "The three feature cards are the framework defaults, the tokens from the brief are not in the CSS, and the primary button does nothing" is three fixes.

One thread runs through the whole list. Every item is a pattern applied without reference to what this specific page is for. That is why they appear on a law firm, a synth plugin, and a PhD portfolio unchanged, and it is why they are recognisable in a screenshot at a hundred pixels wide.

And keep the test in place the whole way. Some of these are the right answer. A dark page with one accent is a legitimate direction. A gradient can be beautiful when someone chose the two colours. The failure is the unrequested pattern arriving in a stack of fifteen others, none of which anyone decided.
