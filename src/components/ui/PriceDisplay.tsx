"use client";

import { useCurrencyStore } from "@/lib/store/currencyStore";
import { useEffect, useState } from "react";

interface PriceDisplayProps {
  amountInCents: number;
  className?: string;
}

export function PriceDisplay({ amountInCents, className }: PriceDisplayProps) {
  const { convert } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // SSR Fallback (default to NGN)
    return <span className={className}>₦ {(amountInCents / 100).toLocaleString()}</span>;
  }

  const { amount, symbol } = convert(amountInCents);

  return (
    <span className={className}>
      {symbol} {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );
}
