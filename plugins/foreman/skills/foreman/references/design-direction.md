# Design direction (step 3)

The purpose of this step is to convert forty small design decisions the coding agent would make silently into one decision the owner makes deliberately.

## Run the brand harness

Generate a single throwaway file, `brand.html`, that is not part of the real project. Start from `assets/brand-harness.html` and fill it with their content. It renders in one view:

1. The candidate type pairing, set with their actual name and their actual bio paragraph. Never lorem ipsum, because type decisions made on fake text collapse on real text.
2. The palette as labeled tokens with hex values: background, surface, text, muted text, accent. Assembled in context, not as isolated swatches.
3. One button, one card, one nav bar built from those tokens, each with its hover and focus state visible.
4. Their logo at real size in the mock nav. An SVG wordmark or monogram is plenty for v1.

Produce two or three full variants in the same file so they compare side by side rather than judging one option in isolation. Make them pick one. The winning values go into the build brief verbatim, as locked tokens the coding agent may not substitute.

## Two failures, opposite directions

A site can miss in two ways here, and the second one is now the more common.

**Generated.** The statistical mean of everything on the internet, with effects scattered over it.

**Unfinished.** Nothing wrong with it and nothing alive in it.

Both look like a decision from a distance. Neither is one. Refuse each explicitly, below.

## Refuse the defaults

AI-generated design currently clusters around three looks:

- Cream background near `#F4F1EA`, high-contrast serif display, terracotta or warm-clay accent.
- Near-black background with a single acid green or vermilion accent.
- Broadsheet layout: hairline rules, zero border radius, dense newspaper columns.

Any of these is legitimate **if the owner chose it**. If you produced one without being asked, you handed them the statistical mean instead of a decision. Redo it.

Same test for structure. Numbered markers (01 / 02 / 03), eyebrow labels, and section dividers should encode something true about the content. If the content is not actually a sequence, numbering it is decoration pretending to be information.

## Refuse the unfinished page

The other failure is quiet. No carousel, no gradients, nothing you could point at, and no life either. A stack of centred sections at one type size, uniform padding top to bottom, links that do nothing when the cursor reaches them. That page is not minimal. Minimal is a decision with everything unnecessary removed. This is a page where no decision was made at all.

Simple is not the problem. Unresolved is the problem, and in a screenshot the two are identical.

Before the tokens leave this step, the design answers yes to all five:

- **Type does real work.** Three sizes with visible distance between them. A hero around 2.5x the body, not 1.2x. If every size sits within a few pixels of the others there is no hierarchy, only text.
- **The page has a rhythm.** Sections do not all get the same padding and the same height. Something is tight, something is generous, and the difference means something.
- **One thing breaks the column.** A full-bleed element, an asymmetric split, an overlap, type that runs to the edge. A single centred column from top to bottom is the shape of a document, not a site.
- **The small scale is detailed.** Focus ring drawn in the accent rather than the browser default, a considered underline offset on links, a `::selection` colour, a real favicon, a real OG image. Nobody names these and everybody feels them.
- **Everything interactive responds.** Link, button, card, nav item: each has a hover state, a focus state, and a transition between them. This is the cheapest life on a page and its absence is most of why a finished site still feels dead.

Anything failing becomes a token or a spec in the brief, not a note for later.

## Motion: state, signature, nothing else

"No animation" as a blanket non-goal is how a site ends up feeling like a PDF. "Animate everything on scroll" is how it ends up feeling generated. Motion sorts into three buckets and two of them ship.

**State changes. Always.** Hover, focus, active, open, closed, loading. Roughly 120 to 200ms, one easing curve reused everywhere, transform and opacity only so nothing reflows. This is not decoration, it is the page telling the visitor it heard them. It is never a non-goal, and it belongs in the brief as a rule rather than as a hope.

**The signature. Once.** The one orchestrated moment, tied to their actual subject. It happens in a single place and it can be described in a sentence: what moves, what starts it, how long it takes, what it does on the second visit.

**Decoration. Never.** Every section fading in on scroll, numbers counting up, parallax, carousels, text that types itself, a shimmer on something that is not loading. They share one property: remove them and nothing is lost. That is the test, and it is the same delete test the copy gets.

Reduced motion is not a lesser variant of the page. It is the same page with transitions at zero and the signature at its resting frame. Design the resting frame first and confirm it looks finished standing still, because it is what a real share of visitors get, and it is every screenshot anyone ever takes of their site.

## Spend boldness in one place

Help them name one signature element the page is remembered by: a hero treatment, a type move, a single orchestrated animation, an interactive artifact from their own domain. Then keep everything around it quiet and disciplined.

Name it, then specify it, because an unspecified signature element is the first thing a coding agent downgrades to a static image. The brief needs all five: what it is, where it lives, what it does, what happens at 375px, and what the resting frame is under reduced motion.

Scattered effects read as generated. One deliberate move reads as designed. Complexity has to match the direction: maximalist needs elaborate execution, minimal needs precision in spacing and type detail. Elegance is executing the chosen direction well, not adding more.

The subject's own world is where distinctive choices come from. A robotics researcher, a poet, and a payments startup should not arrive at the same page.

## Offer the reference step, once

Most people have no references and will not go looking unless you hand them somewhere to look. Offer it in one message, with the skip attached, before the harness:

> Optional, ten minutes: browse a few of these and send me two or three pages you like and one you hate. It changes the harness a lot. Or skip it and I will bring you three directions to choose from.

`references/reference-library.md` holds the places to send them, sorted by what each is good for: galleries, product and interface, motion, type, colour, and the non-web sources that produce the least derivative results. Send three or four rows that match what is being built, never the whole file, because a list of forty links is a way of not choosing.

If they skip, run the harness on your own read of the register word and move. Never ask twice.

## References are reading, not templates

If they arrive with references already, or come back from the list above, take the same two: what they like, and one thing they hate. The dislike is frequently the more useful of the two, because it is specific and unguarded.

Then extract named principles and carry those forward:

- "The hero is one sentence and one link, no graphic."
- "Only three type sizes on the entire page."
- "Sections are separated by space, never by borders."
- "Nothing moves until you touch it, then everything answers."

Never carry the URL forward as something to approximate. Similar means derivative, and a derivative of someone else's identity with their name on it is worse than something plain and theirs. If output starts mirroring one reference, stop and name what is being copied.

## Icons, if there are any

The default set at the default size and the default stroke width is one of the clearest vibe-coded tells, and it is also the easiest to fix, because it is one decision.

Start by asking whether the page needs icons at all. Most personal sites need three: GitHub, email, and one social link. That is not an icon system, it is three glyphs, and `Simple Icons` covers brand marks specifically without pulling in a general set.

If the page does need a set, pick one whose voice matches the register rather than the one the framework shipped with:

| Set | Voice |
|---|---|
| Phosphor | Six weights including duotone and fill. The most adaptable, so the first place to look when a register is unusual. |
| Radix Icons | 15px, tight, geometric. Small interface work next to a modern sans. |
| Tabler | Very large, consistent, good coverage of niche glyphs. |
| Iconoir | Distinctive line set with a hand in it, so it does not read as stock. |
| Material Symbols | Variable axes for fill, weight, grade, and optical size, with enormous coverage. Reads institutional, which is sometimes exactly right. |
| Bootstrap Icons | Plain and unfashionable in a way that ages well. |
| Remix Icon | Neutral, line and fill in one family. |
| Lucide, Heroicons | Good sets, and the two most likely to have arrived by default. Usable, but change the size and stroke deliberately, and check that the choice survives being noticed. |
| Simple Icons | Brand and social marks only, which is what most of these sites actually need. |
| Nucleo, Streamline | Paid, and worth it when they want something nobody else is using. |

Then set the rules once and put them in the brief, because a set with no rules produces the same mess as no set:

- One family. Never two, and never a family plus emoji.
- One stroke width and one or two sizes, expressed as tokens, chosen to sit with the body text rather than the heading.
- Icons do not carry meaning alone. Every icon that means something has a label next to it.
- Decorative icons get `aria-hidden="true"` and nothing else.
- Import the individual glyphs used, not the set.

The best case, as everywhere else in this step, comes from their own subject: a drawn mark, a diagram, a shape from the work itself. One of those beats any set on this list.

## Copy is design material

If they have written weak copy, edit it with them rather than replacing it. Plain verbs, sentence case, no filler. Specific beats clever. Name things by what the reader recognizes, not by how the system is built. A label labels, an example demonstrates, and nothing quietly does double duty.

## Gate

Do not advance until you have: exact hex values for every token, exact font names, a type scale of about three sizes with real distance between them, one signature element specified in the five parts above, and a state-transition rule that applies to every interactive element.
