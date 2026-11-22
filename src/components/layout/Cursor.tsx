"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

type Variant = "default" | "link" | "play" | "view" | "hidden";

/**
 * Gold dot + lagging ring. The ring grows and shows a label over elements with
 * data-cursor="play" | "view". Disabled on touch / coarse pointers.
 */
export function Cursor() {
  const fine = useFinePointer();
  const [variant, setVariant] = useState<Variant>("hidden");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 24, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const tagged = target?.closest?.("[data-cursor]") as HTMLElement | null;
      if (tagged) {
        setVariant((tagged.dataset.cursor as Variant) ?? "default");
      } else if (target?.closest?.("a, button, [role='button'], label, select, input[type='range']")) {
        setVariant("link");
      } else {
        setVariant("default");
      }
    };
    const onLeave = () => setVariant("hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  const label = variant === "play" ? "Play" : variant === "view" ? "View" : "";
  const big = variant === "play" || variant === "view";
  const size = big ? 92 : variant === "link" ? 54 : 34;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light"
        style={{ x, y }}
        animate={{ opacity: variant === "hidden" || big ? 0 : 1, scale: variant === "link" ? 0.5 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-gold/60"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: variant === "hidden" ? 0 : 1,
          backgroundColor: big ? "rgba(11,36,25,0.55)" : "rgba(201,162,75,0)",
          borderColor: big ? "rgba(232,207,138,0.9)" : "rgba(201,162,75,0.6)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="font-display text-[0.65rem] uppercase tracking-[0.3em] text-gold-light backdrop-blur-[2px]"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
