import Link from "next/link";
import { getPublicProducts } from "../actions/product";
import ShopFilters from "./ShopFilters";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop All Regimens | Originæ",
  description: "Discover our full collection of intentional, heritage-rooted formulations.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const products = await getPublicProducts();
  
  const activeRitual = typeof searchParams.ritual === "string" ? searchParams.ritual : "All";
  const activeTexture = typeof searchParams.texture === "string" ? searchParams.texture : "All";

  // Simple server-side filtration
  const filteredProducts = products.filter((product) => {
    if (activeRitual !== "All" && product.ritualName !== activeRitual) return false;
    // We don't have a strict 'texture' concept on the real schema yet but we could filter by size/type if needed
    // Setting up the framework for it regardless.
    return true; 
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Intro */}
      <section className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-widest mb-6">All Regimens</h1>
        <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light">
          Discover our full collection of intentional, heritage-rooted formulations. Designed to restore, protect, and honor your natural texture.
        </p>
      </section>

      {/* Filtering & Grid */}
      <section className="py-16 px-6 max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar Filters (Client Component) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ShopFilters activeRitual={activeRitual} activeTexture={activeTexture} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center text-earth/60">
              <p>No regimens found matching your selection.</p>
              <Link href="/shop" className="mt-4 inline-block text-bronze underline underline-offset-4">
                Clear Filters
              </Link>
            </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Link href={`/shop/${product.slug}`} key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm px-4 text-center leading-loose">
                      {product.images[0] || "Product Image"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-bronze uppercase tracking-wider line-clamp-1">{product.ritualName || "General"}</p>
                    <h3 className="text-xl font-serif text-earth line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-earth/70 line-clamp-1">{product.functionalTitle}</p>
                    <p className="text-earth font-medium pt-2">
                      ₦ {((product.variants[0]?.priceInCents || 0) / 100).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
