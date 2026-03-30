"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/Input";
import { requestPasswordReset } from "@/app/actions/passwordReset";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [state, action, isPending] = useActionState(requestPasswordReset, null);

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">
          {t("resetPassword")}
        </h1>
        <p className="text-center text-earth/70 text-sm mb-8">
          {t("forgotPasswordSubtitle")}
        </p>

        {(state as any)?.success ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center space-y-2">
            <p className="font-medium">{t("checkInbox")}</p>
            <p>{t("resetLinkSent")}</p>
          </div>
        ) : (
          <form action={action} className="space-y-6">
            {(state as any)?.error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {(state as any).error}
              </div>
            )}
            <Input
              type="email"
              name="email"
              placeholder={t("emailPlaceholder")}
              required
              disabled={isPending}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("sending") : t("sendResetLink")}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-earth/80">
          <Link href="/auth/login" className="text-bronze hover:underline underline-offset-4">
            {t("login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
