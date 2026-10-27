# Punch list

On a building site, the punch list is everything that does not meet the spec, walked room by room before handover. This one is walked against a website: every defect, ranked, each with its fix. It works on any site, including ones Foreman never touched, and it is the verification list at step 6 of a session.

Stamp every message `**FOREMAN · PUNCH LIST**`.

Every path in this file is relative to the foreman skill folder, the parent of `toolbelt/`.

## 1. Look at the real thing

You audit what you saw, never what you assume. Get the strongest access the session allows and say which you had.

- **A URL, and you can browse.** Load it at 1280 wide and at 375. Read the source. Point at every link, button, card, and nav item, and click every one. Request a URL that does not exist. If you can run Lighthouse or read the console, do.
- **A local project.** Run it, then do the above against localhost. Read the built CSS as well as the source, because the source says what was meant and the build says what shipped.
- **Screenshots only.** Audit what is visible, and list what you could not check (states, metadata, the 404, mobile, if those were not shown) as its own short section. Never fill that gap with a guess.

If they ask about "my site" and give nothing, ask for the URL or the folder. That is the only question before the list.

## 2. Walk it in this order

**Broken.** What fails a visitor right now.
- Controls with no destination: `href="#"`, a button that does nothing, a form with no backend, a tab with one state.
- The page at 375: horizontal scroll, overlapping text, a nav that disappears with no menu in its place, tap targets under about 24px.
- No visible focus, or `outline: none` with nothing put back. Tab through the page once.
- Contrast below 4.5:1 for body text and 3:1 for large text and interface parts. Measure the real pairs, do not judge by eye.
- A 404 that is the host default, or returns 200, or has no way back.
- Console errors, missing images, broken links, alt text missing on images that carry meaning.

**Unfinished.** Invisible in a screenshot and costly anyway. `references/metadata-and-404.md` has the full spec.
- The head: title, description, canonical, `lang`, the Open Graph block with an absolute image URL, structured data.
- The share card: share the link somewhere, or read the tags, and check the image exists at 1200 by 630.
- Favicon, Apple touch icon, theme colour.
- `sitemap.xml` and `robots.txt`, and whether the sitemap's dates are true.
- Numbers that claim a fact and have gone stale: a version, a year, a count, "updated" dates, the same number disagreeing across the page, the README, and the metadata.
- No hover or focus states on things that look interactive, or things that look interactive and are not.

**Generated.** Walk `references/vibe-coded-tells.md` against the page and name each tell with where it is. The test for every item stays the same: was it chosen? You cannot see that from the page, so list every tell you find, including ones that might be a deliberate style, and let the owner strike the ones they chose. A tell left off because it might have been chosen is a defect you hid.

**Notes against the standards.** `references/standards.md`: a type scale with no real distance between sizes, lines of body text over about 80 characters, spacing with no system, gutters that disagree, motion that is slow or uniform, one easing curve or five. These go in their own group as notes, because a standard is a default and the owner may have departed from it on purpose.

## 3. Write it so it can be acted on

```
PUNCH LIST · example.com · 27 October 2026
Checked: 1280 and 375 wide, source, every control, a missing URL
14 items: 3 broken, 5 unfinished, 4 generated, 2 notes

BROKEN
1. "Start free" in the hero links to #. The main button does nothing.
   Fix: point it at the signup page, or remove it until one exists.
2. At 375 the nav disappears and nothing replaces it. Phone visitors
   cannot reach Pricing or Docs.
   Fix: a menu button that opens the same four links.

UNFINISHED
...

GENERATED
...

NOTES
...

Could not check: form submission (no test account).
```

- **Each item is where, what, and the fix.** Where on the page, what is wrong in one plain sentence about what it does to a visitor, and the fix concrete enough to do. "Looks generic" is not an item. "The three feature cards use the component library's default radius, shadow, and indigo" is.
- **Ranked inside each group,** worst first.
- **Write the count line last,** from the list as written, then check it against the list. A punch list that miscounts itself has told them not to trust the rest.
- **No score, no grade, no percentage.** A number nobody measured is the same as a statistic nobody measured, and this playbook does not invent those.
- **Quote their copy, never rewrite it.** If a line fails, quote it, say what fails (the competitor swap in `references/content-interview.md` is usually the test), and offer to find the better line in their own draft. The words stay theirs.
- **Say what is good, once, if something is.** One line at the end, only if true. Not as padding and not to soften the list.

## 4. Then

Offer the next move once. On its own, if this session can edit the project: fix it one concern at a time, broken first, and show each fix. If it cannot, the list goes to whoever builds it, as is. Mid-session before step 5, nothing gets fixed: the list goes into the brief, because rule 1 still holds. At step 6 the list is the step, and nothing ships until the broken group is empty.

When they say an item was a choice, strike it and never raise it again. That is rule 8 in `SKILL.md`, and it applies to the gradient they love as much as to anything else.

If the site is not theirs, the list is for learning from. Do not help turn it into a public takedown of someone else's work.

## Rules that hold here

- Evidence, not assurances. Everything on the list was seen or measured.
- Reasoning stays in the chat. The list says what and how to fix it, not a lecture on why design matters.
- No em dashes or en dashes in the list or in any fix you write.
