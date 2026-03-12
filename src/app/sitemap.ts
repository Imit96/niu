import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://origonae.com";

  // Fetch all dynamically generated routes
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });
  
  const journals = await prisma.article.findMany({
    select: { slug: true, updatedAt: true },
  });
  
  const bundles = await prisma.ritualBundle.findMany({
    select: { slug: true, updatedAt: true },
  });

  const productEntries = products.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const journalEntries = journals.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const bundleEntries = bundles.map((bundle) => ({
    url: `${baseUrl}/bundles/${bundle.slug}`,
    lastModified: bundle.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const staticRoutes = [
    { path: "", freq: "daily" as const, priority: 1.0 },
    { path: "/about", freq: "weekly" as const, priority: 0.8 },
    { path: "/shop", freq: "daily" as const, priority: 0.9 },
    { path: "/journal", freq: "weekly" as const, priority: 0.8 },
    { path: "/salon", freq: "weekly" as const, priority: 0.7 },
    { path: "/contact", freq: "monthly" as const, priority: 0.6 },
    { path: "/ingredients", freq: "weekly" as const, priority: 0.7 },
    { path: "/guides", freq: "weekly" as const, priority: 0.7 },
    { path: "/bundles", freq: "weekly" as const, priority: 0.8 },
    { path: "/faq", freq: "monthly" as const, priority: 0.5 },
    { path: "/shipping", freq: "monthly" as const, priority: 0.4 },
    { path: "/privacy", freq: "yearly" as const, priority: 0.3 },
    { path: "/terms", freq: "yearly" as const, priority: 0.3 },
  ].map(({ path, freq, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Ingredient pages are hardcoded — list slugs here
  const ingredientSlugs = [
    "african-black-soap",
    "baobab-oil",
    "chebe-powder",
    "kalahari-melon-seed",
    "rhassoul-clay",
    "shea-butter",
  ];
  const ingredientEntries = ingredientSlugs.map((slug) => ({
    url: `${baseUrl}/ingredients/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productEntries, ...journalEntries, ...bundleEntries, ...ingredientEntries];
}
