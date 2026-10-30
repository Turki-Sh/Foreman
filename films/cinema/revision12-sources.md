# Revision 12 sources and implementation

Private review revision. No changes to the personal website, published Foreman pages, product version or existing review cuts.

## Reference analysis

The four Dribbble motion references below were opened in the browser, their actual video assets inspected, and sequences sampled across each clip. The reference footage is retained only in the private research workspace. It is not included in the exported films or repository.

| Source | Observed mechanism | Foreman adaptation |
| --- | --- | --- |
| [Multivariate Cube 327](https://dribbble.com/shots/17837661-Multivariate-Cube-327) | Glass shell, coloured reflections and a slow rotation that reveals depth | Rounded glass shell around a spectral core for Composition |
| [Pyramid](https://dribbble.com/shots/23984753-Pyramid) | Clear triangular volume, bright edges and interior reflections on black | Triangular glass pyramid with inset volume and reflective edges for Hierarchy |
| [Colourful AI exploration](https://dribbble.com/shots/15676949-Colourful-AI-exploratio) | Glossy warm/cool sphere with a smaller orbiting satellite | Animated iridescent sphere for Colour |
| [Revolut Metal Cards](https://dribbble.com/shots/6866581-Revolut-Metal-Cards) | Thin cards fan, close into a stack, rotate through their edges and open again | Three material surfaces, ink, paper and brushed metal, follow a stack-turn-fan sequence |
| [answer.one](https://dribbble.com/shots/27177886-answer-one-AI-Presence-Platform) | Grey-to-black headline on the left, cropped reflective artwork on the right | Foreman share preview inside an iPad, using original copy and newly rendered artwork |
| [nothin 404](https://www.404s.design/sites/nothin) | Scattered glossy sculptural objects around typography on black | Animated coloured reflective objects around 404 and a return action |

These are original real-time reconstructions and adaptations, not pixel-identical copies or the original studio renders. The cube uses a procedural colour texture and physical clear shell; the pyramid uses physical transmission. The card motion follows the reference's sequence, but its timing and materials are adapted to the shorter narration cue.

The 12-image reference wall contains 12 separately rendered geometric studies, not Foreman website images. The main film's circular gallery uses existing Foreman captures. The creative file combines rendered studies, typography and colour swatches instead of showing a literal build brief.

## Circular carousel

[React Bits Circular Carousel](https://reactbits.dev/components/circular-carousel) was inspected alongside its [source](https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/Components/CircularCarousel/CircularCarousel.tsx). Its cylinder arrangement, perspective and angular translation informed the film's frame-driven ring. The interactive component was not vendored. React Bits uses [MIT with Commons Clause](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md), not unrestricted MIT alone.

## Device frames

The existing separately licensed iPhone glTF remains unchanged. Two sourced transparent device frames replace invented hardware outlines:

- [Mobile FIRST iPad Pro 11](https://www.webmobilefirst.com/en/mockups/apple-ipad-pro-11-2018/), free 578 by 800 PNG. Rotated to landscape and composited over screen content.
- [Mobile FIRST MacBook Pro 16](https://www.webmobilefirst.com/en/mockups/apple-macbook-pro-16-2021/), free 800 by 489 PNG. Composited over screen content.

These are raster frames, not new 3D device models. The source pages permit personal and commercial use and modification, with no required attribution, but prohibit redistribution of the raw file alone. Raw frames are therefore ignored by git. Run `python films/cinema/fetch-device-frames.py` before rendering. The composed thumbnails and films contain the finished design, not stand-alone frame downloads. No paid HD files were purchased.

## Player

Adapted from Turki Alshuaibi's [Itqan player](https://turkialshuaibi.com/films/itqan/), specifically the existing FilmPlayer.tsx and films.css in the personal-site checkout. That checkout was read, not edited. The standalone review adapter keeps chapter colours, the seek preview, ambient lighting, keyboard controls, caption choice, playback speed, fullscreen and a link to the current moment. All five films have separately composed thumbnail images.

The old preview HTTP server does not support byte-range seeking. A second server on 127.0.0.1:3236 supports ranges; the original server on 3235 stays running. Neither server is bound to a public address by this revision. Review URL: http://127.0.0.1:3236/cinema/revision12.html . Existing cuts remain intact.

## Percussion

The [ecfike recording](https://freesound.org/people/ecfike/sounds/202158/) is CC0 and contains hand claps, finger snaps and clothing percussion. Revision 12 slices short transients from that recording instead of repeating the previous full loop. Each film has a distinct subdivision pattern and tempo: 132, 128, 138, 130 and 134 BPM. Existing individual action-effects edits and English narration remain. No melody, harmonic bed, synthesized impact or scene-end thump was added.

`mix-transient-percussion.py` reproduces the edits using the private workspace. `transient-arrangements.json` records each sample placement. The assistant cannot hear playback in this environment. Measured loudness and successful playback do not establish subjective sound quality; this cut still needs the owner's listening review.

## Verification

- Five 1920 by 1080, 60 fps H.264 exports decode without errors.
- Limited-range BT.709 output, AAC English narration, 33 existing VTT and SRT tracks per film.
- Five distinct composed thumbnails, verified by separate hashes.
- Desktop and 390px browser checks for play/pause, pointer and keyboard seeking, captions, playback speed, mute, fullscreen and moment links. No script errors, failed media requests or horizontal mobile overflow in the test.
- Physical scenes use deterministic frame time. Source footage and raw device frames are not bundled into the repository.

See revision12-export-audit.json and revision12-player-audit.json for measured results. Creative approval remains separate from these technical checks.
