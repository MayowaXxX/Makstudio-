"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";
import { useReducedMotionPref } from "@/lib/hooks";

const NAV_OFFSET = 0;

/** Lenis smooth scrolling (disabled for prefers-reduced-motion). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  if (reduced) {
    return (
      <>
        <RouteScroll />
        {children}
      </>
    );
  }
  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 1, stopInertiaOnNavigate: true }}>
      <RouteScroll />
      {children}
    </ReactLenis>
  );
}

/** Returns a scrollTo(target) that uses Lenis when active, native scrolling otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string | number | HTMLElement, opts?: { immediate?: boolean }) => {
      if (lenis) {
        lenis.scrollTo(target, { offset: NAV_OFFSET, immediate: opts?.immediate, duration: 1.6 });
        return;
      }
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: opts?.immediate ? "auto" : "smooth" });
        return;
      }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
    },
    [lenis],
  );
}

/** On route change: jump to the hash target if any, otherwise to the top. */
function RouteScroll() {
  const pathname = usePathname();
  const scrollTo = useScrollTo();
  useEffect(() => {
    const hash = window.location.hash;
    const id = window.setTimeout(() => {
      const el = hash ? document.querySelector(hash) : null;
      if (el) scrollTo(el as HTMLElement, { immediate: true });
      else scrollTo(0, { immediate: true });
    }, 60);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}
