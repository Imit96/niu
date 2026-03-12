"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";
import { z } from "zod";
import { checkRateLimit, getCallerIp } from "../../lib/rateLimit";
import { logger } from "../../lib/logger";

const DiscountCheckSchema = z.object({
  code: z.string().min(2).max(20),
  cartTotalInCents: z.number().positive(),
});

export async function validateDiscountCode(formData: FormData) {
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`discount:${ip}`, 20, 15 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many attempts. Please wait before trying again." };
  }

  const codeRaw = formData.get("code");
  const cartTotalRaw = formData.get("cartTotalInCents");

  const validated = DiscountCheckSchema.safeParse({
    code: codeRaw,
    cartTotalInCents: Number(cartTotalRaw),
  });

  if (!validated.success) {
    return { success: false, error: "Invalid discount code format." };
  }

  const { code, cartTotalInCents } = validated.data;

  const session = await auth();
  const isSalon = session?.user?.role === "SALON";

  try {
    const discount = await prisma.discountCode.findFirst({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return { success: false, error: "Discount code not found." };
    }

    if (!discount.isActive) {
      return { success: false, error: "This discount code is no longer active." };
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return { success: false, error: "This discount code has expired." };
    }

    if (isSalon && !discount.allowedForSalon) {
      return { success: false, error: "Salon partners are not eligible for this discount code." };
    }

    // Calculate discount amount
    let discountAmountInCents = 0;
    
    if (discount.discountPct) {
      discountAmountInCents = Math.floor(cartTotalInCents * (discount.discountPct / 100));
    } else if (discount.discountFixed) {
      discountAmountInCents = discount.discountFixed; // Already stored in cents
    }

    // Ensure we don't discount more than the cart total
    discountAmountInCents = Math.min(discountAmountInCents, cartTotalInCents);

    return {
      success: true,
      data: {
        code: discount.code,
        discountAmountInCents,
        newTotalInCents: cartTotalInCents - discountAmountInCents,
        type: discount.discountPct ? `${discount.discountPct}% OFF` : `₦${((discount.discountFixed || 0) / 100).toLocaleString()} OFF`,
      }
    };

  } catch (error) {
    logger.error("[Discount Validation Error]", error);
    return { success: false, error: "Failed to validate code." };
  }
}
