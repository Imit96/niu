import { Button } from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-sand px-6 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif text-earth uppercase tracking-widest">404</h1>
        <h2 className="text-xl font-serif text-earth uppercase tracking-widest">{t("notFound")}</h2>
      </div>
      <p className="text-earth/70 max-w-md mx-auto text-sm font-light">
        {t("notFoundBody")}
      </p>
      <div className="pt-4">
        <Link href="/">
          <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
            {t("backHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
