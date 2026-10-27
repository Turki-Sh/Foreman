# Standards (step 3, and notes for the punch list)

Design has a body of craft with names: colour theory, proportion, the scale of type, the length of a line, spacing systems, how the eye groups things, how motion reads, the corrections type designers make by eye. This file is that craft, written as standards rather than rules.

**A rule is a floor.** The rules are in `SKILL.md` and in the accessibility floor of `performance-and-access.md`, and a page that breaks one is broken.

**A standard is a default with a reason.** Each one below says what it is, the value most good work lands near, and when departing from it is the better decision. Depart from any of them on purpose and write the reason in `BRAND.md`: "hero at 3.2x the body rather than the scale's next step, because the opening line is four words." What fails is drifting from a standard without noticing. Departing from one by decision is design.

None of them outranks the owner, and none outranks the material their palette came from. The punch list reports them as notes, never as defects.

## Colour

**Value before hue.** Whether two colours can be told apart is mostly a question of light and dark, not of hue. Put the palette in greyscale, or squint at the page. If the ground, the text, and the accent collapse into two tones, the palette has a value problem that no change of hue fixes.

**Name the harmony.** Every palette that works is one of a few relationships, and choosing it by name is how it stops being an accident:

| Harmony | Built from | Reads as |
|---|---|---|
| Monochrome | One hue at several values | Calm, unified, can go flat without a strong value range |
| Analogous | Neighbours on the wheel | Natural, warm or cool as a whole, low tension |
| Complementary | Opposites | Energy and tension. The accent pops because it opposes the ground |
| Split complementary | One hue, the two neighbours of its opposite | Contrast with less strain than a pure complement |
| Triadic | Three evenly spaced | Lively, and easily cartoonish at high saturation |

**Proportion.** One colour dominates, one supports, one is rare: the interior designers' 60, 30, 10 is a fair starting split. It is the same idea as the accent budget in `palette.md`. An accent above about a tenth of the page stops being an accent.

**Colours change with their neighbours.** The same grey looks warm next to blue and cool next to orange. Josef Albers built a whole course on this (*Interaction of Color*, 1963), and it is why a palette is judged in the harness on real content, never as a row of swatches.

**Temperature.** Warm hues tend to come forward and cool ones to sit back. It is a painters' convention more than a law, and it is useful for depth: a warm accent on a cool ground reads as the nearest thing on the page.

**Saturated colours look brighter than they measure.** A vivid accent can pass the contrast math and still feel louder than its neighbours. Judge saturated pairs by eye as well as by ratio.

**Work in OKLCH when you build tints and ramps.** Its lightness channel tracks how bright a colour looks, so ten steps of a ramp look like ten even steps, and a yellow and a blue at the same lightness really do look equally light. HSL does neither. Tinted neutrals are the accent's hue at very low chroma in OKLCH, which is the workflow in `palette.md` with a reliable unit.

**Dark grounds need their own decisions.** Light text on dark reads thinner than the same weight on white, because bright strokes bleed into the dark around them. Give light-on-dark body text a little more weight or size, and avoid pure white on pure black for long reading.

**Contrast.** The floor is WCAG 2.2: 4.5:1 for body text, 3:1 for large text (about 24px, or 19px bold) and for interface parts and meaningful graphics. That is a rule, not a standard. As a second opinion on dark themes and thin type, APCA, the newer method from the WCAG 3 drafts, accounts for polarity and size; check its tables rather than one number. Colour never carries meaning on its own: a state shown in red is also shown in words or shape.

## Proportion and the golden ratio

**The golden ratio is real mathematics and weak aesthetics.** φ is about 1.618, and its mathematical properties are true. The claims that it governs the Parthenon, the human face, and what everyone finds beautiful are mostly unsupported. Markowsky (1992) found people neither preferred golden rectangles nor could pick them out, and Stieger and Swami (2015) found no automatic preference for it in art. Use φ as one good ratio among several, chosen because it suits this page. "It is the golden ratio" is not a reason.

**What a ratio is actually for is repetition.** One ratio governing the type scale, the spacing steps, and the main column split makes the relationships on a page repeat, and repetition is what reads as considered. Which ratio matters much less than using one.

| Ratio | Name (from the modular scale tradition) | Suits |
|---|---|---|
| 1.125 | Major second | Dense interfaces, documentation, many sizes close together |
| 1.2 | Minor third | Product pages, long reading |
| 1.25 | Major third | A sound default for most sites |
| 1.333 | Perfect fourth | Editorial, clear steps |
| 1.414 | Augmented fourth, the square root of two | Paper-like pages; A-series paper keeps this ratio when halved |
| 1.5 | Perfect fifth | Few sizes, strong steps |
| 1.618 | Golden | Posters, heroes, pages with three sizes and big jumps |

**Rectangles from one family.** Images, cards, and media frames read as a set when their ratios belong together: 3:2 and 4:3, or 16:9 throughout, or the square root of two. Five unrelated ratios on one page read as five sources.

**Place off the centre on purpose.** The photographers' rule of thirds puts the subject on a third rather than in the middle, which creates the tension a centred layout lacks. The centre is a valid choice for symmetry, and it should be a choice.

**Columns.** Twelve divides into two, three, four, and six, which is why grids use it. Text beside an artifact often reads better on an uneven split, five and seven, or one to φ, than on halves.

## Type

**Three sizes with real distance between them** (from `design-direction.md`), set from one named ratio, with the hero chosen against the length of the opening line.

**Measure.** Body text reads best at about 45 to 75 characters a line, with 66 often cited as ideal (Robert Bringhurst, *The Elements of Typographic Style*). In CSS, a `max-width` around 60 to 70ch usually lands there, because a `ch` is the width of a zero and most letters are narrower. Check with their real paragraph. On a phone, 30 to 40 characters is fine.

**Leading.** Body text near 1.4 to 1.6 times its size, more for longer lines, a little more for light text on dark. Display type much tighter, near 1.0 to 1.15, because large lines with body leading fall apart.

**Tracking.** Tighten display sizes, roughly -0.02 to -0.04em. Loosen capitals and small labels, roughly +0.05 to +0.12em, because capitals were drawn to sit beside lowercase. Leave body text alone.

**Pairing.** Pair for contrast in structure, a serif with a sans, or one family in two weights, never two faces that are almost the same. Match their x-heights so they sit on one line comfortably.

**Small things that read as set rather than typed.** Tabular figures in tables and prices (`font-variant-numeric: tabular-nums`). Balanced headings (`text-wrap: balance`) so a heading never ends on one word. Real quotation marks and apostrophes. The optical size axis, where the face has one.

## Space

**One base unit.** Four or eight pixels, and every gap a step on one scale that grows as it goes: 4, 8, 12, 16, 24, 32, 48, 64, 96. Random values like 13 and 27 are the clearest sign that nobody decided the spacing.

**Space says what belongs together.** The gap inside a group is smaller than the gap between groups, reliably, everywhere on the page. When that holds, most borders, dividers, and cards become unnecessary, which is the cheapest way to make a page look designed.

**One gutter pair** for everything that touches the edge, from `composition-and-choreography.md`.

## How the eye groups things

The gestalt principles, which do the work borders and boxes are usually asked to do:

- **Proximity.** Near things belong together. The first tool, before any line or box.
- **Similarity.** Things that look alike are read as the same kind. Make links look like links everywhere, and nothing else look like them.
- **Common region.** A shared background groups things. This is what a card is, so use it only when the group needs a boundary.
- **Continuity and alignment.** The eye follows edges. One strong vertical line that many elements sit on organises a page more than any grid overlay.
- **Figure and ground.** One thing reads as in front. If two things compete to be the figure, neither is.
- **Common fate.** Things that move together belong together, which is why a stagger groups and random timing scatters.

## Hierarchy and attention

**One thing first, per screen.** Rank is made with size, weight, colour, position, and space around. Two of them are enough to make something first. Using all five on several elements makes nothing first.

**The greyscale test and the squint test** show the hierarchy without the decoration. What is still first when blurred is what is actually first.

**Fewer choices, faster decisions.** The time to choose grows with the number of options (Hick's law). One primary action per screen is this standard applied.

**Big and near is easy to hit.** The time to reach a target grows with distance and shrinks with size (Fitts's law). Targets at least 24 by 24 pixels is the WCAG 2.2 AA floor, and around 44 is comfortable on a phone.

## Motion

**Timing.** About 100ms reads as instant, which is Jakob Nielsen's long-standing response-time limit. State changes sit near 120 to 200ms. Larger things and longer travel take longer, around 200 to 400ms. An entrance sequence ends inside about 2.5 seconds. Exits run faster than entrances, because nobody is waiting to watch something leave.

**Easing.** Entrances decelerate into place (an ease-out), exits accelerate away (an ease-in), and movement across the screen eases both ends. Linear motion is for continuous things only: a progress bar, a rotation. Two curves for the whole site, one for entrances and one for interactions.

**Borrowed from animation.** Disney's animators wrote down principles that still hold for interfaces (Frank Thomas and Ollie Johnston, *The Illusion of Life*, 1981). Three of them transfer directly: staging, one thing moving at a time so the eye knows where to look; overlap, a stagger of roughly 30 to 60ms between related elements instead of a block arriving at once; and slow in and slow out, which is easing.

**Only transform and opacity**, so nothing reflows. Distance and duration grow together: a small move with a long duration feels sluggish, a long move with a short one feels like a jump.

**Reduced motion is the resting frame**, from `design-direction.md`.

## Optical correction

Geometry and perception disagree, and good work sides with perception:

- **Round and pointed shapes overshoot.** Type designers draw an O and an A slightly past the baseline and cap height, or they look small. Icons in one set are balanced by visual weight, not by bounding box.
- **The visual centre sits slightly above the geometric one.** Text centred exactly in a button or a frame often looks low and needs a nudge up.
- **A play triangle centred by its box looks off.** Centre it by its mass, slightly right.
- **Capitals and lowercase sit differently in the same padding.** Pad buttons by eye against their real label.

## Writing it down

A standard becomes a decision when it is a value in `BRAND.md`:

```
Type scale      major third, 1.25: 1 / 1.25 / 1.56 / 1.95rem
Measure         66ch body, 34ch on phones
Spacing         8px base: 8 16 24 32 48 64 96
Harmony         complementary: blueprint blue ground family, amber accent
Departures      hero at 3.05rem, two steps past the top of the scale,
                because the opening line is four words
```

## Sources

- Robert Bringhurst, *The Elements of Typographic Style*, on measure and leading.
- Josef Albers, *Interaction of Color* (1963), on colours changing with their neighbours.
- George Markowsky, "Misconceptions about the Golden Ratio", *The College Mathematical Journal* 23 (1992).
- Stefan Stieger and Viren Swami, "Time to let go? No automatic aesthetic preference for the golden ratio in art pictures", *Psychology of Aesthetics, Creativity, and the Arts* (2015).
- W3C, *Web Content Accessibility Guidelines 2.2*: 1.4.1, 1.4.3, 1.4.11, 2.5.8.
- Jakob Nielsen, *Usability Engineering* (1993), on response-time limits.
- Frank Thomas and Ollie Johnston, *The Illusion of Life: Disney Animation* (1981).
- W3C, *CSS Color Module Level 4*, for OKLCH.
