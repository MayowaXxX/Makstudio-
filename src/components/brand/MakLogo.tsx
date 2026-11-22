"use client";

import { motion, type Transition } from "framer-motion";
import { useId } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "./logo-paths";

/** The MAK wordmark drawn as gold strokes so it can animate on (pathLength normalized to 1). */

type Props = {
  className?: string;
  /** "draw" animates the strokes on; "static" renders them fully drawn. */
  mode?: "draw" | "static";
  /** When false (with mode="draw"), strokes stay hidden until it flips true. */
  play?: boolean;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  title?: string;
  onDrawn?: () => void;
};

export function MakLogo({
  className,
  mode = "static",
  play = true,
  delay = 0,
  duration = 1.1,
  strokeWidth = 3,
  title = "MAK",
  onDrawn,
}: Props) {
  const id = useId().replace(/:/g, "");
  const gradId = `mak-gold-${id}`;
  const animate = mode === "draw";

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} role="img" aria-label={title} fill="none">
      <title>{title}</title>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="310" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E8CF8A" />
          <stop offset="0.5" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#9C7A32" />
        </linearGradient>
      </defs>
      {LOGO_PATHS.map((d, i) => {
        const transition: Transition = {
          pathLength: { delay: delay + i * 0.16, duration, ease: [0.65, 0, 0.35, 1] },
          opacity: { delay: delay + i * 0.16, duration: 0.01 },
        };
        return animate ? (
          <motion.path
            key={d}
            d={d}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={transition}
            onAnimationComplete={i === LOGO_PATHS.length - 1 ? onDrawn : undefined}
          />
        ) : (
          <path
            key={d}
            d={d}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        );
      })}
    </svg>
  );
}
