import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// Fetches live NGN exchange rates from open.er-api.com (free, no API key needed)
// Next.js caches the fetch response for 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/NGN", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Exchange rate API unavailable");

    const data = await res.json();

    if (data.result !== "success" || !data.rates) {
      throw new Error("Invalid response from exchange rate API");
    }

    // data.rates.USD = "1 NGN in USD" — we invert to get "NGN per 1 USD"
    return NextResponse.json({
      USD: Math.round(1 / data.rates.USD),
      GBP: Math.round(1 / data.rates.GBP),
      EUR: Math.round(1 / data.rates.EUR),
    });
  } catch (err) {
    logger.error("[Exchange Rates]", err);
    // Return null — client falls back to hardcoded rates in currencyStore
    return NextResponse.json(null, { status: 503 });
  }
}
