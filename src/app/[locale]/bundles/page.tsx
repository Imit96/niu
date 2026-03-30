import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export const metadata = {
  title: "Ritual Bundles | ORIGONÆ",
  description: "Curated collections of our finest regimens at exclusive values.",
};

export default async function BundlesIndexPage() {
  const bundles = await prisma.ritualBundle.findMany({
    include: {
      products: {
        include: {
          variants: true
        }
      }
    }
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Intro */}
      <section className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6 border-b border-cream/20 pb-6 inline-block">The Bundles</h1>
        <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light mt-4">
          Complete, holistic regimens curated for transformative results. Offered at an exclusive value to honor your commitment to foundational beauty.
        </p>
      </section>

      {/* Grid */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full">
        {bundles.length === 0 ? (
           <div className="text-center py-24 text-earth/60 font-serif text-lg border border-earth/10">
              New bundles are currently being curated for the season.
           </div>
        ) : (
          <div className="flex flex-col space-y-24">
            {bundles.map((bundle, idx) => {
              const isEven = idx % 2 === 0;
              // Sum up individual retail prices for comparison
              const retailValue = bundle.products.reduce((acc, product) => {
                 return acc + (product.variants[0]?.priceInCents || 0);
              }, 0);

              const firstImage = bundle.products.find(p => p.images?.[0])?.images[0];

              return (
                <div key={bundle.slug} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                  <Link href={`/bundles/${bundle.slug}`} className="w-full md:w-1/2">
                    <div className="relative aspect-square bg-stone border border-earth/10 p-8 flex items-center justify-center">
                       {/* Abstract representation of a bundle if no dedicated image exists */}
                       {firstImage ? (
                         <div className="relative w-3/4 h-3/4 hover:scale-105 transition-transform duration-700">
                           <Image src={firstImage} alt={bundle.name} fill className="object-cover shadow-2xl" />
                           <div className="absolute inset-x-8 -bottom-8 h-full bg-cream/10 backdrop-blur-sm -z-10 translate-x-4 mix-blend-multiply" />
                         </div>
                       ) : (
                         <div className="text-center text-earth/30 uppercase tracking-[0.3em] font-serif text-sm px-8 leading-loose">
                           Original {bundle.name}
                         </div>
                       )}
                    </div>
                  </Link>
                  <div className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
                    <h2 className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Exclusive Assembly</h2>
                    <h3 className="text-3xl lg:text-5xl font-serif text-earth leading-tight">{bundle.name}</h3>
                    <p className="text-earth/80 text-lg leading-relaxed max-w-md">
                      {bundle.description}
                    </p>
                    
                    <div className="space-y-4 pt-4 border-t border-earth/10 border-b pb-8">
                       <h4 className="text-xs uppercase tracking-widest text-earth/60 font-semibold mb-4">Includes ({bundle.products.length} Regimens):</h4>
                       <ul className="space-y-2">
                         {bundle.products.map(product => (
                           <li key={product.id} className="text-sm font-serif text-earth flex items-center space-x-2">
                             <span className="text-bronze text-[10px]">✦</span>
                             <span>{product.name}</span>
                             <span className="text-earth/40 text-xs tracking-widest line-clamp-1 truncate">- {product.functionalTitle}</span>
                           </li>
                         ))}
                       </ul>
                    </div>

                    <div className="flex items-end space-x-4 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-earth/50 line-through pr-2">Retail Value <PriceDisplay amountInCents={retailValue} /></span>
                        <PriceDisplay className="text-2xl font-medium text-earth" amountInCents={bundle.priceInCents} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/bundles/${bundle.slug}`}>
                        <Button className="w-full sm:w-auto bg-earth text-cream hover:bg-earth/90">
                          View Bundle Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
