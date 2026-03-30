"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// INGREDIENT ADMIN ACTIONS
// ==========================================

export async function adminGetAllIngredients() {
  return (prisma.ingredient.findMany as any)({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { products: { select: { id: true, name: true } } },
  });
}

export async function adminGetIngredientById(id: string) {
  return (prisma.ingredient.findUnique as any)({
    where: { id },
    include: { products: { select: { id: true, name: true } } },
  });
}

export async function createIngredient(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const origin = (formData.get("origin") as string) || null;
  const benefitsText = (formData.get("benefitsText") as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";
  const productIds = formData.getAll("productIds") as string[];
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";

  await (prisma.ingredient.create as any)({
    data: {
      name, slug, category, description, origin, benefitsText, sortOrder, isPublished, image, imagePosition,
      products: productIds.length > 0 ? { connect: productIds.map((id) => ({ id })) } : undefined,
      nameFr: (formData.get("nameFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      benefitsTextFr: (formData.get("benefitsTextFr") as string) || null,
    },
  });

  revalidatePath("/admin/ingredients");
  revalidatePath("/ingredients");
  redirect("/admin/ingredients");
}

export async function updateIngredient(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const origin = (formData.get("origin") as string) || null;
  const benefitsText = (formData.get("benefitsText") as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";
  const productIds = formData.getAll("productIds") as string[];
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";

  await (prisma.ingredient.update as any)({
    where: { id },
    data: {
      name, slug, category, description, origin, benefitsText, sortOrder, isPublished, image, imagePosition,
      products: { set: productIds.map((id) => ({ id })) },
      nameFr: (formData.get("nameFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      benefitsTextFr: (formData.get("benefitsTextFr") as string) || null,
    },
  });

  revalidatePath("/admin/ingredients");
  revalidatePath("/ingredients");
  redirect("/admin/ingredients");
}

export async function deleteIngredient(id: string) {
  await prisma.ingredient.delete({ where: { id } });
  revalidatePath("/admin/ingredients");
  revalidatePath("/ingredients");
}

// ==========================================
// GUIDE ADMIN ACTIONS
// ==========================================

export async function adminGetAllGuides() {
  return prisma.guide.findMany({
    orderBy: [{ sortOrder: "asc" }, { methodNumber: "asc" }],
  });
}

export async function adminGetGuideById(id: string) {
  return (prisma.guide as any).findUnique({
    where: { id },
    include: {
      relatedProduct: { select: { id: true, name: true } },
      products: { select: { id: true, name: true } },
    },
  });
}

export async function createGuide(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";
  const methodNumber = parseInt(formData.get("methodNumber") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";
  const productIds = formData.getAll("productIds") as string[];

  await (prisma.guide.create as any)({
    data: {
      title, slug, description, image, imagePosition, methodNumber, sortOrder, isPublished,
      titleFr: (formData.get("titleFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      products: productIds.length > 0 ? { connect: productIds.filter(Boolean).map((id) => ({ id })) } : undefined,
    },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  redirect("/admin/guides");
}

export async function updateGuide(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";
  const methodNumber = parseInt(formData.get("methodNumber") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";
  const productIds = formData.getAll("productIds") as string[];

  await (prisma.guide.update as any)({
    where: { id },
    data: {
      title, slug, description, image, imagePosition, methodNumber, sortOrder, isPublished,
      titleFr: (formData.get("titleFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      products: { set: productIds.filter(Boolean).map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  redirect("/admin/guides");
}

export async function deleteGuide(id: string) {
  await prisma.guide.delete({ where: { id } });
  revalidatePath("/admin/guides");
  revalidatePath("/guides");
}
