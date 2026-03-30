"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { StaggerDiv, FadeUpDiv, FadeUpH1, FadeUpP } from "@/components/ui/Motion";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  imageSrc?: string;
  className?: string;
}

const CDN = "https://www.niuskincosmetics.com/cdn/shop/files";

const CATEGORIES = [
  {
    key: "bestSellers",
    href: "/shop",
    image: `${CDN}/face_wash.png`,
    unoptimized: true,
  },
  {
    key: "faceAndBody",
    href: "/skin",
    image: `${CDN}/serum.png`,
    unoptimized: true,
  },
  {
    key: "handCare",
    href: "/skin",
    image: `${CDN}/bright_cream.png`,
    unoptimized: true,
  },
  {
    key: "curatedSets",
    href: "/bundles",
    image: `${CDN}/advanced_acne.png`,
    unoptimized: true,
  },
  {
    key: "customSet",
    href: "/shop",
    image: `${CDN}/oudwood.png`,
    unoptimized: true,
  },
];

export function HeroSection({ imageSrc = "/hero.png", className }: HeroSectionProps) {
  const tHero = useTranslations("home.heroV2");
  const tCat = useTranslations("home.categoriesV2");
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force play on mount to bypass aggressive mobile browser autoplay restrictions
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser:", err);
      });
    }
  }, []);

  return (
    <div className={cn("w-full flex flex-col", className)}>
      {/* 
        --- 1. FULL SCREEN HERO PART ---
        Occupies 100vh. Ready for background video replacement.
      */}
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        {/* Background Media Container (Ready for <video> swap) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0"
          initial={shouldReduceMotion ? { opacity: 0 } : { scale: 1.05, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0.3 } : { duration: 1.8, ease: [0.33, 1, 0.68, 1] }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          >
            <source src="/Woman%20Holding%20Cotton%20Mar%2030.mp4" type="video/mp4" />
          </video>
          
          {/* Media Overlays */}
          <div className="absolute inset-0 z-10 bg-black/30 md:bg-black/20" />
          <div 
            className="absolute inset-0 z-10" 
            style={{ 
              background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.4) 100%)" 
            }} 
          />
        </motion.div>

        {/* Content Container - Anchored Bottom-Left */}
        <div className="relative z-30 h-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-20 flex items-end pb-16 md:pb-24 lg:pb-32">
          <StaggerDiv className="max-w-[750px] flex flex-col gap-6 md:gap-8">
            <FadeUpH1 className="text-4xl md:text-6xl lg:text-[72px] font-serif text-white leading-[1.02] tracking-tight">
              {tHero("tagline")}
            </FadeUpH1>

            <FadeUpP className="text-[15px] md:text-[17px] text-white/90 font-sans max-w-[500px] leading-relaxed tracking-[0.02em]">
              {tHero("description")}
            </FadeUpP>

            <FadeUpDiv className="flex flex-col sm:flex-row gap-5 mt-2">
              <Link href="/shop">
                <Button 
                  className="w-full sm:w-auto bg-white hover:bg-[#F4F1EC] text-[#2A2A2A] px-12 h-12 uppercase tracking-[0.25em] rounded-none text-[10px] font-bold transition-all duration-300 border-0 shadow-lg"
                >
                  {tHero("ctaPrimary")}
                </Button>
              </Link>
              <Link href="/shop">
                <Button 
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/40 text-white hover:bg-white hover:text-[#2A2A2A] px-12 h-12 uppercase tracking-[0.25em] rounded-none text-[10px] font-bold transition-all duration-300"
                >
                  {tHero("ctaSecondary")}
                </Button>
              </Link>
            </FadeUpDiv>
          </StaggerDiv>
        </div>
      </section>

      {/* 
        --- 2. CATEGORY STRIP PART ---
        Moved below the screen-fold to allow the Hero to be fully immersive.
      */}
      <section className="w-full bg-cream border-b border-earth/10 pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="overflow-x-auto scrollbar-none pb-4">
            <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 min-w-max sm:min-w-0">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className="relative w-[220px] h-[150px] sm:w-auto sm:h-[180px] lg:h-[220px] rounded-xl overflow-hidden group block shrink-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  aria-label={tCat(cat.key)}
                >
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ scale: 1 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <Image
                      src={cat.image}
                      alt={tCat(cat.key)}
                      fill
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 33vw, 20vw"
                      className="object-contain p-4 bg-cream"
                      unoptimized={cat.unoptimized}
                    />
                  </motion.div>

                  {/* Light Bar Label */}
                  <div className="absolute left-0 right-0 bottom-0 z-20 h-11 md:h-12 bg-earth/90 backdrop-blur-[4px] flex items-center justify-center border-t border-clay/30">
                    <span className="text-cream text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-center px-4">
                      {tCat(cat.key)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
