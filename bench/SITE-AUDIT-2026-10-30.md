# Foreman site audit, 30 October 2026

## Changes

- Header now uses the non-letter hard-hat mark, matching the transparent favicon.
- Native scrollbar has a rounded thumb, a neutral track and no arrow buttons. Removed the standard scrollbar-color override that prevented Chromium pseudo-element styling.
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
