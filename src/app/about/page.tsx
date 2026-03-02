
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "About Originæ | Heritage & Craftsmanship",
  description: "Discover the founding story, heritage, and philosophy behind Originæ's luxury regimen haircare.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-sand">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-earth overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1512495039889-52a3b799c9bc?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase mb-4">Our Origin</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-cream uppercase tracking-wide leading-tight mb-6">
            Ancestral Energy, <br className="hidden md:block"/> Refined.
          </h1>
        </div>
      </section>

      {/* 1. Founding Story */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest leading-tight">
              The Genesis of a New Tradition.
            </h2>
            <div className="space-y-6 text-earth/80 leading-loose text-lg font-light">
              <p>
                Originæ was born from a desire to elevate haircare beyond utility, transforming it into a sacred, intentional practice. We looked back to move forward, inspired by the ancient beauty rituals of the African continent—from the Atlas Mountains to the coasts of West Africa.
              </p>
              <p>
                Our founders recognized a void in the luxury space: a lack of true, culturally-rooted reverence for textured hair. Originæ is our answer. A line of prestige formulations that honor the specific needs of natural textures while delivering an uncompromising, sensory-rich experience.
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-stone">
              <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">Founding Story</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Heritage Section */}
      <section className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest">Grounded in Culture.</h2>
          <p className="text-lg text-cream/80 leading-loose font-light">
            We do not borrow; we inherit and elevate. Every product within the Originæ collection is a tribute to raw, indigenous ingredients that have been used for centuries. We source our clays, oils, and botanicals with deep respect for the land and the people who cultivate them, ensuring our formulations remain authentic to their source.
          </p>
        </div>
      </section>

      {/* 3. Craft & Formulation */}
      <section className="py-24 px-6 text-center lg:text-left">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-stone">
              <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">Craftsmanship</div>
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-xs font-semibold tracking-widest text-bronze uppercase">The Formulation Rule</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest leading-tight">
              Uncompromising Precision.
            </h2>
            <div className="space-y-6 text-earth/80 leading-loose text-lg font-light">
              <p>
                We believe that true luxury lies in the details. Our formulations are the result of years of rigorous research and development. We blend modern botanical science with heritage ingredients, subjecting every batch to intense quality control.
              </p>
              <p>
                There are no fillers, no artificial masking, and no unnecessary additions. Only potent, active ingredients designed to perform at the highest level.
              </p>
            </div>
            <Link href="/ingredients" className="inline-block mt-4 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
              Explore Our Ingredients
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Sustainability & Vision */}
      <section className="py-24 px-6 bg-stone">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-cream p-12 lg:p-16 border border-earth/10">
            <h3 className="text-2xl font-serif text-earth uppercase tracking-wide mb-6">Ethical Footprint</h3>
            <p className="text-earth/80 leading-relaxed font-light">
              Our commitment to the earth is absolute. We employ sustainable sourcing practices, focusing on ethical production and fair trade partnerships across the continent. Our packaging is intentionally minimalist, utilizing recyclable glass, aluminum, and post-consumer recycled materials wherever possible. We are continually refining our supply chain to reduce our environmental impact.
            </p>
          </div>
          <div className="bg-earth text-cream p-12 lg:p-16">
            <h3 className="text-2xl font-serif uppercase tracking-wide mb-6">The Future</h3>
            <p className="text-cream/80 leading-relaxed font-light mb-8">
              Originæ is building a global community. Our mission is to redefine luxury haircare on an international scale, establishing a new standard for how textured hair is treated, presented, and understood. We are expanding our reach, partnering with prestige salons worldwide to bring the regimen to you.
            </p>
            <Link href="/salon">
              <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">
                Discover Salon Partnerships
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
