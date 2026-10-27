# Palette

Three palettes built from something real, compared side by side on the owner's own content, contrast checked before they see them. They pick one. It runs on its own or as the colour half of step 3.

Stamp every message `**FOREMAN · PALETTE**`.

The workflow is `references/palette.md`, in order. This file is how to run it as a tool. Read both.

## 1. What you need before any hex exists

- **What the site is for and its register.** Mid-session you have them. Standalone, ask once, in one message, or read them from what they gave you.
- **A material.** Always ask it, in every mode, because it is the mechanism:

> Name a thing, not a colour. What object, place, or printed thing has the colour this site should have?

In Survey, bring candidates instead of a blank: if they gave you a logo, photographs of their work, or a product, name two or three materials you found in them and let them pick or correct. In Stress test, after they answer, ask what the next person in their field would name, and make sure the palette would be wrong for that person.

- **Their real content.** Their name, their opening line, one paragraph they wrote. Colour is judged on the page it will sit on, never on swatches.

## 2. Build three variants on axes

Follow `references/palette.md` from ground to contrast: ground before hue, the material before any hex, neutrals tinted from the accent, an accent budget named before any CSS, three variants that differ on ground mode, accent family, where the personality sits, and contrast strategy. One of the three is light, whatever the material was.

Check each variant against the colour section of `references/standards.md` before it goes in the file: the value structure holds in greyscale, the proportion has one dominant ground and an accent that stays rare, and the harmony is one you can name. Those are standards, so a variant may break one, but you know which and can say why.

## 3. The file

Start from `assets/brand-harness.html`, read the warning at its top, and replace every shipped value. Fill it with their name, their line, and their paragraph. Save it as `brand.html`, a throwaway that never joins the project. Open it for them if you can.

Beside each variant, the contrast pairs you measured: text on ground, muted on ground, text on surface, accent on ground, and the label on the accent. Any pair under 4.5:1 for body text or 3:1 for large text and interface parts is fixed before they see it, not after.

## 4. What comes back

One question: which one, and what would you change in it. Then lock:

```
ground   #......   surface  #......   text  #......
muted    #......   accent   #......   on-accent  #......
material  "the sentence about real things the palette came from"
accent budget  primary action, links in body text, focus ring, one detail
```

Mid-session this is the colour half of the step 3 gate, written into `BRAND.md`. Standalone it is the output, and you offer the rest of step 3 once: type, composition, and the first two seconds, which is where most of the look is actually decided.

## Rules that hold here

- They choose. Never present one finished palette, and never pick for them when they say "you choose": that is answered with the three variants, not a verdict.
- The list of colours that needs a reason, in `references/palette.md`, applies to your proposals, never to their request. If they ask for the indigo, say once that it is the framework's, then build it well.
- No em dashes or en dashes anywhere, including token comments.
