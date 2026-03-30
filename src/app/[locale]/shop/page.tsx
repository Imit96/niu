import Link from "next/link";
import { getPublicProducts, getProductsForSearch } from "../actions/product";
import { getActiveFlashSale } from "../actions/admin";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import ShopFilters from "./ShopFilters";
import Image from "next/image";

export const revalidate = 1800;


export const metadata = {
  title: "Shop All Regimens | ORIGONÆ",
  description: "Discover our full collection of intentional, heritage-rooted formulations.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;

  const activeRitual = typeof resolvedSearchParams.ritual === "string" ? resolvedSearchParams.ritual : "All";
  const activeTexture = typeof resolvedSearchParams.texture === "string" ? resolvedSearchParams.texture : "All";
  const searchQuery = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const page = typeof resolvedSearchParams.page === "string" ? Math.max(1, parseInt(resolvedSearchParams.page) || 1) : 1;

  const [{ products, total, totalPages }, searchSuggestions, flashSale] = await Promise.all([
    getPublicProducts({ ritual: activeRitual, texture: activeTexture, search: searchQuery }, page),
    getProductsForSearch(),
    getActiveFlashSale(),
  ]);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (activeRitual !== "All") params.set("ritual", activeRitual);
    if (activeTexture !== "All") params.set("texture", activeTexture);
    if (searchQuery) params.set("q", searchQuery);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

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
          <ShopFilters activeRitual={activeRitual} activeTexture={activeTexture} suggestions={searchSuggestions} />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-24 text-center text-earth/60">
              <p>No regimens found matching your selection.</p>
              <Link href="/shop" className="mt-4 inline-block text-bronze underline underline-offset-4">
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Link href={`/shop/${product.slug}`} key={product.id} className="group flex flex-col space-y-4">
                    <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                      {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm px-4 text-center leading-loose">
                          Product Image
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-bronze uppercase tracking-wider line-clamp-1">{product.ritualName || "General"}</p>
                      <h3 className="text-xl font-serif text-earth line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-earth/70 line-clamp-1">{product.functionalTitle}</p>
                      <p className="text-earth font-medium pt-2 flex items-baseline gap-2">
                        {(() => {
                          const variant = product.variants[0];
                          if (!variant) return <PriceDisplay amountInCents={0} />;
                          const basePrice = variant.priceInCents;
                          const salePrice = variant.salePriceInCents ?? basePrice;
                          const flashPrice = flashSale?.discountPct
                            ? Math.round(basePrice * (1 - flashSale.discountPct / 100))
                            : basePrice;
                          const effectivePrice = Math.min(salePrice, flashPrice);
                          return effectivePrice < basePrice ? (
                            <>
                              <span className="text-bronze"><PriceDisplay amountInCents={effectivePrice} /></span>
                              <span className="text-earth/40 line-through text-sm"><PriceDisplay amountInCents={basePrice} /></span>
                            </>
                          ) : (
                            <PriceDisplay amountInCents={basePrice} />
                          );
                        })()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  {page > 1 && (
                    <Link
                      href={buildPageUrl(page - 1)}
                      className="px-6 py-2 border border-earth/30 text-earth text-sm tracking-wider uppercase hover:border-earth transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  <span className="text-earth/60 text-sm">
                    Page {page} of {totalPages} &mdash; {total} products
                  </span>
                  {page < totalPages && (
                    <Link
                      href={buildPageUrl(page + 1)}
                      className="px-6 py-2 border border-earth/30 text-earth text-sm tracking-wider uppercase hover:border-earth transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
