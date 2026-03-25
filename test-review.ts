import { prisma } from "./src/lib/prisma";

async function run() {
  try {
    const reviews = await prisma.review.findMany({ select: { isFeatured: true }, take: 1 });
    console.log("Success! Reviews have isFeatured.");
  } catch (err) {
    console.error("Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
