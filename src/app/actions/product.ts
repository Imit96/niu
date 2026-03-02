"use server";


import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";

// Create Product
export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      ritualName: formData.get("ritualName") as string,
      functionalTitle: formData.get("functionalTitle") as string,
      description: formData.get("description") as string,
      howToUse: formData.get("howToUse") as string,
      ingredientsText: formData.get("ingredientsText") as string,
      images: [formData.get("image") as string || "Product Image Placeholder"],
      variants: {
        create: {
          sku: `SKU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          priceInCents: parseInt(formData.get("price") as string) * 100, // naive conversion
          inventoryCount: 100,
          size: formData.get("size") as string,
        }
      }
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true, product };
}

// Get All Products for Admin
export async function getAdminProducts() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  return prisma.product.findMany({
    include: {
      variants: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

// Delete Product
export async function deleteProduct(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.product.delete({
    where: { id }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

// Get All Products for Storefront
export async function getPublicProducts() {
  return prisma.product.findMany({
    include: {
      variants: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

// Get Single Product by Slug for PDP
export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true
    }
  });
}
