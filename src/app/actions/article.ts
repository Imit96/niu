'use server'

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../auth";
import { ROLES } from "@/lib/constants";

import { requireAdmin } from "../../lib/auth-utils";

export async function getArticles() {
  return await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { datePublished: "desc" }],
  });
}

export async function moveArticle(id: string, direction: "up" | "down") {
  await requireAdmin();
  const articles = await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { datePublished: "desc" }],
    select: { id: true, sortOrder: true },
  });

  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return;

  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= articles.length) return;

  const current = articles[index];
  const neighbor = articles[swapIndex];

  // Ensure distinct sortOrder values before swapping
  const normalised = articles.map((a, i) => ({ id: a.id, sortOrder: i }));
  await prisma.$transaction(
    normalised.map((a) =>
      prisma.article.update({ where: { id: a.id }, data: { sortOrder: a.sortOrder } })
    )
  );

  // Now swap the two
  await prisma.$transaction([
    prisma.article.update({ where: { id: current.id }, data: { sortOrder: swapIndex } }),
    prisma.article.update({ where: { id: neighbor.id }, data: { sortOrder: index } }),
  ]);

  revalidatePath("/journal");
  revalidatePath("/admin/articles");
}

export async function getFeaturedArticle() {
  return await prisma.article.findFirst({
    where: { isFeatured: true },
    orderBy: { datePublished: "desc" },
  });
}

export async function getArticleById(id: string) {
  return await prisma.article.findFirst({
    where: { id },
  });
}

export async function getArticleBySlug(slug: string) {
  return await prisma.article.findFirst({
    where: { slug },
    include: {
      relatedProduct: {
        include: {
          variants: true
        }
      }
    }
  });
}

export async function createArticle(data: {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  mediaUrl?: string | null;
  isFeatured?: boolean;
  relatedProductId?: string | null;
}) {
  await requireAdmin();
  if (data.isFeatured) {
    await prisma.article.updateMany({ where: { isFeatured: true }, data: { isFeatured: false } });
  }

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      category: data.category,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      mediaUrl: data.mediaUrl,
      isFeatured: data.isFeatured ?? false,
      relatedProductId: data.relatedProductId,
    },
  });

  revalidatePath("/journal");
  revalidatePath("/admin/articles");
  return article;
}

export async function updateArticle(
  id: string,
  data: {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    featuredImage?: string | null;
    mediaUrl?: string | null;
    isFeatured?: boolean;
    datePublished?: Date;
    relatedProductId?: string | null;
  }
) {
  await requireAdmin();
  if (data.isFeatured) {
    await prisma.article.updateMany({ where: { isFeatured: true, NOT: { id } }, data: { isFeatured: false } });
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      category: data.category,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      mediaUrl: data.mediaUrl,
      isFeatured: data.isFeatured,
      datePublished: data.datePublished,
      relatedProductId: data.relatedProductId,
    },
  });

  revalidatePath("/journal");
  revalidatePath(`/journal/${data.slug}`);
  revalidatePath("/admin/articles");
  return article;
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const article = await prisma.article.delete({
    where: { id },
  });

  revalidatePath("/journal");
  revalidatePath("/admin/articles");
  return article;
}
