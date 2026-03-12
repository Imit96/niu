"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/lib/store/currencyStore";

// Fetches live exchange rates once on app load and seeds the currency store.
// Placed in the root layout so it runs on every initial page render.
export function CurrencyRatesProvider() {
  const fetchRates = useCurrencyStore((state) => state.fetchRates);

  useEffect(() => {
    fetchRates();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
