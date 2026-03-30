"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import { ProductSchema, VariantSchema, formDataToObject } from "../../lib/validators";
import { ROLES } from "../../lib/constants";
import { requireAdmin } from "../../lib/auth-utils";
import type { Prisma } from "@prisma/client";
import { localise } from "@/lib/i18n-content";

// Helper: safely parse JSON with a fallback value
function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Helper: validate product form data
function validateProductData(formData: FormData) {
  const parsed = ProductSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Invalid product data";
    throw new Error(firstError);
  }
  return parsed.data;
}

// Helper: parse and validate variants from variantsJson form field
function parseVariants(formData: FormData) {
  const raw: { id?: string; size?: string; price?: string | number; salePrice?: string | number; inventoryCount?: string | number }[] =
    safeJsonParse(formData.get("variantsJson") as string, []);
  if (!raw.length) throw new Error("At least one variant is required");
  return raw.map((v, i) => {
    const parsed = VariantSchema.safeParse(v);
    if (!parsed.success) {
      const msg = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
      throw new Error(`Variant ${i + 1}: ${msg}`);
    }
    return parsed.data;
  });
}

// Create Product
export async function createProduct(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== ROLES.ADMIN) throw new Error("Unauthorized");

  const validated = validateProductData(formData);
  const name = validated.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const variants = parseVariants(formData);

  const product = await (prisma.product.create as any)({
    data: {
      name,
      slug,
      ritualName: formData.get("ritualName") as string,
      functionalTitle: formData.get("functionalTitle") as string,
      texture: formData.get("texture") as string,
      description: formData.get("description") as string,
      howToUse: formData.get("howToUse") as string,
      ingredientsText: formData.get("ingredientsText") as string,
      performanceMedia: formData.get("performanceMedia") as string,
      performanceMediaPosition: (formData.get("performanceMediaPosition") as string) || "center",
      textureHeading: formData.get("textureHeading") as string,
      textureScent: formData.get("textureScent") as string,
      inspirationHeading: formData.get("inspirationHeading") as string,
      culturalInspiration: formData.get("culturalInspiration") as string,
      resonanceData: safeJsonParse(formData.get("resonanceData") as string, []),
      faqData: safeJsonParse(formData.get("faqData") as string, []),
      nameFr: (formData.get("nameFr") as string) || null,
      ritualNameFr: (formData.get("ritualNameFr") as string) || null,
      functionalTitleFr: (formData.get("functionalTitleFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      howToUseFr: (formData.get("howToUseFr") as string) || null,
      ingredientsTextFr: (formData.get("ingredientsTextFr") as string) || null,
      textureScentFr: (formData.get("textureScentFr") as string) || null,
      culturalInspirationFr: (formData.get("culturalInspirationFr") as string) || null,
      resonanceDataFr: safeJsonParse(formData.get("resonanceDataFr") as string, null),
      faqDataFr: safeJsonParse(formData.get("faqDataFr") as string, null),
      category: (formData.get("category") as string) || "OTHER",
      regimenProductIds: formData.getAll("regimenProductIds") as string[],
      imagePositions: safeJsonParse(formData.get("imagePositionsJson") as string, []),
      images: (() => {
        const parsed: string[] = safeJsonParse(formData.get("imagesJson") as string, []);
        return parsed.filter(Boolean).length ? parsed.filter(Boolean) : ["Product Image Placeholder"];
      })(),
      variants: {
        createMany: {
          data: variants.map((v) => ({
            sku: `SKU-${crypto.randomUUID().replace(/-/g, "").slice(0, 9).toUpperCase()}`,
            size: v.size || null,
            priceInCents: Math.round(v.price * 100),
            salePriceInCents: v.salePrice ? Math.round(v.salePrice * 100) : null,
            inventoryCount: v.inventoryCount,
          })),
        },
      },
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/hair");
  revalidatePath("/scent");
  revalidatePath("/skin");
  return { success: true, product };
}

// Update Product
export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== ROLES.ADMIN) throw new Error("Unauthorized");

  const validated = validateProductData(formData);
  const name = validated.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const isFeaturedHair = formData.get("isFeaturedHair") === "on";
  const isFeaturedScent = formData.get("isFeaturedScent") === "on";

  // Ensure only one product holds each spotlight at a time
  if (isFeaturedHair) {
    await prisma.product.updateMany({ where: { isFeaturedHair: true, NOT: { id } }, data: { isFeaturedHair: false } });
  }
  if (isFeaturedScent) {
    await prisma.product.updateMany({ where: { isFeaturedScent: true, NOT: { id } }, data: { isFeaturedScent: false } });
  }

  const variants = parseVariants(formData);
  const submittedIds = variants.filter((v) => v.id).map((v) => v.id as string);

  // Delete variants removed from the form, but only those with no order history
  await prisma.productVariant.deleteMany({
    where: { productId: id, id: { notIn: submittedIds }, orderItems: { none: {} } },
  });

  // Update existing variants, create new ones
  for (const v of variants) {
    const variantData = {
      size: v.size || null,
      priceInCents: Math.round(v.price * 100),
      salePriceInCents: v.salePrice ? Math.round(v.salePrice * 100) : null,
      inventoryCount: v.inventoryCount,
    };
    if (v.id) {
      await prisma.productVariant.update({ where: { id: v.id }, data: variantData });
    } else {
      await prisma.productVariant.create({
        data: {
          ...variantData,
          productId: id,
          sku: `SKU-${crypto.randomUUID().replace(/-/g, "").slice(0, 9).toUpperCase()}`,
        },
      });
    }
  }

  const product = await (prisma.product.update as any)({
    where: { id },
    data: {
      name,
      slug,
      ritualName: formData.get("ritualName") as string,
      functionalTitle: formData.get("functionalTitle") as string,
      texture: formData.get("texture") as string,
      description: formData.get("description") as string,
      howToUse: formData.get("howToUse") as string,
      ingredientsText: formData.get("ingredientsText") as string,
      performanceMedia: formData.get("performanceMedia") as string,
      performanceMediaPosition: (formData.get("performanceMediaPosition") as string) || "center",
      textureHeading: formData.get("textureHeading") as string,
      textureScent: formData.get("textureScent") as string,
      inspirationHeading: formData.get("inspirationHeading") as string,
      culturalInspiration: formData.get("culturalInspiration") as string,
      resonanceData: safeJsonParse(formData.get("resonanceData") as string, []),
      faqData: safeJsonParse(formData.get("faqData") as string, []),
      nameFr: (formData.get("nameFr") as string) || null,
      ritualNameFr: (formData.get("ritualNameFr") as string) || null,
      functionalTitleFr: (formData.get("functionalTitleFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      howToUseFr: (formData.get("howToUseFr") as string) || null,
      ingredientsTextFr: (formData.get("ingredientsTextFr") as string) || null,
      textureScentFr: (formData.get("textureScentFr") as string) || null,
      culturalInspirationFr: (formData.get("culturalInspirationFr") as string) || null,
      resonanceDataFr: safeJsonParse(formData.get("resonanceDataFr") as string, null),
      faqDataFr: safeJsonParse(formData.get("faqDataFr") as string, null),
      category: (formData.get("category") as string) || "OTHER",
      regimenProductIds: formData.getAll("regimenProductIds") as string[],
      imagePositions: safeJsonParse(formData.get("imagePositionsJson") as string, []),
      isFeaturedHair,
      isFeaturedScent,
      images: (() => {
        const parsed: string[] = safeJsonParse(formData.get("imagesJson") as string, []);
        return parsed.filter(Boolean).length ? parsed.filter(Boolean) : ["Product Image Placeholder"];
      })(),
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/hair");
  revalidatePath("/scent");
  revalidatePath("/skin");
  revalidatePath("/");
  return { success: true, product };
}

// Get All Products for Admin
export async function getAdminProducts(page = 1, pageSize = 25) {
  const session = await auth();
  if (session?.user?.role !== ROLES.ADMIN) throw new Error("Unauthorized");

  const skip = (page - 1) * pageSize;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count(),
  ]);
  return { products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// Delete Product
export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id }
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/hair");
  revalidatePath("/scent");
  revalidatePath("/skin");
  return { success: true };
}

// Homepage spotlight getters
export async function getFeaturedHairProduct(locale = "en") {
  const p = await prisma.product.findFirst({
    where: { isFeaturedHair: true },
    select: {
      id: true, slug: true,
      name: true, nameFr: true,
      functionalTitle: true, functionalTitleFr: true,
      description: true, descriptionFr: true,
      images: true,
      variants: { take: 1, select: { priceInCents: true } },
    },
  });
  if (!p) return p;
  return {
    ...p,
    name: localise(p.name, p.nameFr, locale),
    functionalTitle: localise(p.functionalTitle, p.functionalTitleFr, locale),
    description: localise(p.description, p.descriptionFr, locale),
  };
}

export async function getFeaturedScentProduct(locale = "en") {
  const p = await prisma.product.findFirst({
    where: { isFeaturedScent: true },
    select: {
      id: true, slug: true,
      name: true, nameFr: true,
      functionalTitle: true, functionalTitleFr: true,
      description: true, descriptionFr: true,
      images: true,
      variants: { take: 1, select: { priceInCents: true } },
    },
  });
  if (!p) return p;
  return {
    ...p,
    name: localise(p.name, p.nameFr, locale),
    functionalTitle: localise(p.functionalTitle, p.functionalTitleFr, locale),
    description: localise(p.description, p.descriptionFr, locale),
  };
}

// Generic helper — fetch products by category enum value
async function getProductsByCategory(category: string, page: number, pageSize: number, locale: string) {
  const where = { category: category as any };
  const skip = (page - 1) * pageSize;
  const [products, total] = await Promise.all([
    (prisma.product.findMany as any)({
      where,
      include: { variants: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where: where as any }),
  ]);
  const localised = products.map((p: any) => ({
    ...p,
    name: localise(p.name, p.nameFr, locale),
    functionalTitle: localise(p.functionalTitle ?? null, p.functionalTitleFr ?? null, locale),
    description: localise(p.description, p.descriptionFr, locale),
  }));
  return { products: localised, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

export async function getHairProducts(page = 1, pageSize = 24, locale = "en") {
  return getProductsByCategory("HAIR", page, pageSize, locale);
}

export async function getScentProducts(page = 1, pageSize = 24, locale = "en") {
  return getProductsByCategory("SCENT", page, pageSize, locale);
}

export async function getSkinProducts(page = 1, pageSize = 24, locale = "en") {
  return getProductsByCategory("BODY", page, pageSize, locale);
}

// Get Products for Storefront — SQL-filtered and paginated
export async function getPublicProducts(
  filters: { ritual?: string; texture?: string; search?: string } = {},
  page = 1,
  pageSize = 24,
  locale = "en"
) {
  const { ritual, texture, search } = filters;

  const where: Prisma.ProductWhereInput = {};

  if (ritual && ritual !== "All") {
    where.ritualName = ritual;
  }
  if (texture && texture !== "All") {
    where.texture = texture;
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { functionalTitle: { contains: search, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * pageSize;
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variants: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const localisedProducts = products.map((p) => {
    const pa = p as any;
    return {
      ...p,
      name: localise(p.name, pa.nameFr, locale),
      functionalTitle: localise(p.functionalTitle ?? null, pa.functionalTitleFr ?? null, locale),
      description: localise(p.description, pa.descriptionFr, locale),
    };
  });
  return { products: localisedProducts, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}

// Lightweight product list for search autocomplete — no variants needed
export async function getProductsForSearch() {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: true,
      ritualName: true,
      functionalTitle: true,
      description: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

// Get Multiple Products by IDs
export async function getProductsByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  return prisma.product.findMany({
    where: { id: { in: ids } },
    include: { variants: true }
  });
}

// Get Single Product by Slug or ID for PDP
export async function getProductBySlug(slugOrId: string, locale = "en") {
  const p = await prisma.product.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    include: { variants: true },
  });
  if (!p) return p;
  const pa = p as any;
  return {
    ...p,
    name: localise(p.name, pa.nameFr, locale),
    ritualName: localise(p.ritualName ?? null, pa.ritualNameFr ?? null, locale),
    functionalTitle: localise(p.functionalTitle ?? null, pa.functionalTitleFr ?? null, locale),
    description: localise(p.description, pa.descriptionFr, locale),
    howToUse: localise(p.howToUse ?? null, pa.howToUseFr ?? null, locale),
    ingredientsText: localise(p.ingredientsText ?? null, pa.ingredientsTextFr ?? null, locale),
    textureScent: localise(p.textureScent ?? null, pa.textureScentFr ?? null, locale),
    culturalInspiration: localise(p.culturalInspiration ?? null, pa.culturalInspirationFr ?? null, locale),
    resonanceData: locale === "fr" && pa.resonanceDataFr ? pa.resonanceDataFr : p.resonanceData,
    faqData: locale === "fr" && pa.faqDataFr ? pa.faqDataFr : p.faqData,
  };
}
