# Foreman films: workflow revision

Private revision, 30 October 2026. The previous cuts were rejected as boring. Faster playback did not fix the repeated heading-and-card structure. This revision replaces the visual compositions, while retaining the English narration and all 33 caption translations.

## Reference observations

- Apple MacBook Air product film, linked from https://www.apple.com/macbook-air/. Inspected the official 640x360 AVC stream as a sequence of frames across the film. Its desktop applications become the visual stage; framing moves from the workspace into details, and typography is embedded in the work. This informed the workspace-to-artifact camera movement. It does not establish that any style guarantees engagement.
- Google Flow, https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates-february-2026/. Inspected the embedded Ingredients to Video demonstration. Inputs visibly enter a prompt, the request is submitted, and the result opens in the same workflow. This informed the visible command-to-result relationship.
- No Apple or Google footage is included in the Foreman films. Existing Foreman image assets are reused.

## New visual work

- Main: terminal request, interview, reference selection, colour system, written brief, approval, code-to-page reveal, Foreman's site, tool overview.
- Board: a reference workspace with selection highlights; reference cards collapse into a direction document, which gives way to the page composition.
- Punch list: one persistent browser page; headline and action problems are marked; the viewport narrows; copy and buttons change; mobile is rechecked.
- Palette: material swatches become a UI; a failed text pair changes to a passing pair; light roles become dark roles; a token file opens.
- Launch: address checks, a custom share preview, a missing-page recovery, discovery-file checks and indexing pending.

These are authored visual demonstrations, not a recording of an agent executing commands and not a claim that Foreman is a standalone GUI application. Example domains and results remain illustrative. The main film also shows an actual screenshot of the Foreman site.

## Source and render

`films/production/src/WorkFilms.tsx` contains five `Work-<slug>` compositions. `work-timings.ts` contains the existing narration timing maps. Free Kokoro narration, voice only, is in `public/work-audio/`. No music or generated transition sounds.

From `films/production`, render each composition with:

```text
npx remotion render src/index.ts Work-before-the-code out/work-before-the-code.mp4 --concurrency=4 --crf=18
```

Other suffixes: `find-your-direction`, `fix-what-feels-wrong`, `colour-that-works`, `before-you-share`. Deliver using limited-range yuv420p H.264 and AAC, with fast-start metadata. Local review files are separate from the published site assets.

## Review status

ESLint and TypeScript pass. Representative frames and full-film contact sheets were inspected. Corrections included ghosting in the reference-to-document transition, nested browser chrome in the share preview, and contrast labels in the dark-theme scene. The light contrast pair uses #17191b on #ffffff, 17.63:1; the failing pair is #aaaaaa on #ffffff, 2.32:1. Dark mode is not given an unmeasured numeric claim.

Creative acceptance and pronunciation approval remain with Turki. Do not publish these revisions until reviewed. Product version remains 3.0.1; no skill behavior changes.
