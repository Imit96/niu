import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { getActiveFlashSale } from "../actions/admin";
import CartClient from "./CartClient";

export default async function CartPage() {
  const [session, flashSaleData] = await Promise.all([auth(), getActiveFlashSale()]);

  let isSalon = false;
  let discountPct = 0;
  let businessName: string | undefined;

  if (session?.user?.role === "SALON" && session.user.id) {
    isSalon = true;
    try {
      const salonProfile = await prisma.salonPartner.findFirst({
        where: { userId: session.user.id },
        include: { pricingTier: true },
      });
      discountPct = salonProfile?.pricingTier?.discountPct ?? 0;
      businessName = salonProfile?.businessName;
    } catch {
      discountPct = 0;
    }
  }

  // Flash sale pct to pass down — 0 means no active sale for this user
  const flashSalePct =
    flashSaleData?.discountPct && (!isSalon || flashSaleData.allowedForSalon)
      ? flashSaleData.discountPct
      : 0;

  return (
    <CartClient
      isSalon={isSalon}
      discountPct={discountPct}
      businessName={businessName}
      flashSalePct={flashSalePct}
    />
  );
}
