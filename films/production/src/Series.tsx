import React from "react";
import {
  AbsoluteFill,
  Freeze,
  Composition,
  Sequence,
  interpolate,
  Easing,
  useCurrentFrame,
  staticFile,
  Img,
} from "remotion";
import { Audio } from "@remotion/media";
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const move = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const ink = "#17191b",
  paper = "#f5f4f0";
const abs: React.CSSProperties = { position: "absolute" };
function Hat() {
  return (
    <svg width="58" height="44" viewBox="0 0 48 40">
      <path
        fill="currentColor"
        d="M7 30v-4c0-8 5-14 13-16V8c0-2 1-3 4-3s4 1 4 3v2c8 2 13 8 13 16v4h2c2 0 3 2 3 4s-2 4-5 4H7c-3 0-5-2-5-4s1-4 3-4Z"
      />
      <path d="M20 12v14m8-14v14" stroke={paper} strokeWidth="2" />
    </svg>
  );
}
function Brand({ tool, dark = false }: { tool: string; dark?: boolean }) {
  return (
    <div
      style={{
        ...abs,
        left: 92,
        top: 55,
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 28,
        color: dark ? "#fff" : ink,
      }}
    >
      <Hat />
      <b style={{ fontWeight: 500 }}>Foreman</b>
      <span style={{ opacity: 0.45, marginLeft: 12 }}>/ {tool}</span>
    </div>
  );
}
function Head({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h1
      style={{
        ...abs,
        top: 133,
        left: 92,
        right: 92,
        margin: 0,
        fontSize: 86,
        lineHeight: 1.08,
        letterSpacing: -4,
        fontWeight: 400,
        color: dark ? "white" : ink,
      }}
    >
      {children}
    </h1>
  );
}
function Reveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const f = useCurrentFrame() % 120;
  return (
    <div
      style={{
        opacity: move(f, delay, delay + 16),
        transform: `translateY(${move(f, delay, delay + 24, 26, 0)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function End({ tool, slug }: { tool: string; slug: string }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: ink,
        color: paper,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${move(f, 0, 35, 0.95, 1)})`,
          opacity: move(f, 0, 15),
          display: "flex",
          alignItems: "center",
          gap: 30,
          fontSize: 105,
          letterSpacing: -5,
        }}
      >
        <Hat />
        Foreman {tool}
      </div>
      <div style={{ fontSize: 32, marginTop: 40, opacity: move(f, 12, 32) }}>
        Free and open source. By Turki Alshuaibi.
      </div>
      <div style={{ fontSize: 27, marginTop: 76, color: "#c4c7ca" }}>
        foreman.turkialshuaibi.com/{slug}/
      </div>
    </AbsoluteFill>
  );
}
function Prompt({
  command,
  children,
}: {
  command: string;
  children: React.ReactNode;
}) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        ...abs,
        bottom: 100,
        left: 230,
        right: 230,
        padding: "26px 34px",
        border: "1px solid #bbb",
        borderRadius: 20,
        background: "#fff",
        fontSize: 30,
        boxShadow: "0 15px 50px #00000009",
        opacity: move(f, 5, 22),
      }}
    >
      <span style={{ color: "#435d78", fontFamily: "Inter" }}>
        {command}
      </span>{" "}
      {children}
    </div>
  );
}
function Study({
  type,
  index,
  active,
}: {
  type: string;
  index: number;
  active: boolean;
}) {
  return (
    <div
      style={{
        width: 480,
        height: 430,
        background: index === 1 ? "#111" : "#fff",
        color: index === 1 ? "#fff" : ink,
        borderRadius: 12,
        overflow: "hidden",
        border: active ? "3px solid #425d78" : "1px solid #d4d4d0",
        boxShadow: "0 25px 45px #00000012",
        position: "relative",
      }}
    >
      {index === 0 ? (
        <>
          <Img
            src={staticFile("architecture.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              ...abs,
              top: 44,
              left: 34,
              fontSize: 43,
              letterSpacing: -2,
            }}
          >
            Give the work
            <br />
            room to breathe.
          </div>
        </>
      ) : index === 1 ? (
        <>
          <div style={{ padding: 35, fontSize: 20 }}>TYPE STUDY</div>
          <div
            style={{
              fontSize: 78,
              lineHeight: 0.9,
              letterSpacing: -7,
              padding: "12px 35px",
            }}
          >
            Less.
            <br />
            Larger.
            <br />
            Clearer.
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              margin: 28,
              padding: 17,
              border: "1px solid #ddd",
              borderRadius: 40,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
            }}
          >
            <b>Studio</b>
            <span>Work &nbsp; About &nbsp; Contact</span>
          </div>
          <div
            style={{
              margin: 35,
              marginTop: 35,
              fontSize: 40,
              letterSpacing: -2,
            }}
          >
            One clear
            <br />
            next step.
          </div>
          <div
            style={{
              margin: 35,
              padding: "17px 22px",
              borderRadius: 40,
              background: ink,
              color: "#fff",
              display: "inline-block",
            }}
          >
            See selected work ↗
          </div>
        </>
      )}
      <div
        style={{
          ...abs,
          bottom: 0,
          left: 0,
          right: 0,
          padding: 22,
          background: index === 1 ? "#222" : "#fff",
          fontSize: 22,
        }}
      >
        {type}
      </div>
    </div>
  );
}
function Board() {
  const f = useCurrentFrame(),
    stage = Math.floor(f / 120),
    t = f % 120;
  const headers = [
    "“Make it look better.”",
    "Start with a specific brief.",
    "Find references that fit.",
    "Borrow a decision.",
    "Keep this. Leave that.",
    "Write the direction down.",
    "Build from a clear direction.",
  ];
  return (
    <AbsoluteFill style={{ background: paper, color: ink }}>
      <Brand tool="Board" />
      <Head>{headers[stage]}</Head>
      {stage < 2 ? (
        <>
          <div
            style={{
              ...abs,
              left: 160,
              top: 320,
              width: stage === 0 ? 1520 : 920,
              padding: 60,
              borderRadius: 20,
              background: "white",
              boxShadow: "0 25px 90px #0000000c",
              transform: `translateY(${move(t, 0, 28, 25, 0)}px)`,
            }}
          >
            {stage === 0 ? (
              <>
                <div
                  style={{ fontSize: 90, letterSpacing: -5, marginBottom: 35 }}
                >
                  Better how?
                </div>
                <div style={{ display: "flex", gap: 24 }}>
                  {["Layout?", "Type?", "Images?"].map((s, i) => (
                    <Reveal key={s} delay={16 + i * 16}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 40,
                          padding: "25px 45px",
                          border: "1px solid #ccc",
                          borderRadius: 60,
                        }}
                      >
                        {s}
                      </span>
                    </Reveal>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 50 }}>Turki Alshuaibi</div>
                <div
                  style={{
                    fontSize: 30,
                    color: "#616569",
                    margin: "22px 0 40px",
                  }}
                >
                  AI engineer & designer
                </div>
                <div style={{ fontSize: 34, lineHeight: 1.6 }}>
                  Audience: engineering teams
                  <br />
                  Action: view selected work
                  <br />
                  Tone: precise, visual, personal
                </div>
              </>
            )}
          </div>
          {stage === 1 && (
            <Reveal
              delay={15}
              style={{
                ...abs,
                left: 1180,
                top: 350,
                width: 470,
                fontSize: 48,
                lineHeight: 1.25,
              }}
            >
              References should serve
              <br />
              <b style={{ fontWeight: 500 }}>this brief.</b>
            </Reveal>
          )}
        </>
      ) : stage < 5 ? (
        <>
          <div
            style={{ ...abs, left: 174, top: 330, display: "flex", gap: 50 }}
          >
            {["Composition", "Typography", "Hierarchy"].map((s, i) => (
              <Reveal delay={i * 8} key={s}>
                <Study
                  type={s}
                  index={i}
                  active={
                    stage === 3
                      ? i === Math.floor(t / 40)
                      : stage === 4 && i < 2
                  }
                />
              </Reveal>
            ))}
          </div>
          <div
            style={{
              ...abs,
              top: 805,
              left: 174,
              right: 174,
              display: "flex",
              gap: 50,
              fontSize: 28,
            }}
          >
            {(stage === 2
              ? [
                  "Look beyond your own category.",
                  "Compare how the page reads.",
                  "Find the next action.",
                ]
              : stage === 3
                ? [
                    "Keep: generous image space.",
                    "Keep: a clear type scale.",
                    "Keep: one primary action.",
                  ]
                : [
                    "Leave: the reference’s branding.",
                    "Leave: copy that is not yours.",
                    "Keep: decisions, not decoration.",
                  ]
            ).map((s) => (
              <div key={s} style={{ width: 480 }}>
                {s}
              </div>
            ))}
          </div>
        </>
      ) : stage === 5 ? (
        <div
          style={{
            ...abs,
            top: 305,
            left: 330,
            width: 1260,
            padding: 60,
            background: "#fff",
            border: "1px solid #ddd",
            boxShadow: "0 24px 70px #0001",
            fontSize: 39,
            lineHeight: 1.8,
          }}
        >
          <div
            style={{ fontFamily: "Inter", fontSize: 25, color: "#687077" }}
          >
            BRIEF.md / visual direction
          </div>
          {[
            "Lead with the work.",
            "Use large type and generous margins.",
            "Keep one primary action.",
            "Use the references for principles, not copies.",
          ].map((s, i) => (
            <Reveal key={s} delay={i * 13}>
              {s}
            </Reveal>
          ))}
        </div>
      ) : (
        <>
          <div
            style={{
              ...abs,
              left: 220,
              top: 315,
              width: 1480,
              height: 525,
              background: "#fff",
              border: "1px solid #ccc",
              padding: 55,
              display: "flex",
              gap: 70,
            }}
          >
            <div style={{ width: 620 }}>
              <div style={{ fontSize: 22 }}>Turki Alshuaibi</div>
              <div
                style={{
                  fontSize: 77,
                  letterSpacing: -4,
                  lineHeight: 1.05,
                  margin: "45px 0",
                }}
              >
                AI engineering.
                <br />
                Design in practice.
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: ink,
                  color: "white",
                  padding: "19px 29px",
                  borderRadius: 40,
                  fontSize: 24,
                }}
              >
                View selected work ↗
              </div>
            </div>
            <Img
              src={staticFile("architecture.webp")}
              style={{ width: 620, height: 410, objectFit: "cover" }}
            />
          </div>
        </>
      )}
      {stage === 1 && (
        <Prompt command="/foreman:board">
          a portfolio for Turki Alshuaibi
        </Prompt>
      )}
    </AbsoluteFill>
  );
}
function SiteDemo({
  fixed = false,
  mobile = false,
}: {
  fixed?: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: fixed ? "#fff" : "#eeedf5",
        padding: mobile ? 36 : 55,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          fontSize: 22,
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ddd",
          paddingBottom: 28,
        }}
      >
        <b>Turki Alshuaibi</b>
        {!mobile && <span>Work &nbsp; About &nbsp; Contact</span>}
      </div>
      <div
        style={{
          fontSize: mobile ? 58 : 76,
          letterSpacing: -3,
          lineHeight: 1.05,
          margin: "48px 0 25px",
          maxWidth: fixed ? "100%" : 900,
          whiteSpace: !fixed && mobile ? "nowrap" : "normal",
        }}
      >
        {fixed ? (
          <>
            AI engineering.
            <br />
            Design in practice.
          </>
        ) : (
          <>
            Building the future
            <br />
            of digital innovation.
          </>
        )}
      </div>
      <div
        style={{
          fontSize: 25,
          color: fixed ? "#42474b" : "#909095",
          lineHeight: 1.5,
          maxWidth: 700,
        }}
      >
        {fixed
          ? "Selected projects, design decisions and the work behind them."
          : "Transforming ideas into innovative solutions for a better tomorrow."}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 40 }}>
        {(fixed
          ? ["View selected work ↗"]
          : ["Learn more", "Get started", "Explore"]
        ).map((s) => (
          <span
            key={s}
            style={{
              padding: "18px 25px",
              borderRadius: fixed ? 36 : 8,
              background: fixed ? ink : "#6b6382",
              color: "white",
              fontSize: 22,
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      {!mobile && (
        <div style={{ display: "flex", gap: 22, marginTop: 45 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 110,
                flex: 1,
                background: fixed
                  ? ["#e9e8e4", "#c8cccf", "#393e43"][i]
                  : "#dad7e4",
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function Punch() {
  const f = useCurrentFrame(),
    stage = Math.floor(f / 120),
    t = f % 120;
  const fixed = stage >= 5;
  const mobile = stage === 4 || stage === 6;
  return (
    <AbsoluteFill style={{ background: "#111315", color: "#fff" }}>
      <Brand tool="Punch list" dark />
      <Head dark>
        {
          [
            "Something feels wrong.",
            "Make the feedback specific.",
            "Say what you actually do.",
            "One primary action.",
            "Check the narrow screen.",
            "Apply the fixes.",
            "Check the result.",
          ][stage]
        }
      </Head>
      <div
        style={{
          ...abs,
          left: mobile ? 640 : 115,
          top: 300,
          width: mobile ? 640 : 1160,
          height: mobile ? 650 : 650,
          borderRadius: 20,
          background: "#fff",
          overflow: "hidden",
          boxShadow: "0 40px 100px #0008",
          color: ink,
          transform: `translateY(${move(t, 0, 20, 15, 0)}px)`,
        }}
      >
        <SiteDemo fixed={fixed} mobile={mobile} />
        {stage === 2 && (
          <div
            style={{
              ...abs,
              left: 35,
              top: 132,
              right: 35,
              height: 185,
              border: "3px solid #d1ab78",
              borderRadius: 9,
              opacity: move(t, 12, 25),
            }}
          />
        )}
        {stage === 3 && (
          <div
            style={{
              ...abs,
              left: 34,
              top: 425,
              width: 650,
              height: 86,
              border: "3px solid #d1ab78",
              borderRadius: 9,
              opacity: move(t, 12, 25),
            }}
          />
        )}
      </div>
      {!mobile && (
        <div style={{ ...abs, left: 1340, top: 350, width: 450 }}>
          <div
            style={{
              fontFamily: "Inter",
              fontSize: 24,
              color: "#b1b5b9",
              marginBottom: 36,
            }}
          >
            {fixed ? "RECHECK" : "PUNCH LIST"}
          </div>
          {(stage === 0
            ? ["Vague message", "Competing actions", "Mobile overflow"]
            : stage === 1
              ? ["Inspect the page", "Prioritize the issues", "Explain the fix"]
              : stage === 2
                ? ["“Innovation” says little.", "Show the actual discipline."]
                : stage === 3
                  ? ["Three buttons.", "No obvious next step."]
                  : [
                      "Specific headline",
                      "Clear next step",
                      "Responsive layout",
                    ]
          ).map((s, i) => (
            <Reveal key={s} delay={i * 18}>
              <div
                style={{
                  fontSize: 36,
                  lineHeight: 1.3,
                  padding: "24px 0",
                  borderBottom: "1px solid #444",
                }}
              >
                {fixed ? "✓ " : ""}
                {s}
              </div>
            </Reveal>
          ))}
        </div>
      )}
      {mobile && (
        <>
          <div
            style={{
              ...abs,
              left: 120,
              top: 470,
              fontSize: 43,
              width: 400,
              lineHeight: 1.3,
            }}
          >
            {fixed ? "Now check the mobile layout again." : "The desktop view is only half the check."}
          </div>
          <div
            style={{
              ...abs,
              left: 1360,
              top: 540,
              fontSize: 33,
              color: "#d1ab78",
            }}
          >
            {fixed ? "Content fits. The action stays visible." : "Text runs off the edge."}
          </div>
        </>
      )}
      {stage === 1 && (
        <div
          style={{
            ...abs,
            left: 1320,
            top: 790,
            fontFamily: "Inter",
            fontSize: 28,
            color: "#d1ab78",
          }}
        >
          /foreman:punch-list
        </div>
      )}
    </AbsoluteFill>
  );
}
function Palette() {
  const f = useCurrentFrame(),
    stage = Math.floor(f / 120);
  const colors = ["#f5f4f0", "#17191b", "#c8cccf", "#425d78"];
  const dark = stage === 5;
  return (
    <AbsoluteFill
      style={{
        background: dark ? "#111315" : paper,
        color: dark ? "#fff" : ink,
      }}
    >
      <Brand tool="Palette" dark={dark} />
      <Head dark={dark}>
        {
          [
            "A colour is not a system.",
            "Start with a material.",
            "Give each colour a job.",
            "Measure the combination.",
            "Readable, by design.",
            "Same roles. Different light.",
            "Keep the system.",
          ][stage]
        }
      </Head>
      {stage < 3 ? (
        <>
          <div
            style={{ ...abs, left: 150, top: 340, display: "flex", gap: 30 }}
          >
            {colors.map((c, i) => (
              <Reveal key={c} delay={i * 8}>
                <div
                  style={{
                    width: 382,
                    height: 400,
                    background: c,
                    border: "1px solid #aaa",
                    borderRadius: stage === 0 ? 200 : 12,
                    boxShadow: "0 20px 45px #0001",
                    transform: `rotate(${stage === 0 ? (i - 1.5) * 12 : 0}deg)`,
                  }}
                />
                <div style={{ fontSize: 30, marginTop: 28 }}>
                  {stage === 0
                    ? c
                    : stage === 1
                      ? ["Paper", "Ink", "Graphite", "Blue ink"][i]
                      : ["Background", "Text", "Border", "Action"][i]}
                </div>
              </Reveal>
            ))}
          </div>
          {stage === 1 && (
            <Prompt command="/foreman:palette">ink and paper</Prompt>
          )}
        </>
      ) : stage < 5 ? (
        <>
          <div
            style={{
              ...abs,
              left: 155,
              top: 350,
              width: 1000,
              height: 460,
              background: "#fff",
              padding: 65,
              borderRadius: 20,
              boxShadow: "0 25px 70px #0001",
            }}
          >
            <div
              style={{ fontSize: 38, color: stage === 3 ? "#aaa" : "#17191b" }}
            >
              Turki Alshuaibi
            </div>
            <div
              style={{
                fontSize: 78,
                letterSpacing: -4,
                marginTop: 65,
                color: stage === 3 ? "#aaa" : "#17191b",
              }}
            >
              Make the work
              <br />
              easy to read.
            </div>
          </div>
          <div style={{ ...abs, left: 1260, top: 390 }}>
            <div
              style={{
                fontSize: 130,
                letterSpacing: -8,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stage === 3 ? "2.32" : "17.63"}
              <span style={{ fontSize: 50, letterSpacing: -1 }}>:1</span>
            </div>
            <div
              style={{
                fontSize: 37,
                marginTop: 35,
                color: stage === 3 ? "#945027" : "#425d78",
              }}
            >
              {stage === 3 ? "Fails normal text" : "Passes normal text"}
            </div>
            <div
              style={{
                fontSize: 27,
                marginTop: 40,
                lineHeight: 1.5,
                color: "#666",
              }}
            >
              WCAG AA requires 4.5:1
              <br />
              for normal text.
            </div>
          </div>
        </>
      ) : stage === 5 ? (
        <div
          style={{
            ...abs,
            left: 160,
            right: 160,
            top: 345,
            display: "flex",
            gap: 55,
          }}
        >
          {[false, true].map((d) => (
            <div
              key={String(d)}
              style={{
                flex: 1,
                padding: 50,
                height: 470,
                background: d ? "#1e2226" : "#f5f4f0",
                color: d ? "#f5f4f0" : "#17191b",
                border: "1px solid #657078",
                borderRadius: 18,
              }}
            >
              <div style={{ fontSize: 24, opacity: 0.7 }}>
                {d ? "Dark theme" : "Light theme"}
              </div>
              <div style={{ fontSize: 59, lineHeight: 1.1, marginTop: 40 }}>
                Selected work.
              </div>
              <div style={{ fontSize: 27, marginTop: 30 }}>
                Clear type. Defined edges.
              </div>
              <div
                style={{
                  fontSize: 26,
                  display: "inline-block",
                  padding: "20px 30px",
                  borderRadius: 40,
                  marginTop: 55,
                  background: d ? "#c8d6e4" : "#425d78",
                  color: d ? "#17191b" : "#fff",
                }}
              >
                View projects ↗
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            ...abs,
            left: 300,
            top: 315,
            width: 1320,
            background: "#fff",
            padding: 65,
            border: "1px solid #d0d0ca",
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: 30, color: "#666", marginBottom: 40 }}>
            tokens.css
          </div>
          {[
            "--surface: #f5f4f0;",
            "--text: #17191b;",
            "--border: #c8cccf;",
            "--action: #425d78;",
          ].map((s, i) => (
            <Reveal key={s} delay={i * 15}>
              <div
                style={{
                  fontFamily: "Inter",
                  fontSize: 42,
                  lineHeight: 1.65,
                  display: "flex",
                  gap: 30,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 36,
                    height: 36,
                    marginTop: 16,
                    background: colors[i],
                    border: "1px solid #aaa",
                    borderRadius: 7,
                  }}
                />
                {s}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
}
function ShareCard({ ready = false }: { ready?: boolean }) {
  return (
    <div
      style={{
        width: 960,
        overflow: "hidden",
        border: "1px solid #d6d7d8",
        borderRadius: 20,
        background: "white",
        color: ink,
        boxShadow: "0 35px 90px #0002",
      }}
    >
      <div
        style={{
          height: 390,
          position: "relative",
          background: ready ? paper : "#e1e3e5",
        }}
      >
        {ready ? (
          <>
            <Img
              src={staticFile("architecture.webp")}
              style={{
                ...abs,
                right: 0,
                width: 420,
                height: 390,
                objectFit: "cover",
              }}
            />
            <div style={{ ...abs, left: 40, top: 45, fontSize: 26 }}>
              Turki Alshuaibi
            </div>
            <div
              style={{
                ...abs,
                left: 40,
                top: 125,
                fontSize: 48,
                letterSpacing: -3,
                lineHeight: 1.1,
              }}
            >
              AI engineering.
              <br />
              Design in practice.
            </div>
          </>
        ) : (
          <div
            style={{
              height: "100%",
              display: "grid",
              placeItems: "center",
              fontSize: 86,
              color: "#979da1",
            }}
          >
            ↗
          </div>
        )}
      </div>
      <div style={{ padding: "28px 36px" }}>
        <div style={{ fontSize: 20, color: "#73797e" }}>turki.example</div>
        <div style={{ fontSize: 32, marginTop: 12 }}>
          {ready ? "Turki Alshuaibi | Selected work" : "Home"}
        </div>
        <div style={{ fontSize: 23, color: "#5b6369", marginTop: 14 }}>
          {ready
            ? "AI engineering projects, process and design."
            : "No description available."}
        </div>
      </div>
    </div>
  );
}
function Launch() {
  const f = useCurrentFrame(),
    stage = Math.floor(f / 120),
    t = f % 120;
  return (
    <AbsoluteFill style={{ background: "#e9edf0", color: ink }}>
      <Brand tool="Launch" />
      <Head>
        {
          [
            "Before you send the link.",
            "Check the address.",
            "Look at the preview.",
            "Make the link worth opening.",
            "A wrong URL is still a visit.",
            "Make the page discoverable.",
            "Submit. Then monitor.",
          ][stage]
        }
      </Head>
      {stage === 0 || stage === 2 || stage === 3 ? (
        <>
          <div
            style={{
              ...abs,
              left: 480,
              top: 300,
              transform: `translateY(${move(t, 0, 25, 30, 0)}px)`,
            }}
          >
            <ShareCard ready={stage === 3} />
          </div>
          {stage === 2 && (
            <div
              style={{
                ...abs,
                left: 100,
                top: 525,
                width: 330,
                fontSize: 37,
                lineHeight: 1.3,
              }}
            >
              The page is finished.
              <br />
              The preview is not.
            </div>
          )}
        </>
      ) : stage === 1 ? (
        <>
          <div
            style={{
              ...abs,
              left: 240,
              top: 330,
              right: 240,
              background: "#fff",
              borderRadius: 100,
              padding: "35px 55px",
              fontSize: 54,
              boxShadow: "0 18px 55px #0001",
            }}
          >
            ⌁ &nbsp; https://turki.example
          </div>
          <div
            style={{
              ...abs,
              left: 330,
              top: 530,
              fontSize: 40,
              lineHeight: 1.7,
            }}
          >
            {[
              "Domain resolves",
              "HTTPS certificate is valid",
              "One canonical address",
            ].map((s, i) => (
              <Reveal delay={i * 25} key={s}>
                ✓ &nbsp;{s}
              </Reveal>
            ))}
          </div>
          <Prompt command="/foreman:launch">
            check this site before I share it
          </Prompt>
        </>
      ) : stage === 4 ? (
        <div
          style={{
            ...abs,
            left: 350,
            top: 310,
            width: 1220,
            height: 570,
            borderRadius: 18,
            background: "#fff",
            padding: 65,
            boxShadow: "0 30px 80px #0001",
          }}
        >
          <div style={{ fontSize: 25, color: "#666" }}>
            turki.example / missing
          </div>
          <div style={{ fontSize: 150, letterSpacing: -10, marginTop: 22 }}>
            404
          </div>
          <div style={{ fontSize: 42, marginTop: 10 }}>
            Let’s get you back to the work.
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "20px 30px",
              background: ink,
              color: "white",
              borderRadius: 40,
              fontSize: 25,
              marginTop: 30,
            }}
          >
            View selected work ↗
          </div>
        </div>
      ) : stage === 5 ? (
        <div style={{ ...abs, left: 260, top: 345, display: "flex", gap: 40 }}>
          {[
            ["robots.txt", "Crawling allowed"],
            ["sitemap.xml", "Canonical URLs"],
            ["Page metadata", "Title + description"],
          ].map(([a, b], i) => (
            <Reveal key={a} delay={i * 22}>
              <div
                style={{
                  width: 440,
                  height: 400,
                  background: "white",
                  border: "1px solid #ccd0d4",
                  borderRadius: 18,
                  padding: 40,
                }}
              >
                <div
                  style={{ fontSize: 55, color: "#425d78", marginBottom: 80 }}
                >
                  ✓
                </div>
                <div style={{ fontSize: 34, fontFamily: "Inter" }}>{a}</div>
                <div style={{ fontSize: 27, marginTop: 28, color: "#616970" }}>
                  {b}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div
          style={{
            ...abs,
            left: 290,
            top: 345,
            width: 1340,
            padding: 65,
            background: "#fff",
            border: "1px solid #d1d5d8",
            borderRadius: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              fontSize: 60,
            }}
          >
            <span style={{ color: "#425d78" }}>✓</span> Sitemap submitted
          </div>
          <div
            style={{
              marginTop: 60,
              paddingTop: 40,
              borderTop: "1px solid #ddd",
              fontSize: 39,
            }}
          >
            Indexing status{" "}
            <span style={{ float: "right", color: "#626a71" }}>Pending</span>
          </div>
          <div style={{ marginTop: 40, fontSize: 29, color: "#626a71" }}>
            Search engines decide when to include a page.
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
const definitions = [
  { id: "FindYourDirection", tool: "Board", slug: "board", Scene: Board },
  {
    id: "FixWhatFeelsWrong",
    tool: "Punch list",
    slug: "punch-list",
    Scene: Punch,
  },
  { id: "ColourThatWorks", tool: "Palette", slug: "palette", Scene: Palette },
  { id: "BeforeYouShare", tool: "Launch", slug: "launch", Scene: Launch },
];
function MotionScene({index}:{index:number}) {
 const f=useCurrentFrame(),t=f%120,d=definitions[index];
 const progress=move(t,0,10);
 return <AbsoluteFill>{f>=120&&t<10&&<Freeze frame={Math.floor(f/120)*120-1}><d.Scene/></Freeze>}<AbsoluteFill style={{clipPath:`inset(0 ${f<120?0:(1-progress)*100}% 0 0)`}}><d.Scene/></AbsoluteFill></AbsoluteFill>;
}
function Film({ index }: { index: number }) {
  const d = definitions[index];
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, sans-serif" }}>
      <Audio src={staticFile(`${["find-your-direction","fix-what-feels-wrong","colour-that-works","before-you-share"][index]}-effects.m4a`)} />
      <Sequence durationInFrames={840}>
        <MotionScene index={index} />
      </Sequence>
      <Sequence from={840} durationInFrames={120}>
        <End tool={d.tool} slug={d.slug} />
      </Sequence>
    </AbsoluteFill>
  );
}
export const SeriesCompositions = () => (
  <>
    {definitions.map((d, index) => (
      <Composition
        key={d.id}
        id={d.id}
        component={Film}
        defaultProps={{ index }}
        width={1920}
        height={1080}
        fps={24}
        durationInFrames={960}
      />
    ))}
  </>
);
