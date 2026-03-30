import { StaggerSection, FadeUpDiv, FadeUpSection } from "@/components/ui/Motion";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Shipping & Returns | ORIGONÆ",
  description: "Information regarding domestic and international shipping, and our return policy.",
};

export default async function ShippingPage() {
  const t = await getTranslations("shipping");

  const sections = [
    { title: t("section1Title"), body: t("section1Body") },
    { title: t("section2Title"), body: t("section2Body") },
    { title: t("section3Title"), body: t("section3Body") },
    { title: t("section4Title"), body: t("section4Body") },
  ];

  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">

        <StaggerSection className="text-center space-y-4">
          <FadeUpDiv>
            <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">{t("title")}</h1>
          </FadeUpDiv>
          <FadeUpDiv>
            <p className="text-earth/70 font-light">{t("subtitle")}</p>
          </FadeUpDiv>
        </StaggerSection>

        <StaggerSection className="space-y-0 bg-cream border border-earth/20 overflow-hidden">
          {sections.map((section, i) => (
            <FadeUpDiv key={i} className="p-8 md:p-12 space-y-4 border-b border-earth/10 last:border-b-0">
              <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">{section.title}</h2>
              <p className="text-earth/80 font-light leading-relaxed">{section.body}</p>
            </FadeUpDiv>
          ))}
        </StaggerSection>

        <FadeUpSection className="text-center pt-4">
          <a href="/contact" className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
            {t("contactCare")}
          </a>
        </FadeUpSection>
      </div>
    </div>
  );
}
