import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import AddToCartButton from "@/app/[locale]/shop/[id]/AddToCartButton";
import { getTranslations } from "next-intl/server";
import { getIngredientBySlug } from "@/app/actions/content";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const ingredient = await getIngredientBySlug(slug, locale);
  if (!ingredient) return { title: "Ingredient Not Found | ORIGONÆ" };
  return {
    title: `${ingredient.name} | ORIGONÆ Glossary`,
    description: ingredient.description.substring(0, 160),
  };
}

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const [ingredient, t] = await Promise.all([
    getIngredientBySlug(slug, locale),
    getTranslations("ingredients"),
  ]);

  if (!ingredient) notFound();

  const imgAny = ingredient as any;
  const imgTransform = parseImageTransform(imgAny.imagePosition);

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Editorial Header */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-earth">
        {imgAny.image && (
          <div className="absolute inset-0 overflow-hidden">
            <div style={transformStyle(imgTransform)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgAny.image}
                alt={ingredient.name}
                className="w-full h-full object-cover opacity-40"
              />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-ink/30 z-10 mix-blend-multiply" />
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-4 pt-20">
          <span className="text-xs font-semibold tracking-[0.3em] text-bronze uppercase">
            {ingredient.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-widest leading-tight">
            {ingredient.name}
          </h1>
          {ingredient.origin && (
            <p className="text-sm md:text-base text-cream/70 tracking-[0.2em] uppercase font-light border-t border-cream/20 pt-4 mt-4">
              Origin: {ingredient.origin}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Benefits */}
        <div className="lg:col-span-4 space-y-12">
          {ingredient.benefitsText && (
            <div className="bg-cream/40 p-8 border border-earth/10">
              <h3 className="text-sm font-semibold tracking-[0.2em] text-earth uppercase mb-6 border-b border-earth/10 pb-4">
                {t("functionalBenefits")}
              </h3>
              <p className="text-earth/80 text-sm leading-relaxed whitespace-pre-wrap">
                {ingredient.benefitsText}
              </p>
            </div>
          )}
          <div className="block">
            <Link href="/ingredients" className="inline-flex items-center text-xs tracking-widest uppercase text-earth hover:text-bronze transition-colors">
              &larr; {t("backToGlossary")}
            </Link>
          </div>
        </div>

        {/* Right Column: Narrative + Products */}
        <div className="lg:col-span-8 space-y-12">
          <div className="prose prose-earth max-w-none">
            <h2 className="text-3xl font-serif text-earth mb-6">{t("theHeritage")}</h2>
            <p className="text-lg text-earth/80 leading-relaxed font-light whitespace-pre-wrap">
              {ingredient.description}
            </p>
          </div>

          {/* Formulated In */}
          <div className="pt-16 border-t border-earth/10">
            <h3 className="text-2xl font-serif text-earth mb-8">{t("formulatedIn")}</h3>
            {ingredient.products.length === 0 ? (
              <p className="text-earth/60 italic font-light">{t("comingSoon")}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-stone border border-ash/20">
                {ingredient.products.map((product) => {
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
