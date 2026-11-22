import { cn } from "@/lib/utils";

/** Soft radial gold glow placed behind key sections. */
export function GoldGlow({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute -z-10 rounded-full gold-glow blur-2xl", className)} />;
}
