import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StaggerSection, StaggerDiv, FadeUpDiv, FadeUpSection, FadeUpH1, FadeUpP, FadeUpH2 } from "@/components/ui/Motion";
import { getPublicProducts, getFeaturedHairProduct, getFeaturedScentProduct } from "./actions/product";
import { getFeaturedReviews } from "./actions/review";
import { getFeaturedArticle } from "./actions/article";
import { HomeNewsletterSection } from "@/components/layout/HomeNewsletterSection";

interface HomeProduct {
  id: string;
  slug: string;
  name: string;
  ritualName: string | null;
  description: string | null;
  images: string[];
  variants: { priceInCents: number }[];
}

interface FeaturedReview {
  id: string;
  rating: number;
  comment: string | null;
  user: { name: string | null };
  product: { id: string; name: string };
}

export const revalidate = 1800;

export default async function HomePage() {
  const [{ products }, featuredReviews, featuredArticle, featuredHairProduct, featuredScentProduct] = await Promise.all([
    getPublicProducts(),
    getFeaturedReviews(3),
    getFeaturedArticle(),
    getFeaturedHairProduct(),
    getFeaturedScentProduct(),
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-earth">
        <Image 
          src="/hero.png"
          alt="African Heritage Regimen - Originæ Hero"
          fill
          priority
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-ink/30 z-10 mix-blend-multiply" />
        
        <StaggerDiv className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-6">
          <FadeUpH1 className="text-5xl md:text-7xl font-serif text-cream uppercase tracking-widest leading-tight">
            Raw Elements Refined
          </FadeUpH1>
          <FadeUpP className="text-lg md:text-xl text-cream/90 font-light max-w-2xl tracking-wide">
            Luxury regimen haircare and olfactory regimen rooted in broader African heritage. Earthy, modern, and intentional.
          </FadeUpP>
          <FadeUpDiv className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-12">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-cream text-earth hover:bg-stone">Shop Regimens</Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full border-cream text-cream hover:bg-cream hover:text-earth">Discover the Philosophy</Button>
            </Link>
          </FadeUpDiv>
        </StaggerDiv>
      </section>

      {/* 2. Brand Manifesto */}
      <StaggerSection className="py-24 px-6 bg-cream flex flex-col items-center text-center">
        <div className="max-w-3xl space-y-8">
          <FadeUpH2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">The Manifesto</FadeUpH2>
          <FadeUpP className="text-2xl md:text-4xl font-serif text-earth leading-relaxed">
            ORIGONÆ is regimen. ORIGONÆ is grounded luxury. ORIGONÆ is raw efficacy refined. ORIGONÆ is scent as architecture. ORIGONÆ is power without noise.
          </FadeUpP>
          <FadeUpP className="text-base text-earth/80 max-w-2xl mx-auto pt-4 leading-loose">
            We merge regimen-based beauty with true cultural reverence. High craftsmanship meets intentional beauty, honoring the materials of the earth to create an elevated, modern experience for your hair and scalp.
          </FadeUpP>
        </div>
      </StaggerSection>

      {/* 3. Hero Hair Product Spotlight */}
      {featuredHairProduct && (
        <section className="py-24 px-6 bg-sand border-t border-earth/10">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeUpDiv className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Signature Hair Care</p>
              <h2 className="text-4xl md:text-5xl font-serif text-earth leading-tight">{featuredHairProduct.name}</h2>
              {featuredHairProduct.functionalTitle && (
                <p className="text-xl text-earth/60 font-light">{featuredHairProduct.functionalTitle}</p>
              )}
              <p className="text-earth/70 text-lg font-light leading-relaxed line-clamp-4">{featuredHairProduct.description}</p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                <Link href={`/shop/${featuredHairProduct.slug}`}>
                  <Button>Shop Now</Button>
                </Link>
                <Link href="/shop" className="inline-flex items-center text-sm text-earth/60 hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-0.5 self-center">
                  Explore Full Collection
                </Link>
              </div>
            </FadeUpDiv>
            <FadeUpDiv className="relative aspect-[3/4] w-full bg-stone overflow-hidden order-first lg:order-last">
              {featuredHairProduct.images?.[0] && featuredHairProduct.images[0] !== "Product Image Placeholder" ? (
                <img
                  src={featuredHairProduct.images[0]}
                  alt={featuredHairProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">Product Image</div>
              )}
            </FadeUpDiv>
          </div>
        </section>
      )}

      {/* 4. Featured Regimen Collection */}
      <StaggerSection className="py-24 px-6 bg-sand">
        <div className="max-w-[1440px] mx-auto">
          <FadeUpDiv className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Signature Regimens</h2>
              <p className="text-earth/80 text-lg">Experience our most revered collections, designed to cleanse, restore, and elevate.</p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex mt-6 md:mt-0 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
              Explore All Regimens
            </Link>
          </FadeUpDiv>

          <StaggerDiv className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.length > 0 ? products.filter((p: HomeProduct) => p.ritualName !== "The Olfactory Regimen").slice(0, 3).map((product: HomeProduct) => (
              <Link href={`/shop/${product.slug}`} key={product.id}>
                <FadeUpDiv className="group flex flex-col space-y-4 cursor-pointer h-full border border-transparent hover:border-earth/10 p-4 -m-4 rounded-xl transition-all">
                  <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 rounded-lg transition-transform duration-500 group-hover:shadow-lg">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm">Product Image</div>
                    )}
                  </div>
                  <div className="space-y-2 flex-grow flex flex-col">
                    <p className="text-xs font-semibold text-bronze uppercase tracking-wider">{product.ritualName || "Regimen"}</p>
                    <h3 className="text-xl font-serif text-earth">{product.name}</h3>
                    <p className="text-sm text-earth/70 line-clamp-2 flex-grow">{product.description || ""}</p>
                    <p className="text-earth font-medium pt-2">
                      {product.variants?.[0] ? <PriceDisplay amountInCents={product.variants[0].priceInCents} /> : "Sold Out"}
                    </p>
                  </div>
                </FadeUpDiv>
              </Link>
            )) : (
              <div className="col-span-1 md:col-span-3 text-center py-12 text-earth/60 font-light">
                No signature regimens available at the moment.
              </div>
            )}
          </StaggerDiv>
          
          <Link href="/shop" className="md:hidden inline-flex mt-12 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors w-full justify-center">
            Explore All Regimens
          </Link>
        </div>
      </StaggerSection>

      {/* 5. Ingredient Philosophy */}
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
            <FadeUpH2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">Ingredient Heritage</FadeUpH2>
            <FadeUpP className="text-cream/80 text-lg leading-relaxed">
              We source directly from the earth, focusing on materials revered for centuries. From African Black Soap to Baobab and wild-harvested clays, each element is chosen for its functional power and cultural resonance.
            </FadeUpP>
            <StaggerSection className="space-y-6 pt-4">
              <FadeUpDiv className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Rhassoul Clay</h4>
                <p className="text-sm text-cream/70">Mined from the Atlas Mountains, this mineral-rich clay purifies without stripping.</p>
              </FadeUpDiv>
              <FadeUpDiv className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Kalahari Melon Seed</h4>
                <p className="text-sm text-cream/70">A resilient desert oil providing intense, lightweight hydration to parched strands.</p>
              </FadeUpDiv>
            </StaggerSection>
            <FadeUpDiv className="pt-8">
              <Link href="/ingredients">
                <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">Discover Our Ingredients</Button>
              </Link>
            </FadeUpDiv>
          </StaggerSection>
        </div>
      </FadeUpSection>

      {/* 6. Hero Scent / Olfactory Spotlight */}
      {featuredScentProduct && (
        <section className="py-24 px-6 bg-ink text-cream">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <FadeUpDiv className="relative aspect-[3/4] w-full bg-earth/20 overflow-hidden">
              {featuredScentProduct.images?.[0] && featuredScentProduct.images[0] !== "Product Image Placeholder" ? (
                <img
                  src={featuredScentProduct.images[0]}
                  alt={featuredScentProduct.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-cream/20 font-serif uppercase tracking-widest text-sm">Product Image</div>
              )}
            </FadeUpDiv>
            <FadeUpDiv className="space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">Olfactory Regimen</p>
              <h2 className="text-4xl md:text-5xl font-serif text-cream leading-tight">{featuredScentProduct.name}</h2>
              {featuredScentProduct.functionalTitle && (
                <p className="text-xl text-cream/50 font-light">{featuredScentProduct.functionalTitle}</p>
              )}
              <p className="text-cream/70 text-lg font-light leading-relaxed line-clamp-4">{featuredScentProduct.description}</p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start">
                <Link href={`/shop/${featuredScentProduct.slug}`}>
                  <Button className="bg-cream text-earth hover:bg-stone">Discover the Scent</Button>
                </Link>
                <Link href="/shop" className="inline-flex items-center text-sm text-cream/50 hover:text-cream transition-colors border-b border-transparent hover:border-cream pb-0.5 self-center">
                  Explore All Olfactory
                </Link>
              </div>
            </FadeUpDiv>
          </div>
        </section>
      )}

      {/* 7. From the Journal */}
      {featuredArticle && (
        <section className="py-24 px-6 bg-cream border-t border-earth/10">
          <div className="max-w-[1440px] mx-auto">
            <FadeUpDiv className="text-center mb-16 space-y-2">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">From the Journal</h2>
              <h3 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest">The Dispatch</h3>
            </FadeUpDiv>

            <FadeUpDiv className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full bg-stone overflow-hidden">
                {featuredArticle.featuredImage ? (
                  <img
                    src={featuredArticle.featuredImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">
                    Editorial Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-xs font-semibold tracking-widest uppercase text-bronze">
                  <span>{featuredArticle.category}</span>
                  <span className="text-earth/30">•</span>
                  <span className="text-earth/50">
                    {new Date(featuredArticle.datePublished).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                <h4 className="text-3xl md:text-4xl font-serif text-earth leading-tight">
                  {featuredArticle.title}
                </h4>
                <p className="text-earth/70 text-lg font-light leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link href={`/journal/${featuredArticle.slug}`}>
                    <Button>Read the Dispatch</Button>
                  </Link>
                  <Link href="/journal" className="inline-flex items-center text-sm text-earth/60 hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-0.5 self-center">
                    View All Journal Entries
                  </Link>
                </div>
              </div>
            </FadeUpDiv>
          </div>
        </section>
      )}

      {/* 8. Editorial & Community Voices */}
      {featuredReviews.length > 0 && (
        <StaggerSection className="py-24 px-6 bg-sand border-t border-earth/10">
          <div className="max-w-5xl mx-auto text-center space-y-16">
            <FadeUpDiv className="space-y-4">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">The Resonance</h2>
              <h3 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest">Voices of ORIGONÆ</h3>
            </FadeUpDiv>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {featuredReviews.map((review: FeaturedReview) => (
                <FadeUpDiv key={review.id} className="flex flex-col space-y-4 border-l border-earth/20 pl-6 hover:border-bronze transition-colors">
                  <div className="flex text-bronze text-sm space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? "text-bronze" : "text-earth/20"}>★</span>
                    ))}
                  </div>
                  <p className="text-earth/80 font-serif text-lg leading-relaxed italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="pt-2 space-y-0.5">
                    <p className="text-xs font-semibold tracking-[0.2em] text-earth uppercase">
                      — {review.user.name || "Verified Customer"}
                    </p>
                    <Link href={`/shop/${review.product.id}`} className="text-[10px] tracking-widest uppercase text-earth/40 hover:text-bronze transition-colors">
                      {review.product.name}
                    </Link>
                  </div>
                </FadeUpDiv>
              ))}
            </div>
          </div>
        </StaggerSection>
      )}

      {/* 9. Newsletter Capture */}
      <HomeNewsletterSection />

      {/* 10. Professional / Salon Invitation */}
      <FadeUpSection className="py-32 px-6 bg-stone flex flex-col items-center text-center">
        <div className="max-w-2xl space-y-8">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">For Professionals</h2>
          <p className="text-3xl md:text-5xl font-serif text-earth leading-snug">
            Elevate Your Salon Experience
          </p>
          <p className="text-base text-earth/80 pb-6 leading-relaxed">
            Partner with ORIGONÆ to offer exclusive regimens. We provide wholesale access, educational support, and premium positioning for discerning luxury salons.
          </p>
          <Link href="/salon">
            <Button>Apply for Partnership</Button>
          </Link>
        </div>
      </FadeUpSection>
    </div>
  );
}
