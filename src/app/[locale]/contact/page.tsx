import ContactForm from "@/components/shared/forms/ContactForm";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Client Care | ORIGONÆ",
  description: "Reach out to ORIGONÆ for order support, product inquiries, and wholesale opportunities."
};

export default async function ContactPage() {
  const t = await getTranslations("contact");
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">{t("title")}</h1>
          <p className="text-earth/70 font-light max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <ContactForm />

        <div className="mt-16 text-center space-y-2">
          <p className="text-sm font-semibold tracking-widest text-bronze uppercase">{t("directEmail")}</p>
          <a href="mailto:care@origonae.com" className="text-lg text-earth hover:text-bronze transition-colors">care@origonae.com</a>
        </div>
      </div>
    </div>
  );
}
