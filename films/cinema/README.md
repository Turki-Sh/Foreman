# Foreman film replacement: physical scenes

Published film collection: https://foreman.turkialshuaibi.com/film/ . Five individual watch pages use the final revision 13 media. The playbook version remains 3.0.1 because this release changes the website and films only.

## What was wrong

The rejected cut used a rounded rectangle as a phone, repeated flat cards, and decorative tool/path labels. Changing speed did not address the lack of physical depth or the missing visible relationship between an action and its result.

This replacement adds an existing iPhone model, lit physical scenes, moving reference planes and a creative-source file, an audit example that changes on the phone, and a colour system that changes from light to dark. Screen content and terminal exchanges are composed demonstrations, not recordings of live agent runs. The English narration and translated captions are retained from the prior cut.

## Reference review

- [Burnwe showreel](https://www.youtube.com/watch?v=Tt4iGs4GPoU): actual video downloaded for local analysis and sampled across its timeline. The useful lesson is alternation between a wide context and a tightly framed action, rather than one repeated slide layout.
- [Florence, prompt character film](https://x.com/flxrnc/status/2115071786815463809): actual video sampled throughout. The setting persists while the character responds to successive prompts. Props and motion carry the story; they are not unrelated decoration.
- [Florence, character and blossom scene](https://x.com/flxrnc/status/2113263621463572991): actual video sampled throughout. Foreground petals, changing camera distance, and character weight create depth. The pink/green relationship stays coherent across views.
- User-supplied Apple and Google contact sheets: used to compare shot scale, device framing, and the relationship between interface actions and output. A contact sheet does not establish exact timing or sound design.
- [Jitter device templates](https://jitter.video/templates/devices/): inspected as an existing device-animation option. No template code or footage copied.
- During the initial revision, Dribbble clips were blocked by a verification screen. Their page descriptions were accessible, but the clips were not verified as watched. No Dribbble footage is included.

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

## Revision 7: narration, material matching and interface checks

Turki requested a slight speed increase, a catchy nonmusical background rhythm, a corrected Board highlight, replacement of the dated extruded blocks, and colour visuals that match the spoken material examples.

The existing free English voice is processed, not replaced: 1.06 tempo, 90 Hz high-pass, a small 280 Hz cut, restrained presence lift, compression and a -16 LUFS master target. The added rhythm is original aperiodic noise shaped into short stereo clicks and taps at 116 pulses per minute, with omitted subdivisions and no melody, bass oscillator, long decay or scene-boundary impact. No paid voice service was used. The revision 6 voice-gap audit is historical; silence between lines is no longer the intended soundtrack.

Board's highlight is a child of the screenshot container, so its position and scale follow the page. The 18-second area no longer enlarges on exit or introduces the thick paper slab. It becomes a reference and direction sheet. Board's gallery and Launch's status checks use image and interface layers instead of extruded blocks.

Palette now shows the named ink, paper and polished metal materials. Its interface demonstrates surface, text, action and feedback roles, and the same interface actually switches from light to dark. All 33 subtitle languages are retimed using the processed speech durations. This is a private review cut; creative acceptance remains with Turki.

## Revision 8: remove the rejected rhythmic loop

The continuous click/tap pattern is removed. The same revision 7 narration and video timing are retained. A sparse, individually timed score follows visible selections, reference movement, paper and terminal interactions. It uses short unpitched air, paper, slide and tactile sounds, with no metronome, music, bass impacts or automatic scene-end sounds. The five video streams are remuxed unchanged; captions retain their existing timing. Sound quality still requires the owner's review.

## Revision 9: selected library percussion

Turki authorized one library selection after rejecting generated sound design. Selected Stomp - Percussion Stomps Claps by Tunetank, downloaded through Pixabay on 2026-10-30: https://pixabay.com/music/action-stomp-percussion-stomps-claps-349896/ . The item lists the Pixabay Content License (https://pixabay.com/service/license-summary/) and Content ID registration. The personalized license certificate redirects to login and has not been obtained. The downloaded original stays in the private production workspace, not this repository.

All five mixes use the existing recorded arrangement starting at eight seconds, ducked under the narration with a short ending fade. No synthesized effects or generated beat remain. Voice, video and caption timing are unchanged. Track attribution is in each exported MP4 description and the private review credits. This remains a private review, not an approved or published soundtrack.

Libraries reviewed for future selection:
- Pixabay: ready-made percussion tracks; per-item Content ID status matters. https://pixabay.com/music/search/percussion/
- Mixkit: free sound effects and complete tracks, with separate licenses by asset type. https://mixkit.co/free-sound-effects/ and https://mixkit.co/license/
- Freesound: recorded claps, snaps and percussion; licenses vary by item. ecfike's Clap Percussion Loop is explicitly CC0: https://freesound.org/people/ecfike/sounds/202158/ . Original download requires login.

## Revision 10: an individual sound edit for each film

This supersedes revision 9. The shared Tunetank percussion track is removed from the current production audio. Five independently placed Foley arrangements follow the actual scene actions: 22 cues in the main film, 22 in Board, 18 in Punch list, 21 in Palette and 20 in Launch. The mixes use edited Mixkit recordings, with no music bed, generated sound, automatic scene-ending impact or shared rhythmic loop.

Board emphasizes paper movement and reference selection. Punch list leaves space around the problem and follows deletion, the surviving CTA and the corrected page. Palette follows the material arrivals, selected colour roles, contrast change and exact light-to-dark switch. Launch follows the checks, share preview and the back-home interaction. The main film has the strongest clap accents. Source onset trimming, short fades, restrained stereo placement and phrase-level attenuation keep transitions connected without covering the voice.

Picture streams, narration and subtitle timing remain unchanged. The private revision 10 page includes the five new MP4s with all 33 caption languages. Decode, duration, video-stream identity, caption bounds, distinct effect stems, browser playback and mobile overflow checks passed. Masters measured -16.00 to -16.17 LUFS, with true peaks at or below -1.45 dBTP. These checks establish technical validity, not listening approval. Audio playback cannot be heard by the assistant in this environment; the rendered mixes require Turki's listening review. No claim of Apple/Google-equivalent creative quality is made.

The cue sheets are in `audio-mix-audit.json`, source URLs in `audio-library-sources.json`, credits in `audio-library-credits.txt`, and measured results in `audio-export-audit.json`. Source recordings stay private and are not redistributed in this repo. Mixkit SFX license: https://mixkit.co/license/#sfxFree . Device attribution remains embedded in the review exports.

`mix-library-effects.py` reproduces the private review mix with `FOREMAN_FILM_WORKSPACE` pointing to the existing film workspace containing the clean revision 7 voice stems, `cinema/audio10/sources/` recordings and previous review exports. It needs FFmpeg plus NumPy, SciPy and SoundFile. It writes new revision-specific previews without overwriting the earlier picture exports. This is a private review revision, not a published release or playbook version change.


## Revision 11: optical glass and a percussion bed

The interface panels, prompts, terminal frames, audience choices, reference cards, status cards and buttons share an optical glass material. It uses size-matched displacement maps, refracted edges, restrained blur, specular rims and light or dark tint. Label content sits above the optical layers. Blue continues to identify a primary action. Paper, colour samples, screenshots and device hardware retain their materials rather than becoming transparent.

Implementation adapted from Leonard van Hemert's MIT-licensed liquid-glass-react, with its license retained in production/src/glass/LICENSE: https://github.com/LeonardSEO/liquid-glass-react . Film adaptations remove wall-clock transitions, preserve the existing layouts and place text above the tint. Visual reference: https://dribbble.com/shots/27652758-Gen-UI-for-AI-phone-OS-launcher-by-Milkinside . The reference video was inspected; its footage is not included.

Each existing action-effects edit now has a supporting body-percussion arrangement. The source is ecfike's Clap Percussion Loop.wav, recorded from clapping, finger snaps and clothing percussion, licensed CC0: https://freesound.org/people/ecfike/sounds/202158/ . No melodic or harmonic music is added. Tempos are 122, 114, 126, 118 and 120 BPM respectively. Phrase entry, scene energy, narration ducking and deliberate breaks differ by film. These are five edits of one source recording, not five unrelated recordings. Full settings are in percussion-arrangements.json.

mix-percussion-bed.py reproduces the mixes using FOREMAN_FILM_WORKSPACE, clean voice stems, revision 10 effect stems and the privately stored CC0 preview. The rendered private review is revision11.html. Existing review revisions remain available. This is not a product release or an approved publication. The assistant cannot hear playback in this environment; waveform measurements and playback checks are not a substitute for Turki's listening review.


## Revision 12: sourced device frames and reference-led scenes

The current private review adds a circular screen gallery, a creative-source file, 12 original reference studies, glass cube/pyramid/colour studies, rotating material cards, an answer.one-inspired share preview and a sculptural animated 404. Actual iPad and MacBook frame assets replace invented hardware outlines in the requested shots. Each film has its own composed thumbnail and a shorter recorded-percussion edit. The review player is adapted from Turki's Itqan player.

Read [revision12-sources.md](revision12-sources.md) for observed reference mechanisms, frame licensing, reproducibility and verification. Raw device frames are deliberately not committed; fetch them using `python films/cinema/fetch-device-frames.py` before rendering. The five `Thumb-<film-slug>` Remotion compositions generate the thumbnails. Run `mix-transient-percussion.py` with `FOREMAN_FILM_WORKSPACE` set to the existing private workspace to reproduce the audio.

Revision 12 remains local for review. It does not change the live site or playbook version.


## Published revision 13

The owner approved publication after the gallery, iPad edge, material-card collision and caption-menu fixes. Gallery animation and audio arrangements are unchanged from revision 12. The gallery now uses owner-supplied portfolio, HARIS, Lustre and Onkith captures. Materials rotate as a rigid stack with fan angles only after lateral clearance. The screen mask extends beneath the iPad bezel to prevent visible seams.

`manifest.json` and `captions/<film>/<language>.json` are the publication source of truth. The site generator creates five watch pages and a collection in all 33 site languages. Each watch page includes native video fallback, the customized Itqan player, eight transcript moments, English audio, 33 caption tracks, creator attribution, a stable thumbnail and VideoObject data. The collection uses ItemList data. Old `/films/` URLs redirect to `/film/` equivalents.

Search implementation follows [Google video guidance](https://developers.google.com/search/docs/appearance/video), [VideoObject documentation](https://developers.google.com/search/docs/appearance/structured-data/video) and [AI feature guidance](https://developers.google.com/search/docs/appearance/ai-features). Dedicated watch pages, visible transcripts, reciprocal language URLs and a video sitemap support discovery. They do not guarantee search placement.

Validation: `python scripts/audit_films.py`, `python scripts/audit_film_series.py --media`, `python scripts/audit_site.py`, `python scripts/audit_languages.py`, and `node scripts/check_films.cjs` against the local build. Asset attribution is visible on each watch page and in `/media/films/credits-v13.txt`.

## Player refinement, 30 October 2026

Captions now render from the original WebVTT cues in a padded overlay inside the film frame. The chosen track uses hidden mode for custom rendering, with native captions restored for native video fullscreen. See [TextTrack modes](https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/mode) and [cuechange](https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/cuechange_event). The player keeps native video controls when JavaScript is unavailable.

Caption language and playback speed use the same custom listbox, with selection marks, keyboard navigation, focus restoration and transparent scrollbar tracks. Films is linked from desktop and mobile navigation in every site language. Launch revision 14 corrects two malformed text glyphs; its decoded audio samples and duration match the published cut.
