import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { SoundMadeVisible } from "@/components/sections/SoundMadeVisible";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Work />
      <SoundMadeVisible />
      <Services />
      <Process />
      <Stats />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}
