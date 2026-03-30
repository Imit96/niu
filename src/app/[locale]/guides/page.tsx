import { Button } from "@/components/ui/Button";
import { getGuides, type GuideSummary } from "@/app/actions/content";
import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";

export const revalidate = 3600;

export const metadata = {
  title: "Care Guides | ORIGONÆ",
  description: "Explore our curated care guides for cleansing, hydration, restoration, and sensory elevation — each rooted in heritage formulation.",
};

export default async function CareGuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [guides, t] = await Promise.all([getGuides(locale), getTranslations("guides")]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Intro */}
      <StaggerSection className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <FadeUpDiv>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6 border-b border-cream/20 pb-6 inline-block">{t("title")}</h1>
        </FadeUpDiv>
        <FadeUpDiv>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light mt-4">
            {t("pageSubtitle")}
          </p>
        </FadeUpDiv>
      </StaggerSection>

      {/* Grid */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col space-y-32">
          {guides.map((guide: GuideSummary, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <StaggerSection key={guide.slug} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                <FadeUpDiv className="w-full md:w-1/2">
                  <Link href={`/guides/${guide.slug}`}>
                    <div className="relative aspect-[4/5] bg-stone border border-earth/10 overflow-hidden shadow-sm">
                      {guide.image ? (
                        <div
                          style={transformStyle(parseImageTransform(guide.imagePosition))}
                          className="transition-transform duration-700 group-hover:scale-[1.03]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={guide.image} alt={guide.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-earth/5 transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                          <span className="text-earth/30 uppercase tracking-[0.3em] font-serif text-sm px-8 text-center leading-loose">
                            {guide.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </FadeUpDiv>
                <FadeUpDiv className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
                  <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">{t("methodLabel", { number: String(guide.methodNumber || idx + 1).padStart(1, "0") })}</h2>
                  <h3 className="text-3xl lg:text-5xl font-serif text-earth leading-tight">{guide.title}</h3>
                  <p className="text-earth/80 text-lg leading-relaxed max-w-md">
                    {guide.description}
                  </p>
                  <div className="pt-6">
                    <Link href={`/guides/${guide.slug}`}>
                      <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                        {t("exploreCta")}
                      </Button>
                    </Link>
                  </div>
                </FadeUpDiv>
              </StaggerSection>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <StaggerSection className="py-24 px-6 bg-stone text-center border-t border-earth/10">
        <FadeUpDiv className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-earth">{t("needGuidance")}</h2>
          <p className="text-earth/70">{t("needGuidanceBody")}</p>
          <Link href="/contact" className="inline-block mt-4 text-bronze uppercase tracking-widest text-sm border-b border-bronze pb-1 hover:text-earth hover:border-earth transition-colors">
            {t("contactExpert")}
          </Link>
        </FadeUpDiv>
      </StaggerSection>
    </div>
  );
}
