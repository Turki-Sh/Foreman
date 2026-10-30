import React from "react";
import {
  AbsoluteFill,
  Composition,
  Sequence,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";

for (const weight of ["400", "500", "600"])
  loadFont({
    family: "Inter",
    url: staticFile(`inter-${weight}.woff2`),
    weight,
  });
const ease = Easing.bezier(0.18, 0.8, 0.18, 1);
const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
  easing: ease,
};
const p = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], clamp);
const ink = "#111113",
  paper = "#f8f8f6";
const mono = "Consolas, monospace";
const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 24,
  letterSpacing: 3,
  textTransform: "uppercase",
  fontWeight: 400,
};
const title: React.CSSProperties = {
  fontSize: 110,
  lineHeight: 1.03,
  letterSpacing: -7,
  fontWeight: 400,
  margin: 0,
};

function Mark({ size = 60, color = ink }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 5 48 33">
      <path
        fill={color}
        d="M7 30v-4c0-8 5-14 13-16V8c0-2 1-3 4-3s4 1 4 3v2c8 2 13 8 13 16v4h2c2 0 3 2 3 4s-2 4-5 4H7c-3 0-5-2-5-4s1-4 3-4Z"
      />
      <path
        fill="none"
        stroke={color === ink ? paper : ink}
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M20 12v14m8-14v14"
      />
    </svg>
  );
}
function Signature({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 66,
        display: "flex",
        alignItems: "center",
        gap: 17,
        color: dark ? "white" : ink,
        fontSize: 28,
        fontWeight: 500,
      }}
    >
      <Mark size={38} color={dark ? "white" : ink} />
      Foreman
    </div>
  );
}
function Grid({
  dark = false,
  opacity = 1,
}: {
  dark?: boolean;
  opacity?: number;
}) {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `linear-gradient(${dark ? "#ffffff0b" : "#00000009"} 1px, transparent 1px),linear-gradient(90deg,${dark ? "#ffffff0b" : "#00000009"} 1px,transparent 1px)`,
        backgroundSize: "120px 120px",
        maskImage: "linear-gradient(transparent,#000 30%,#000 75%,transparent)",
      }}
    />
  );
}
function Rule({
  frame,
  at = 0,
  y = 900,
}: {
  frame: number;
  at?: number;
  y?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: y,
        height: 1,
        width: p(frame, at, at + 35, 0, 1700),
        background: "currentColor",
        opacity: 0.23,
      }}
    />
  );
}
function Reveal({
  children,
  at = 0,
  style = {},
}: {
  children: React.ReactNode;
  at?: number;
  style?: React.CSSProperties;
}) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...style,
        opacity: p(f, at, at + 18),
        transform: `translateY(${p(f, at, at + 28, 42, 0)}px)`,
        filter: `blur(${p(f, at, at + 18, 6, 0)}px)`,
      }}
    >
      {children}
    </div>
  );
}
function WindowBar({
  text = "BRIEF.md",
  dark = false,
}: {
  text?: string;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        height: 62,
        borderBottom: `1px solid ${dark ? "#333" : "#ddd"}`,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 9,
        color: dark ? "#aaa" : "#666",
        fontFamily: mono,
        fontSize: 22,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 9,
            height: 9,
            borderRadius: 9,
            background: dark ? "#555" : "#ccc",
          }}
        />
      ))}
      <span style={{ marginLeft: 20 }}>{text}</span>
    </div>
  );
}

function Opening() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: paper, color: ink }}>
      <Img
        src={staticFile("architecture.webp")}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          objectFit: "cover",
          opacity: 0.52,
          transform: `scale(${p(f, 0, 144, 1.12, 1)})`,
          filter: "grayscale(1)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(#f8f8f6 15%,#f8f8f6b0 50%,transparent)",
        }}
      />
      <Signature />
      <div style={{ position: "absolute", left: 110, top: 230 }}>
        <Reveal>
          <div style={label}>A website starts with a decision.</div>
        </Reveal>
        <Reveal at={12}>
          <h1
            style={{
              ...title,
              fontSize: 162,
              letterSpacing: -11,
              marginTop: 35,
            }}
          >
            Before
            <br />
            the code.
          </h1>
        </Reveal>
      </div>
      <svg
        style={{ position: "absolute", inset: 0 }}
        width="1920"
        height="1080"
      >
        <path
          d="M110 842 H1810 V190 H1130"
          fill="none"
          stroke={ink}
          strokeWidth="2"
          strokeDasharray="3100"
          strokeDashoffset={3100 * (1 - p(f, 18, 112))}
        />
        <circle cx={p(f, 18, 90, 110, 1810)} cy="842" r="6" fill={ink} />
      </svg>
      <Reveal
        at={55}
        style={{ position: "absolute", left: 1110, top: 290, width: 590 }}
      >
        <p style={{ fontSize: 43, lineHeight: 1.3, letterSpacing: -1.8 }}>
          Give your agent
          <br />a direction.
        </p>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 935,
          ...label,
          fontSize: 20,
          opacity: p(f, 90, 110),
        }}
      >
        A film by Turki Alshuaibi
      </div>
    </AbsoluteFill>
  );
}

function Request() {
  const f = useCurrentFrame();
  const shift = p(f, 85, 130, 0, -65);
  return (
    <AbsoluteFill style={{ background: ink, color: paper }}>
      <Grid dark />
      <Signature dark />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 255,
          transform: `translateY(${shift}px)`,
          width: 1600,
        }}
      >
        <Reveal>
          <div style={{ ...label, color: "#a2a2a8" }}>Turki Alshuaibi</div>
        </Reveal>
        <Reveal at={8}>
          <div style={{ fontSize: 86, letterSpacing: -4, marginTop: 35 }}>
            <span style={{ color: "#73737b", marginRight: 25 }}>›</span>
            {"Help me build my portfolio.".slice(
              0,
              Math.floor(p(f, 10, 60, 0, 27)),
            )}
            <span style={{ opacity: f < 85 ? 1 : 0, color: "#bbb" }}>│</span>
          </div>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 420,
          width: 1600,
          display: "flex",
          gap: 100,
        }}
      >
        {[
          ["01", "Who is it for?", "Potential collaborators"],
          ["02", "What should they do?", "Explore the work"],
        ].map((v, i) => (
          <Reveal
            at={90 + i * 12}
            key={v[0]}
            style={{ flex: 1, borderTop: "1px solid #555", paddingTop: 35 }}
          >
            <div style={{ ...label, color: "#a5a5ac" }}>{v[0]}</div>
            <h2
              style={{
                fontSize: 51,
                letterSpacing: -2,
                fontWeight: 400,
                margin: "28px 0 22px",
              }}
            >
              {v[1]}
            </h2>
            <p style={{ fontSize: 34, color: "#b6b6bc" }}>{v[2]}</p>
          </Reveal>
        ))}
      </div>
      <Rule frame={f} at={110} y={870} />
      <Reveal
        at={112}
        style={{
          position: "absolute",
          left: 160,
          top: 910,
          ...label,
          fontSize: 20,
          color: "#999",
        }}
      >
        First, make the decisions explicit.
      </Reveal>
    </AbsoluteFill>
  );
}

function ReferenceArt({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <div
        style={{
          height: "100%",
          background: "#e5e4df",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("architecture.webp")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 28,
            right: 28,
            display: "flex",
            justifyContent: "space-between",
            background: "#ffffff55",
            padding: "14px 20px",
            border: "1px solid #fff9",
            borderRadius: 100,
            fontSize: 15,
          }}
        >
          <b>Studio</b>
          <span>Work / About</span>
        </div>
      </div>
    );
  if (kind === 1)
    return (
      <div
        style={{
          height: "100%",
          background: "#151515",
          color: "white",
          padding: 40,
        }}
      >
        <div style={{ ...label, fontSize: 13 }}>Selected work / 2026</div>
        <div
          style={{
            fontSize: 76,
            lineHeight: 0.95,
            letterSpacing: -5,
            marginTop: 45,
          }}
        >
          Ideas.
          <br />
          Made
          <br />
          visible.
        </div>
        <div style={{ height: 1, background: "#666", marginTop: 40 }} />
      </div>
    );
  return (
    <div style={{ height: "100%", background: "#f2f2ef", padding: 32 }}>
      <div style={{ fontSize: 25, letterSpacing: -1 }}>Turki Alshuaibi</div>
      <div
        style={{
          marginTop: 35,
          height: 140,
          background: "#d5d6d3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="220" height="130" viewBox="0 0 220 130">
          <path
            d="M30 100 90 25 150 100Z M90 25 180 45 150 100 M30 100H190"
            fill="none"
            stroke="#555"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div style={{ fontSize: 30, marginTop: 23 }}>Selected projects</div>
      <div
        style={{
          marginTop: 18,
          width: 190,
          borderRadius: 40,
          background: "#111",
          color: "white",
          padding: "10px 15px",
          fontSize: 14,
        }}
      >
        Explore the work ↗
      </div>
    </div>
  );
}
function References() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: paper, color: ink }}>
      <Signature />
      <Reveal style={{ position: "absolute", top: 170, left: 110 }}>
        <h2 style={{ ...title, fontSize: 96 }}>
          Find a direction
          <br />
          worth building.
        </h2>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 440,
          display: "flex",
          gap: 42,
          perspective: 1800,
        }}
      >
        {["Composition", "Typography", "Hierarchy"].map((v, i) => (
          <div
            key={v}
            style={{
              width: 538,
              opacity: p(f, 12 + i * 10, 35 + i * 10),
              transform: `translateX(${p(f, 12 + i * 10, 50 + i * 10, 180, 0)}px) rotateY(${p(f, 12 + i * 10, 65 + i * 10, -18, 0)}deg)`,
              boxShadow: "0 30px 55px #00000012",
              background: "white",
            }}
          >
            <div style={{ height: 362, overflow: "hidden" }}>
              <ReferenceArt kind={i} />
            </div>
            <div
              style={{
                padding: "22px 26px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: 24,
              }}
            >
              <span>{v}</span>
              <span style={{ color: "#777" }}>0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
      <Reveal
        at={126}
        style={{
          position: "absolute",
          left: 110,
          top: 950,
          fontSize: 28,
          color: "#555",
        }}
      >
        Clear hierarchy. Space for the work. One next step.
      </Reveal>
    </AbsoluteFill>
  );
}

function System() {
  const f = useCurrentFrame();
  const compress = p(f, 130, 185);
  return (
    <AbsoluteFill style={{ background: paper, color: ink }}>
      <Signature />
      <Grid opacity={0.55} />
      <Reveal style={{ position: "absolute", left: 110, top: 170 }}>
        <h2 style={{ ...title, fontSize: 92 }}>One visual system.</h2>
      </Reveal>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 365,
          width: 1700,
          height: 500,
          display: "flex",
          borderTop: "1px solid #bbb",
          borderBottom: "1px solid #bbb",
          transform: `scale(${1 - compress * 0.14}) translateY(${-compress * 15}px)`,
        }}
      >
        <div
          style={{
            width: 780,
            padding: "35px 45px 30px 0",
            borderRight: "1px solid #bbb",
          }}
        >
          <div style={label}>Type</div>
          <Reveal at={14}>
            <div style={{ fontSize: 220, letterSpacing: -16, lineHeight: 1.1 }}>
              Aa
            </div>
          </Reveal>
          <Reveal at={35}>
            <div style={{ fontSize: 32, color: "#777" }}>
              Clear. Measured. Legible.
            </div>
          </Reveal>
        </div>
        <div style={{ width: 920, padding: "35px 0 30px 55px" }}>
          <div style={label}>Material / Paper & ink</div>
          <div style={{ display: "flex", marginTop: 50, gap: 17 }}>
            {["#f8f8f6", "#d6d6d2", "#777773", "#111113"].map((c, i) => (
              <div
                key={c}
                style={{
                  width: 190,
                  height: p(f, 25 + i * 8, 60 + i * 8, 0, 180),
                  background: c,
                  border: "1px solid #0002",
                  boxShadow: "0 12px 25px #00000007",
                }}
              />
            ))}
          </div>
          <Reveal at={70}>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                alignItems: "center",
                gap: 30,
                fontFamily: mono,
                fontSize: 27,
              }}
            >
              {[8, 16, 32, 64].map((n) => (
                <div
                  key={n}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div style={{ height: 2, width: n, background: "#555" }} />
                  {n}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
      <Reveal
        at={120}
        style={{ position: "absolute", top: 940, left: 110, fontSize: 28 }}
      >
        Type, colour and spacing, decided together.
      </Reveal>
    </AbsoluteFill>
  );
}

function Brief() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ background: "#111113", color: paper, perspective: 1800 }}
    >
      <Grid dark />
      <Signature dark />
      <div style={{ position: "absolute", left: 110, top: 240, width: 560 }}>
        <Reveal>
          <h2 style={{ ...title, fontSize: 100 }}>
            The plan.
            <br />
            Before
            <br />
            the build.
          </h2>
        </Reveal>
        <Reveal at={80}>
          <div
            style={{
              marginTop: 50,
              fontSize: 34,
              lineHeight: 1.4,
              color: "#aaaab1",
            }}
          >
            One brief.
            <br />
            Every decision in it.
          </div>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          left: 780,
          top: 130,
          width: 950,
          height: 780,
          background: paper,
          color: ink,
          borderRadius: 8,
          boxShadow: "0 55px 100px #0008",
          transform: `translateY(${p(f, 0, 35, 200, 0)}px) rotateY(${p(f, 0, 70, -15, -3)}deg) rotateX(2deg)`,
          opacity: p(f, 0, 18),
        }}
      >
        <WindowBar />
        <div style={{ padding: "42px 55px" }}>
          <div style={{ ...label, fontSize: 19, color: "#777" }}>
            Turki Alshuaibi / Portfolio
          </div>
          <h3
            style={{
              fontSize: 53,
              fontWeight: 400,
              letterSpacing: -2,
              margin: "26px 0 30px",
            }}
          >
            Build brief
          </h3>
          {[
            ["Reader", "Potential collaborators"],
            ["Action", "Explore the work"],
            ["References", "Composition, type, hierarchy"],
            ["System", "Paper, ink, generous spacing"],
            ["Scope", "Work, about, contact"],
          ].map((v, i) => (
            <div
              key={v[0]}
              style={{
                opacity: p(f, 20 + i * 12, 38 + i * 12),
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                borderTop: "1px solid #ddd",
                padding: "19px 0",
                fontSize: 25,
              }}
            >
              <span style={{ color: "#777" }}>{v[0]}</span>
              <span>{v[1]}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: 55,
            bottom: 45,
            border: "2px solid #111",
            padding: "15px 25px",
            fontFamily: mono,
            fontSize: 26,
            letterSpacing: 5,
            transform: `scale(${p(f, 118, 132, 1.8, 1)}) rotate(-6deg)`,
            opacity: p(f, 118, 125),
          }}
        >
          APPROVED
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 970,
          left: 110,
          ...label,
          fontSize: 20,
          opacity: p(f, 135, 155),
          color: "#aaa",
        }}
      >
        Now the agent can build.
      </div>
    </AbsoluteFill>
  );
}

function Build() {
  const f = useCurrentFrame();
  const reveal = p(f, 65, 105);
  return (
    <AbsoluteFill style={{ background: paper, color: ink }}>
      <Signature />
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 160,
          opacity: 1 - reveal,
        }}
      >
        <h2 style={{ ...title, fontSize: 86 }}>
          Eight steps.
          <br />A site people can find.
        </h2>
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 455,
          width: 1700,
          opacity: 1 - reveal,
          display: "flex",
        }}
      >
        {[
          "Orient",
          "Decide",
          "Look",
          "Brief",
          "Build",
          "Verify",
          "Ship",
          "Index",
        ].map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              borderTop: "1px solid #aaa",
              paddingTop: 30,
              opacity: p(f, i * 5, i * 5 + 10),
            }}
          >
            <div
              style={{
                height: 38,
                width: 38,
                borderRadius: 50,
                background: ink,
                color: "white",
                fontSize: 19,
                display: "grid",
                placeItems: "center",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 26, marginTop: 24 }}>{s}</div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 190,
          width: 1580,
          height: 760,
          overflow: "hidden",
          borderRadius: 18,
          boxShadow: "0 35px 70px #0003",
          border: "1px solid #bbb",
          opacity: reveal,
          transform: `perspective(1800px) rotateX(${p(f, 65, 150, 12, 0)}deg) scale(${p(f, 65, 190, 0.85, 1)})`,
          background: "white",
        }}
      >
        <div
          style={{
            height: 42,
            background: "#ededeb",
            fontFamily: mono,
            fontSize: 17,
            display: "grid",
            placeItems: "center",
            color: "#555",
          }}
        >
          foreman.turkialshuaibi.com
        </div>
        <Img
          src={staticFile("foreman-site.png")}
          style={{
            width: "100%",
            display: "block",
            transform: `translateY(${p(f, 112, 239, 0, -5)}px)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 975,
          fontSize: 27,
          opacity: p(f, 120, 145),
        }}
      >
        Foreman's own site, built with the playbook.
      </div>
    </AbsoluteFill>
  );
}

function ToolIcon({ kind, progress }: { kind: number; progress: number }) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      {kind === 0 ? (
        <g>
          <rect x="12" y="12" width="30" height="30" rx="3" />
          <rect x="55" y="12" width="33" height="49" rx="3" />
          <rect x="12" y="55" width="30" height="33" rx="3" />
          <path d="M55 75h33M55 88h20" />
        </g>
      ) : kind === 1 ? (
        <g transform={`rotate(${progress * 18 - 9} 50 70)`}>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="37"
              y="10"
              width="28"
              height="78"
              rx="5"
              fill={["#777", "#bbb", "#f5f5f5"][i]}
              stroke="#222"
              transform={`rotate(${(i - 2) * 28} 50 75)`}
            />
          ))}
        </g>
      ) : kind === 2 ? (
        <g>
          <rect x="22" y="16" width="58" height="74" rx="5" />
          <rect x="37" y="10" width="28" height="13" rx="4" fill="#111113" />
          <path
            d="m34 53 12 12 24-27"
            strokeDasharray="60"
            strokeDashoffset={60 * (1 - progress)}
          />
        </g>
      ) : (
        <g transform={`translate(${progress * 6} ${-progress * 6})`}>
          <path d="M50 20c13-9 27-9 34-9 0 16-3 27-12 40L44 77 24 56Z" />
          <circle cx="65" cy="32" r="8" />
          <path d="m24 56-17 1 7-24 24-3M44 77l-2 17 24-9 4-24M24 74C13 74 9 83 8 93c12-1 20-7 20-15" />
        </g>
      )}
    </svg>
  );
}
function Tools() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: ink, color: paper }}>
      <Signature dark />
      <Reveal style={{ position: "absolute", left: 110, top: 170 }}>
        <h2 style={{ ...title, fontSize: 90 }}>Four tools. Yours to use.</h2>
      </Reveal>
      <div
        style={{
          position: "absolute",
          top: 390,
          left: 110,
          width: 1700,
          display: "flex",
        }}
      >
        {["Board", "Palette", "Punch list", "Launch"].map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              opacity: p(f, i * 10, 25 + i * 10),
              transform: `translateY(${p(f, i * 10, 35 + i * 10, 80, 0)}px)`,
              borderLeft: i ? "1px solid #444" : undefined,
              paddingLeft: i ? 55 : 0,
            }}
          >
            <ToolIcon kind={i} progress={p(f, 15 + i * 10, 70 + i * 10)} />
            <h3
              style={{
                fontSize: 43,
                letterSpacing: -1.7,
                fontWeight: 400,
                margin: "35px 0 20px",
              }}
            >
              {s}
            </h3>
            <div style={{ fontSize: 25, color: "#aaa" }}>
              {
                [
                  "Find a direction",
                  "Choose a system",
                  "Find what needs fixing",
                  "Get the site online",
                ][i]
              }
            </div>
          </div>
        ))}
      </div>
      <Reveal
        at={84}
        style={{
          position: "absolute",
          left: 110,
          top: 930,
          fontSize: 29,
          color: "#bbb",
        }}
      >
        Use one tool, or follow the whole playbook.
      </Reveal>
    </AbsoluteFill>
  );
}

function Closing() {
  return (
    <AbsoluteFill
      style={{
        background: paper,
        color: ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid opacity={0.35} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 280,
          textAlign: "center",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
            }}
          >
            <Mark size={155} />
            <div style={{ fontSize: 146, fontWeight: 500, letterSpacing: -8 }}>
              Foreman
            </div>
          </div>
        </Reveal>
        <Reveal at={22}>
          <div style={{ fontSize: 35, color: "#555", marginTop: 38 }}>
            By Turki Alshuaibi
          </div>
        </Reveal>
        <Reveal at={45}>
          <div style={{ fontSize: 40, letterSpacing: -1, marginTop: 105 }}>
            Give your agent a plan.
          </div>
        </Reveal>
        <Reveal at={65}>
          <div style={{ fontSize: 26, marginTop: 25, color: "#666" }}>
            Free and open source.
          </div>
        </Reveal>
      </div>
      <Reveal
        at={62}
        style={{
          position: "absolute",
          top: 920,
          width: "100%",
          textAlign: "center",
          fontSize: 31,
          letterSpacing: -0.8,
        }}
      >
        foreman.turkialshuaibi.com
      </Reveal>
    </AbsoluteFill>
  );
}

export function Film() {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif" }}>
      <Audio src={staticFile("before-the-code-effects.m4a")} />
      <Sequence name="Before the code"  durationInFrames={144}>
        <Opening />
      </Sequence>
      <Sequence name="The request" from={144} durationInFrames={168}>
        <Request />
      </Sequence>
      <Sequence name="References" from={312} durationInFrames={216}>
        <References />
      </Sequence>
      <Sequence name="Visual system" from={528} durationInFrames={192}>
        <System />
      </Sequence>
      <Sequence name="Build brief" from={720} durationInFrames={192}>
        <Brief />
      </Sequence>
      <Sequence name="Build and discover" from={912} durationInFrames={240}>
        <Build />
      </Sequence>
      <Sequence name="Toolbelt" from={1152} durationInFrames={144}>
        <Tools />
      </Sequence>
      <Sequence name="Foreman" from={1296} durationInFrames={144}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
}

export const MyComposition = () => (
  <Composition
    id="BeforeTheCode"
    component={Film}
    durationInFrames={1440}
    fps={24}
    width={1920}
    height={1080}
  />
);
