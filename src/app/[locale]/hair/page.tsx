import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { FadeUpDiv, FadeUpSection, FadeUpH1, FadeUpP, FadeUpH2, StaggerDiv, StaggerSection } from "@/components/ui/Motion";
import { getHairProducts } from "@/app/actions/product";
import { getActiveFlashSale } from "@/app/actions/admin";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Hair Regimens | ORIGONÆ",
  description: "Heritage-rooted hair care formulated from African botanical traditions. Discover our complete collection of hair oils, clays, creams and ritual treatments.",
  openGraph: {
    title: "Hair Regimens | ORIGONÆ",
    description: "Heritage-rooted hair care formulated from African botanical traditions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hair Regimens | ORIGONÆ",
    description: "Heritage-rooted hair care formulated from African botanical traditions.",
  },
};

const HAIR_PHILOSOPHY = [
  {
    heading: "Root to Tip",
    body: "We formulate from the scalp outward — addressing the source of health before the strand. Every product begins with the ritual of preparation.",
  },
  {
    heading: "African Botanical Tradition",
    body: "Rhassoul clay, Kalahari melon seed oil, shea, and baobab — ingredients carried through centuries of care, now expressed in precise formulations.",
  },
  {
    heading: "Texture as Language",
    body: "Coils, kinks, waves, locs. Each texture carries its own dialect. Our regimens are written to honour them all without compromise.",
  },
];

export default async function HairPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale }, resolvedSearch] = await Promise.all([params, searchParams]);
  const page = typeof resolvedSearch.page === "string" ? Math.max(1, parseInt(resolvedSearch.page) || 1) : 1;

  const [{ products, total, totalPages }, flashSale, t] = await Promise.all([
    getHairProducts(page, 24, locale),
    getActiveFlashSale(),
    getTranslations("shop"),
  ]);

  const buildPageUrl = (p: number) => {
    const qs = p > 1 ? `?page=${p}` : "";
    return `/hair${qs}`;
  };

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* 1. Hero */}
      <section className="relative w-full min-h-[70vh] flex items-end pb-20 overflow-hidden bg-earth">
        <Image
          src="/hero.png"
          alt="ORIGONÆ Hair — African Heritage Hair Regimens"
          fill
          priority
          className="object-cover object-top z-0"
        />
        <div className="absolute inset-0 bg-ink/50 z-10" />
        <div className="relative z-20 px-6 max-w-[1440px] mx-auto w-full">
          <StaggerDiv className="max-w-2xl space-y-6">
            <FadeUpH1 className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">
              Hair Collection
            </FadeUpH1>
            <FadeUpH2 className="text-5xl md:text-7xl font-serif text-cream uppercase tracking-wide leading-tight">
              Rooted in Heritage
            </FadeUpH2>
            <FadeUpP className="text-lg text-cream/80 font-light max-w-xl leading-relaxed">
              Intentional formulations drawn from the hair rituals of the African continent. Every texture. Every regimen. Every strand, considered.
            </FadeUpP>
          </StaggerDiv>
        </div>
      </section>

      {/* 2. Philosophy Columns */}
      <FadeUpSection className="py-20 px-6 bg-cream border-b border-earth/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {HAIR_PHILOSOPHY.map((item) => (
              <div key={item.heading} className="space-y-4 border-t border-earth/20 pt-8">
                <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-bronze">{item.heading}</h3>
                <p className="text-earth/70 font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUpSection>

      {/* 3. The Regimens — editorial bridge */}
      <section className="py-20 px-6 bg-sand">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">The Collection</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Hair Regimens</h2>
            <p className="text-earth/70 font-light text-lg leading-relaxed max-w-xl">
              Each product belongs to a ritual sequence — cleanse, restore, grow. Use them together or begin where your hair needs you most.
            </p>
          </div>
          {total > 0 && (
            <p className="text-sm text-earth/50 tracking-widest uppercase shrink-0">{total} products</p>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center space-y-6">
            <p className="text-earth/50 font-light text-lg">No hair products have been added yet.</p>
            <Link href="/shop">
              <Button variant="secondary" className="border-earth text-earth">Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <StaggerDiv className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
              {products.map((product: any) => (
                <Link href={`/shop/${product.slug}`} key={product.id} className="group flex flex-col space-y-4">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                    {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm px-4 text-center leading-loose">
                        Product Image
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-bronze uppercase tracking-wider line-clamp-1">
                      {product.ritualName || "Hair"}
                    </p>
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
            </StaggerDiv>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="mt-16 flex items-center justify-center gap-4">
                  {page > 1 && (
                    <Link
                      href={buildPageUrl(page - 1)}
                      className="px-6 py-2 border border-earth/30 text-earth text-sm tracking-wider uppercase hover:border-earth transition-colors"
                    >
                      {t("pagination.previous")}
                    </Link>
                  )}
                  <span className="text-earth/60 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={buildPageUrl(page + 1)}
                      className="px-6 py-2 border border-earth/30 text-earth text-sm tracking-wider uppercase hover:border-earth transition-colors"
                    >
                      {t("pagination.next")}
                    </Link>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <a href="#" className="text-xs text-earth/40 hover:text-bronze transition-colors uppercase tracking-widest">
                    ↑ Back to top
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* 4. Ritual bridge — link to Guides */}
      <FadeUpSection className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">The Practice</p>
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide leading-tight">
            How to Use Your Regimen
          </h2>
          <p className="text-cream/70 font-light text-lg leading-relaxed">
            Every product is part of a larger ritual. Our guides walk you through wash day, protective styling, and scalp care — step by step, tradition by tradition.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guides">
              <Button className="bg-cream text-earth hover:bg-stone">Explore Hair Guides</Button>
            </Link>
            <Link href="/ingredients">
              <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">
                Our Ingredients
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

    </div>
  );
}
