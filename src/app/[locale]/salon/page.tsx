import { Button } from "@/components/ui/Button";
import { auth } from "../../../../auth";
import { StaggerSection, FadeUpDiv, FadeUpSection } from "@/components/ui/Motion";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Professional Partnerships | ORIGONÆ",
  description: "Discover ORIGONÆ's B2B salon portal. Elevate your salon experience with our luxury regimen haircare system.",
};

export default async function SalonPortalPage() {
  const [session, t] = await Promise.all([auth(), getTranslations("salon")]);
  const isSalonActive = session?.user?.role === "SALON";

  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-earth/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="absolute inset-0 border-[20px] border-cream/5 m-6"></div>
        </div>
        <StaggerSection className="relative z-10 text-center px-6 max-w-3xl">
          <FadeUpDiv>
            <p className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase mb-4">{t("professionalAccess")}</p>
          </FadeUpDiv>
          <FadeUpDiv>
            <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-wide leading-tight mb-8">
              {t("heading")}
            </h1>
          </FadeUpDiv>
          <FadeUpDiv>
            {isSalonActive ? (
              <Link href="/salon/dashboard">
                <Button variant="secondary" size="lg" className="border-cream text-cream hover:bg-cream hover:text-earth">{t("dashboard")}</Button>
              </Link>
            ) : (
              <Link href="/salon/apply">
                <Button variant="secondary" size="lg" className="border-cream text-cream hover:bg-cream hover:text-earth">{t("apply")}</Button>
              </Link>
            )}
          </FadeUpDiv>
        </StaggerSection>
      </section>

      {/* Benefits */}
      <StaggerSection className="py-24 px-6 bg-sand text-center">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          <FadeUpDiv className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">{t("benefit1Title")}</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              {t("benefit1Body")}
            </p>
          </FadeUpDiv>
          <FadeUpDiv className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">{t("benefit2Title")}</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              {t("benefit2Body")}
            </p>
          </FadeUpDiv>
          <FadeUpDiv className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">{t("benefit3Title")}</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              {t("benefit3Body")}
            </p>
          </FadeUpDiv>
        </div>
      </StaggerSection>

      {/* Philosophy / CTA */}
      <FadeUpSection className="py-24 px-6 bg-earth text-cream text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest leading-tight">{t("circleHeading")}</h2>
          <p className="text-lg text-cream/80 font-light leading-loose">
            {t("circleBody")}
          </p>
          <div className="pt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {isSalonActive ? (
              <Link href="/salon/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-cream text-earth">{t("dashboard")}</Button>
              </Link>
            ) : (
              <Link href="/salon/apply">
                <Button size="lg" className="w-full sm:w-auto bg-cream text-earth">{t("beginApplication")}</Button>
              </Link>
            )}
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto border-cream text-cream">{t("contactWholesale")}</Button>
            </Link>
          </div>
        </div>
      </FadeUpSection>
    </div>
  );
}
