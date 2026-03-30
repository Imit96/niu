"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { checkRateLimit, getCallerIp } from "../../lib/rateLimit";
import { logger } from "../../lib/logger";

const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters.").max(1000, "Review is too long."),
});

/**
 * Submits a new review for a product. Automatically sets isApproved to false.
 */
export async function createReview(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please log in to submit a review." };
  }

  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`review:${session.user.id}:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { error: "Too many review submissions. Please wait before trying again." };
  }

  const ratingRaw = formData.get("rating");
  const commentRaw = formData.get("comment");

  const validatedFields = ReviewSchema.safeParse({
    rating: Number(ratingRaw),
    comment: commentRaw,
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  try {
    // Check if the user has already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { productId, userId: session.user.id },
    });
    if (existing) {
      return { error: "You have already submitted a review for this product." };
    }

    // --- PURCHASE VERIFICATION ---
    // User must have a PAID or DELIVERED order containing this product
    const purchasedVariant = await prisma.orderItem.findFirst({
      where: {
        variant: { productId },
        order: {
          userId: session.user.id,
          status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
        },
      },
    });

    if (!purchasedVariant) {
      return {
        error:
          "Only verified purchasers can leave a review. Please purchase this product first.",
      };
    }
    // --- END PURCHASE VERIFICATION ---

    await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating: validatedFields.data.rating,
        comment: validatedFields.data.comment,
        isApproved: false, // Requires admin approval
      },
    });

    revalidatePath("/shop/[id]", "page");
    return {
      success: true,
      message:
        "Your review has been submitted and is awaiting approval. Thank you.",
    };
  } catch (error) {
    logger.error("[Review Submission Error]", error);
    return { error: "Failed to submit review." };
  }
}

/**
 * Gets all approved reviews for a specific product
 */
export async function getApprovedReviews(productId: string) {
  return prisma.review.findMany({
    where: {
      productId,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Returns true if the current session user has purchased the given product
 * (any variant, any paid/processing/shipped/delivered order).
 */
export async function checkUserPurchased(productId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const match = await prisma.orderItem.findFirst({
    where: {
      variant: { productId },
      order: {
        userId: session.user.id,
        status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] },
      },
    },
    select: { id: true },
  });

  return !!match;
}

/**
 * Returns admin-selected featured reviews for the homepage Voices section.
 * Falls back to top-rated approved reviews if none have been featured.
 */
export async function getFeaturedReviews(limit = 3) {
  return prisma.review.findMany({
    where: { isApproved: true, isFeatured: true, comment: { not: null } },
    include: {
      user: { select: { name: true } },
      product: { select: { id: true, slug: true, name: true } },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
