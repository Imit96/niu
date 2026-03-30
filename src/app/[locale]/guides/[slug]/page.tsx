import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getGuideBySlug } from "@/app/actions/content";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";
import AddToCartButton from "@/app/[locale]/shop/[id]/AddToCartButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const guide = await getGuideBySlug(slug, locale);
  if (!guide) return { title: "Guide Not Found | ORIGONÆ" };
  return {
    title: `${guide.title} | ORIGONÆ`,
    description: guide.description.substring(0, 160),
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const [guide, t] = await Promise.all([
    getGuideBySlug(slug, locale),
    getTranslations("guides"),
  ]);

  if (!guide) notFound();

  const guideAny = guide as any;
  const guideTransform = parseImageTransform(guideAny.imagePosition);
  const guideProducts = (guideAny.products ?? []) as {
    id: string;
    slug: string;
    name: string;
    functionalTitle: string | null;
    images: string[];
    variants: { id: string; priceInCents: number; size: string | null; inventoryCount: number }[];
  }[];

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-earth">
        {guide.image && (
          <div className="absolute inset-0 overflow-hidden">
            <div style={transformStyle(guideTransform)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full h-full object-cover opacity-40"
              />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-ink/40 z-10 mix-blend-multiply" />
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-6 pt-20">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-bronze uppercase">
            {t("theGuide")}
          </h2>
          <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-widest leading-tight">
            {guide.title}
          </h1>
          <p className="text-lg md:text-xl text-cream/80 font-light max-w-2xl tracking-wide">
            {t("methodLabel", { number: String(guide.methodNumber || "") })}
          </p>
        </div>
      </section>

      {/* Description + Guide Essentials */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Philosophy */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-cream/40 p-8 border border-earth/10">
            <h3 className="text-sm font-semibold tracking-[0.2em] text-earth uppercase mb-6 border-b border-earth/10 pb-4">
              {t("thePhilosophy")}
            </h3>
            <p className="text-earth/80 text-sm leading-relaxed whitespace-pre-wrap">
              {guide.description}
            </p>
          </div>
        </div>

        {/* Right: Guide Essentials */}
        <div className="lg:col-span-8 space-y-12">
          <div className="pt-0">
            <h3 className="text-2xl font-serif text-earth mb-8">{t("guideEssentials")}</h3>
            {guideProducts.length === 0 ? (
              <p className="text-earth/60 italic font-light text-sm">Products for this guide are being curated.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-stone border border-ash/20">
                {guideProducts.map((product) => {
                  const primaryVariant = product.variants[0];
                  return (
                    <div key={product.id} className="group flex space-x-4 bg-cream p-4 border border-earth/5 hover:border-earth/20 transition-all">
                      <Link href={`/shop/${product.slug}`} className="relative w-20 h-24 bg-stone shrink-0 border border-ash/30 overflow-hidden">
                        {product.images?.[0] && product.images[0] !== "Product Image Placeholder" && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </Link>
                      <div className="flex flex-col justify-center flex-1">
                        <Link href={`/shop/${product.slug}`}>
                          <h4 className="text-sm font-serif text-earth group-hover:text-bronze transition-colors leading-tight mb-1">
                            {product.name}
                          </h4>
                          <p className="text-[10px] uppercase tracking-widest text-earth/60 line-clamp-1 mb-2">
                            {product.functionalTitle || "Regimen"}
                          </p>
                        </Link>
                        {primaryVariant && (
                          <AddToCartButton
                            id={primaryVariant.id}
                            productId={product.id}
                            slug={product.slug}
                            name={product.name}
                            priceInCents={primaryVariant.priceInCents}
                            size={primaryVariant.size || ""}
                            image={product.images[0] || ""}
                            inventoryCount={primaryVariant.inventoryCount}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
