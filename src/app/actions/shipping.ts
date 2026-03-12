"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/auth-utils";

export type ShippingRate = {
  id: string;
  name: string;
  type: string;
  region: string | null;
  rateInCents: number;
  estimatedDays: string | null;
  isActive: boolean;
};

// Public — used by checkout to compute shipping
export async function getActiveShippingRates(): Promise<ShippingRate[]> {
  try {
    return await prisma.shippingRate.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { region: "asc" }],
    });
  } catch {
    return [];
  }
}

// Admin — all rates
export async function getAdminShippingRates(): Promise<ShippingRate[]> {
  await requireAdmin();
  return prisma.shippingRate.findMany({
    orderBy: [{ type: "asc" }, { region: "asc" }],
  });
}

// Admin — create
export async function createShippingRate(
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const region = (formData.get("region") as string)?.trim() || null;
  const rateRaw = parseFloat(formData.get("rateAmount") as string);
  const rateInCents = Math.round(rateRaw * 100);
  const estimatedDays = (formData.get("estimatedDays") as string)?.trim() || null;

  if (!name || !type || isNaN(rateInCents) || rateInCents < 0) {
    return { error: "Please fill in all required fields with valid values." };
  }

  await prisma.shippingRate.create({
    data: { name, type, region, rateInCents, estimatedDays, isActive: true },
  });

  revalidatePath("/admin/shipping-rates");
  return { success: true };
}

// Admin — toggle active
export async function toggleShippingRate(id: string) {
  await requireAdmin();
  const rate = await prisma.shippingRate.findFirst({ where: { id } });
  if (!rate) throw new Error("Shipping rate not found");
  await prisma.shippingRate.update({
    where: { id },
    data: { isActive: !rate.isActive },
  });
  revalidatePath("/admin/shipping-rates");
}

// Admin — delete
export async function deleteShippingRate(id: string) {
  await requireAdmin();
  await prisma.shippingRate.delete({ where: { id } });
  revalidatePath("/admin/shipping-rates");
}
