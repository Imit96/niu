import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

const GUIDES_DATA: Record<string, { title: string; subtitle: string; description: string; steps: string[]; image: string }> = {
  "the-cleansing-ritual": {
    title: "The Cleansing Method",
    subtitle: "A Purifying Foundation",
    description: "Cleansing should never mean stripping. This method focuses on clarifying the scalp and removing atmospheric build-up while actively honoring the hair's delicate lipid barrier and microbiome. By utilizing mineral-rich Earth clays and gentle botanicals, we reset the foundation for healthy growth.",
    steps: [
      "Prepare the scalp with a clarifying pre-wash if experiencing heavy build-up.",
      "Massage the designated Cleansing product directly into the roots, allowing the natural saponins to lift impurities.",
      "Rinse thoroughly with lukewarm water until the water runs completely clear."
    ],
    image: "/ritual-cleanse-hero.jpg"
  },
  "the-hydration-ritual": {
    title: "The Hydration Method",
    subtitle: "Deep, Enduring Moisture",
    description: "Moisture must be layered to be retained. This method provides parched, thirsty strands with intense, long-lasting hydration by driving humectants deep into the cuticle and sealing them with resilient desert oils.",
    steps: [
      "Mist hair lightly with a hydrating essence or water to open the cuticle.",
      "Apply the Hydration product section by section, ensuring even distribution from mid-lengths to ends.",
      "Seal the moisture in using a few drops of our sealing oil."
    ],
    image: "/ritual-hydrate-hero.jpg"
  },
  "the-restoration-ritual": {
    title: "The Restoration Method",
    subtitle: "Strength & Structural Repair",
    description: "For hair that has been compromised by environment, manipulation, or styling. This method rebuilds structural integrity from the inside out, utilizing potent plant proteins and adaptogenic botanicals to mend the cuticle and prevent future breakage.",
    steps: [
      "Apply the Restoration mask to freshly cleansed, damp hair.",
      "Use gentle heat (like a warm towel) to allow the ingredients to penetrate deeply for 15-20 minutes.",
      "Rinse with cool water to snap the cuticle shut and lock in the strengthening agents."
    ],
    image: "/ritual-restore-hero.jpg"
  },
  "the-olfactory-regimen": {
    title: "The Olfactory Regimen",
    subtitle: "Scent as Architecture",
    description: "We view scent not simply as a fragrance, but as an atmospheric shift. The Olfactory Regimen features concentrated fragrance oils designed specifically for the unique structure of hair, interacting with your personal chemistry to create a signature aura.",
    steps: [
      "Dispense 1-2 drops of the Olfactory oil into the palms of your hands.",
      "Rub palms together to gently warm the oils and activate the botanical notes.",
      "Smooth lightly over finished, styled hair, focusing on the ends and mid-lengths."
    ],
    image: "/ritual-scent-hero.jpg"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = GUIDES_DATA[resolvedParams.slug];
  if (!data) return { title: "Guide Not Found | ORIGONÆ" };

  return {
    title: `${data.title} | ORIGONÆ`,
    description: data.description.substring(0, 160),
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const guideSlug = resolvedParams.slug;
  const guideData = GUIDES_DATA[guideSlug];

  if (!guideData) {
    notFound();
  }

  // Fetch all products that belong to this guide category
  const products = await prisma.product.findMany({
    where: { ritualName: guideData.title },
    include: { variants: { orderBy: { priceInCents: 'asc' } } }
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-earth">
        <div className="absolute inset-0 bg-ink/40 z-10 mix-blend-multiply" />
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-6 pt-20">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-bronze uppercase">The Guide</h2>
          <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-widest leading-tight">
            {guideData.title}
          </h1>
          <p className="text-lg md:text-xl text-cream/90 font-light max-w-2xl tracking-wide italic">
            {guideData.subtitle}
          </p>
        </div>
      </section>

      {/* Philosophy & Steps */}
      <section className="py-24 px-6 max-w-[1000px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-4">The Philosophy</h3>
            <p className="text-earth/80 leading-relaxed text-lg">
              {guideData.description}
            </p>
          </div>
          <div className="space-y-8 bg-cream/50 p-8 border border-earth/10">
            <h3 className="text-2xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-4">The Process</h3>
            <ul className="space-y-6">
              {guideData.steps.map((step, idx) => (
                <li key={idx} className="flex space-x-4">
                  <span className="text-bronze font-serif text-xl italic mt-1">0{idx + 1}.</span>
                  <span className="text-earth/80 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Associated Products */}
      <section className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h3 className="text-3xl font-serif uppercase tracking-widest">Guide Essentials</h3>
             <p className="text-cream/70 font-light">The foundational formulations for {guideData.title.toLowerCase()}.</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-cream/50">
              <p>Products for this guide are currently being curated. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => {
                const primaryVariant = product.variants[0];
                return (
                  <Link href={`/shop/${product.slug}`} key={product.id} className="group flex flex-col space-y-4 border border-cream/10 p-4 hover:border-cream/30 transition-colors bg-ink/20">
                    <div className="relative aspect-square overflow-hidden bg-stone/10 border border-ash/10">
                      {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-cream/30 uppercase tracking-widest font-serif text-xs px-4 text-center">
                          Product Image
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex-grow">
                      <p className="text-[10px] font-semibold text-bronze uppercase tracking-wider">{product.ritualName || "General"}</p>
                      <h4 className="text-lg font-serif text-cream">{product.name}</h4>
                      <p className="text-xs text-cream/60 line-clamp-2">{product.functionalTitle}</p>
                    </div>
                    <div className="pt-2 border-t border-cream/10 flex justify-between items-center text-sm">
                      <span className="text-cream font-medium">
                        {primaryVariant ? `₦ ${(primaryVariant.priceInCents / 100).toLocaleString()}` : 'Sold Out'}
                      </span>
                      <span className="text-bronze text-xs tracking-widest hover:text-cream transition-colors">View Product &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
