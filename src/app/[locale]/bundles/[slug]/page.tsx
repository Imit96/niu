import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AddBundleToCartButton from "./AddBundleToCartButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const bundle = await prisma.ritualBundle.findUnique({
    where: { slug: resolvedParams.slug },
  });
  
  if (!bundle) return { title: "Bundle Not Found | ORIGONÆ" };
  
  return {
    title: `${bundle.name} | ORIGONÆ`,
    description: bundle.description.substring(0, 160),
  };
}

export default async function BundleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const bundle = await prisma.ritualBundle.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        include: {
          variants: true
        }
      }
    }
  });

  if (!bundle) {
    notFound();
  }

  // Calculate retail value vs bundle price
  const retailValueInCents = bundle.products.reduce((acc, product) => {
     return acc + (product.variants[0]?.priceInCents || 0);
  }, 0);

  const discountAmount = retailValueInCents - bundle.priceInCents;
  const discountPct = retailValueInCents > 0 ? Math.round((discountAmount / retailValueInCents) * 100) : 0;

  const firstImage = bundle.products.find(p => p.images?.[0])?.images[0];

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row pt-24 min-h-[90vh]">
        {/* Left Side - Bundle Imagery */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 lg:sticky lg:top-0 h-fit">
          <div className="relative aspect-[4/5] bg-stone border border-earth/10 flex items-center justify-center p-12 overflow-hidden shadow-inner">
             {firstImage ? (
               <div className="relative w-full h-full">
                 <Image 
                   src={firstImage} 
                   alt={bundle.name} 
                   fill 
                   className="object-cover object-center translate-x-4 translate-y-4 scale-105 opacity-80 z-0" 
                 />
                 <Image 
                   src={bundle.products.find(p => p.images?.[1] || p.images?.[0])?.images[0] || firstImage} 
                   alt={bundle.name + ' context'} 
                   fill 
                   className="object-cover object-center -translate-x-8 -translate-y-8 z-10 shadow-2xl" 
                 />
               </div>
             ) : (
               <div className="text-center text-earth/30 uppercase tracking-[0.3em] font-serif text-sm px-8 leading-loose">
                 Bundle Visualization
               </div>
             )}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col justify-center">
          <div className="space-y-6 max-w-xl">
             <div className="flex items-center space-x-4">
               <span className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Curated Collection</span>
               {discountPct > 0 && (
                 <span className="bg-earth text-cream text-[10px] px-2 py-1 uppercase tracking-widest">Sets Save {discountPct}%</span>
               )}
             </div>
             
             <h1 className="text-4xl lg:text-5xl font-serif text-earth leading-tight">{bundle.name}</h1>
             
             <div className="flex items-end space-x-3 pt-2">
                 <PriceDisplay className="text-3xl font-medium text-earth" amountInCents={bundle.priceInCents} />
                 <span className="text-sm text-earth/50 line-through pb-1">Value <PriceDisplay amountInCents={retailValueInCents} /></span>
             </div>

             <p className="text-earth/80 text-lg leading-relaxed border-t border-earth/10 pt-6 mt-6">
               {bundle.description}
             </p>

             <div className="pt-8 space-y-6">
                <h3 className="text-sm border-b border-earth/20 pb-2 uppercase tracking-widest text-earth/80">The Regimen Includes</h3>
                
                <div className="space-y-4">
                  {bundle.products.map(product => (
                    <Link href={`/shop/${product.slug}`} key={product.id} className="group flex items-center p-4 bg-cream/40 border border-earth/10 hover:bg-cream transition-colors">
                      <div className="relative w-16 h-20 bg-stone shrink-0 border border-ash/30">
                         {product.images?.[0] && product.images[0] !== "Product Image Placeholder" && (
                           <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                         )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-serif text-earth text-lg group-hover:text-bronze transition-colors">{product.name}</h4>
                        <p className="text-xs text-earth/60 uppercase tracking-widest">{product.functionalTitle}</p>
                      </div>
                      <div className="text-right pl-4">
                        <p className="text-sm text-earth font-medium"><PriceDisplay amountInCents={product.variants[0]?.priceInCents || 0} /></p>
                        <p className="text-[10px] text-earth/40 uppercase tracking-widest">{product.variants[0]?.size}</p>
                      </div>
                    </Link>
                  ))}
                </div>
             </div>

             <div className="pt-12">
               {/* Client Component to handle adding all variants to cart */}
               <AddBundleToCartButton bundle={bundle} />
               <p className="text-center text-[10px] text-earth/50 mt-4 uppercase tracking-widest">
                 Note: Bundle pricing applies when added as a complete set.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
