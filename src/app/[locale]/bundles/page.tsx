import { getPublicBundles } from "@/app/actions/bundle-admin";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";

export const metadata = {
  title: "Ritual Bundles | ORIGONÆ",
  description: "Curated collections of our finest regimens at exclusive values.",
};

export default async function BundlesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [bundles, t] = await Promise.all([
    getPublicBundles(locale),
    getTranslations("bundles"),
  ]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Intro */}
      <section className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6 border-b border-cream/20 pb-6 inline-block">{t("title")}</h1>
        <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light mt-4">
          Complete, holistic regimens curated for transformative results. Offered at an exclusive value to honor your commitment to foundational beauty.
        </p>
      </section>

      {/* Grid */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full">
        {bundles.length === 0 ? (
           <div className="text-center py-24 text-earth/60 font-serif text-lg border border-earth/10">
              {t("curating")}
           </div>
        ) : (
          <div className="flex flex-col space-y-24">
            {bundles.map((bundle, idx) => {
              const isEven = idx % 2 === 0;
              const retailValue = bundle.products.reduce((acc, product) => {
                 return acc + (product.variants[0]?.priceInCents || 0);
              }, 0);

              const bundleImage = (bundle as any).image as string | null;
              const bundleTransform = parseImageTransform((bundle as any).imagePosition);
              const firstProductImage = bundle.products.find(p => p.images?.[0])?.images[0];

              return (
                <div key={bundle.slug} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                  <Link href={`/bundles/${bundle.slug}`} className="w-full md:w-1/2">
                    <div className="relative aspect-square bg-stone border border-earth/10 overflow-hidden hover:scale-[1.01] transition-transform duration-700">
                       {bundleImage ? (
                         /* Dedicated bundle image with zoom+pan crop */
                         <div style={transformStyle(bundleTransform)}>
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={bundleImage} alt={bundle.name} className="w-full h-full object-cover" />
                         </div>
                       ) : firstProductImage ? (
                         /* Fallback: layered product image */
                         <div className="absolute inset-0 p-8 flex items-center justify-center">
                           <div className="relative w-3/4 h-3/4">
                             <Image src={firstProductImage} alt={bundle.name} fill className="object-cover shadow-2xl" />
                             <div className="absolute inset-x-8 -bottom-8 h-full bg-cream/10 backdrop-blur-sm -z-10 translate-x-4 mix-blend-multiply" />
                           </div>
                         </div>
                       ) : (
                         <div className="absolute inset-0 flex items-center justify-center text-center text-earth/30 uppercase tracking-[0.3em] font-serif text-sm px-8 leading-loose">
                           Original {bundle.name}
                         </div>
                       )}
                    </div>
                  </Link>
                  <div className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
                    <h2 className="text-xs font-semibold tracking-[0.2em] text-bronze uppercase">{t("exclusiveAssembly")}</h2>
                    <h3 className="text-3xl lg:text-5xl font-serif text-earth leading-tight">{bundle.name}</h3>
                    <p className="text-earth/80 text-lg leading-relaxed max-w-md">
                      {bundle.description}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-earth/10 border-b pb-8">
                       <h4 className="text-xs uppercase tracking-widest text-earth/60 font-semibold mb-4">{t("includesCount", { count: bundle.products.length })}</h4>
                       <ul className="space-y-2">
                         {bundle.products.map(product => (
                           <li key={product.id} className="text-sm font-serif text-earth flex items-center space-x-2">
                             <span className="text-bronze text-[10px]">✦</span>
                             <span>{product.name}</span>
                             <span className="text-earth/40 text-xs tracking-widest line-clamp-1 truncate">- {product.functionalTitle}</span>
                           </li>
                         ))}
                       </ul>
                    </div>

                    <div className="flex items-end space-x-4 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-earth/50 line-through pr-2">Retail Value <PriceDisplay amountInCents={retailValue} /></span>
                        <PriceDisplay className="text-2xl font-medium text-earth" amountInCents={bundle.priceInCents} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href={`/bundles/${bundle.slug}`}>
                        <Button className="w-full sm:w-auto bg-earth text-cream hover:bg-earth/90">
                          {t("viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
