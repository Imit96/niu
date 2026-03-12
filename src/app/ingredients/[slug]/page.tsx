import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AddToCartButton from "@/app/shop/[id]/AddToCartButton";

const INGREDIENTS_DATA: Record<string, { 
  name: string; 
  category: string; 
  origin: string; 
  benefits: string[]; 
  description: string; 
  image: string;
}> = {
  "african-black-soap": {
    name: "African Black Soap (Alata Samina)",
    category: "Cleansers",
    origin: "West Africa (Ghana & Nigeria)",
    benefits: ["Natural saponins", "Gentle exfoliation", "Sebum regulation"],
    description: "Traditionally made from the ash of harvested plants like plantain skins, palm tree leaves, and cocoa pods, African Black Soap is a foundational marvel. It provides intense cleansing without the harsh action of synthetic surfactants. Its naturally rough texture is often smoothed down in modern formulations to provide powerful yet delicate clarification for the hair and scalp.",
    image: "/ingredient-abs.jpg"
  },
  "baobab-oil": {
    name: "Baobab Oil",
    category: "Oils & Emollients",
    origin: "Savannahs of Africa",
    benefits: ["Rich in Omegas 3, 6, 9", "High Vitamin C content", "Intense elasticity repair"],
    description: "Sourced from the iconic \"Tree of Life\", Baobab oil is deeply restorative. It sinks quickly into the hair shaft, providing incredible slip and combating brittleness. Because desert environments require the Baobab tree to store vast amounts of water, its oil is uniquely engineered to lock in deep hydration.",
    image: "/ingredient-baobab.jpg"
  },
  "chebe-powder": {
    name: "Chebe Powder",
    category: "Botanicals & Powders",
    origin: "Chad (Basara Arab territory)",
    benefits: ["Length retention", "Cuticle reinforcement", "Prevents severe breakage"],
    description: "Used by the women of Chad to grow famously long natural hair, Chebe powder is an earthy mixture of cherry seeds, cloves, and woven resins. Because it physically reinforces the hair shaft, it practically eliminates friction-induced breakage. We extract the strongest properties of Chebe to formulate strengtheners that honor this time-tested method.",
    image: "/ingredient-chebe.jpg"
  },
  "kalahari-melon-seed": {
    name: "Kalahari Melon Seed",
    category: "Oils & Emollients",
    origin: "Kalahari Desert, Southern Africa",
    benefits: ["Ultra-lightweight", "Non-comedogenic", "Dissolves sebum build-up"],
    description: "A highly resilient desert botanical. Kalahari Melon Seed oil is incredibly lightweight but intensely hydrating. Because it thrives in extreme drought conditions, it has adapted to hold unparalleled linoleic acid. It moisturizes the hair without weighing it down, making it perfect for fine textures or easily overloaded scalps.",
    image: "/ingredient-kalahari.jpg"
  },
  "rhassoul-clay": {
    name: "Rhassoul Clay",
    category: "Clays & Minerals",
    origin: "Atlas Mountains, Morocco",
    benefits: ["Negative ionic charge", "Draws out heavy metals", "Improves curl definition"],
    description: "Mined deep within the Atlas Mountains, Rhassoul (or Ghassoul) clay works on the principle of ionic exchange. Its strong negative charge acts like a magnet for positively charged toxins, heavy metals, and product build-up in the hair. Yet, unlike bentonite, it leaves the natural lipid barrier intact, resulting in unmatched curl definition and softness.",
    image: "/ingredient-rhassoul.jpg"
  },
  "shea-butter": {
    name: "Shea Butter (Unrefined)",
    category: "Butters & Waxes",
    origin: "West African Savannah Belt",
    benefits: ["Thick protective barrier", "Vitamins A & E", "Locks in hydration tightly"],
    description: "A foundational sealant in African beauty regimens. Unrefined Shea butter provides a thick, protective barrier against elemental stress. When whipped or emulsified into our regimens, it seals water deep into the hair shaft, preventing the rapid moisture loss that often plods tightly coiled textures.",
    image: "/ingredient-shea.jpg"
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = INGREDIENTS_DATA[resolvedParams.slug];
  if (!data) return { title: "Ingredient Not Found | ORIGONÆ" };
  
  return {
    title: `${data.name} | ORIGONÆ Glossary`,
    description: data.description.substring(0, 160),
  };
}

export default async function IngredientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const ingredientSlug = resolvedParams.slug;
  const ingredientData = INGREDIENTS_DATA[ingredientSlug];

  if (!ingredientData) {
    notFound();
  }

  // Find products that contain this ingredient physically or mention it
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { ingredientsText: { contains: ingredientData.name.split(" ")[0], mode: 'insensitive' } },
        { description: { contains: ingredientData.name.split(" ")[0], mode: 'insensitive' } }
      ]
    },
    include: { variants: { orderBy: { priceInCents: 'asc' } } }
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Editorial Header */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-earth">
        <div className="absolute inset-0 bg-ink/30 z-10 mix-blend-multiply" />
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-4 pt-20">
          <span className="text-xs font-semibold tracking-[0.3em] text-bronze uppercase">
            {ingredientData.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-widest leading-tight">
            {ingredientData.name}
          </h1>
          <p className="text-sm md:text-base text-cream/70 tracking-[0.2em] uppercase font-light border-t border-cream/20 pt-4 mt-4">
            Origin: {ingredientData.origin}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Properties */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-cream/40 p-8 border border-earth/10">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-earth uppercase mb-6 border-b border-earth/10 pb-4">Functional Benefits</h3>
              <ul className="space-y-4">
                {ingredientData.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-earth/80 text-sm leading-relaxed">
                    <span className="text-bronze mt-1">✦</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
           </div>
           
           <div className="block">
              <Link href="/ingredients" className="inline-flex items-center text-xs tracking-widest uppercase text-earth hover:text-bronze transition-colors">
                &larr; Back to Glossary
              </Link>
           </div>
        </div>

        {/* Right Column: Narrative */}
        <div className="lg:col-span-8 space-y-12">
          <div className="prose prose-earth max-w-none">
            <h2 className="text-3xl font-serif text-earth mb-6">The Heritage</h2>
            <p className="text-lg text-earth/80 leading-relaxed font-light">
              {ingredientData.description}
            </p>
          </div>

          {/* Formulated In block */}
          <div className="pt-16 border-t border-earth/10">
            <h3 className="text-2xl font-serif text-earth mb-8">Formulated In</h3>
            
            {products.length === 0 ? (
              <p className="text-earth/60 italic font-light">This botanical is currently aging in our laboratory and will feature in an upcoming regimen.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-stone border border-ash/20">
                {products.map((product) => {
                  const primaryVariant = product.variants[0];
                  return (
                    <div key={product.id} className="group flex space-x-4 bg-cream p-4 border border-earth/5 hover:border-earth/20 transition-all">
                       <Link href={`/shop/${product.slug}`} className="relative w-20 h-24 bg-stone shrink-0 border border-ash/30 overflow-hidden">
                         {product.images?.[0] && product.images[0] !== "Product Image Placeholder" && (
                           <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                         )}
                       </Link>
                       <div className="flex flex-col justify-center flex-1">
                          <Link href={`/shop/${product.slug}`}>
                            <h4 className="text-sm font-serif text-earth group-hover:text-bronze transition-colors leading-tight mb-1">{product.name}</h4>
                            <p className="text-[10px] uppercase tracking-widest text-earth/60 line-clamp-1 mb-2">{product.ritualName || "Regimen"}</p>
                          </Link>
                          {primaryVariant && (
                            <AddToCartButton 
                              id={primaryVariant.id} 
                              productId={product.id}
                              slug={product.slug}
                              name={product.name}
                              priceInCents={primaryVariant.priceInCents}
                              size={primaryVariant.size || ""}
                              image={product.images[0] || ""}
                              inventoryCount={primaryVariant.inventoryCount}
                            />
                          )}
                       </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
