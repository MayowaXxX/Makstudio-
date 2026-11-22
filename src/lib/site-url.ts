import { site } from "@/content/site";

/** Absolute site URL for metadata, sitemap and OG images (server-only). */
export function getSiteUrl(): string {
  if (site.url) return site.url.replace(/\/$/, "");
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}
