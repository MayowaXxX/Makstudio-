/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MAK STUDIO — SITE CONTENT
 *  Everything you see on the site lives in this one file. Edit text, swap
 *  media paths, add projects — no component changes required.
 *
 *  Media: drop files into /public/media (or use full https:// URLs from a CDN
 *  and add the host to next.config.ts → images.remotePatterns).
 *
 *  Headlines support *asterisks* to set a word in the elegant serif italic,
 *  e.g. "Directing the *Future*".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ServiceId = "creative-direction" | "animation" | "music-visualizers" | "ads";

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: ServiceId;
  year: number;
  /** Tools used (shown as pills). Leave empty to hide. */
  tools: string[];
  /** Poster frame / card thumbnail (16:9 recommended, ≥1600px wide). */
  thumbnail: string;
  /** Short muted loop that plays on hover (keep it ~3–6s, <2MB). */
  preview: string;
  /** Full-length video shown on the project page. */
  video: string;
  /** Video orientation. Defaults to "16:9"; use "9:16" for vertical work. */
  aspect?: "16:9" | "9:16";
  summary: string;
  /** Optional chapters on the project page — omit any you don't need. */
  brief?: string;
  concept?: string;
  process?: string[];
  credits: { role: string; name: string }[];
};

export type Social = { label: string; href: string; handle: string };

export const site = {
  name: "MAK",
  studio: "MAK Studio",
  /**
   * Your production domain (no trailing slash). Used for SEO, the sitemap and
   * Open Graph URLs. Leave empty to fall back to Vercel's production URL.
   */
  url: "", // TODO: e.g. "https://makstudio.com"
  title: "MAK Studio — AI Creative Director, Animator & Music Visualizer Artist",
  description:
    "MAK Studio is the practice of MAK — AI creative director, AI animator, experimental music visualizer artist and AI ads producer. Cinematic, gold-standard visual storytelling for artists, labels and brands.",
  keywords: [
    "AI creative director",
    "AI animator",
    "music visualizer",
    "AI ads",
    "AI video production",
    "TouchDesigner",
    "Runway",
    "Midjourney",
  ],
  email: "nemrack79@gmail.com",
  // WhatsApp: `number` is international format without "+" (used for the wa.me chat link)
  whatsapp: { display: "+234 902 806 5984", number: "2349028065984" },
  availability: "Booking commissions for Q1 2027",
  location: "Working worldwide",
  launchYear: 2026,

  roles: ["AI Creative Director", "AI Animator", "Music Visualizer Artist", "AI Ads Producer"],

  nav: [
    { label: "Work", href: "/#work" },
    { label: "Visualizers", href: "/#visualizers" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],

  // ── HERO ────────────────────────────────────────────────────────────────
  hero: {
    eyebrow: "MAK Studio · AI-native creative practice",
    headline: "Directing the *Future* of Visual Storytelling",
    // Background loop: short and light (≤10MB, no audio). Cut from your projects.
    backgroundVideo: "/media/hero-loop.mp4",
    poster: "/media/hero-poster.jpg",
    reel: {
      src: "/media/reel.mp4", // Showreel with sound, cut from your projects
      poster: "/media/reel-poster.jpg",
      title: "MAK Studio Showreel 2026",
    },
  },

  // ── MARQUEE ─────────────────────────────────────────────────────────────
  marquee: {
    words: ["Creative Direction", "Animation", "Music Visualizers", "AI Ads"],
    // TODO: swap for your real clients. Add `logo: "/media/clients/name.svg"`
    // to show an SVG logo (it will be tinted gold automatically).
    clients: [
      { name: "Nocturne Records", style: "serif" },
      { name: "HALDEN", style: "display" },
      { name: "Maison Ombre", style: "serif" },
      { name: "ORO LABS", style: "display" },
      { name: "Velvet Static", style: "sans" },
      { name: "KAIRO", style: "display" },
      { name: "Saint Cielo", style: "serif" },
      { name: "MONOLITH AUDIO", style: "sans" },
    ] as { name: string; style: "serif" | "display" | "sans"; logo?: string }[],
  },

  // ── WORK ────────────────────────────────────────────────────────────────
  work: {
    heading: "Selected *Work*",
    intro:
      "A cut of recent work: cinematic AI short films, animated worlds and ad campaigns, built with a generative pipeline and a director's eye.",
    categories: [
      { id: "creative-direction", label: "Creative Direction" },
      { id: "animation", label: "Animation" },
      { id: "music-visualizers", label: "Music Visualizers" },
      { id: "ads", label: "Ads" },
    ] as { id: ServiceId; label: string }[],
    // TODO: replace these placeholder projects with your real work.
    projects: [
      // TODO: confirm titles, years, credits and the tools you used — they were
      // written from what's visible in the videos. Add `brief` / `process` to
      // show those chapters on the project page.
      {
        slug: "pharaohs-of-lagos",
        title: "Pharaohs of Lagos",
        client: "Short film",
        category: "creative-direction",
        year: 2026,
        tools: [],
        thumbnail: "/media/work/pharaohs-of-lagos.jpg",
        preview: "/media/work/pharaohs-of-lagos-preview.mp4",
        video: "/media/work/pharaohs-of-lagos.mp4",
        summary: "Ancient Egypt reimagined through a West African lens: pharaohs, pyramid builders and a Lagos-to-Accra ride in one sun-baked world.",
        concept:
          "A collision of eras. Royal processions, pyramid construction sites and modern luxury share a single warm, sepia-graded universe, where queens take selfies and the commute runs from Lagos to Accra.",
        credits: [{ role: "Direction & AI Production", name: "MAK" }],
      },
      {
        slug: "ikoyi",
        title: "Ikoyi",
        client: "Short film",
        category: "creative-direction",
        year: 2026,
        tools: [],
        thumbnail: "/media/work/ikoyi.jpg",
        preview: "/media/work/ikoyi-preview.mp4",
        video: "/media/work/ikoyi.mp4",
        summary: "A monochrome Lagos story, from campaign halls and roadside canteens to convoys at the gates of Ikoyi.",
        concept:
          "Shot entirely in black and white, the film moves through Lagos's layers of power and status with bold, poster-style typography punching through the frame.",
        credits: [{ role: "Direction & AI Production", name: "MAK" }],
      },
      {
        slug: "homegrown",
        title: "Homegrown",
        client: "Short film",
        category: "animation",
        year: 2026,
        tools: [],
        thumbnail: "/media/work/homegrown.jpg",
        preview: "/media/work/homegrown-preview.mp4",
        video: "/media/work/homegrown.mp4",
        summary: "Village superheroes, local footballers, Durbar horsemen and elders: everyday Nigeria re-staged as cinematic AI vignettes.",
        concept:
          "Familiar scenes, heightened. Each vignette takes a slice of Nigerian life and gives it the lighting, grain and gravity of a period film, with a wink of humour.",
        credits: [{ role: "Direction & AI Animation", name: "MAK" }],
      },
      {
        slug: "matchday",
        title: "Matchday",
        client: "Sports betting spot",
        category: "ads",
        year: 2026,
        tools: [],
        thumbnail: "/media/work/matchday.jpg",
        preview: "/media/work/matchday-preview.mp4",
        video: "/media/work/matchday.mp4",
        summary: "A comedic spot about a whole community glued to the odds, from the bush to the barbershop to the betting shop.",
        concept:
          "Everyone has a ticket running. The spot cuts between characters across generations and settings, all sharing the same matchday nerves.",
        credits: [{ role: "Direction & AI Production", name: "MAK" }],
      },
      {
        slug: "pawsfirst",
        title: "PawsFirst",
        client: "UGC product ad",
        category: "ads",
        year: 2026,
        tools: [],
        aspect: "9:16",
        thumbnail: "/media/work/pawsfirst.jpg",
        preview: "/media/work/pawsfirst-preview.mp4",
        video: "/media/work/pawsfirst.mp4",
        summary: "A vertical, creator-style product ad for PawsFirst dog food, built for TikTok and Reels.",
        concept:
          "The warmth and pace of real creator content (a host, her dog and word-by-word captions), produced entirely with AI.",
        credits: [{ role: "Direction & AI Production", name: "MAK" }],
      },
    ] satisfies Project[] as Project[],
  },

  // ── SIGNATURE: SOUND MADE VISIBLE ──────────────────────────────────────
  visualizer: {
    eyebrow: "Signature",
    heading: "Sound Made *Visible*",
    pitch: [
      "Press play and watch the music move the metal. This is a live, audio-reactive piece running in your browser: the same thinking I bring to album visualizers, tour visuals and streaming canvases.",
      "Artists and labels commission a visual language that listens. Stems drive motion, drops change the physics, and every format comes from one system: 16:9 premieres, 9:16 canvases, LED walls.",
    ],
    offerings: ["Album & single visualizers", "Spotify Canvas & lyric loops", "Live / tour visual systems", "Real-time TouchDesigner rigs"],
    cta: "Commission a visualizer",
    // TODO: swap for your own track (MP3/AAC, same-origin so the analyser can read it)
    sampleTrack: {
      src: "/media/sample-track.mp3",
      title: "Gold Hour (sample)",
      artist: "MAK Studio",
    },
    modes: [
      { id: "aurum", label: "Aurum", description: "Gold particle nebula" },
      { id: "liquid", label: "Liquid Metal", description: "Molten chrome form" },
      { id: "halo", label: "Halo", description: "Spectral rings in time" },
    ] as { id: "aurum" | "liquid" | "halo"; label: string; description: string }[],
  },

  // ── SERVICES ────────────────────────────────────────────────────────────
  services: [
    {
      id: "creative-direction",
      title: "AI Creative Direction",
      description:
        "Concept, look and narrative for brands and artists, then the generative pipeline to deliver it at the quality of a traditional production.",
      deliverables: ["Creative concepts & treatments", "Visual identity systems", "Moodboards & style frames", "Campaign art direction"],
    },
    {
      id: "animation",
      title: "AI Animation",
      description:
        "Animated films, title sequences and loops that blend generative video with hand-directed motion design, frame-consistent and on brand.",
      deliverables: ["Short films & title sequences", "Character & world animation", "Social loops", "Animated key art"],
    },
    {
      id: "music-visualizers",
      title: "Music Visualizers",
      description:
        "Audio-reactive visuals for releases and stages, driven by the actual stems so every hit lands on screen.",
      deliverables: ["Album / single visualizers", "Spotify Canvas & lyric videos", "Live & tour visual packs", "Real-time TouchDesigner rigs"],
    },
    {
      id: "ads",
      title: "AI Ad Campaigns",
      description:
        "High-end product films and performance creative produced in days, not months, with every aspect ratio and cut-down included.",
      deliverables: ["Hero product films", "Paid social cut-downs", "UGC-style variations", "Localized versions"],
    },
  ] as { id: ServiceId; title: string; description: string; deliverables: string[] }[],

  // ── PROCESS ─────────────────────────────────────────────────────────────
  process: [
    { title: "Brief", text: "We start with the goal, the audience and the feeling. I ask a lot of questions so the machines don't have to guess.", detail: "Discovery call · references · success metrics" },
    { title: "Concept", text: "Two or three directions with treatments, style frames and a sound/motion language, so you can see the idea before it's made.", detail: "Treatment · style frames · animatic" },
    { title: "Generate", text: "The generative pipeline runs: hundreds of iterations across image, video and 3D tools, curated relentlessly.", detail: "Runway · Kling · Midjourney · TouchDesigner" },
    { title: "Direct & Refine", text: "This is where direction matters. Edit, composite, grade and sound until every frame feels intentional.", detail: "Edit · compositing · grade · sound" },
    { title: "Deliver", text: "Masters and every cut-down you need, in every format, on time, with files organized for your team.", detail: "4K masters · 9:16 / 1:1 · project files" },
  ],

  // ── STATS ── TODO: your real numbers ────────────────────────────────────
  stats: [
    { value: 120, suffix: "+", label: "Projects delivered" },
    { value: 48, suffix: "M", label: "Views generated" },
    { value: 35, suffix: "+", label: "Brands & artists" },
    { value: 7, suffix: "", label: "Years directing" },
  ],

  // ── ABOUT ───────────────────────────────────────────────────────────────
  about: {
    heading: "I direct machines to *dream* in gold",
    // TODO: replace with your portrait (portrait orientation, ~1000×1300)
    portrait: "/media/portrait.jpg",
    portraitAlt: "Portrait of MAK, AI creative director", // TODO: describe your real photo
    bio: [
      "I'm Mayowa, a creative director and animator working at the edge where cinema meets generative AI. I started in motion design and music videos, and when the new tools arrived I treated them the way a cinematographer treats a new lens: something to master, not a shortcut.",
      "Today I lead MAK Studio, a small, senior practice making visualizers for artists, campaigns for brands and films that wouldn't have been possible two years ago. Taste first, tools second.",
    ],
    tools: [
      { group: "Generative", items: ["Runway", "Kling", "Midjourney", "Veo", "Stable Diffusion"] },
      { group: "Motion & 3D", items: ["After Effects", "Cinema 4D", "Blender", "Houdini"] },
      { group: "Real-time", items: ["TouchDesigner", "Notch", "Unreal Engine"] },
      { group: "Sound & Finish", items: ["Ableton Live", "DaVinci Resolve", "Premiere Pro"] },
    ],
    pressKit: "/press-kit.pdf", // TODO: replace the placeholder PDF
  },

  // ── TESTIMONIALS ── TODO: real quotes ───────────────────────────────────
  testimonials: [
    {
      quote:
        "MAK turned our album into a world. The visualizers did more for the release than the press campaign, and fans still make edits from them.",
      name: "Séra",
      role: "Recording Artist",
      company: "Nocturne Records",
    },
    {
      quote:
        "We got the polish of a big-budget shoot in a fraction of the time. MAK directs AI like a cinematographer: every frame had intent.",
      name: "Camille Durand",
      role: "Brand Director",
      company: "Maison Ombre",
    },
    {
      quote:
        "The live visual system reacted to our set in ways we never planned. It made every night feel like a premiere.",
      name: "Kai Osei",
      role: "Founder & Producer",
      company: "KAIRO",
    },
    {
      quote: "Calm, fast and frighteningly good. The concept stage alone was worth the fee.",
      name: "Jonas Halden",
      role: "Head of Marketing",
      company: "HALDEN Watches",
    },
  ],

  // ── CONTACT ─────────────────────────────────────────────────────────────
  contact: {
    heading: "Let's create something *unusual*",
    intro: "Tell me about the project: an album, a launch, a film that shouldn't exist yet. I reply within two working days.",
    budgets: ["Under $2k", "$2k – $5k", "$5k – $15k", "$15k – $50k", "$50k+"],
  },

  // Add Instagram / LinkedIn etc. in the same shape when you have them.
  socials: [
    { label: "X", handle: "@bigZUKO_", href: "https://x.com/bigZUKO_" },
    { label: "TikTok", handle: "@sirmayoishere", href: "https://www.tiktok.com/@sirmayoishere" },
    { label: "YouTube", handle: "@makstudiosfr", href: "https://www.youtube.com/@makstudiosfr" },
  ] as Social[],
};

export type Site = typeof site;

export const categoryLabel = (id: ServiceId) =>
  site.work.categories.find((c) => c.id === id)?.label ?? id;
