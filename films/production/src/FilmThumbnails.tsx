import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import { ArtStage } from "./ArtStage";
import { Device } from "./RevisionScenes";
const titles = [
  "An idea worth building.",
  "Find your direction.",
  "Fix what feels wrong.",
  "Colour with a job to do.",
  "Before the first click.",
];
const slugs = [
  "before-the-code",
  "find-your-direction",
  "fix-what-feels-wrong",
  "colour-that-works",
  "before-you-share",
];
const Thumb: React.FC<{ index: number }> = ({ index }) => (
  <AbsoluteFill
    style={{
      background: index === 1 || index === 3 ? "#050609" : "#f7faff",
      color: index === 1 || index === 3 ? "white" : "#08090c",
      fontFamily: "Inter,Arial,sans-serif",
      overflow: "hidden",
    }}
  >
    <style>{`@font-face{font-family:Inter;font-weight:500;src:url('${staticFile("inter-500.woff2")}')}`}</style>
    <div style={{ position: "absolute", left: 95, top: 70, fontSize: 38 }}>
      Foreman
    </div>
    <div
      style={{
        position: "absolute",
        left: 95,
        top: 240,
        width: 750,
        fontSize: 135,
        fontWeight: 500,
        lineHeight: 1.02,
        letterSpacing: "-.06em",
        zIndex: 3,
      }}
    >
      {titles[index]}
    </div>
    {index === 0 ? (
      <div
        style={{
          position: "absolute",
          left: 940,
          top: 130,
          width: 850,
          height: 790,
          borderRadius: 50,
          background: "linear-gradient(145deg,#d2eaff,#f5d4bc)",
          transform: "rotate(-5deg)",
          boxShadow: "0 35px 100px #1a3e7c30",
        }}
      >
        <ArtStage kind="study" variant={0} t={2} />
      </div>
    ) : null}
    {index === 1 ? (
      <div
        style={{
          position: "absolute",
          left: 900,
          top: 80,
          width: 920,
          height: 920,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {[0, 1, 2, 7].map((i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ffffff25",
              borderRadius: 35,
              background: "#0b0f17",
            }}
          >
            <ArtStage kind="study" variant={i} t={1.2} />
          </div>
        ))}
      </div>
    ) : null}
    {index === 2 ? (
      <>
        <Device type="ipad" style={{ left: 960, top: 240, width: 850 }}>
          <Img src={staticFile("cinema/home.png")} style={{ width: "100%" }} />
        </Device>
        <div
          style={{
            position: "absolute",
            left: 1090,
            top: 660,
            fontSize: 140,
            color: "#16a779",
            background: "white",
            borderRadius: 100,
            padding: "0 32px",
            boxShadow: "0 20px 60px #0002",
          }}
        >
          ✓
        </div>
      </>
    ) : null}
    {index === 3 ? (
      <div
        style={{
          position: "absolute",
          left: 850,
          top: 120,
          width: 1050,
          height: 900,
        }}
      >
        <ArtStage kind="study" variant={2} t={1.7} />
      </div>
    ) : null}
    {index === 4 ? (
      <>
        <Device type="macbook" style={{ left: 880, top: 250, width: 1050 }}>
          <Img src={staticFile("cinema/home.png")} style={{ width: "100%" }} />
        </Device>
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 780,
            padding: "24px 50px",
            fontSize: 44,
            background: "#0c1017",
            color: "white",
            borderRadius: 70,
          }}
        >
          Ready to share ↗
        </div>
      </>
    ) : null}
    <div
      style={{
        position: "absolute",
        left: 100,
        bottom: 80,
        fontSize: 30,
        color: index === 1 || index === 3 ? "#9ca8ba" : "#5d6b7b",
      }}
    >
      foreman.turkialshuaibi.com
    </div>
  </AbsoluteFill>
);
export const FilmThumbnails = () => (
  <>
    {slugs.map((s, index) => (
      <Composition
        key={s}
        id={"Thumb-" + s}
        component={Thumb}
        defaultProps={{ index }}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={1}
      />
    ))}
  </>
);
