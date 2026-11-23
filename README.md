# MAK Studio — Portfolio

A cinematic, gold-on-velvet portfolio for **MAK**: AI Creative Director, AI Animator, Music Visualizer Artist and AI Ads Producer.

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis · Three.js

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production preview
```

---

## 1. Edit your content: `src/content/site.ts`

**Everything on the site lives in this one file**: name, roles, headlines, projects, services, process, stats, bio, testimonials, contact options and socials. Search it for `TODO` to find every placeholder.

- **Accent words:** wrap a word in asterisks to set it in the serif italic: `"Directing the *Future* of Visual Storytelling"`.
- **Domain:** set `url` (e.g. `"https://makstudio.com"`) so SEO tags, the sitemap and Open Graph links use it.
- **Email & socials:** `email` and `socials` feed the navbar menu, contact section and footer.

### Swapping in your videos and images

Drop files into `public/media/` (any structure you like) and point `site.ts` at them with paths starting at `/media/...`.

| Where | Field in `site.ts` | Recommended |
| --- | --- | --- |
| Hero background loop | `hero.backgroundVideo` + `hero.poster` | MP4 (H.264), 1080p, 8–15s, **no audio**, under 10MB. Poster: 1920×1080 JPG. |
| "Watch Reel" modal | `hero.reel.src` / `poster` | Full reel with sound. Large files are better on a CDN (see below). |
| Project card + page | `thumbnail` | 16:9 JPG, 1600px wide or more. |
| Hover preview | `preview` | 3–6s muted loop, 960×540, under 2MB. |
| Project page video | `video` | Full-length cut. |
| Portrait | `about.portrait` + `portraitAlt` | Portrait-orientation JPG (~1000×1300). |
| Visualizer track | `visualizer.sampleTrack.src` | MP3/AAC served **from your own domain** (the Web Audio analyser can't read cross-origin audio without CORS headers). |
| Press kit | `about.pressKit` | Replace `public/press-kit.pdf`. |
| Client logos | `marquee.clients[].logo` | Optional SVG/PNG. Rendered as a monochrome gold silhouette automatically. Without a logo, the name is set in type. |

**Adding a project:** copy one object in `work.projects`, give it a unique `slug` (that's its URL: `/work/your-slug`) and a `category` of `creative-direction`, `animation`, `music-visualizers` or `ads`. The filter tabs, counts, project page, metadata and sitemap update automatically.

**Hosting media on a CDN** (Cloudinary, Mux, Bunny, S3): use full `https://` URLs in `site.ts`. For images, also add the host to `images.remotePatterns` in `next.config.ts`.

**Your logo:** the MAK wordmark is recreated as an animatable SVG in `src/components/brand/MakLogo.tsx` (geometry in `logo-paths.ts`), so it can draw itself on in the preloader and footer. Put your original artwork at `public/logo.jpg` for reference or press use. The favicon is `src/app/icon.svg`.

**Media status:** the projects, hero loop (`hero-loop.mp4`) and showreel (`reel.mp4`) are cut from MAK's real work. The portrait, visualizer sample track and press kit are still generated placeholders from `scripts/generate-placeholders.py`; overwrite them freely.

**Encoding new videos for the web** (H.264, fast start, plus a 5s muted hover preview and a poster frame):

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/media/work/my-project.mp4
ffmpeg -ss 10 -t 5 -i input.mp4 -an -c:v libx264 -crf 27 -pix_fmt yuv420p -movflags +faststart public/media/work/my-project-preview.mp4
ffmpeg -ss 10 -i input.mp4 -frames:v 1 -q:v 3 public/media/work/my-project.jpg
```

Export from your editor at 1080p if you can. Higher-resolution sources look noticeably sharper on large screens than WhatsApp-compressed copies.

For vertical work, add `aspect: "9:16"` to the project and its page shows a vertical player.

---

## 2. Contact form email (Resend)

The form posts to `src/app/api/contact/route.ts`, which validates the fields, blocks bots with a honeypot and sends via the [Resend](https://resend.com) API.

1. Create a Resend account, verify your domain and create an API key.
2. Add these environment variables (locally in `.env.local`, see `.env.example`; in production in Vercel):
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`: your inbox
   - `CONTACT_FROM_EMAIL`: e.g. `MAK Studio <hello@yourdomain.com>`, on your verified domain

Until a key is set, submissions are logged on the server and the visitor still sees the success message, so previews work without email configured.

---

## 3. Deploy to Vercel

1. Push this repository to GitHub.
2. In [vercel.com/new](https://vercel.com/new), import the repo. The framework is detected as Next.js and no build settings need changing.
3. Under **Settings → Environment Variables**, add the Resend variables above and optionally `NEXT_PUBLIC_SITE_URL`.
4. Deploy, then add your custom domain under **Settings → Domains**, and set `url` in `site.ts` (or `NEXT_PUBLIC_SITE_URL`) to match.

Every push to the main branch redeploys automatically; other branches get preview URLs.

---

## How it's built

```
src/
  content/site.ts            ← all copy & media paths
  app/
    layout.tsx               fonts, metadata, preloader script, providers
    page.tsx                 the one-page sections, in order
    template.tsx             route-transition curtain
    work/[slug]/page.tsx     project pages (statically generated)
    api/contact/route.ts     form endpoint (Resend)
    opengraph-image.tsx      gold-on-green OG card
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  components/
    brand/      MakLogo (animated SVG), Grain, GoldGlow
    layout/     Preloader, Navbar (+ mobile menu), Footer, Cursor, SmoothScroll (Lenis), NavLink
    sections/   Hero, Marquee, Work, SoundMadeVisible, Services, Process, Stats, About, Testimonials, Contact
    ui/         Button/Magnetic, SplitReveal/Reveal, ImageReveal, VideoModal, ProjectCard, ProjectVideo, SectionHeading
    visualizer/ audio.ts (Web Audio analyser), scene.ts (Three.js, 3 modes), shaders.ts (GLSL)
scripts/generate-placeholders.py
```

**Brand tokens** (colors, fonts, easing) are defined in `src/app/globals.css` under `@theme`, and are available as Tailwind classes such as `bg-ink`, `text-gold`, `text-gold-gradient` and `border-line`.

**Sound Made Visible:** Three.js loads only when the section approaches the viewport, and the render loop runs only while it's on screen. The modes are:
- **Aurum:** a gold particle nebula.
- **Liquid Metal:** a displaced molten sphere.
- **Halo:** concentric spectral rings where each ring is an older moment of the music.

Visitors can play the sample track or upload their own audio; nothing is uploaded to a server.

**Motion & accessibility:**
- `prefers-reduced-motion` turns off the preloader, smooth scrolling, the hero video, grain/marquee loops and the pinned Process scroll (which stacks instead).
- The custom cursor appears only on mouse/trackpad devices.
- Menus and modals trap focus and close with Esc.
- Split-text headings expose their full sentence to screen readers.

**Lighthouse** (local production build, mobile emulation):
- **Accessibility, Best Practices and SEO:** 100.
- **Desktop Performance:** ~98.
- **Mobile Performance:** ~95 on repeat visits and ~85 on a first visit. The difference is the intro preloader, which intentionally holds the headline for ~1.5s. To trade intro for score, shorten the timings in `src/components/layout/Preloader.tsx` or remove `<Preloader />` from `layout.tsx`.

> Note: this Next.js version keeps previously visited routes mounted but hidden (React `<Activity>`), and project pages stream their content behind `<Suspense>` for instant navigation. See `AGENTS.md` and `node_modules/next/dist/docs/` for version-specific details.
