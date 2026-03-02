import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ORIGONAE Database...");

  // Insert Core The Cleansing Regimen
  const clayWash = await prisma.product.upsert({
    where: { slug: "purifying-clay-wash" },
    update: {},
    create: {
      name: "Purifying Clay Wash",
      slug: "purifying-clay-wash",
      ritualName: "The Cleansing Regimen",
      description: "A deeply cleansing, earthy blend that removes buildup while respecting the scalp's natural oils. Mined from the Atlas Mountains, this mineral-rich Rhassoul clay purifies without stripping.",
      images: [],
      variants: {
        create: [
          { size: "200ml", priceInCents: 2500000, inventoryCount: 50, sku: "ORG-CLN-CLY-01-200" }
        ]
      }
    }
  });

  // Insert Core The Restoration Regimen
  const restorativeMask = await prisma.product.upsert({
    where: { slug: "restorative-baobab-mask" },
    update: {},
    create: {
      name: "Restorative Baobab Mask",
      slug: "restorative-baobab-mask",
      ritualName: "The Restoration Regimen",
      description: "An incredibly rich, whipped mask formulated with ancient Baobab to penetrate and heal severely parched or damaged strands.",
      images: [],
      variants: {
        create: [
          { size: "250ml", priceInCents: 3800000, inventoryCount: 30, sku: "ORG-RST-MSK-01-250" },
          { size: "500ml", priceInCents: 6500000, inventoryCount: 15, sku: "ORG-RST-MSK-01-500" }
        ]
      }
    }
  });

  // Insert Core The Growth Regimen
  const kalahariOil = await prisma.product.upsert({
    where: { slug: "kalahari-growth-oil" },
    update: {},
    create: {
      name: "Kalahari Growth Oil",
      slug: "kalahari-growth-oil",
      ritualName: "The Growth Regimen",
      description: "A resilient desert oil providing intense, lightweight hydration to parched strands while stimulating the scalp for optimal growth.",
      images: [],
      variants: {
        create: [
          { size: "50ml", priceInCents: 2200000, inventoryCount: 100, sku: "ORG-GRO-OIL-01-50" }
        ]
      }
    }
  });

  console.log("Seeding complete!");
  console.log("Inserted:");
  console.log(`- ${clayWash.name}`);
  console.log(`- ${restorativeMask.name}`);
  console.log(`- ${kalahariOil.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
