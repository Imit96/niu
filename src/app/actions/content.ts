"use server";

import { prisma } from "@/lib/prisma";
import { localise } from "@/lib/i18n-content";

// ---- Ingredients ----

export interface IngredientSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string | null;
  imagePosition: string | null;
}

export interface IngredientDetail extends IngredientSummary {
  origin: string | null;
  benefitsText: string | null;
  products: {
    id: string;
    slug: string;
    name: string;
    functionalTitle: string | null;
    images: string[];
    variants: { id: string; priceInCents: number; size: string | null; inventoryCount: number }[];
  }[];
}

export async function getIngredients(locale = "en"): Promise<IngredientSummary[]> {
  const ingredients = await (prisma.ingredient.findMany as any)({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true, slug: true,
      name: true, nameFr: true,
      category: true,
      description: true, descriptionFr: true,
      image: true, imagePosition: true,
    },
  });
  return ingredients.map((i: any) => ({
    id: i.id,
    slug: i.slug,
    name: localise(i.name, i.nameFr, locale),
    category: i.category,
    description: localise(i.description, i.descriptionFr, locale),
    image: i.image ?? null,
    imagePosition: i.imagePosition ?? null,
  }));
}

export async function getIngredientBySlug(slug: string, locale = "en"): Promise<IngredientDetail | null> {
  const i = await (prisma.ingredient.findUnique as any)({
    where: { slug },
    include: {
      products: {
        select: {
          id: true, slug: true, name: true,
          functionalTitle: true, images: true,
          variants: { select: { id: true, priceInCents: true, size: true, inventoryCount: true }, take: 1 },
        },
      },
    },
  });
  if (!i) return null;
  const ia = i as any;
  return {
    ...i,
    name: localise(i.name, ia.nameFr, locale),
    description: localise(i.description, ia.descriptionFr, locale),
    benefitsText: localise(i.benefitsText ?? null, ia.benefitsTextFr ?? null, locale),
  };
}

// ---- Guides ----

export interface GuideSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  methodNumber: number;
  image: string | null;
  imagePosition: string | null;
}

export async function getGuides(locale = "en"): Promise<GuideSummary[]> {
  const guides = await (prisma.guide.findMany as any)({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { methodNumber: "asc" }],
    select: {
      id: true, slug: true,
      title: true, titleFr: true,
      description: true, descriptionFr: true,
      methodNumber: true, image: true, imagePosition: true,
    },
  });
  return guides.map((g: any) => ({
    id: g.id,
    slug: g.slug,
    title: localise(g.title, g.titleFr, locale),
    description: localise(g.description, g.descriptionFr, locale),
    methodNumber: g.methodNumber,
    image: g.image,
    imagePosition: g.imagePosition ?? null,
  }));
}

export async function getGuideBySlug(slug: string, locale = "en") {
  const g = await (prisma.guide.findUnique as any)({
    where: { slug },
    include: {
      products: {
        select: {
          id: true, slug: true, name: true, functionalTitle: true,
          images: true,
          variants: { select: { id: true, priceInCents: true, size: true, inventoryCount: true }, orderBy: { priceInCents: "asc" }, take: 1 },
        },
      },
    },
  });
  if (!g) return null;
  const ga = g as any;
  return {
    ...g,
    title: localise(g.title, ga.titleFr, locale),
    description: localise(g.description, ga.descriptionFr, locale),
  };
}
