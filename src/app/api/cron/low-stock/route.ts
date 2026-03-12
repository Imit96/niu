import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const FROM = process.env.FROM_EMAIL || "ORIGONÆ <noreply@origonae.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.CARE_EMAIL || "care@origonae.com";
// Variants with stock at or below this threshold trigger an alert
const LOW_STOCK_THRESHOLD = 5;

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

    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        inventoryCount: { gt: 0, lte: LOW_STOCK_THRESHOLD },
      },
      include: {
        product: { select: { name: true, slug: true } },
      },
      orderBy: { inventoryCount: "asc" },
    });

    const outOfStockVariants = await prisma.productVariant.findMany({
      where: { inventoryCount: 0 },
      include: {
        product: { select: { name: true, slug: true } },
      },
    });

    if (lowStockVariants.length === 0 && outOfStockVariants.length === 0) {
      return NextResponse.json({ success: true, message: "No stock alerts" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const lowStockRows = lowStockVariants
      .map(
        (v) =>
          `<tr><td>${v.product.name}</td><td>${v.size ?? "Default"}</td><td style="color:orange;font-weight:bold;">${v.inventoryCount} left</td></tr>`
      )
      .join("");

    const outOfStockRows = outOfStockVariants
      .map(
        (v) =>
          `<tr><td>${v.product.name}</td><td>${v.size ?? "Default"}</td><td style="color:red;font-weight:bold;">OUT OF STOCK</td></tr>`
      )
      .join("");

    const html = `
      <h2>ORIGONÆ — Daily Inventory Alert</h2>
      ${
        outOfStockVariants.length > 0
          ? `<h3>Out of Stock (${outOfStockVariants.length})</h3>
             <table border="1" cellpadding="6" cellspacing="0">
               <thead><tr><th>Product</th><th>Size</th><th>Status</th></tr></thead>
               <tbody>${outOfStockRows}</tbody>
             </table>`
          : ""
      }
      ${
        lowStockVariants.length > 0
          ? `<h3>Low Stock — ≤${LOW_STOCK_THRESHOLD} units (${lowStockVariants.length})</h3>
             <table border="1" cellpadding="6" cellspacing="0">
               <thead><tr><th>Product</th><th>Size</th><th>Stock</th></tr></thead>
               <tbody>${lowStockRows}</tbody>
             </table>`
          : ""
      }
    `;

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `[ORIGONÆ] Inventory Alert — ${outOfStockVariants.length} out of stock, ${lowStockVariants.length} low stock`,
      html,
    });

    logger.info(
      `[Cron/low-stock] Alert sent: ${outOfStockVariants.length} OOS, ${lowStockVariants.length} low stock`
    );

    return NextResponse.json({
      success: true,
      outOfStock: outOfStockVariants.length,
      lowStock: lowStockVariants.length,
    });
  } catch (error) {
    logger.error("[Cron/low-stock] Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
