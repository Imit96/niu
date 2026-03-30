"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-6 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">
          Ritual Complete
        </h1>
        <p className="text-earth/80 text-lg">
          Your payment was successful. We are preparing your regimen.
        </p>
      </div>

      {orderId && (
        <div className="bg-sand p-6 border border-earth/20 w-full mb-8">
          <p className="text-sm font-semibold tracking-widest text-bronze uppercase mb-1">
            Order Reference
          </p>
          <p className="text-earth font-mono">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
        <Link href="/shop" className="w-full sm:w-auto">
          <Button size="lg" className="w-full">
            Return to Store
          </Button>
        </Link>
        <Link href="/account" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full">
            View My Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="w-full min-h-screen bg-cream pt-32 pb-24">
      <Suspense fallback={<div className="text-earth/60 text-center">Loading status...</div>}>
         <SuccessContent />
      </Suspense>
    </div>
  );
}
