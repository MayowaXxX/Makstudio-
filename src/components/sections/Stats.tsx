"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { useReducedMotionPref } from "@/lib/hooks";

export function Stats() {
  return (
    <section aria-label="Studio in numbers" className="relative py-24 md:py-32 cv-auto">
      <div className="container-luxe">
        <dl className="grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
          {site.stats.map((s, i) => (
            <div key={s.label} className="flex flex-col-reverse gap-4 bg-ink px-4 py-10 md:px-8 md:py-14 lg:px-10">
              <dt className="font-display text-[0.68rem] uppercase tracking-[0.25em] text-champagne/75">{s.label}</dt>
              <dd className="display text-gold-gradient text-[clamp(3rem,7vw,6.5rem)] tabular-nums">
                <span className="sr-only">
                  {s.value}
                  {s.suffix}
                </span>
                <span aria-hidden>
                  <CountUp to={s.value} delay={i * 0.12} />
                  <span className="accent ml-1 text-[0.55em]">{s.suffix}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CountUp({ to, delay }: { to: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduced) {
      el.textContent = String(to);
      return;
    }
    const c = animate(0, to, {
      duration: 2.2,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => c.stop();
  }, [inView, to, delay, reduced]);

  return (
    <span ref={ref}>0</span>
  );
}
