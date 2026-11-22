import { cn } from "@/lib/utils";
import { SplitReveal } from "./SplitReveal";

/** "(03) — Services" eyebrow, hairline and a split-reveal headline. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  className,
  titleClassName,
  as = "h2",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  id?: string;
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="mb-8 flex items-center gap-4 md:mb-10">
        {index && <span className="font-display text-xs tracking-[0.2em] text-gold/80">({index})</span>}
        <span className="eyebrow">{eyebrow}</span>
        <span className="hairline flex-1" />
      </div>
      <SplitReveal
        as={as}
        text={title}
        className={cn("display text-[clamp(2.4rem,6.4vw,6.5rem)]", titleClassName)}
        wordClassName="text-gold-gradient"
        accentClassName="accent lowercase text-gold-gradient"
        id={id}
      />
    </div>
  );
}
