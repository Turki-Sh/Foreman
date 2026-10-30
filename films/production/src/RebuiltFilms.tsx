import React from "react";
import {
  AbsoluteFill,
  Composition,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { Audio } from "@remotion/media";
import { MaterialStage } from "./MaterialStage";
import data from "./rebuild-timings.json";

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const v = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const abs: React.CSSProperties = { position: "absolute" };
const blue = "#3268fa",
  paper = "#f2f4f7",
  ink = "#10131b";
const asset = (name: string) => staticFile("rebuild/" + name + ".png");
const Hat: React.FC<{ size?: number }> = ({ size = 58 }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 48 38" fill="none">
    <path
      d="M7 29v-4c0-8 5-14 13-16V7c0-2 1-3 4-3s4 1 4 3v2c8 2 13 8 13 16v4h2c2 0 3 2 3 4s-2 4-5 4H7c-3 0-5-2-5-4s1-4 3-4Z"
      stroke="currentColor"
      strokeWidth="2.5"
    />
    <path d="M20 10v15m8-15v15" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);
const Brand: React.FC<{ light?: boolean; tool?: string }> = ({
  light = false,
  tool = "",
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      color: light ? "white" : ink,
      fontSize: 38,
      fontWeight: 500,
    }}
  >
    <Hat />
    Foreman
    {tool && <span style={{ fontWeight: 400, opacity: 0.6 }}> / {tool}</span>}
  </div>
);
const Type: React.FC<{
  text: string;
  t: number;
  size?: number;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ text, t, size = 150, style = {}, delay = 0 }) => (
  <div
    style={{
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-.065em",
      fontWeight: 500,
      ...style,
    }}
  >
    {text.split(" ").map((w, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          marginRight: ".22em",
          transform: `translateY(${v(t, delay + i * 0.055, delay + i * 0.055 + 0.52, 80, 0)}px)`,
          opacity: v(t, delay + i * 0.055, delay + i * 0.055 + 0.18),
          filter: `blur(${v(t, delay + i * 0.055, delay + i * 0.055 + 0.4, 12, 0)}px)`,
        }}
      >
        {w}
      </span>
    ))}
  </div>
);
const Rule: React.FC<{ width?: number; light?: boolean }> = ({
  width = 100,
  light = false,
}) => (
  <div
    style={{
      height: 10,
      borderRadius: 8,
      width: width + "%",
      background: light ? "#ffffff28" : "#10131b18",
      marginTop: 17,
    }}
  />
);
const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({
  x,
  y,
  press = 0,
}) => (
  <svg
    width="55"
    height="65"
    viewBox="0 0 40 50"
    style={{
      ...abs,
      left: x,
      top: y,
      filter: "drop-shadow(0 4px 8px #0004)",
      transform: `scale(${1 - press * 0.2})`,
    }}
  >
    <path
      d="M4 3v37l10-10 8 16 7-4-8-15h14Z"
      fill="#fff"
      stroke="#111"
      strokeWidth="2"
    />
  </svg>
);
const Terminal: React.FC<{
  t: number;
  command: string;
  lines: string[];
  style?: React.CSSProperties;
}> = ({ t, command, lines, style = {} }) => (
  <div
    style={{
      background: "#080b12",
      color: "#f7f8fc",
      border: "1px solid #303644",
      borderRadius: 30,
      boxShadow: "0 70px 150px #0004",
      padding: 48,
      ...style,
    }}
  >
    <div style={{ display: "flex", gap: 10, marginBottom: 48 }}>
      {["#e9a092", "#f0d58f", "#98c8af"].map((c) => (
        <i
          key={c}
          style={{ width: 12, height: 12, borderRadius: 9, background: c }}
        />
      ))}
    </div>
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 32,
        color: "#b9d2ff",
        marginBottom: 38,
        whiteSpace: "pre-wrap",
      }}
    >
      ❯ {command.slice(0, Math.floor(v(t, 0.1, 0.9, 0, command.length)))}
      <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span>
    </div>
    {lines.map((line, i) => (
      <div
        key={line}
        style={{
          fontSize: 25,
          fontFamily: "monospace",
          lineHeight: 1.6,
          marginTop: 19,
          opacity: v(t, 0.7 + i * 0.4, 1 + i * 0.4),
          transform: `translateY(${v(t, 0.7 + i * 0.4, 1 + i * 0.4, 20, 0)}px)`,
        }}
      >
        <span style={{ color: "#91cbb8" }}>→ </span>
        {line}
      </div>
    ))}
  </div>
);
const WebPage: React.FC<{
  fixed?: boolean;
  mobile?: boolean;
  t?: number;
  palette?: boolean;
  dark?: boolean;
}> = ({
  fixed = true,
  mobile = false,
  t = 0,
  palette = false,
  dark = false,
}) => {
  const bg = dark ? "#101828" : palette ? "#f5f2e9" : "#fbfbf9",
    fg = dark ? "#f5f2e9" : ink;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg,
        color: fg,
        padding: mobile ? 36 : 54,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: mobile ? 18 : 22,
          borderBottom: `1px solid ${dark ? "#ffffff22" : "#0002"}`,
          paddingBottom: 24,
        }}
      >
        <b>Selected work</b>
        <span>About {mobile ? "" : " / Contact"}</span>
      </div>
      <div
        style={{
          fontSize: mobile ? 62 : 100,
          lineHeight: 1.02,
          letterSpacing: "-.07em",
          maxWidth: 720,
          marginTop: 60,
          color: fixed ? fg : "#9ea6b4",
        }}
      >
        {" "}
        {fixed ? "Ideas, made useful." : "Welcome to my website."}
      </div>
      <div
        style={{
          fontSize: mobile ? 22 : 28,
          lineHeight: 1.5,
          marginTop: 28,
          maxWidth: 570,
          color: fixed ? (dark ? "#b8c6d8" : "#4b5565") : "#adb2bc",
        }}
      >
        Engineering and design.
        <br />
        See the thinking behind the work.
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {(fixed
          ? ["See the work"]
          : ["Learn more", "Get started", "Explore"]
        ).map((s) => (
          <div
            key={s}
            style={{
              borderRadius: 50,
              padding: mobile ? "14px 22px" : "18px 32px",
              fontSize: mobile ? 20 : 25,
              background: palette ? blue : fixed ? fg : "#d4d9e2",
              color: palette ? "white" : bg,
            }}
          >
            {s} ↗
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1.4fr 1fr",
          gap: 20,
          marginTop: 45,
        }}
      >
        <div
          style={{
            height: 300,
            borderRadius: 20,
            background: palette ? "#b8e6d3" : "#d9e1e8",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              ...abs,
              width: 320,
              height: 320,
              border: "35px solid " + (palette ? blue : "#677e9b"),
              borderRadius: "50%",
              left: 130,
              top: 55,
              transform: `rotateX(55deg) rotateZ(${t * 8}deg)`,
            }}
          />
          <span style={{ ...abs, left: 25, top: 25, color: ink, fontSize: 22 }}>
            01 / Systems
          </span>
        </div>
        {!mobile && (
          <div
            style={{
              height: 300,
              borderRadius: 20,
              background: dark ? "#1e2c3e" : "#eae8e2",
              padding: 30,
              fontSize: 22,
            }}
          >
            02 / Experiments
            <Rule />
            <Rule width={75} />
            <Rule width={90} />
          </div>
        )}
      </div>
    </div>
  );
};
const Window: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style = {} }) => (
  <div
    style={{
      border: "2px solid #ffffff80",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 65px 120px #0003",
      background: "#fff",
      ...style,
    }}
  >
    {children}
  </div>
);
const Sample: React.FC<{ n: number }> = ({ n }) => {
  const k = n % 6;
  return (
    <div
      style={{
        height: "100%",
        background: [
          "#172633",
          "#f3e3cb",
          "#edf1f5",
          "#d8e9df",
          "#050609",
          "#f3f1ec",
        ][k],
        padding: 32,
        color: k === 0 || k === 4 ? "#fff" : ink,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 16,
          borderBottom: "1px solid currentColor",
          paddingBottom: 12,
        }}
      >
        Selected work / {String(n + 1).padStart(2, "0")}
      </div>
      <div
        style={{
          fontSize: 52,
          lineHeight: 1,
          letterSpacing: "-.06em",
          marginTop: 30,
          maxWidth: 310,
        }}
      >
        {
          [
            "Built for tomorrow.",
            "A different perspective.",
            "Less, but clearer.",
            "Room to explore.",
            "Make the work speak.",
            "Start with a question.",
          ][k]
        }
      </div>
      <div
        style={{
          ...abs,
          left: 32,
          right: 32,
          top: 300,
          bottom: 32,
          overflow: "hidden",
        }}
      >
        {k === 1 && (
          <Img
            src={staticFile("architecture.webp")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "25% 80%",
            }}
          />
        )}
        {k === 4 && (
          <Img
            src={staticFile("rebuild/robot.webp")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 30%",
            }}
          />
        )}
        {k === 2 && (
          <Img
            src={asset("home")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              borderRadius: 12,
            }}
          />
        )}
        {k === 0 && (
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
          >
            {Array.from({ length: 18 }, (_, i) => (
              <path
                key={i}
                d={`M -60 ${40 + i * 17} C 90 ${-60 + i * 17}, 230 ${390 - i * 8}, 480 ${60 + i * 18}`}
                stroke={i % 3 === 0 ? "#a8d9ee" : "#467f9c"}
                strokeWidth={i % 3 === 0 ? 3 : 1.5}
                fill="none"
              />
            ))}
          </svg>
        )}
        {k === 3 && (
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            <path
              d="M40 290H110V180H210V90H350M40 140H130V250H290V330H360"
              fill="none"
              stroke="#376553"
              strokeWidth="2"
            />
            {[
              [110, 180],
              [210, 90],
              [130, 250],
              [290, 330],
            ].map(([x, y], i) => (
              <g key={i}>
                <rect
                  x={x - 27}
                  y={y - 27}
                  width="54"
                  height="54"
                  rx="8"
                  fill="#d8e9df"
                  stroke="#376553"
                  strokeWidth="2"
                />
                <rect
                  x={x - 12}
                  y={y - 12}
                  width="24"
                  height="24"
                  rx="2"
                  fill="#376553"
                />
              </g>
            ))}
          </svg>
        )}
        {k === 5 && (
          <div
            style={{
              fontFamily: "Georgia,serif",
              fontSize: 260,
              letterSpacing: "-.1em",
              color: "#b65b35",
              transform: "rotate(-12deg)",
              lineHeight: 1,
            }}
          >
            Aa
            <span style={{ fontSize: 90, display: "block", letterSpacing: 0 }}>
              012345
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const End: React.FC<{ t: number; tool: string; line: string }> = ({
  t,
  tool,
  line,
}) => (
  <AbsoluteFill
    style={{
      background: "#050609",
      color: "#fff",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        transform: `scale(${v(t, 0, 0.6, 0.9, 1)})`,
        opacity: v(t, 0, 0.35),
      }}
    >
      <Brand light tool={tool} />
    </div>
    <Type
      text={line}
      t={t}
      delay={0.25}
      size={128}
      style={{ maxWidth: 1550, textAlign: "center", marginTop: 65 }}
    />
    <div
      style={{
        fontSize: 30,
        color: "#a9b1c0",
        marginTop: 65,
        opacity: v(t, 0.8, 1.3),
      }}
    >
      foreman.turkialshuaibi.com{" "}
      <span style={{ marginLeft: 30, color: "white" }}>↗</span>
    </div>
  </AbsoluteFill>
);

const Main: React.FC<{ shot: number; t: number; d: number }> = ({
  shot,
  t,
  d,
}) => {
  if (shot === 0)
    return (
      <AbsoluteFill
        style={{
          background: "#050609",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${v(t, 1.7, 3.9, 1, 0.35)})`,
            opacity: 1 - v(t, 2.1, 3.5),
          }}
        >
          <Type text="An idea." t={t} size={235} />
        </div>
        <div
          style={{
            ...abs,
            inset: 0,
            perspective: 1400,
            opacity: v(t, 1.8, 2.5),
            transform: `scale(${v(t, 1.8, 4.3, 2.4, 1)}) rotate(-8deg)`,
          }}
        >
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                ...abs,
                left: (i % 5) * 450 - 140,
                top: Math.floor(i / 5) * 360 - 70,
                width: 390,
                height: 300,
                opacity: 0.3 + (i % 3) * 0.2,
              }}
            >
              <Sample n={2} />
            </div>
          ))}
        </div>
        <div
          style={{
            ...abs,
            left: 150,
            bottom: 130,
            fontSize: 76,
            letterSpacing: "-.05em",
            opacity: v(t, 2.4, 2.8),
            background: "#050609",
            padding: 20,
          }}
        >
          A thousand defaults.
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill
        style={{
          background: blue,
          color: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            ...abs,
            inset: 0,
            transform: `translateX(${v(t, 0, 0.7, 1200, 0)}px)`,
          }}
        >
          <MaterialStage time={t} mode="gates" dark colour={blue} zoom={1.35} />
        </div>
        <Type
          text="Choose a direction."
          t={t}
          size={165}
          style={{
            position: "relative",
            maxWidth: 1100,
            textAlign: "center",
            textShadow: "0 8px 35px #0007",
          }}
        />
        <div style={{ ...abs, bottom: 90, left: 110, opacity: v(t, 1, 1.5) }}>
          <Brand light />
        </div>
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill style={{ background: paper, color: ink }}>
        <div style={{ ...abs, left: 130, top: 120, fontSize: 32 }}>
          Start with a person.
        </div>
        <Type
          text="Who is this for?"
          t={t}
          size={148}
          style={{ ...abs, left: 130, top: 230, width: 950 }}
        />
        <div
          style={{
            ...abs,
            left: 140,
            top: 570,
            width: 820,
            padding: 35,
            borderLeft: "5px solid " + blue,
            fontSize: 45,
            lineHeight: 1.3,
            transform: `translateX(${v(t, 1.2, 1.8, -80, 0)}px)`,
            opacity: v(t, 1.2, 1.6),
          }}
        >
          Engineering teams.
          <br />
          <span style={{ color: "#657082" }}>They need to see the work.</span>
        </div>
        <Terminal
          t={t}
          command="help me build my portfolio"
          lines={[
            "Read project-notes.md",
            "Who needs this website?",
            "What should they do next?",
          ]}
          style={{
            ...abs,
            left: 1120,
            top: 210,
            width: 760,
            transform: `perspective(1600px) rotateY(-14deg) translateX(${v(t, 0, 0.9, 320, 0)}px)`,
          }}
        />
      </AbsoluteFill>
    );
  if (shot === 3) return <Board shot={3} t={t} d={d} />;
  if (shot === 4)
    return (
      <AbsoluteFill style={{ color: ink }}>
        <MaterialStage time={t} mode="sheets" zoom={1.05} />
        <div style={{ ...abs, left: 120, top: 110 }}>
          <Type text="One brief." t={t} size={140} />
          <div style={{ fontSize: 31, marginTop: 22, opacity: v(t, 0.6, 1) }}>
            Every decision, in one place.
          </div>
        </div>
        <div
          style={{
            ...abs,
            right: 140,
            bottom: 110,
            borderRadius: 70,
            background: blue,
            color: "white",
            fontSize: 35,
            padding: "26px 42px",
            transform: `scale(${v(t, 2.8, 3.3, 0.7, 1)})`,
            opacity: v(t, 2.8, 3.1),
          }}
        >
          ✓ Approved to build
        </div>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <AbsoluteFill style={{ background: "#050609", perspective: 1800 }}>
        <div
          style={{
            ...abs,
            inset: "90px 180px",
            transform: `rotateY(${v(t, 0, 1.2, -25, 0)}deg) scale(${v(t, 0, 4.5, 0.8, 1.08)})`,
          }}
        >
          <Terminal
            t={t}
            command="Build from BRIEF.md"
            lines={[
              "Read the approved direction",
              "Apply the type and colour tokens",
              "Build the page structure",
              "Check the result against the brief",
            ]}
            style={{ height: 760 }}
          />
          <div
            style={{
              ...abs,
              inset: 0,
              clipPath: `inset(0 ${100 - v(t, 1.5, 2.8, 0, 100)}% 0 0)`,
              borderRadius: 25,
              overflow: "hidden",
            }}
          >
            <WebPage t={t} />
          </div>
          <div
            style={{
              ...abs,
              top: 0,
              bottom: 0,
              left: `${v(t, 1.5, 2.8, 0, 100)}%`,
              width: 3,
              background: "#97f3d1",
              opacity: 1 - v(t, 2.9, 3.2),
            }}
          />
        </div>
      </AbsoluteFill>
    );
  if (shot === 6)
    return (
      <AbsoluteFill style={{ background: "#eef0f5", perspective: 1700 }}>
        <div
          style={{
            ...abs,
            left: 200,
            top: 110,
            width: 1500,
            height: 880,
            transform: `rotateX(${v(t, 0, 3.5, 30, 0)}deg) rotateZ(${v(t, 0, 3.5, -8, 0)}deg) scale(${v(t, 0, 3.8, 1.05, 0.85)})`,
            transformOrigin: "50% 30%",
            boxShadow: "0 80px 150px #10182840",
            borderRadius: 24,
            overflow: "hidden",
          }}
        >
          <Img src={asset("home")} style={{ width: "100%" }} />
        </div>
        {["Contrast", "Mobile", "Links", "Share card"].map((s, i) => (
          <div
            key={s}
            style={{
              ...abs,
              left: 130 + i * 440,
              top: 850,
              background: "#0e1724",
              color: "white",
              padding: "22px 32px",
              borderRadius: 60,
              fontSize: 30,
              transform: `translateY(${v(t, 0.4 + i * 0.25, 1 + i * 0.25, 180, 0)}px)`,
              opacity: v(t, 0.4 + i * 0.25, 0.7 + i * 0.25),
            }}
          >
            <span style={{ color: "#b8e6d3" }}>✓</span> {s}
          </div>
        ))}
      </AbsoluteFill>
    );
  return <End t={t} tool="" line="Your idea. Built with intention." />;
};

const Board: React.FC<{ shot: number; t: number; d: number }> = ({
  shot,
  t,
  d,
}) => {
  if (shot === 0)
    return (
      <AbsoluteFill
        style={{ background: "#e9ded0", color: "#302722", perspective: 1600 }}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              ...abs,
              width: 480,
              height: 610,
              left: 720 + (i - 3) * v(t, 0.2, 2.5, 35, 270),
              top: 230 + Math.abs(i - 3) * 40,
              transform: `rotate(${(i - 3) * v(t, 0.2, 2.3, 2, 7)}deg) translateY(${v(t, 0, 0.6, 600, 0)}px)`,
              boxShadow: "0 35px 50px #30272230",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <Sample n={i} />
          </div>
        ))}
        <Type
          text="I like this."
          t={t}
          size={155}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <div
          style={{
            ...abs,
            right: 140,
            bottom: 70,
            fontSize: 85,
            zIndex: 2,
            background: "#e9ded0",
            padding: "12px 24px",
            borderRadius: 12,
            opacity: v(t, 2.4, 2.9),
          }}
        >
          But why?
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill style={{ background: "#121315", color: "white" }}>
        <div
          style={{
            ...abs,
            left: -180,
            top: -100,
            width: 2250,
            display: "grid",
            gridTemplateColumns: "repeat(6,1fr)",
            gap: 20,
            transform: `translateY(${-t * 70}px) rotate(-10deg) scale(${v(t, 0, 3.7, 1, 1.15)})`,
            opacity: 0.6,
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} style={{ height: 330 }}>
              <Sample n={i} />
            </div>
          ))}
        </div>
        <div
          style={{
            ...abs,
            inset: 0,
            background: "radial-gradient(ellipse,#10131520,#101315dd)",
          }}
        />
        <Type
          text="Saved ≠ decided."
          t={t}
          size={162}
          style={{ ...abs, left: 190, top: 400 }}
        />
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill style={{ background: "#eee9e2", color: ink }}>
        <Type
          text="Give it the brief."
          t={t}
          size={135}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <Terminal
          t={t}
          command="/foreman:board an engineering portfolio"
          lines={[
            "Read the audience and purpose",
            "Find relevant live references",
            "Explain what to take from each",
          ]}
          style={{
            ...abs,
            left: 210,
            top: 310,
            width: 1370,
            transform: `perspective(1600px) rotateX(${v(t, 0, 1.2, 13, 0)}deg)`,
          }}
        />
      </AbsoluteFill>
    );
  if (shot === 3)
    return (
      <AbsoluteFill
        style={{ background: "#e9ded0", color: ink, perspective: 1800 }}
      >
        <div
          style={{
            ...abs,
            left: 610,
            top: 100,
            width: 750,
            height: 840,
            transform: `rotateY(${v(t, 0, 2, -22, 0)}deg) scale(${v(t, 0, 2.8, 0.8, 1)})`,
            boxShadow: "0 60px 100px #35271930",
          }}
        >
          <Sample n={1} />
          <div
            style={{
              ...abs,
              left: 30,
              right: 30,
              top: 95,
              height: 215,
              border: "3px solid #a44d25",
              opacity: v(t, 0.5, 0.9),
            }}
          />
        </div>
        {[
          ["Hierarchy", 130, 300],
          ["Spacing", 1410, 520],
          ["Movement", 150, 750],
        ].map(([s, x, y], i) => (
          <div
            key={String(s)}
            style={{
              ...abs,
              left: Number(x),
              top: Number(y),
              fontSize: 52,
              opacity: v(t, 0.4 + i * 0.5, 0.9 + i * 0.5),
              transform: `translateX(${v(t, 0.4 + i * 0.5, 0.9 + i * 0.5, i % 2 ? 100 : -100, 0)}px)`,
            }}
          >
            {s}
            <div
              style={{
                height: 2,
                width: 280,
                background: "#a44d25",
                marginTop: 20,
                transformOrigin: "left",
                transform: `scaleX(${v(t, 0.7 + i * 0.5, 1.3 + i * 0.5)})`,
              }}
            />
          </div>
        ))}
      </AbsoluteFill>
    );
  if (shot === 4)
    return (
      <AbsoluteFill style={{ background: "#fff", color: ink }}>
        <Type
          text="Take the principle."
          t={t}
          size={135}
          style={{ ...abs, left: 130, top: 120 }}
        />
        <div
          style={{
            ...abs,
            left: 160,
            top: 365,
            width: 660,
            height: 500,
            transform: `translateX(${v(t, 0, 1, -180, 0)}px)`,
          }}
        >
          <Sample n={1} />
        </div>
        <div
          style={{ ...abs, left: 960, top: 390, fontSize: 52, lineHeight: 1.8 }}
        >
          {[
            "One clear headline",
            "Space around the work",
            "A visible next step",
          ].map((s, i) => (
            <div
              key={s}
              style={{
                opacity: v(t, 0.5 + i * 0.5, 0.9 + i * 0.5),
                transform: `translateX(${v(t, 0.5 + i * 0.5, 0.9 + i * 0.5, 70, 0)}px)`,
              }}
            >
              <span style={{ color: "#a44d25" }}>↗ </span>
              {s}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <AbsoluteFill
        style={{ background: "#e9ded0", color: ink, perspective: 1600 }}
      >
        <div
          style={{
            ...abs,
            left: 280,
            top: 140,
            width: 1360,
            height: 780,
            background: "#fcfbf8",
            padding: 75,
            boxSizing: "border-box",
            boxShadow: "0 50px 90px #60482c30",
            transform: `rotateX(${v(t, 0, 2, 35, 0)}deg) rotateZ(${v(t, 0, 2, -7, 0)}deg)`,
          }}
        >
          <Brand tool="Board" />
          <div style={{ fontSize: 82, letterSpacing: "-.06em", marginTop: 45 }}>
            A direction, not a collection.
          </div>
          <div style={{ display: "flex", gap: 35, marginTop: 55 }}>
            {["Type", "Colour", "Composition"].map((s, i) => (
              <div
                key={s}
                style={{
                  width: 360,
                  opacity: v(t, 0.5 + i * 0.3, 1 + i * 0.3),
                }}
              >
                <div
                  style={{
                    height: 180,
                    background: ["#1c232d", "#c37645", "#d9e1e8"][i],
                    padding: 25,
                    color: "white",
                    fontSize: i === 0 ? 95 : 35,
                  }}
                >
                  {i === 0 ? "Aa" : i === 1 ? "●" : "▤"}
                </div>
                <div style={{ fontSize: 28, marginTop: 20 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    );
  if (shot === 6)
    return (
      <AbsoluteFill style={{ background: "#e9ded0", perspective: 1600 }}>
        <div
          style={{
            ...abs,
            left: 370,
            top: -340,
            width: 1180,
            height: 2100,
            transform: `rotateX(${v(t, 0, d, 48, 4)}deg) translateY(${-v(t, 0, d, 0, 400)}px)`,
            transformOrigin: "50% 30%",
            boxShadow: "0 60px 100px #0003",
          }}
        >
          <div style={{ height: 1120 }}>
            <WebPage t={t} />
          </div>
          <div style={{ padding: 70, background: "#fbfbf9", fontSize: 80 }}>
            The thinking behind the work.
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 35,
                marginTop: 60,
              }}
            >
              <div style={{ height: 550 }}>
                <Sample n={4} />
              </div>
              <div style={{ height: 550 }}>
                <Sample n={3} />
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  return <End t={t} tool="Board" line="Less guessing. More direction." />;
};

const Punch: React.FC<{ shot: number; t: number; d: number }> = ({
  shot,
  t,
}) => {
  if (shot === 0)
    return (
      <AbsoluteFill
        style={{ background: "#e7ebed", color: ink, perspective: 1500 }}
      >
        <Window
          style={{
            ...abs,
            left: 420,
            top: 120,
            width: 1200,
            height: 900,
            transform: `rotateY(-9deg) scale(${v(t, 0, 3.5, 0.92, 1.02)})`,
          }}
        >
          <WebPage fixed={false} />
        </Window>
        <div
          style={{
            ...abs,
            left: 110,
            top: 100,
            fontSize: 110,
            fontWeight: 500,
            letterSpacing: "-.06em",
          }}
        >
          It works.
        </div>
        <div
          style={{
            ...abs,
            left: 110,
            top: 790,
            fontSize: 110,
            fontWeight: 500,
            letterSpacing: "-.06em",
            color: "#c44435",
            opacity: v(t, 1.6, 2.2),
          }}
        >
          Something is off.
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill style={{ background: "#fcfcfa", color: ink }}>
        <div
          style={{
            ...abs,
            left: 350,
            top: 100,
            width: 1400,
            height: 1050,
            transformOrigin: "left top",
            transform: `scale(${v(t, 0, 3.8, 1, 1.04)})`,
          }}
        >
          <WebPage fixed={false} />
        </div>
        <div
          style={{
            ...abs,
            left: 320,
            top: 220,
            width: 1240,
            height: 440,
            border: "5px solid #d75543",
            borderRadius: 15,
            boxShadow: "0 0 0 1000px #10182880",
            transform: `scale(${v(t, 0, 0.7, 1.5, 1)})`,
          }}
        />
        <div
          style={{
            ...abs,
            left: 350,
            top: 720,
            fontSize: 80,
            letterSpacing: "-.05em",
            color: "#fff",
          }}
        >
          Find the actual problem.
        </div>
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill style={{ background: "#10151c", color: "white" }}>
        <div style={{ ...abs, left: 130, top: 115 }}>
          <Brand light tool="Punch list" />
        </div>
        <Terminal
          t={t}
          command="/foreman:punch-list inspect this page"
          lines={[
            "Read the page as a visitor",
            "Inspect hierarchy, contrast and mobile",
            "Return specific changes by priority",
          ]}
          style={{
            ...abs,
            left: 150,
            top: 320,
            width: 1500,
            border: "none",
            background: "transparent",
            boxShadow: "none",
          }}
        />
      </AbsoluteFill>
    );
  if (shot === 3)
    return (
      <AbsoluteFill style={{ background: "#f4f5f1", color: ink }}>
        <div
          style={{
            ...abs,
            left: 140,
            top: 160,
            fontSize: 34,
            color: "#637180",
          }}
        >
          01 / Say something specific
        </div>
        <div
          style={{
            ...abs,
            left: 140,
            top: 290,
            fontSize: 122,
            lineHeight: 1.03,
            letterSpacing: "-.07em",
            width: 1600,
          }}
        >
          <span style={{ opacity: 1 - v(t, 0.7, 1.1), position: "absolute" }}>
            Welcome to my website.
          </span>
          <span style={{ opacity: v(t, 0.7, 1.1) }}>Ideas, made useful.</span>
          <div
            style={{
              ...abs,
              top: 70,
              left: 0,
              width: v(t, 0.3, 0.7, 0, 1500),
              height: 5,
              background: "#d75543",
              opacity: 1 - v(t, 0.7, 1.1),
            }}
          />
        </div>
        <div style={{ ...abs, left: 150, top: 650, display: "flex", gap: 30 }}>
          {["Learn more", "Get started", "Explore"].map((s, i) => (
            <div
              key={s}
              style={{
                fontSize: 38,
                padding: "28px 45px",
                borderRadius: 70,
                border: "1px solid #aaa",
                transform: `translateX(${i * v(t, 1.6, 2.5, 0, -300)}px) scale(${i === 0 ? 1 : 1 - v(t, 1.6, 2.4)})`,
                opacity: i === 0 ? 1 : 1 - v(t, 1.6, 2.3),
                background: i === 0 && t > 2 ? "#101828" : "transparent",
                color: i === 0 && t > 2 ? "white" : ink,
              }}
            >
              {i === 0 && t > 2 ? "See the work ↗" : s}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  if (shot === 4)
    return (
      <AbsoluteFill style={{ background: "#10151c", color: "white" }}>
        <Type
          text="Make it readable."
          t={t}
          size={115}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <div
          style={{
            ...abs,
            left: 150,
            top: 350,
            width: 900,
            fontSize: 100,
            letterSpacing: "-.055em",
            lineHeight: 1.15,
            color: t < 1.1 ? "#404750" : "#f7f7f1",
          }}
        >
          Good work deserves
          <br />
          to be seen.
        </div>
        <div
          style={{
            ...abs,
            right: 150,
            top: 130,
            width: v(t, 0, 2.5, 670, 430),
            height: 840,
            border: "13px solid #66707e",
            borderRadius: 60,
            overflow: "hidden",
            transform: `rotateY(${v(t, 0, 2.5, -15, 0)}deg)`,
            boxShadow: "0 50px 90px #0008",
          }}
        >
          <WebPage mobile t={t} />
        </div>
        <div
          style={{
            ...abs,
            left: 150,
            top: 780,
            fontSize: 35,
            color: "#b8e6d3",
            opacity: v(t, 1.8, 2.3),
          }}
        >
          Contrast ↑ <span style={{ marginLeft: 65 }}>Mobile ✓</span>
        </div>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <AbsoluteFill style={{ background: "#dce9e4", color: ink }}>
        <Type
          text="Now you know what to fix."
          t={t}
          size={112}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <div style={{ ...abs, left: 200, top: 330, right: 200 }}>
          {[
            ["01", "Replace the vague headline", "High"],
            ["02", "Give the main action priority", "High"],
            ["03", "Increase text contrast", "High"],
            ["04", "Fix the mobile layout", "Medium"],
          ].map(([n, text, priority], i) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 35,
                padding: "28px 0",
                borderBottom: "1px solid #10201933",
                fontSize: 39,
                transform: `translateX(${v(t, 0.2 + i * 0.18, 0.7 + i * 0.18, 300, 0)}px)`,
                opacity: v(t, 0.2 + i * 0.18, 0.5 + i * 0.18),
              }}
            >
              <span style={{ fontSize: 26, color: "#577568" }}>{n}</span>
              <span style={{ flex: 1 }}>{text}</span>
              <span
                style={{
                  fontSize: 23,
                  border: "1px solid #506859",
                  borderRadius: 50,
                  padding: "12px 22px",
                }}
              >
                {priority}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  if (shot === 6)
    return (
      <AbsoluteFill style={{ background: "#10151c", color: "white" }}>
        <Window
          style={{
            ...abs,
            left: 260,
            top: 70,
            width: 1400,
            height: 930,
            transform: `scale(${v(t, 0, 3.6, 0.9, 1)})`,
          }}
        >
          <WebPage fixed={false} />
          <div
            style={{
              ...abs,
              inset: 0,
              clipPath: `inset(0 ${100 - v(t, 0.2, 2.3, 0, 100)}% 0 0)`,
            }}
          >
            <WebPage fixed t={t} />
          </div>
        </Window>
        <div
          style={{
            ...abs,
            right: 115,
            bottom: 70,
            padding: "22px 36px",
            background: "#b8e6d3",
            color: ink,
            borderRadius: 70,
            fontSize: 36,
            opacity: v(t, 2.3, 2.8),
          }}
        >
          Checked again ✓
        </div>
      </AbsoluteFill>
    );
  return <End t={t} tool="Punch list" line="Fix what gets in the way." />;
};

const Palette: React.FC<{ shot: number; t: number; d: number }> = ({
  shot,
  t,
}) => {
  if (shot === 0)
    return (
      <AbsoluteFill style={{ color: "white" }}>
        <MaterialStage time={t} mode="ribbon" dark zoom={1.5} />
        <Type
          text="Beautiful."
          t={t}
          size={190}
          style={{
            ...abs,
            left: 120,
            top: 130,
            textShadow: "0 4px 30px #0005",
          }}
        />
        <div
          style={{
            ...abs,
            left: 130,
            top: 730,
            fontSize: 130,
            letterSpacing: "-.06em",
            opacity: v(t, 1.8, 2.2),
          }}
        >
          But usable?
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill style={{ color: "white", background: "#101828" }}>
        <MaterialStage time={t + 3} mode="ribbon" zoom={1.35} />
        <div style={{ ...abs, inset: 0, display: "flex" }}>
          <div
            style={{
              width: "33.333%",
              height: "100%",
              background: "#101828",
              position: "relative",
              transform: `translateY(${v(t, 0, 0.65, -1080, 0)}px)`,
            }}
          >
            <div
              style={{
                fontFamily: "Georgia,serif",
                fontSize: 440,
                letterSpacing: "-.1em",
                lineHeight: 1,
                position: "absolute",
                left: 20,
                top: 170,
              }}
            >
              Aa
            </div>
            <span style={{ ...abs, left: 60, bottom: 100, fontSize: 95 }}>
              Ink.
            </span>
          </div>
          <div
            style={{
              width: "33.333%",
              height: "100%",
              background: "#f5f2e9",
              color: ink,
              position: "relative",
              transform: `translateY(${v(t, 0.12, 0.8, 1080, 0)}px)`,
            }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                style={{
                  ...abs,
                  left: 75 + i * 8,
                  top: 185 + i * 12,
                  width: 430,
                  height: 500,
                  background: "#fffdf6",
                  border: "1px solid #e6e0d5",
                  boxShadow: "0 15px 25px #34301e12",
                  transform: `rotate(${(i - 2) * v(t, 0.4, 2.6, 0, 4)}deg)`,
                }}
              />
            ))}
            <span style={{ ...abs, left: 60, bottom: 100, fontSize: 95 }}>
              Paper.
            </span>
          </div>
          <div
            style={{ width: "33.333%", height: "100%", position: "relative" }}
          >
            <span style={{ ...abs, left: 60, bottom: 100, fontSize: 95 }}>
              Metal.
            </span>
          </div>
        </div>
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill style={{ color: ink }}>
        <MaterialStage time={t} mode="chips" colour={blue} />
        <div style={{ ...abs, left: 110, top: 100 }}>
          <Brand tool="Palette" />
        </div>
        <Type
          text="From material to system."
          t={t}
          size={110}
          style={{ ...abs, left: 110, bottom: 90 }}
        />
      </AbsoluteFill>
    );
  if (shot === 3)
    return (
      <AbsoluteFill style={{ background: "#f5f2e9", color: ink }}>
        <div style={{ ...abs, inset: 0, display: "flex" }}>
          {[
            ["#101828", "Text"],
            ["#f5f2e9", "Surface"],
            [blue, "Action"],
            ["#b8e6d3", "Feedback"],
          ].map(([c, s], i) => (
            <div
              key={s}
              style={{
                position: "relative",
                height: "100%",
                width: "25%",
                background: c,
                color: i === 0 || i === 2 ? "white" : ink,
                transform: `translateY(${v(t, i * 0.13, 0.8 + i * 0.13, i % 2 ? 1080 : -1080, 0)}px)`,
              }}
            >
              <span
                style={{
                  ...abs,
                  left: 45,
                  bottom: 90,
                  fontSize: 55,
                  letterSpacing: "-.05em",
                }}
              >
                {s}
              </span>
              <div style={{ ...abs, left: 45, top: 130, fontSize: 140 }}>
                {["Aa", "▱", "↗", "✓"][i]}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  if (shot === 4)
    return (
      <AbsoluteFill style={{ background: "#101828", color: "#f5f2e9" }}>
        <div style={{ ...abs, left: 130, top: 120, fontSize: 36 }}>
          Read it. Don’t just admire it.
        </div>
        <div
          style={{
            ...abs,
            left: 130,
            top: 290,
            fontSize: 178,
            lineHeight: 1.03,
            letterSpacing: "-.07em",
            color: t < 1.3 ? "#546079" : "#f5f2e9",
          }}
        >
          Good colour
          <br />
          works harder.
        </div>
        <div
          style={{
            ...abs,
            right: 160,
            top: 300,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "2px solid #ffffff30",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            transform: `scale(${v(t, 0.3, 1.1, 0.8, 1)})`,
          }}
        >
          <div style={{ fontSize: 100, letterSpacing: "-.06em" }}>
            {t < 1.3 ? "2.8" : "15.9"}
            <span style={{ fontSize: 35 }}>:1</span>
          </div>
          <div
            style={{
              fontSize: 27,
              color: t < 1.3 ? "#e9a092" : "#b8e6d3",
              marginTop: 15,
            }}
          >
            {t < 1.3 ? "Needs work" : "Contrast checked"}
          </div>
        </div>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <AbsoluteFill
        style={{
          background: t < 1.6 ? "#e6e7e2" : "#06090f",
          perspective: 1800,
        }}
      >
        <Window
          style={{
            ...abs,
            left: 290,
            top: 80,
            width: 1340,
            height: 930,
            transform: `rotateY(${v(t, 1.2, 2.2, 0, 180)}deg)`,
            backfaceVisibility: "hidden",
          }}
        >
          <WebPage palette t={t} />
        </Window>
        <Window
          style={{
            ...abs,
            left: 290,
            top: 80,
            width: 1340,
            height: 930,
            transform: `rotateY(${v(t, 1.2, 2.2, -180, 0)}deg)`,
            backfaceVisibility: "hidden",
          }}
        >
          <WebPage palette dark t={t} />
        </Window>
      </AbsoluteFill>
    );
  if (shot === 6)
    return (
      <AbsoluteFill style={{ background: "#e9edf2", color: ink }}>
        <div style={{ ...abs, left: 120, top: 110 }}>
          <Type text="Use it everywhere." t={t} size={130} />
        </div>
        <div
          style={{
            ...abs,
            left: 160,
            top: 360,
            width: 680,
            fontFamily: "monospace",
            fontSize: 35,
            lineHeight: 1.9,
            padding: 45,
            background: "#fff",
            borderRadius: 25,
            boxShadow: "0 40px 80px #10182815",
            transform: `perspective(1200px) rotateY(${v(t, 0, 2, 15, 0)}deg)`,
          }}
        >
          {[
            ["text", "#101828"],
            ["surface", "#f5f2e9"],
            ["action", blue],
            ["feedback", "#b8e6d3"],
          ].map(([s, c], i) => (
            <div
              key={s}
              style={{ opacity: v(t, 0.2 + i * 0.3, 0.5 + i * 0.3) }}
            >
              <span style={{ color: blue }}>--{s}</span>: {c};
            </div>
          ))}
        </div>
        <div
          style={{
            ...abs,
            right: 130,
            top: 320,
            width: 760,
            height: 650,
            borderRadius: 25,
            overflow: "hidden",
            transform: `translateX(${v(t, 0.4, 1.4, 300, 0)}px)`,
          }}
        >
          <WebPage palette t={t} />
        </div>
      </AbsoluteFill>
    );
  return <End t={t} tool="Palette" line="Colour with a job to do." />;
};

const Launch: React.FC<{ shot: number; t: number; d: number }> = ({
  shot,
  t,
}) => {
  if (shot === 0)
    return (
      <AbsoluteFill
        style={{ background: "#071222", color: "white", perspective: 1800 }}
      >
        <Window
          style={{
            ...abs,
            left: 820,
            top: 130,
            width: 980,
            height: 800,
            transform: `rotateY(${v(t, 0, 3.8, -18, 6)}deg) rotateX(8deg) scale(${v(t, 0, 3.8, 0.8, 1)})`,
          }}
        >
          <WebPage fixed />
        </Window>
        <Type
          text="Finished?"
          t={t}
          size={150}
          style={{
            ...abs,
            left: 100,
            top: 100,
            textShadow: "0 5px 30px #0008",
          }}
        />
        <div
          style={{
            ...abs,
            left: 110,
            bottom: 120,
            fontSize: 95,
            letterSpacing: "-.06em",
            opacity: v(t, 1.7, 2.2),
          }}
        >
          Not quite.
        </div>
      </AbsoluteFill>
    );
  if (shot === 1)
    return (
      <AbsoluteFill style={{ background: "#eff3f9", color: ink }}>
        <MaterialStage time={t} mode="orbit" colour={blue} zoom={1.06} />
        <Type
          text="Before the first click."
          t={t}
          size={148}
          style={{
            ...abs,
            left: 180,
            top: 400,
            width: 1550,
            textAlign: "center",
            textShadow: "0 2px 40px white",
          }}
        />
      </AbsoluteFill>
    );
  if (shot === 2)
    return (
      <AbsoluteFill style={{ background: blue, color: "white" }}>
        <div style={{ ...abs, left: 120, top: 100 }}>
          <Brand light tool="Launch" />
        </div>
        <div
          style={{
            ...abs,
            left: 150,
            top: 360,
            width: 1620,
            borderBottom: "2px solid #ffffff66",
            paddingBottom: 40,
            fontSize: 88,
            letterSpacing: "-.05em",
          }}
        >
          https://
          <span style={{ opacity: v(t, 0.3, 1.2) }}>your-domain.com</span>
          <span
            style={{ marginLeft: 40, fontSize: 55, opacity: v(t, 1.5, 1.8) }}
          >
            ✓
          </span>
        </div>
        <div
          style={{
            ...abs,
            left: 150,
            top: 640,
            display: "flex",
            gap: 75,
            fontSize: 37,
          }}
        >
          {["Domain", "DNS", "HTTPS"].map((s, i) => (
            <div
              key={s}
              style={{
                opacity: v(t, 0.6 + i * 0.45, 1 + i * 0.45),
                transform: `translateY(${v(t, 0.6 + i * 0.45, 1 + i * 0.45, 60, 0)}px)`,
              }}
            >
              <span style={{ opacity: 0.6 }}>0{i + 1} </span>
              {s}
              <div
                style={{
                  height: 2,
                  width: 300,
                  background: "#ffffff55",
                  marginTop: 25,
                }}
              />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  if (shot === 3)
    return (
      <AbsoluteFill
        style={{ background: "#e6edf6", color: ink, perspective: 1500 }}
      >
        <Type
          text="Make the first impression count."
          t={t}
          size={95}
          style={{ ...abs, left: 120, top: 110, width: 1600 }}
        />
        <div
          style={{
            ...abs,
            left: 430,
            top: 310,
            width: 1060,
            background: "white",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 65px 110px #0b234c30",
            transform: `rotateY(${v(t, 0, 1.2, 38, 0)}deg) rotateX(${v(t, 0, 1.2, 12, 0)}deg)`,
          }}
        >
          <Img
            src={asset("home")}
            style={{
              width: "100%",
              height: 440,
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <div style={{ padding: 35, fontSize: 34 }}>
            Foreman
            <div style={{ fontSize: 25, color: "#64748b", marginTop: 10 }}>
              A build playbook for coding agents.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  if (shot === 4)
    return (
      <AbsoluteFill style={{ background: "#061222", color: "white" }}>
        <div
          style={{
            ...abs,
            left: 150,
            top: 150,
            fontSize: 350,
            letterSpacing: "-.09em",
            lineHeight: 1,
            transform: `translateX(${v(t, 0, 1, -250, 0)}px)`,
          }}
        >
          404
        </div>
        <div
          style={{
            ...abs,
            left: 1000,
            top: 270,
            fontSize: 90,
            letterSpacing: "-.06em",
            maxWidth: 760,
          }}
        >
          Give them
          <br />a way back.
        </div>
        <div
          style={{
            ...abs,
            left: 180,
            top: 650,
            background: "white",
            color: ink,
            padding: "28px 48px",
            borderRadius: 90,
            fontSize: 42,
            transform: `scale(${v(t, 0.4, 0.9, 0.8, 1)})`,
          }}
        >
          Back to home ↗
        </div>
        <Cursor
          x={v(t, 0.8, 1.8, 1400, 510)}
          y={v(t, 0.8, 1.8, 920, 710)}
          press={v(t, 1.8, 2, 0, 1) * (1 - v(t, 2, 2.2))}
        />
        <div
          style={{
            ...abs,
            inset: 0,
            background: "#eff3f9",
            clipPath: `circle(${v(t, 2.4, 3.4, 0, 2200)}px at 510px 710px)`,
          }}
        >
          <div style={{ ...abs, inset: 80 }}>
            <WebPage />
          </div>
        </div>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <AbsoluteFill style={{ background: "#f5f7fb", color: ink }}>
        <Type
          text="Help the right people find it."
          t={t}
          size={110}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <div
          style={{
            ...abs,
            left: 180,
            top: 360,
            width: 1100,
            padding: 45,
            background: "white",
            borderRadius: 25,
            boxShadow: "0 35px 80px #10204015",
            transform: `translateY(${v(t, 0, 0.8, 120, 0)}px)`,
          }}
        >
          <div style={{ fontSize: 25, color: "#576273" }}>your-domain.com</div>
          <div style={{ fontSize: 53, color: "#2359ad", marginTop: 20 }}>
            A clear title for the actual page
          </div>
          <div
            style={{
              fontSize: 31,
              lineHeight: 1.5,
              color: "#566171",
              marginTop: 18,
            }}
          >
            A useful description of what people will find.
            <br />
            Written for the person searching.
          </div>
        </div>
        <div
          style={{
            ...abs,
            right: 140,
            bottom: 150,
            fontFamily: "monospace",
            fontSize: 32,
            background: "#101828",
            color: "#b8e6d3",
            padding: 40,
            borderRadius: 20,
            opacity: v(t, 1, 1.5),
          }}
        >
          sitemap.xml
          <br />
          <span style={{ color: "white" }}>
            {" "}
            /<br /> /work/
            <br /> /about/
          </span>
        </div>
      </AbsoluteFill>
    );
  if (shot === 6)
    return (
      <AbsoluteFill style={{ background: "#0b1729", color: "white" }}>
        <Type
          text="Know what’s ready."
          t={t}
          size={130}
          style={{ ...abs, left: 120, top: 110 }}
        />
        <div style={{ ...abs, left: 180, top: 360, right: 180 }}>
          {[
            ["Domain and HTTPS", "Checked"],
            ["Share preview and 404", "Checked"],
            ["Sitemap and metadata", "Checked"],
            ["Search Console verification", "Needs owner"],
          ].map(([s, status], i) => (
            <div
              key={s}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 40,
                padding: "25px 0",
                borderBottom: "1px solid #ffffff25",
                opacity: v(t, 0.2 + i * 0.3, 0.6 + i * 0.3),
              }}
            >
              {s}
              <span style={{ color: i === 3 ? "#d6c6a7" : "#b8e6d3" }}>
                {status} {i === 3 ? "↗" : "✓"}
              </span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    );
  return <End t={t} tool="Launch" line="Ready for the first click." />;
};

export const RebuiltFilm: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame(),
    time = frame / 60,
    film = data[index];
  let shot = 0;
  for (let i = 0; i < film.starts.length; i++)
    if (time >= film.starts[i]) shot = i;
  const t = time - film.starts[shot],
    d = film.durations[shot];
  const Component = [Main, Board, Punch, Palette, Launch][index];
  // Every scene is authored from its own clock. Whip exits vary by film and shot.
  const exit = shot < 7 ? v(t, d - 0.22, d, 0, 1) : 0;
  return (
    <AbsoluteFill
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        background: "#050609",
        overflow: "hidden",
      }}
    >
      <style>{`@font-face{font-family:Inter;src:url('${staticFile("inter-400.woff2")}');font-weight:400}@font-face{font-family:Inter;src:url('${staticFile("inter-500.woff2")}');font-weight:500}@font-face{font-family:Inter;src:url('${staticFile("inter-600.woff2")}');font-weight:600}`}</style>
      <AbsoluteFill
        style={{
          transform:
            shot % 3 === 1
              ? `scale(${1 + exit * 0.22}) translateX(${-exit * 90}px)`
              : "none",
          filter: shot % 3 === 1 ? `blur(${exit * 9}px)` : "none",
        }}
      >
        <Component shot={shot} t={t} d={d} />
      </AbsoluteFill>
      {shot % 3 === 2 && shot < 7 && (
        <div
          style={{
            ...abs,
            inset: 0,
            background:
              index === 1 ? "#e9ded0" : index === 3 ? blue : "#050609",
            clipPath: `inset(0 ${100 - exit * 100}% 0 0)`,
          }}
        />
      )}
      <Audio src={staticFile("rebuild/" + film.slug + ".m4a")} />
    </AbsoluteFill>
  );
};
export const RebuiltCompositions: React.FC = () => (
  <>
    {data.map((film, index) => (
      <Composition
        key={film.slug}
        id={"Rebuilt-" + film.slug}
        component={RebuiltFilm}
        defaultProps={{ index }}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={Math.ceil(film.duration * 60)}
      />
    ))}
  </>
);
