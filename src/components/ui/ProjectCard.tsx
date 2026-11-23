"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categoryLabel, type Project } from "@/content/site";
import { useFinePointer, useReducedMotionPref } from "@/lib/hooks";
import { cn, pad2 } from "@/lib/utils";
import { ImageReveal } from "./ImageReveal";

export function ProjectCard({ project, index, aspect }: { project: Project; index: number; aspect: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [hover, setHover] = useState(false);
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const canPreview = fine && !reduced;

  const start = () => {
    setHover(true);
    if (canPreview) setLoadVideo(true);
  };
  const stop = () => setHover(false);

  // Play/pause once the <video> is actually mounted (it's only rendered after the first hover)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hover) v.play().catch(() => {});
    else v.pause();
  }, [hover, loadVideo]);

  return (
    <motion.article
      layout="position"
      layoutId={project.slug}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/work/${project.slug}`}
        prefetch
        className="group block"
        data-cursor="view"
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
      >
        <ImageReveal className={cn("border border-line bg-surface", aspect)}>
          <div className="relative h-full w-full">
            <Image
              src={project.thumbnail}
              alt={`${project.title} — ${project.summary}`}
              fill
              sizes="(min-width: 768px) 46vw, 100vw"
              style={{ objectPosition: project.aspect === "9:16" ? "50% 30%" : "50% 50%" }}
              className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.06]"
            />
            {loadVideo && (
              <video
                ref={videoRef}
                src={project.preview}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                tabIndex={-1}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  hover ? "opacity-100" : "opacity-0",
                )}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20 transition-opacity duration-700 group-hover:opacity-60" />
            <span className="absolute left-5 top-5 font-display text-xs tracking-[0.2em] text-gold-light">{pad2(index + 1)}</span>
            <span className="absolute right-5 top-5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1.5 font-display text-[0.6rem] uppercase tracking-[0.25em] text-gold-light backdrop-blur-sm">
              {categoryLabel(project.category)}
            </span>
            {/* Gold frame on hover */}
            <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40" />
          </div>
        </ImageReveal>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-light uppercase tracking-[0.08em] text-gold-light transition-colors duration-500 group-hover:text-gold md:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-secondary">{project.client}</p>
          </div>
          <span className="shrink-0 pt-1 font-display text-sm tracking-[0.15em] text-gold/80">{project.year}</span>
        </div>
        {project.tools.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools used">
            {project.tools.map((t) => (
              <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.7rem] tracking-wide text-champagne/75">
                {t}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </motion.article>
  );
}
