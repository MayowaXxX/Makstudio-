"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/SplitReveal";
import { site } from "@/content/site";
import { pad2 } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Desktop (≥1024px, motion allowed): the section pins and the steps scroll
 * horizontally, scrubbed to the page scroll. Otherwise: a stacked list.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  // keep ScrollTrigger in sync with Lenis
  useLenis(() => ScrollTrigger.update());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        // subtle parallax on the big numerals
        gsap.utils.toArray<HTMLElement>("[data-step-num]").forEach((n) => {
          gsap.fromTo(n, { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: n, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
        });
      });
      // fonts/images can shift layout after load
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope: section },
  );

  return (
    <section ref={section} aria-labelledby="process-title" className="relative overflow-hidden border-y border-line bg-ink-deep py-28 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0 motion-reduce:lg:h-auto motion-reduce:lg:py-40">
      <div className="container-luxe lg:pt-24">
        <div className="flex items-end justify-between gap-10">
          <SectionHeading index="04" eyebrow="Process" title="From brief to *gold*" id="process-title" className="flex-1" titleClassName="text-[clamp(2.4rem,5.4vw,5.5rem)]" />
        </div>
        <div className="mt-10 hidden h-px w-full bg-line lg:block motion-reduce:lg:hidden">
          <div ref={progress} className="h-px w-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      <div
        ref={track}
        className="container-luxe mt-14 flex flex-col gap-6 lg:mt-16 lg:w-max lg:max-w-none lg:flex-row lg:gap-8 lg:pr-[12vw] motion-reduce:lg:w-full motion-reduce:lg:max-w-[1600px] motion-reduce:lg:flex-wrap motion-reduce:lg:pr-[clamp(1.25rem,4vw,4rem)]"
      >
        {site.process.map((step, i) => (
          <Reveal key={step.title} className="lg:w-[38vw] lg:max-w-[560px] lg:shrink-0 motion-reduce:lg:w-[calc(50%-1rem)]">
            <article className="relative flex h-full min-h-[300px] flex-col overflow-hidden border border-line bg-surface/50 p-8 md:p-10 lg:min-h-[52vh]">
              <span
                data-step-num
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 font-display text-[clamp(7rem,14vw,13rem)] font-extralight leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,0.28)]"
              >
                {pad2(i + 1)}
              </span>
              <span className="font-display text-xs tracking-[0.25em] text-gold">Step {pad2(i + 1)}</span>
              <h3 className="mt-auto pt-24 font-display text-[clamp(1.8rem,3vw,2.8rem)] font-light uppercase leading-none tracking-[0.06em] text-gold-gradient">
                {step.title}
              </h3>
              <p className="mt-5 max-w-sm text-secondary">{step.text}</p>
              <p className="mt-8 border-t border-line pt-5 font-display text-[0.65rem] uppercase tracking-[0.22em] text-gold/80">{step.detail}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
