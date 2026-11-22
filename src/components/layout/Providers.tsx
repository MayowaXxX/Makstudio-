"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { AppStateProvider } from "@/lib/app-state";
import { Cursor } from "./Cursor";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStateProvider>
      {/* reducedMotion="user" turns transform/layout animations into instant changes for reduced-motion users */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          {children}
          <Cursor />
        </SmoothScroll>
      </MotionConfig>
    </AppStateProvider>
  );
}
