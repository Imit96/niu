"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { logger } from "../../lib/logger";

/**
 * Gets the current user's wishlist, including product details and primary variant pricing.
 */
export async function getWishlist() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, items: [] };
  }

  const wishlist = await prisma.wishlist.findFirst({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              variants: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return { 
    success: true, 
    items: wishlist?.items || [] 
  };
}

/**
 * Adds a product to the user's wishlist
 */
export async function addToWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Please sign in to add items to your wishlist." };
  }

  try {
    // Upsert the wishlist for the user
    const wishlist = await prisma.wishlist.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    // Check if item already exists
    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existing) {
      return { success: true, message: "Item is already in your wishlist." };
    }

    // Add item
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId,
      },
    });

    revalidatePath("/shop/[id]", "page");
    revalidatePath("/account/wishlist");
    return { success: true, message: "Added to wishlist." };
  } catch (error) {
    logger.error("[Wishlist Add Error]", error);
    return { error: "Failed to add item to wishlist." };
  }
}

/**
 * Removes a product from the user's wishlist
 */
export async function removeFromWishlist(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const wishlist = await prisma.wishlist.findFirst({
      where: { userId: session.user.id },
    });

    if (!wishlist) return { error: "Wishlist not found." };

    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    revalidatePath("/shop/[id]", "page");
    revalidatePath("/account/wishlist");
    return { success: true, message: "Removed from wishlist." };
  } catch (error) {
    logger.error("[Wishlist Remove Error]", error);
    return { error: "Failed to remove item from wishlist." };
  }
}

/**
 * Checks if a specific product is in the current user's wishlist
 */
export async function checkWishlistStatus(productId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const wishlist = await prisma.wishlist.findFirst({
    where: { userId: session.user.id },
  });

  if (!wishlist) return false;

  const item = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  return !!item;
}
