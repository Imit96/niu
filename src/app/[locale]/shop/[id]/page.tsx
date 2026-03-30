
import Link from "next/link";
import { getProductBySlug, getProductsByIds } from "../../actions/product";
import { getActiveFlashSale } from "../../actions/admin";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions";
import Image from "next/image";
import { auth } from "../../../../auth";
import { checkWishlistStatus } from "../../actions/wishlist";
import { getApprovedReviews, checkUserPurchased } from "../../actions/review";
import ProductGallery from "./ProductGallery";
import { ProductReviews } from "./ProductReviews";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SITE_URL } from "@/lib/constants";

interface ResonanceData {
  timeframe: string;
  title: string;
  description: string;
}

interface FaqData {
  question: string;
  answer: string;
}

// force-dynamic is intentional: product detail page calls auth() for
// per-user wishlist and review state. Individual product data is cached
// via Prisma query caching / Supabase connection pooling.
export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) return { title: "Regimen Not Found" };
  return {
    title: `${product.name} | ORIGONÆ`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, session, flashSale] = await Promise.all([
    getProductBySlug(id),
    auth(),
    getActiveFlashSale(),
  ]);
  
  if (!product) {
    notFound();
  }

  const [inWishlist, approvedReviews, hasPurchased] = await Promise.all([
    checkWishlistStatus(product.id),
    getApprovedReviews(product.id),
    checkUserPurchased(product.id),
  ]);

  const pairingProducts = await getProductsByIds(product.regimenProductIds || []);

  const primaryVariant = product.variants[0];

  const resonanceTimeline = (Array.isArray(product.resonanceData)
    ? (product.resonanceData as unknown as ResonanceData[])
    : [] as ResonanceData[]
  ).filter((r) => r.timeframe?.trim() || r.title?.trim() || r.description?.trim());

  const faqList = (Array.isArray(product.faqData)
    ? (product.faqData as unknown as FaqData[])
    : [] as FaqData[]
  ).filter((f) => f.question?.trim() || f.answer?.trim());


  const jsonLdPrice = primaryVariant
    ? Math.min(
        primaryVariant.salePriceInCents ?? primaryVariant.priceInCents,
        flashSale?.discountPct
          ? Math.round(primaryVariant.priceInCents * (1 - flashSale.discountPct / 100))
          : primaryVariant.priceInCents
      )
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0] ? `${SITE_URL}${product.images[0]}` : undefined,
    brand: { "@type": "Brand", name: "ORIGONÆ" },
    offers: primaryVariant
      ? {
          "@type": "Offer",
          priceCurrency: "NGN",
          price: (jsonLdPrice / 100).toFixed(2),
          availability:
            primaryVariant.inventoryCount > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/shop/${product.slug}`,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* 1. Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
            positions={(product as any).imagePositions as string[] | undefined}
          />
        </div>

        {/* Product Details & Add to Cart */}
        <div className="flex flex-col space-y-8 sticky top-32 h-fit">
          <div className="space-y-4 border-b border-earth/20 pb-8">
            <p className="text-xs font-semibold text-bronze uppercase tracking-widest">{product.ritualName || "ORIGONÆ Base"}</p>
            <h1 className="text-4xl md:text-5xl font-serif text-earth">{product.name}</h1>
            {product.functionalTitle && (
              <p className="text-lg text-earth/70 font-light">{product.functionalTitle}</p>
            )}
          </div>

          <div className="space-y-6">
            <p className="text-earth/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {product.description}
            </p>

            {product.variants.length > 0 ? (
              <ProductActions
                variants={product.variants.map((v) => ({
                  id: v.id,
                  size: v.size,
                  priceInCents: v.priceInCents,
                  salePriceInCents: v.salePriceInCents,
                  inventoryCount: v.inventoryCount,
                }))}
                flashSaleDiscountPct={flashSale?.discountPct}
                productId={product.id}
                productSlug={product.slug}
                productName={product.name}
                productImage={product.images[0] || ""}
                inWishlist={inWishlist}
                isLoggedIn={!!session?.user}
              />
            ) : (
              <p className="text-sm text-earth/50 italic">Currently Unavailable</p>
            )}
          </div>

          {(product.textureScent || product.culturalInspiration) && (
            <div className="space-y-4 pt-8">
              {product.textureScent && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">{product.textureHeading || "Texture & Scent"}</h3>
                  <p className="text-sm text-earth/80 whitespace-pre-wrap">{product.textureScent}</p>
                </div>
              )}
              {product.culturalInspiration && (
                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">{product.inspirationHeading || "Cultural Inspiration"}</h3>
                  <p className="text-sm text-earth/80 leading-relaxed whitespace-pre-wrap">{product.culturalInspiration}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* 2. Regimen Usage Guide */}
      {(product.howToUse || product.performanceMedia) && (
        <section className="bg-earth text-cream overflow-hidden">
          <div className={`max-w-[1440px] mx-auto grid grid-cols-1 ${product.howToUse && product.performanceMedia ? 'lg:grid-cols-2' : ''} items-stretch`}>
            {product.howToUse && (
              <div className={`flex flex-col justify-center space-y-8 px-8 py-20 md:px-16 md:py-28 lg:px-20 ${!product.performanceMedia ? 'items-center text-center max-w-3xl mx-auto' : ''}`}>
                <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">How To Use</p>
                <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">The Performance</h2>
                <p className="text-lg text-cream/80 leading-relaxed font-light whitespace-pre-wrap">
                  {product.howToUse}
                </p>
              </div>
            )}
            {product.performanceMedia && (
              <div className="relative min-h-[480px] lg:min-h-[620px] w-full">
                {product.performanceMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={product.performanceMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={product.performanceMedia}
                    alt={`${product.name} — Performance`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    // @ts-ignore — field exists after Prisma regen; TS server cache stale
                    style={{ objectPosition: (product as any).performanceMediaPosition || "center" }}
                  />
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Ingredients */}
      {product.ingredientsText && (
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-serif text-earth uppercase tracking-wide">Key Ingredients</h2>
            <p className="text-earth/80 leading-relaxed whitespace-pre-wrap">
              {product.ingredientsText}
            </p>
            <Link href="/ingredients" className="inline-block pt-4">
              <button className="px-6 py-3 border border-earth text-earth hover:bg-earth hover:text-cream transition-colors text-sm uppercase tracking-widest font-semibold">
                View Complete Philosophy
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Result Timeline */}
      {resonanceTimeline.length > 0 && (
        <section className="py-24 px-6 bg-earth text-cream">
          <div className="max-w-5xl mx-auto space-y-12 text-center">
            <h2 className="text-3xl font-serif uppercase tracking-widest text-bronze mb-4">Anticipated Resonance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left w-full">
              {resonanceTimeline.map((res, idx) => (
                <div key={idx} className="p-8 md:p-10 border border-cream/20 bg-ink/30 space-y-6 hover:bg-ink/50 transition-colors relative flex flex-col justify-start w-full overflow-hidden">
                  <span className="text-bronze font-serif italic text-3xl shrink-0">{res.timeframe}</span>
                  <div className="flex-1 w-full flex flex-col">
                    <h4 className="font-semibold tracking-widest uppercase text-xs mb-3 text-cream shrink-0 break-words">{res.title}</h4>
                    <p className="text-cream/70 font-light text-sm leading-relaxed whitespace-pre-wrap break-words w-full">{res.description}</p>
                  </div>
                  {idx > 0 && (
                    <div className="absolute hidden lg:block w-8 border-t border-cream/20 top-1/2 -left-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqList.length > 0 && (
        <section className="py-24 px-6 bg-cream border-t border-earth/10">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-3xl font-serif text-earth uppercase tracking-wide text-center mb-12">Frequently Asked</h2>
            
            <div className="space-y-8">
              {faqList.map((faq, idx) => (
                <div key={idx} className={`border-b border-earth/10 pb-8 group ${idx === faqList.length - 1 ? 'border-transparent' : ''}`}>
                  <h4 className="font-serif text-xl text-earth mb-4 leading-relaxed group-hover:text-bronze transition-colors">{faq.question}</h4>
                  <p className="text-earth/70 font-light leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Related Regimens */}
      {pairingProducts.length > 0 && (
        <section className="py-24 px-6 bg-sand border-t border-earth/20">
           <div className="max-w-[1440px] mx-auto space-y-12">
             <h2 className="text-2xl md:text-3xl font-serif text-earth uppercase tracking-wide text-center">Complete The Regimen</h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {pairingProducts.map((p) => {
                  const pVariant = p.variants[0];
                  const pPrice = pVariant ? pVariant.priceInCents / 100 : 0;
                  return (
                    <Link href={`/shop/${p.slug || p.id}`} key={p.id} className="group flex flex-col space-y-4">
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 group-hover:border-bronze transition-colors">
                        {p.images?.[0] && p.images[0] !== "Product Image Placeholder" ? (
                          <Image 
                            src={p.images[0]} 
                            alt={p.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="w-1/3 aspect-[1/2] border border-earth/20 rounded-full flex flex-col justify-center items-center text-center opacity-50 group-hover:opacity-100 transition-opacity">
                               <span className="text-[8px] tracking-widest uppercase text-earth/50">Product Image</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="text-sm font-serif text-earth uppercase tracking-wide">{p.name}</h3>
                        <p className="text-earth/70 text-sm">
                          {pVariant ? <PriceDisplay amountInCents={pVariant.priceInCents} /> : "₦ 0"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
             </div>
           </div>
        </section>
      )}

      {/* 5. Reviews */}
      <ProductReviews
        productId={product.id}
        reviews={approvedReviews}
        isLoggedIn={!!session?.user}
        hasPurchased={hasPurchased}
      />
      </div>
    </>
  );
}
