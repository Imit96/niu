import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";
import { getPublicSiteSettings } from "@/app/actions/admin";
import { FooterNewsletter } from "./FooterNewsletter";
import { auth } from "../../../auth";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export async function Footer() {
  const [settings, session, t, tHome] = await Promise.all([
    getPublicSiteSettings(),
    auth(),
    getTranslations("footer"),
    getTranslations("home"),
  ]);
  const isSalonOrAdmin = session?.user?.role === "SALON" || session?.user?.role === "ADMIN";

  return (
    <footer className="bg-ink text-cream">

      {/* ── Salon CTA Card — cream card on ink background, clearly distinct from the earth newsletter above ── */}
      <div className="px-6 md:px-12 pt-14">
        <div className="max-w-[1440px] mx-auto bg-cream rounded-2xl px-8 md:px-14 py-12 md:py-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.35em] text-bronze uppercase">
              {tHome("salonCta.label")}
            </p>
            <h2 className="text-2xl md:text-4xl font-serif text-earth leading-snug">
              {tHome("salonCta.title")}
            </h2>
            <p className="text-sm text-earth/60 leading-relaxed">
              {tHome("salonCta.body")}
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/salon">
              <Button className="bg-earth text-cream hover:bg-ink whitespace-nowrap">
                {tHome("salonCta.cta")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer Links Grid ── */}
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-12 pt-16 pb-12 px-6 md:px-12">
        {/* Brand Column */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <Link href="/" className="text-3xl font-serif tracking-widest uppercase">
            ORIGONÆ
          </Link>
          <p className="text-sm text-cream/50 max-w-xs leading-relaxed">
            {t("tagline")}
          </p>
          <div className="flex space-x-4 pt-4">
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
            ) : null}
            {settings.tiktokUrl ? (
              <a href={settings.tiktokUrl} aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
            ) : null}
            {settings.pinterestUrl ? (
              <a href={settings.pinterestUrl} aria-label="Pinterest" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaPinterest className="h-5 w-5" />
              </a>
            ) : null}
            {settings.twitterUrl ? (
              <a href={settings.twitterUrl} aria-label="Twitter / X" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
            ) : null}
            {settings.youtubeUrl ? (
              <a href={settings.youtubeUrl} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaYoutube className="h-5 w-5" />
              </a>
            ) : null}
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-bronze transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/30 mb-2">{t("editorial")}</h4>
          <Link href="/shop" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("shop")}</Link>
          <Link href="/guides" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("faq")}</Link>
          <Link href="/ingredients" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("ingredientPhilosophy")}</Link>
          <Link href="/journal" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("journal")}</Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/30 mb-2">{t("clientCare")}</h4>
          <Link href="/contact" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("contact")}</Link>
          <Link href="/faq" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("faq")}</Link>
          <Link href="/shipping" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("shipping")}</Link>
          <Link href="/terms" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("termsPrivacy")}</Link>
          {isSalonOrAdmin ? (
            <Link href="/salon/dashboard" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("salon")}</Link>
          ) : (
            <Link href="/salon" className="text-sm text-cream/50 hover:text-cream transition-colors">{t("salon")}</Link>
          )}
        </div>

        {/* Newsletter Column */}
        <FooterNewsletter />
      </div>

      {/* ── Copyright Bar ── */}
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 pb-10 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-cream/30">
        <p>&copy; {new Date().getFullYear()} ORIGONÆ. {t("rights")}</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-cream/60 transition-colors">{t("terms")}</Link>
          <Link href="/privacy" className="hover:text-cream/60 transition-colors">{t("privacy")}</Link>
        </div>
      </div>

    </footer>
  );
}
