import { Button } from "@/components/ui/Button";
import { getIngredients, type IngredientSummary } from "@/app/actions/content";
import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";

export const revalidate = 3600;

export const metadata = {
  title: "Ingredient Glossary | ORIGONÆ",
  description: "An A-Z guide of the foundational botanicals and raw earth elements that power our regimens.",
};

export default async function IngredientsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [ingredients, t] = await Promise.all([getIngredients(locale), getTranslations("ingredients")]);

  // Group by first letter
  const grouped = ingredients.reduce((acc, ingredient) => {
    const letter = ingredient.name.charAt(0).toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(ingredient);
    return acc;
  }, {} as Record<string, IngredientSummary[]>);

  const letters = Object.keys(grouped).sort();
  const allLetters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand rounded-xl overflow-hidden">
      {/* Hero */}
      <StaggerSection className="pt-32 pb-24 px-6 bg-earth text-cream text-center">
        <FadeUpDiv>
          <h2 className="text-sm font-semibold tracking-[0.3em] text-bronze uppercase mb-4">{t("glossaryLabel")}</h2>
        </FadeUpDiv>
        <FadeUpDiv>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6">{t("title")}</h1>
        </FadeUpDiv>
        <FadeUpDiv>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light">
            {t("pageBody")}
          </p>
        </FadeUpDiv>
      </StaggerSection>

      {/* A-Z Index Nav */}
      <section className="sticky top-20 z-30 bg-sand/90 backdrop-blur-md border-b border-earth/10 py-4 px-6">
        <div className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-2 md:gap-4">
          {allLetters.map((letter) => {
            const hasIngredients = letters.includes(letter);
            return (
              <Link
                key={letter}
                href={hasIngredients ? `#letter-${letter}` : "#"}
                className={`w-8 h-8 flex items-center justify-center font-serif text-lg transition-colors
                  ${hasIngredients
                    ? 'text-earth hover:text-bronze hover:bg-earth/5'
                    : 'text-earth/20 cursor-default pointer-events-none'
                  }`}
              >
                {letter}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Glossary List */}
      <section className="py-16 px-6 max-w-[1000px] mx-auto w-full min-h-[50vh]">
        <div className="space-y-16">
          {letters.map((letter) => (
            <StaggerSection key={letter} id={`letter-${letter}`} className="scroll-mt-40 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8">
              <div className="hidden md:block">
                <h2 className="text-6xl font-serif text-earth/20 sticky top-40">{letter}</h2>
              </div>
              <div className="space-y-8">
                {grouped[letter].map((ingredient) => (
                  <FadeUpDiv key={ingredient.slug} className="group border-b border-earth/10 pb-8 last:border-b-0 flex gap-5 items-start">
                    {ingredient.image && (
                      <Link href={`/ingredients/${ingredient.slug}`} className="relative w-20 h-24 shrink-0 bg-stone border border-earth/10 overflow-hidden">
                        <div style={transformStyle(parseImageTransform(ingredient.imagePosition))}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ingredient.image} alt={ingredient.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                        </div>
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-bronze">{ingredient.category}</span>
                      <Link href={`/ingredients/${ingredient.slug}`} className="block mt-2">
                        <h3 className="text-2xl font-serif text-earth group-hover:text-bronze transition-colors">{ingredient.name}</h3>
                      </Link>
                      <p className="text-earth/80 mt-3 leading-relaxed max-w-2xl">
                        {ingredient.description}
                      </p>
                      <Link href={`/ingredients/${ingredient.slug}`} className="inline-block mt-4 text-xs tracking-widest uppercase text-earth/60 group-hover:text-earth transition-colors">
                        {t("discoverOrigins")}
                      </Link>
                    </div>
                  </FadeUpDiv>
                ))}
              </div>
            </StaggerSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <StaggerSection className="py-24 px-6 bg-stone text-center border-t border-earth/10">
        <FadeUpDiv className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-earth">{t("purityHeading")}</h2>
          <p className="text-earth/70">{t("purityBody")}</p>
          <Link href="/shop" className="inline-block mt-4">
            <Button>Shop All Regimens</Button>
          </Link>
        </FadeUpDiv>
      </StaggerSection>
    </div>
  );
}
