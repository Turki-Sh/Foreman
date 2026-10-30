import React, { useLayoutEffect, useRef, useState } from "react";
import * as T from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  staticFile,
  delayRender,
  continueRender,
  cancelRender,
} from "remotion";

const ease = (t: number) => {
  const q = Math.max(0, Math.min(1, t));
  return q * q * (3 - 2 * q);
};
export type StageKind = "phone" | "gallery" | "brief" | "pigment" | "checks";
export const CinemaStage: React.FC<{
  time: number;
  kind: StageKind;
  dark?: boolean;
  pose?: number;
  progress?: number;
  screen?: string;
}> = ({
  time,
  kind,
  dark = false,
  pose = 0,
  progress = 0,
  screen = "home",
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const current = useRef({ time, pose, progress });
  current.current = { time, pose, progress };
  const [handle] = useState(() =>
    delayRender("Load licensed device and scene assets"),
  );
  const state = useRef<{
    renderer: T.WebGLRenderer;
    scene: T.Scene;
    camera: T.PerspectiveCamera;
    root: T.Group;
    objects: T.Object3D[];
    phone: T.Group | null;
    draw: (t: number, p: number) => void;
    dispose: () => void;
  } | null>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    let alive = true;
    const renderer = new T.WebGLRenderer({
      canvas: ref.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(1920, 1080);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(30, 16 / 9, 0.1, 100);
    camera.position.set(0, 1, 18);
    camera.lookAt(0, 0, 0);
    const pm = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pm.fromScene(room, 0.04);
    scene.environment = env.texture;
    room.dispose();
    scene.add(new T.HemisphereLight("#dceaff", "#0d1523", 1));
    const key = new T.DirectionalLight("#ffffff", 3.4);
    key.position.set(-5, 8, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.normalBias = 0.025;
    key.shadow.radius = 4;
    scene.add(key);
    const edge = new T.DirectionalLight("#9ec9ff", 3);
    edge.position.set(6, 1, -4);
    scene.add(edge);
    const warm = new T.DirectionalLight("#f2bd96", 1.4);
    warm.position.set(-8, -1, 1);
    scene.add(warm);
    const root = new T.Group();
    scene.add(root);
    const objects: T.Object3D[] = [];
    let phone: T.Group | null = null;
    const floor = new T.Mesh(
      new T.PlaneGeometry(200, 200),
      new T.ShadowMaterial({ opacity: dark ? 0.26 : 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    floor.receiveShadow = true;
    scene.add(floor);
    const mat = (color: string, metal = 0.1) =>
      new T.MeshPhysicalMaterial({
        color,
        metalness: metal,
        roughness: 0.24,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
      });
    const texLoader = new T.TextureLoader();
    const tex = (name: string) =>
      texLoader.loadAsync(staticFile(name)).then((x) => {
        x.colorSpace = T.SRGBColorSpace;
        x.anisotropy = 8;
        return x;
      });
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1179;
    screenCanvas.height = 2556;
    const ctx = screenCanvas.getContext("2d")!;
    const screenTexture = new T.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = T.SRGBColorSpace;
    screenTexture.flipY = true;
    screenTexture.anisotropy = 8;
    let architecture: HTMLImageElement | null = null;
    function draw(t: number, p: number) {
      const night = screen === "palette" && t > 1.8;
      const fg = night ? "#edf3fc" : "#111";
      const bg = night ? "#101c31" : "#fafafa";
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1179, 2556);
      ctx.fillStyle = fg;
      ctx.font = "500 38px Inter";
      ctx.fillText("9:41", 100, 85);
      ctx.fillText("▰", 1000, 85);
      ctx.strokeStyle = "#d5d6d9";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(52, 190, 1075, 130, 65);
      ctx.stroke();
      ctx.fillStyle = fg;
      ctx.font = "600 45px Inter";
      ctx.fillText("Foreman", 100, 273);
      ctx.font = "400 35px Inter";
      ctx.fillText("Install", 930, 273);
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.font = "500 104px Inter";
      ctx.fillText("Every good build", 589, 540);
      ctx.fillText("starts as a", 589, 655);
      ctx.fillText("drawing.", 589, 770);
      ctx.font = "400 37px Inter";
      ctx.fillStyle = night ? "#c4d4eb" : "#50545b";
      ctx.fillText("The interview. The decisions.", 589, 900);
      ctx.fillText("The brief. Then the build.", 589, 960);
      ctx.fillStyle = screen === "palette" ? "#2862f5" : "#111";
      ctx.beginPath();
      ctx.roundRect(340, 1040, 500, 115, 58);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "500 40px Inter";
      ctx.fillText("Install Foreman  ↗", 590, 1114);
      if (architecture) {
        ctx.globalAlpha = night ? 0.42 : 1;
        ctx.drawImage(architecture, 0, 1180, 1179, 680);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.roundRect(60, 1690, 1059, 690, 35);
      ctx.fill();
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff";
      ctx.font = "500 39px Inter";
      ctx.fillText("Claude Code", 110, 1775);
      const lines = [
        "help me build my portfolio",
        "Who is this for?",
        "What should they do next?",
        "Read the references.",
        "Lock the direction.",
      ];
      ctx.font = "400 30px monospace";
      lines.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#dda17d" : "#cdd7df";
        ctx.fillText(
          s.slice(0, Math.max(0, Math.floor((t - i * 0.35) * 35))),
          110,
          1870 + i * 78,
        );
      });
      if (p > 0.5) {
        ctx.fillStyle = "#d2eddf";
        ctx.beginPath();
        ctx.roundRect(110, 2270, 800, 65, 18);
        ctx.fill();
        ctx.fillStyle = "#164736";
        ctx.fillText("Ready for your review", 145, 2315);
      }
      if (screen === "portfolio") {
        ctx.fillStyle = "#f6f8fb";
        ctx.fillRect(0, 130, 1179, 2426);
        ctx.textAlign = "left";
        ctx.fillStyle = "#172b46";
        ctx.font = "500 42px Inter";
        ctx.fillText("Selected work", 80, 255);
        ctx.font = "400 36px Inter";
        ctx.fillText("About", 950, 255);
        ctx.strokeStyle = "#d7e0eb";
        ctx.beginPath();
        ctx.moveTo(80, 310);
        ctx.lineTo(1100, 310);
        ctx.stroke();
        ctx.font = "500 112px Inter";
        ctx.fillStyle = p > 0.5 ? "#101c31" : "#a0abba";
        ctx.fillText(p > 0.5 ? "Engineering," : "Welcome to", 80, 570);
        ctx.fillText(p > 0.5 ? "made useful." : "my website.", 80, 700);
        ctx.font = "400 43px Inter";
        ctx.fillStyle = "#526781";
        ctx.fillText("Projects. Experiments.", 80, 850);
        ctx.fillText("The thinking behind the work.", 80, 915);
        ctx.fillStyle = p > 0.5 ? "#2862f5" : "#e4e9f0";
        ctx.beginPath();
        ctx.roundRect(80, 1010, p > 0.5 ? 690 : 430, 140, 70);
        ctx.fill();
        ctx.fillStyle = p > 0.5 ? "#fff" : "#8e9bad";
        ctx.font = "500 43px Inter";
        ctx.fillText(p > 0.5 ? "See the projects  ↗" : "Explore", 135, 1100);
        if (architecture) {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(80, 1270, 1020, 780, 38);
          ctx.clip();
          ctx.drawImage(architecture, 80, 1270, 1020, 780);
          ctx.restore();
        }
        ctx.fillStyle = "#101c31";
        ctx.font = "500 56px Inter";
        ctx.fillText("From a brief to a build", 80, 2165);
        ctx.fillStyle = "#526781";
        ctx.font = "400 38px Inter";
        ctx.fillText("Design decisions, made visible.", 80, 2250);
      }
      ctx.textAlign = "left";
      screenTexture.needsUpdate = true;
    }
    async function init() {
      await document.fonts.ready;
      const arch = await tex("architecture.webp");
      architecture = arch.image as HTMLImageElement;
      if (kind === "phone") {
        const draco = new DRACOLoader();
        draco.setDecoderPath(staticFile("cinema/draco/"));
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync(staticFile("cinema/iphone.glb"));
        phone = gltf.scene;
        phone.traverse((o) => {
          if (o instanceof T.Mesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            const m = o.material as T.MeshStandardMaterial;
            if (m.name === "pIJKfZsazmcpEiU") {
              o.material = new T.MeshBasicMaterial({
                map: screenTexture,
                toneMapped: false,
              });
            } else if (m.isMeshStandardMaterial) {
              m.envMapIntensity = 1.3;
            }
          }
        });
        const box = new T.Box3().setFromObject(phone);
        const center = box.getCenter(new T.Vector3());
        phone.position.sub(center);
        const group = new T.Group();
        group.add(phone);
        const size = box.getSize(new T.Vector3());
        group.scale.setScalar(7.3 / size.y);
        group.rotation.y = Math.PI;
        root.add(group);
        phone = group;
        draco.dispose();
      } else if (kind === "gallery") {
        const names = ["home", "board", "palette", "punch", "launch"];
        for (let i = 0; i < 7; i++) {
          const map = await tex("cinema/" + names[i % 5] + ".png");
          const g = new T.Group();
          const body = new T.Mesh(
            new RoundedBoxGeometry(4.6, 3.5, 0.075, 4, 0.07),
            mat("#fafcff", 0.4),
          );
          body.castShadow = true;
          g.add(body);
          const face = new T.Mesh(
            new T.PlaneGeometry(4.43, 3.28),
            new T.MeshBasicMaterial({ map }),
          );
          face.position.z = 0.042;
          g.add(face);
          root.add(g);
          objects.push(g);
        }
      } else if (kind === "brief") {
        for (let i = 0; i < 8; i++) {
          const c = document.createElement("canvas");
          c.width = 1200;
          c.height = 1500;
          const x = c.getContext("2d")!;
          x.fillStyle = "#f9f7f3";
          x.fillRect(0, 0, 1200, 1500);
          x.fillStyle = "#132441";
          x.font = "600 62px Inter";
          x.fillText(
            [
              "The brief",
              "The reader",
              "The action",
              "References",
              "Typography",
              "Colour",
              "Layout",
              "Ready to build",
            ][i],
            95,
            160,
          );
          x.font = "400 34px Inter";
          const copy = [
            [
              "A portfolio for an AI engineer",
              "Show the work. Explain the decisions.",
              "Make contact easy.",
            ],
            [
              "Engineering and design teams",
              "Looking for evidence of good work.",
            ],
            ["Review the selected projects", "Then start a conversation."],
            ["Strong hierarchy", "Physical depth", "Clear next action"],
            ["One family", "A deliberate scale", "Room to read"],
            ["Ink for type", "Cobalt for action", "Ice for space"],
            ["Lead with the work", "Show the evidence", "One primary action"],
            ["Decisions agreed", "Build against this brief"],
          ][i];
          copy.forEach((s, j) => x.fillText(s, 95, 290 + j * 88));
          x.strokeStyle = "#cbd3dd";
          for (let k = 0; k < 6; k++) {
            x.beginPath();
            x.moveTo(95, 750 + k * 80);
            x.lineTo(1100, 750 + k * 80);
            x.stroke();
          }
          const tx = new T.CanvasTexture(c);
          tx.colorSpace = T.SRGBColorSpace;
          const g = new T.Group();
          const sheet = new T.Mesh(
            new RoundedBoxGeometry(4.4, 5.5, 0.045, 3, 0.025),
            mat("#faf8f4"),
          );
          sheet.castShadow = true;
          g.add(sheet);
          const face = new T.Mesh(
            new T.PlaneGeometry(4.35, 5.44),
            new T.MeshBasicMaterial({ map: tx }),
          );
          face.position.z = 0.025;
          g.add(face);
          root.add(g);
          objects.push(g);
        }
      } else if (kind === "pigment") {
        const cols = ["#132441", "#2862f5", "#9fc8f4", "#bd754e", "#dceee5"];
        for (let i = 0; i < 5; i++) {
          const material = mat(cols[i], i === 3 ? 0.92 : i === 0 ? 0.15 : 0.03);
          material.roughness = i === 3 ? 0.2 : i === 0 ? 0.38 : 0.3;
          material.clearcoat = i === 0 ? 0.2 : 0.7;
          const ball = new T.Mesh(new T.SphereGeometry(1.18, 64, 48), material);
          ball.castShadow = true;
          root.add(ball);
          objects.push(ball);
        }
      } else {
        for (let i = 0; i < 5; i++) {
          const g = new T.Group();
          const body = new T.Mesh(
            new RoundedBoxGeometry(3.8, 1.7, 0.25, 6, 0.24),
            mat(i === 4 ? "#f4e1d0" : "#eef4fa", 0.25),
          );
          body.castShadow = true;
          g.add(body);
          const c = document.createElement("canvas");
          c.width = 900;
          c.height = 360;
          const x = c.getContext("2d")!;
          x.fillStyle = i === 4 ? "#f4e1d0" : "#eef4fa";
          x.fillRect(0, 0, 900, 360);
          x.fillStyle = "#152742";
          x.font = "500 70px Inter";
          x.fillText(
            ["Domain", "HTTPS", "Share card", "404", "Search Console"][i],
            55,
            150,
          );
          x.font = "400 42px Inter";
          x.fillStyle = i === 4 ? "#a15e39" : "#337961";
          x.fillText(i === 4 ? "Needs your account" : "Checked", 55, 245);
          const tx = new T.CanvasTexture(c);
          tx.colorSpace = T.SRGBColorSpace;
          const face = new T.Mesh(
            new T.PlaneGeometry(3.6, 1.44),
            new T.MeshBasicMaterial({ map: tx }),
          );
          face.position.z = 0.132;
          g.add(face);
          root.add(g);
          objects.push(g);
        }
      }
      if (!alive) return;
      state.current = {
        renderer,
        scene,
        camera,
        root,
        objects,
        phone,
        draw,
        dispose: () => {
          scene.traverse((o) => {
            if (o instanceof T.Mesh) {
              o.geometry.dispose();
              const materials = Array.isArray(o.material)
                ? o.material
                : [o.material];
              materials.forEach((m) => {
                const map = (m as T.MeshStandardMaterial).map;
                if (map) map.dispose();
                m.dispose();
              });
            }
          });
          screenTexture.dispose();
          arch.dispose();
          env.dispose();
          pm.dispose();
          renderer.dispose();
        },
      };
      update();
      continueRender(handle);
    }
    function update() {
      const { time: t, pose: po, progress: p } = current.current;
      draw(t, p);
      root.rotation.set(0, 0, 0);
      root.position.set(0, 0, 0);
      if (phone) {
        const a = ease(t / 1.1);
        root.rotation.y = (-0.55 + 0.12 * Math.sin(t * 0.55)) * (1 - po * 0.7);
        root.rotation.z = -0.13 + 0.05 * Math.sin(t * 0.4);
        root.position.x = po === 1 ? 2.4 : po === 2 ? -2.5 : 0;
        root.position.y = Math.sin(t * 0.65) * 0.12;
        camera.position.z = po === 3 ? 12 : 18;
        root.scale.setScalar(po === 3 ? 1.5 : 1);
        root.rotation.x = 0.06;
        root.position.z = (1 - a) * -4;
      }
      if (kind === "gallery") {
        objects.forEach((o, i) => {
          const q = i - 3;
          const selected = ease((t - 1.5) / 1.3);
          o.position.set(
            q * 4.9 - t * 0.5,
            Math.sin(i * 0.9) * 0.35,
            (i === 3 ? selected * 3 : 0) - Math.abs(q) * 0.45,
          );
          o.rotation.set(-0.12, q * -0.14, 0.02 * q);
        });
        root.rotation.y = -0.14;
        camera.position.z = 18 - ease((t - 3) / 1.2) * 2;
      }
      if (kind === "brief") {
        objects.forEach((o, i) => {
          const spread = 1 - ease((t - 1.3) / 1.3);
          o.position.set(
            (i - 3.5) * 1.4 * spread,
            (i - 3.5) * 0.36 * spread,
            -i * 0.11,
          );
          o.rotation.set(
            -0.12,
            (i - 3.5) * 0.1 * spread,
            (i - 3.5) * 0.045 * spread,
          );
        });
        root.rotation.y = 0.2;
        root.rotation.z = -0.06;
      }
      if (kind === "pigment") {
        objects.forEach((o, i) => {
          const q = i - 2;
          const unpack = ease((t - 0.4) / 1.7);
          o.position.set(
            q * (1.25 + unpack * 1.6),
            Math.sin(i * 1.3 + t * 0.7) * (0.8 - unpack * 0.5),
            Math.cos(i * 1.1) * 1.4,
          );
          o.scale.setScalar(i === 1 ? 1.22 : 1);
        });
        root.rotation.y = t * 0.08;
      }
      if (kind === "checks") {
        objects.forEach((o, i) => {
          o.position.set(
            i % 2 ? 2.15 : -2.15,
            2.6 - Math.floor(i / 2) * 2.1,
            (1 - ease((t - i * 0.2) / 0.8)) * -8,
          );
          o.rotation.y = i % 2 ? -0.1 : 0.1;
        });
        root.rotation.x = -0.08;
        root.rotation.y = 0.1;
      }
      renderer.render(scene, camera);
    }
    init().catch((e) => cancelRender(e));
    return () => {
      alive = false;
      state.current?.dispose();
      state.current = null;
    };
  }, [kind, dark, screen, handle]);
  useLayoutEffect(() => {
    const s = state.current;
    if (!s) return;
    s.draw(time, progress);
    const { root, objects, camera, phone } = s;
    if (phone) {
      root.rotation.y =
        (-0.55 + 0.12 * Math.sin(time * 0.55)) * (1 - pose * 0.7);
      root.rotation.z = -0.13 + 0.05 * Math.sin(time * 0.4);
      root.rotation.x = 0.06;
      root.position.set(
        pose === 1 ? 2.4 : pose === 2 ? -2.5 : 0,
        Math.sin(time * 0.65) * 0.12,
        (1 - ease(time / 1.1)) * -4,
      );
      camera.position.z = pose === 3 ? 12 : 18;
      root.scale.setScalar(pose === 3 ? 1.5 : 1);
    }
    if (kind === "gallery") {
      objects.forEach((o, i) => {
        const q = i - 3;
        o.position.set(
          q * 4.9 - time * 0.5,
          Math.sin(i * 0.9) * 0.35,
          (i === 3 ? ease((time - 1.5) / 1.3) * 3 : 0) - Math.abs(q) * 0.45,
        );
        o.rotation.set(-0.12, q * -0.14, 0.02 * q);
      });
      root.rotation.y = -0.14;
      camera.position.z = 18 - ease((time - 3) / 1.2) * 2;
    }
    if (kind === "brief") {
      objects.forEach((o, i) => {
        const p = 1 - ease((time - 1.3) / 1.3);
        o.position.set((i - 3.5) * 1.4 * p, (i - 3.5) * 0.36 * p, -i * 0.11);
        o.rotation.set(-0.12, (i - 3.5) * 0.1 * p, (i - 3.5) * 0.045 * p);
      });
      root.rotation.y = 0.2;
      root.rotation.z = -0.06;
    }
    if (kind === "pigment") {
      objects.forEach((o, i) => {
        const p = ease((time - 0.4) / 1.7);
        o.position.set(
          (i - 2) * (1.25 + p * 1.6),
          Math.sin(i * 1.3 + time * 0.7) * (0.8 - p * 0.5),
          Math.cos(i * 1.1) * 1.4,
        );
        o.scale.setScalar(i === 1 ? 1.22 : 1);
      });
      root.rotation.y = time * 0.08;
    }
    if (kind === "checks") {
      objects.forEach((o, i) => {
        o.position.set(
          i % 2 ? 2.15 : -2.15,
          2.6 - Math.floor(i / 2) * 2.1,
          (1 - ease((time - i * 0.2) / 0.8)) * -8,
        );
        o.rotation.y = i % 2 ? -0.1 : 0.1;
      });
      root.rotation.x = -0.08;
      root.rotation.y = 0.1;
    }
    s.renderer.render(s.scene, camera);
  }, [time, pose, progress, kind]);
  return (
    <canvas
      ref={ref}
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};
