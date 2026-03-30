import LoginForm from "@/components/shared/forms/LoginForm";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Sign In | ORIGONÆ",
  description: "Sign in to your ORIGONÆ account to track orders and manage your regimen."
};

export default async function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ registered?: string; reset?: string }> 
}) {
  // Await the searchParams object (Next.js 15 requirement)
  const [resolvedParams, t] = await Promise.all([searchParams, getTranslations("auth")]);
  const registered = resolvedParams.registered === "true";
  const reset = resolvedParams.reset === "success";

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">{t("login")}</h1>
        <p className="text-center text-earth/70 text-sm mb-8">{t("welcomeBack")}</p>

        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            {t("accountCreated")}
          </div>
        )}

        {reset && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            {t("passwordUpdated")}
          </div>
        )}

        <LoginForm />

        <div className="mt-8 text-center text-sm text-earth/80">
          {t("newToOrigonae")}{" "}
          <Link href="/auth/register" className="text-bronze hover:underline underline-offset-4">
            {t("register")}
          </Link>
        </div>
      </div>
    </div>
  );
}
