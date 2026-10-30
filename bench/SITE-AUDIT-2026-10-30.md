# Foreman site audit, 30 October 2026

## Changes

- Header and footer now use the non-letter hard-hat mark, matching the transparent favicon. The header wordmark and visible icon have matching optical heights.
- Native scrollbar now has a transparent track, a 4px rounded thumb revealed near the pointer at the right edge, and no arrow buttons. Touch and forced-colour modes retain a visible native thumb. Removed the standard scrollbar-color override that prevented Chromium pseudo-element styling.
- Eleven served pages each have a distinct 1200x630 PNG share card. The legacy og.png also uses the new homepage card.
- Dana has absolute Open Graph and Twitter image URLs, a canonical URL and its own card. The fictional example is noindex, follow. Both error pages remain noindex.
- Website dateModified and sitemap dates reflect this redesign, separately from the skill's 27 October release date. Product version remains 3.0.1.
- Corrected stale Dana README artwork and metadata descriptions.

## Verification

- scripts/validate.py: version copies, manifests, counts, card and file references pass.
- scripts/build_site.py --check: generated docs match source.
- scripts/audit_site.py: all eleven pages pass canonical, social metadata, distinct card dimensions, internal resources, anchors and skill archive checks.
- bench/site-interactions.cjs: 47 checks pass, including clipboard, tabs, comparison slider, replay, theme, mobile navigation, reduced motion, no-JavaScript content and true 404 responses.
- Nine Foreman routes tested at desktop light and phone dark: no axe WCAG A/AA violations or horizontal page overflow.
- Header inspected at 1440px and 375px. Computed scrollbar styling confirms rounded thumb and hidden buttons in Chromium.

These are local checks. No social-network scraper cache refresh or production deployment verification is claimed here.

## Reproduction

With docs served at http://127.0.0.1:3217 and the bench Playwright dependency installed, run node scripts/build_og.cjs, then python scripts/build_site.py. Share-card source PNGs live in site/static/og. CI checks the generated metadata and source archive with scripts/audit_site.py.

## Outstanding product release gate

The branch also contains the earlier 3.0.1 skill changes. No full clean baseline/natural scenario benchmark is present in this checkout. AGENTS.md requires this before a skill release. Claude quota is exhausted and the owner disallowed paid overage; the reference-guided Codex example is not a substitute for that controlled benchmark. No paid calls were started for this audit.

## Follow-up branding and font check

Launch now uses a rocket throughout the tool cards, tool page and related links. Desktop and mobile checks found no overflow or axe violations after the branding changes. Chromium computed styles confirm transparent track and idle thumb; moving near the edge reveals the thumb, and moving away hides it.

Actual Windows browser fonts: Segoe UI for body and branding, Segoe UI Semilight for the homepage hero, Consolas for code. Barlow Condensed remains declared in the base stylesheet but the redesign overrides its display variable with Segoe UI. Dana declares self-hosted Audiowide for display text and Segoe UI for body text.

Scrollbar reference supplied by the owner: https://codepen.io/oxn-krtv/pen/NWePwEV (transparent track and transparent border with padding-box clipping). The edge-hover reveal is implemented locally without a custom scroll container or external dependency.

## Final interaction refinement

The native rail reveal now persists when the pointer leaves the document for scrollbar chrome. Tested near the rail at the top, middle and bottom of the viewport, then away from the edge. The portrait hover movement and keyboard/click stamp interaction are restored, with reduced-motion handling. Navbar height is 56px desktop and 54px mobile, with lighter 500-weight branding and an outline hard hat. Removed mode-comparison link underlines. Verified no 375px page overflow and both mouse and Enter-key stamping.
