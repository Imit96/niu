import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StaggerSection, StaggerDiv, FadeUpDiv, FadeUpSection, FadeUpP, FadeUpH2 } from "@/components/ui/Motion";
import { getPublicProducts, getFeaturedHairProduct, getFeaturedScentProduct } from "@/app/actions/product";
import { getRecentArticles } from "@/app/actions/article";
import { HeroSection } from "@/components/layout/HeroSection";
import { CustomFormulaSection } from "@/components/layout/CustomFormulaSection";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSignatureRegimens } from "@/app/actions/bundle-admin";
import { SignatureRegimens } from "@/components/layout/SignatureRegimens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ORIGONÆ — Heritage Haircare Rooted in African Botanical Tradition",
  description: "Luxury botanical haircare rituals drawn from African heritage. Formulated for textured hair, crafted with ancestral wisdom. Shop regimens, bundles, and custom formulas.",
  openGraph: {
    title: "ORIGONÆ — Heritage Haircare",
    description: "Luxury botanical haircare rituals drawn from African heritage.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGONÆ — Heritage Haircare",
    description: "Luxury botanical haircare rituals drawn from African heritage.",
  },
};

interface HomeProduct {
  id: string;
  slug: string;
  name: string;
  ritualName: string | null;
  functionalTitle?: string | null;
  description: string | null;
  images: string[];
  variants: { priceInCents: number }[];
}

const VALUES = [
  { label: "Botanic Integrity", body: "Every ingredient traced to its origin. No filler, no compromise." },
  { label: "Ancestral Wisdom", body: "Centuries of African botanical knowledge encoded in each formula." },
  { label: "Texture Forward", body: "Built for coils, kinks, and curls — not adapted to them." },
  { label: "No Compromise", body: "Effective without stripping. Luxurious without excess. Honest always." },
];

const RITUAL_STEPS = [
  { step: "01", title: "Cleanse", body: "Begin with a scalp-focused cleanse that removes build-up without disrupting the moisture barrier." },
  { step: "02", title: "Treat", body: "Deep condition with actives drawn from Kalahari, Sahel, and the Congo Basin." },
  { step: "03", title: "Seal", body: "Lock in moisture with a botanical oil blend that mimics the scalp's natural lipid layer." },
  { step: "04", title: "Style", body: "Define, protect, and express. Your texture, your ritual, your terms." },
];

export const revalidate = 1800;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ products }, recentArticles, featuredHairProduct, featuredScentProduct, t, regimens] = await Promise.all([
    getPublicProducts({}, 1, 6, locale),
    getRecentArticles(3, locale),
    getFeaturedHairProduct(locale),
    getFeaturedScentProduct(locale),
    getTranslations("home"),
    getSignatureRegimens(locale),
  ]);


  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* 1 & 2. Unified Hero & Category Strip */}
      <div className="-mt-14 md:-mt-[104px]">
        <HeroSection />
      </div>

      {/* 3. Brand Manifesto */}
      <section className="py-24 px-6 bg-cream flex flex-col items-center text-center overflow-hidden">
        <FadeUpDiv className="max-w-3xl space-y-6">
          <p className="text-3xl md:text-5xl font-serif text-earth lowercase leading-[1.15] tracking-tight">
            {t("manifesto.body")}
          </p>
          <p className="text-sm md:text-base text-earth/60 max-w-xl mx-auto leading-relaxed font-light">
            {t("manifesto.sub")}
          </p>
        </FadeUpDiv>
      </section>

      {/* 4. Custom Formula Request */}
      <CustomFormulaSection />

      {/* 5. Signature Regimens (Replaces Hair Collection) */}
      <SignatureRegimens regimens={regimens} />

      {/* 6. Scent Spotlight */}
      {featuredScentProduct && (
        <section className="py-24 px-6 bg-ink text-cream border-t border-stone/20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeUpDiv className="relative aspect-[3/4] w-full bg-earth/20 overflow-hidden">
              {featuredScentProduct.images?.[0] && featuredScentProduct.images[0] !== "Product Image Placeholder" ? (
                <Image
                  src={featuredScentProduct.images[0]}
                  alt={featuredScentProduct.name ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-cream/20 font-serif uppercase tracking-widest text-sm">Product Image</div>
              )}
            </FadeUpDiv>
            <FadeUpDiv className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("scentSpotlight.label")}</p>
              <h2 className="text-4xl md:text-5xl font-serif text-cream leading-tight">{featuredScentProduct.name ?? ""}</h2>
              {featuredScentProduct.functionalTitle && (
                <p className="text-xl text-cream/50 font-light">{featuredScentProduct.functionalTitle}</p>
              )}
              <p className="text-cream/70 text-lg font-light leading-relaxed line-clamp-4">{featuredScentProduct.description}</p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                <Link href={`/shop/${featuredScentProduct.slug}`}>
                  <Button className="bg-cream text-earth hover:bg-stone">{t("scentSpotlight.discoverCta")}</Button>
                </Link>
                <Link href="/scent" className="inline-flex items-center gap-1.5 text-sm text-cream/50 hover:text-cream transition-colors border-b border-transparent hover:border-cream pb-0.5 self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/50">
                  Explore All Scent <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </FadeUpDiv>
          </div>
        </section>
      )}

      {/* 7. Values Strip */}
      <FadeUpSection className="py-24 px-6 bg-sand border-t border-earth/20">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {VALUES.map((v) => (
              <div key={v.label} className="space-y-3 border-t border-earth/20 pt-6">
                <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-bronze">{v.label}</h3>
                <p className="text-sm text-earth/65 font-light leading-[1.75]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUpSection>

      {/* 8. Cinematic Banner */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/ingredient-heritage.png"
          alt="ORIGONÆ — Botanical Heritage"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-20 max-w-2xl space-y-6">
            <p className="text-xs font-semibold tracking-[0.3em] text-bronze uppercase">The Origin</p>
            <blockquote className="text-2xl md:text-4xl font-serif text-cream leading-relaxed">
              &ldquo;Rooted in the earth. Refined by tradition. Carried forward.&rdquo;
            </blockquote>
            <Link href="/about">
              <Button variant="secondary" className="border-cream/50 text-cream hover:bg-cream hover:text-earth">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 9. Ingredient Philosophy */}
      <FadeUpSection className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[4/3] bg-stone/10 border border-stone/20 overflow-hidden group">
            <Image
              src="/ingredient-heritage.png"
              alt="ORIGONÆ Ingredient Heritage — Kalahari Melon Seed Oil and Rhassoul Clay"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <StaggerSection className="space-y-8 max-w-xl">
            <FadeUpH2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">{t("ingredientSpotlight.title")}</FadeUpH2>
            <FadeUpP className="text-cream/80 text-lg leading-relaxed">
              {t("ingredientSpotlight.body")}
            </FadeUpP>
            <StaggerSection className="space-y-6 pt-4">
              <FadeUpDiv className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">{t("ingredientSpotlight.ingredient1Name")}</h4>
                <p className="text-sm text-cream/70">{t("ingredientSpotlight.ingredient1Desc")}</p>
              </FadeUpDiv>
              <FadeUpDiv className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">{t("ingredientSpotlight.ingredient2Name")}</h4>
                <p className="text-sm text-cream/70">{t("ingredientSpotlight.ingredient2Desc")}</p>
              </FadeUpDiv>
            </StaggerSection>
            <FadeUpDiv className="pt-8">
              <Link href="/ingredients">
                <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">{t("ingredientSpotlight.cta")}</Button>
              </Link>
            </FadeUpDiv>
          </StaggerSection>
        </div>
      </FadeUpSection>

      {/* 10. Shop by Category */}
      <FadeUpSection className="py-24 px-6 bg-cream border-t border-earth/20">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Browse by Category</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Find Your Ritual</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Hair", sub: "Regimens & Treatments", href: "/hair", image: "/hero.png" },
              { label: "Scent", sub: "Olfactory Collection", href: "/scent", image: "/hero.png" },
              { label: "Skin", sub: "Body Rituals", href: "/skin", image: "/ingredient-heritage.png" },
            ].map((cat, i) => (
              <Link key={cat.href} href={cat.href} className="group relative aspect-[5/4] overflow-hidden bg-stone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/60 focus-visible:ring-offset-2">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-50 ${i % 2 === 0 ? "bg-ink/60" : "bg-earth/65"}`} />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-center">
                  <span className="text-[10px] font-semibold tracking-[0.3em] text-cream/60 uppercase mb-2">{cat.sub}</span>
                  <span className="text-xl font-serif tracking-[0.15em] text-cream uppercase">{cat.label}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-bronze scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/bundles">
              <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                View Ritual Bundles
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

      {/* 11. The Ritual Process */}
      <FadeUpSection className="py-24 px-6 bg-sand border-t border-earth/20">
        <div className="max-w-[1440px] mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">The Ritual</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {RITUAL_STEPS.map((s) => (
              <div key={s.step} className="space-y-5">
                <span className="text-6xl font-serif text-earth/8 select-none leading-none">{s.step}</span>
                <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-earth border-t border-earth/20 pt-5">{s.title}</h3>
                <p className="text-sm text-earth/65 font-light leading-[1.75]">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/guides">
              <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                Explore Ritual Guides
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

      {/* 12. Featured Hair Product Spotlight */}
      {featuredHairProduct && (
        <section className="py-24 px-6 bg-cream border-t border-earth/20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeUpDiv className="space-y-6 order-last lg:order-first">
              <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("hairSpotlight.label")}</p>
              <h2 className="text-4xl md:text-5xl font-serif text-earth leading-tight">{featuredHairProduct.name}</h2>
              {featuredHairProduct.functionalTitle && (
                <p className="text-xl text-earth/60 font-light">{featuredHairProduct.functionalTitle}</p>
              )}
              <p className="text-earth/70 text-lg font-light leading-relaxed line-clamp-4">{featuredHairProduct.description}</p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                <Link href={`/shop/${featuredHairProduct.slug}`}>
                  <Button>{t("hairSpotlight.shopNow")}</Button>
                </Link>
                <Link href="/hair" className="inline-flex items-center gap-1.5 text-sm text-earth/60 hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-0.5 self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50">
                  {t("hairSpotlight.exploreCollection")} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </FadeUpDiv>
            <FadeUpDiv className="relative aspect-[3/4] w-full bg-stone overflow-hidden">
              {featuredHairProduct.images?.[0] && featuredHairProduct.images[0] !== "Product Image Placeholder" ? (
                <Image
                  src={featuredHairProduct.images[0]}
                  alt={featuredHairProduct.name ?? ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">Product Image</div>
              )}
            </FadeUpDiv>
          </div>
        </section>
      )}


      {/* 14. From the Journal */}
      {recentArticles.length > 0 && (
        <section className="py-24 px-6 bg-cream border-t border-earth/20">
          <div className="max-w-[1440px] mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("journal.label")}</p>
                <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">{t("journal.title")}</h2>
              </div>
              <Link href="/journal" className="hidden md:inline-flex items-center gap-1.5 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50">
                {t("journal.viewAll")} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            <StaggerDiv className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article: any) => (
                <Link href={`/journal/${article.slug}`} key={article.id} className="group flex flex-col space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:ring-offset-2 rounded-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">Editorial</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-bronze">
                      <span>{article.category}</span>
                      <span className="text-earth/30" aria-hidden="true">•</span>
                      <span className="text-earth/50 font-normal normal-case tracking-normal">
                        {new Date(article.datePublished).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-earth leading-snug group-hover:text-bronze transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-earth/60 font-light leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </StaggerDiv>

            <div className="text-center md:hidden">
              <Link href="/journal" className="inline-flex items-center gap-1.5 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50">
                {t("journal.viewAll")} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 15. Newsletter Capture removed */}
    </div>
  );
}
