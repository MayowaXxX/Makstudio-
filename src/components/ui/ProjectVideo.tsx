"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/** Poster with a big play button; loads and plays the full video on click. */
export function ProjectVideo({
  src,
  poster,
  title,
  vertical = false,
}: {
  src: string;
  poster: string;
  title: string;
  vertical?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  return (
    <div
      className={
        vertical
          ? "relative mx-auto aspect-[9/16] w-full max-w-[min(100%,calc(85svh*9/16))] overflow-hidden border border-line bg-ink-deep"
          : "relative aspect-video w-full overflow-hidden border border-line bg-ink-deep"
      }
    >
      {active ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-cover"
          aria-label={`${title} — full video`}
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          data-cursor="play"
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play ${title}`}
        >
          <Image src={poster} alt="" fill priority sizes={vertical ? "(min-width: 768px) 480px, 100vw" : "(min-width: 1600px) 1500px, 100vw"} className="object-cover transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-ink/30 transition-colors duration-700 group-hover:bg-ink/10" />
          <span className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-ink/40 backdrop-blur-sm transition-transform duration-700 ease-luxe group-hover:scale-110 md:h-32 md:w-32">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 text-gold-light" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
