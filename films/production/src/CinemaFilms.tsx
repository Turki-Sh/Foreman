import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { CinemaStage } from "./CinemaStage";
import data from "./cinema-timings.json";

const ink = "#070709",
  blue = "#075bff",
  ice = "#e7f5ff",
  copper = "#ff5733";
const abs: React.CSSProperties = { position: "absolute" };
const curve = Easing.bezier(0.16, 1, 0.3, 1);
const move = (t: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(t, [a, a + (b - a) * 0.66], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curve,
  });
const BG: React.FC<{
  dark?: boolean;
  warm?: boolean;
  children?: React.ReactNode;
}> = ({ dark, warm, children }) => {
  const frame = useCurrentFrame();
  const phase = Math.min(frame / 90, 1);
  return (
    <AbsoluteFill
      style={{
        background: dark ? "#000" : "#fff",
        color: dark ? "#fff" : ink,
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: dark
            ? `radial-gradient(ellipse 60% 50% at ${85 - phase * 10}% 110%,#074bffbb,transparent 75%),radial-gradient(ellipse 35% 25% at 110% 55%,#922bff66,transparent 80%)`
            : warm
              ? `radial-gradient(ellipse 45% 55% at ${105 - phase * 8}% 100%,#005bff99,transparent 68%),radial-gradient(ellipse 35% 50% at 90% 110%,#00ddff99,transparent 75%)`
              : `radial-gradient(ellipse 50% 40% at 100% 110%,#1ed6ff66,transparent 75%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
const Title: React.FC<{
  text: string;
  t: number;
  size?: number;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ text, t, size = 150, style, delay = 0 }) => (
  <div
    style={{
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "-.065em",
      lineHeight: 1.02,
      ...style,
    }}
  >
    {text.split(" ").map((word, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          marginRight: ".22em",
          opacity: move(t, delay + i * 0.035, delay + 0.26 + i * 0.035),
          transform: `translateY(${move(t, delay + i * 0.035, delay + 0.3 + i * 0.035, 32, 0)}px)`,
        }}
      >
        {word}
      </span>
    ))}
  </div>
);
const Hat = () => (
  <svg width="65" height="55" viewBox="0 0 64 52" fill="none">
    <path
      d="M12 38V27c0-9 6-17 15-19v21m10 0V8c9 2 15 10 15 19v11M27 8V3h10v5M8 38h48v9H8z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>
);
const Brand = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      fontSize: 44,
      fontWeight: 500,
    }}
  >
    <Hat />
    Foreman
  </div>
);
const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({
  x,
  y,
  press = 0,
}) => (
  <svg
    width="66"
    height="80"
    viewBox="0 0 52 65"
    style={{
      ...abs,
      left: x,
      top: y,
      filter: "drop-shadow(0 4px 4px #0005)",
      transform: `scale(${1 - press * 0.2})`,
    }}
  >
    <path
      d="M7 3L41 31 27 35 20 53 7 3Z"
      fill="white"
      stroke="#15233a"
      strokeWidth="3"
    />
  </svg>
);
const Glass: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      border: "1px solid #ffffffc0",
      borderRadius: 30,
      background: "linear-gradient(130deg,#fff,#f4f8ff)",
      boxShadow:
        "inset 0 1px 0 white,0 35px 70px #15345b24,0 3px 8px #193e5a12",
      backdropFilter: "blur(12px)",
      ...style,
    }}
  >
    {children}
  </div>
);
const Terminal: React.FC<{
  t: number;
  command: string;
  lines: string[];
  style?: React.CSSProperties;
}> = ({ t, command, lines, style }) => (
  <div
    style={{
      background: "linear-gradient(140deg,#171719,#000)",
      color: "#dceafa",
      border: "1px solid #526276",
      borderRadius: 28,
      boxShadow: "0 50px 100px #0a193b40,inset 0 1px 0 #ffffff20",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        height: 78,
        borderBottom: "1px solid #ffffff18",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 34px",
      }}
    >
      {["#c68a71", "#e4c58a", "#7da596"].map((c) => (
        <span
          key={c}
          style={{ width: 14, height: 14, borderRadius: 20, background: c }}
        />
      ))}
      <span style={{ marginLeft: 20, fontSize: 25, color: "#bfc3cc" }}>
        Claude Code
      </span>
    </div>
    <div style={{ padding: 45, font: "36px/1.65 monospace" }}>
      <div style={{ color: "#f0c8a6", marginBottom: 30 }}>
        ❯ {command.slice(0, Math.floor(t * 40))}
        <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span>
      </div>
      {lines.map((s, i) => (
        <div
          key={s}
          style={{
            opacity: move(t, 0.5 + i * 0.35, 0.8 + i * 0.35),
            transform: `translateY(${move(t, 0.5 + i * 0.35, 0.9 + i * 0.35, 20, 0)}px)`,
            marginTop: 18,
          }}
        >
          <span style={{ color: "#93c8b5" }}>› </span>
          {s}
        </div>
      ))}
    </div>
  </div>
);
const ShotFrame: React.FC<{
  t: number;
  d: number;
  cut?: "lens" | "slide" | "none";
  children: React.ReactNode;
}> = ({ t, d, cut = "none", children }) => {
  const exit = move(t, d - 0.28, d);
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform:
          cut === "lens"
            ? `scale(${1 + exit * 0.18})`
            : cut === "slide"
              ? `translateX(${-exit * 1920}px)`
              : "none",
        filter: "none",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const Outro: React.FC<{ t: number; index: number }> = ({ t, index }) => (
  <BG dark>
    <div
      style={{
        ...abs,
        inset: 0,
        background: `radial-gradient(ellipse at ${45 + Math.sin(t) * 10}% 110%,#2e6cf155,transparent 60%)`,
      }}
    />
    <div style={{ ...abs, left: 140, top: 125 }}>
      <Brand />
    </div>
    <Title
      text={
        [
          "Build with a direction.",
          "Give your agent a reference.",
          "Fix the part that matters.",
          "Make colour work.",
          "Ready to share.",
        ][index]
      }
      t={t}
      size={166}
      style={{ ...abs, left: 140, top: 335, width: 1500 }}
    />
    <div
      style={{
        ...abs,
        left: 150,
        top: 805,
        fontSize: 38,
        opacity: move(t, 0.6, 1.2),
        color: "#b8c9df",
      }}
    >
      foreman.turkialshuaibi.com <span style={{ marginLeft: 35 }}>↗</span>
    </div>
  </BG>
);

const Main: React.FC<{ shot: number; t: number }> = ({ shot, t }) => {
  if (shot === 0)
    return (
      <BG dark>
        <Title
          text="You have an idea."
          t={t}
          size={172}
          style={{ ...abs, left: 140, top: 150 }}
        />
        <Glass
          style={{
            ...abs,
            left: 145,
            top: 460,
            width: 1620,
            height: 190,
            padding: "54px 65px",
            boxSizing: "border-box",
            color: ink,
            transform: `translateY(${move(t, 0, 0.9, 180, 0)}px)`,
          }}
        >
          <span style={{ fontSize: 55, letterSpacing: "-.04em" }}>
            Build me a website
            <span style={{ opacity: Math.floor(t * 3) % 2 }}>|</span>
          </span>
          <span style={{ float: "right", fontSize: 55, color: blue }}>↑</span>
        </Glass>
        <div
          style={{
            ...abs,
            left: 150,
            top: 735,
            fontSize: 58,
            color: "#9bb5d9",
            opacity: move(t, 1.8, 2.3),
          }}
        >
          {t > 2.6 ? "But whose website?" : "Another prompt. Another default."}
        </div>
        <Cursor
          x={move(t, 1.2, 2, 1700, 1620)}
          y={move(t, 1.2, 2, 900, 545)}
          press={move(t, 2, 2.2) * (1 - move(t, 2.2, 2.4))}
        />
      </BG>
    );
  if (shot === 1)
    return (
      <BG warm>
        <Title
          text="Choose first."
          t={t}
          size={154}
          style={{ ...abs, left: 120, top: 85 }}
        />
        <CinemaStage kind="decisions" time={t} />
        <Cursor
          x={move(t, 0.25, 0.7, 1650, 980)}
          y={move(t, 0.25, 0.7, 900, 620)}
          press={move(t, 0.7, 0.8) * (1 - move(t, 0.8, 0.95))}
        />
        <div
          style={{
            ...abs,
            left: 120,
            bottom: 85,
            fontSize: 48,
            opacity: move(t, 1, 1.2),
          }}
        >
          The audience shapes the build.
        </div>
      </BG>
    );
  if (shot === 2)
    return (
      <BG dark>
        <Title
          text="Who needs this?"
          t={t}
          size={126}
          style={{ ...abs, left: 120, top: 100, width: 1500 }}
        />
        <Terminal
          t={t}
          command="help me build my portfolio"
          lines={[
            "Who is this for?",
            "Engineering teams.",
            "Show the projects and the thinking.",
          ]}
          style={{
            ...abs,
            left: 140,
            top: 350,
            width: 1340,
            height: 600,
            transform: `perspective(1900px) rotateY(${move(t, 0, 1, -13, 0)}deg)`,
          }}
        />
        <div
          style={{
            ...abs,
            right: 130,
            top: 480,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 25%,#e6f1ff,#4477bb 45%,#132846 80%)",
            boxShadow: "20px 35px 50px #0005",
            transform: `translateY(${Math.sin(t) * 18}px)`,
          }}
        />
      </BG>
    );
  if (shot === 3)
    return (
      <BG>
        <CinemaStage kind="gallery" time={t} />
        <Title
          text="Take a closer look."
          t={t}
          size={135}
          style={{ ...abs, left: 120, top: 90 }}
        />
        <Glass
          style={{
            ...abs,
            left: 130,
            bottom: 95,
            padding: "24px 40px",
            fontSize: 42,
          }}
        >
          Hierarchy. Space. Movement.
        </Glass>
      </BG>
    );
  if (shot === 4)
    return (
      <BG warm>
        <CinemaStage kind="brief" time={t} />
        <Title
          text="One brief."
          t={t}
          size={170}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <div
          style={{
            ...abs,
            right: 150,
            bottom: 130,
            fontSize: 44,
            color: ink,
            opacity: move(t, 2, 2.6),
          }}
        >
          Your decisions, agreed.
        </div>
      </BG>
    );
  if (shot === 5)
    return (
      <BG dark>
        <div
          style={{
            ...abs,
            inset: 0,
            transform: `translateX(${move(t, 0.8, 1.6, 0, -1100)}px)`,
          }}
        >
          <Terminal
            t={t}
            command="Build from the approved brief"
            lines={[
              "Read the direction",
              "Apply the visual system",
              "Build and verify",
            ]}
            style={{ ...abs, left: 150, top: 140, width: 1600, height: 800 }}
          />
        </div>
        <div
          style={{
            ...abs,
            inset: 0,
            transform: `translateX(${move(t, 0.8, 1.6, 1920, 0)}px)`,
          }}
        >
          <CinemaStage
            kind="phone"
            screen="portfolio"
            time={Math.max(0, t - 0.8)}
            pose={1}
            progress={1}
          />
          <Title
            text="Now build."
            t={t - 1.2}
            size={170}
            style={{ ...abs, left: 120, top: 350, width: 650 }}
          />
        </div>
      </BG>
    );
  return (
    <BG>
      <CinemaStage
        kind="phone"
        screen="portfolio"
        time={t + 0.5}
        pose={2}
        progress={1}
      />
      <Title
        text="Every detail."
        t={t}
        size={118}
        style={{ ...abs, left: 1020, top: 190, width: 750 }}
      />
      {["Readable", "Responsive", "Ready to share"].map((s, i) => (
        <Glass
          key={s}
          style={{
            ...abs,
            left: 1020,
            top: 470 + i * 135,
            padding: "26px 36px",
            width: 620,
            boxSizing: "border-box",
            fontSize: 43,
            opacity: move(t, 0.35 + i * 0.5, 0.7 + i * 0.5),
            transform: `translateX(${move(t, 0.35 + i * 0.5, 1 + i * 0.5, 100, 0)}px)`,
          }}
        >
          <span style={{ color: "#2c8065", marginRight: 25 }}>✓</span>
          {s}
        </Glass>
      ))}
    </BG>
  );
};

const Board: React.FC<{ shot: number; t: number }> = ({ shot, t }) => {
  if (shot === 0)
    return (
      <BG>
        <CinemaStage kind="gallery" time={t} />
        <Title
          text="What caught your eye?"
          t={t}
          size={145}
          style={{ ...abs, left: 120, top: 80 }}
        />
        <div
          style={{
            ...abs,
            inset: 0,
            border: "80px solid transparent",
            pointerEvents: "none",
          }}
        />
        <Cursor
          x={move(t, 0.2, 1.5, 1600, 1030)}
          y={move(t, 0.2, 1.5, 880, 450)}
        />
      </BG>
    );
  if (shot === 1)
    return (
      <BG dark>
        <div
          style={{
            ...abs,
            left: 100,
            top: 100,
            right: 100,
            bottom: 100,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 28,
            transform: `perspective(1400px) rotateY(${move(t, 0, 3, -12, 8)}deg) scale(${move(t, 0, 3, 1.1, 1.25)})`,
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Img
              key={i}
              src={staticFile(
                "cinema/" +
                  ["home", "reference", "palette-art", "launch-art"][i % 4] +
                  ".png",
              )}
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 10,
                opacity: 0.35,
                boxShadow: "0 30px 50px #0008",
              }}
            />
          ))}
        </div>
        <Glass
          style={{
            ...abs,
            left: 280,
            top: 400,
            padding: "35px 60px",
            color: ink,
            fontSize: 100,
            letterSpacing: "-.05em",
          }}
        >
          Saved is not decided.
        </Glass>
      </BG>
    );
  if (shot === 2)
    return (
      <BG dark>
        <Title
          text="Start with the brief."
          t={t}
          size={145}
          style={{ ...abs, left: 120, top: 110 }}
        />
        <Terminal
          t={t}
          command="/foreman:board an engineering portfolio"
          lines={[
            "Read the audience and purpose",
            "Find relevant pages",
            "Explain what to take from each",
          ]}
          style={{ ...abs, left: 130, top: 360, width: 1650, height: 590 }}
        />
      </BG>
    );
  if (shot === 3)
    return (
      <BG>
        <div
          style={{
            ...abs,
            left: move(t, 0, 3, 420, 160),
            top: 170,
            width: 1400,
            transform: `perspective(1600px) rotateY(${move(t, 0, 2, -18, 0)}deg) scale(${move(t, 0, 3, 0.8, 1.16)})`,
            boxShadow: "0 60px 90px #18395845",
          }}
        >
          <Img
            src={staticFile("cinema/home.png")}
            style={{ width: "100%", borderRadius: 20 }}
          />
        </div>
        <Glass
          style={{
            ...abs,
            left: 1050,
            top: 110,
            padding: "24px 35px",
            fontSize: 45,
          }}
        >
          One dominant headline
        </Glass>
        <div
          style={{
            ...abs,
            left: 340,
            top: 300,
            width: 1150,
            height: 270,
            border: "4px solid " + blue,
            borderRadius: 20,
            opacity: move(t, 0.5, 1),
          }}
        />
      </BG>
    );
  if (shot === 4)
    return (
      <BG warm>
        <Title
          text="Keep the principle."
          t={t}
          size={150}
          style={{ ...abs, left: 120, top: 90 }}
        />
        <Glass
          style={{
            ...abs,
            left: 130,
            top: 350,
            width: 730,
            padding: 40,
            transform: `translateY(${move(t, 0, 0.8, 200, 0)}px)`,
          }}
        >
          <Img
            src={staticFile("cinema/home.png")}
            style={{ width: "100%", borderRadius: 15 }}
          />
        </Glass>
        <div
          style={{
            ...abs,
            left: 1080,
            top: 370,
            fontSize: 61,
            lineHeight: 1.8,
            letterSpacing: "-.04em",
          }}
        >
          {["Clear hierarchy", "Space to read", "One next step"].map((s, i) => (
            <div
              key={s}
              style={{ opacity: move(t, 0.5 + i * 0.4, 0.9 + i * 0.4) }}
            >
              {s}
            </div>
          ))}
        </div>
        <div
          style={{ ...abs, left: 905, top: 560, fontSize: 100, color: copper }}
        >
          →
        </div>
      </BG>
    );
  if (shot === 5)
    return (
      <BG>
        <CinemaStage kind="brief" time={t} />
        <Title
          text="A direction you can use."
          t={t}
          size={125}
          style={{ ...abs, left: 120, top: 85, width: 1700 }}
        />
      </BG>
    );
  return (
    <BG dark>
      <CinemaStage kind="phone" time={t} pose={1} progress={1} />
      <Title
        text="Build toward something."
        t={t}
        size={145}
        style={{ ...abs, left: 120, top: 290, width: 720 }}
      />
    </BG>
  );
};

const Punch: React.FC<{ shot: number; t: number }> = ({ shot, t }) => {
  if (shot === 0)
    return (
      <BG dark>
        <CinemaStage kind="phone" screen="portfolio" time={t} pose={1} />
        <Title
          text="It loads."
          t={t}
          size={170}
          style={{ ...abs, left: 120, top: 230, width: 750 }}
        />
        <Title
          text="Does it work?"
          t={t}
          delay={1.6}
          size={100}
          style={{ ...abs, left: 130, top: 570, width: 700, color: "#b9cce5" }}
        />
      </BG>
    );
  if (shot === 1)
    return (
      <BG>
        <div
          style={{
            ...abs,
            left: 160,
            top: 120,
            width: 1600,
            height: 820,
            borderRadius: 35,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 50px 90px #19365730",
          }}
        >
          <div
            style={{
              padding: 100,
              color: "#b3bac4",
              fontSize: 128,
              lineHeight: 1.05,
              letterSpacing: "-.05em",
            }}
          >
            Welcome to
            <br />
            my website.
          </div>
          <div
            style={{
              display: "flex",
              gap: 25,
              marginLeft: 100,
              fontSize: 35,
              color: "#a0a9b7",
            }}
          >
            {["Explore", "Learn more", "Get started"].map((s) => (
              <span
                key={s}
                style={{
                  padding: "25px 35px",
                  border: "1px solid #dfe3e9",
                  borderRadius: 60,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <div
            style={{
              ...abs,
              left: 65,
              top: 65,
              width: 1390,
              height: 460,
              border: "5px solid " + copper,
              borderRadius: 25,
              boxShadow: "0 0 0 1500px #12243c70",
              transform: `scale(${move(t, 0, 0.7, 1.3, 1)})`,
            }}
          />
          <Glass
            style={{
              ...abs,
              left: 250,
              top: 650,
              padding: "25px 40px",
              fontSize: 46,
            }}
          >
            What should a visitor do?
          </Glass>
        </div>
      </BG>
    );
  if (shot === 2)
    return (
      <BG dark>
        <Title
          text="Ask for a punch list."
          t={t}
          size={140}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <Terminal
          t={t}
          command="/foreman:punch-list inspect this page"
          lines={[
            "Read it as a visitor",
            "Find the decisions that are unclear",
            "Return the fixes in order",
          ]}
          style={{ ...abs, left: 130, top: 350, width: 1650, height: 600 }}
        />
      </BG>
    );
  if (shot === 3)
    return (
      <BG>
        <div
          style={{
            ...abs,
            left: 150,
            top: 150,
            fontSize: 130,
            letterSpacing: "-.055em",
            lineHeight: 1.1,
            width: 1550,
          }}
        >
          <span
            style={{
              color: "#a3b0c1",
              textDecoration: t > 1 ? "line-through" : "none",
            }}
          >
            Welcome to my website.
          </span>
          <div
            style={{
              color: ink,
              opacity: move(t, 0.9, 1.4),
              transform: `translateY(${move(t, 0.9, 1.5, 70, 0)}px)`,
            }}
          >
            See what I have built.
          </div>
        </div>
        {["Explore", "Learn more", "Get started"].map((s, i) => (
          <Glass
            key={s}
            style={{
              ...abs,
              left: move(t, 1.8, 2.6, 150 + i * 520, i ? 2100 + i * 80 : 150),
              top: 650,
              padding: "35px 70px",
              fontSize: 45,
              opacity: i ? 1 - move(t, 2.3, 2.8) : 1,
              background: i ? "#fff" : t > 2.5 ? blue : "#fff",
              color: !i && t > 2.5 ? "white" : ink,
            }}
          >
            {!i && t > 2.5 ? "View the projects ↗" : s}
          </Glass>
        ))}
        <Cursor
          x={move(t, 1.3, 2.6, 1600, 420)}
          y={move(t, 1.3, 2.6, 900, 730)}
        />
      </BG>
    );
  if (shot === 4)
    return (
      <BG dark>
        <CinemaStage
          kind="phone"
          screen="portfolio"
          time={t}
          pose={2}
          progress={1}
        />
        <Title
          text="Read it. On a phone."
          t={t}
          size={140}
          style={{ ...abs, left: 1000, top: 200, width: 770 }}
        />
        <Glass
          style={{
            ...abs,
            left: 1010,
            top: 650,
            padding: 35,
            width: 610,
            fontSize: 52,
            color: ink,
          }}
        >
          Contrast <span style={{ color: "#2f8061", float: "right" }}>✓</span>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #b9c9dc",
              margin: "25px 0",
            }}
          />
          Layout <span style={{ color: "#2f8061", float: "right" }}>✓</span>
        </Glass>
      </BG>
    );
  if (shot === 5)
    return (
      <BG warm>
        <Title
          text="Fix these first."
          t={t}
          size={155}
          style={{ ...abs, left: 120, top: 110 }}
        />
        {[
          "Say what the site is for",
          "Make the next action clear",
          "Make every word readable",
        ].map((s, i) => (
          <Glass
            key={s}
            style={{
              ...abs,
              left: 150 + i * 55,
              top: 340 + i * 170,
              width: 1440,
              padding: "35px 50px",
              fontSize: 54,
              transform: `perspective(2000px) rotateY(${move(t, i * 0.25, 1 + i * 0.25, -15, 0)}deg) translateX(${move(t, i * 0.25, 1 + i * 0.25, 300, 0)}px)`,
              opacity: move(t, i * 0.25, 0.5 + i * 0.25),
            }}
          >
            <span style={{ color: copper, marginRight: 40 }}>{i + 1}</span>
            {s}
          </Glass>
        ))}
      </BG>
    );
  return (
    <BG>
      <CinemaStage
        kind="phone"
        screen="portfolio"
        time={t}
        pose={1}
        progress={1}
      />
      <Title
        text="A clearer first impression."
        t={t}
        size={145}
        style={{ ...abs, left: 120, top: 230, width: 800 }}
      />
    </BG>
  );
};

const Palette: React.FC<{ shot: number; t: number }> = ({ shot, t }) => {
  if (shot === 0)
    return (
      <BG dark>
        <div
          style={{
            ...abs,
            inset: 0,
            transform: `scale(${move(t, 0, 3.8, 2.6, 1.4)})`,
          }}
        >
          <CinemaStage kind="pigment" time={t} dark />
        </div>
        <Title
          text="Colour is a decision."
          t={t}
          size={152}
          style={{ ...abs, left: 120, top: 110, width: 1500 }}
        />
      </BG>
    );
  if (shot === 1)
    return (
      <BG warm>
        <CinemaStage kind="pigment" time={t + 1.4} />
        <Title
          text="Start with a material."
          t={t}
          size={140}
          style={{ ...abs, left: 120, top: 95 }}
        />
        <div
          style={{
            ...abs,
            left: 180,
            right: 180,
            bottom: 130,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 42,
          }}
        >
          {["Ink", "Cobalt", "Ice", "Copper", "Jade"].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </BG>
    );
  if (shot === 2)
    return (
      <BG>
        <CinemaStage kind="pigment" time={t + 2} />
        <Title
          text="Give each colour a job."
          t={t}
          size={132}
          style={{ ...abs, left: 120, top: 95 }}
        />
        <div
          style={{
            ...abs,
            left: 200,
            right: 200,
            bottom: 120,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 42,
          }}
        >
          {["Text", "Action", "Surface", "Attention", "Success"].map((s, i) => (
            <Glass
              key={s}
              style={{
                padding: "20px 30px",
                opacity: move(t, i * 0.2, 0.5 + i * 0.2),
              }}
            >
              {s}
            </Glass>
          ))}
        </div>
      </BG>
    );
  if (shot === 3)
    return (
      <BG dark>
        <Title
          text="Make the action obvious."
          t={t}
          size={145}
          style={{ ...abs, left: 120, top: 100, width: 1450 }}
        />
        <Glass
          style={{
            ...abs,
            left: 180,
            top: 430,
            width: 1560,
            height: 390,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
          }}
        >
          <span style={{ fontSize: 52, color: "#71849e" }}>Read the brief</span>
          <div
            style={{
              padding: "42px 75px",
              borderRadius: 90,
              background: blue,
              color: "white",
              fontSize: 60,
              boxShadow: "0 20px 35px #075bff50,inset 0 2px 0 #ffffff50",
              transform: `scale(${move(t, 0.4, 1.2, 0.85, 1)})`,
            }}
          >
            Start building ↗
          </div>
        </Glass>
        <Cursor x={move(t, 0.8, 2, 1600, 1250)} y={move(t, 0.8, 2, 950, 650)} />
      </BG>
    );
  if (shot === 4)
    return (
      <AbsoluteFill style={{ background: "#070709" }}>
        <div
          style={{
            ...abs,
            left: 150,
            top: 140,
            fontSize: 145,
            lineHeight: 1.1,
            letterSpacing: "-.055em",
            color: t < 1.5 ? "#546079" : "#f5f2e9",
          }}
        >
          Good colour
          <br />
          has to be read.
        </div>
        <Glass
          style={{
            ...abs,
            right: 180,
            bottom: 180,
            padding: "50px 80px",
            fontSize: 105,
            color: ink,
            transform: `rotate(${move(t, 0, 3, -8, 0)}deg)`,
          }}
        >
          {t < 1.5 ? "3.2" : "18.0"}
          <span style={{ fontSize: 44 }}>:1</span>
          <div style={{ fontSize: 35, marginTop: 20 }}>
            {t < 1.5 ? "Needs work" : "Contrast checked"}
          </div>
        </Glass>
      </AbsoluteFill>
    );
  if (shot === 5)
    return (
      <BG>
        <CinemaStage
          kind="phone"
          screen="palette"
          time={t}
          pose={1}
          progress={1}
        />
        <Title
          text="Light. Into dark."
          t={t}
          size={140}
          style={{ ...abs, left: 120, top: 240, width: 800 }}
        />
        <div style={{ ...abs, left: 140, top: 750, display: "flex", gap: 20 }}>
          {[ink, blue, ice, copper, "#dceee5"].map((c) => (
            <div
              key={c}
              style={{
                width: 85,
                height: 85,
                borderRadius: 25,
                background: c,
                boxShadow: "0 15px 25px #17325630,inset 0 2px 0 #ffffff66",
              }}
            />
          ))}
        </div>
      </BG>
    );
  return (
    <BG dark>
      <Title
        text="Use it everywhere."
        t={t}
        size={150}
        style={{ ...abs, left: 120, top: 95 }}
      />
      <Terminal
        t={t}
        command="Save the approved colour tokens"
        lines={[
          "Text     #070709",
          "Action   #075bff",
          "Surface  #e7f5ff",
          "Attention #ff5733",
        ]}
        style={{ ...abs, left: 130, top: 330, width: 920, height: 660 }}
      />
      <div
        style={{ ...abs, inset: 0, transform: "translateX(530px) scale(.86)" }}
      >
        <CinemaStage kind="phone" time={t} progress={1} />
      </div>
    </BG>
  );
};

const Launch: React.FC<{ shot: number; t: number }> = ({ shot, t }) => {
  if (shot === 0)
    return (
      <BG dark>
        <CinemaStage kind="phone" time={t} pose={1} progress={1} />
        <Title
          text="Ready?"
          t={t}
          size={200}
          style={{ ...abs, left: 120, top: 230, width: 750 }}
        />
        <Title
          text="Before you send it..."
          t={t}
          delay={1.5}
          size={90}
          style={{ ...abs, left: 130, top: 570, width: 730, color: "#b9cce5" }}
        />
      </BG>
    );
  if (shot === 1)
    return (
      <BG>
        <div
          style={{
            ...abs,
            inset: 0,
            transform: "translateY(110px) scale(.86)",
          }}
        >
          <CinemaStage kind="checks" time={t} />
        </div>
        <Title
          text="Check the whole journey."
          t={t}
          size={125}
          style={{ ...abs, left: 120, top: 75 }}
        />
      </BG>
    );
  if (shot === 2)
    return (
      <BG dark>
        <div style={{ ...abs, left: 150, top: 150 }}>
          <Brand />
        </div>
        <Glass
          style={{
            ...abs,
            left: 150,
            top: 420,
            width: 1620,
            padding: "55px 65px",
            boxSizing: "border-box",
            fontSize: 74,
            color: ink,
          }}
        >
          <span style={{ color: "#357e62", marginRight: 25 }}>⌑</span>
          foreman.turkialshuaibi.com
        </Glass>
        <div
          style={{
            ...abs,
            left: 200,
            top: 710,
            display: "flex",
            gap: 140,
            fontSize: 48,
            color: "#d1dff1",
          }}
        >
          {["Domain", "DNS", "HTTPS"].map((s, i) => (
            <span
              key={s}
              style={{ opacity: move(t, 0.5 + i * 0.5, 1 + i * 0.5) }}
            >
              {s} <span style={{ color: "#8ecab1" }}>✓</span>
            </span>
          ))}
        </div>
      </BG>
    );
  if (shot === 3)
    return (
      <BG>
        <Title
          text="Make the link worth opening."
          t={t}
          size={125}
          style={{ ...abs, left: 120, top: 80, width: 1680 }}
        />
        <Glass
          style={{
            ...abs,
            left: 420,
            top: 285,
            width: 1080,
            overflow: "hidden",
            transform: `perspective(1800px) rotateY(${move(t, 0, 2.5, -17, 5)}deg) rotateX(4deg)`,
          }}
        >
          <Img
            src={staticFile("cinema/share.png")}
            style={{
              width: "100%",
              height: 470,
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <div style={{ padding: 35, fontSize: 45 }}>
            Foreman
            <div style={{ fontSize: 28, color: "#5a6d86", marginTop: 15 }}>
              A build playbook for coding agents.
            </div>
          </div>
        </Glass>
      </BG>
    );
  if (shot === 4)
    return (
      <BG warm>
        <div
          style={{
            ...abs,
            left: 140,
            top: 150,
            fontSize: 290,
            letterSpacing: "-.08em",
            color: ink,
          }}
        >
          404
        </div>
        <Title
          text="Give them a way back."
          t={t}
          size={125}
          style={{ ...abs, left: 820, top: 190, width: 950 }}
        />
        <Glass
          style={{
            ...abs,
            left: 160,
            top: 670,
            padding: "35px 70px",
            fontSize: 55,
          }}
        >
          Back to Foreman ↗
        </Glass>
        <Cursor
          x={move(t, 0.7, 1.9, 1400, 490)}
          y={move(t, 0.7, 1.9, 900, 745)}
          press={move(t, 1.9, 2.1) * (1 - move(t, 2.1, 2.3))}
        />
        <div
          style={{
            ...abs,
            inset: 0,
            clipPath: `circle(${move(t, 2.2, 3.2, 0, 2200)}px at 490px 745px)`,
            background: "#e2edfa",
          }}
        >
          <Img
            src={staticFile("cinema/home.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </BG>
    );
  if (shot === 5)
    return (
      <BG>
        <Title
          text="Help people find it."
          t={t}
          size={150}
          style={{ ...abs, left: 120, top: 100 }}
        />
        <Glass
          style={{
            ...abs,
            left: 150,
            top: 380,
            width: 1500,
            padding: 65,
            transform: `perspective(1800px) rotateY(${move(t, 0, 2, -12, 0)}deg)`,
          }}
        >
          <div style={{ fontSize: 32, color: "#62738a" }}>
            foreman.turkialshuaibi.com
          </div>
          <div style={{ fontSize: 64, color: "#244dbc", margin: "25px 0" }}>
            Foreman: a build playbook for coding agents
          </div>
          <div style={{ fontSize: 36, lineHeight: 1.5, color: "#425570" }}>
            Research the references. Agree on the brief.
            <br />
            Build, check, and launch the website.
          </div>
        </Glass>
      </BG>
    );
  return (
    <BG dark>
      <div
        style={{ ...abs, inset: 0, transform: "translateY(110px) scale(.86)" }}
      >
        <CinemaStage kind="checks" time={t} />
      </div>
      <Title
        text="Know what is ready."
        t={t}
        size={135}
        style={{ ...abs, left: 120, top: 80 }}
      />
    </BG>
  );
};

const scenes = [Main, Board, Punch, Palette, Launch];
const CinemaShot: React.FC<{
  index: number;
  shot: number;
  duration: number;
}> = ({ index, shot, duration }) => {
  const t = useCurrentFrame() / 60;
  const Scene = scenes[index];
  const overlap = shot === 2 || shot === 3 || shot === 5;
  const enter = move(t, 0, 0.28);
  return (
    <AbsoluteFill
      style={{
        transform: shot === 3 ? `translateX(${(1 - enter) * 1920}px)` : "none",
        opacity: shot === 2 || shot === 5 ? enter : 1,
      }}
    >
      <ShotFrame
        t={t}
        d={duration + (overlap ? 0.28 : 0)}
        cut={shot === 1 || shot === 4 ? "lens" : shot === 2 ? "slide" : "none"}
      >
        {shot === 7 ? (
          <Outro t={t} index={index} />
        ) : (
          <Scene shot={shot} t={t} />
        )}
      </ShotFrame>
    </AbsoluteFill>
  );
};
const CinemaFilm: React.FC<{ index: number }> = ({ index }) => {
  const film = data[index];
  return (
    <AbsoluteFill
      style={{ fontFamily: "Inter,Arial,sans-serif", background: "#091222" }}
    >
      <style>{`@font-face{font-family:Inter;font-weight:400;src:url('${staticFile("inter-400.woff2")}')}@font-face{font-family:Inter;font-weight:500;src:url('${staticFile("inter-500.woff2")}')}@font-face{font-family:Inter;font-weight:600;src:url('${staticFile("inter-600.woff2")}')} `}</style>
      {film.starts.map((s, i) => (
        <Sequence
          key={i}
          name={
            [
              "Opening",
              "Question",
              "Action",
              "Detail",
              "Decision",
              "Result",
              "Check",
              "Close",
            ][i]
          }
          from={Math.round(s * 60) - ([2, 3, 5].includes(i) ? 17 : 0)}
          durationInFrames={
            (i + 1 < film.starts.length
              ? Math.round(film.starts[i + 1] * 60)
              : Math.ceil(film.duration * 60)) -
            Math.round(s * 60) +
            ([2, 3, 5].includes(i) ? 17 : 0)
          }
        >
          <CinemaShot index={index} shot={i} duration={film.durations[i]} />
        </Sequence>
      ))}
      <Audio src={staticFile("cinema/audio/" + film.slug + ".m4a")} />
    </AbsoluteFill>
  );
};
export const CinemaCompositions = () => (
  <>
    {data.map((f, index) => (
      <Composition
        key={f.slug}
        id={"Cinema-" + f.slug}
        component={CinemaFilm}
        defaultProps={{ index }}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={Math.ceil(f.duration * 60)}
      />
    ))}
  </>
);
