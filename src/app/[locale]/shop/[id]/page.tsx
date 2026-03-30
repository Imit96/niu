
import Link from "next/link";
import { getProductBySlug, getProductsByIds } from "@/app/actions/product";
import { getActiveFlashSale } from "@/app/actions/admin";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions";
import Image from "next/image";
import { auth } from "../../../../../auth";
import { checkWishlistStatus } from "@/app/actions/wishlist";
import { getApprovedReviews, checkUserPurchased } from "@/app/actions/review";
import ProductGallery from "./ProductGallery";
import { ProductReviews } from "./ProductReviews";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { SITE_URL } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

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


export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = await params;
  const product = await getProductBySlug(id, locale);
  if (!product) return { title: "Regimen Not Found" };
  const image = product.images?.[0] ? `${SITE_URL}${product.images[0]}` : undefined;
  return {
    title: `${product.name} | ORIGONÆ`,
    description: product.description,
    alternates: { canonical: `${SITE_URL}/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | ORIGONÆ`,
      description: product.description ?? "",
      url: `${SITE_URL}/shop/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ORIGONÆ`,
      description: product.description ?? "",
      images: image ? [image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = await params;
  const [product, session, flashSale, t] = await Promise.all([
    getProductBySlug(id, locale),
    auth(),
    getActiveFlashSale(),
    getTranslations("shop"),
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


  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : null;

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
    ...(avgRating !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: approvedReviews.length,
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-8 pb-0 px-6 max-w-[1440px] mx-auto w-full">
        <ol className="flex items-center flex-wrap gap-x-2 text-xs text-earth/60 uppercase tracking-widest font-semibold">
          <li><Link href="/" className="hover:text-earth transition-colors">Home</Link></li>
          <li className="text-earth/30">/</li>
          <li><Link href="/shop" className="hover:text-earth transition-colors">Shop</Link></li>
          {product.ritualName && (
            <>
              <li className="text-earth/30">/</li>
              <li className="text-earth/30">{product.ritualName}</li>
            </>
          )}
          <li className="text-earth/30">/</li>
          <li className="text-earth truncate max-w-[220px]" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      {/* 1. Hero Section */}
      <section className="pt-8 pb-16 px-6 max-w-[1440px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
            positions={(product as any).imagePositions as string[] | undefined}
          />
        </div>

        {/* Product Details & Add to Cart */}
        <div className="flex flex-col space-y-8 sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 h-fit">
          <div className="space-y-4 border-b border-earth/20 pb-8">
            <p className="text-xs font-semibold text-bronze uppercase tracking-widest">{product.ritualName || t("pdp.origonaeBase")}</p>
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
              <p className="text-sm text-earth/50 italic">{t("pdp.currentlyUnavailable")}</p>
            )}
          </div>

          {(product.textureScent || product.culturalInspiration) && (
            <div className="space-y-4 pt-8">
              {product.textureScent && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">{product.textureHeading || t("pdp.textureAndScent")}</h3>
                  <p className="text-sm text-earth/80 whitespace-pre-wrap">{product.textureScent}</p>
                </div>
              )}
              {product.culturalInspiration && (
                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze">{product.inspirationHeading || t("pdp.culturalInspiration")}</h3>
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
                <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("pdp.howToUse")}</p>
                <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">{t("pdp.thePerformance")}</h2>
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
            <h2 className="text-3xl font-serif text-earth uppercase tracking-wide">{t("pdp.keyIngredients")}</h2>
            <p className="text-earth/80 leading-relaxed whitespace-pre-wrap">
              {product.ingredientsText}
            </p>
            <Link href="/ingredients" className="inline-block pt-4">
              <button className="px-6 py-3 border border-earth text-earth hover:bg-earth hover:text-cream transition-colors text-sm uppercase tracking-widest font-semibold">
                {t("pdp.viewCompletePhilosophy")}
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* Result Timeline */}
      {resonanceTimeline.length > 0 && (
        <section className="py-24 px-6 bg-earth text-cream">
          <div className="max-w-5xl mx-auto space-y-12 text-center">
            <h2 className="text-3xl font-serif uppercase tracking-widest text-bronze mb-4">{t("pdp.anticipatedResonance")}</h2>
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
            <h2 className="text-3xl font-serif text-earth uppercase tracking-wide text-center mb-12">{t("pdp.frequentlyAsked")}</h2>
            
            <div className="space-y-0">
              {faqList.map((faq, idx) => (
                <details key={idx} className={`group border-b border-earth/10 ${idx === faqList.length - 1 ? 'border-transparent' : ''}`}>
                  <summary className="flex items-center justify-between py-6 cursor-pointer list-none gap-4">
                    <span className="font-serif text-xl text-earth leading-relaxed group-hover:text-bronze transition-colors">{faq.question}</span>
                    <span className="shrink-0 text-earth/40 text-2xl font-light transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-earth/70 font-light leading-relaxed pb-6">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Related Regimens */}
      {pairingProducts.length > 0 && (
        <section className="py-24 px-6 bg-sand border-t border-earth/20">
           <div className="max-w-[1440px] mx-auto space-y-12">
             <h2 className="text-2xl md:text-3xl font-serif text-earth uppercase tracking-wide text-center">{t("pdp.completeTheRegimen")}</h2>
             
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
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
