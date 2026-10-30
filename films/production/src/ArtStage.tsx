import React, { useLayoutEffect, useRef } from "react";
import * as T from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Original animated studies, reconstructed from the supplied composition references.
export const ArtStage: React.FC<{
  kind: string;
  t: number;
  variant?: number;
}> = ({ kind, t, variant = 0 }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef<{
    render: (t: number) => void;
    dispose: () => void;
  } | null>(null);
  useLayoutEffect(() => {
    if (!canvas.current) return;
    const renderer = new T.WebGLRenderer({
      canvas: canvas.current,
      alpha: true,
      antialias: true,
    });
    const aspect = kind === "materials" ? 2.2 : kind === "404" ? 16 / 9 : 1.25;
    renderer.setSize(1200, Math.round(1200 / aspect), false);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(32, aspect, 0.1, 100);
    camera.position.set(0, 0, 12);
    const pm = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pm.fromScene(room, 0.035);
    scene.environment = env.texture;
    room.dispose();
    scene.add(new T.HemisphereLight("#d8eeff", "#111325", 2));
    const key = new T.DirectionalLight("#fff", 5);
    key.position.set(-4, 5, 6);
    scene.add(key);
    const rim = new T.DirectionalLight("#8beaff", 4);
    rim.position.set(4, 0, -2);
    scene.add(rim);
    const root = new T.Group();
    scene.add(root);
    const items: T.Object3D[] = [];
    const textures: T.Texture[] = [];
    const chrome = (color: string, rough = 0.1) =>
      new T.MeshPhysicalMaterial({
        color,
        metalness: 1,
        roughness: rough,
        clearcoat: 1,
        envMapIntensity: 2.3,
      });
    const rainbow = () => {
      const c = document.createElement("canvas");
      c.width = 1024;
      c.height = 512;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 1024, 400);
      [
        "#ffb500",
        "#ff4417",
        "#ed0097",
        "#270065",
        "#1e0671",
        "#ec006a",
        "#ffb500",
      ].forEach((v, i) => g.addColorStop(i / 6, v));
      x.fillStyle = g;
      x.fillRect(0, 0, 1024, 512);
      const map = new T.CanvasTexture(c);
      map.colorSpace = T.SRGBColorSpace;
      return new T.MeshPhysicalMaterial({
        map,
        metalness: 0.35,
        roughness: 0.09,
        clearcoat: 1,
        iridescence: 0.5,
        envMapIntensity: 0.8,
      });
    };
    function foil() {
      const c = document.createElement("canvas");
      c.width = c.height = 1024;
      const x = c.getContext("2d")!;
      x.fillStyle = "#08056c";
      x.fillRect(0, 0, 1024, 1024);
      const blooms: [number, number, number, string][] = [
        [80, 540, 640, "#04fff2"],
        [780, 250, 570, "#39a8ff"],
        [900, 830, 520, "#ffce03"],
        [300, 90, 400, "#6b00fd"],
      ];
      blooms.forEach(([a, b, r, color]) => {
        const g = x.createRadialGradient(a, b, 0, a, b, r);
        g.addColorStop(0, color);
        g.addColorStop(1, color + "00");
        x.fillStyle = g;
        x.fillRect(0, 0, 1024, 1024);
      });
      const map = new T.CanvasTexture(c);
      map.colorSpace = T.SRGBColorSpace;
      textures.push(map);
      return new T.MeshPhysicalMaterial({
        map,
        metalness: 0.62,
        roughness: 0.07,
        clearcoat: 1,
        iridescence: 0.6,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [240, 540],
        envMapIntensity: 0.75,
      });
    }
    function cardTexture(n: number) {
      const c = document.createElement("canvas");
      c.width = 768;
      c.height = 1152;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = n === 0 ? "#131519" : n === 1 ? "#f0eee8" : "#9da9b3";
      ctx.fillRect(0, 0, 768, 1152);
      let seed = 1234;
      const rnd = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let j = 0; j < 24000; j++) {
        const x = rnd() * 768,
          y = rnd() * 1152;
        ctx.fillStyle =
          n === 1
            ? `rgba(72,54,40,${rnd() * 0.08})`
            : `rgba(255,255,255,${rnd() * 0.08})`;
        ctx.fillRect(x, y, n === 2 ? 60 : 1, n === 1 ? 2 : 1);
      }
      if (n === 0) {
        for (let j = 0; j < 18; j++) {
          ctx.strokeStyle = `rgba(90,110,132,${0.03 + j * 0.003})`;
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.ellipse(384, 560, 160 + j * 6, 260 + j * 8, 0.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = n === 0 ? "#46505f" : n === 1 ? "#c6c1b7" : "#dde4eb";
      ctx.lineWidth = 2;
      ctx.strokeRect(54, 54, 660, 1044);
      ctx.fillStyle = n === 0 ? "#e6eaf0" : "#26313c";
      ctx.font = "500 64px Arial";
      ctx.fillText(["Ink", "Paper", "Metal"][n], 76, 154);
      ctx.font = "20px Arial";
      ctx.fillText(
        ["DEPTH / CONTRAST", "WARMTH / TEXTURE", "LIGHT / REFLECTION"][
          n
        ].replace(" / ", "  ·  "),
        76,
        1010,
      );
      const tex = new T.CanvasTexture(c);
      tex.colorSpace = T.SRGBColorSpace;
      textures.push(tex);
      return tex;
    }
    function bevelLines(g: T.Group, geometry: T.BufferGeometry) {
      const edge = new T.EdgesGeometry(geometry, 25);
      const a = edge.getAttribute("position");
      const mat = new T.MeshPhysicalMaterial({
        color: "#e5f6ff",
        metalness: 0.5,
        roughness: 0.04,
        clearcoat: 1,
        envMapIntensity: 1.7,
      });
      for (let k = 0; k < a.count; k += 2) {
        const v1 = new T.Vector3().fromBufferAttribute(a, k),
          v2 = new T.Vector3().fromBufferAttribute(a, k + 1),
          dir = v2.clone().sub(v1);
        const rod = new T.Mesh(
          new T.CylinderGeometry(0.024, 0.024, dir.length(), 10),
          mat,
        );
        rod.position.copy(v1.add(v2).multiplyScalar(0.5));
        rod.quaternion.setFromUnitVectors(
          new T.Vector3(0, 1, 0),
          dir.normalize(),
        );
        g.add(rod);
      }
      edge.dispose();
    }
    function study(n: number) {
      const g = new T.Group();
      let geometry: T.BufferGeometry;
      let material: T.Material;
      if (n % 12 === 0) {
        geometry = new RoundedBoxGeometry(3.25, 3.25, 3.25, 6, 0.14);
        material = foil();
        const shell = new T.Mesh(
          new RoundedBoxGeometry(3.53, 3.53, 3.53, 8, 0.18),
          new T.MeshPhysicalMaterial({
            color: "#ffffff",
            transmission: 1,
            thickness: 0.12,
            roughness: 0.025,
            ior: 1.5,
            clearcoat: 1,
            iridescence: 1,
            iridescenceIOR: 1.4,
            envMapIntensity: 1.8,
          }),
        );
        g.add(shell);
      } else if (n % 12 === 1) {
        geometry = new T.ConeGeometry(2.65, 3.7, 3);
        material = new T.MeshPhysicalMaterial({
          color: "#d9efff",
          metalness: 0,
          roughness: 0.025,
          transmission: 0.97,
          thickness: 0.22,
          ior: 1.5,
          clearcoat: 1,
          envMapIntensity: 1.1,
          side: T.DoubleSide,
        });
        bevelLines(g, geometry);
        const inside = new T.Mesh(
          geometry.clone(),
          new T.MeshPhysicalMaterial({
            color: "#b8d0e4",
            metalness: 0.3,
            roughness: 0.04,
            transmission: 0.75,
            thickness: 0.1,
            ior: 1.4,
            envMapIntensity: 0.6,
            side: T.DoubleSide,
          }),
        );
        inside.scale.setScalar(0.84);
        g.add(inside);
      } else if (n % 12 === 2) {
        geometry = new T.SphereGeometry(2, 80, 64);
        material = rainbow();
      } else if (n % 12 === 3) {
        geometry = new T.TorusKnotGeometry(1.25, 0.35, 160, 24, 2, 3);
        material = chrome("#f6a149");
      } else if (n % 12 === 4) {
        geometry = new T.TorusGeometry(1.6, 0.5, 32, 96);
        material = chrome("#b4a9ff");
      } else if (n % 12 === 5) {
        geometry = new T.IcosahedronGeometry(2, 0);
        material = chrome("#87d9c9");
      } else if (n % 12 === 6) {
        geometry = new T.OctahedronGeometry(2.2, 0);
        material = rainbow();
      } else if (n % 12 === 7) {
        geometry = new T.TorusKnotGeometry(1.1, 0.22, 180, 20, 3, 5);
        material = chrome("#fa688a");
      } else if (n % 12 === 8) {
        geometry = new T.CylinderGeometry(1.6, 1.6, 2.5, 64);
        material = rainbow();
      } else if (n % 12 === 9) {
        geometry = new T.DodecahedronGeometry(2, 0);
        material = chrome("#f8dc9d");
      } else if (n % 12 === 10) {
        geometry = new T.SphereGeometry(2, 12, 8);
        material = chrome("#408fff");
      } else {
        geometry = new T.TorusGeometry(1.7, 0.18, 20, 128, Math.PI * 1.7);
        material = chrome("#fff");
      }
      const mesh = new T.Mesh(geometry, material);
      g.add(mesh);
      if (n % 12 === 0 || n % 12 === 1) {
        const edges = new T.LineSegments(
          new T.EdgesGeometry(geometry),
          new T.LineBasicMaterial({
            color: "#b8edff",
            transparent: true,
            opacity: 0.5,
          }),
        );
        g.add(edges);
      }
      if (n % 12 === 2) {
        const orb = new T.Mesh(new T.SphereGeometry(0.38, 32, 24), rainbow());
        orb.position.set(2.8, 0.3, 0);
        g.add(orb);
      }
      return g;
    }
    if (kind === "materials") {
      for (let i = 0; i < 3; i++) {
        const mat = new T.MeshPhysicalMaterial({
          map: cardTexture(i),
          roughness: i === 1 ? 0.85 : i === 0 ? 0.22 : 0.24,
          metalness: i === 1 ? 0 : 1,
          clearcoat: i === 1 ? 0 : 1,
          anisotropy: i === 2 ? 0.8 : 0,
          envMapIntensity: i === 0 ? 2.5 : 1.4,
        });
        const m = new T.Mesh(
          new RoundedBoxGeometry(3.35, 5.2, i === 1 ? 0.025 : 0.065, 8, 0.18),
          mat,
        );
        root.add(m);
        items.push(m);
      }
    } else if (kind === "404") {
      for (let i = 0; i < 5; i++) {
        const g = study([7, 3, 10, 4, 2][i]);
        root.add(g);
        items.push(g);
      }
    } else {
      const g = study(variant);
      root.add(g);
      items.push(g);
    }
    const render = (time: number) => {
      if (kind === "materials") {
        const smooth = (v: number) => {
          const p = Math.max(0, Math.min(1, v));
          return p * p * (3 - 2 * p);
        };
        const close = smooth((time - 0.22) / 0.7),
          open = smooth((time - 1.65) / 1.0);
        const spread = 1 - close + open;
        const turn = smooth((time - 0.65) / 1.3) * Math.PI * 2;
        items.forEach((o, i) => {
          o.position.set(
            (i - 1) * 3.85 * spread,
            (i - 1) * 0.1 * spread,
            (i - 1) * 0.22 * (1 - spread),
          );
          o.rotation.set(
            -0.12,
            turn + (i - 1) * 0.24 * spread,
            (i - 1) * 0.065 * spread,
          );
        });
        camera.position.z = 18;
      } else if (kind === "404") {
        items.forEach((o, i) => {
          const a = i * 1.256 + time * 0.11;
          o.position.set(Math.cos(a) * 4, Math.sin(a) * 2.4 + 0.2, -1);
          o.scale.setScalar(i === 0 ? 0.65 : 0.42);
          o.rotation.set(time * 0.22 + i, time * 0.3 + i, 0.3);
        });
      } else {
        root.rotation.set(
          0.12 + Math.sin(time * 0.4) * 0.08,
          time * 0.34 + variant * 0.43,
          0.015,
        );
        root.position.y = Math.sin(time * 0.7) * 0.08;
      }
      renderer.render(scene, camera);
    };
    state.current = {
      render,
      dispose: () => {
        scene.traverse((o) => {
          if (o instanceof T.Mesh) {
            o.geometry.dispose();
            const ms = Array.isArray(o.material) ? o.material : [o.material];
            ms.forEach((m) => m.dispose());
          }
        });
        textures.forEach((tex) => tex.dispose());
        env.dispose();
        pm.dispose();
        renderer.dispose();
      },
    };
    render(t);
    return () => {
      state.current?.dispose();
      state.current = null;
    };
    // Rebuild geometry only when the artwork changes. Time is rendered below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, variant]);
  useLayoutEffect(() => {
    state.current?.render(t);
  }, [t]);
  return (
    <canvas
      ref={canvas}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};
