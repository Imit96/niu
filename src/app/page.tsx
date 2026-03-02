"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

// Standard fade up variant
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

// Staggered grid container
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  const manifestoRef = useRef(null);
  const isManifestoInView = useInView(manifestoRef, { once: true, margin: "-100px" });

  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, margin: "-100px" });
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-earth">
        <Image 
          src="/hero.png"
          alt="African Heritage Regimen - Origonae Hero"
          fill
          priority
          className="object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-ink/30 z-10 mix-blend-multiply" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-6"
        >
          <motion.h1 
            variants={fadeUpVariant}
            className="text-5xl md:text-7xl font-serif text-cream uppercase tracking-widest leading-tight"
          >
            Ancestral Energy Refined
          </motion.h1>
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-cream/90 font-light max-w-2xl tracking-wide"
          >
            Luxury regimen haircare rooted in broader African heritage. Earthy, modern, and intentional.
          </motion.p>
          <motion.div 
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-12"
          >
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-cream text-earth hover:bg-stone">Shop Regimens</Button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full border-cream text-cream hover:bg-cream hover:text-earth">Discover the Philosophy</Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Brand Manifesto */}
      <section className="py-24 px-6 bg-cream flex flex-col items-center text-center" ref={manifestoRef}>
        <motion.div 
          initial="hidden"
          animate={isManifestoInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="max-w-3xl space-y-8"
        >
          <motion.h2 variants={fadeUpVariant} className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">The Manifesto</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-2xl md:text-4xl font-serif text-earth leading-relaxed">
            ORIGONAE is regimen. ORIGONAE is grounded luxury. ORIGONAE is ancestral energy refined. ORIGONAE is culture, edited. ORIGONAE is power without noise.
          </motion.p>
          <motion.p variants={fadeUpVariant} className="text-base text-earth/80 max-w-2xl mx-auto pt-4 leading-loose">
            We merge regimen-based beauty with true cultural reverence. High craftsmanship meets intentional beauty, honoring the materials of the earth to create a sacred, modern experience for your hair and spirit.
          </motion.p>
        </motion.div>
      </section>

      {/* 3. Featured Regimen Collection */}
      <section className="py-24 px-6 bg-sand" ref={gridRef}>
        <div className="max-w-[1440px] mx-auto">
          <motion.div 
            initial="hidden"
            animate={isGridInView ? "visible" : "hidden"}
            variants={fadeUpVariant}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-wide">Signature Regimens</h2>
              <p className="text-earth/80 text-lg">Experience our most revered collections, designed to cleanse, restore, and elevate.</p>
            </div>
            <Link href="/shop" className="hidden md:inline-flex mt-6 md:mt-0 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
              Explore All Regimens
            </Link>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate={isGridInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((item) => (
              <motion.div variants={fadeUpVariant} key={item} className="group flex flex-col space-y-4 cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 transition-transform duration-500 group-hover:scale-[1.02] group-hover:shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm">Product Image {item}</div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-bronze uppercase tracking-wider">The Cleansing Regimen</p>
                  <h3 className="text-xl font-serif text-earth">Purifying Clay Wash</h3>
                  <p className="text-sm text-earth/70 line-clamp-2">A deeply cleansing, earthy blend that removes buildup while respecting the scalp&apos;s natural oils.</p>
                  <p className="text-earth font-medium pt-2">₦ 25,000</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <Link href="/shop" className="md:hidden inline-flex mt-12 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors w-full justify-center">
            Explore All Regimens
          </Link>
        </div>
      </section>

      {/* 4. Ingredient Philosophy */}
      <section className="py-24 px-6 bg-earth text-cream">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square md:aspect-[4/3] bg-stone/10 border border-stone/20 overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center text-cream/40 uppercase tracking-widest font-serif text-sm">Ingredient Texture</div>
          </div>
          <div className="space-y-8 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">Ingredient Heritage</h2>
            <p className="text-cream/80 text-lg leading-relaxed">
              We source directly from the earth, focusing on materials revered for centuries. From African Black Soap to Baobab and wild-harvested clays, each element is chosen for its functional power and cultural resonance.
            </p>
            <div className="space-y-6 pt-4">
              <div className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Rhassoul Clay</h4>
                <p className="text-sm text-cream/70">Mined from the Atlas Mountains, this mineral-rich clay purifies without stripping.</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h4 className="font-serif text-xl tracking-wide text-bronze">Kalahari Melon Seed</h4>
                <p className="text-sm text-cream/70">A resilient desert oil providing intense, lightweight hydration to parched strands.</p>
              </div>
            </div>
            <div className="pt-8">
              <Link href="/ingredients">
                <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">Discover Our Ingredients</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Professional / Salon Invitation */}
      <section className="py-32 px-6 bg-stone flex flex-col items-center text-center">
        <div className="max-w-2xl space-y-8">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">For Professionals</h2>
          <p className="text-3xl md:text-5xl font-serif text-earth leading-snug">
            Elevate Your Salon Experience
          </p>
          <p className="text-base text-earth/80 pb-6 leading-relaxed">
            Partner with Originæ to offer exclusive regimens. We provide wholesale access, educational support, and premium positioning for discerning luxury salons.
          </p>
          <Link href="/salon">
            <Button>Apply for Partnership</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
