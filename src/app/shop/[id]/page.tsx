
import Link from "next/link";
import { getProductBySlug } from "../../actions/product";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) return { title: "Regimen Not Found" };
  return {
    title: `${product.name} | Originæ`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  
  if (!product) {
    notFound();
  }

  const primaryVariant = product.variants[0];
  const priceDisplay = primaryVariant 
    ? `₦ ${(primaryVariant.priceInCents / 100).toLocaleString()}` 
    : "Price Unavailable";

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* 1. Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-stone border border-ash/30 w-full">
            <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm">
               {product.images[0] || "Product Image Hero"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             {[1, 2, 3].map((img) => (
                <div key={img} className="relative aspect-square bg-stone border border-ash/30 cursor-pointer hover:border-bronze transition-colors flex items-center justify-center">
                   <span className="text-earth/20 text-xs">IMG {img}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Product Details & Add to Cart */}
        <div className="flex flex-col space-y-8 sticky top-32 h-fit">
          <div className="space-y-4 border-b border-earth/20 pb-8">
            <p className="text-xs font-semibold text-bronze uppercase tracking-widest">{product.ritualName || "Originæ Base"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-earth">{product.name}</h1>
            <p className="text-lg text-earth/70 font-light">{product.functionalTitle}</p>
            <p className="text-2xl text-earth font-medium pt-2">{priceDisplay}</p>
          </div>

          <div className="space-y-6">
            <p className="text-earth/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {product.description}
            </p>
            
            <div className="space-y-4 pt-4">
              {primaryVariant && (
                <p className="text-sm font-medium tracking-wide uppercase text-earth">Size: {primaryVariant.size || "Standard"}</p>
              )}
              {primaryVariant ? (
                <AddToCartButton 
                  id={primaryVariant.id} 
                  productId={product.id}
                  name={product.name}
                  priceInCents={primaryVariant.priceInCents}
                  size={primaryVariant.size || ""}
                  image={product.images[0] || ""}
                />
              ) : (
                <div className="p-4 bg-earth/5 text-earth text-center text-sm">Currently Unavailable</div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">Texture & Scent</h3>
              <p className="text-sm text-earth/80">Earthy, slightly gritty paste that transforms into a soft, non-foaming cream. Scented with vetiver and raw clay.</p>
            </div>
            <div className="space-y-2 pt-4">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">Cultural Inspiration</h3>
              <p className="text-sm text-earth/80 leading-relaxed">Inspired by the purifying regimens of the continent, where the earth itself is used to draw out impurities and ground the spirit.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Regimen Usage Guide */}
      <section className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">The Performance</h2>
            <p className="text-lg text-cream/80 leading-relaxed font-light whitespace-pre-wrap">
              {product.howToUse || "Massage into the scalp with intention."}
            </p>
          </div>
          <div className="w-full md:w-1/3 aspect-[3/4] bg-stone/10 border border-stone/20 relative">
             <div className="absolute inset-0 flex items-center justify-center text-cream/30 uppercase tracking-widest font-serif text-xs text-center p-4">
               Application<br/>Texture
             </div>
          </div>
        </div>
      </section>

      {/* 3. Ingredients */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-serif text-earth uppercase tracking-wide">Key Ingredients</h2>
          <p className="text-earth/80 leading-relaxed whitespace-pre-wrap">
            {product.ingredientsText || "Active botanicals and earthen clays."}
          </p>
          <Link href="/ingredients" className="inline-block pt-4">
             <button className="px-6 py-3 border border-earth text-earth hover:bg-earth hover:text-cream transition-colors text-sm uppercase tracking-widest font-semibold">
               View Complete Philosophy
             </button>
          </Link>
        </div>
      </section>

      {/* 4. Related Regimens */}
      <section className="py-24 px-6 bg-sand border-t border-earth/20">
         <div className="max-w-[1440px] mx-auto space-y-12">
           <h2 className="text-2xl md:text-3xl font-serif text-earth uppercase tracking-wide text-center">Complete The Regimen</h2>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Note: In a real app we'd fetch actual related products from DB */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] bg-stone border border-ash/30 group-hover:border-bronze transition-colors"></div>
                  <div className="space-y-1 text-center">
                    <h3 className="text-lg font-serif text-earth">Pairing Product {item}</h3>
                    <p className="text-earth/70 text-sm">₦ 20,000</p>
                  </div>
                </div>
              ))}
           </div>
         </div>
      </section>
    </div>
  );
}
