import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Frequently Asked Questions | ORIGONÆ",
  description: "Find answers regarding our regimens, sourcing, and shipping.",
};

export default async function FAQPage() {
  const t = await getTranslations("faq");

  const faqs = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3") },
    { question: t("q4"), answer: t("a4") },
    { question: t("q5"), answer: t("a5") },
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

        <StaggerSection className="space-y-6">
          {faqs.map((faq, index) => (
            <FadeUpDiv key={index} className="bg-cream border border-earth/20 p-6 md:p-8 hover:border-bronze/30 transition-colors duration-300">
              <h3 className="text-lg font-serif text-earth mb-3">{faq.question}</h3>
              <p className="text-earth/80 font-light leading-relaxed">{faq.answer}</p>
            </FadeUpDiv>
          ))}
        </StaggerSection>

        <div className="text-center pt-8 border-t border-earth/20">
          <p className="text-earth/70 font-light mb-4">{t("stillNeedHelp")}</p>
          <a href="/contact" className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
            {t("contactCare")}
          </a>
        </div>
      </div>
    </div>
  );
}
