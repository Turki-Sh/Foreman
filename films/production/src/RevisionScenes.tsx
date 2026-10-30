import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ArtStage } from "./ArtStage";
const ease = (t: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 4);
const pos: React.CSSProperties = { position: "absolute" };
const Back: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({
  children,
  dark,
}) => (
  <AbsoluteFill
    style={{
      background: dark
        ? "#050607"
        : "radial-gradient(ellipse at 100% 90%,#c0e0ff,transparent 62%),#fff",
      color: dark ? "#fff" : "#08090b",
    }}
  >
    {children}
  </AbsoluteFill>
);
const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      ...pos,
      left: 110,
      top: 70,
      fontSize: 126,
      fontWeight: 500,
      letterSpacing: "-.055em",
      lineHeight: 1.05,
      zIndex: 5,
    }}
  >
    {children}
  </div>
);
export const Device: React.FC<{
  type: "macbook" | "ipad";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ type, children, style }) => {
  const ipad = type === "ipad";
  return (
    <div
      style={{
        ...pos,
        width: 1300,
        aspectRatio: ipad ? "800 / 578" : "800 / 489",
        filter: "drop-shadow(0 32px 40px #10203535)",
        ...style,
      }}
    >
      <div
        style={{
          ...pos,
          inset: ipad ? "4.85% 3.5%" : "4.2% 8.3% 10%",
          overflow: "hidden",
          borderRadius: ipad ? 18 : 5,
          background: "#fff",
        }}
      >
        {children}
      </div>
      <Img
        src={staticFile("cinema/rev12/" + type + ".png")}
        style={
          ipad
            ? {
                ...pos,
                width: "72.25%",
                height: "138.4083%",
                left: "13.875%",
                top: "-19.20415%",
                transform: "rotate(90deg)",
                pointerEvents: "none",
              }
            : {
                ...pos,
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }
        }
      />
    </div>
  );
};
const Home = () => (
  <Img
    src={staticFile("cinema/home.png")}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "top",
    }}
  />
);
const artStyles: React.CSSProperties = {
  background: "#080b10",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow: "0 25px 55px #0003",
};
export const Ring: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ ...pos, inset: 0, perspective: 1800, overflow: "hidden" }}>
    <div
      style={{
        ...pos,
        left: 960,
        top: 590,
        transformStyle: "preserve-3d",
        transform: `translateZ(-650px) rotateY(${-t * 22}deg)`,
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            ...pos,
            left: -340,
            top: -230,
            width: 680,
            height: 460,
            transform: `rotateY(${i * 45}deg) translateZ(880px)`,
            backfaceVisibility: "hidden",
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 20px 45px #0004",
          }}
        >
          <Img
            src={staticFile(
              "cinema/" +
                [
                  "gallery-turki",
                  "gallery-haris",
                  "gallery-lustre",
                  "gallery-onkith",
                  "gallery-turki",
                  "gallery-haris",
                  "gallery-lustre",
                  "gallery-onkith",
                ][i] +
                ".png",
            )}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  </div>
);
export function revisionScene(
  index: number,
  shot: number,
  t: number,
): React.ReactNode | null {
  if (index === 0 && shot === 3)
    return (
      <Back>
        <Heading>Take a closer look.</Heading>
        <Ring t={t} />
      </Back>
    );
  if (index === 0 && shot === 4)
    return (
      <Back dark>
        <Heading>One creative direction.</Heading>
        <div
          style={{
            ...pos,
            left: 550,
            top: 330,
            width: 840,
            height: 580,
            borderRadius: 40,
            border: "2px solid #ffffff60",
            background: "linear-gradient(135deg,#ffffff24,#8ac9ff0c)",
            boxShadow: "inset 0 2px 0 #fff6,0 30px 90px #1b5dff45",
          }}
        >
          <div
            style={{
              ...pos,
              left: 40,
              top: -42,
              width: 270,
              height: 55,
              borderRadius: "22px 22px 0 0",
              background: "#9bbfff55",
            }}
          />
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              style={{
                ...pos,
                ...artStyles,
                width: 300,
                height: 240,
                left: 40 + (n % 3) * 240,
                top: 45 + Math.floor(n / 3) * 220,
                transform: `translate(${(1 - ease(t / 0.9)) * (n % 2 ? -500 : 500)}px,${(1 - ease(t / 0.9)) * 200}px) rotate(${(n - 2) * 4}deg)`,
              }}
            >
              {n === 1 ? (
                <div
                  style={{
                    height: "100%",
                    padding: 30,
                    background: "#e1f0ff",
                    color: "#072e5c",
                    fontSize: 65,
                    fontWeight: 500,
                    lineHeight: 0.95,
                    letterSpacing: "-.05em",
                  }}
                >
                  Make
                  <br />
                  it
                  <br />
                  matter.
                </div>
              ) : n === 4 ? (
                <div style={{ height: "100%", display: "flex" }}>
                  {["#072e5c", "#005fff", "#62dcdd", "#f4c768", "#ee6579"].map(
                    (c) => (
                      <div key={c} style={{ flex: 1, background: c }} />
                    ),
                  )}
                </div>
              ) : (
                <ArtStage kind="study" variant={n} t={t} />
              )}
            </div>
          ))}
        </div>
      </Back>
    );
  if (index === 1 && shot === 0)
    return (
      <Back dark>
        <Heading>What caught your eye?</Heading>
        <div
          style={{
            ...pos,
            left: 100,
            top: 340,
            right: 100,
            display: "flex",
            gap: 32,
          }}
        >
          {["Composition", "Hierarchy", "Colour"].map((label, i) => (
            <div
              key={label}
              style={{
                width: 550,
                transform: `translateY(${(1 - ease((t - i * 0.1) / 0.6)) * 170}px)`,
              }}
            >
              <div
                style={{
                  height: 440,
                  ...artStyles,
                  border: "1px solid #ffffff24",
                }}
              >
                <ArtStage kind="study" variant={i} t={t} />
              </div>
              <div style={{ fontSize: 40, marginTop: 30 }}>{label}</div>
            </div>
          ))}
        </div>
      </Back>
    );
  if (index === 1 && shot === 1)
    return (
      <Back dark>
        <div
          style={{
            ...pos,
            inset: -70,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 20,
            transform: `perspective(1800px) rotateY(${-8 + t * 4}deg) scale(1.05)`,
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                ...artStyles,
                height: 365,
                background: ["#07131c", "#11100e", "#0e0b23", "#09201c"][i % 4],
              }}
            >
              <ArtStage kind="study" variant={i} t={t + i * 0.2} />
            </div>
          ))}
        </div>
        <div
          style={{
            ...pos,
            left: 400,
            top: 430,
            fontSize: 100,
            letterSpacing: "-.05em",
            padding: "35px 55px",
            background: "#000b",
            border: "1px solid #fff5",
            borderRadius: 32,
            backdropFilter: "blur(12px)",
          }}
        >
          Saved is not decided.
        </div>
      </Back>
    );
  if (index === 1 && shot === 3)
    return (
      <Back>
        <Heading>One dominant headline.</Heading>
        <Device
          type="macbook"
          style={{
            left: 340,
            top: 265,
            width: 1240,
            transform: `translateY(${(1 - ease(t / 0.5)) * 140}px)`,
          }}
        >
          <Home />
          <div
            style={{
              ...pos,
              left: "28%",
              top: "10%",
              width: "45%",
              height: "23%",
              border: "3px solid #0863ff",
              borderRadius: 8,
            }}
          />
        </Device>
      </Back>
    );
  if (index === 1 && (shot === 4 || shot === 5))
    return (
      <Back>
        <Heading>
          {shot === 4 ? "Keep the principle." : "A direction you can use."}
        </Heading>
        <Device type="ipad" style={{ left: 110, top: 310, width: 1000 }}>
          <Home />
        </Device>
        <div
          style={{
            ...pos,
            left: 1200,
            top: 410,
            fontSize: 53,
            letterSpacing: "-.035em",
            lineHeight: 1.7,
            width: 620,
          }}
        >
          {(shot === 4
            ? ["Clear hierarchy", "Space to read", "One next step"]
            : [
                "Lead with the work",
                "Give the headline room",
                "One clear next step",
              ]
          ).map((s, i) => (
            <div
              key={s}
              style={{
                opacity: ease((t - i * 0.14) / 0.4),
                borderBottom: "1px solid #b8c7d8",
                padding: "20px 0",
              }}
            >
              {" "}
              {s}
            </div>
          ))}
        </div>
      </Back>
    );
  if (index === 3 && shot === 1)
    return (
      <Back dark>
        <Heading>Start with a material.</Heading>
        <div style={{ ...pos, inset: "200px 80px 80px" }}>
          <ArtStage kind="materials" t={t} />
        </div>
        <div
          style={{
            ...pos,
            left: 570,
            right: 570,
            bottom: 65,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 38,
          }}
        >
          <span>Ink</span>
          <span>Paper</span>
          <span>Polished metal</span>
        </div>
      </Back>
    );
  if (index === 4 && (shot === 1 || shot === 6))
    return (
      <Back dark={shot === 6}>
        <Heading>
          {shot === 1 ? "Check the whole journey." : "Know what is ready."}
        </Heading>
        <Device type="macbook" style={{ left: 130, top: 320, width: 1150 }}>
          <Home />
        </Device>
        <div
          style={{
            ...pos,
            left: 1350,
            top: 380,
            fontSize: 39,
            lineHeight: 2.2,
            width: 500,
          }}
        >
          {[
            "Domain connected",
            "HTTPS secured",
            "Share preview checked",
            "404 has a way back",
            "Search Console needs you",
          ].map((s, i) => (
            <div key={s} style={{ opacity: ease((t - i * 0.15) / 0.5) }}>
              <span style={{ color: "#1ab68f", marginRight: 15 }}>
                {i < 4 ? "✓" : "↗"}
              </span>
              {s}
            </div>
          ))}
        </div>
      </Back>
    );
  if (index === 4 && shot === 3)
    return (
      <Back>
        <Heading>Make the link worth opening.</Heading>
        <Device type="ipad" style={{ left: 420, top: 260, width: 1080 }}>
          <div
            style={{
              ...pos,
              inset: 0,
              background: "#f5f5f5",
              display: "grid",
              gridTemplateColumns: "55% 45%",
            }}
          >
            <div
              style={{
                padding: "8%",
                fontSize: 42,
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: "-.04em",
              }}
            >
              <span style={{ color: "#999" }}>
                An idea is
                <br />
                only a start.
              </span>
              <br />
              Give it
              <br />a direction.
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.4,
                  color: "#777",
                  marginTop: 24,
                  fontWeight: 400,
                  letterSpacing: 0,
                }}
              >
                Foreman helps your coding agent
                <br />
                shape the site before it builds.
              </div>
              <div style={{ fontSize: 24, marginTop: 50 }}>Foreman</div>
            </div>
            <div
              style={{
                background: "#e4f6f3",
                overflow: "hidden",
                clipPath: "polygon(0 0,100% 0,100% 100%,0 100%,25% 55%,0 42%)",
              }}
            >
              <div
                style={{
                  width: 600,
                  height: 580,
                  marginLeft: -100,
                  transform: "scale(1.4)",
                }}
              >
                <ArtStage kind="study" variant={0} t={t} />
              </div>
            </div>
          </div>
        </Device>
      </Back>
    );
  if (index === 4 && shot === 4)
    return (
      <Back dark>
        <div style={{ ...pos, inset: 0 }}>
          <ArtStage kind="404" t={t} />
        </div>
        <div
          style={{
            ...pos,
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 270,
            fontWeight: 500,
            letterSpacing: ".16em",
            textShadow: "0 10px 35px #000",
          }}
        >
          404
        </div>
        <div
          style={{
            ...pos,
            bottom: 90,
            left: 750,
            width: 420,
            textAlign: "center",
            fontSize: 38,
            padding: "22px 30px",
            border: "1px solid #fff7",
            borderRadius: 60,
            background: "#ffffff12",
          }}
        >
          Back to Foreman ↗
        </div>
      </Back>
    );
  return null;
}
