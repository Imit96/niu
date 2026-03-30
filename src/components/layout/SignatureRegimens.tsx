"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Info } from "lucide-react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  ritualName: string | null;
  functionalTitle: string | null;
  variants: { priceInCents: number }[];
}

interface Regimen {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  image: string | null;
  products: Product[];
}

interface SignatureRegimensProps {
  regimens: {
    hair: any;
    skin: any;
    scent: any;
  };
}

export function SignatureRegimens({ regimens }: SignatureRegimensProps) {
  const t = useTranslations("regimens");
  
  const sections = [
    {
      key: "hair",
      data: regimens.hair,
      title: t("hairTitle"), 
      label: t("hairShopAll"),
      href: "/hair",
      benefit: t("hairBenefit"),
      subBenefit: t("hairSubBenefit"),
      bgColor: "bg-cream",
    },
    {
      key: "skin",
      data: regimens.skin,
      title: t("skinTitle"), 
      label: t("skinShopAll"),
      href: "/skin",
      benefit: t("skinBenefit"),
      subBenefit: t("skinSubBenefit"),
      bgColor: "bg-sand/30",
    },
    {
      key: "scent",
      data: regimens.scent,
      title: t("scentTitle"), 
      label: t("scentShopAll"),
      href: "/scent",
      benefit: t("scentBenefit"),
      subBenefit: t("scentSubBenefit"),
      bgColor: "bg-cream",
    },
  ];

  return (
    <div className="flex flex-col w-full border-t border-earth/10">
      {sections.map((section) => {
        if (!section.data) return null;
        
        return (
          <section key={section.key} className={cn("py-20 px-6 md:px-12 overflow-hidden border-b border-earth/10 last:border-b-0", section.bgColor)}>
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-24">
              
              {/* Left Column - Hero Text */}
              <div className="flex flex-col justify-between py-4 space-y-12 min-h-[300px]">
                 <div className="space-y-10">
                    <Link href={section.href} className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-earth border-b border-earth/20 pb-1 hover:text-bronze hover:border-bronze transition-all flex items-center group w-fit">
                        {section.label}
                    </Link>
                    
                    <div className="space-y-5">
                        <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-bronze uppercase">
                            {section.benefit}
                        </p>
                        <h2 className="text-4xl md:text-6xl font-serif text-earth uppercase leading-[1.05] tracking-tight">
                            {section.title}
                        </h2>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-earth/10 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border border-earth/20 flex items-center justify-center text-earth/30">
                        <Info className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-[13px] md:text-sm text-earth/60 font-light lowercase leading-relaxed max-w-[240px]">
                        {section.subBenefit}
                    </p>
                 </div>
              </div>

              {/* Right Column - Horizontal Carousel */}
              <div className="relative">
                <div className="flex overflow-x-auto gap-4 md:gap-5 pb-6 scrollbar-none snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0">
                    {section.data.products?.map((product: any) => (
                        <Link
                            key={product.id}
                            href={`/shop/${product.slug}`}
                            className="flex-shrink-0 w-[185px] md:w-[220px] snap-start group/card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:ring-offset-2 rounded-2xl"
                        >
                            <div className="relative aspect-[4/5] w-full bg-[#EAE7E0] overflow-hidden rounded-2xl transition-all duration-700 group-hover/card:shadow-xl group-hover/card:-translate-y-1">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 260px, 320px"
                                        className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-earth/10 font-serif uppercase tracking-widest text-sm">Product</div>
                                )}
                                <div className="absolute inset-0 bg-earth/0 group-hover/card:bg-earth/5 transition-colors duration-700" />
                            </div>
                            <div className="mt-4 space-y-1 px-1">
                                <h3 className="text-sm md:text-base font-serif text-earth group-hover/card:text-bronze transition-colors flex items-center justify-between leading-snug">
                                    {product.name}
                                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-500" />
                                </h3>
                                <p className="text-xs font-medium text-earth/60 flex items-center gap-1.5">
                                    From <PriceDisplay amountInCents={product.variants?.[0]?.priceInCents ?? 0} />
                                </p>
                            </div>
                        </Link>
                    ))}
                    
                    {/* Final CTA Card */}
                    <div className="flex-shrink-0 w-[140px] md:w-[180px] snap-start pr-6 lg:pr-0">
                        <Link
                            href={section.href}
                            className="w-full h-[231px] md:h-[275px] flex flex-col items-center justify-center space-y-4 bg-earth/5 rounded-2xl group/btn hover:bg-earth transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:ring-offset-2"
                        >
                            <div className="w-12 h-12 rounded-full border border-earth/20 flex items-center justify-center bg-white text-earth group-hover/btn:scale-110 transition-transform duration-500">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-earth group-hover/btn:text-white transition-colors">
                                Explore All
                            </p>
                        </Link>
                    </div>
                </div>
              </div>

            </div>
          </section>
        );
      })}
    </div>
  );
}
