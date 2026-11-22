"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MakLogo } from "@/components/brand/MakLogo";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { useAppState } from "@/lib/app-state";
import { useFocusTrap } from "@/lib/focus-trap";
import { cn, pad2 } from "@/lib/utils";
import { NavLink } from "./NavLink";

export function Navbar() {
  const { ready } = useAppState();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - last.current;
    last.current = y;
    setScrolled(y > 40);
    if (open) return;
    if (y < 120) setHidden(false);
    else if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
  });

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[95] rounded-full bg-gold px-5 py-3 font-display text-xs uppercase tracking-[0.2em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 border-b transition-all duration-700",
            scrolled && !open ? "border-line bg-ink/75 backdrop-blur-xl" : "border-transparent bg-transparent",
          )}
        />
        <nav className="container-luxe flex h-20 items-center justify-between md:h-24" aria-label="Primary">
          <NavLink href="/#top" className="relative z-[70] block py-2" aria-label="MAK Studio — home">
            <MakLogo className="h-6 w-auto md:h-7" strokeWidth={7} title="MAK Studio" />
          </NavLink>

          <ul className="hidden items-center gap-10 lg:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  className="group relative font-display text-[0.72rem] uppercase tracking-[0.28em] text-champagne/80 transition-colors hover:text-gold-light"
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-luxe group-hover:origin-left group-hover:scale-x-100" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <ButtonLink href="/#contact" variant="outline" className="!px-6 !py-3">
                Let&apos;s Create
              </ButtonLink>
            </div>
            <button
              type="button"
              className="relative z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-px w-full bg-gold-light transition-transform duration-500 ease-luxe",
                    open && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-gold-light transition-transform duration-500 ease-luxe",
                    open && "-translate-y-[5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(ref, open, close);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onResize = () => window.innerWidth >= 1024 && close();
    window.addEventListener("resize", onResize);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("resize", onResize);
    };
  }, [open, lenis, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[45] flex flex-col bg-ink-deep lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.15 } }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          data-lenis-prevent
        >
          <div className="pointer-events-none absolute -right-1/4 top-1/4 h-[80vw] w-[80vw] rounded-full gold-glow blur-2xl" />
          {/* Close button lives in the header (z-70) — keep a focusable target here too */}
          <div className="container-luxe flex flex-1 flex-col justify-center pt-24">
            <ul className="space-y-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%", transition: { duration: 0.35, delay: i * 0.03 } }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.07 }}
                  >
                    <NavLink
                      href={item.href}
                      onNavigate={onClose}
                      className="group flex items-baseline gap-4 py-1 font-display text-[clamp(2.5rem,11vw,4.5rem)] font-light uppercase leading-none tracking-[0.04em] text-gold-gradient"
                    >
                      <span className="font-display text-xs tracking-[0.2em] text-gold/70 [-webkit-text-fill-color:currentColor]">
                        {pad2(i + 1)}
                      </span>
                      {item.label}
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
          <motion.div
            className="container-luxe border-t border-line py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <a href={`mailto:${site.email}`} className="block font-serif text-2xl italic text-gold-light">
              {site.email}
            </a>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-display text-[0.7rem] uppercase tracking-[0.25em] text-champagne/75 hover:text-gold-light"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <button type="button" onClick={onClose} className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:text-gold">
            Close menu
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
