import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { FadeUpDiv, FadeUpSection, FadeUpH1, FadeUpP, FadeUpH2, StaggerDiv, StaggerSection } from "@/components/ui/Motion";
import { getScentProducts } from "@/app/actions/product";
import { getActiveFlashSale } from "@/app/actions/admin";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Olfactory Collection | ORIGONÆ",
  description: "Scents composed from African sacred botanicals. Perfumes, body mists and ritual oils rooted in the continent's living fragrance traditions.",
  openGraph: {
    title: "Olfactory Collection | ORIGONÆ",
    description: "Scents composed from African sacred botanicals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olfactory Collection | ORIGONÆ",
    description: "Scents composed from African sacred botanicals.",
  },
};

const SCENT_PHILOSOPHY = [
  {
    heading: "Memory as Ingredient",
    body: "Scent is the oldest form of record. Our olfactory compositions draw from the smoke, spice, and flora woven into African ceremony — encoded in living memory.",
  },
  {
    heading: "Botanical Provenance",
    body: "Oud from the Horn of Africa. Baobab resin from the Sahel. Ylang-ylang from the Indian Ocean coast. Every note has a place. Every place has a story.",
  },
  {
    heading: "Wear as Ritual",
    body: "Fragrance is not decoration — it is declaration. Each offering is composed to layer: skin, hair, air. A full-body olfactory practice.",
  },
];

export default async function ScentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale }, resolvedSearch] = await Promise.all([params, searchParams]);
  const page = typeof resolvedSearch.page === "string" ? Math.max(1, parseInt(resolvedSearch.page) || 1) : 1;

  const [{ products, total, totalPages }, flashSale, t] = await Promise.all([
    getScentProducts(page, 24, locale),
    getActiveFlashSale(),
    getTranslations("shop"),
  ]);

  const buildPageUrl = (p: number) => `/scent${p > 1 ? `?page=${p}` : ""}`;

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* 1. Hero — dark, atmospheric */}
      <section className="relative w-full min-h-[70vh] flex items-end pb-20 overflow-hidden bg-ink">
        <Image
          src="/hero.png"
          alt="ORIGONÆ Olfactory Collection — African Scent Traditions"
          fill
          priority
          className="object-cover object-center z-0 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent z-10" />
        <div className="relative z-20 px-6 max-w-[1440px] mx-auto w-full">
          <StaggerDiv className="max-w-2xl space-y-6">
            <FadeUpH1 className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">
              Olfactory Collection
            </FadeUpH1>
            <FadeUpH2 className="text-5xl md:text-7xl font-serif text-cream uppercase tracking-wide leading-tight">
              Scent as Sacred Memory
            </FadeUpH2>
            <FadeUpP className="text-lg text-cream/80 font-light max-w-xl leading-relaxed">
              Parfums, oils and mists composed from Africa&rsquo;s most ancient botanical archives. Wear the continent.
            </FadeUpP>
          </StaggerDiv>
        </div>
      </section>

      {/* 2. Philosophy Columns */}
      <FadeUpSection className="py-20 px-6 bg-ink border-b border-cream/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {SCENT_PHILOSOPHY.map((item) => (
              <div key={item.heading} className="space-y-4 border-t border-cream/20 pt-8">
                <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-bronze">{item.heading}</h3>
                <p className="text-cream/60 font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUpSection>

      {/* 3. The Collection */}
      <section className="py-20 px-6 bg-earth">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">The Olfactory Regimen</p>
            <h2 className="text-3xl md:text-5xl font-serif text-cream uppercase tracking-wide">Scent Offerings</h2>
            <p className="text-cream/60 font-light text-lg leading-relaxed max-w-xl">
              Each composition is built for layering — wear the parfum, mist the body, oil the pulse points. Depth is earned through repetition.
            </p>
          </div>
          {total > 0 && (
            <p className="text-sm text-cream/40 tracking-widest uppercase shrink-0">{total} offerings</p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <p className="text-cream/40 font-light text-lg">The olfactory archive is being composed.</p>
            <Link href="/shop">
              <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <StaggerDiv className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
              {products.map((product: any) => (
                <Link href={`/shop/${product.slug}`} key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink/60 border border-cream/10 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                    {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-cream/20 uppercase tracking-widest font-serif text-sm px-4 text-center leading-loose">
                        Product Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-bronze uppercase tracking-wider line-clamp-1">
                      {product.ritualName || "Olfactory"}
                    </p>
                    <h3 className="text-xl font-serif text-cream line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-cream/50 line-clamp-1">{product.functionalTitle}</p>
                    <p className="text-cream font-medium pt-2 flex items-baseline gap-2">
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
                            <span className="text-cream/30 line-through text-sm"><PriceDisplay amountInCents={basePrice} /></span>
                          </>
                        ) : (
                          <PriceDisplay amountInCents={basePrice} />
                        );
                      })()}
                    </p>
                  </div>
                </Link>
              ))}
            </StaggerDiv>

            {totalPages > 1 && (
              <>
                <div className="mt-16 flex items-center justify-center gap-4">
                  {page > 1 && (
                    <Link href={buildPageUrl(page - 1)} className="px-6 py-2 border border-cream/30 text-cream text-sm tracking-wider uppercase hover:border-cream transition-colors">
                      {t("pagination.previous")}
                    </Link>
                  )}
                  <span className="text-cream/60 text-sm">Page {page} of {totalPages}</span>
                  {page < totalPages && (
                    <Link href={buildPageUrl(page + 1)} className="px-6 py-2 border border-cream/30 text-cream text-sm tracking-wider uppercase hover:border-cream transition-colors">
                      {t("pagination.next")}
                    </Link>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <a href="#" className="text-xs text-cream/30 hover:text-bronze transition-colors uppercase tracking-widest">
                    ↑ Back to top
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* 4. Bundling CTA — drive to ritual bundles */}
      <FadeUpSection className="py-24 px-6 bg-ink text-cream border-t border-cream/10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Complete the Ritual</p>
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide leading-tight">
            Pair Your Scent with Hair
          </h2>
          <p className="text-cream/60 font-light text-lg leading-relaxed">
            Our ritual bundles pair olfactory offerings with hair regimens — a complete sensory practice composed for cohesion.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/bundles">
              <Button className="bg-bronze text-ink hover:bg-bronze/90">Shop Ritual Bundles</Button>
            </Link>
            <Link href="/ingredients">
              <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">
                Our Botanical Sources
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

    </div>
  );
}
