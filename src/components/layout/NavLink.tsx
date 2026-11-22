"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { useScrollTo } from "./SmoothScroll";

/**
 * Link to "/#section". On the home page it smooth-scrolls (Lenis) instead of
 * navigating; elsewhere it routes to the home page and jumps to the section.
 */
export function NavLink({
  href,
  onNavigate,
  ...rest
}: { href: string; onNavigate?: () => void } & Omit<ComponentPropsWithoutRef<typeof Link>, "href">) {
  const pathname = usePathname();
  const scrollTo = useScrollTo();
  const hash = href.includes("#") ? href.slice(href.indexOf("#")) : null;

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (hash && pathname === "/") {
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        history.replaceState(null, "", hash);
        // When closing the mobile menu, wait for it to release the scroll lock first
        if (onNavigate) window.setTimeout(() => scrollTo(el as HTMLElement), 80);
        else scrollTo(el as HTMLElement);
      }
    }
  };
  return <Link href={href} onClick={onClick} {...rest} />;
}
