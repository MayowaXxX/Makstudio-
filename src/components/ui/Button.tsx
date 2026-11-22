import { NavLink } from "@/components/layout/NavLink";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "ghost";

const base =
  "group relative inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full px-7 py-3.5 font-display text-[0.72rem] uppercase tracking-[0.28em] transition-colors duration-500 ease-luxe";
const variants: Record<Variant, string> = {
  solid: "bg-gold-gradient text-ink hover:text-ink shadow-[0_0_0_1px_rgba(232,207,138,0.4)_inset]",
  outline: "border border-gold/70 text-gold-light hover:text-ink",
  ghost: "text-gold-light hover:text-gold",
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      {variant === "outline" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 translate-y-full rounded-full bg-gold-gradient transition-transform duration-500 ease-luxe group-hover:translate-y-0"
        />
      )}
      {variant === "solid" && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.45)_50%,transparent_80%)] transition-transform duration-700 ease-luxe group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </>
  );
}

type LinkProps = { href: string; variant?: Variant; magnetic?: boolean; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "className" | "children"
>;

export function ButtonLink({ href, variant = "solid", magnetic = true, className, children, ...rest }: LinkProps) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith(".pdf");
  const el = isExternal ? (
    <a href={href} className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </a>
  ) : (
    <NavLink href={href} className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </NavLink>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

type BtnProps = { variant?: Variant; magnetic?: boolean; className?: string; children: ReactNode } & Omit<
  ComponentPropsWithoutRef<"button">,
  "className" | "children"
>;

export function Button({ variant = "solid", magnetic = true, className, children, type = "button", ...rest }: BtnProps) {
  const el = (
    <button type={type} className={cn(base, variants[variant], "disabled:opacity-60", className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-3.5 w-3.5", className)} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 19 19 5M9 5h10v10" />
    </svg>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-3.5 w-3.5", className)} fill="currentColor" aria-hidden>
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}
