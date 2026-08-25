# Performance and accessibility floor

Put these in the brief as constraints. Checking them at the end means rebuilding, and a coding agent will happily ship a 14 MB hero image because nothing told it not to.

## Images

- Export at no more than twice the width they display at. A hero shown at 1200px does not need a 6000px source.
- AVIF or WebP with a fallback. A 4 MB PNG is the single most common reason a site scores 40 on mobile.
- Always set `width` and `height` (or an aspect ratio). Missing dimensions cause the layout to jump while loading, which is most of a bad CLS score.
- Lazy load everything below the fold. Load the hero eagerly with high fetch priority.
- Descriptive `alt` for meaningful images, empty `alt=""` for decorative ones. Do not describe the file name.

## Video and motion

- Hero video under a few MB, with a poster frame that looks complete on its own.
- Muted, inline, looping, no controls if it is decorative.
- Honor `prefers-reduced-motion`: fall back to the poster, do not autoplay.
- One orchestrated moment lands harder than five scattered effects, and scattered effects are the strongest tell that a page was generated.
- Animate `transform` and `opacity` only. Animating width, height, top, or left runs layout on every frame and janks on the phones most visitors are holding.
- State transitions (hover, focus, active) cost nothing on any budget and are not what "no animation" is meant to exclude. A page whose links do not respond to a cursor reads as broken, not as restrained.

## Fonts

- Two families maximum, three weights total. Every extra weight is another request.
- Self-host or preconnect, and preload the display face used in the hero.
- `font-display: swap`, with a fallback stack chosen to have similar metrics so the swap does not reflow the page.

## JavaScript

A static personal site needs almost none. Every library is a tax paid on every visit by every visitor, most of them on phones. If the coding agent reaches for a framework component to render three cards, push back.

## Accessibility floor

Not optional, and cheap at build time:

- Semantic landmarks, exactly one `h1`, headings in order.
- Visible focus ring. Never `outline: none` without a stronger replacement.
- Contrast at least 4.5:1 for body text, 3:1 for large text. Check against the real palette from step 3, not the component defaults.
- Tap targets around 44px.
- Skip link to main content.
- `lang` set, and `dir="rtl"` handled as a layout, not a toggle.

## Budget to write into the brief

- Lighthouse mobile 95+, accessibility 100.
- Largest Contentful Paint under 2.5s on a mid-range phone.
- Total page weight under about 1.5 MB, hero media excluded.
- Hero media capped separately at 1.5 MB, with a poster fallback. This is the constraint whose absence produced the failure in `worked-example.md`.
- No layout shift after first paint.
