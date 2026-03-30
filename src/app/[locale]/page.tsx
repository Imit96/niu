import Image from "next/image";
import { ArrowRight, Phone, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StaggerSection, StaggerDiv, FadeUpDiv, FadeUpSection, FadeUpP, FadeUpH2 } from "@/components/ui/Motion";
import { getPublicProducts } from "@/app/actions/product";
import { getRecentArticles } from "@/app/actions/article";
import { HeroSection } from "@/components/layout/HeroSection";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Niu Skin Cosmetics — Glow Naturally. Live Confidently.",
  description: "Niu Skin Cosmetics offers science-backed, non-bleaching skincare formulated in the UK. Brighten, hydrate, and even your skin tone with Alpha Arbutin, Niacinamide & Vitamin C. Shop face care, body care, and combo sets.",
  openGraph: {
    title: "Niu Skin Cosmetics — Glow Naturally. Live Confidently.",
    description: "Science-backed, non-bleaching skincare formulated in the UK. Alpha Arbutin, Niacinamide & Vitamin C for radiant, healthy skin.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niu Skin Cosmetics — Glow Naturally. Live Confidently.",
    description: "Science-backed, non-bleaching skincare formulated in the UK.",
  },
};

// Niu Skin product CDN base
const CDN = "https://www.niuskincosmetics.com/cdn/shop/files";

const NIU_PRODUCTS = [
  {
    name: "Gentle Face Wash",
    slug: "niu-skin-gentle-face-cleanser",
    price: "₦4,600",
    image: `${CDN}/face_wash.png`,
    tag: "Best Seller",
    category: "Face Care",
  },
  {
    name: "Intensive Serum",
    slug: "niu-skin-serum-niacinamide-vitamin-c-hyaluronic-acid",
    price: "₦5,600",
    image: `${CDN}/serum.png`,
    tag: "Top Rated",
    category: "Face Care",
  },
  {
    name: "Bright & Clear Face Cream",
    slug: "bright-clear-face-cream",
    price: "₦6,400",
    image: `${CDN}/bright_cream.png`,
    tag: "New Formula",
    category: "Face Care",
  },
  {
    name: "480ml Body Lotion — Oudwood",
    slug: "480ml-niu-skin-perfumed-body-lotion-with-oudwood-neutral-fragrance",
    price: "₦8,600",
    image: `${CDN}/oudwood.png`,
    tag: "Fan Favourite",
    category: "Body Care",
  },
];

const VALUES = [
  {
    label: "Non-Bleaching Formula",
    body: "Formulated without bleaching agents — safe for all skin tones, naturally radiant results.",
  },
  {
    label: "UK Formulated",
    body: "Developed in the UK with globally sourced, scientifically proven skincare ingredients.",
  },
  {
    label: "All Skin Types",
    body: "Designed to work for every skin type, tone, and concern — from oily to sensitive.",
  },
  {
    label: "Brightening Science",
    body: "Alpha Arbutin, Niacinamide & Vitamin C work together for a radiant, even complexion.",
  },
];

const ROUTINE_STEPS = [
  {
    step: "01",
    title: "Cleanse",
    body: "Start with Gentle Face Wash to remove impurities while preserving your skin's natural moisture barrier.",
  },
  {
    step: "02",
    title: "Treat",
    body: "Apply Intensive Serum with Niacinamide, Vitamin C & Hyaluronic Acid to fade dark spots and even skin tone.",
  },
  {
    step: "03",
    title: "Moisturise",
    body: "Lock in hydration with Face Essence Lotion for a soft, radiant, all-day healthy glow.",
  },
  {
    step: "04",
    title: "Protect",
    body: "Complete your morning routine with SPF 50+ Platinum Sunscreen to shield against UV damage.",
  },
];

const REVIEWS = [
  {
    name: "Tare Marion",
    rating: 5,
    text: "It's perfect for me. My skin has never looked this clear and bright!",
    product: "Anti Acne & Oily Face Combo",
    date: "Mar 27, 2026",
  },
  {
    name: "Zainab Olamide",
    rating: 5,
    text: "Locked in love ❤️ — gives my body and face the glow they deserve.",
    product: "Face & Body Combo",
    date: "Mar 11, 2026",
  },
  {
    name: "Yetunde Oyelade",
    rating: 5,
    text: "Product is amazing and effective. My face has never been this clear until I switched to Niu Skin.",
    product: "Bright & Clear Face Cream",
    date: "Mar 3, 2026",
  },
  {
    name: "Vivian Obinali",
    rating: 5,
    text: "It works magic — I love the calm it brings to my face every day.",
    product: "Gentle Face Wash",
    date: "Jan 27, 2026",
  },
];

export const revalidate = 1800;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ products }, recentArticles, t] = await Promise.all([
    getPublicProducts({}, 1, 6, locale),
    getRecentArticles(3, locale),
    getTranslations("home"),
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* 1. Hero */}
      <div className="-mt-14 md:-mt-[104px]">
        <HeroSection />
      </div>

      {/* 2. Trust Bar */}
      <div className="bg-earth text-cream py-3 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs font-semibold uppercase tracking-widest">
          <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 fill-bronze text-bronze" /> 4.5 Stars — 362+ Reviews</span>
          <span className="hidden md:block text-cream/20" aria-hidden="true">|</span>
          <span>UK Formulated</span>
          <span className="hidden md:block text-cream/20" aria-hidden="true">|</span>
          <span>Non-Bleaching</span>
          <span className="hidden md:block text-cream/20" aria-hidden="true">|</span>
          <span>Free Delivery (Lagos)</span>
        </div>
      </div>

      {/* 3. Brand Manifesto */}
      <StaggerSection className="py-24 px-6 bg-cream flex flex-col items-center text-center overflow-hidden">
        <FadeUpDiv className="max-w-3xl space-y-6">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Our Promise</p>
          <p className="text-3xl md:text-5xl font-serif text-earth leading-[1.2] tracking-tight">
            Glow that lasts. Skin that thrives. Science you can trust.
          </p>
          <p className="text-sm md:text-base text-earth/60 max-w-xl mx-auto leading-relaxed font-light">
            Niu Skin Cosmetics delivers brightening, hydrating skincare formulated in the UK — without bleaching agents. For every skin type, every skin tone.
          </p>
          <Link href="/shop">
            <Button className="mt-2">Shop All Products</Button>
          </Link>
        </FadeUpDiv>
      </StaggerSection>

      {/* 4. Best Selling Products */}
      <FadeUpSection className="py-24 px-6 bg-stone border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Our Products</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Best Sellers</h2>
            <p className="text-sm text-earth/60 max-w-md mx-auto font-light">The products our customers reach for every day.</p>
          </div>
          <StaggerDiv className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {NIU_PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/shop`} className="group flex flex-col space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50">
                <div className="relative aspect-square overflow-hidden bg-cream rounded-sm">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05]"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-bronze text-cream px-2 py-0.5">{p.tag}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold tracking-widest text-clay uppercase">{p.category}</p>
                  <h3 className="text-sm font-semibold text-earth group-hover:text-clay transition-colors leading-snug">{p.name}</h3>
                  <p className="text-sm font-bold text-earth">{p.price}</p>
                </div>
              </Link>
            ))}
          </StaggerDiv>
          <div className="text-center">
            <Link href="/shop">
              <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                View All Products <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

      {/* 5. Combo Spotlight */}
      <StaggerSection className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeUpDiv className="relative aspect-square w-full bg-stone/10 overflow-hidden rounded-sm">
            <Image
              src={`${CDN}/bright_Clear_No.5_combo.png`}
              alt="Anti Acne & Oily Face & Body Combo — Niu Skin Cosmetics"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 transition-transform duration-700 hover:scale-[1.03]"
              unoptimized
            />
          </FadeUpDiv>
          <FadeUpDiv className="space-y-6">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-bronze uppercase">Complete Combo Set</p>
            <h2 className="text-4xl md:text-5xl font-serif text-cream leading-tight">Anti Acne & Oily Face & Body Combo</h2>
            <p className="text-xl text-cream/60 font-light">The Complete Clear Skin Solution</p>
            <p className="text-cream/70 text-base font-light leading-relaxed">
              Everything you need for clearer, brighter skin — face and body. Includes our Gentle Face Wash, Intensive Serum, Bright & Clear Toner, Face Cream, 480ml Body Lotion, 800ml Body Wash, plus a free Sheet Mask gift.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-bronze">₦39,400</span>
              <span className="text-cream/40 line-through text-lg">₦42,600</span>
              <span className="text-[10px] bg-bronze text-cream font-bold px-2 py-0.5 uppercase tracking-wider">Save ₦3,200</span>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/shop">
                <Button className="bg-bronze text-earth hover:bg-bronze/90">Shop This Combo</Button>
              </Link>
              <Link href="/bundles" className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-cream transition-colors border-b border-transparent hover:border-cream pb-0.5 self-center">
                View All Combos <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </FadeUpDiv>
        </div>
      </StaggerSection>

      {/* 6. Brand Values */}
      <FadeUpSection className="py-24 px-6 bg-sand border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center space-y-3 mb-14">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Why Niu Skin</p>
            <h2 className="text-3xl md:text-4xl font-serif text-earth">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {VALUES.map((v) => (
              <div key={v.label} className="space-y-3 border-t-2 border-clay pt-6">
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-clay">{v.label}</h3>
                <p className="text-sm text-earth/65 font-light leading-[1.75]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUpSection>

      {/* 7. Face & Body Category Split */}
      <FadeUpSection className="py-24 px-6 bg-cream border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Browse by Category</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Shop by Concern</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Face Care", sub: "Cleanse · Treat · Glow", href: "/skin", bg: "bg-stone" },
              { label: "Body Care", sub: "Lotions · Body Wash · Sets", href: "/hair", bg: "bg-sand" },
              { label: "Combo Sets", sub: "Complete Solutions", href: "/bundles", bg: "bg-earth" },
            ].map((cat, i) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group relative flex flex-col items-center justify-center aspect-[5/4] overflow-hidden ${cat.bg} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/60`}
              >
                {i === 0 && (
                  <Image src={`${CDN}/face_wash.png`} alt="Face Care" fill className="object-contain p-8 opacity-60 group-hover:opacity-80 transition-opacity duration-500" unoptimized />
                )}
                {i === 1 && (
                  <Image src={`${CDN}/oudwood.png`} alt="Body Care" fill className="object-contain p-8 opacity-60 group-hover:opacity-80 transition-opacity duration-500" unoptimized />
                )}
                {i === 2 && (
                  <Image src={`${CDN}/advanced_acne.png`} alt="Combo Sets" fill className="object-contain p-8 opacity-40 group-hover:opacity-60 transition-opacity duration-500" unoptimized />
                )}
                <div className={`absolute inset-0 ${i === 2 ? "bg-earth/40" : "bg-cream/10"}`} />
                <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 text-center">
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-2 text-earth/60">{cat.sub}</span>
                  <span className={`text-xl font-serif tracking-[0.15em] uppercase ${i === 2 ? "text-cream" : "text-earth"}`}>{cat.label}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-clay scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </div>
        </div>
      </FadeUpSection>

      {/* 8. Skincare Routine Steps */}
      <FadeUpSection className="py-24 px-6 bg-sand border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-16">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">How It Works</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Your Daily Routine</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {ROUTINE_STEPS.map((s) => (
              <div key={s.step} className="space-y-5">
                <span className="text-6xl font-serif text-earth/8 select-none leading-none">{s.step}</span>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-clay border-t-2 border-clay pt-5">{s.title}</h3>
                <p className="text-sm text-earth/65 font-light leading-[1.75]">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/guides">
              <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                Explore Skincare Guides
              </Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

      {/* 9. Body Lotion Spotlight */}
      <StaggerSection className="py-24 px-6 bg-cream border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <FadeUpDiv className="space-y-6 order-last lg:order-first">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Body Care Spotlight</p>
            <h2 className="text-4xl md:text-5xl font-serif text-earth leading-tight">480ml Body Lotion — Oudwood</h2>
            <p className="text-xl text-earth/60 font-light">With Alpha Arbutin, Niacinamide & Vitamin C</p>
            <p className="text-earth/70 text-base font-light leading-relaxed">
              Enriched with skin-brightening actives and the luxurious Royal Exotic Oudwood fragrance. Non-bleaching, fast-absorbing, all-day moisture — in our signature gold bottle.
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-earth">₦8,600</span>
              <span className="text-earth/40 line-through">₦10,200</span>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/shop">
                <Button>Shop Body Care</Button>
              </Link>
              <Link href="/hair" className="inline-flex items-center gap-1.5 text-sm text-earth/60 hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-0.5 self-center">
                Explore All Body Care <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </FadeUpDiv>
          <FadeUpDiv className="relative aspect-square w-full bg-stone overflow-hidden rounded-sm">
            <Image
              src={`${CDN}/oudwood.png`}
              alt="480ml Niu Skin Body Lotion Oudwood"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 transition-transform duration-700 hover:scale-[1.03]"
              unoptimized
            />
          </FadeUpDiv>
        </div>
      </StaggerSection>

      {/* 10. Customer Reviews */}
      <FadeUpSection className="py-24 px-6 bg-stone border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Customer Love</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-bronze text-bronze" />
              ))}
              <span className="text-sm text-earth/60 ml-2 font-light">4.46 / 5 — 362 reviews</span>
            </div>
          </div>
          <StaggerDiv className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-cream p-6 space-y-4 rounded-sm">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-bronze text-bronze" />
                  ))}
                </div>
                <p className="text-sm text-earth/80 font-light leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                <div className="border-t border-earth/10 pt-3 space-y-0.5">
                  <p className="text-xs font-semibold text-earth">{r.name}</p>
                  <p className="text-[10px] text-clay uppercase tracking-wider font-medium">{r.product}</p>
                  <p className="text-[10px] text-earth/40">{r.date}</p>
                </div>
              </div>
            ))}
          </StaggerDiv>
        </div>
      </FadeUpSection>

      {/* 11. Ingredient Highlights */}
      <FadeUpSection className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square bg-stone/10 border border-stone/20 overflow-hidden rounded-sm flex items-center justify-center">
            <Image
              src={`${CDN}/serum.png`}
              alt="Niu Skin Intensive Serum — Niacinamide, Vitamin C & Hyaluronic Acid"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-10"
              unoptimized
            />
          </div>
          <StaggerSection className="space-y-8 max-w-xl">
            <FadeUpH2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">Key Ingredients</FadeUpH2>
            <FadeUpP className="text-cream/80 text-base leading-relaxed">
              Every Niu Skin formula is built around scientifically proven active ingredients — sourced globally, tested rigorously, and formulated to deliver real, visible results.
            </FadeUpP>
            <StaggerSection className="space-y-6 pt-4">
              <FadeUpDiv className="flex flex-col space-y-1 border-l-2 border-bronze pl-4">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Alpha Arbutin</h4>
                <p className="text-sm text-cream/70">Reduces melanin production to fade dark spots and even skin tone — without bleaching.</p>
              </FadeUpDiv>
              <FadeUpDiv className="flex flex-col space-y-1 border-l-2 border-bronze pl-4">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Niacinamide (Vitamin B3)</h4>
                <p className="text-sm text-cream/70">Brightens, minimises pores, controls oil, and strengthens the skin barrier.</p>
              </FadeUpDiv>
              <FadeUpDiv className="flex flex-col space-y-1 border-l-2 border-bronze pl-4">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Hyaluronic Acid</h4>
                <p className="text-sm text-cream/70">Draws moisture deep into the skin for a plumper, visibly hydrated complexion all day long.</p>
              </FadeUpDiv>
            </StaggerSection>
            <FadeUpDiv className="pt-4">
              <Link href="/ingredients">
                <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">
                  Explore All Ingredients
                </Button>
              </Link>
            </FadeUpDiv>
          </StaggerSection>
        </div>
      </FadeUpSection>

      {/* 12. Kids Range Callout */}
      <FadeUpSection className="py-20 px-6 bg-sand border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.35em] text-clay uppercase">For Your Little Ones</p>
            <h2 className="text-2xl md:text-3xl font-serif text-earth leading-snug">Niu Kids Gentle Care Range</h2>
            <p className="text-sm text-earth/60 leading-relaxed">Mild, hypoallergenic formulas specially designed for babies and children — gentle on delicate skin.</p>
          </div>
          <div className="shrink-0">
            <Link href="/shop">
              <Button className="bg-earth text-cream hover:bg-ink whitespace-nowrap">Shop Kids Range</Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>

      {/* 13. Find a Store / Distributor */}
      <FadeUpSection className="py-24 px-6 bg-cream border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">Near You</p>
            <h2 className="text-3xl md:text-4xl font-serif text-earth">Find a Niu Skin Store</h2>
            <p className="text-sm text-earth/60 max-w-md mx-auto">Shop online or find an authorised distributor close to you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-stone p-8 space-y-4 text-center rounded-sm border border-earth/10">
              <div className="w-10 h-10 bg-clay rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5 text-cream" />
              </div>
              <h3 className="font-serif text-xl text-earth">Lagos Stores</h3>
              <p className="text-sm text-earth/60 font-light">Find authorised Niu Skin distributors across Lagos.</p>
              <Link href="/distributors">
                <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream w-full">
                  Find Lagos Stores
                </Button>
              </Link>
            </div>
            <div className="bg-stone p-8 space-y-4 text-center rounded-sm border border-earth/10">
              <div className="w-10 h-10 bg-clay rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5 text-cream" />
              </div>
              <h3 className="font-serif text-xl text-earth">Outside Lagos</h3>
              <p className="text-sm text-earth/60 font-light">Find distributors & retailers across Nigeria.</p>
              <Link href="/distributors">
                <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream w-full">
                  Find Your Area
                </Button>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-earth/50">
              Or call us directly:{" "}
              <a href="tel:+2349060486962" className="text-clay font-semibold hover:underline">
                +234 906 048 6962
              </a>
            </p>
          </div>
        </div>
      </FadeUpSection>

      {/* 14. From the Journal */}
      {recentArticles.length > 0 && (
        <section className="py-24 px-6 bg-sand border-t border-earth/10">
          <div className="max-w-[1440px] mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-semibold tracking-[0.35em] text-clay uppercase">From the Blog</p>
                <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Skincare Insights</h2>
              </div>
              <Link href="/journal" className="hidden md:inline-flex items-center gap-1.5 text-earth font-medium border-b border-earth pb-1 hover:text-clay hover:border-clay transition-colors shrink-0">
                View All Articles <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
            <StaggerDiv className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article: any) => (
                <Link href={`/journal/${article.slug}`} key={article.id} className="group flex flex-col space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 rounded-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone rounded-sm">
                    {article.featuredImage ? (
                      <Image src={article.featuredImage} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    ) : (
                      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest text-sm">Skincare Tips</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-clay">
                      <span>{article.category}</span>
                      <span className="text-earth/30" aria-hidden="true">•</span>
                      <span className="text-earth/50 font-normal normal-case tracking-normal">
                        {new Date(article.datePublished).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif text-earth leading-snug group-hover:text-clay transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-earth/60 font-light leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </StaggerDiv>
          </div>
        </section>
      )}

    </div>
  );
}
