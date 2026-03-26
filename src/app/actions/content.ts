"use server";

import { prisma } from "@/lib/prisma";

// ---- Ingredients ----

export interface IngredientSummary {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
}

export interface IngredientDetail extends IngredientSummary {
  origin: string | null;
  benefitsText: string | null;
  relatedProduct: {
    id: string;
    slug: string;
    name: string;
    functionalTitle: string | null;
    images: string[];
    variants: { id: string; priceInCents: number; size: string | null; inventoryCount: number }[];
  } | null;
}

export async function getIngredients(): Promise<IngredientSummary[]> {
  return prisma.ingredient.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      description: true,
    },
  });
}

export async function getIngredientBySlug(slug: string): Promise<IngredientDetail | null> {
  return prisma.ingredient.findUnique({
    where: { slug },
    include: {
      relatedProduct: {
        select: {
          id: true,
          slug: true,
          name: true,
          functionalTitle: true,
          images: true,
          variants: {
            select: {
              id: true,
              priceInCents: true,
              size: true,
              inventoryCount: true,
            },
            take: 1,
          },
        },
      },
    },
  });
}

// ---- Guides ----

export interface GuideSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  methodNumber: number;
  image: string | null;
}

export async function getGuides(): Promise<GuideSummary[]> {
  return prisma.guide.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { methodNumber: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      methodNumber: true,
      image: true,
    },
  });
}

export async function getGuideBySlug(slug: string) {
  return prisma.guide.findUnique({ where: { slug } });
}
