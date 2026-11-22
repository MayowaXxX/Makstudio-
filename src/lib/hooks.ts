"use client";

import { useMemo, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** SSR-safe media query. Returns `serverValue` during SSR/hydration. */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** True on devices with a precise hovering pointer (mouse/trackpad). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

export const useReducedMotionPref = () => useMediaQuery("(prefers-reduced-motion: reduce)");

/** True once mounted on the client. */
const noopSubscribe = () => () => {};
export function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
