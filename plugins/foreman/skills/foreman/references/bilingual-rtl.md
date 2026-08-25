# Bilingual and RTL sites

Relevant whenever the owner works in Arabic, Hebrew, Farsi, or Urdu, or wants a second language at all. Most generated bilingual sites are broken in ways the coding agent will not flag.

## The rule

A second language is a layout, not a toggle. If they cannot commit to maintaining both versions, one language done well beats two done badly.

## Translation

Never machine-translate the site. The line the page opens with, and the about section, carry the register, and a translated opening reads as imported. The owner writes both versions, or a native speaker does. If only one version can be written properly, ship that one.

Names, job titles, and institution names are not always translated. Ask, do not assume.

## RTL is a mirror, not a switch

- Set `dir="rtl"` on the document, not on scattered elements.
- Use logical CSS properties (`margin-inline-start`, `padding-inline-end`, `inset-inline`) so the layout mirrors instead of breaking.
- Icons with direction (arrows, chevrons, progress) mirror. Logos, clocks, and media controls do not.
- Numbers, code blocks, emails, and URLs stay LTR inside RTL text. Wrap them with `dir="ltr"` or they will render in a confusing order.
- Text alignment follows the language, not the design grid.

## Type

Latin display faces rarely have Arabic coverage, so pick a matching Arabic face deliberately and check the optical size against the Latin one. Arabic sets larger at the same nominal size, so the type scale usually needs its own values. Line height almost always needs to increase.

## Structure

- Each language gets its own URL (`/ar/`, or a subdomain), each with its own `lang` and `dir`, its own title and description.
- Cross-link with `hreflang` so search engines serve the right one.
- The language switch is visible, labeled in the target language ("العربية", not a flag), and lands on the equivalent page, never on the home page.

## Verify

Read the RTL version on a phone. Check that the nav, the buttons, and the project cards mirrored, that no punctuation drifted to the wrong end of a line, and that mixed content (an English project name inside an Arabic sentence) reads correctly.
