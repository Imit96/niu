"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";
import { CheckoutSchema } from "../../lib/validators";
import { sendOrderConfirmationEmail } from "../../lib/email";
import { ROLES } from "../../lib/constants";
import { logger } from "../../lib/logger";

export async function createOrderFromCart(
  cartItems: { productId: string; id: string; priceInCents: number; quantity: number }[],
  totalInCents: number,
  shippingData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    phone?: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
  discountCode?: string,
  shippingRateId?: string
) {
  const session = await auth();

  if (!cartItems.length) {
    return { success: false as const, error: "Cannot create order from empty cart." };
  }

  // Validate shipping data
  const parsed = CheckoutSchema.safeParse(shippingData);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Invalid shipping data";
    return { success: false as const, error: firstError };
  }

  const { email, firstName, lastName, address, phone, apartment, city, state, postalCode, country } = parsed.data;

  // --- SERVER-SIDE PRICE VALIDATION ---
  const variantIds = cartItems.map(i => i.id);
  const now = new Date();

  const [dbVariants, flashSale] = await Promise.all([
    prisma.productVariant.findMany({ where: { id: { in: variantIds } } }),
    prisma.flashSale.findFirst({
      where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
    }),
  ]);

  const flashDiscountPct = flashSale?.discountPct ?? 0;

  let salonDiscountPct = 0;
  if (session?.user?.id && session.user.role === ROLES.SALON) {
    const salonProfile = await prisma.salonPartner.findFirst({
      where: { userId: session.user.id },
      include: { pricingTier: true },
    });
    if (salonProfile?.isApproved && salonProfile.pricingTier) {
      salonDiscountPct = salonProfile.pricingTier.discountPct;
    }
  }

  let expectedSubtotal = 0;
  const validatedOrderItems: { productVariantId: string; quantity: number; priceAtPurchase: number }[] = [];

  for (const item of cartItems) {
    const dbVar = dbVariants.find(v => v.id === item.id);
    if (!dbVar) {
      return { success: false as const, error: "STALE_CART" };
    }

    // Effective unit price: respect per-variant sale price, then flash sale (off base), take best
    const variantSalePrice = dbVar.salePriceInCents ?? dbVar.priceInCents;
    const flashPrice = flashDiscountPct > 0
      ? Math.round(dbVar.priceInCents * (1 - flashDiscountPct / 100))
      : dbVar.priceInCents;
    const effectiveUnitPrice = Math.min(variantSalePrice, flashPrice);

    // Salon bulk discount applied last
    const finalUnitPrice = salonDiscountPct > 0
      ? Math.floor(effectiveUnitPrice * (1 - salonDiscountPct / 100))
      : effectiveUnitPrice;

    expectedSubtotal += finalUnitPrice * item.quantity;
    validatedOrderItems.push({
      productVariantId: item.id,
      quantity: item.quantity,
      priceAtPurchase: finalUnitPrice,
    });
  }

  let expectedTotal = expectedSubtotal;

  if (discountCode) {
    const discount = await prisma.discountCode.findFirst({
      where: { code: discountCode.toUpperCase() },
    });

    if (discount && discount.isActive && (!discount.expiresAt || new Date(discount.expiresAt) > new Date())) {
      let discountAmount = 0;
      if (discount.discountPct) {
        discountAmount = Math.floor(expectedTotal * (discount.discountPct / 100));
      } else if (discount.discountFixed) {
        discountAmount = discount.discountFixed; // Already stored in cents
      }
      discountAmount = Math.min(discountAmount, expectedTotal);
      expectedTotal -= discountAmount;
    } else {
      return { success: false as const, error: "Invalid or expired discount code." };
    }
  }

  // --- SERVER-SIDE SHIPPING FEE VALIDATION ---
  let shippingFeeInCents = 0;
  if (shippingRateId) {
    const rate = await prisma.shippingRate.findFirst({
      where: { id: shippingRateId, isActive: true },
    });
    if (rate) {
      shippingFeeInCents = rate.rateInCents;
    }
  }

  expectedTotal += shippingFeeInCents;

  if (totalInCents !== expectedTotal) {
    return { success: false as const, error: "Cart price mismatch. Please refresh the page to update your cart totals." };
  }
  // --- END VALIDATION ---

  // --- ATOMIC INVENTORY LOCK + ORDER CREATION ---
  try {
    // Serializable isolation prevents two concurrent orders from both seeing
    // sufficient stock and both decrementing — eliminates the race condition.
    const order = await prisma.$transaction(async (tx) => {
      // Decrement inventory atomically; fail if any variant has insufficient stock
      for (const item of validatedOrderItems) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.productVariantId,
            inventoryCount: { gte: item.quantity },
          },
          data: { inventoryCount: { decrement: item.quantity } },
        });

        if (updated.count === 0) {
          throw new Error("OUT_OF_STOCK");
        }
      }

      return tx.order.create({
        data: {
          // Use relation-connect to avoid Prisma union type inference issues
          ...(session?.user?.id
            ? { user: { connect: { id: session.user.id } } }
            : { guestEmail: email }),
          totalInCents: expectedTotal,
          shippingFeeInCents,
          status: "PENDING",
          currency: "NGN",
          discountCode: discountCode || null,

          shippingName: `${firstName} ${lastName}`,
          shippingPhone: phone || null,
          shippingAddress: address,
          shippingApartment: apartment || null,
          shippingCity: city,
          shippingState: state,
          shippingPostalCode: postalCode || null,
          shippingCountry: country,

          orderItems: {
            create: validatedOrderItems,
          },
        },
      });
    }, { isolationLevel: "Serializable" });

    return { success: true as const, orderId: order.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "OUT_OF_STOCK") {
      return { success: false as const, error: "One or more items in your cart are out of stock. Please update your cart." };
    }
    logger.error("[createOrderFromCart]", err);
    return { success: false as const, error: "Failed to create order. Please try again." };
  }
}

export async function confirmOrderPayment(orderId: string, reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    throw new Error("Payment verification is not configured.");
  }

  try {
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secret}` },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data?.status !== "success") {
      throw new Error("Payment verification failed.");
    }

    const orderToVerify = await prisma.order.findFirst({
      where: { id: orderId },
      select: { id: true, status: true, totalInCents: true },
    });

    if (!orderToVerify) {
      throw new Error("Order not found.");
    }

    // Idempotency: if already PAID, return early without re-processing
    if (orderToVerify.status === "PAID") {
      return { success: true, order: orderToVerify };
    }

    if (verifyData.data.amount < orderToVerify.totalInCents) {
      throw new Error(
        `Payment amount mismatch. Expected at least ₦${orderToVerify.totalInCents / 100} but received ₦${verifyData.data.amount / 100}.`
      );
    }

    const order = await prisma.order.update({
      where: { id: orderId, status: "PENDING" }, // guard against race condition
      data: {
        status: "PAID",
        paymentIntentId: reference,
        paymentMethod: "PAYSTACK",
      },
      select: { id: true, status: true, totalInCents: true },
    });

    sendOrderConfirmationEmail(order.id).catch((err) =>
      logger.error("[Email] sendOrderConfirmationEmail failed", err)
    );

    return { success: true, order };
  } catch (error) {
    logger.error("[Payment Verification] Error:", error);
    throw new Error("Payment verification failed. Please contact support if you were charged.");
  }
}
