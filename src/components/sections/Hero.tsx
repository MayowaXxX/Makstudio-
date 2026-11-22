"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink, PlayIcon, ArrowIcon } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { VideoModal } from "@/components/ui/VideoModal";
import { site } from "@/content/site";
import { useAppState } from "@/lib/app-state";
import { useReducedMotionPref } from "@/lib/hooks";

export function Hero() {
  const { ready } = useAppState();
  const [reelOpen, setReelOpen] = useState(false);
  const { hero } = site;

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      <HeroVideo />

      {/* Overlays */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,36,25,0.82)_0%,rgba(11,36,25,0.45)_35%,rgba(11,36,25,0.6)_70%,#0B2419_100%)]" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,26,18,0.75)_100%)]" />

      <div className="container-luxe relative z-10 flex flex-1 flex-col justify-end pb-36 pt-36 md:pb-32">
        <motion.div
          className="mb-8 flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <span className="h-px w-10 bg-gold" />
          <p className="eyebrow">{hero.eyebrow}</p>
        </motion.div>

        <SplitReveal
          as="h1"
          text={hero.headline}
          play={ready}
          delay={0.15}
          stagger={0.06}
          className="display max-w-[14ch] text-[clamp(2.2rem,10.4vw,3.6rem)] leading-[0.95] md:text-[clamp(3rem,8vw,8.6rem)]"
          wordClassName="text-gold-gradient"
          accentClassName="accent lowercase text-gold-gradient"
        />

        <div className="mt-10 flex flex-col gap-10 md:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          >
            <RoleRotator roles={site.roles} active={ready} />
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
          >
            <ButtonLink href="/#work" variant="solid">
              View Work <ArrowIcon />
            </ButtonLink>
            <Button variant="outline" onClick={() => setReelOpen(true)} data-cursor="play" aria-haspopup="dialog">
              <PlayIcon /> Watch Reel
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom rail */}
      <motion.div
        className="container-luxe absolute inset-x-0 bottom-0 z-10 flex items-end justify-between pb-6"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 1.3 }}
      >
        <p className="hidden items-center gap-3 text-xs text-champagne/75 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
          {site.availability}
        </p>
        <div className="mx-auto flex flex-col items-center gap-3 sm:absolute sm:left-1/2 sm:-translate-x-1/2" aria-hidden>
          <span className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-gold/80">Scroll</span>
          <span className="relative block h-12 w-px overflow-hidden bg-gold/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-line bg-gold-light" />
          </span>
        </div>
        <p className="hidden font-display text-[0.65rem] uppercase tracking-[0.3em] text-champagne/75 sm:block">{site.location}</p>
      </motion.div>

      <VideoModal open={reelOpen} onClose={() => setReelOpen(false)} src={hero.reel.src} poster={hero.reel.poster} title={hero.reel.title} />
    </section>
  );
}

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotionPref();
  const { ready } = useAppState();
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Attach the video only once the intro has finished and the main thread is idle (protects LCP/TBT).
  useEffect(() => {
    if (!ready || reduced) return;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = ric(() => setLoad(true), { timeout: 2500 });
    return () => cancel(id);
  }, [ready, reduced]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !load) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [load]);

  return (
    <div aria-hidden className="absolute inset-0">
      <Image src={site.hero.poster} alt="" fill priority sizes="100vw" className="object-cover" />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
        style={{ opacity: playing ? 1 : 0 }}
        src={load ? site.hero.backgroundVideo : undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onPlaying={() => setPlaying(true)}
        tabIndex={-1}
      />
    </div>
  );
}

function RoleRotator({ roles, active }: { roles: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), reduced ? 4000 : 2600);
    return () => window.clearInterval(id);
  }, [active, roles.length, reduced]);

  return (
    <div className="flex items-center gap-5">
      <span className="font-display text-xs tracking-[0.2em] text-gold/80">{String(i + 1).padStart(2, "0")}</span>
      <span className="h-px w-8 bg-gold/50" />
      <p className="sr-only">{roles.join(", ")}</p>
      <div aria-hidden className="relative h-[1.3em] overflow-hidden font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] italic leading-[1.3] text-champagne">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={roles[i]}
            className="block whitespace-nowrap"
            initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
