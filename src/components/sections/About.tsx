"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { GoldGlow } from "@/components/brand/GoldGlow";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/SplitReveal";
import { site } from "@/content/site";

export function About() {
  const { about } = site;
  const frame = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-24 overflow-hidden py-28 md:py-40">
      <GoldGlow className="-left-[20%] top-[20%] h-[60vw] w-[60vw]" />
      <div className="container-luxe grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <div ref={frame} className="relative mx-auto max-w-md lg:sticky lg:top-28 lg:max-w-none">
            {/* offset gold frame */}
            <motion.div aria-hidden style={{ y: frameY }} className="absolute -bottom-5 -right-5 left-5 top-5 border border-gold/60 md:-bottom-6 md:-right-6 md:left-6 md:top-6" />
            <ImageReveal className="relative aspect-[4/5] border border-gold/30 bg-surface">
              <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
                {/* TODO: replace /public/media/portrait.jpg with your portrait */}
                <Image src={about.portrait} alt={about.portraitAlt} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </ImageReveal>
            <p className="mt-10 flex items-center gap-3 font-display text-[0.65rem] uppercase tracking-[0.3em] text-champagne/75">
              <span className="h-px w-8 bg-gold" /> {site.name} — Founder, {site.studio}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SectionHeading index="05" eyebrow="About" title={about.heading} id="about-title" titleClassName="text-[clamp(2.2rem,5vw,5rem)]" />
          <Reveal className="mt-10 space-y-6">
            <p className="font-serif text-[clamp(1.35rem,2vw,1.85rem)] italic leading-snug text-champagne">{about.bio[0]}</p>
            {about.bio.slice(1).map((p) => (
              <p key={p.slice(0, 24)} className="max-w-2xl text-secondary">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.1} className="mt-14">
            <p className="eyebrow mb-6">Tools &amp; craft</p>
            <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
              {about.tools.map((g) => (
                <div key={g.group} className="bg-ink p-6">
                  <p className="font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold">{g.group}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li key={t} className="rounded-full border border-line px-3 py-1.5 text-xs text-champagne/85">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-4">
            <ButtonLink href={about.pressKit} variant="outline" download>
              Download Press Kit
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />
              </svg>
            </ButtonLink>
            <ButtonLink href="/#contact" variant="ghost" magnetic={false}>
              Start a conversation <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
