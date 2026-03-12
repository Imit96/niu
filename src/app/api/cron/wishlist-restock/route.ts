import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { WishlistRestockEmail } from "@/emails/WishlistRestockEmail";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const FROM = process.env.FROM_EMAIL || "ORIGONÆ <noreply@origonae.com>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "https://origonae.com";

// Only notify if the variant was restocked within the last 25 hours
// (allows for slight cron drift on a daily schedule)
const RESTOCK_WINDOW_HOURS = 25;

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
    const windowStart = new Date(Date.now() - RESTOCK_WINDOW_HOURS * 60 * 60 * 1000);

    // Find variants that went back in stock recently
    const restockedVariants = await prisma.productVariant.findMany({
      where: {
        inventoryCount: { gt: 0 },
        updatedAt: { gte: windowStart },
      },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (restockedVariants.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No restocked variants" });
    }

    const restockedProductIds = [...new Set(restockedVariants.map((v) => v.product.id))];

    // Find wishlist items for restocked products that haven't been notified recently
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        productId: { in: restockedProductIds },
        OR: [
          { restockNotifiedAt: null },
          { restockNotifiedAt: { lt: windowStart } },
        ],
      },
      include: {
        wishlist: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        product: { select: { name: true, slug: true } },
      },
    });

    let sent = 0;

    for (const item of wishlistItems) {
      const userEmail = item.wishlist.user?.email;
      if (!userEmail) continue;

      try {
        const customerName = item.wishlist.user?.name?.split(" ")[0] ?? "there";
        const productUrl = `${SITE_URL}/shop/${item.product.slug}`;

        await resend.emails.send({
          from: FROM,
          to: userEmail,
          subject: `${item.product.name} is back in stock`,
          react: WishlistRestockEmail({
            customerName,
            productName: item.product.name,
            productUrl,
          }),
        });

        // Record notification time to avoid repeat emails within the window
        await prisma.wishlistItem.update({
          where: { id: item.id },
          data: { restockNotifiedAt: new Date() },
        });

        sent++;
      } catch (err) {
        logger.error("[Cron/wishlist-restock] Failed to notify", userEmail, err);
      }
    }

    logger.info(`[Cron/wishlist-restock] Sent ${sent} restock notifications`);
    return NextResponse.json({ success: true, sent });
  } catch (error) {
    logger.error("[Cron/wishlist-restock] Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
