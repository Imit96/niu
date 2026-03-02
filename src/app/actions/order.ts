"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";

export async function createOrderFromCart(
  cartItems: { productId: string; id: string; priceInCents: number; quantity: number }[],
  totalInCents: number,
  guestEmail?: string
) {
  const session = await auth();
  
  if (!cartItems.length) {
    throw new Error("Cannot create order from empty cart.");
  }

  // Create the base order
  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id || null,
      guestEmail: session ? undefined : guestEmail,
      totalInCents,
      status: "PENDING",
      currency: "NGN",
      
      orderItems: {
        create: cartItems.map((item) => ({
          productVariantId: item.id, // we map cart item id to the unique variant id
          quantity: item.quantity,
          priceAtPurchase: item.priceInCents,
        }))
      }
    }
  });

  return { success: true, orderId: order.id };
}

export async function confirmOrderPayment(orderId: string, reference: string) {
  // In a real production app, we would verify the paystack reference securely on the backend via the Paystack API here
  // For the sandbox MVP, we just update the order status
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      paymentIntentId: reference,
      paymentMethod: "PAYSTACK"
    }
  });

  return { success: true, order };
}
