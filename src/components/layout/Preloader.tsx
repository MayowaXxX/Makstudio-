"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MakLogo } from "@/components/brand/MakLogo";
import { useAppState } from "@/lib/app-state";

const STORAGE_KEY = "mak-visited";
export const PRELOADER_SCRIPT = `try{var d=document.documentElement;if(localStorage.getItem('${STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-preloaded','')}}catch(e){}`;

/**
 * Logo draws on in gold, a 0–100 counter runs, then a curtain wipes up.
 * ~2.4s total incl. curtain. Skipped on repeat visits and for reduced motion (see the inline
 * script in layout.tsx which sets html[data-preloaded] before first paint).
 */
// Captured once on the client: was the preloader already skipped before hydration?
let initialPreloaded: boolean | null = null;
const getPreloaded = () => (initialPreloaded ??= document.documentElement.hasAttribute("data-preloaded"));
const noopSubscribe = () => () => {};

export function Preloader() {
  const { setReady } = useAppState();
  const lenis = useLenis();
  const [visible, setVisible] = useState(true);
  const skip = useSyncExternalStore(noopSubscribe, getPreloaded, () => null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getPreloaded()) {
      setReady();
      return;
    }
    const controls = animate(0, 100, {
      duration: 1.4,
      delay: 0.1,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
      },
    });
    // Hero starts revealing just before the curtain lifts, so the two motions overlap.
    const tReady = window.setTimeout(setReady, 1450);
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setVisible(false);
      document.documentElement.setAttribute("data-preloaded", "");
    }, 1600);
    return () => {
      controls.stop();
      window.clearTimeout(tReady);
      window.clearTimeout(t);
    };
  }, [setReady]);

  // Hold Lenis while the preloader covers the page.
  useEffect(() => {
    if (!lenis) return;
    if (visible && skip === false) lenis.stop();
    else lenis.start();
  }, [lenis, visible, skip]);

  if (skip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          role="status"
          aria-label="Loading MAK Studio"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full gold-glow blur-2xl" />
          <MakLogo mode="draw" duration={0.8} strokeWidth={4} className="relative w-[min(56vw,300px)]" />
          <div className="absolute inset-x-0 bottom-0 container-luxe pb-8 md:pb-12">
            <div className="flex items-end justify-between">
              <span className="eyebrow">MAK Studio</span>
              <span ref={counterRef} className="display text-gold-gradient text-6xl md:text-8xl tabular-nums">
                000
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-line">
              <div ref={barRef} className="h-px w-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          {/* Curtain bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gold/40" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
