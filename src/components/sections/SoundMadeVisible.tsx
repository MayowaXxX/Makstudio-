"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { GoldGlow } from "@/components/brand/GoldGlow";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/SplitReveal";
import { AudioAnalyser } from "@/components/visualizer/audio";
import type { ModeId, Visualizer } from "@/components/visualizer/scene";
import { site } from "@/content/site";
import { useReducedMotionPref } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export function SoundMadeVisible() {
  const v = site.visualizer;
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AudioAnalyser | null>(null);
  const vizRef = useRef<Visualizer | null>(null);
  const objectUrl = useRef<string | null>(null);
  const clock = useRef<number | null>(null);
  const reduced = useReducedMotionPref();

  const [near, setNear] = useState(false); // within lazy-load distance
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [mode, setMode] = useState<ModeId>("aurum");
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [track, setTrack] = useState({ title: v.sampleTrack.title, artist: v.sampleTrack.artist, src: v.sampleTrack.src });
  const [time, setTime] = useState({ cur: 0, dur: 0 });

  // Lazy-load + visibility
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const lazy = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    const vis = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    lazy.observe(el);
    vis.observe(el);
    return () => {
      lazy.disconnect();
      vis.disconnect();
    };
  }, []);

  // Build the scene once near the viewport (three.js is code-split here)
  useEffect(() => {
    if (!near || vizRef.current || !canvasRef.current) return;
    let cancelled = false;
    setStatus("loading");
    import("@/components/visualizer/scene")
      .then(({ createVisualizer }) => {
        if (cancelled || !canvasRef.current) return;
        const lowPower = window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;
        vizRef.current = createVisualizer(canvasRef.current, { lowPower });
        setStatus("ready");
      })
      .catch((err) => {
        console.error("Visualizer failed to start", err);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [near]);

  useEffect(() => {
    if (audioRef.current && !analyserRef.current) analyserRef.current = new AudioAnalyser(audioRef.current);
    return () => {
      vizRef.current?.dispose();
      vizRef.current = null;
      analyserRef.current?.dispose();
      analyserRef.current = null;
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  useEffect(() => vizRef.current?.setMode(mode), [mode, status]);

  // Render loop — only while visible. Reduced motion: still frame until the user presses play.
  useEffect(() => {
    if (status !== "ready" || !inView) return;
    const viz = vizRef.current;
    const analyser = analyserRef.current;
    if (!viz || !analyser) return;
    let raf = 0;
    let last = performance.now();
    clock.current ??= last;
    const t0 = clock.current;
    const animateLoop = !reduced || playing;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      viz.render(analyser.sample(t), t, animateLoop ? dt : 1);
      if (animateLoop && !document.hidden) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => {
      viz.resize();
      if (!animateLoop) requestAnimationFrame(tick);
    });
    if (panelRef.current) ro.observe(panelRef.current);
    const onVis = () => {
      if (!document.hidden && animateLoop) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [status, inView, reduced, playing, mode]);

  // Pause audio when the section scrolls far away
  useEffect(() => {
    if (!inView && playing) audioRef.current?.pause();
  }, [inView, playing]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    const analyser = analyserRef.current;
    if (!audio || !analyser) return;
    if (audio.paused) {
      try {
        await analyser.ensureContext();
        await audio.play();
        setStarted(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      audio.pause();
    }
  }, []);

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const audio = audioRef.current;
    if (!file || !audio) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setTrack({ title: file.name.replace(/\.[^.]+$/, ""), artist: "Your upload", src: url });
    audio.src = url;
    await analyserRef.current?.ensureContext();
    await audio.play().catch(() => {});
    setStarted(true);
    e.target.value = "";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    vizRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
  };

  return (
    <section id="visualizers" aria-labelledby="viz-title" className="relative scroll-mt-24 overflow-hidden border-t border-line bg-ink-deep py-28 md:py-40">
      <GoldGlow className="right-[-20%] top-[10%] h-[70vw] w-[70vw]" />
      <div className="container-luxe grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Visualizer */}
        <div className="lg:col-span-7">
          <div
            ref={panelRef}
            onPointerMove={onPointerMove}
            className="relative aspect-[4/5] w-full overflow-hidden border border-line bg-[radial-gradient(ellipse_at_center,#0f2e21,#071a12_70%)] sm:aspect-[4/3]"
          >
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
            <Corners />

            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3">
              <span className={cn("h-1.5 w-1.5 rounded-full", playing ? "animate-pulse-gold bg-gold" : "bg-gold/40")} />
              <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold-light">
                {playing ? "Live · Web Audio" : "Idle · Press play"}
              </span>
            </div>
            <span className="pointer-events-none absolute right-5 top-5 font-display text-[0.6rem] uppercase tracking-[0.3em] text-gold/80">
              {v.modes.find((m) => m.id === mode)?.label}
            </span>

            {status === "loading" && (
              <p className="absolute inset-0 flex items-center justify-center font-display text-xs uppercase tracking-[0.3em] text-gold/70">
                Loading visualizer…
              </p>
            )}
            {status === "error" && (
              <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-secondary">
                Your browser couldn&apos;t start WebGL, but the track still plays below.
              </p>
            )}

            {/* Big play prompt before first play */}
            <AnimatePresence>
              {!started && (
                <motion.button
                  type="button"
                  onClick={toggle}
                  data-cursor="play"
                  className="group absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ink/40 backdrop-blur-sm md:h-32 md:w-32"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  aria-label={`Play ${track.title}`}
                >
                  <span className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-duration:2.4s]" />
                  <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-gold-light transition-transform duration-500 group-hover:scale-110" fill="currentColor" aria-hidden>
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Transport */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 border-t border-line bg-ink/55 px-4 py-3 backdrop-blur-md md:px-5">
              <button
                type="button"
                onClick={toggle}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-ink transition-transform hover:scale-105"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm text-champagne">
                    {track.title} <span className="text-champagne/60">— {track.artist}</span>
                  </p>
                  <p className="shrink-0 font-display text-[0.65rem] tabular-nums tracking-[0.15em] text-gold/80">
                    {fmt(time.cur)} / {fmt(time.dur)}
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={time.dur || 0}
                  step={0.1}
                  value={time.cur}
                  onChange={(e) => {
                    if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
                  }}
                  aria-label="Seek"
                  className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-gold/20 accent-[#C9A24B]"
                  style={{
                    background: `linear-gradient(90deg,#C9A24B ${time.dur ? (time.cur / time.dur) * 100 : 0}%,rgba(201,162,75,0.2) 0)`,
                  }}
                />
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gold/40 px-3 py-2 font-display text-[0.6rem] uppercase tracking-[0.2em] text-gold-light transition-colors hover:bg-gold hover:text-ink focus-within:outline focus-within:outline-1 focus-within:outline-gold-light md:px-4">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
                </svg>
                <span className="hidden sm:inline">Upload</span>
                <span className="sr-only sm:hidden">Upload your own audio</span>
                <input type="file" accept="audio/*" className="sr-only" onChange={onUpload} />
              </label>
            </div>

            <audio
              ref={audioRef}
              src={track.src}
              preload="none"
              loop
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                setTime((t) => ({ ...t, dur }));
              }}
              onTimeUpdate={(e) => setTime({ cur: e.currentTarget.currentTime, dur: e.currentTarget.duration })}
            />
          </div>

          {/* Mode switcher */}
          <div role="group" aria-label="Visual mode" className="mt-4 grid grid-cols-3 gap-2">
            {v.modes.map((m, i) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "group relative overflow-hidden border px-3 py-4 text-left transition-colors duration-500 md:px-5",
                    active ? "border-gold/70 bg-surface" : "border-line hover:border-gold/40",
                  )}
                >
                  {active && <motion.span layoutId="viz-mode" className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />}
                  <span className="block font-display text-[0.65rem] tracking-[0.2em] text-gold">0{i + 1}</span>
                  <span className={cn("mt-1 block font-display text-xs uppercase tracking-[0.18em] md:text-sm", active ? "text-gold-light" : "text-champagne/80")}>
                    {m.label}
                  </span>
                  <span className="mt-1 hidden text-xs text-champagne/60 md:block">{m.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pitch */}
        <div className="flex flex-col justify-center lg:col-span-5">
          <SectionHeading index="02" eyebrow={v.eyebrow} title={v.heading} id="viz-title" titleClassName="text-[clamp(2.4rem,5vw,5rem)]" />
          <Reveal className="mt-8 space-y-5 text-secondary">
            {v.pitch.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 border-t border-line">
              {v.offerings.map((o) => (
                <li key={o} className="flex items-center gap-4 border-b border-line py-4 text-champagne/90">
                  <span className="text-gold">✦</span>
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ButtonLink href="/#contact" variant="solid">
              {v.cta} <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Corners() {
  const c = "pointer-events-none absolute h-5 w-5 border-gold/70";
  return (
    <>
      <span aria-hidden className={cn(c, "left-2 top-2 border-l border-t")} />
      <span aria-hidden className={cn(c, "right-2 top-2 border-r border-t")} />
      <span aria-hidden className={cn(c, "bottom-2 left-2 border-b border-l")} />
      <span aria-hidden className={cn(c, "bottom-2 right-2 border-b border-r")} />
    </>
  );
}
