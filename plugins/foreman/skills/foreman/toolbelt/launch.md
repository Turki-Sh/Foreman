# Launch

Getting a finished site live, found, and shared well: domain, DNS, SSL, the head metadata, the share card, the 404, the sitemap, and indexing, one step at a time. It works for a site built anywhere, by anyone, and it is steps 7 and 8 of a session.

Stamp every message `**FOREMAN · LAUNCH**`.

Read `references/verify-and-ship.md` and `references/metadata-and-404.md`. Paste-ready files are in `assets/`: `head-metadata.html`, `404.html`, `robots.txt`, `sitemap.xml`, `llms.txt`.

## 1. Find out where it stands

Read before you ask. A repo tells you most of it: a `CNAME` file, `vercel.json`, `netlify.toml`, a GitHub Pages workflow, a `package.json` build script. Then ask only for what is missing, in one message: where is it hosted, is a domain bought and where, and does that domain carry email.

That last one matters more than it sounds. If the domain receives mail, its MX and TXT records stay exactly as they are, and a careless DNS edit kills their email silently.

## 2. Before it goes live

Check what exists and fill what does not, from the assets:

- The head block on every page: title under about 60 characters, a description of about 155 written for a person, canonical, `lang`, theme colour, favicons.
- The share card: Open Graph and Twitter tags with an absolute image URL, an image at 1200 by 630 that is legible as a thumbnail.
- Structured data: a `Person` or `Organization` block, and `SoftwareApplication` or `Product` if that is what the site is.
- A 404 that is the same site, returns a real 404 status, and offers a way back.
- `robots.txt`, `sitemap.xml` with true dates, `llms.txt`.
- Every number that claims a fact (a version, a year, a count) comes from one source.

## 3. Ship it, one step per message

The sequence in `references/verify-and-ship.md`: build clean, push, connect a host that rebuilds on every push, buy the domain, point DNS, remove the registrar's parking records, wait for the certificate, test.

**Before any DNS save, ask for a screenshot of the record panel and read it with them.** Deleting the wrong record is the one mistake here that is both easy and expensive.

**Anything that needs their credentials or their card is theirs.** You cannot log into their registrar, host, or bank, so never offer to, and if a coding agent says it deployed the site, check, because it did not.

## 4. Prove it

Evidence, never assurances:

- The root and `www` both load over HTTPS, in a private window.
- A URL that does not exist returns their 404, with a 404 status.
- The share card renders when the link is pasted into a chat or a sharing debugger.
- View source shows the head block as written.

## 5. Get it found

- Submit the sitemap to Google Search Console and Bing Webmaster Tools. Verification is a DNS record or a file, and it is theirs to do.
- If the host supports it, IndexNow tells Bing and the other participating engines the moment a page changes.
- Link the site from everywhere their name already is: LinkedIn, GitHub, the CV, the email signature. A site nobody links to is found by nobody.

## What comes back

A checklist, each line marked done with what proved it, or open with the next action and whose it is:

```
LAUNCH · example.com
done   HTTPS on root and www       checked in a private window
done   404 status and page         /nope returns 404 with the site's nav
open   share card                  og:image is relative. Make it absolute (yours)
open   Search Console              verify with the TXT record (yours, needs your login)
```

## Rules that hold here

- One step per message, because DNS punishes doing three things at once.
- Never speculate about a failure you have not seen. Ask for the error text or the screenshot.
- No em dashes or en dashes in anything you write for them, including the meta description and the 404 copy.
