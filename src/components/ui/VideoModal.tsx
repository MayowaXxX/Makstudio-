"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "@/lib/focus-trap";
import { useMounted } from "@/lib/hooks";

/** Full-screen accessible video lightbox. */
export function VideoModal({
  open,
  onClose,
  src,
  poster,
  title,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenis = useLenis();
  const mounted = useMounted();
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(ref, open, close);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const v = videoRef.current;
    v?.play().catch(() => {});
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      v?.pause();
    };
  }, [open, lenis]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-deep/95 p-4 backdrop-blur-md md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          data-lenis-prevent
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-light transition-colors hover:bg-gold hover:text-ink md:right-8 md:top-8"
            aria-label="Close video"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
          <motion.div
            className="relative aspect-video w-full max-w-6xl overflow-hidden border border-line bg-black shadow-[0_0_120px_rgba(201,162,75,0.15)]"
            initial={{ scale: 0.92, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              aria-label={title}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
