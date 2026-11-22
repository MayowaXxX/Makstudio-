"use client";

import { motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

let firstLoad = true;

/**
 * Route transition: a gold-edged green curtain lifts off each new page while
 * the content eases in. Skipped on the very first load (the preloader owns it).
 */
export default function Template({ children }: { children: ReactNode }) {
  const [animateIn] = useState(() => typeof window !== "undefined" && !firstLoad);
  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <>
      {animateIn && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[85] border-b border-gold/50 bg-ink-deep"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
        />
      )}
      <motion.div
        initial={animateIn ? { opacity: 0, y: 40 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: animateIn ? 0.25 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
