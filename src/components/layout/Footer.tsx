"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { MakLogo } from "@/components/brand/MakLogo";
import { site } from "@/content/site";
import { NavLink } from "./NavLink";
import { useScrollTo } from "./SmoothScroll";

const noop = () => () => {};

export function Footer() {
  const scrollTo = useScrollTo();
  // Server snapshot uses launchYear (prerendered); the client shows the live year.
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => site.launchYear);
  const [drawn, setDrawn] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-deep pt-20 md:pt-28 cv-auto">
      <div className="pointer-events-none absolute left-1/2 top-full h-[70vw] w-[110vw] -translate-x-1/2 -translate-y-1/2 rounded-full gold-glow" />
      <div className="container-luxe relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow mb-5">Start a project</p>
            <a
              href={`mailto:${site.email}`}
              className="group inline-block font-serif text-[clamp(1.6rem,3vw,2.6rem)] italic text-gold-light transition-colors hover:text-gold"
            >
              {site.email}
              <span className="block h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
            </a>
            <p className="mt-4 text-sm text-secondary">{site.availability}</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-5">Index</p>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} className="text-champagne/80 transition-colors hover:text-gold-light">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Follow</p>
            <ul className="space-y-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener" className="text-champagne/80 transition-colors hover:text-gold-light">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex md:col-span-1 md:justify-end">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold-light transition-colors duration-500 hover:bg-gold hover:text-ink"
              aria-label="Back to top"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>

        <motion.div
          className="mt-20 md:mt-28"
          onViewportEnter={() => setDrawn(true)}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        >
          <MakLogo mode="draw" play={drawn} duration={1.4} strokeWidth={1.2} className="w-full" title="MAK Studio" />
        </motion.div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line py-8 text-xs text-champagne/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.studio}. All rights reserved.
          </p>
          <p className="font-display uppercase tracking-[0.25em]">{site.roles.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
