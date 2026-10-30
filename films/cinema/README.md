# Foreman film replacement: physical scenes

Private review compositions. This does not replace the published films or change the playbook version.

## What was wrong

The rejected cut used a rounded rectangle as a phone, repeated flat cards, and decorative tool/path labels. Changing speed did not address the lack of physical depth or the missing visible relationship between an action and its result.

This replacement adds an existing iPhone model, lit physical scenes, moving reference planes and a paper brief, an audit example that changes on the phone, and a colour system that changes from light to dark. Screen content and terminal exchanges are composed demonstrations, not recordings of live agent runs. The English narration and translated captions are retained from the prior cut.

## Reference review

- [Burnwe showreel](https://www.youtube.com/watch?v=Tt4iGs4GPoU): actual video downloaded for local analysis and sampled across its timeline. The useful lesson is alternation between a wide context and a tightly framed action, rather than one repeated slide layout.
- [Florence, prompt character film](https://x.com/flxrnc/status/2115071786815463809): actual video sampled throughout. The setting persists while the character responds to successive prompts. Props and motion carry the story; they are not unrelated decoration.
- [Florence, character and blossom scene](https://x.com/flxrnc/status/2113263621463572991): actual video sampled throughout. Foreground petals, changing camera distance, and character weight create depth. The pink/green relationship stays coherent across views.
- User-supplied Apple and Google contact sheets: used to compare shot scale, device framing, and the relationship between interface actions and output. A contact sheet does not establish exact timing or sound design.
- [Jitter device templates](https://jitter.video/templates/devices/): inspected as an existing device-animation option. No template code or footage copied.
- Dribbble clips were blocked by a verification screen. Their page descriptions were accessible, but the clips were not verified as watched. No Dribbble footage is included.

These are design observations, not claims that the replacement matches the reference studios' production quality.

## Device asset and attribution

**Apple iPhone 15 Pro Max Black** by **polyman / polymanStudio**, licensed **CC BY 4.0**.

- [Original model](https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7)
- [Creator](https://sketchfab.com/Polyman_3D)
- [License](https://creativecommons.org/licenses/by/4.0/)
- [Download source and credit](https://github.com/VishankSharma/iphone-cinematic-showcase)
- [Independent source metadata](https://github.com/sanidhyy/apple-clone/blob/main/src/components/IPhone.jsx)

Only the model was reused from the showcase repository, not its application code. Changes: screen texture/material, scale, lights, camera and animation. Credit is carried on the preview page, in its downloadable credits file, and in MP4 metadata. Keep this credit when publishing or sharing the films.

Apple's own downloadable bezels were evaluated but not used. The [marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines/) restrict animating supplied product artwork. The model above is a separately licensed third-party asset, not Apple-supplied artwork.

The Draco runtime is distributed with Three.js. Its license is included beside the decoder files. Existing Foreman architecture imagery and page captures are reused; no new AI imagery was generated.

## Build and review

Compositions: `Cinema-before-the-code`, `Cinema-find-your-direction`, `Cinema-fix-what-feels-wrong`, `Cinema-colour-that-works`, `Cinema-before-you-share`.

From `films/production`, run `npm run lint`. Preview using Remotion Studio. Render with `npx remotion render Cinema-before-the-code out/cinema-before-the-code.mp4 --gl=angle --concurrency=3 --crf=18`, substituting each composition ID.

The renderer uses deterministic frame time. Physical scenes use Three.js, a PMREM room environment, shadow-casting lights, and the sourced Draco-compressed glTF. The display texture is authored for each demonstration, not a native phone recording.

Delivery uses 1920x1080 H.264 at 60 fps, AAC English narration, no music, and the 33 existing language caption tracks. The private package converts the renderer's full-range output to limited-range BT.709 for conventional video playback. No visible path-style chapter stamps are used. Slash syntax appears only inside actual tool command demonstrations.

Before publishing, review every moving film, caption timing, clipping, screen orientation and attribution. Technical render success is not creative approval.

## Verified review package

All five exports decoded without errors. Each has 1080p60 H.264 video, AAC audio, limited-range BT.709 colour tags, embedded device attribution, and 33 VTT plus 33 SRT caption files. Caption timing was checked against each export. ESLint, TypeScript and the repository validator pass. The private review page was checked at phone width. Consecutive frames around the overlap transitions were inspected after correcting an empty-frame defect. See media-audit.json for the exported media facts.

This records technical verification, not approval of the creative direction.

## Revision 6: upright devices and a tighter edit

Turki rejected decorative device tilt, cream backgrounds, muted colour, slow settling and transition thumps. The revised visual system uses white and black grounds with concentrated cobalt, cyan and violet light. The phone has no decorative rotation or floating bob. Reference panels move to establish selection rather than drifting continuously.

Choose first now depicts an audience choice. The engineering audience is carried into the brief and the resulting portfolio demonstration. Current distinct share artwork replaces the older repeated architecture cards in the reference scene. Image planes preserve their source aspect ratio.

The Sarjy English film was inspected again using the locally retained published MP4, sampled across its 68-second duration, with a denser sequence around the remembered-preference payoff and browser playback. Its useful mechanism is continuity: an earlier input becomes a later benefit. Upright devices keep attention on that interaction. Source: https://github.com/Turki-Sh/Sarjy/blob/main/src/shared/films.ts . No Sarjy footage, artwork or sound is included in Foreman.

The voice is not accelerated. Per-line pauses are shortened using the original clean voice segments. All added effects are removed. There is no music, beat track or transition impact. Each of the 33 language subtitle tracks is retimed to the new cue starts. Revision 6 uses cinema-timings.json and public/cinema/audio, rather than the previous mixed soundtrack.

The old /rebuild/ review address redirects to the current review after packaging, to avoid presenting an obsolete cut as the latest work. This is a private review revision, not a change to the live site or product version.
