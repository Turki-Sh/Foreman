# Foreman website languages

The website has the same 33 languages as Turki's personal site. English is the source edition. All 32 other editions are labeled Beta, including Arabic. The personal site is not part of this build.

## Scope

Each language has the homepage, Modes, Board, Punch list, Palette, Launch, Install, Changelog and 404 page. The footer picker preserves the page when switching languages. Arabic uses RTL layout; code, commands and recorded output remain LTR.

The installed playbook remains English. Original recorded sessions, code examples, historical release notes and the Dana demonstration retain their original English text. They are identified with `lang="en"`; translated changelog pages label the original release notes. Translations must not be presented as verbatim recorded agent output.

Catalogs were drafted and reviewed by language group, with additional checks of technical terms, accessibility labels and joined fragments. Beta does not imply native-speaker review. There are no translation requests at build time or runtime, and no translation credentials or paid services in the repository.

## Maintaining translations

1. Edit English sources in `site/pages/` and `site/partials/`.
2. Run `python scripts/extract_languages.py` to export changed source strings.
3. Update every language JSON file in this directory. Preserve commands, paths, brands, version numbers and technical identifiers. Check neighboring strings when inline markup splits a sentence.
4. Run `node scripts/build_localized_og.cjs` if translated headlines or artwork change. It uses the existing browser tooling (`playwright-core` and Chrome). No dependency is needed for the Python site build.
5. Run `python scripts/build_site.py`, `python scripts/extract_languages.py --check`, `python scripts/audit_languages.py`, and `python scripts/audit_site.py`.
6. Run `node scripts/check_languages.cjs` against the local preview at port 3217. Screenshots can go outside the checkout through `LANGUAGE_QA_DIR`.
7. If homepage source or assets change, refresh README previews with `node scripts/capture_readme.cjs` and build again.

`scripts/localize.py` fails when visible prose is missing from a catalog. The source strings are stable English keys, not positions in a batch. A translation must not move a word into another key.

## Search and sharing

- Static, self-canonical language URLs with translated titles, descriptions, image descriptions and accessibility text.
- Reciprocal `hreflang`, including the current language and English `x-default`.
- A sitemap of all indexable editions; errors and demonstration artifacts remain `noindex`.
- Localized WebPage language and image data. The SoftwareApplication language remains English because the playbook files are English.
- 288 localized 1200x630 cards, in addition to the existing English cards. Each page/language pair has a distinct vector composition, not only different typography. The artwork manifest records hashes of the artwork before the headline is added.
- Content-based cache keys for shared styles and scripts, independent of the playbook version.

Google's AI search features use the same technical and content foundations as Search. This work improves accessibility to crawlers and answer systems; it does not claim guaranteed indexing, ranking or citations. No hidden keyword text or unsupported structured-data claims are added.

Sources, checked 2026-10-30:

- [Google: localized page versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
