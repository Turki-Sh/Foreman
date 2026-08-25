# Choosing a stack

They will ask what to build it in. The honest answer is that for a static personal site, the choice barely matters, and picking one quickly matters a lot. Do not run a comparison. Recommend, explain in one line, move on.

## Default recommendation

A static site generator with a component model and zero client JavaScript by default. It gives them reusable pieces without shipping a framework runtime to a phone.

## When to deviate

- **They already know a framework.** Use it. Familiarity beats optimality on a one-page site, and they will maintain it.
- **The site is genuinely one page with no repeated components.** Hand-written HTML and CSS is a legitimate answer and will beat everything on performance. Do not let anyone shame them out of it.
- **They need a blog or content collections.** Pick a generator with a content pipeline and Markdown support, or the coding agent will hand-roll one badly.
- **The site is an interactive demo of their work.** Then the interactive part drives the choice, and the rest of the site is scaffolding around it.

## What to refuse

- A client-side rendered app for a static page. It costs performance, indexing, and sharing previews, and buys nothing.
- A CMS for six paragraphs of copy they will edit twice a year.
- A component library imported to render three cards.

## Hosting

Any host that rebuilds from a git repository on push, on a free tier. The important properties are automatic builds, automatic SSL, a global CDN, and a custom domain. Most major hosts meet all four, so pick the one whose docs they can follow and do not relitigate it.

## The rule

State the recommendation, give the one-line reason, and move to step 2. Stack debate is the most common way a build dies before it starts.
