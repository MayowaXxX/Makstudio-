import { Fragment } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Two infinite rows: big gold service words, then client names/logos in reverse. */
export function Marquee() {
  const { words, clients } = site.marquee;
  return (
    <section aria-label="Disciplines and clients" className="relative overflow-hidden border-y border-line bg-ink-deep py-10 md:py-14">
      <p className="sr-only">
        {words.join(", ")}. Selected clients: {clients.map((c) => c.name).join(", ")}.
      </p>
      <div aria-hidden className="marquee-row flex overflow-hidden" style={{ ["--marquee-duration" as string]: "38s" }}>
        <div className="marquee-track flex shrink-0 animate-marquee items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {[...words, ...words].map((w, i) => (
                <Fragment key={`${dup}-${i}`}>
                  <span
                    className={cn(
                      "px-6 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light uppercase leading-none tracking-[0.06em] md:px-10",
                      i % 2 ? "text-transparent [-webkit-text-stroke:1px_rgba(201,162,75,0.75)]" : "text-gold-gradient",
                    )}
                  >
                    {w}
                  </span>
                  <span className="text-[clamp(1.2rem,2.5vw,2rem)] text-gold">✦</span>
                </Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="hairline mx-auto my-8 w-[90%] md:my-12" />

      <div aria-hidden className="marquee-row flex overflow-hidden" style={{ ["--marquee-duration" as string]: "52s" }}>
        <div className="marquee-track flex shrink-0 animate-marquee-reverse items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {[...clients, ...clients].map((c, i) => (
                <span key={`${dup}-${i}`} className="flex items-center px-8 md:px-14">
                  {c.logo ? (
                    // Monochrome gold tint for SVG/PNG logos
                    <span
                      className="block h-8 w-32 bg-gold/80 md:h-10 md:w-40"
                      style={{
                        mask: `url(${c.logo}) center / contain no-repeat`,
                        WebkitMask: `url(${c.logo}) center / contain no-repeat`,
                      }}
                    />
                  ) : (
                    <span
                      className={cn(
                        "whitespace-nowrap text-gold/80 transition-colors hover:text-gold-light",
                        c.style === "serif" && "font-serif text-2xl italic md:text-3xl",
                        c.style === "display" && "font-display text-lg uppercase tracking-[0.4em] md:text-xl",
                        c.style === "sans" && "font-sans text-base font-semibold uppercase tracking-[0.18em] md:text-lg",
                      )}
                    >
                      {c.name}
                    </span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
