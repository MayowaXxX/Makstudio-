import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Josefin_Sans } from "next/font/google";
import { Grain } from "@/components/brand/Grain";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PRELOADER_SCRIPT, Preloader } from "@/components/layout/Preloader";
import { Providers } from "@/components/layout/Providers";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.title,
    template: `%s — ${site.studio}`,
  },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.studio,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.studio,
    title: site.title,
    description: site.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0B2419",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${josefin.variable} ${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets html[data-preloaded] before paint on repeat visits / reduced motion so the preloader never flashes */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-ink text-champagne antialiased">
        <Providers>
          <Preloader />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
        <Grain />
      </body>
    </html>
  );
}
