"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// INGREDIENT ADMIN ACTIONS
// ==========================================

export async function adminGetAllIngredients() {
  return prisma.ingredient.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { relatedProduct: { select: { id: true, name: true } } },
  });
}

export async function adminGetIngredientById(id: string) {
  return prisma.ingredient.findUnique({
    where: { id },
    include: { relatedProduct: { select: { id: true, name: true } } },
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
  const relatedProductId = (formData.get("relatedProductId") as string) || null;

  await prisma.ingredient.create({
    data: { name, slug, category, description, origin, benefitsText, sortOrder, isPublished, relatedProductId },
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
  const relatedProductId = (formData.get("relatedProductId") as string) || null;

  await prisma.ingredient.update({
    where: { id },
    data: { name, slug, category, description, origin, benefitsText, sortOrder, isPublished, relatedProductId },
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
  return prisma.guide.findUnique({ where: { id } });
}

export async function createGuide(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const image = (formData.get("image") as string) || null;
  const methodNumber = parseInt(formData.get("methodNumber") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";

  await prisma.guide.create({
    data: { title, slug, description, image, methodNumber, sortOrder, isPublished },
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
  const methodNumber = parseInt(formData.get("methodNumber") as string) || 0;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isPublished = formData.get("isPublished") === "true";

  await prisma.guide.update({
    where: { id },
    data: { title, slug, description, image, methodNumber, sortOrder, isPublished },
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
