import React, { useLayoutEffect, useRef } from "react";
import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type MaterialMode = "ribbon" | "gates" | "sheets" | "chips" | "orbit";
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};

// Physical scene with a deterministic clock. No timer, random walk or live input.
export const MaterialStage: React.FC<{
  time: number;
  mode: MaterialMode;
  dark?: boolean;
  colour?: string;
  zoom?: number;
}> = ({ time, mode, dark = false, colour = "#3268fa", zoom = 1 }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<{
    renderer: T.WebGLRenderer;
    scene: T.Scene;
    camera: T.PerspectiveCamera;
    root: T.Group;
    pieces: T.Mesh[];
    pmrem: T.PMREMGenerator;
    environment: T.WebGLRenderTarget;
  } | null>(null);
  useLayoutEffect(() => {
    if (!canvas.current) return;
    const renderer = new T.WebGLRenderer({
      canvas: canvas.current,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(1920, 1080);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    const scene = new T.Scene();
    scene.background = new T.Color(dark ? "#05070b" : "#eef1f4");
    const camera = new T.PerspectiveCamera(32, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, 14);
    const pmrem = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.06);
    scene.environment = environment.texture;
    room.dispose();
    scene.add(new T.HemisphereLight("#eaf3ff", "#111927", 0.7));
    const key = new T.DirectionalLight("#ffffff", 2);
    key.position.set(-4, 6, 7);
    scene.add(key);
    const rim = new T.DirectionalLight("#80acff", 2);
    rim.position.set(7, -1, -2);
    scene.add(rim);
    const root = new T.Group();
    scene.add(root);
    const pieces: T.Mesh[] = [];
    const material = (c: string, metal = 0.5) =>
      new T.MeshPhysicalMaterial({
        color: c,
        metalness: metal,
        roughness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        side: T.DoubleSide,
      });
    if (mode === "ribbon") {
      // A folded material sample, its ridges continue across each interleaved sheet.
      for (let j = 0; j < 5; j++) {
        const geo = new T.PlaneGeometry(12, 3.3, 160, 44),
          a = geo.attributes.position;
        for (let i = 0; i < a.count; i++) {
          const x = a.getX(i),
            y = a.getY(i);
          a.setXYZ(
            i,
            x,
            y,
            Math.sin(x * 0.68 + j * 0.6) * 1.25 +
              Math.cos(y * 1.2 + x * 0.3) * 0.6 +
              Math.sin(x * 12) * 0.018,
          );
        }
        geo.computeVertexNormals();
        const mesh = new T.Mesh(
          geo,
          material(
            ["#17252e", colour, "#318185", "#203c62", "#456066"][j],
            j === 0 ? 0.95 : 0.55,
          ),
        );
        mesh.position.y = (j - 2) * 1.7;
        mesh.position.z = j * 0.12;
        mesh.rotation.z = 0.24;
        root.add(mesh);
        pieces.push(mesh);
      }
    } else if (mode === "gates") {
      for (let j = 0; j < 8; j++) {
        const shape = new T.Shape();
        shape.moveTo(-2, -1.35);
        shape.lineTo(2, -1.35);
        shape.quadraticCurveTo(2.35, -1.35, 2.35, -1);
        shape.lineTo(2.35, 1);
        shape.quadraticCurveTo(2.35, 1.35, 2, 1.35);
        shape.lineTo(-2, 1.35);
        shape.quadraticCurveTo(-2.35, 1.35, -2.35, 1);
        shape.lineTo(-2.35, -1);
        shape.quadraticCurveTo(-2.35, -1.35, -2, -1.35);
        const hole = new T.Path();
        hole.moveTo(-2.02, -1.03);
        hole.lineTo(-2.02, 1.03);
        hole.lineTo(2.02, 1.03);
        hole.lineTo(2.02, -1.03);
        hole.closePath();
        shape.holes.push(hole);
        const mesh = new T.Mesh(
          new T.ExtrudeGeometry(shape, {
            depth: 0.12,
            bevelEnabled: true,
            bevelSegments: 3,
            steps: 1,
            bevelSize: 0.06,
            bevelThickness: 0.06,
          }),
          material(j === 3 ? colour : "#31415a", 0.9),
        );
        root.add(mesh);
        pieces.push(mesh);
      }
    } else if (mode === "sheets") {
      for (let j = 0; j < 12; j++) {
        const mesh = new T.Mesh(
          new RoundedBoxGeometry(5.2, 3.2, 0.045, 3, 0.04),
          material(
            j === 4 ? colour : j % 3 === 0 ? "#bcc6d4" : "#f7f7f4",
            j === 4 ? 0.6 : 0.12,
          ),
        );
        root.add(mesh);
        pieces.push(mesh);
        // Printed rules on each sheet make the volume a brief rather than a blank slab.
        for (let k = 0; k < 6; k++) {
          const rule = new T.Mesh(
            new T.PlaneGeometry(k === 0 ? 1.9 : 3.7, 0.025),
            new T.MeshBasicMaterial({ color: j === 4 ? "#ffffff" : "#8b95a2" }),
          );
          rule.position.set(k === 0 ? -0.9 : 0, 1 - k * 0.32, 0.026);
          mesh.add(rule);
        }
      }
    } else if (mode === "chips") {
      for (let j = 0; j < 5; j++) {
        const mesh = new T.Mesh(
          new RoundedBoxGeometry(2.6, 4.2, 0.24, 6, 0.17),
          material(
            ["#101828", "#f5f2e9", colour, "#b8e6d3", "#c6cddd"][j],
            j === 4 ? 0.95 : 0.1,
          ),
        );
        root.add(mesh);
        pieces.push(mesh);
      }
    } else {
      for (let j = 0; j < 7; j++) {
        const mesh = new T.Mesh(
          new RoundedBoxGeometry(
            j === 0 ? 4.8 : 2.6,
            j === 0 ? 3.3 : 1.7,
            0.12,
            4,
            0.12,
          ),
          material(j === 0 ? colour : "#e9edf5", j === 0 ? 0.7 : 0.35),
        );
        root.add(mesh);
        pieces.push(mesh);
      }
    }
    state.current = {
      renderer,
      scene,
      camera,
      root,
      pieces,
      pmrem,
      environment,
    };
    return () => {
      scene.traverse((o) => {
        if (o instanceof T.Mesh) {
          o.geometry.dispose();
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => m.dispose());
        }
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      state.current = null;
    };
  }, [mode, dark, colour]);
  useLayoutEffect(() => {
    const s = state.current;
    if (!s) return;
    const { root, pieces, camera, renderer, scene } = s;
    camera.position.z = 14 / zoom;
    camera.position.x = Math.sin(time * 0.15) * 0.35;
    camera.lookAt(0, 0, 0);
    root.rotation.set(
      mode === "ribbon" ? -0.16 : 0.1,
      mode === "ribbon" ? 0.2 : Math.sin(time * 0.22) * 0.12,
      0,
    );
    pieces.forEach((m, i) => {
      if (mode === "ribbon") {
        m.rotation.x = Math.sin(time * 0.36 + i * 0.24) * 0.14;
        m.position.x = Math.sin(time * 0.2 + i * 0.2) * 0.4;
        root.rotation.z = -0.22 + time * 0.035;
      }
      if (mode === "gates") {
        m.position.set(
          Math.sin(i * 0.18 + time * 0.12) * 0.45,
          0,
          -i * 1.22 + smooth(time / 3) * 4,
        );
        m.rotation.z = (i - 3.5) * 0.035 * Math.sin(time * 0.7);
        root.rotation.y = 0.25 - Math.min(time, 4) * 0.08;
      }
      if (mode === "sheets") {
        const spread =
          smooth((time - 0.2) / 1.6) * (1 - smooth((time - 2.7) / 1));
        m.position.set(
          (i - 5.5) * 0.04,
          (i - 5.5) * (0.08 + spread * 0.3),
          (i - 5.5) * (0.08 + spread * 0.38),
        );
        m.rotation.set(0.12 + spread * 0.15, 0, (i - 5.5) * 0.018 * spread);
        root.rotation.y = -0.35 + time * 0.12;
        root.rotation.x = -0.16;
        root.scale.setScalar(0.72);
        root.position.x = 1.6;
      }
      if (mode === "chips") {
        const fan = smooth((time - 0.2) / 1.2);
        m.position.set(
          (i - 2) * 2.3 * fan,
          Math.sin(i * 0.8 + time * 0.35) * 0.2,
          (2 - Math.abs(i - 2)) * 0.35,
        );
        m.rotation.y = (i - 2) * -0.13 + Math.sin(time * 0.3) * 0.1;
        m.rotation.z = (i - 2) * -0.035 * fan;
        root.rotation.x = -0.1;
      }
      if (mode === "orbit") {
        const a = (i / 6) * Math.PI * 2 + time * 0.28;
        m.position.set(
          i === 0 ? 0 : Math.cos(a) * 5.3,
          i === 0 ? 0 : Math.sin(a) * 2.8,
          i === 0 ? 1 : Math.sin(a) * 1.1,
        );
        m.rotation.y = i === 0 ? -0.15 : Math.sin(a) * 0.2;
        m.rotation.z = i === 0 ? 0 : Math.cos(a) * 0.1;
      }
    });
    renderer.render(scene, camera);
  }, [time, zoom, mode, dark, colour]);
  return (
    <canvas
      ref={canvas}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};
