"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { GoldGlow } from "@/components/brand/GoldGlow";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/SplitReveal";
import { site, type ServiceId } from "@/content/site";
import { useMediaQuery } from "@/lib/hooks";
import { cn, pad2 } from "@/lib/utils";

type Filter = "all" | ServiceId;

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const twoCol = useMediaQuery("(min-width: 768px)", true);
  const { projects, categories } = site.work;

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: projects.length },
    ...categories.map((c) => ({ id: c.id as Filter, label: c.label, count: projects.filter((p) => p.category === c.id).length })),
  ];

  const columns = twoCol
    ? [filtered.filter((_, i) => i % 2 === 0), filtered.filter((_, i) => i % 2 === 1)]
    : [filtered];

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-24 py-28 md:py-40">
      <GoldGlow className="-left-1/4 top-0 h-[60vw] w-[60vw]" />
      <div className="container-luxe">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading index="01" eyebrow="Portfolio" title={site.work.heading} id="work-title" className="lg:col-span-8" />
          <Reveal className="lg:col-span-4">
            <p className="max-w-md text-secondary lg:ml-auto">{site.work.intro}</p>
          </Reveal>
        </div>

        <div role="group" aria-label="Filter projects by category" className="-mx-5 mt-14 flex gap-2 overflow-x-auto border-b border-line px-5 pb-6 [scrollbar-width:none] md:mx-0 md:mt-20 md:flex-wrap md:px-0">
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-[0.7rem] uppercase tracking-[0.22em] transition-colors duration-500",
                  active ? "text-ink" : "text-champagne/75 hover:text-gold-light",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="work-filter-pill"
                    className="absolute inset-0 rounded-full bg-gold-gradient"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {f.label} <sup className="ml-0.5 text-[0.55rem]">{pad2(f.count)}</sup>
                </span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        </p>

        <LayoutGroup>
          <div className="mt-14 flex flex-col gap-16 md:mt-20 md:flex-row md:gap-10 lg:gap-16">
            {columns.map((col, c) => (
              <div key={c} className={cn("flex flex-1 flex-col gap-16 md:gap-24", c === 1 && "md:pt-40")}>
                <AnimatePresence mode="popLayout">
                  {col.map((p) => (
                    <ProjectCard
                      key={p.slug}
                      project={p}
                      index={filtered.indexOf(p)}
                      aspect={twoCol ? (c === 0 ? "aspect-[4/5]" : "aspect-[4/3]") : "aspect-[4/3]"}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
