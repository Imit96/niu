import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const metadata = {
  title: "Ingredient Philosophy | Originæ",
  description: "Explore the potent botanical science and ancestral ingredients powering Originæ's luxury regimens.",
};

const INGREDIENTS = [
  {
    name: "Kalahari Melon Seed Oil",
    context: "Sourced from the sun-drenched sands of Southern Africa, used for generations to protect against harsh conditions.",
    role: "Deep, lightweight hydration without greasiness.",
    description: "An incredibly potent botanical oil rich in linoleic acid. It restores the scalp's barrier function and infuses the hair shaft with essential lipids, leaving it supple and resilient.",
  },
  {
    name: "Rhassoul Clay",
    context: "Mined deep beneath the Atlas Mountains, this rare clay has been a staple in North African hammam rituals for centuries.",
    role: "Purifying detoxification and mineral restoration.",
    description: "Unlike stripping sulfates, this saponiferous earth works via ion exchange—drawing out impurities and buildup while simultaneously depositing fortifying silica and magnesium into the hair.",
  },
  {
    name: "African Black Soap Extract",
    context: "Crafted through an ancient West African roasting process using plantain skins, cocoa pods, and palm leaves.",
    role: "Gentle clarification and scalp soothing.",
    description: "We distill the raw power of traditional black soap into a refined extract. It breaks down environmental pollutants while offering natural antibacterial properties to soothe scalp irritation.",
  },
  {
    name: "Baobab",
    context: "Known as the 'Tree of Life', capable of storing vital water during intense droughts.",
    role: "Intensive repair and environmental protection.",
    description: "Packed with vitamins A, D, E, and F, our cold-pressed Baobab extract delivers a surge of antioxidants to protect hair from structural damage and reverse signs of stress.",
  }
];

export default function IngredientsPage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      {/* Header */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <p className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase mb-6">The Raw Materials</p>
        <h1 className="text-4xl md:text-6xl font-serif text-earth uppercase tracking-widest leading-tight mb-8">
          Formulated Without Compromise.
        </h1>
        <p className="text-lg text-earth/80 leading-loose font-light">
          We do not believe in filler ingredients. Every drop, every gram in our collection serves a precise structural or sensory purpose. We bridge the gap between ancient botanical wisdom and modern cosmetic chemistry.
        </p>
      </section>

      {/* Roster */}
      <section className="py-16 px-6 bg-sand border-y border-earth/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-earth/10">
            {INGREDIENTS.map((ingredient) => (
              <div key={ingredient.name} className="bg-cream p-8 md:p-12 flex flex-col h-full hover:bg-stone transition-colors group">
                <h3 className="text-2xl font-serif text-earth mb-2">{ingredient.name}</h3>
                <p className="text-xs font-semibold tracking-widest text-bronze uppercase mb-6">{ingredient.role}</p>
                
                <div className="space-y-6 flex-grow">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-earth/40 mb-1">Origin</p>
                    <p className="text-sm text-earth/80 leading-relaxed font-light">{ingredient.context}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-earth/40 mb-1">Formulation Profile</p>
                    <p className="text-sm text-earth/80 leading-relaxed font-light">{ingredient.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No List */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-serif text-earth uppercase tracking-widest">What We Leave Out</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="p-6 border border-earth/10">
               <span className="text-earth uppercase tracking-widest font-semibold text-sm">0% Sulfates</span>
             </div>
             <div className="p-6 border border-earth/10">
               <span className="text-earth uppercase tracking-widest font-semibold text-sm">0% Parabens</span>
             </div>
             <div className="p-6 border border-earth/10">
               <span className="text-earth uppercase tracking-widest font-semibold text-sm">0% Silicones</span>
             </div>
             <div className="p-6 border border-earth/10">
               <span className="text-earth uppercase tracking-widest font-semibold text-sm">Cruelty Free</span>
             </div>
          </div>
          <div className="pt-8">
             <Link href="/shop">
               <Button size="lg">Experience the Regimens</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
