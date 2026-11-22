"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useReducedMotionPref } from "@/lib/hooks";
import { pad2 } from "@/lib/utils";

const INTERVAL = 7000;

export function Testimonials() {
  const items = site.testimonials;
  const [i, setI] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const reduced = useReducedMotionPref();
  const running = inView && !hovered && !userPaused && !reduced;

  const go = useCallback((d: number) => setI((n) => (n + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => go(1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [running, i, go]);

  const t = items[i];
  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className="relative overflow-hidden border-y border-line bg-ink-deep py-28 md:py-40 cv-auto"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full gold-glow blur-2xl" />
      <div className="container-luxe relative">
        <div className="mb-12 flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.2em] text-gold/80">(06)</span>
          <span className="eyebrow">Kind words</span>
          <span className="hairline flex-1" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <span aria-hidden className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 font-serif text-[10rem] leading-none text-gold/20 md:-top-24 md:text-[14rem]">
            “
          </span>
          <div className="relative min-h-[18rem] md:min-h-[16rem]" aria-live={running ? "off" : "polite"}>
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${items.length}`}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-serif text-[clamp(1.5rem,3.2vw,2.9rem)] italic leading-[1.25] text-champagne">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10">
                  <span className="block font-display text-sm uppercase tracking-[0.3em] text-gold-light">{t.name}</span>
                  <span className="mt-2 block text-sm text-secondary">
                    {t.role}, {t.company}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto mt-14 flex max-w-5xl items-center gap-6">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="flex flex-1 items-center gap-2">
            {items.map((item, n) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Show testimonial ${n + 1}: ${item.name}`}
                aria-current={n === i}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-[11.5px] h-px bg-gold/20 transition-colors group-hover:bg-gold/40" />
                <span
                  key={`${i}-${running}`}
                  className="absolute left-0 top-[11.5px] h-px w-full origin-left bg-gold"
                  style={
                    n === i && running
                      ? { animation: `progress ${INTERVAL}ms linear forwards` }
                      : { transform: `scaleX(${n <= i ? 1 : 0})` }
                  }
                />
              </button>
            ))}
          </div>
          <span className="font-display text-xs tabular-nums tracking-[0.2em] text-gold/80">
            {pad2(i + 1)} / {pad2(items.length)}
          </span>
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Resume auto-play" : "Pause auto-play"}
            className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink sm:flex"
          >
            {userPaused ? (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            )}
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold-light transition-colors hover:bg-gold hover:text-ink">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
