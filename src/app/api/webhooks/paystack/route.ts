import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from "@/lib/email";
import { logger } from "@/lib/logger";

/**
 * Paystack Webhook Handler
 *
 * Security measures:
 * 1. Signature verification via HMAC-SHA512
 * 2. Replay protection — each event ID is stored in ProcessedWebhookEvent
 * 3. Amount verification — event amount must equal the order's stored total
 *
 * Reference format: `ord_{orderId}_{timestamp}`
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    logger.error("[Paystack Webhook] PAYSTACK_SECRET_KEY is not configured.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  // 1. Read the raw body for signature verification
  const body = await req.text();

  // 2. Verify the webhook signature
  const signature = req.headers.get("x-paystack-signature");
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

  if (signature !== hash) {
    logger.warn("[Paystack Webhook] Invalid signature — possible spoofing attempt.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 3. Parse and handle the event
  try {
    const event = JSON.parse(body);
    const eventId = event.id as string | undefined;

    // 4. Replay protection — reject already-processed events
    if (eventId) {
      try {
        await prisma.processedWebhookEvent.create({
          data: { provider: "paystack", eventId: String(eventId) },
        });
      } catch {
        // Unique constraint violation means we've seen this event before
        logger.warn("[Paystack Webhook] Duplicate event ignored:", eventId);
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
      }
    }

    if (event.event === "charge.success") {
      const reference = event.data?.reference as string;
      const amountPaid = event.data?.amount as number; // Paystack sends amount in smallest unit (kobo)

      if (!reference) {
        logger.error("[Paystack Webhook] No reference in charge.success event.");
        return NextResponse.json({ error: "Missing reference" }, { status: 400 });
      }

      // Extract order ID from reference format: ord_{orderId}_{timestamp}
      const match = reference.match(/^ord_(.+)_\d+$/);
      if (!match) {
        logger.error("[Paystack Webhook] Invalid reference format:", reference);
        return NextResponse.json({ error: "Invalid reference format" }, { status: 400 });
      }

      const orderId = match[1];

      const existingOrder = await prisma.order.findFirst({
        where: { id: orderId },
      });

      if (!existingOrder) {
        logger.error("[Paystack Webhook] Order not found:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Only update if order is still PENDING
      if (existingOrder.status === "PENDING") {
        // 5. Amount verification — prevent underpayment
        if (typeof amountPaid === "number" && amountPaid < existingOrder.totalInCents) {
          logger.error(
            `[Paystack Webhook] Amount mismatch for order ${orderId}: ` +
              `paid ${amountPaid} but expected ${existingOrder.totalInCents}`
          );
          return NextResponse.json({ error: "Payment amount insufficient" }, { status: 400 });
        }

        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            paymentIntentId: reference,
            paymentMethod: "PAYSTACK",
          },
        });

        // Log audit trail (system-triggered, no adminId)
        await prisma.orderAuditLog.create({
          data: {
            orderId,
            fromStatus: "PENDING",
            toStatus: "PAID",
            note: `Marked PAID via Paystack webhook. Event ID: ${eventId ?? "unknown"}`,
          },
        });

        logger.info("[Paystack Webhook] Order marked as PAID:", orderId);

        // Send customer confirmation and admin notification (errors handled internally)
        await sendOrderConfirmationEmail(orderId);
        await sendAdminNewOrderNotification(orderId);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error("[Paystack Webhook] Error processing event:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
