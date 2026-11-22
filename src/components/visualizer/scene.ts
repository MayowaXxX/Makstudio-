import * as THREE from "three";
import { BANDS, HIST_ROWS, type AudioFrame } from "./audio";
import {
  aurumVert,
  bgFrag,
  bgVert,
  dustVert,
  haloVert,
  liquidFrag,
  liquidVert,
  pointFrag,
} from "./shaders";

export type ModeId = "aurum" | "liquid" | "halo";

export type Visualizer = {
  setMode: (mode: ModeId) => void;
  render: (frame: AudioFrame, time: number, dt: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  dispose: () => void;
};

/** Builds the Three.js scene. Throws if WebGL is unavailable. */
export function createVisualizer(canvas: HTMLCanvasElement, opts: { lowPower: boolean }): Visualizer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !opts.lowPower, alpha: false, powerPreference: "high-performance" });
  const dpr = Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x071a12, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 4.6);

  // Spectrum history texture (row 0 = newest)
  const histData = new Uint8Array(BANDS * HIST_ROWS);
  const hist = new THREE.DataTexture(histData, BANDS, HIST_ROWS, THREE.RedFormat, THREE.UnsignedByteType);
  hist.magFilter = THREE.LinearFilter;
  hist.minFilter = THREE.LinearFilter;
  hist.needsUpdate = true;

  const shared = {
    uTime: { value: 0 },
    uBass: { value: 0 },
    uMid: { value: 0 },
    uHigh: { value: 0 },
    uKick: { value: 0 },
    uPixelRatio: { value: dpr },
    uHist: { value: hist },
  };

  const pointMaterial = (vertexShader: string) =>
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: pointFrag,
      uniforms: { ...shared, uFade: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

  // ── Background quad
  const bgMat = new THREE.ShaderMaterial({
    vertexShader: bgVert,
    fragmentShader: bgFrag,
    uniforms: { uBass: shared.uBass, uAspect: { value: 1 } },
    depthWrite: false,
    depthTest: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
  bg.frustumCulled = false;
  bg.renderOrder = -1;
  scene.add(bg);

  // ── Mode 1: Aurum particles
  const aurumCount = opts.lowPower ? 14000 : 28000;
  const aurumGeo = new THREE.BufferGeometry();
  {
    const pos = new Float32Array(aurumCount * 3);
    const rnd = new Float32Array(aurumCount * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < aurumCount; i++) {
      const y = 1 - (i / (aurumCount - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const r = 0.95 + Math.pow(Math.random(), 3) * 0.75;
      pos[i * 3] = Math.cos(th) * rad * r;
      pos[i * 3 + 1] = y * r;
      pos[i * 3 + 2] = Math.sin(th) * rad * r;
      rnd[i * 3] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
    }
    aurumGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    aurumGeo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 3));
  }
  const aurumMat = pointMaterial(aurumVert);
  const aurum = new THREE.Points(aurumGeo, aurumMat);

  // ── Mode 2: Liquid metal
  const liquidGeo = new THREE.IcosahedronGeometry(1, opts.lowPower ? 22 : 40);
  const liquidMat = new THREE.ShaderMaterial({
    vertexShader: liquidVert,
    fragmentShader: liquidFrag,
    uniforms: { ...shared, uFade: { value: 0 } },
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);

  // ── Mode 3: Halo rings
  const perRing = opts.lowPower ? 160 : 256;
  const haloGeo = new THREE.BufferGeometry();
  {
    const n = perRing * HIST_ROWS;
    const pos = new Float32Array(n * 3);
    const ang = new Float32Array(n);
    const ring = new Float32Array(n);
    for (let r = 0; r < HIST_ROWS; r++) {
      for (let i = 0; i < perRing; i++) {
        const k = r * perRing + i;
        ang[k] = (i / perRing) * Math.PI * 2 + r * 0.013;
        ring[k] = (r + 0.5) / HIST_ROWS;
      }
    }
    haloGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    haloGeo.setAttribute("aAngle", new THREE.BufferAttribute(ang, 1));
    haloGeo.setAttribute("aRing", new THREE.BufferAttribute(ring, 1));
  }
  const haloMat = pointMaterial(haloVert);
  const halo = new THREE.Points(haloGeo, haloMat);
  halo.frustumCulled = false;
  halo.rotation.x = -0.55;

  // ── Ambient dust
  const dustCount = opts.lowPower ? 250 : 600;
  const dustGeo = new THREE.BufferGeometry();
  {
    const pos = new Float32Array(dustCount * 3);
    const rnd = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      rnd[i * 3] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    dustGeo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 3));
  }
  const dustMat = pointMaterial(dustVert);
  dustMat.uniforms.uFade.value = 1;
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  scene.add(dust);

  const group = new THREE.Group();
  scene.add(group);
  const modes: Record<ModeId, { obj: THREE.Object3D; mat: THREE.ShaderMaterial; fade: number }> = {
    aurum: { obj: aurum, mat: aurumMat, fade: 0 },
    liquid: { obj: liquid, mat: liquidMat, fade: 0 },
    halo: { obj: halo, mat: haloMat, fade: 0 },
  };
  // Halo gets its own tilted pivot so the group's slow spin never turns it edge-on
  const haloPivot = new THREE.Group();
  scene.add(haloPivot);
  Object.entries(modes).forEach(([id, m]) => {
    m.obj.visible = false;
    (id === "halo" ? haloPivot : group).add(m.obj);
  });
  let current: ModeId = "aurum";

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the form fully in frame on tall/narrow panels
    camera.position.z = w / h < 1 ? 4.6 / Math.max(0.62, w / h) : 4.6;
    camera.updateProjectionMatrix();
    bgMat.uniforms.uAspect.value = w / h;
  }
  resize();

  return {
    setMode(mode) {
      current = mode;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    resize,
    render(frame, time, dt) {
      hist.image.data!.set(frame.history);
      hist.needsUpdate = true;
      shared.uTime.value = time;
      shared.uBass.value = frame.bass;
      shared.uMid.value = frame.mid;
      shared.uHigh.value = frame.high;
      shared.uKick.value = frame.kick;

      // cross-fade between modes
      const k = Math.min(1, dt * 2.6);
      (Object.keys(modes) as ModeId[]).forEach((id) => {
        const m = modes[id];
        m.fade += ((id === current ? 1 : 0) - m.fade) * k;
        if (m.fade < 0.002) m.fade = 0;
        m.mat.uniforms.uFade.value = m.fade;
        m.obj.visible = m.fade > 0;
        if (id === "liquid") m.obj.scale.setScalar(0.55 + 0.45 * m.fade);
      });

      // pointer parallax + slow drift
      pointer.sx += (pointer.x - pointer.sx) * 0.05;
      pointer.sy += (pointer.y - pointer.sy) * 0.05;
      group.rotation.y = time * 0.06 + pointer.sx * 0.45;
      group.rotation.x = pointer.sy * 0.3;
      halo.rotation.z = -time * 0.05;
      haloPivot.rotation.y = pointer.sx * 0.35;
      haloPivot.rotation.x = pointer.sy * 0.25;
      dust.rotation.y = pointer.sx * 0.15;

      renderer.render(scene, camera);
    },
    dispose() {
      [aurumGeo, liquidGeo, haloGeo, dustGeo, bg.geometry].forEach((g) => g.dispose());
      [aurumMat, liquidMat, haloMat, dustMat, bgMat].forEach((m) => m.dispose());
      hist.dispose();
      renderer.dispose();
    },
  };
}
