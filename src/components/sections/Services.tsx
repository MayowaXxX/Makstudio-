"use client";

import { GoldGlow } from "@/components/brand/GoldGlow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/SplitReveal";
import { site, type ServiceId } from "@/content/site";
import { pad2 } from "@/lib/utils";

const icons: Record<ServiceId, React.ReactNode> = {
  "creative-direction": (
    // eye within a chevron — direction & vision
    <>
      <path d="M4 34 24 8l20 26" />
      <path d="M10 30c4-5 8.5-7.5 14-7.5S34 25 38 30c-4 5-8.5 7.5-14 7.5S14 35 10 30Z" />
      <circle cx="24" cy="30" r="3.5" />
    </>
  ),
  animation: (
    // onion-skinned frames
    <>
      <rect x="6" y="14" width="22" height="22" rx="1" opacity=".35" />
      <rect x="13" y="11" width="22" height="22" rx="1" opacity=".65" />
      <rect x="20" y="8" width="22" height="22" rx="1" />
      <path d="M28 15.5v9l7-4.5z" />
    </>
  ),
  "music-visualizers": (
    // waveform in a ring
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M11 24h3l2-6 3 13 3-17 3 20 3-14 2 7 2-3h5" />
    </>
  ),
  ads: (
    // spotlight / lens
    <>
      <path d="M6 18h8l14-8v28l-14-8H6z" />
      <path d="M34 16c2.5 2 4 5 4 8s-1.5 6-4 8M38 11c4 3.5 6 8 6 13s-2 9.5-6 13" />
    </>
  ),
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative scroll-mt-24 py-28 md:py-40 cv-auto">
      <GoldGlow className="left-1/2 top-1/3 h-[60vw] w-[80vw] -translate-x-1/2" />
      <div className="container-luxe">
        <SectionHeading index="03" eyebrow="Services" title="What I *make*" id="services-title" />
        <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-2 md:gap-6">
          {site.services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.12}>
              <ServiceCard index={i} {...s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ id, title, description, deliverables, index }: (typeof site.services)[number] & { index: number }) {
  return (
    <article
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className="group relative flex h-full flex-col overflow-hidden border border-line bg-surface/60 p-8 transition-[border-color,box-shadow] duration-700 ease-luxe hover:border-gold/60 hover:shadow-[0_0_0_1px_rgba(201,162,75,0.25),0_0_60px_-10px_rgba(201,162,75,0.35),inset_0_0_60px_-30px_rgba(201,162,75,0.4)] md:p-12"
    >
      {/* cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(201,162,75,0.12), transparent 60%)" }}
      />
      <div className="relative flex items-start justify-between">
        <svg
          viewBox="0 0 48 48"
          className="h-14 w-14 text-gold transition-transform duration-700 ease-luxe group-hover:-translate-y-1 group-hover:text-gold-light md:h-16 md:w-16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
          aria-hidden
        >
          {icons[id]}
        </svg>
        <span className="font-display text-sm tracking-[0.2em] text-gold/80">{pad2(index + 1)}</span>
      </div>
      <h3 className="relative mt-10 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-light uppercase leading-tight tracking-[0.06em] text-gold-gradient">
        {title}
      </h3>
      <p className="relative mt-5 max-w-md text-secondary">{description}</p>
      <div className="relative mt-auto pt-10">
        <p className="eyebrow mb-4 !text-[0.62rem] text-gold/80">Deliverables</p>
        <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
          {deliverables.map((d) => (
            <li key={d} className="flex items-start gap-3 text-sm text-champagne/85">
              <span className="mt-[0.4em] h-px w-3 shrink-0 bg-gold" />
              {d}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
