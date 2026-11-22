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
  tools: string[];
  /** Poster frame / card thumbnail (16:9 recommended, ≥1600px wide). */
  thumbnail: string;
  /** Short muted loop that plays on hover (keep it ~3–6s, <2MB). */
  preview: string;
  /** Full-length video shown on the project page. */
  video: string;
  summary: string;
  brief: string;
  concept: string;
  process: string[];
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
  email: "hello@yourdomain.com", // TODO: your real inbox
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
    // TODO: replace with your real showreel. Keep the background loop short and
    // light (≤10MB, 1080p, no audio); the full reel can be longer.
    backgroundVideo: "/media/reel.mp4",
    poster: "/media/reel-poster.jpg",
    reel: {
      src: "/media/reel.mp4", // TODO: full reel (with sound)
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
      "A cut of recent commissions — brand films, animated worlds, visualizers for artists and campaigns built with a generative pipeline and a director's eye.",
    categories: [
      { id: "creative-direction", label: "Creative Direction" },
      { id: "animation", label: "Animation" },
      { id: "music-visualizers", label: "Music Visualizers" },
      { id: "ads", label: "Ads" },
    ] as { id: ServiceId; label: string }[],
    // TODO: replace these placeholder projects with your real work.
    projects: [
      {
        slug: "aurum-requiem",
        title: "Aurum Requiem",
        client: "Séra — Nocturne Records",
        category: "music-visualizers",
        year: 2026,
        tools: ["TouchDesigner", "Runway", "After Effects"],
        thumbnail: "/media/work/rings.jpg",
        preview: "/media/work/rings.mp4",
        video: "/media/work/rings.mp4",
        summary: "An audio-reactive visual album where every kick drum ripples through rings of molten gold.",
        brief:
          "Séra needed a visual identity for a six-track album that could live on streaming canvases, a YouTube premiere and the LED wall of a live tour — from one coherent system.",
        concept:
          "Sound as a stone dropped into liquid gold. Each track is a pool; the stems decide the waves. Quiet passages hold still like lacquer, drops shatter the surface.",
        process: [
          "Split the masters into stems and mapped each to a visual parameter in TouchDesigner.",
          "Generated 40+ texture plates with Runway and Midjourney, graded to a gold-on-velvet palette.",
          "Built a real-time rig that renders 4K masters and 9:16 canvas loops from the same scene.",
          "Finished titles and lyric moments in After Effects.",
        ],
        credits: [
          { role: "Creative Direction & Visuals", name: "MAK" },
          { role: "Artist", name: "Séra" },
          { role: "Label", name: "Nocturne Records" },
        ],
      },
      {
        slug: "velvet-static",
        title: "Velvet Static",
        client: "Maison Ombre",
        category: "ads",
        year: 2026,
        tools: ["Kling", "Midjourney", "DaVinci Resolve"],
        thumbnail: "/media/work/smoke.jpg",
        preview: "/media/work/smoke.mp4",
        video: "/media/work/smoke.mp4",
        summary: "A 30-second fragrance spot made of golden smoke, shot entirely without a camera.",
        brief:
          "Launch a new evening fragrance across social and pre-roll with a film that feels like couture — on a timeline too short for a traditional shoot.",
        concept:
          "Scent is invisible, so we made it visible: a slow-motion cloud of gold particulate that folds into the silhouette of the bottle.",
        process: [
          "Moodboarded 200 frames in Midjourney and locked a lighting bible with the brand team.",
          "Animated hero shots in Kling, iterating on motion prompts for weight and drift.",
          "Composited the product plate and finished the grade in Resolve.",
          "Delivered 16:9, 1:1 and 9:16 cut-downs with localized supers.",
        ],
        credits: [
          { role: "Director & AI Producer", name: "MAK" },
          { role: "Client", name: "Maison Ombre" },
        ],
      },
      {
        slug: "lambda-protocol",
        title: "Λ Protocol",
        client: "ORO LABS",
        category: "creative-direction",
        year: 2025,
        tools: ["Midjourney", "Runway", "Cinema 4D"],
        thumbnail: "/media/work/chevrons.jpg",
        preview: "/media/work/chevrons.mp4",
        video: "/media/work/chevrons.mp4",
        summary: "A brand world and launch film built around a single ascending gesture.",
        brief:
          "ORO LABS was rebranding and needed a visual language — not just a logo animation — that could scale from keynote openers to product UI.",
        concept:
          "The chevron as ascent. Every frame is built from rising Λ forms: architecture, light leaks, typography.",
        process: [
          "Defined the visual system: motion principles, palette, type and texture.",
          "Generated architectural plates with Midjourney and extended them into motion with Runway.",
          "Built the hero logo resolve in Cinema 4D.",
        ],
        credits: [
          { role: "Creative Director", name: "MAK" },
          { role: "Client", name: "ORO LABS" },
        ],
      },
      {
        slug: "liquid-gold-hours",
        title: "Liquid Gold Hours",
        client: "Personal film",
        category: "animation",
        year: 2025,
        tools: ["Runway", "Blender", "After Effects"],
        thumbnail: "/media/work/liquid.jpg",
        preview: "/media/work/liquid.mp4",
        video: "/media/work/liquid.mp4",
        summary: "A short animated meditation on time melting at golden hour.",
        brief: "A self-initiated film to push how far AI animation can hold a continuous, painterly mood.",
        concept: "Time as a liquid. Light pools, drips and re-forms as the sun goes down.",
        process: [
          "Simulated base fluids in Blender as motion guides.",
          "Style-transferred and extended shots with Runway video-to-video.",
          "Graded and assembled in After Effects.",
        ],
        credits: [{ role: "Direction & Animation", name: "MAK" }],
      },
      {
        slug: "nocturne-engine",
        title: "Nocturne Engine",
        client: "KAIRO — Live Tour",
        category: "music-visualizers",
        year: 2025,
        tools: ["TouchDesigner", "Notch", "Ableton Live"],
        thumbnail: "/media/work/spectrum.jpg",
        preview: "/media/work/spectrum.mp4",
        video: "/media/work/spectrum.mp4",
        summary: "Real-time tour visuals that listen to the band and answer back.",
        brief:
          "KAIRO wanted show visuals that were never the same twice — reacting to the live mix rather than playing back a timeline.",
        concept: "A circular instrument of light that the music plays, night after night.",
        process: [
          "Built an Ableton → TouchDesigner OSC bridge for stems and cues.",
          "Designed 12 scenes with operator-friendly controls for the VJ.",
          "Optimized to run at 60fps across a 12m LED wall.",
        ],
        credits: [
          { role: "Visual Director", name: "MAK" },
          { role: "Artist", name: "KAIRO" },
        ],
      },
      {
        slug: "molten",
        title: "Molten",
        client: "HALDEN Watches",
        category: "ads",
        year: 2026,
        tools: ["Kling", "Runway", "Houdini"],
        thumbnail: "/media/work/sphere.jpg",
        preview: "/media/work/sphere.mp4",
        video: "/media/work/sphere.mp4",
        summary: "A product film where gold is poured, cooled and becomes a watch case.",
        brief: "Show the craft behind a limited gold edition in 15 seconds for paid social.",
        concept: "From molten to measured — the metal finds its form, then keeps time.",
        process: [
          "Prototyped the liquid-metal look in Houdini.",
          "Generated macro shots with Kling and blended them with product renders.",
          "Cut 6s, 10s and 15s versions optimized for each platform.",
        ],
        credits: [
          { role: "Director & AI Producer", name: "MAK" },
          { role: "Client", name: "HALDEN" },
        ],
      },
      {
        slug: "thread-of-light",
        title: "Thread of Light",
        client: "Saint Cielo",
        category: "animation",
        year: 2024,
        tools: ["After Effects", "Midjourney", "Stable Diffusion"],
        thumbnail: "/media/work/lines.jpg",
        preview: "/media/work/lines.mp4",
        video: "/media/work/lines.mp4",
        summary: "An animated title sequence woven from a single golden thread.",
        brief: "An opening title sequence for a documentary series about textile ateliers.",
        concept: "One unbroken line that becomes fabric, landscape and finally the series title.",
        process: [
          "Storyboarded the line's journey frame by frame.",
          "Generated textile references with Midjourney and Stable Diffusion.",
          "Animated procedurally in After Effects for crisp, resolution-independent line work.",
        ],
        credits: [
          { role: "Title Design & Animation", name: "MAK" },
          { role: "Client", name: "Saint Cielo" },
        ],
      },
      {
        slug: "dust-and-divinity",
        title: "Dust & Divinity",
        client: "Velvet Static Festival",
        category: "creative-direction",
        year: 2024,
        tools: ["Runway", "Midjourney", "TouchDesigner"],
        thumbnail: "/media/work/dust.jpg",
        preview: "/media/work/dust.mp4",
        video: "/media/work/dust.mp4",
        summary: "Festival identity and stage visuals built from a galaxy of gold dust.",
        brief: "A festival identity that works on posters, socials and three stages of live visuals.",
        concept: "Every attendee is a particle; together they make a constellation.",
        process: [
          "Designed the identity system and key art.",
          "Produced 30+ social loops with Runway.",
          "Delivered a TouchDesigner stage pack for the festival's VJs.",
        ],
        credits: [
          { role: "Creative Director", name: "MAK" },
          { role: "Client", name: "Velvet Static Festival" },
        ],
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
      "I'm MAK, a creative director and animator working at the edge where cinema meets generative AI. I started in motion design and music videos, and when the new tools arrived I treated them the way a cinematographer treats a new lens: something to master, not a shortcut.",
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

  // TODO: your handles
  socials: [
    { label: "Instagram", handle: "@yourhandle", href: "https://www.instagram.com/yourhandle" },
    { label: "X", handle: "@yourhandle", href: "https://x.com/yourhandle" },
    { label: "YouTube", handle: "@yourhandle", href: "https://www.youtube.com/@yourhandle" },
    { label: "TikTok", handle: "@yourhandle", href: "https://www.tiktok.com/@yourhandle" },
    { label: "LinkedIn", handle: "in/yourhandle", href: "https://www.linkedin.com/in/yourhandle" },
  ] as Social[],
};

export type Site = typeof site;

export const categoryLabel = (id: ServiceId) =>
  site.work.categories.find((c) => c.id === id)?.label ?? id;
