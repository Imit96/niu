import { prisma } from "./src/lib/prisma";

async function run() {
  try {
    const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });
    console.log("Products count:", products.length);
    const articles = await prisma.article.findMany({ select: { slug: true, updatedAt: true } });
    console.log("Articles count:", articles.length);
    const bundles = await prisma.ritualBundle.findMany({ select: { slug: true, updatedAt: true } });
    console.log("Bundles count:", bundles.length);
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
