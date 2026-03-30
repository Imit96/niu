"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const t = useTranslations("checkout");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">
          {t("successHeading")}
        </h1>
        <p className="text-earth/80 text-lg">
          {t("successBody")}
        </p>
      </div>

      {orderId && (
        <div className="bg-sand p-6 border border-earth/20 w-full mb-8">
          <p className="text-sm font-semibold tracking-widests text-bronze uppercase mb-1">
            {t("orderReference")}
          </p>
          <p className="text-earth font-mono">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/shop" className="w-full sm:w-auto">
          <Button size="lg" className="w-full">
            {t("returnToStore")}
          </Button>
        </Link>
        <Link href="/account" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full">
            {t("viewOrders")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  const t = useTranslations("checkout");
  return <div className="text-earth/60 text-center">{t("loadingStatus")}</div>;
}

export default function CheckoutSuccessPage() {
  return (
    <div className="w-full min-h-screen bg-cream pt-32 pb-24">
      <Suspense fallback={<LoadingFallback />}>
         <SuccessContent />
      </Suspense>
    </div>
  );
}
