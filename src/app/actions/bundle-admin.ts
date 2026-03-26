"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function adminGetAllBundles() {
  return prisma.ritualBundle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      products: { select: { id: true, name: true } },
    },
  });
}

export async function adminGetBundleById(id: string) {
  return prisma.ritualBundle.findUnique({
    where: { id },
    include: {
      products: { select: { id: true, name: true } },
    },
  });
}

export async function createBundle(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const priceInCents = Math.round(parseFloat(formData.get("price") as string) * 100);
  const productIds = formData.getAll("productIds") as string[];

  await prisma.ritualBundle.create({
    data: {
      name,
      slug,
      description,
      priceInCents,
      products: {
        connect: productIds.filter(Boolean).map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/bundles");
  revalidatePath("/bundles");
  redirect("/admin/bundles");
}

export async function updateBundle(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const priceInCents = Math.round(parseFloat(formData.get("price") as string) * 100);
  const productIds = formData.getAll("productIds") as string[];

  // First disconnect all, then reconnect with the new selection
  await prisma.ritualBundle.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      priceInCents,
      products: {
        set: productIds.filter(Boolean).map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/bundles");
  revalidatePath("/bundles");
  redirect("/admin/bundles");
}

export async function deleteBundle(id: string) {
  await prisma.ritualBundle.delete({ where: { id } });
  revalidatePath("/admin/bundles");
  revalidatePath("/bundles");
}
