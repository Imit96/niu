import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

// rates = "NGN per 1 unit of foreign currency" (e.g. USD: 1600 means 1 USD = ₦1,600)
// Seeded live from /api/exchange-rates on app load; falls back to hardcoded values
interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: Record<Currency, number>;
  fetchRates: () => Promise<void>;
  convert: (amountInCents: number) => { amount: number; symbol: string };
}

const symbols: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€"
};

// Hardcoded fallback rates (used if live fetch fails) — updated March 2026
const FALLBACK_RATES: Record<Currency, number> = {
  NGN: 1,
  USD: 1400,
  GBP: 1850,
  EUR: 1600,
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "NGN",
      rates: { ...FALLBACK_RATES },
      setCurrency: (currency) => set({ currency }),
      fetchRates: async () => {
        try {
          const res = await fetch("/api/exchange-rates");
          if (!res.ok) return;
          const data = await res.json();
          if (!data) return;
          set((state) => ({
            rates: {
              ...state.rates,
              ...(data.USD ? { USD: data.USD } : {}),
              ...(data.GBP ? { GBP: data.GBP } : {}),
              ...(data.EUR ? { EUR: data.EUR } : {}),
            },
          }));
        } catch {
          // Silently fall back to stored/hardcoded rates
        }
      },
      convert: (amountInCents) => {
        const { currency, rates } = get();
        const baseAmount = amountInCents / 100; // NGN amount

        if (currency === 'NGN') {
          return { amount: baseAmount, symbol: symbols.NGN };
        }

        // Divide NGN by rate to get foreign currency amount
        const converted = Math.round((baseAmount / rates[currency]) * 100) / 100;
        return { amount: converted, symbol: symbols[currency] };
      }
    }),
    {
      name: "currency-storage",
    }
  )
);
