/**
 * ORIGONÆ — Prisma Seed Script
 * Run: npx prisma db seed
 *
 * - Updates existing products with correct categories
 * - Inserts additional sample products (HAIR, SCENT, BODY)
 * - Creates a sample Ritual Bundle
 *
 * Safe to re-run — uses upsert on slug.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// All products (existing + new)
// ---------------------------------------------------------------------------

const PRODUCTS = [
  // ── Existing HAIR products (update category only) ─────────────────────────
  {
    slug: "purifying-clay-wash",
    name: "Purifying Clay Wash",
    ritualName: "The Cleansing Regimen",
    functionalTitle: "Deep Scalp Detox",
    texture: "Clay",
    category: "HAIR",
    isFeaturedHair: true,
    description:
      "A deeply cleansing, earthy blend that removes buildup while respecting the scalp's natural oils. Mined from the Atlas Mountains, this mineral-rich Rhassoul clay purifies without stripping.",
    ingredientsText: "Rhassoul Clay, Kalahari Melon Seed Oil, Aloe Vera, Peppermint Essential Oil",
    howToUse: "Apply generously to damp scalp. Massage in circular motions for 3–5 minutes. Leave for 10 minutes, then rinse. Use once per week.",
    images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80"],
    variants: [{ sku: "ORG-CLN-CLY-01-200", size: "200ml", priceInCents: 2500000 }],
  },
  {
    slug: "restorative-baobab-mask",
    name: "Restorative Baobab Mask",
    ritualName: "The Restoration Regimen",
    functionalTitle: "Intensive Repair",
    texture: "Cream",
    category: "HAIR",
    description:
      "An incredibly rich, whipped mask formulated with ancient Baobab to penetrate and heal severely parched or damaged strands.",
    ingredientsText: "Baobab Seed Oil, Shea Butter, Marula Oil, Keratin Protein, Vitamin E",
    howToUse: "Apply generously to clean, damp hair. Cover with a shower cap. Leave for 20–30 minutes, then rinse.",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"],
    variants: [
      { sku: "ORG-RST-MSK-01-250", size: "250ml", priceInCents: 3800000 },
      { sku: "ORG-RST-MSK-01-500", size: "500ml", priceInCents: 6500000 },
    ],
  },
  {
    slug: "kalahari-growth-oil",
    name: "Kalahari Growth Oil",
    ritualName: "The Growth Regimen",
    functionalTitle: "Scalp Stimulator",
    texture: "Oil",
    category: "HAIR",
    description:
      "A resilient desert oil providing intense, lightweight hydration to parched strands while stimulating the scalp for optimal growth.",
    ingredientsText: "Kalahari Melon Seed Oil, Castor Oil, Peppermint, Rosemary Extract, Biotin",
    howToUse: "Apply 4–6 drops directly to the scalp. Massage for 3 minutes. Leave overnight or for a minimum of 1 hour before washing.",
    images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80"],
    variants: [{ sku: "ORG-GRO-OIL-01-50", size: "50ml", priceInCents: 2200000 }],
  },

  // ── Existing SCENT products (update category) ─────────────────────────────
  {
    slug: "vetiver-root-parfum",
    name: "Vetiver Root Parfum",
    ritualName: "The Olfactory Regimen",
    functionalTitle: "Extrait de Parfum",
    texture: "Parfum",
    category: "SCENT",
    isFeaturedScent: true,
    description:
      "A deep, smoky, and complex petrichor aroma that grounds the spirit. Formulated with authentic Vetiver root from Madagascar.",
    ingredientsText: "Vetiver Root Absolute, Patchouli, Benzoin Resinoid, Cedarwood, Musk",
    howToUse: "Apply 2–3 drops to pulse points. Layer with the body mist for projection.",
    images: ["https://images.unsplash.com/photo-1594913894831-dbf3b2bdf1d8?w=800&q=80"],
    variants: [{ sku: "ORG-FRG-VET-01-50", size: "50ml", priceInCents: 12000000 }],
  },
  {
    slug: "saharan-amber-parfum",
    name: "Saharan Amber Parfum",
    ritualName: "The Olfactory Regimen",
    functionalTitle: "Extrait de Parfum",
    texture: "Parfum",
    category: "SCENT",
    description:
      "A warm, resinous architecture of fossilized amber, labdanum, and subtle spice. Inspired by trans-Saharan trade routes.",
    ingredientsText: "Amber Resinoid, Labdanum Absolute, Oud, Sandalwood, Vanilla",
    howToUse: "Apply to pulse points. Develops over 2–3 hours as the base notes deepen.",
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"],
    variants: [{ sku: "ORG-FRG-AMB-01-50", size: "50ml", priceInCents: 14000000 }],
  },

  // ── New SCENT product ──────────────────────────────────────────────────────
  {
    slug: "sacred-forest-mist",
    name: "Sacred Forest Mist",
    ritualName: "The Olfactory Regimen",
    functionalTitle: "Botanical Hair & Body Mist",
    texture: "Mist",
    category: "SCENT",
    description:
      "A light, alcohol-free botanical mist distilled from cedar, sandalwood, and ylang-ylang. Doubles as a hair fragrance and body refresher.",
    ingredientsText: "Cedarwood Hydrosol, Sandalwood Oil, Ylang-Ylang, Rose Water, Glycerin",
    howToUse: "Mist over styled hair from 30cm. Apply to body after bathing. Refresh throughout the day.",
    images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80"],
    variants: [{ sku: "ORG-MST-SFR-01-100", size: "100ml", priceInCents: 2200000 }],
  },

  // ── New BODY products ──────────────────────────────────────────────────────
  {
    slug: "marula-body-oil",
    name: "Marula Body Oil",
    ritualName: null,
    functionalTitle: "Regenerative Full-Body Treatment Oil",
    texture: "Oil",
    category: "BODY",
    description:
      "Cold-pressed marula oil — sourced from Southern Africa — is one of nature's most oleic-rich emollients. Absorbs rapidly, leaving skin visibly luminous without residue.",
    ingredientsText: "Marula Oil, Sea Buckthorn, Rosehip Seed Oil, Frankincense, Vitamin C",
    howToUse: "Apply to damp skin immediately after bathing. Massage in upward strokes. Use morning and evening.",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80"],
    variants: [{ sku: "ORG-BDY-MRL-01-150", size: "150ml", priceInCents: 4200000 }],
  },
  {
    slug: "black-soap-sugar-scrub",
    name: "Black Soap Sugar Scrub",
    ritualName: null,
    functionalTitle: "Clarifying Exfoliant for Face & Body",
    texture: "Clay",
    category: "BODY",
    description:
      "A dual-action scrub combining West African black soap with raw cane sugar crystals. Removes dead cells, unclogs pores, and restores radiance.",
    ingredientsText: "African Black Soap, Raw Cane Sugar, Shea Butter, Coconut Oil, Turmeric Extract",
    howToUse: "Apply to wet skin and massage in circular motions. Rinse thoroughly. Use 2–3 times per week.",
    images: ["https://images.unsplash.com/photo-1614869452773-bfd52f6e1c2b?w=800&q=80"],
    variants: [{ sku: "ORG-BDY-SCB-01-200", size: "200ml", priceInCents: 2100000 }],
  },
];

// ---------------------------------------------------------------------------
// Bundle
// ---------------------------------------------------------------------------

const BUNDLE = {
  slug: "the-complete-ritual-bundle",
  name: "The Complete Ritual",
  description:
    "The full ORIGONÆ practice in one curated set — Purifying Clay Wash to cleanse, Restorative Baobab Mask to repair, Kalahari Growth Oil to strengthen, and Vetiver Root Parfum to seal the ritual. Offered at exclusive value for those who commit to the full practice.",
  priceInCents: 16500000,
  productSlugs: [
    "purifying-clay-wash",
    "restorative-baobab-mask",
    "kalahari-growth-oil",
    "vetiver-root-parfum",
  ],
};

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding ORIGONÆ products...\n");

  const createdIds: Record<string, string> = {};

  for (const p of PRODUCTS) {
    // Delete existing variants so we can recreate them cleanly
    const existing = await prisma.product.findFirst({ where: { slug: p.slug } });
    if (existing) {
      await prisma.productVariant.deleteMany({
        where: { productId: existing.id, orderItems: { none: {} } },
      });
    }

    const product = await (prisma.product.upsert as any)({
      where: { slug: p.slug },
      update: {
        name: p.name,
        ritualName: p.ritualName ?? null,
        functionalTitle: p.functionalTitle,
        texture: p.texture,
        category: p.category,
        isFeaturedHair: (p as any).isFeaturedHair ?? false,
        isFeaturedScent: (p as any).isFeaturedScent ?? false,
        description: p.description,
        howToUse: (p as any).howToUse ?? null,
        ingredientsText: (p as any).ingredientsText ?? null,
        images: p.images,
      },
      create: {
        slug: p.slug,
        name: p.name,
        ritualName: p.ritualName ?? null,
        functionalTitle: p.functionalTitle,
        texture: p.texture,
        category: p.category,
        isFeaturedHair: (p as any).isFeaturedHair ?? false,
        isFeaturedScent: (p as any).isFeaturedScent ?? false,
        description: p.description,
        howToUse: (p as any).howToUse ?? null,
        ingredientsText: (p as any).ingredientsText ?? null,
        images: p.images,
      },
    });

    createdIds[p.slug] = product.id;

    // Create variants that don't already exist
    for (const v of p.variants) {
      const variantExists = await prisma.productVariant.findFirst({ where: { sku: v.sku } });
      if (!variantExists) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: v.sku,
            size: v.size,
            priceInCents: v.priceInCents,
            inventoryCount: 100,
          },
        });
      }
    }

    console.log(`  ✓ [${p.category}] ${p.name}`);
  }

  // ── Bundle ─────────────────────────────────────────────────────────────────
  console.log("\nSeeding ritual bundle...");

  const bundleProductIds = BUNDLE.productSlugs.map((slug) => {
    const id = createdIds[slug];
    if (!id) throw new Error(`Product not found for slug: ${slug}`);
    return { id };
  });

  await prisma.ritualBundle.upsert({
    where: { slug: BUNDLE.slug },
    update: {
      name: BUNDLE.name,
      description: BUNDLE.description,
      priceInCents: BUNDLE.priceInCents,
      products: { set: bundleProductIds },
    },
    create: {
      slug: BUNDLE.slug,
      name: BUNDLE.name,
      description: BUNDLE.description,
      priceInCents: BUNDLE.priceInCents,
      products: { connect: bundleProductIds },
    },
  });

  console.log(`  ✓ Bundle: ${BUNDLE.name}`);
  console.log(`\nSeed complete — ${PRODUCTS.length} products, 1 bundle.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
