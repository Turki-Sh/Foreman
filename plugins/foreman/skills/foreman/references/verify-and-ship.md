# Verify, ship, index (steps 6, 7, 8)

## Step 6: Verify like an engineer, not like a viewer

The full-width render in their own browser is the easiest thing in the world to fool themselves with. Ask for evidence, not assurances.

- 375px width, then a real phone.
- Always incognito. Cache lies, especially after DNS changes.
- Lighthouse on mobile, not desktop.
- Tab through the whole page. Focus visible, order matches the visual layout.
- Contrast checked against their actual palette, not the defaults the component was tested with.
- A URL that does not exist, to confirm the 404 is their page, in their layout, with the nav and the footer on it and a way back. A bare `404` on an empty background is the host default in their colours, not a custom 404.
- View source: title, meta description, OG image, `lang`, `dir`.
- The version, the last-updated date, and the copyright year in the footer, against what is actually true today. Then the same version in the JSON-LD and the `lastmod` in the sitemap, because those two are where it goes stale unseen.
- Every link clicked, including the CV download.
- Hero media weight checked on a phone connection, not on campus wifi.
- Point at every link, button, card, and nav item. Anything that does not answer a cursor or a tab key is unfinished, not minimal.
- Reload it and watch the first three seconds. If everything appeared at once, the choreography in `BRAND.md` did not ship. If it takes longer than about two and a half seconds, it reads as loading.
- Disable JavaScript, or block the animation, and load it again. The page must be complete. Anything that only exists after an animation runs is a page that is sometimes blank.
- Turn on reduced motion and look again. The page should read as finished standing still.
- Hold the composition sentence from `BRAND.md` next to the screenshot. If the sentence says nothing centred and the page is a centred column, the brief did not survive the build.
- The signature element is the one they specified, not a static image the coding agent substituted for it.
- Read the whole page against the register word from step 2. If the word was "playful" and the page is not, the page is wrong, not the word.
- Read it once more for sentences that explain the page to the reader. The coding agent adds these as filler when a section looks empty. Cut them, and if the section is genuinely empty, cut the section.
- Search the built page for em dashes and en dashes, including alt text and the meta description. The coding agent adds them even when the brief says not to.
- Walk `vibe-coded-tells.md` against the built page. Be specific in what goes back: "this looks generated" is unactionable, "the three cards are framework defaults, the locked tokens are not in the CSS, and the primary button does nothing" is three fixes.
- Search the built CSS for the locked hex values from step 3. If the framework palette names are there instead, the tokens did not ship, whatever the page looks like.
- Click every button, link, tab, toggle, and input, including the one in the hero. Anything that implies it does something and does not is worse than an element that was never added, and it is the failure a visitor is most likely to hit first.
- Ask of each remaining decorative element what it does for the reader. Pills, eyebrows, numbered markers, and dividers that cannot answer are what makes a finished page read as generated.

## Step 7: Ship

Vendor names change, the sequence does not. Walk it one step at a time.

1. Build locally with zero errors.
2. Push to a git repository.
3. Connect a host that rebuilds from that repo on every push. Free tiers are more than enough for a static site.
4. Buy a domain at any registrar.
5. Point DNS: root record to the host's value, `www` exactly as the host instructs.
6. Delete the registrar's parking record and the purchase redirect. Leave MX and TXT records alone if they use email forwarding, or their mail dies silently and they will not notice for weeks.
7. Wait for propagation, confirm SSL is issued, then test in incognito.

Before any DNS save, ask for a screenshot of the record panel and read it with them. Deleting the wrong record is the one mistake in this pipeline that is both easy and expensive.

**Hard boundary:** anything requiring their credentials or their card is theirs. You cannot log into their registrar, host, or bank, so never offer to. If a coding agent claims it deployed the site, it did not.

## Step 8: Index and distribute

A site nobody can find is not shipped.

- `sitemap.xml`, `robots.txt`, Schema.org JSON-LD, `llms.txt`.
- Submit to Google Search Console and Bing Webmaster Tools.
- Link it everywhere their name appears: LinkedIn, GitHub, email signature, CV.
- Semantic versioning in the README so future iterations stay legible.

## Common deploy failures

- **Host build fails, local build works.** Usually a package manager mismatch (a `package-lock.json` in a pnpm project), a case-sensitive import path that only breaks on Linux, or a Node version difference.
- **Site loads on `www` but not the root, or vice versa.** One of the two records is missing or pointed at the parking page.
- **SSL warning after DNS is correct.** Certificate not issued yet. Wait, then check in incognito before changing anything.
- **Old version keeps showing.** Cache or a stale build. Confirm the host actually rebuilt from the latest commit before debugging the code.
