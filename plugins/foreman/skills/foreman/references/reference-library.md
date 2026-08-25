# Reference library

Where to send them at step 3, and where to look yourself. Everything here is a starting point rather than an endorsement, and any of it can be dead or changed by the time you read this. Check what you hand over.

## The offer

Make it once, with the skip attached, before the brand harness:

> Optional, ten minutes: browse a few of these and send me two or three pages you like and one you hate. It changes the harness a lot. Or skip it and I will bring you three directions to choose from.

If they skip, run the harness on your own read of the register word and move. Never ask twice, and never send the whole file. Pick the three or four rows that match what they are building, because a list of forty links is a way of not choosing.

The one they hate is not a throwaway. It is usually the most specific thing they will say all session.

## Start here if they only open three

| Where | Useful for |
|---|---|
| typewolf.com | Type pairings in the wild with the faces named. The single most useful stop at this step. |
| siteinspire.com | Filterable by style and by site type, so you can ask for exactly the category being built. |
| godly.website | Curated and current. Good for seeing where the ceiling is this year. |

## Galleries, by what they are good for

| Where | Useful for |
|---|---|
| land-book.com | Landing and product pages. The stop for anything commercial. |
| onepagelove.com | Single-page sites, which is what most of these builds actually are. |
| minimal.gallery | Restraint executed well, which is the antidote to the plain page rather than an example of it. |
| httpster.net | Rougher, more personality, much less SaaS. |
| brutalistwebsites.com | Any register that is not corporate. |
| awwwards.com | Large-scale ambition. Take a principle, never the scope, and never the load time. |
| thefwa.com | Experimental and interactive work. Same warning, doubled. |
| hoverstat.es | Art, culture, and editorial web. The best source for a site that is not selling anything. |
| lapa.ninja | Landing pages, heavily categorised. |
| bestwebsite.gallery | Broad and long-running, good for volume. |
| maxibestof.one | Curated personal portfolios, so the closest match for the common case. |
| bestfolios.com | Portfolios and CVs specifically, including the layouts that get people hired. |
| behance.net | Full case studies rather than shots, which makes it far more useful than Dribbble for depth. |
| dribbble.com | Palette and composition ideas. Handle with care: a shot is a picture of a page, with no content, no states, no mobile, and no obligation to work. |

## Product and interface

For anything with a real interface behind the page rather than a page alone.

| Where | Useful for |
|---|---|
| mobbin.com | App and web UI patterns, screen by screen, searchable by flow. |
| refero.design | Real product UI reference, organised by pattern and by company. |
| pageflows.com | Recorded user flows, so you see the sequence rather than the screen. |
| screenlane.com | Ongoing UI updates from shipped products. |
| ui.land, godly.website | Both carry interface work alongside marketing pages. |

## Motion

The category most likely to be missing, and the one that decides whether the page feels alive. Read `design-direction.md` on state, signature, and decoration before browsing any of it, or they will come back asking for the parallax.

| Where | Useful for |
|---|---|
| motionsites.ai | Sites collected specifically for their motion, which is the fastest way to show someone the difference between a state change and a decoration. |
| tympanus.net/codrops | Interaction and motion demos with the code attached, so what they pick is buildable. |
| animations.dev | The principles behind interface motion, including why most of it is too slow. |
| joshwcomeau.com | Long-form craft on transitions, easing, and the small details. |
| awwwards.com, thefwa.com | Where the ambitious motion lives, and where the scope trap lives with it. |

## Type

| Where | Useful for |
|---|---|
| typewolf.com | Pairings in use, with the faces named and the sites linked. |
| fontsinuse.com | Type in real context, searchable by industry and by format, including print. |
| fonts.google.com | Free, self-hostable, and where most of these builds will land. |
| fontshare.com | Free faces with more character than the Google defaults. |
| velvetyne.fr, collletttivo.it, open-foundry.com | Libre type with genuine personality, and the fastest way off Inter. |
| pangrampangram.com, klim.co.nz, grillitype.com, abcdinamo.com | Paid foundries. Worth a look even if they buy nothing, because it shows what a decided typeface looks like. |
| type-scale.com | Building the three-size scale, once the faces are chosen. |

## Colour

Palette generators produce generic palettes when used generically. These are the ones that show colour in context, which is the only way to judge it.

| Where | Useful for |
|---|---|
| realtimecolors.com | A live palette applied to a real layout. The best single tool at this step. |
| happyhues.co | Palettes shown in a designed page rather than as swatches, with each role explained. |
| huemint.com | Palettes generated for a given layout and contrast relationship. |
| coolors.co, colorhunt.co | Fast and popular, which means the output is also what everyone else has. Use for a starting hue, never for the final five. |
| color.adobe.com | Harmony rules and extraction from an image, including from something in their own world. |
| webaim.org/resources/contrastchecker | The accessibility floor from `performance-and-access.md`, checked before the tokens are locked rather than after. |

## Machine-readable design systems

A newer category, and the most dangerous thing in this file precisely because it is the most useful: a complete design system written as markdown for an agent to consume. `getdesign.md` is the current example, publishing analyses of well-known sites as a `DESIGN.md` you drop into a project and point the agent at.

A human reference gets looked at and half-remembered, which is a filter. A machine-readable one gets pasted, and then the build carries that company's hex values, radius, easing curve, and personality under your owner's name.

Use them for one thing: pulling out the principles that transfer. Their Tesla analysis is the worked case.

**What does not transfer.** The blue, the typeface, the 4px radius, the 0.33s curve, the full-bleed vehicle carousel. Those belong to a company with a photography budget and a fleet of cars to point a camera at. Copied onto a portfolio they read as a clone of a car company.

**What transfers, stated as principles:**

- One message per viewport. The reader can only see one thing at a time.
- Exactly one chromatic colour, reserved for the primary action, never used decoratively.
- Depth without shadows. Layering by z-index, opacity, and imagery instead.
- Two type weights only. No bold, no light, no drama.
- Letter-spacing left at normal, on the argument that a good face does not need manipulating.
- Whitespace as the luxury signal, never filled because it happens to be empty.
- The product carries the emotion and the interface gets out of the way.

Every one of those is a decision your owner can take or reject on its merits, and none of them makes their site look like that company's.

**Two tests.** If you cannot state what you took as a sentence about behaviour, you took the tokens. And check the principle against what they actually have: "the photography carries everything" is a great rule for a company with a studio, and an empty page for someone with three screenshots.

## Effects and components

For when the signature element is a treatment rather than a layout.

| Where | Useful for |
|---|---|
| 21st.dev | Community components and effects with the code attached, including the ASCII, dither, and halftone image treatments that turn a photograph into something built. |
| tympanus.net/codrops | The same territory, longer-form, with the technique explained rather than only shipped. |
| observablehq.com | Data-driven visuals, when the signature element comes out of their own numbers. |

Read the signature-element section in `design-direction.md` before browsing these. A treatment applied to their own image is one of the strongest moves available. The same treatment applied to a stock image is the average with an extra step.

## Not the web

Send them here too, and expect the best result from it. A museum's identity, a journal cover, a record sleeve, an airport sign system, the packaging of something on their desk, a book they own, a film title sequence, their own field's diagrams and instruments.

Nothing here can be copied directly, so only the principle survives the trip, which is exactly the point of `references are reading, not templates` in `design-direction.md`. A page built from a signage system will not look like any of the twenty sites above.

Archives work the same way. The Web Design Museum and the Internet Archive are useful when the register is deliberately not 2026.

## What comes back

Two or three likes, one hate, and a sentence on each if you can get it. Then extract named principles, put the principles in the brief, and leave the URLs out of it. A brief that names a reference site produces a derivative of that site with their name on it.
