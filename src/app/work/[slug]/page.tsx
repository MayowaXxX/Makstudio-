import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GoldGlow } from "@/components/brand/GoldGlow";
import { ArrowIcon, ButtonLink } from "@/components/ui/Button";
import { ProjectVideo } from "@/components/ui/ProjectVideo";
import { Reveal, SplitReveal } from "@/components/ui/SplitReveal";
import { categoryLabel, site } from "@/content/site";
import { pad2 } from "@/lib/utils";

const getProject = (slug: string) => site.work.projects.find((p) => p.slug === slug);

export function generateStaticParams() {
  return site.work.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.studio}`,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: [{ url: project.thumbnail, alt: project.title }],
    },
  };
}

// The shell stays URL-independent; project content (which reads `params`) streams in behind Suspense.
export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

function ProjectSkeleton() {
  return (
    <div className="container-luxe pb-14 pt-36 md:pt-48" aria-busy="true">
      <div className="h-3 w-24 bg-line" />
      <div className="mt-16 h-16 w-2/3 bg-surface md:h-28" />
      <div className="mt-14 aspect-video w-full border border-line bg-ink-deep" />
    </div>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const all = site.work.projects;
  const idx = all.indexOf(project);
  const next = all[(idx + 1) % all.length];

  const meta = [
    { label: "Client", value: project.client },
    { label: "Discipline", value: categoryLabel(project.category) },
    { label: "Year", value: String(project.year) },
    ...(project.tools.length ? [{ label: "Tools", value: project.tools.join(", ") }] : [{ label: "Studio", value: site.studio }]),
  ];

  // Chapters render only when their content exists in site.ts
  const chapters = [
    project.brief && { title: "The brief", body: <p>{project.brief}</p> },
    project.concept && { title: "The concept", body: <p>{project.concept}</p> },
    project.process?.length && {
      title: "The process",
      body: (
        <ol className="space-y-4">
          {project.process.map((step, i) => (
            <li key={step} className="flex gap-5">
              <span className="pt-1 font-display text-xs tracking-[0.2em] text-gold">{pad2(i + 1)}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ),
    },
  ].filter(Boolean) as { title: string; body: React.ReactNode }[];

  return (
    <article className="relative overflow-hidden">
      <GoldGlow className="-right-1/4 -top-1/4 h-[70vw] w-[70vw]" />
      <header className="container-luxe pb-14 pt-36 md:pb-20 md:pt-48">
        <Link href="/#work" className="group inline-flex items-center gap-3 font-display text-[0.68rem] uppercase tracking-[0.28em] text-champagne/75 transition-colors hover:text-gold-light">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          All work
        </Link>
        <p className="eyebrow mt-12">
          {pad2(idx + 1)} — {categoryLabel(project.category)} · {project.year}
        </p>
        <SplitReveal
          as="h1"
          text={project.title}
          className="display mt-6 text-[clamp(2.8rem,9vw,9rem)]"
          wordClassName="text-gold-gradient"
          stagger={0.08}
        />
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-2xl font-serif text-[clamp(1.3rem,2vw,1.8rem)] italic leading-snug text-champagne">{project.summary}</p>
        </Reveal>
      </header>

      <div className="container-luxe">
        <Reveal>
          <ProjectVideo src={project.video} poster={project.thumbnail} title={project.title} vertical={project.aspect === "9:16"} />
        </Reveal>

        <dl className="mt-px grid grid-cols-2 gap-px border-x border-b border-line bg-line md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="bg-ink p-5 md:p-7">
              <dt className="font-display text-[0.62rem] uppercase tracking-[0.25em] text-gold">{m.label}</dt>
              <dd className="mt-2 text-sm text-champagne/90">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mx-auto max-w-5xl py-24 md:py-36">
          {chapters.map((c, i) => (
            <Reveal key={c.title} className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
              <h2 className="md:col-span-4">
                <span className="block font-display text-xs tracking-[0.2em] text-gold/80">({pad2(i + 1)})</span>
                <span className="mt-3 block font-display text-2xl font-light uppercase tracking-[0.08em] text-gold-light md:text-3xl">{c.title}</span>
              </h2>
              <div className="text-lg leading-relaxed text-secondary md:col-span-8">{c.body}</div>
            </Reveal>
          ))}
          <Reveal className="grid gap-6 border-y border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 className="md:col-span-4">
              <span className="block font-display text-xs tracking-[0.2em] text-gold/80">({pad2(chapters.length + 1)})</span>
              <span className="mt-3 block font-display text-2xl font-light uppercase tracking-[0.08em] text-gold-light md:text-3xl">Credits</span>
            </h2>
            <dl className="md:col-span-8">
              {project.credits.map((c) => (
                <div key={c.role} className="flex justify-between gap-6 border-b border-line py-4 last:border-0">
                  <dt className="text-champagne/75">{c.role}</dt>
                  <dd className="text-right text-champagne">{c.name}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="mt-14 flex flex-wrap gap-4">
            <ButtonLink href="/#contact">
              Start a similar project <ArrowIcon />
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      {/* Next project */}
      <Link href={`/work/${next.slug}`} prefetch data-cursor="view" className="group relative block overflow-hidden border-t border-line">
        <Image src={next.thumbnail} alt="" fill sizes="100vw" className="object-cover opacity-35 transition-all duration-[1.6s] ease-luxe group-hover:scale-105 group-hover:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
        <div className="container-luxe relative py-24 md:py-36">
          <p className="eyebrow">Next project</p>
          <p className="display mt-6 text-[clamp(2.4rem,7vw,7rem)] text-gold-gradient">{next.title}</p>
          <p className="mt-4 text-secondary">
            {categoryLabel(next.category)} · {next.year}
          </p>
        </div>
      </Link>
    </article>
  );
}
