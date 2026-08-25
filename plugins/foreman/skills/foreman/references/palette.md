# Choosing a palette (step 3)

This file exists because of one observed failure. Left to itself, an agent asked for a palette produces a near-black ground, grey neutrals, and a blue or violet accent, every time, for every subject, in every field. It will do this immediately after being told not to, because a rejection list narrows the space without ever pointing anywhere.

The fix is not more prohibitions. It is deriving the palette from something outside the model's prior instead of generating it from inside one.

Work in this order. Each step removes a degree of freedom the model would otherwise fill with its average.

## 1. Ground before hue

Decide what the page is made of before you decide what colour anything is. This one choice moves the result further than the accent does, and it is the one that gets skipped.

| Ground | Reads as | What it costs |
|---|---|---|
| Paper white, `#FCFCFA` to `#FFF` | Institutional, print, confident | Shows every spacing and alignment mistake, which is the point |
| Warm off-white | Editorial, human, a little older | One step from the cream default, so the warmth has to be deliberate |
| Cool off-white or light grey | Technical, product, safe | The framework default in light mode |
| Tinted light, a very low saturation wash of the accent hue | Designed, uncommon, cohesive | Contrast needs real care |
| Mid-tone, a real colour at 25 to 45 percent lightness | The rarest and the most distinctive | Hardest to get text contrast right, and unforgiving if the type is not confident |
| Warm dark, the `#14120E` family | Physical, cinematic, lit | Needs warm neutrals throughout or it turns muddy |
| Cool near-black, the `#0B0D10` family | Technical, current, default | This is where everything lands by itself |
| Saturated dark: deep green, oxblood, ink | Strong identity, memorable | One wrong accent and it reads as a casino |

**Dark is the most-chosen ground and the least-decided one.** It also hides weak structure, which is exactly why generated work defaults to it. If the answer is dark, get one sentence saying why that is not "it looks modern".

## 2. Name a material, not a colour

Do not ask which colours they like. Ask this:

> Name a thing, not a colour. What object, place, or printed thing has the colour this site should have?

Answers are specific and they carry a whole palette with them:

- A robotics researcher: anodised aluminium, machine-tool green, safety orange.
- A poet: foxed paper, iron gall ink, the red of a library date stamp.
- A payments company: intaglio banknote green, cheque-paper blue-grey, ledger red.
- A restaurant: the actual tiles on the actual wall, the actual awning.
- A climate lab: sea ice, tide charts, the orange of a survival suit.

None of those arrive at `#6366F1`. That is the entire mechanism.

## 2b. When they name a colour

"Make it blue" is the most common thing an owner says at this step, and it is a reasonable thing to say. It is also not an answer, because blue is a family with a thousand members and left alone you will hand them the framework's.

Ask the material question again, narrowed:

> Blue is a wide family. Blue of what? A blueprint, a gas flame, a Delft tile, ink on a bank note, the shadow on snow, a lab coat, deep water.

Then derive it from whichever they pick. Each of those is a different blue, none of them is `#3B82F6`, and every one of them arrives with a set of neutrals attached.

This applies to a correction as much as a first answer. "Swap the green for blue" mid-review is the same question, and it is the moment the palette most often collapses back to the default, because it feels like a small change being handled quickly.

## 3. Derive from something they already own

Better than a material name, when it exists: an image they have. Their work, their logo, a photograph of the place, the cover of a book they keep.

- Pull three to five hues out of it.
- Use exactly one as the accent and one as the ground family. Discard the rest. A palette made of everything in the photograph is a photograph, not a palette.
- Never sample a stock image or a generated one. That returns you to the average by a longer route.

## 4. Neutrals carry the accent

Pure grey text with one saturated accent is the generic recipe, and the eye reads the mismatch even when nobody can name it.

- Take the accent's hue, drop saturation to roughly 4 to 10 percent, and set lightness for contrast. Text, muted text, and borders all come from that one family, so the page belongs to itself.
- Ground and surface differ by lightness only, never by a hue shift. On a dark ground, surface sits 4 to 8 points of lightness above it. On a light ground, surface goes 2 to 5 points down.
- The colour of text sitting on the accent is its own token and its own decision. It is not automatically the background colour, and it is the pair that most often fails contrast.

## 5. Give the accent a budget

An accent used everywhere is not an accent, it is a theme.

Name every place it may appear before any CSS is written. A normal page is four: the primary action, links inside body text, the focus ring, and one detail in the signature element. A second accent is allowed only when it encodes something a reader could name, a category or a state, never for variety.

## 6. Three variants that differ on axes

Three shades of the same idea is one variant shown three times, and it is what you will produce unless the axes are set first. The three must differ on all of these:

| Axis | What must differ |
|---|---|
| Ground mode | Light, mid-tone, and dark, all three represented |
| Accent family | Three different hue families. Not three blues |
| Where the personality sits | Type, or colour, or layout. One each |
| Contrast strategy | High contrast, or close-toned with a single deliberate break |

If two variants can be described by the same sentence, they are the same variant.

## 7. Check contrast before you show them, not after

Run every pair before the variants are presented: text on ground, muted on ground, text on surface, accent on ground, and the label colour on the accent. A variant they fall in love with and then have to have corrected is worse than one that was right when they saw it.

The floor is in `performance-and-access.md`: 4.5:1 for body text, 3:1 for large text and interface elements.

## The list that needs a reason

None of the following is banned. Each one needs a sentence saying why it, rather than the next colour along. Without that sentence it is not a choice, it is the model's prior:

- Hue 250 to 285 above about 55 percent saturation. The framework violet.
- `#6366F1`, `#8B5CF6`, `#7C3AED`, `#4F46E5`, `#3B82F6`, `#2563EB`, `#0066FF` and their close neighbours. These are library defaults and they are recognised on sight.
- `#000000` or `#FFFFFF` as the ground.
- Saturation-zero grey neutrals next to one saturated accent.
- A gradient between two adjacent hues anywhere on the blue to violet arc.
- Cream near `#F4F1EA` with a terracotta accent.
- Near-black with acid green or vermilion.

## Two tests at the gate

**The next-client test.** Would this palette be equally right for the next person in their field? If it would, it is not theirs. Change the accent, or change the ground, until it would be wrong for someone else.

**Say it out loud.** Describe the palette in one sentence about real things: "warm paper, graphite, and the red of a library date stamp." If the only available description is a list of hex values, or "dark with a blue accent", then nothing was decided and you are looking at the average with their name under it.

## Gate

Five hex values, the material sentence they came from, every contrast pair checked, the accent budget named, and a `--on-accent` value that passes against the accent.
