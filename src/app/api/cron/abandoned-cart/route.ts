import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { AbandonedCartEmail } from "@/emails/AbandonedCartEmail";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const FROM = process.env.FROM_EMAIL || "ORIGONÆ <noreply@origonae.com>";
const CART_URL = `${process.env.NEXT_PUBLIC_SITE_URL || "https://origonae.com"}/cart`;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ success: false, error: "Email not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        recovered: false,
        emailSent: false,
        lastActiveAt: { lt: oneHourAgo, gt: twentyFourHoursAgo },
        email: { not: null },
      },
      take: 20,
    });

    let sent = 0;

    for (const cart of abandonedCarts) {
      if (!cart.email) continue;

      try {
        let items: { name: string; size: string; quantity: number; priceInCents: number }[] = [];
        try {
          items = JSON.parse(cart.cartData);
        } catch {
          // Malformed cart data — skip email but still mark sent to avoid retry loops
        }

        await resend.emails.send({
          from: FROM,
          to: cart.email,
          subject: "Your selection is waiting",
          react: AbandonedCartEmail({ items, cartUrl: CART_URL }),
        });

        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { emailSent: true },
        });

        sent++;
      } catch (err) {
        logger.error("[Cron] Failed to send abandoned cart email to", cart.email, err);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    logger.error("[Cron] Abandoned cart cron error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
