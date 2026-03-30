"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { localise } from "@/lib/i18n-content";

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
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";

  await (prisma.ritualBundle.create as any)({
    data: {
      name,
      slug,
      description,
      priceInCents,
      image,
      imagePosition,
      category: (formData.get("category") as any) || "HAIR",
      nameFr: (formData.get("nameFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      products: {
        connect: productIds.filter(Boolean).map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/bundles");
  revalidatePath("/[locale]/bundles", "page");
  redirect("/admin/bundles");
}

export async function updateBundle(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const priceInCents = Math.round(parseFloat(formData.get("price") as string) * 100);
  const productIds = formData.getAll("productIds") as string[];
  const image = (formData.get("image") as string) || null;
  const imagePosition = (formData.get("imagePosition") as string) || "center";

  await (prisma.ritualBundle.update as any)({
    where: { id },
    data: {
      name,
      slug,
      description,
      priceInCents,
      image,
      imagePosition,
      category: (formData.get("category") as any) || "HAIR",
      nameFr: (formData.get("nameFr") as string) || null,
      descriptionFr: (formData.get("descriptionFr") as string) || null,
      products: {
        set: productIds.filter(Boolean).map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/bundles");
  revalidatePath("/[locale]/bundles", "page");
  redirect("/admin/bundles");
}

export async function deleteBundle(id: string) {
  await prisma.ritualBundle.delete({ where: { id } });
  revalidatePath("/admin/bundles");
  revalidatePath("/bundles");
}

// Public read functions for storefront
export async function getPublicBundles(locale = "en") {
  const bundles = await prisma.ritualBundle.findMany({
    orderBy: { createdAt: "desc" },
    include: { products: { include: { variants: { take: 1 } } } },
  });
  return bundles.map((b) => {
    const ba = b as any;
    return {
      ...b,
      name: localise(b.name, ba.nameFr, locale),
      description: localise(b.description, ba.descriptionFr, locale),
    };
  });
}

export async function getBundleBySlug(slug: string, locale = "en") {
  const b = await prisma.ritualBundle.findUnique({
    where: { slug },
    include: { products: { include: { variants: true } } },
  });
  if (!b) return b;
  const ba = b as any;
  return {
    ...b,
    name: localise(b.name, ba.nameFr, locale),
    description: localise(b.description, ba.descriptionFr, locale),
  };
}

export async function getSignatureRegimens(locale = "en") {
  const categories = ["HAIR", "BODY", "SCENT"];
  const results = await Promise.all(
    categories.map(async (cat) => {
      const bundle = await (prisma.ritualBundle.findFirst as any)({
        where: { category: cat },
        orderBy: { createdAt: "desc" },
        include: {
          products: {
            include: {
              variants: { take: 1 },
            },
          },
        },
      });

      if (!bundle) return null;

      const ba = bundle as any;
      return {
        ...bundle,
        name: localise(bundle.name, ba.nameFr, locale),
        description: localise(bundle.description, ba.descriptionFr, locale),
      };
    })
  );

  return {
    hair: results[0],
    skin: results[1],
    scent: results[2],
  };
}
