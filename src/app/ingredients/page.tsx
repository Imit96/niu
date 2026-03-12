import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Ingredient Glossary | ORIGONÆ",
  description: "An A-Z guide of the foundational botanicals and raw earth elements that power our regimens.",
};

const INGREDIENTS = [
  {
    name: "African Black Soap (Alata Samina)",
    slug: "african-black-soap",
    category: "Cleansers",
    description: "A traditional West African purifying agent made from the ash of locally harvested plants.",
  },
  {
    name: "Baobab Oil",
    slug: "baobab-oil",
    category: "Oils & Emollients",
    description: "Extracted from the \"Tree of Life\", this oil is rich in Omegas 3, 6, and 9 for deep cellular restoration.",
  },
  {
    name: "Chebe Powder",
    slug: "chebe-powder",
    category: "Botanicals & Powders",
    description: "A time-honored Chadian mixture used for generations to protect the hair shaft from breakage and retain extreme length.",
  },
  {
    name: "Kalahari Melon Seed",
    slug: "kalahari-melon-seed",
    category: "Oils & Emollients",
    description: "A highly resilient desert oil providing intense, lightweight hydration without weighing strands down.",
  },
  {
    name: "Rhassoul Clay",
    slug: "rhassoul-clay",
    category: "Clays & Minerals",
    description: "Mined deep within the Atlas Mountains, this volcanic clay draws out impurities while leaving the lipid barrier intact.",
  },
  {
    name: "Shea Butter (Unrefined)",
    slug: "shea-butter",
    category: "Butters & Waxes",
    description: "A foundational sealant packed with vitamins A and E, providing a thick protective barrier against elemental stress.",
  }
];

export default function IngredientsIndexPage() {
  // Group ingredients by letter
  const grouped = INGREDIENTS.reduce((acc, ingredient) => {
    const letter = ingredient.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(ingredient);
    return acc;
  }, {} as Record<string, typeof INGREDIENTS>);

  const letters = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand rounded-xl overflow-hidden">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 bg-earth text-cream text-center">
        <h2 className="text-sm font-semibold tracking-[0.3em] text-bronze uppercase mb-4">The Glossary</h2>
        <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6">Ingredient Heritage</h1>
        <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light">
          We source directly from the earth, focusing on materials revered for centuries. 
          Explore the functional power and cultural resonance behind each element in our regimens.
        </p>
      </section>

      {/* A-Z Index Nav */}
      <section className="sticky top-20 z-30 bg-sand/90 backdrop-blur-md border-b border-earth/10 py-4 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-2 md:gap-4">
          {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => {
            const hasIngredients = letters.includes(letter);
            return (
              <Link 
                key={letter} 
                href={hasIngredients ? `#letter-${letter}` : "#"}
                className={`w-8 h-8 flex items-center justify-center font-serif text-lg transition-colors
                  ${hasIngredients 
                    ? 'text-earth hover:text-bronze hover:bg-earth/5' 
                    : 'text-earth/20 cursor-default pointer-events-none'
                  }`}
              >
                {letter}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Glossary List */}
      <section className="py-16 px-6 max-w-[1000px] mx-auto w-full min-h-[50vh]">
        <div className="space-y-16">
          {letters.map((letter) => (
            <div key={letter} id={`letter-${letter}`} className="scroll-mt-40 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
              <div className="hidden md:block">
                <h2 className="text-6xl font-serif text-earth/20 sticky top-40">{letter}</h2>
              </div>
              <div className="space-y-8">
                {grouped[letter].map((ingredient) => (
                  <div key={ingredient.slug} className="group border-b border-earth/10 pb-8 last:border-b-0">
                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-bronze">{ingredient.category}</span>
                    <Link href={`/ingredients/${ingredient.slug}`} className="block mt-2">
                       <h3 className="text-2xl font-serif text-earth group-hover:text-bronze transition-colors">{ingredient.name}</h3>
                    </Link>
                    <p className="text-earth/80 mt-3 leading-relaxed max-w-2xl">
                      {ingredient.description}
                    </p>
                    <Link href={`/ingredients/${ingredient.slug}`} className="inline-block mt-4 text-xs tracking-widest uppercase text-earth/60 group-hover:text-earth transition-colors">
                      Discover the origins &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 px-6 bg-stone text-center border-t border-earth/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-earth">Uncompromising Purity</h2>
          <p className="text-earth/70">Our formulas are painstakingly developed without synthetic fillers, artificial fragrances, or harsh sulfates.</p>
          <Link href="/shop" className="inline-block mt-4">
            <Button>Shop All Regimens</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
