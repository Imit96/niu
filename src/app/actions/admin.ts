"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import { sendSalonApprovalEmail, sendSalonRejectionEmail, sendShippingNotificationEmail } from "../../lib/email";
import { DiscountCodeSchema, FlashSaleSchema } from "../../lib/validators";
import { ROLES } from "../../lib/constants";
import { logger } from "../../lib/logger";
import { requireAdmin } from "../../lib/auth-utils";

// ==========================================
// Auth Guard
// ==========================================


// ==========================================
// Dashboard Stats
// ==========================================

export async function getAdminStats() {
  await requireAdmin();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const [
    productCount,
    orderCount,
    userCount,
    pendingSalonCount,
    pendingReviewCount,
    revenueResult,
    revenueLast7Days,
    revenuePrev7Days,
    lowStockVariants,
    unshippedOldOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.salonPartner.count({ where: { isApproved: false } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.order.aggregate({
      _sum: { totalInCents: true },
      where: { status: "PAID" },
    }),
    prisma.order.aggregate({
      _sum: { totalInCents: true },
      where: { status: "PAID", createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.order.aggregate({
      _sum: { totalInCents: true },
      where: { status: "PAID", createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
    }),
    prisma.productVariant.count({ where: { inventoryCount: { lte: 5, gt: 0 } } }),
    prisma.order.count({
      where: { status: "PAID", createdAt: { lte: threeDaysAgo } },
    }),
  ]);

  const aovResult = await prisma.order.aggregate({
    _avg: { totalInCents: true },
    where: { status: "PAID" },
  });

  const last7 = revenueLast7Days._sum.totalInCents || 0;
  const prev7 = revenuePrev7Days._sum.totalInCents || 0;
  const revenueTrendPct = prev7 === 0 ? null : Math.round(((last7 - prev7) / prev7) * 100);

  return {
    productCount,
    orderCount,
    userCount,
    pendingSalonCount,
    pendingReviewCount,
    totalRevenueCents: revenueResult._sum.totalInCents || 0,
    revenueLastSevenDaysCents: last7,
    revenueTrendPct,
    avgOrderValueCents: Math.round(aovResult._avg.totalInCents || 0),
    lowStockVariantCount: lowStockVariants,
    unshippedOldOrderCount: unshippedOldOrders,
  };
}

// ==========================================
// Orders
// ==========================================

export async function getAdminOrders(page = 1, pageSize = 20) {
  await requireAdmin();
  const skip = (page - 1) * pageSize;
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      select: {
        id: true,
        guestEmail: true,
        totalInCents: true,
        paymentMethod: true,
        paymentIntentId: true,
        createdAt: true,
        status: true,
        user: { select: { name: true, email: true } },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            variant: {
              select: {
                product: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.order.count(),
  ]);
  return { orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getRecentOrders(limit = 5) {
  await requireAdmin();
  return prisma.order.findMany({
    select: {
      id: true,
      guestEmail: true,
      createdAt: true,
      totalInCents: true,
      status: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
) {
  const session = await requireAdmin();

  try {
    const current = await prisma.order.findFirst({
      where: { id: orderId },
      select: { status: true },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
      select: { id: true },
    });

    // Audit log — record who changed what and when
    await prisma.orderAuditLog.create({
      data: {
        orderId,
        adminId: session.user!.id,
        fromStatus: current?.status ?? "UNKNOWN",
        toStatus: status,
      },
    });

    if (status === "SHIPPED") {
      sendShippingNotificationEmail(orderId).catch((err) =>
        logger.error("[Email] sendShippingNotificationEmail failed", err)
      );
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update order status" };
  }
}

// ==========================================
// Users
// ==========================================

export async function getAdminUsers(page = 1, pageSize = 25) {
  await requireAdmin();
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        salonProfile: { select: { businessName: true, isApproved: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);
  return { users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function updateUserRole(
  userId: string,
  role: "CUSTOMER" | "SALON" | "ADMIN"
) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/admin/users");
}

// ==========================================
// Salon Partners
// ==========================================

export async function getAdminSalonApplications() {
  await requireAdmin();
  return prisma.salonPartner.findMany({
    include: {
      user: { select: { name: true, email: true } },
      pricingTier: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBulkPricingTiers() {
  await requireAdmin();
  let tiers = await prisma.bulkPricingTier.findMany({ orderBy: { discountPct: "asc" } });
  if (tiers.length === 0) {
    // Auto-seed default tiers if empty
    await prisma.bulkPricingTier.createMany({
       data: [
         { name: "Standard Wholesale (15%)", discountPct: 15 },
         { name: "Premium Partner (25%)", discountPct: 25 },
         { name: "Elite Distributor (40%)", discountPct: 40 }
       ]
    });
    tiers = await prisma.bulkPricingTier.findMany({ orderBy: { discountPct: "asc" } });
  }
  return tiers;
}

export async function updateSalonPricingTier(salonId: string, tierId: string | null) {
  await requireAdmin();
  await prisma.salonPartner.update({
    where: { id: salonId },
    data: { pricingTierId: tierId }
  });
  revalidatePath(`/admin/salons/${salonId}`);
  revalidatePath("/admin/salons");
}

export async function approveSalonPartner(salonId: string) {
  await requireAdmin();
  const salon = await prisma.salonPartner.update({
    where: { id: salonId },
    data: { isApproved: true },
  });

  let isExistingAccount = false;

  if (salon.userId) {
    // Applied while logged in — just promote the already-linked user
    await prisma.user.update({
      where: { id: salon.userId },
      data: { role: ROLES.SALON },
    });
    isExistingAccount = true;
  } else if (salon.contactEmail) {
    // Applied while logged out — check if an account with this email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: salon.contactEmail },
      select: { id: true },
    });

    if (existingUser) {
      // Link and promote the existing account
      await Promise.all([
        prisma.salonPartner.update({
          where: { id: salonId },
          data: { userId: existingUser.id },
        }),
        prisma.user.update({
          where: { id: existingUser.id },
          data: { role: ROLES.SALON },
        }),
      ]);
      isExistingAccount = true;
    }
    // If no account exists yet, registerAction handles linking on signup
  }

  // Send approval email with the correct CTA (sign in vs register)
  const emailTo = salon.contactEmail;
  if (emailTo) {
    await sendSalonApprovalEmail({
      to: emailTo,
      businessName: salon.businessName,
      contactName: salon.contactName ?? salon.businessName,
      isExistingAccount,
    });
  }

  revalidatePath("/admin/salons");
  revalidatePath("/admin");
}

export async function rejectSalonPartner(salonId: string) {
  await requireAdmin();
  // Fetch email details before deleting
  const salon = await prisma.salonPartner.findFirst({ where: { id: salonId } });
  
  await prisma.salonPartner.delete({ where: { id: salonId } });

  // Send rejection email after deletion
  if (salon?.contactEmail) {
    await sendSalonRejectionEmail({
      to: salon.contactEmail,
      businessName: salon.businessName,
      contactName: salon.contactName ?? salon.businessName,
    });
  }

  revalidatePath("/admin/salons");
  revalidatePath("/admin");
}

// ==========================================
// Reviews
// ==========================================

export async function getAdminReviews() {
  await requireAdmin();
  return prisma.review.findMany({
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { isApproved: true },
  });
  revalidatePath("/admin/reviews");
}

export async function featureReview(reviewId: string, featured: boolean) {
  await requireAdmin();
  await prisma.review.update({
    where: { id: reviewId },
    data: { isFeatured: featured },
  });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReview(reviewId: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
}

// ==========================================
// Discount Codes
// ==========================================

export async function getAdminDiscountCodes() {
  await requireAdmin();
  return prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createDiscountCode(data: {
  code: string;
  discountPct?: number;
  discountFixed?: number;
  expiresAt?: string;
  allowedForSalon?: boolean;
}) {
  await requireAdmin();

  const parsed = DiscountCodeSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat()[0] || "Invalid discount code data");
  }

  await prisma.discountCode.create({
    data: {
      code: parsed.data.code,
      discountPct: parsed.data.discountPct || null,
      discountFixed: parsed.data.discountFixed ? parsed.data.discountFixed * 100 : null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      isActive: true,
      allowedForSalon: parsed.data.allowedForSalon,
    },
  });
  revalidatePath("/admin/discounts");
}

export async function toggleDiscountCode(id: string) {
  await requireAdmin();
  const code = await prisma.discountCode.findFirst({ where: { id } });
  if (!code) throw new Error("Discount code not found");

  await prisma.discountCode.update({
    where: { id },
    data: { isActive: !code.isActive },
  });
  revalidatePath("/admin/discounts");
}

export async function deleteDiscountCode(id: string) {
  await requireAdmin();
  await prisma.discountCode.delete({ where: { id } });
  revalidatePath("/admin/discounts");
}

// ==========================================
// Flash Sales
// ==========================================

export async function getFlashSales() {
  await requireAdmin();
  return prisma.flashSale.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createFlashSale(data: {
  title: string;
  discountPct?: number;
  startsAt: string;
  endsAt: string;
  allowedForSalon?: boolean;
}) {
  await requireAdmin();

  const parsed = FlashSaleSchema.safeParse(data);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    throw new Error(Object.values(errors).flat()[0] || "Invalid flash sale data");
  }

  // Deactivate all other flash sales
  await prisma.flashSale.updateMany({
    data: { isActive: false },
  });

  await prisma.flashSale.create({
    data: {
      title: parsed.data.title,
      discountPct: parsed.data.discountPct || null,
      startsAt: new Date(parsed.data.startsAt),
      endsAt: new Date(parsed.data.endsAt),
      isActive: true,
      allowedForSalon: parsed.data.allowedForSalon,
    },
  });
  revalidateTag("flash-sale", {});
  revalidatePath("/admin/flash-sales");
  revalidatePath("/", "layout");
}

export async function toggleFlashSale(id: string) {
  await requireAdmin();
  const sale = await prisma.flashSale.findFirst({ where: { id } });
  if (!sale) throw new Error("Flash sale not found");

  if (!sale.isActive) {
    // Deactivate all others first
    await prisma.flashSale.updateMany({ data: { isActive: false } });
  }

  await prisma.flashSale.update({
    where: { id },
    data: { isActive: !sale.isActive },
  });
  revalidateTag("flash-sale", {});
  revalidatePath("/admin/flash-sales");
  revalidatePath("/", "layout");
}

export async function deleteFlashSale(id: string) {
  await requireAdmin();
  await prisma.flashSale.delete({ where: { id } });
  revalidateTag("flash-sale", {});
  revalidatePath("/admin/flash-sales");
  revalidatePath("/", "layout");
}

// Public: used by the banner component — cached for 60 s to avoid a DB hit on every page render.
// Invalidated whenever a flash sale is created, toggled, or deleted (revalidatePath("/", "layout")).
const _getActiveFlashSaleFromDb = unstable_cache(
  async () => {
    try {
      const now = new Date();
      return await prisma.flashSale.findFirst({
        where: {
          isActive: true,
          startsAt: { lte: now },
          endsAt: { gte: now },
        },
      });
    } catch {
      return null;
    }
  },
  ["active-flash-sale"],
  { revalidate: 60, tags: ["flash-sale"] }
);

export async function getActiveFlashSale() {
  return _getActiveFlashSaleFromDb();
}

// ==========================================
// Settings (via ContentBlock)
// ==========================================

export async function getAdminSettings() {
  await requireAdmin();
  const block = await prisma.contentBlock.findFirst({
    where: { slug: "site-settings" },
  });
  if (!block) return {};
  try {
    return JSON.parse(block.contentJson);
  } catch {
    return {};
  }
}

export async function updateAdminSettings(settings: Record<string, string>) {
  await requireAdmin();
  await prisma.contentBlock.upsert({
    where: { slug: "site-settings" },
    update: { contentJson: JSON.stringify(settings) },
    create: {
      slug: "site-settings",
      contentJson: JSON.stringify(settings),
    },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

// Public (no auth) — used by Footer and other public components
export async function getPublicSiteSettings(): Promise<Record<string, string>> {
  try {
    const block = await prisma.contentBlock.findFirst({
      where: { slug: "site-settings" },
    });
    if (!block) return {};
    return JSON.parse(block.contentJson) as Record<string, string>;
  } catch {
    return {};
  }
}
