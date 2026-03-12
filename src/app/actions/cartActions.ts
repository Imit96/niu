"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

/**
 * Validates live inventory before a client-side add-to-cart.
 * Returns the current available quantity so the client can show an accurate error.
 */
export async function checkInventoryAvailable(
  variantId: string,
  requestedQuantity: number
): Promise<{ available: boolean; inventoryCount: number }> {
  const variant = await prisma.productVariant.findFirst({
    where: { id: variantId },
    select: { inventoryCount: true },
  });

  if (!variant) return { available: false, inventoryCount: 0 };

  return {
    available: variant.inventoryCount >= requestedQuantity,
    inventoryCount: variant.inventoryCount,
  };
}

/**
 * Fetches current prices from the DB for a list of variant IDs.
 * Used by the cart page to sync stale Zustand prices.
 */
export async function getVariantCurrentPrices(
  variantIds: string[]
): Promise<{ id: string; priceInCents: number }[]> {
  if (variantIds.length === 0) return [];
  try {
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      select: { id: true, priceInCents: true },
    });
    return variants;
  } catch {
    return [];
  }
}

export async function saveAbandonedCartAction(
  email: string | null,
  userId: string | null,
  cartData: string
) {
  const conditions = [];
  if (email) conditions.push({ email });
  if (userId) conditions.push({ userId });

  if (conditions.length === 0) return { success: false };

  try {
    const activeCart = await prisma.abandonedCart.findFirst({
      where: {
        OR: conditions,
        recovered: false,
      },
      orderBy: { updatedAt: "desc" },
    });

    if (activeCart) {
      await prisma.abandonedCart.update({
        where: { id: activeCart.id },
        data: { cartData, lastActiveAt: new Date() },
      });
    } else {
      await prisma.abandonedCart.create({
        data: { email, userId, cartData },
      });
    }
    return { success: true };
  } catch (error) {
    logger.error("Error saving abandoned cart:", error);
    return { success: false };
  }
}
