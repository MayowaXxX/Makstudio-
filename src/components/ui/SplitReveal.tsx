"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ElementType } from "react";
import { cn, parseAccent, stripAccent } from "@/lib/utils";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Extra classes for *accent* words (default: serif italic). */
  accentClassName?: string;
  /** Classes applied to every word (e.g. the gold gradient). */
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** If provided, the reveal waits for this to be true instead of scrolling into view. */
  play?: boolean;
  /** Treat as decorative duplicate (aria-hidden). */
  once?: boolean;
  id?: string;
};

/**
 * Splits text into words that slide up from a mask. Screen readers get the
 * full sentence once (via sr-only), the animated words are aria-hidden.
 */
export function SplitReveal({
  text,
  as: Tag = "p",
  className,
  accentClassName = "accent",
  wordClassName,
  delay = 0,
  stagger = 0.06,
  play,
  once = true,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -12% 0px" });
  const show = play ?? inView;
  const segments = parseAccent(text);

  let i = 0;
  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{stripAccent(text)}</span>
      <span aria-hidden>
        {segments.map((seg, s) =>
          seg.text
            .split(/(\s+)/)
            .filter((w) => w.length)
            .map((word, w) => {
              if (/^\s+$/.test(word)) return <span key={`${s}-${w}`}> </span>;
              const idx = i++;
              return (
                <span key={`${s}-${w}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <motion.span
                    className={cn("inline-block will-change-transform", wordClassName, seg.accent && accentClassName)}
                    initial={{ y: "110%", rotate: 4 }}
                    animate={show ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 4 }}
                    transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: delay + idx * stagger }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            }),
        )}
      </span>
    </Tag>
  );
}

/** Fades/slides a block up when it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "p";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </M>
  );
}
