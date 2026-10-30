# Foreman detail refinements

Owner requested initial draft on the left, Foreman on the right; removal of the obvious drag caption; purposeful terminal colours; improved Punch list and Palette icons; cleaner liquid-glass corners; and a subtle purple light at the footer code card.

## Glass research

Reviewed primary implementations:
- https://github.com/hasib41/liquid-glass-nav : shape-aware displacement rather than a generic stretched map.
- https://github.com/LeonardSEO/liquid-glass-react : match displacement geometry to the element dimensions and radius.

The implementation is original, dependency-free capsule-distance code. A small displacement texture is regenerated only when the bar dimensions change. Refraction is applied to the capsule backdrop itself, not a child pseudo-element which was picking up the bar's own contents. One clipped rim replaces the overlapping arcs. The map is not animated; no scene cloning, screenshot runtime or continuous canvas rendering is used. CSS supplies the fallback for engines without SVG backdrop filtering.

## Colour and icons

Cyan: section headings and commands. Violet: field names. Green: quoted values and complete states. Amber: pending items. Syntax spans preserve source text and clipboard content. The rest of the site remains neutral. Footer purple lighting is explicitly requested and confined to the code card corner.

Punch list and Palette use Tabler's clipboard-check and color-swatch vectors, respectively. Source https://github.com/tabler/tabler-icons . MIT license retained at site/static/marks/TABLER-LICENSE.txt and generated docs/marks/TABLER-LICENSE.txt. Existing Board and Launch icons remain.

## Verification

Desktop light and phone dark checks on nine routes: no axe WCAG A/AA violations or horizontal page overflow. Interaction suite verifies native comparison input, pointer positioning, keyboard endpoints, copy text, tabs, menu, reduced motion and no-JavaScript fallbacks. Header corners and footer inspected in real rendered captures. Local preview retained; not published.
