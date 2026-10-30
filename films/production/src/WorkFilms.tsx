import React from "react";
import {
  AbsoluteFill,
  Composition,
  Img,
  interpolate,
  Easing,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import timings from "./work-timings";

// Authored demonstrations of the playbook, not recordings or a new Foreman app.
const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const p = (f: number, a: number, b: number, x = 0, y = 1) =>
  interpolate(f, [a, b], [x, y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
const pos: React.CSSProperties = { position: "absolute" };
const ink = "#17191b",
  paper = "#f5f4f0",
  blue = "#4276bb";
const slugs = [
  "before-the-code",
  "find-your-direction",
  "fix-what-feels-wrong",
  "colour-that-works",
  "before-you-share",
];
const names = ["Foreman", "Board", "Punch list", "Palette", "Launch"];
const commands = [
  "Help me build my portfolio.",
  "/foreman:board a portfolio for Turki Alshuaibi",
  "/foreman:punch-list inspect this page",
  "/foreman:palette ink and paper",
  "/foreman:launch check this site",
];
const outputs = [
  [
    "Read project-notes.md",
    "Who is this for?",
    "Find references for this brief",
    "Keep hierarchy, image space, one action",
    "Lock type, colour and layout",
    "Write BRIEF.md",
    "Await approval",
    "Build from the approved brief",
  ],
  [
    "Read the brief",
    "Reader: engineering teams\nAction: see selected work",
    "Compare composition, type and hierarchy",
    "Keep: generous image space",
    "Leave: borrowed branding and copy",
    "Write visual-direction.md",
    "Use the selected direction",
  ],
  [
    "Open desktop and mobile views",
    "Inspect the page",
    "Headline: describe the actual work",
    "Actions: choose one primary button",
    "Mobile: repair horizontal overflow",
    "Apply the specific fixes",
    "Recheck the revised page",
  ],
  [
    "Material: ink and paper",
    "Extract the neutral range",
    "Assign background, text, border, action",
    "Measure text against its background",
    "Contrast: 2.32:1 → 17.63:1",
    "Check the same roles in dark mode",
    "Write colour tokens",
  ],
  [
    "Inspect the site address",
    "Check DNS and HTTPS",
    "Read title, description and OG image",
    "Render the share preview",
    "Test 404 and recovery link",
    "Inspect sitemap and robots.txt",
    "Index submission: pending",
  ],
];
function Pointer({
  x,
  y,
  click = false,
}: {
  x: number;
  y: number;
  click?: boolean;
}) {
  return (
    <div
      style={{
        ...pos,
        left: x,
        top: y,
        zIndex: 20,
        filter: "drop-shadow(0 2px 3px #0005)",
        transform: `scale(${click ? 0.88 : 1})`,
      }}
    >
      <svg width="38" height="48" viewBox="0 0 32 42">
        <path
          d="M3 2v31l8-8 7 14 6-3-7-14h12Z"
          fill="white"
          stroke="#181818"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
function Chrome({ title, dark = false }: { title: string; dark?: boolean }) {
  return (
    <div
      style={{
        height: 56,
        borderBottom: `1px solid ${dark ? "#333" : "#ddd"}`,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 9,
        color: dark ? "#999" : "#727272",
        fontSize: 18,
      }}
    >
      {["#999", "#bbb", "#ddd"].map((c) => (
        <i
          key={c}
          style={{ width: 9, height: 9, borderRadius: 9, background: c }}
        />
      ))}
      <span style={{ marginLeft: 36 }}>{title}</span>
    </div>
  );
}
function Terminal({
  index,
  stage,
  t,
}: {
  index: number;
  stage: number;
  t: number;
}) {
  const rows = outputs[index],
    current = Math.min(stage, rows.length - 1);
  return (
    <div
      style={{
        height: "100%",
        background: "#101214",
        color: "#e9e9e9",
        border: "1px solid #34373b",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 35px 90px #0004",
      }}
    >
      <Chrome title="Terminal / foreman" dark />
      <div
        style={{
          padding: 34,
          fontFamily: "Consolas, monospace",
          fontSize: 24,
          lineHeight: 1.6,
        }}
      >
        <div style={{ color: "#acb6c3", fontSize: 19, marginBottom: 30 }}>
          ~/turki-portfolio
        </div>
        <div style={{ color: "#fff", minHeight: 100 }}>
          <span style={{ color: "#8cbaef" }}>❯ </span>
          {stage === 0
            ? commands[index].slice(
                0,
                Math.floor(p(t, 0, 28, 0, commands[index].length)),
              )
            : commands[index]}
        </div>
        <div style={{ height: 1, background: "#30343b", margin: "24px 0" }} />
        {rows.slice(Math.max(0, current - 3), current + 1).map((row, j, a) => (
          <div
            key={row}
            style={{
              marginBottom: 27,
              whiteSpace: "pre-line",
              color: j === a.length - 1 ? "#e7edf5" : "#77818b",
              opacity: j === a.length - 1 ? p(t, 6, 17) : 1,
            }}
          >
            <span style={{ color: "#90b6da" }}>› </span>
            {j === a.length - 1
              ? row.slice(0, Math.floor(p(t, 7, 32, 0, row.length)))
              : row}
          </div>
        ))}
        <div
          style={{
            height: 25,
            width: 11,
            background: "#b0c8e4",
            opacity: Math.floor(t / 12) % 2 ? 0 : 1,
          }}
        />
      </div>
    </div>
  );
}
function BrowserPage({
  fixed = 1,
  mobile = 0,
  dark = 0,
}: {
  fixed?: number;
  mobile?: number;
  dark?: number;
}) {
  return (
    <div
      style={{
        background: dark > 0.5 ? "#111" : "#fff",
        color: dark > 0.5 ? "white" : ink,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Chrome title="turki / portfolio" dark={dark > 0.5} />
      <div style={{ padding: 48 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
          }}
        >
          <b>Turki Alshuaibi</b>
          <span style={{ opacity: 1 - mobile }}>
            Work &nbsp; About &nbsp; Contact
          </span>
        </div>
        <div style={{ position: "relative", height: 270, marginTop: 65 }}>
          <div
            style={{
              ...pos,
              fontSize: mobile > 0.5 ? 55 : 71,
              lineHeight: 1.03,
              letterSpacing: -3,
              opacity: 1 - fixed,
              whiteSpace: mobile > 0.5 ? "nowrap" : "normal",
            }}
          >
            Building the future
            <br />
            of digital innovation.
          </div>
          <div
            style={{
              ...pos,
              fontSize: mobile > 0.5 ? 55 : 71,
              lineHeight: 1.03,
              letterSpacing: -3,
              opacity: fixed,
              transform: `translateY(${(1 - fixed) * 25}px)`,
            }}
          >
            AI engineering.
            <br />
            Design in practice.
          </div>
        </div>
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.4,
            maxWidth: 620,
            color: dark > 0.5 ? "#bbb" : "#666",
          }}
        >
          Selected projects, design decisions
          <br />
          and the work behind them.
        </div>
        <div style={{ display: "flex", gap: 15, marginTop: 35 }}>
          {["View selected work ↗", "Get started", "Explore"].map((v, i) => (
            <div
              key={v}
              style={{
                padding: "19px 25px",
                borderRadius: 34,
                background: dark > 0.5 ? "#eee" : ink,
                color: dark > 0.5 ? ink : "white",
                fontSize: 20,
                opacity: i ? 1 - fixed : 1,
                transform: `translateX(${i * -fixed * 130}px)`,
                whiteSpace: "nowrap",
              }}
            >
              {i === 0 && fixed < 0.5 ? "Learn more" : v}
            </div>
          ))}
        </div>
        <div
          style={{
            height: 250,
            marginTop: 50,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("architecture.webp")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
function BoardCanvas({ s, t }: { s: number; t: number }) {
  const merge = p(s + t / 100, 4.3, 5.8),
    show = p(s + t / 100, 5.9, 6.4);
  return (
    <div style={{ width: 1160, height: 800, position: "relative" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            ...pos,
            left: 40 + i * 350 - merge * i * 260,
            top: 100 + i * 20 - merge * i * 12,
            width: 330,
            height: 480,
            borderRadius: 12,
            background: i === 1 ? "#151515" : "#fff",
            color: i === 1 ? "white" : ink,
            overflow: "hidden",
            boxShadow: "0 20px 40px #0002",
            transform: `translateY(${p(t, i * 4, 22 + i * 4, 35, 0)}px) rotate(${(i - 1) * (1 - merge) * 3}deg) scale(${1 - merge * 0.15})`,
            opacity: 1 - show,
            border: `2px solid ${s >= 3 && i === Math.floor(t / 24) % 3 ? blue : "#dededb"}`,
          }}
        >
          <div
            style={{
              padding: 20,
              fontSize: 17,
              borderBottom: "1px solid #8884",
            }}
          >
            0{i + 1} / {["Composition", "Typography", "Hierarchy"][i]}
          </div>
          {i === 0 ? (
            <>
              <Img
                src={staticFile("architecture.webp")}
                style={{ width: "100%", height: 325, objectFit: "cover" }}
              />
              <div style={{ padding: 20, fontSize: 23 }}>
                Room for the work.
              </div>
            </>
          ) : i === 1 ? (
            <div
              style={{
                padding: 30,
                fontSize: 66,
                lineHeight: 0.95,
                letterSpacing: -4,
              }}
            >
              Less.
              <br />
              Larger.
              <br />
              Clearer.
              <div style={{ fontSize: 18, letterSpacing: 0, marginTop: 55 }}>
                A deliberate type scale.
              </div>
            </div>
          ) : (
            <div style={{ padding: 28 }}>
              <div style={{ fontSize: 40, letterSpacing: -2, marginTop: 35 }}>
                One clear
                <br />
                next step.
              </div>
              <div
                style={{
                  marginTop: 55,
                  background: ink,
                  color: "white",
                  borderRadius: 30,
                  padding: 20,
                }}
              >
                View the work ↗
              </div>
            </div>
          )}
          <div
            style={{
              ...pos,
              bottom: 0,
              width: "100%",
              padding: 18,
              background: s >= 4 ? "#e6edf5" : i === 1 ? "#222" : "#fafafa",
              color: s >= 4 ? ink : undefined,
              fontSize: 18,
              opacity: p(s + t / 100, 2.9, 3.4),
            }}
          >
            {
              [
                "Keep the image space",
                "Keep the type hierarchy",
                "Keep one action",
              ][i]
            }
          </div>
        </div>
      ))}
      <div
        style={{
          ...pos,
          left: 420,
          top: 95,
          width: 650,
          height: 530,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 30px 70px #0002",
          padding: 42,
          opacity: merge > 0 ? 1 - show : 0,
          clipPath: `inset(0 0 ${(1 - merge) * 100}% 0)`,
          transform: `translateX(${(1 - merge) * 250}px)`,
        }}
      >
        <div style={{ fontSize: 21, color: "#687c94" }}>
          visual-direction.md
        </div>
        {[
          "Lead with selected work.",
          "Use a clear type scale.",
          "Keep one primary action.",
          "Write original copy.",
        ].map((v, i) => (
          <div
            key={v}
            style={{
              fontSize: 29,
              borderBottom: "1px solid #ddd",
              padding: "23px 0",
              opacity: p(s + t / 100, 4.5 + i * 0.15, 4.8 + i * 0.15),
            }}
          >
            {v}
          </div>
        ))}
      </div>
      <div
        style={{
          ...pos,
          inset: 0,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 25px 80px #0002",
          opacity: show,
          transform: `scale(${0.82 + 0.18 * show})`,
        }}
      >
        <BrowserPage />
      </div>
      {s >= 2 && s < 5 && (
        <Pointer
          x={210 + p(t, 0, 55, 0, 720)}
          y={465 - p(t, 0, 55, 0, 190)}
          click={t > 45 && t < 52}
        />
      )}
      {s < 2 && (
        <div
          style={{
            ...pos,
            left: 60,
            right: 60,
            bottom: 20,
            background: "#111",
            color: "#eee",
            borderRadius: 14,
            padding: 22,
            fontSize: 23,
            transform: `translateY(${p(t, 0, 20, 20, 0)}px)`,
          }}
        >
          Reader: engineering teams &nbsp; / &nbsp; Action: see selected work
        </div>
      )}
    </div>
  );
}
function PunchCanvas({ s, t }: { s: number; t: number }) {
  const fix = p(s + t / 100, 4.9, 5.45),
    mobile =
      s === 4
        ? p(t, 0, 25)
        : s === 5
          ? 1 - p(t, 0, 25)
          : s >= 6
            ? p(t, 0, 25)
            : 0;
  const w = 1160 - mobile * 610;
  return (
    <div style={{ width: 1160, height: 830, position: "relative" }}>
      <div
        style={{
          ...pos,
          left: (1160 - w) / 2,
          top: 0,
          width: w,
          height: 800,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 90px #0005",
        }}
      >
        <BrowserPage fixed={fix} mobile={mobile} />
        {s >= 2 && s <= 3 && (
          <div
            style={{
              ...pos,
              left: 30,
              top: s === 2 ? 165 : 530,
              width: s === 2 ? 1090 : 830,
              height: s === 2 ? 240 : 90,
              border: "3px solid #df795b",
              borderRadius: 9,
              opacity: p(t, 2, 14),
              clipPath: `inset(0 ${p(t, 0, 18, 100, 0)}% 0 0)`,
            }}
          />
        )}
        {s === 4 && (
          <div
            style={{
              ...pos,
              right: 0,
              top: 120,
              bottom: 0,
              width: 4,
              background: "#df795b",
            }}
          />
        )}
      </div>
      {s >= 2 && s < 5 && (
        <div
          style={{
            ...pos,
            right: 20,
            bottom: 40,
            background: "#202428",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: 14,
            padding: "23px 30px",
            fontSize: 27,
            transform: `translateY(${p(t, 10, 26, 80, 0)}px)`,
            opacity: p(t, 10, 20),
          }}
        >
          {
            [
              "",
              "",
              "Say what the work actually is.",
              "Three buttons. No clear priority.",
              "This headline leaves the viewport.",
            ][s]
          }
        </div>
      )}
      {s === 5 && (
        <div
          style={{
            ...pos,
            left: 55,
            right: 55,
            bottom: 35,
            padding: 22,
            borderRadius: 12,
            background: "#e2eee6",
            fontSize: 25,
            opacity: p(t, 35, 48),
          }}
        >
          Headline rewritten &nbsp; · &nbsp; One action &nbsp; · &nbsp; Layout
          repaired
        </div>
      )}
      <Pointer
        x={s === 4 ? 850 : 340 + p(t, 0, 45, 0, 460)}
        y={s === 3 ? 580 : 260 + p(t, 0, 45, 0, 70)}
        click={t > 42 && t < 49}
      />
    </div>
  );
}
function PaletteCanvas({ s, t }: { s: number; t: number }) {
  const progress = s + t / 100,
    spread = p(progress, 0.5, 2.3),
    ui = p(progress, 2.3, 3),
    dark = p(progress, 5, 5.6);
  const colors = ["#f5f4f0", "#17191b", "#d5d4d0", "#4276bb"];
  const fixed = p(progress, 4, 4.55);
  return (
    <div style={{ width: 1160, height: 830, position: "relative" }}>
      <div
        style={{
          ...pos,
          inset: 0,
          borderRadius: 18,
          overflow: "hidden",
          opacity: ui,
          background: dark > 0.5 ? "#111" : "#fff",
          boxShadow: "0 25px 70px #0002",
        }}
      >
        <Chrome title="brand.html / ink and paper" dark={dark > 0.5} />
        <div style={{ padding: 65, color: dark > 0.5 ? paper : ink }}>
          <div style={{ fontSize: 77, letterSpacing: -4, marginBottom: 25 }}>
            Made to be read.
          </div>
          <div
            style={{
              fontSize: 38,
              color: fixed > 0.5 ? (dark > 0.5 ? "#eee" : ink) : "#aaa",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            Good contrast makes the work accessible.
          </div>
          <div style={{ marginTop: 45, display: "flex", gap: 20 }}>
            <div
              style={{
                background: dark > 0.5 ? paper : ink,
                color: dark > 0.5 ? ink : paper,
                padding: "24px 35px",
                borderRadius: 40,
                fontSize: 27,
              }}
            >
              View selected work ↗
            </div>
            <div
              style={{
                border: "1px solid #aaa",
                padding: "24px 35px",
                borderRadius: 40,
                fontSize: 27,
              }}
            >
              About
            </div>
          </div>
          <div
            style={{
              marginTop: 55,
              background: dark > 0.5 ? "#222" : "white",
              border: "1px solid #8884",
              padding: 27,
              borderRadius: 14,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 28,
            }}
          >
            <span>Text / background</span>
            <b style={{ color: fixed > 0.5 ? "#4b8964" : "#ba6148" }}>
              {dark > 0.5
                ? "Dark roles applied"
                : fixed > 0.5
                  ? "17.63:1 · AA pass"
                  : "2.32:1 · AA fail"}
            </b>
          </div>
        </div>
      </div>
      {colors.map((c, i) => (
        <div
          key={c}
          style={{
            ...pos,
            left: 90 + i * 245,
            top: 180 - spread * 115,
            width: 205,
            height: 330 - spread * 240,
            background: c,
            border: "1px solid #8885",
            borderRadius: 15,
            transform: `rotate(${(1 - spread) * (i - 1.5) * 6}deg) translateY(${p(t, i * 5, 25 + i * 5, 45, 0)}px)`,
            boxShadow: "0 18px 35px #0002",
            opacity: 1 - ui,
          }}
        >
          <div
            style={{
              ...pos,
              bottom: 20,
              left: 20,
              color: i === 0 || i === 2 ? ink : "white",
              fontSize: 19,
            }}
          >
            {["Paper", "Ink", "Border", "Action"][i]}
            <br />
            {c}
          </div>
        </div>
      ))}
      {s === 2 && (
        <Pointer
          x={p(t, 0, 50, 1000, 500)}
          y={p(t, 0, 50, 170, 420)}
          click={t > 45}
        />
      )}
      {s === 6 && (
        <div
          style={{
            ...pos,
            inset: 40,
            background: "#11161c",
            color: "#c9d8e8",
            borderRadius: 15,
            boxShadow: "0 25px 80px #0006",
            padding: 50,
            transform: `translateY(${p(t, 0, 22, 700, 0)}px)`,
          }}
        >
          <div style={{ color: "#8a96a3", fontSize: 22, marginBottom: 45 }}>
            tokens.css
          </div>
          {[
            ":root {",
            "  --background: #f5f4f0;",
            "  --text: #17191b;",
            "  --border: #d5d4d0;",
            "  --action: #4276bb;",
            "}",
          ].map((v, i) => (
            <div
              key={v}
              style={{
                fontFamily: "Consolas, monospace",
                fontSize: 35,
                lineHeight: 1.8,
                color:
                  i === 0 || i === 5
                    ? "#ddd"
                    : ["", "#d7caae", "#a8cae4", "#c0b8cc", "#91bbdf"][i],
                opacity: p(t, 10 + i * 4, 20 + i * 4),
              }}
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function LaunchCanvas({ s, t }: { s: number; t: number }) {
  const share = p(s + t / 100, 1.8, 2.6),
    recover = p(t, 15, 40);
  return (
    <div style={{ width: 1160, height: 830, position: "relative" }}>
      <div
        style={{
          ...pos,
          left: share * 160,
          top: share * 30,
          width: 1160 - share * 320,
          height: 800 - share * 120,
          borderRadius: 18,
          overflow: "hidden",
          background: "white",
          boxShadow: "0 30px 70px #0003",
        }}
      >
        <Chrome
          title={s === 4 ? "turki.example/missing" : "https://turki.example"}
        />
        {s === 4 ? (
          <div style={{ padding: 70 }}>
            <div style={{ fontSize: 180, letterSpacing: -12 }}>404</div>
            <div style={{ fontSize: 38, marginTop: 30 }}>
              Let’s get you back to the work.
            </div>
            <div
              style={{
                padding: 23,
                background: ink,
                color: "white",
                borderRadius: 40,
                width: 260,
                fontSize: 27,
                marginTop: 40,
              }}
            >
              Back to the work ↗
            </div>
            <div style={{ ...pos, inset: 56, opacity: recover }}>
              <BrowserPage />
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                height: 480,
                overflow: "hidden",
                position: "relative",
                background: "#f5f4f0",
              }}
            >
              <Img
                src={staticFile("architecture.webp")}
                style={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                  width: "48%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 38,
                  top: 90,
                  width: "48%",
                  fontSize: 48,
                  lineHeight: 1.06,
                  letterSpacing: -2,
                }}
              >
                AI engineering.
                <br />
                Design in practice.
                <div style={{ fontSize: 19, letterSpacing: 0, marginTop: 40 }}>
                  Turki Alshuaibi
                </div>
              </div>
            </div>
            <div style={{ padding: 30 }}>
              <div style={{ fontSize: 30 }}>Turki Alshuaibi</div>
              <div style={{ fontSize: 24, color: "#666", marginTop: 16 }}>
                AI engineering and design. Selected work.
              </div>
            </div>
          </>
        )}
      </div>
      {s === 1 && (
        <div
          style={{
            ...pos,
            left: 80,
            right: 80,
            top: 110,
            background: "#11191f",
            color: "#e4edf1",
            padding: 40,
            borderRadius: 16,
            fontFamily: "Consolas",
            fontSize: 31,
            boxShadow: "0 20px 60px #0004",
            transform: `translateY(${p(t, 0, 20, 70, 0)}px)`,
          }}
        >
          {["DNS resolves", "HTTPS responds", "Canonical address matches"].map(
            (v, i) => (
              <div
                key={v}
                style={{ padding: 19, opacity: p(t, i * 13, i * 13 + 15) }}
              >
                <span style={{ color: "#91c9ae" }}>✓ </span>
                {v}
              </div>
            ),
          )}
        </div>
      )}
      {s >= 5 && (
        <div
          style={{
            ...pos,
            inset: 0,
            background: "#11161c",
            borderRadius: 18,
            color: "#e8ecf0",
            boxShadow: "0 30px 70px #0004",
            transform: `translateX(${p(t, 0, 20, 80, 0)}px)`,
          }}
        >
          <Chrome title={s === 5 ? "Discovery files" : "Launch review"} dark />
          <div style={{ padding: 55 }}>
            {[
              "sitemap.xml",
              "robots.txt",
              "canonical URL",
              "404 recovery",
              "Search index",
            ].map((v, i) => (
              <div
                key={v}
                style={{
                  fontSize: 29,
                  padding: "25px 0",
                  borderBottom: "1px solid #333",
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: p(t, i * 7, i * 7 + 12),
                }}
              >
                <span>{v}</span>
                <span style={{ color: i === 4 ? "#bbb" : "#9bc5ae" }}>
                  {i === 4 ? "Pending" : "Checked"}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 35, fontSize: 23, color: "#9da5ae" }}>
              Submission does not guarantee indexing.
            </div>
          </div>
        </div>
      )}
      <Pointer
        x={s === 4 ? 450 : 800}
        y={s === 4 ? 660 : 610}
        click={t > 24 && t < 33}
      />
    </div>
  );
}
function Brief({ s, t }: { s: number; t: number }) {
  return (
    <div
      style={{
        width: 1160,
        height: 830,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 25px 80px #0003",
        overflow: "hidden",
      }}
    >
      <Chrome title="BRIEF.md" />
      <div style={{ padding: 60 }}>
        <div style={{ fontSize: 50, letterSpacing: -2, marginBottom: 30 }}>
          Turki Alshuaibi / Portfolio
        </div>
        {[
          "Reader     Engineering teams",
          "Action     View selected work",
          "Direction  Work first. Clear type.",
          "System     Ink, paper, one action",
          "Scope      Home, work, about",
        ].map((v, i) => (
          <div
            key={v}
            style={{
              padding: "24px 0",
              borderBottom: "1px solid #ddd",
              fontFamily: "Consolas",
              fontSize: 29,
              opacity: p(t, i * 4, i * 4 + 12),
            }}
          >
            {v}
          </div>
        ))}
        <div
          style={{
            marginTop: 40,
            fontSize: 27,
            color: s >= 7 ? "#32634b" : "#666",
          }}
        >
          {s >= 7
            ? "Approved. Ready to build."
            : "Review the decisions before building."}
        </div>
      </div>
    </div>
  );
}
function BuildCanvas({ t }: { t: number }) {
  const done = p(t, 24, 62);
  const code = [
    "<main>",
    "  <h1>AI engineering.</h1>",
    "  <p>Design in practice.</p>",
    '  <a href="#work">',
    "    View selected work",
    "  </a>",
    "</main>",
  ];
  return (
    <div style={{ width: 1160, height: 830, position: "relative" }}>
      <div
        style={{
          ...pos,
          inset: 0,
          background: "#11161c",
          color: "#c9d8e8",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 30px 70px #0004",
        }}
      >
        <Chrome title="index.html" dark />
        <div
          style={{
            padding: 45,
            fontFamily: "Consolas",
            fontSize: 32,
            lineHeight: 1.9,
          }}
        >
          {code.map((v, i) => (
            <div
              key={i}
              style={{
                color: i % 2 ? "#c5d9b4" : "#a3c8ef",
                opacity: p(t, i * 4, i * 4 + 8),
              }}
            >
              <span style={{ color: "#56616c", marginRight: 25 }}>{i + 1}</span>
              {v.slice(0, Math.floor(p(t, i * 4, i * 4 + 12, 0, v.length)))}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          ...pos,
          inset: 0,
          background: "white",
          borderRadius: 18,
          overflow: "hidden",
          clipPath: `inset(0 0 0 ${(1 - done) * 100}%)`,
          transform: `translateX(${(1 - done) * 40}px)`,
        }}
      >
        <BrowserPage />
      </div>
    </div>
  );
}
function MainCanvas({ s, t }: { s: number; t: number }) {
  if (s < 3)
    return (
      <div
        style={{
          width: 1160,
          height: 830,
          background: "#101214",
          color: "white",
          borderRadius: 18,
          boxShadow: "0 30px 90px #0004",
        }}
      >
        <Chrome title="Foreman / portfolio" dark />
        <div style={{ padding: 70 }}>
          <div
            style={{
              fontSize: 54,
              lineHeight: 1.2,
              letterSpacing: -2,
              marginTop: 55,
            }}
          >
            {s === 0
              ? "Before the code."
              : s === 1
                ? "Help me build my portfolio."
                : "Who is it for?"}
          </div>
          <div
            style={{
              marginTop: 55,
              fontSize: 33,
              color: "#b7c4d3",
              lineHeight: 1.7,
              opacity: p(t, 15, 32),
            }}
          >
            {s === 0
              ? "A brief. A direction. Then a build."
              : s === 1
                ? "Reading project-notes.md..."
                : "Engineering teams.\nShow the work. Make contact easy."}
          </div>
          <div
            style={{
              marginTop: 65,
              height: 3,
              width: p(t, 0, 55, 0, 800),
              background: "#a5c9eb",
            }}
          />
        </div>
      </div>
    );
  if (s === 5) return <PaletteCanvas s={2} t={t} />;
  if (s < 6) return <BoardCanvas s={s === 3 ? 2 : s === 4 ? 3 : 6} t={t} />;
  if (s === 8) return <BuildCanvas t={t} />;
  if (s < 9) return <Brief s={s} t={t} />;
  if (s === 9)
    return (
      <div
        style={{
          width: 1160,
          height: 830,
          overflow: "hidden",
          borderRadius: 18,
          boxShadow: "0 25px 80px #0004",
        }}
      >
        <Img
          src={staticFile("foreman-site.png")}
          style={{
            width: "100%",
            transform: `translateY(${p(t, 0, 65, 0, -170)}px)`,
          }}
        />
      </div>
    );
  return (
    <div
      style={{
        width: 1160,
        height: 830,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}
    >
      {["Board", "Palette", "Punch list", "Launch"].map((v, i) => (
        <div
          key={v}
          style={{
            background: i % 2 ? "#17191b" : "#fff",
            color: i % 2 ? "#fff" : ink,
            borderRadius: 18,
            padding: 35,
            boxShadow: "0 20px 50px #0002",
            transform: `translateY(${p(t, i * 6, i * 6 + 20, 60, 0)}px)`,
            opacity: p(t, i * 5, i * 5 + 15),
          }}
        >
          <div style={{ fontSize: 40, letterSpacing: -2 }}>{v}</div>
          <div style={{ fontSize: 70, marginTop: 30 }}>
            {["▧", "◐", "✓", "↗"][i]}
          </div>
          <div style={{ fontSize: 23, marginTop: 20 }}>
            {
              [
                "Find a direction",
                "Build the colour system",
                "Fix the weak spots",
                "Check before sharing",
              ][i]
            }
          </div>
        </div>
      ))}
    </div>
  );
}
function WorkFilm({ index }: { index: number }) {
  const f = useCurrentFrame(),
    data = timings[index],
    seconds = f / 24;
  let s = data.starts.findIndex(
    (v, i) => seconds >= v && seconds < v + data.durations[i],
  );
  if (s < 0) s = data.starts.length - 1;
  const t = (seconds - data.starts[s]) * 24,
    last = index === 0 ? 12 : 7,
    end = s >= last;
  const zoom = p(s + t / 100, 2, 3),
    pull = p(s + t / 100, 5.7, 6.5);
  const camera = 1 + zoom * 0.12 - pull * 0.1;
  const terminalX = -zoom * 460 + pull * 200;
  return (
    <AbsoluteFill
      style={{
        background: paper,
        fontFamily: "Inter, sans-serif",
        color: ink,
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile(`work-audio/${slugs[index]}.m4a`)} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 70% 15%, #fff 10%, #ecebe7 75%)",
        }}
      />
      <div
        style={{
          ...pos,
          left: 65,
          top: 38,
          display: "flex",
          gap: 18,
          alignItems: "center",
          fontSize: 26,
          zIndex: 30,
        }}
      >
        <svg width="35" height="30" viewBox="0 0 48 40">
          <path
            d="M7 30v-4c0-8 5-14 13-16V8c0-4 8-4 8 0v2c8 2 13 8 13 16v4h2c6 0 6 8-2 8H7c-8 0-8-8 0-8Z"
            fill={ink}
          />
        </svg>
        <b style={{ fontWeight: 500 }}>Foreman</b>
        <span style={{ color: "#777" }}>{index ? names[index] : ""}</span>
      </div>
      <div
        style={{
          ...pos,
          inset: 0,
          opacity: end ? 1 - p(t, 0, 13) : 1,
          transform: `translateX(${-zoom * 70}px) scale(${camera})`,
          transformOrigin: "75% 50%",
        }}
      >
        <div
          style={{
            ...pos,
            left: 60 + terminalX,
            top: 150,
            width: 565,
            height: 790,
            transform: `perspective(2400px) rotateY(${zoom * 4}deg)`,
            opacity: 1 - zoom + pull * 0.8,
          }}
        >
          <Terminal index={index} stage={s} t={t} />
        </div>
        <div
          style={{
            ...pos,
            left: 680 - zoom * 160,
            top: 135,
            transform: `perspective(2400px) rotateY(${p(f, 0, 36, -4, 0)}deg) translateY(${p(f, 0, 28, 45, 0)}px)`,
            opacity: p(f, 0, 10),
          }}
        >
          {index === 0 ? (
            <MainCanvas s={s} t={t} />
          ) : index === 1 ? (
            <BoardCanvas s={s} t={t} />
          ) : index === 2 ? (
            <PunchCanvas s={s} t={t} />
          ) : index === 3 ? (
            <PaletteCanvas s={s} t={t} />
          ) : (
            <LaunchCanvas s={s} t={t} />
          )}
        </div>
      </div>
      {end && (
        <AbsoluteFill
          style={{
            background: ink,
            color: "#fff",
            justifyContent: "center",
            alignItems: "center",
            clipPath: `circle(${p(t, 0, 24, 0, 120)}% at 74% 50%)`,
          }}
        >
          <div
            style={{
              fontSize: 105,
              letterSpacing: -6,
              transform: `translateY(${p(t, 12, 35, 40, 0)}px)`,
              opacity: p(t, 12, 30),
            }}
          >
            Foreman{index ? " " + names[index] : ""}
          </div>
          <div style={{ fontSize: 30, marginTop: 35, opacity: p(t, 20, 40) }}>
            Free and open source. By Turki Alshuaibi.
          </div>
          <div
            style={{
              fontSize: 25,
              color: "#afb4bb",
              marginTop: 80,
              opacity: p(t, 30, 50),
            }}
          >
            foreman.turkialshuaibi.com
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
export const WorkCompositions = () => (
  <>
    {slugs.map((slug, index) => (
      <Composition
        key={slug}
        id={`Work-${slug}`}
        component={WorkFilm}
        defaultProps={{ index }}
        width={1920}
        height={1080}
        fps={24}
        durationInFrames={Math.round(timings[index].duration * 24)}
      />
    ))}
  </>
);
