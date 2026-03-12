import { getActiveFlashSale } from "@/app/actions/admin";
import FlashSaleBannerClient from "./FlashSaleBannerClient";

export async function FlashSaleBanner() {
  const sale = await getActiveFlashSale();

  if (!sale) return null;

  return (
    <FlashSaleBannerClient
      title={sale.title}
      endsAt={sale.endsAt instanceof Date ? sale.endsAt.toISOString() : String(sale.endsAt)}
    />
  );
}
