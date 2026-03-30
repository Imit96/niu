import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { StaggerSection, FadeUpDiv, FadeUpSection } from "@/components/ui/Motion";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "About Niu Skin Cosmetics | Our Story",
  description: "Discover the story behind Niu Skin Cosmetics — science-backed, non-bleaching skincare formulated in the UK for every skin type.",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="flex flex-col w-full bg-sand">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center bg-earth overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <StaggerSection className="relative z-10 text-center px-6 max-w-4xl">
          <FadeUpDiv>
            <p className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase mb-4">{t("ourOrigin")}</p>
          </FadeUpDiv>
          <FadeUpDiv>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-cream uppercase tracking-wide leading-tight mb-6">
              {t("heading")}
            </h1>
          </FadeUpDiv>
        </StaggerSection>
      </section>

      {/* 1. Founding Story */}
      <StaggerSection className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeUpDiv className="order-2 lg:order-1 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest leading-tight">
              {t("genesisLabel")}
            </h2>
            <div className="space-y-6 text-earth/80 leading-loose text-lg font-light">
              <p>{t("story1")}</p>
              <p>{t("story2")}</p>
            </div>
          </FadeUpDiv>
          <FadeUpDiv className="order-1 lg:order-2 relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-stone">
              <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">{t("foundingStory")}</div>
            </div>
          </FadeUpDiv>
        </div>
      </StaggerSection>

      {/* 2. Heritage Section */}
      <section className="relative py-32 px-6 flex items-center justify-center bg-earth text-cream overflow-hidden min-h-[500px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/grounded-culture.jpg"
            alt={t("cultureHeading")}
            fill
            className="object-cover object-center opacity-60 mix-blend-luminosity grayscale"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-earth/70 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-earth/95 via-earth/50 to-earth/95" />

        <StaggerSection className="relative z-20 max-w-4xl mx-auto text-center space-y-8">
          <FadeUpDiv>
            <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest text-cream drop-shadow-sm">{t("cultureHeading")}</h2>
          </FadeUpDiv>
          <FadeUpDiv>
            <p className="text-lg text-cream/90 leading-loose font-light drop-shadow-sm">
              {t("cultureBody")}
            </p>
          </FadeUpDiv>
        </StaggerSection>
      </section>

      {/* 3. Craft & Formulation */}
      <StaggerSection className="py-24 px-6 text-center lg:text-left">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeUpDiv className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
            <div className="absolute inset-0 bg-stone">
              <div className="absolute inset-0 flex items-center justify-center text-earth/20 font-serif uppercase tracking-widest">{t("craftsmanshipLabel")}</div>
            </div>
          </FadeUpDiv>
          <FadeUpDiv className="space-y-8">
            <p className="text-xs font-semibold tracking-widest text-bronze uppercase">{t("formulationLabel")}</p>
            <h2 className="text-3xl md:text-5xl font-serif text-earth uppercase tracking-widest leading-tight">
              {t("precisionHeading")}
            </h2>
            <div className="space-y-6 text-earth/80 leading-loose text-lg font-light">
              <p>{t("formulation1")}</p>
              <p>{t("formulation2")}</p>
            </div>
            <Link href="/ingredients" className="inline-block mt-4 text-earth font-medium border-b border-earth pb-1 hover:text-bronze hover:border-bronze transition-colors">
              {t("ingredientsCta")}
            </Link>
          </FadeUpDiv>
        </div>
      </StaggerSection>

      {/* 4. Sustainability & Vision */}
      <StaggerSection className="py-24 px-6 bg-stone">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <FadeUpDiv className="bg-cream p-12 lg:p-16 border border-earth/10">
            <h3 className="text-2xl font-serif text-earth uppercase tracking-wide mb-6">{t("ethicalLabel")}</h3>
            <p className="text-earth/80 leading-relaxed font-light">
              {t("sustainabilityBody")}
            </p>
          </FadeUpDiv>
          <FadeUpDiv className="bg-earth text-cream p-12 lg:p-16">
            <h3 className="text-2xl font-serif uppercase tracking-wide mb-6">{t("futureLabel")}</h3>
            <p className="text-cream/80 leading-relaxed font-light mb-8">
              {t("futureBody")}
            </p>
            <Link href="/distributors">
              <Button variant="secondary" className="border-cream text-cream hover:bg-cream hover:text-earth">
                {t("salonCta")}
              </Button>
            </Link>
          </FadeUpDiv>
        </div>
      </StaggerSection>
    </div>
  );
}
