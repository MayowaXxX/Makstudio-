"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type AppState = {
  /** True once the preloader has finished (or was skipped). Intro animations wait for this. */
  ready: boolean;
  setReady: () => void;
};

const Ctx = createContext<AppState>({ ready: true, setReady: () => {} });

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [ready, setReadyState] = useState(false);
  const setReady = useCallback(() => setReadyState(true), []);
  const value = useMemo(() => ({ ready, setReady }), [ready, setReady]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAppState = () => useContext(Ctx);
