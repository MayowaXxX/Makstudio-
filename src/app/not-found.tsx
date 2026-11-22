import { MakLogo } from "@/components/brand/MakLogo";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[80svh] flex-col items-center justify-center pt-24 text-center">
      <MakLogo mode="draw" strokeWidth={3} className="w-40 opacity-80" />
      <h1 className="display mt-12 text-[clamp(2.2rem,6vw,5rem)] text-gold-gradient">
        Lost in the <span className="accent lowercase">reel</span>
      </h1>
      <p className="mt-6 max-w-md text-secondary">This frame doesn&apos;t exist (yet). Let&apos;s get you back to the work.</p>
      <div className="mt-10">
        <ButtonLink href="/">Back home</ButtonLink>
      </div>
    </section>
  );
}
