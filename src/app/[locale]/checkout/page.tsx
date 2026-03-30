export const dynamic = "force-dynamic";

import { getActiveShippingRates } from "../actions/shipping";
import { getActiveFlashSale } from "../actions/admin";
import { auth } from "../../../auth";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const [shippingRates, rawSale, session] = await Promise.all([
    getActiveShippingRates(),
    getActiveFlashSale(),
    auth(),
  ]);

  const isSalon = session?.user?.role === "SALON";

  // Pass flash sale only when it has a discount % and is eligible for this user
  const flashSale =
    rawSale && rawSale.discountPct && (!isSalon || rawSale.allowedForSalon)
      ? { title: rawSale.title, discountPct: rawSale.discountPct }
      : null;

  return <CheckoutClient shippingRates={shippingRates} flashSale={flashSale} />;
}
