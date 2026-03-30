/**
 * Niu Skin Cosmetics — Product Seed Script
 *
 * Populates the database with Niu Skin Cosmetics' real products,
 * descriptions, prices, and product images from their CDN.
 *
 * Usage:
 *   npx ts-node prisma/seed-niu-skin.ts
 *   OR
 *   npx prisma db seed
 *
 * Note: This will CLEAR all existing products before inserting.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CDN = "https://www.niuskincosmetics.com/cdn/shop/files";

// ─── Product Data ────────────────────────────────────────────────────────────

const PRODUCTS = [
  // ── Face Care ────────────────────────────────────────────────
  {
    slug: "gentle-face-wash",
    name: "Gentle Face Wash",
    ritualName: "Face Cleanse",
    functionalTitle: "Deep Cleaning · Brightening · All Skin Types",
    category: "OTHER" as const,
    description:
      "A gentle yet effective amino acid-rich face cleanser that deep cleans, prevents breakouts, and lightly exfoliates — without stripping skin moisture. Formulated for all skin types including sensitive.",
    howToUse:
      "Morning & Night: Wet your skin with water. Massage a dime-sized amount of Niu Skin Gentle Face Wash into skin using gentle circular motions. Rinse with water after 20–30 seconds.\n\nMorning Routine: Gentle Face Wash → Intensive Serum → Face Essence Lotion → Sunscreen\nNight Routine: Gentle Face Wash → Intensive Serum → Face Essence Lotion",
    ingredientsText:
      "Water, Amino Acid Complex, Glycerin, Cocamidopropyl Betaine, Niacinamide, Panthenol, Allantoin, Citric Acid, Fragrance.",
    images: [`${CDN}/face_wash.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-FW-001",
        size: "100ml",
        priceInCents: 580000,
        salePriceInCents: 460000,
        inventoryCount: 100,
      },
    ],
  },
  {
    slug: "intensive-serum-niacinamide-vitamin-c",
    name: "Intensive Serum — Niacinamide, Vitamin C & Hyaluronic Acid",
    ritualName: "Face Treat",
    functionalTitle: "Brightening · Dark Spot Correction · Hydrating",
    category: "OTHER" as const,
    description:
      "A high-concentration brightening serum formulated with Niacinamide and Vitamin C to improve uneven skin tone, fade dark spots, and improve skin texture. Hyaluronic Acid draws moisture for a plumper, more hydrated appearance.",
    howToUse:
      "Apply 3–4 drops to clean skin after cleansing. Gently pat into the face and neck until absorbed. Follow with Face Essence Lotion (moisturiser). Use morning and night for best results.",
    ingredientsText:
      "Water, Niacinamide 10%, Ascorbic Acid (Vitamin C) 5%, Sodium Hyaluronate (Hyaluronic Acid), Glycerin, Allantoin, Panthenol, Phenoxyethanol.",
    images: [`${CDN}/serum.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-SER-001",
        size: "30ml",
        priceInCents: 680000,
        salePriceInCents: 560000,
        inventoryCount: 80,
      },
    ],
  },
  {
    slug: "bright-clear-face-cream",
    name: "Bright & Clear Face Cream",
    ritualName: "Face Moisturise",
    functionalTitle: "Anti-Acne · Dark Spot Correction · Intense Hydration",
    category: "OTHER" as const,
    description:
      "A potent face cream designed to combat acne and all forms of discoloration — age spots, sun spots, and post-inflammatory hyperpigmentation. Powered by Azelaic Acid, Kojic Acid, and Tranexamic Acid. Delivers intense hydration for radiant, smooth, refreshed skin.",
    howToUse:
      "Apply a small amount to clean, dry face after serum. Use morning and night. For best results, follow with Sunscreen Lotion in the morning.",
    ingredientsText:
      "Water, Azelaic Acid, Kojic Acid, Tranexamic Acid, Niacinamide, Glycerin, Hyaluronic Acid, Shea Butter, Tocopherol (Vitamin E), Fragrance.",
    images: [`${CDN}/bright_cream.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-FC-001",
        size: "50ml",
        priceInCents: 760000,
        salePriceInCents: 640000,
        inventoryCount: 75,
      },
    ],
  },
  {
    slug: "bright-clear-toner",
    name: "Bright & Clear Toner",
    ritualName: "Face Prep",
    functionalTitle: "Clarifying · Brightening · Pore-Minimising",
    category: "OTHER" as const,
    description:
      "A clarifying toner that removes impurities left after cleansing, minimises the appearance of pores, and preps skin to better absorb serums and moisturisers. Ideal for oily and acne-prone skin.",
    howToUse:
      "After cleansing, apply toner to a cotton pad and gently wipe across face and neck. Allow to dry before applying serum and moisturiser.",
    ingredientsText:
      "Water, Witch Hazel, Niacinamide, Glycolic Acid, Zinc PCA, Allantoin, Panthenol.",
    images: [`${CDN}/bright_Clear_No.5_combo.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-TON-001",
        size: "220ml",
        priceInCents: 520000,
        salePriceInCents: 480000,
        inventoryCount: 60,
      },
    ],
  },
  {
    slug: "face-cream-total-effects-platinum-white",
    name: "Face Cream — Total Effects Platinum White Face Essence Lotion",
    ritualName: "Face Moisturise",
    functionalTitle: "Brightening · Hydrating · Even Skin Tone",
    category: "OTHER" as const,
    description:
      "An all-in-one face essence lotion that brightens, hydrates, and evens skin tone. Enriched with Alpha Arbutin, Niacinamide, and Vitamin C for a visibly clearer, more radiant complexion.",
    howToUse:
      "Apply to clean face and neck as the final step in your routine. Use morning and night.",
    ingredientsText:
      "Water, Alpha Arbutin, Niacinamide, Ascorbic Acid, Glycerin, Sodium Hyaluronate, Shea Butter Extract.",
    images: [`${CDN}/face_wash.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-FEL-001",
        size: "50ml",
        priceInCents: 680000,
        salePriceInCents: 560000,
        inventoryCount: 70,
      },
    ],
  },
  {
    slug: "spf-50-platinum-sunscreen-lotion",
    name: "SPF 50+ Platinum Sunscreen Lotion",
    ritualName: "Face Protect",
    functionalTitle: "Broad Spectrum SPF 50+ · Brightening · Lightweight",
    category: "OTHER" as const,
    description:
      "A lightweight, brightening sunscreen that provides broad-spectrum SPF 50+ protection against UVA and UVB rays. Non-greasy, fast-absorbing formula that also helps even skin tone. Essential for the morning routine.",
    howToUse:
      "Apply as the final step of your morning routine, after moisturiser. Reapply every 2 hours when outdoors.",
    ingredientsText:
      "Homosalate, Octisalate, Octocrylene, Avobenzone, Niacinamide, Zinc Oxide, Titanium Dioxide, Glycerin.",
    images: [`${CDN}/serum.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-SPF-001",
        size: "50ml",
        priceInCents: 660000,
        salePriceInCents: 560000,
        inventoryCount: 50,
      },
    ],
  },

  // ── Body Care ────────────────────────────────────────────────
  {
    slug: "body-lotion-oudwood-480ml",
    name: "480ml Body Lotion — Oudwood",
    ritualName: "Body Moisturise",
    functionalTitle: "Alpha Arbutin · Niacinamide · Vitamin C · Oudwood Fragrance",
    category: "BODY" as const,
    description:
      "Enriched with Alpha Arbutin, Niacinamide, Vitamin C, and Hyaluronic Acid — with the luxurious Royal Exotic Oudwood fragrance. This advanced body lotion brightens, smooths, and deeply moisturises without bleaching. Suitable for men and women. In our signature Golden Bottle.",
    howToUse:
      "After bathing or showering, apply generously to the body using circular motions. Allow to absorb fully. For best results, use daily.",
    ingredientsText:
      "Water, Alpha Arbutin, Niacinamide, Ascorbic Acid, Sodium Hyaluronate, Glycerin, Shea Butter, Petrolatum, Cetearyl Alcohol, Fragrance (Oudwood).",
    images: [`${CDN}/oudwood.png`],
    isFeaturedHair: true,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-BLO-001",
        size: "480ml",
        priceInCents: 1020000,
        salePriceInCents: 860000,
        inventoryCount: 100,
      },
    ],
  },
  {
    slug: "body-lotion-floral-227ml",
    name: "227ml Body Lotion — Floral Fragrance",
    ritualName: "Body Moisturise",
    functionalTitle: "Alpha Arbutin · Niacinamide · Shea Butter · Floral Fragrance",
    category: "BODY" as const,
    description:
      "A travel-friendly brightening body lotion enriched with Alpha Arbutin, Niacinamide, Hyaluronic Acid, and Shea Butter — with a sensual Floral Fragrance. In our signature Rose Pink Bottle. Non-bleaching.",
    howToUse:
      "Apply after bathing or showering. Massage into skin using circular motions. Use daily for best results.",
    ingredientsText:
      "Water, Alpha Arbutin, Niacinamide, Sodium Hyaluronate, Shea Butter, Glycerin, Cetearyl Alcohol, Fragrance (Floral).",
    images: [`${CDN}/niuskintotaleffectsbodylotionNo.5-227ml.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-BLF-001",
        size: "227ml",
        priceInCents: 660000,
        salePriceInCents: 420000,
        inventoryCount: 80,
      },
    ],
  },
  {
    slug: "glowing-body-wash-800ml",
    name: "Glowing Body Wash",
    ritualName: "Body Cleanse",
    functionalTitle: "Brightening · Moisturising · Long-Lasting Lather",
    category: "BODY" as const,
    description:
      "A rich, brightening body wash that cleanses thoroughly while nourishing the skin. Enriched with brightening actives and a luxurious fragrance, leaving skin clean, soft, and glowing.",
    howToUse:
      "Apply to wet skin or a loofah. Lather generously, then rinse thoroughly. Use daily.",
    ingredientsText:
      "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Glycerin, Niacinamide, Lactic Acid, Fragrance, Citric Acid.",
    images: [`${CDN}/body_wash_oudwood_4033d8d8-3f9e-437d-b754-c110bb58a82a.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-BW-001",
        size: "500ml Refill",
        priceInCents: 650000,
        salePriceInCents: 450000,
        inventoryCount: 70,
      },
      {
        sku: "NSC-BW-002",
        size: "800ml",
        priceInCents: 1000000,
        salePriceInCents: 900000,
        inventoryCount: 80,
      },
    ],
  },

  // ── Face & Body Combos ────────────────────────────────────────
  {
    slug: "anti-acne-oily-face-body-combo-no5",
    name: "Anti Acne & Oily Face & Body Combo (with No.5 Body Lotion)",
    ritualName: "Complete Care",
    functionalTitle: "Complete Face + Body Set · Acne-Fighting · Brightening · Free Gift",
    category: "OTHER" as const,
    description:
      "The complete anti-acne solution for face and body. Includes Gentle Face Wash, Intensive Brightening Serum, Bright & Clear Toner, Bright & Clear Face Cream, 480ml No.5 Body Lotion, 800ml Glowing Body Wash, plus a FREE Bright & Clear Sheet Mask (x2 gift).",
    howToUse:
      "Use products in the following sequence:\nMorning: Face Wash → Serum → Toner → Face Cream → Sunscreen\nNight: Face Wash → Serum → Toner → Face Cream\nBody: Apply Body Wash in shower; use Body Lotion after bathing.",
    ingredientsText:
      "See individual product labels for full ingredient lists.",
    images: [`${CDN}/bright_Clear_No.5_combo.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-COMBO-ANF-001",
        size: "Full Set",
        priceInCents: 4260000,
        salePriceInCents: 3940000,
        inventoryCount: 40,
      },
    ],
  },
  {
    slug: "anti-acne-oily-face-body-combo-oudwood",
    name: "Anti Acne & Oily Face & Body Combo (with Oudwood Body Lotion)",
    ritualName: "Complete Care",
    functionalTitle: "Complete Face + Body Set · Acne-Fighting · Brightening · Free Gift",
    category: "OTHER" as const,
    description:
      "The complete anti-acne solution — same as the No.5 combo but with the Oudwood Body Lotion (Golden Bottle). Includes Gentle Face Wash, Intensive Serum, Bright & Clear Toner, Face Cream, 480ml Oudwood Body Lotion, 800ml Body Wash, plus a FREE Sheet Mask (x2).",
    howToUse:
      "Use products in the following sequence:\nMorning: Face Wash → Serum → Toner → Face Cream → Sunscreen\nNight: Face Wash → Serum → Toner → Face Cream\nBody: Apply Body Wash in shower; use Body Lotion after bathing.",
    ingredientsText:
      "See individual product labels for full ingredient lists.",
    images: [`${CDN}/advanced_acne.png`],
    isFeaturedHair: false,
    isFeaturedScent: true,
    variants: [
      {
        sku: "NSC-COMBO-ANO-001",
        size: "Full Set",
        priceInCents: 4260000,
        salePriceInCents: 3940000,
        inventoryCount: 40,
      },
    ],
  },
  {
    slug: "advanced-anti-acne-face-combo",
    name: "Advanced Anti Acne & Oily Face Combo — Face Wash, Toner & Face Cream",
    ritualName: "Face Complete",
    functionalTitle: "3-Step Anti-Acne Face Routine",
    category: "OTHER" as const,
    description:
      "A complete 3-step set to fight acne, oiliness, and hyperpigmentation. Includes Gentle Face Wash, Bright & Clear Toner, and Bright & Clear Face Cream — everything you need for a clear, balanced complexion.",
    howToUse:
      "Step 1: Cleanse with Face Wash. Step 2: Apply Toner. Step 3: Moisturise with Face Cream. Use morning and night.",
    ingredientsText:
      "See individual product labels for full ingredient lists.",
    images: [`${CDN}/advanced_acne.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-COMBO-AAF-001",
        size: "3-Piece Set",
        priceInCents: 1880000,
        salePriceInCents: 1580000,
        inventoryCount: 50,
      },
    ],
  },
  {
    slug: "body-care-combo",
    name: "Body Care Combo — 480ml Body Lotion + 800ml Body Wash",
    ritualName: "Body Complete",
    functionalTitle: "Brightening Body Duo · Best Value",
    category: "BODY" as const,
    description:
      "The perfect body care duo. One 800ml Niu Skin Glowing Body Wash and one 480ml Body Lotion (Oudwood or Floral, your choice). Step up your body care routine with this value-packed set.",
    howToUse:
      "Use Body Wash daily in the shower, then apply Body Lotion to damp skin after bathing.",
    ingredientsText:
      "See individual product labels for full ingredient lists.",
    images: [`${CDN}/body_wash_oudwood_4033d8d8-3f9e-437d-b754-c110bb58a82a.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-COMBO-BCC-001",
        size: "Combo Set",
        priceInCents: 1760000,
        salePriceInCents: null,
        inventoryCount: 60,
      },
    ],
  },

  // ── Kids Range ────────────────────────────────────────────────
  {
    slug: "niu-kids-gentle-wash-shampoo",
    name: "Niu Kids Gentle Care Wash & Shampoo 2-in-1",
    ritualName: "Kids Care",
    functionalTitle: "Hypoallergenic · Tear-Free · 2-in-1 Formula",
    category: "OTHER" as const,
    description:
      "A mild, hypoallergenic 2-in-1 wash and shampoo specially formulated for babies and children. Tear-free, gentle on delicate skin and scalp. Free from harsh chemicals.",
    howToUse:
      "Apply to wet skin or hair. Lather gently, then rinse thoroughly. Avoid contact with eyes.",
    ingredientsText:
      "Water, Coco-Glucoside, Decyl Glucoside, Glycerin, Panthenol, Allantoin, Chamomile Extract.",
    images: [`${CDN}/face_wash.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-KIDS-WS-001",
        size: "500ml",
        priceInCents: 800000,
        salePriceInCents: 720000,
        inventoryCount: 40,
      },
    ],
  },
  {
    slug: "niu-kids-gentle-care-lotion",
    name: "Niu Kids Pure & Gentle Care Lotion",
    ritualName: "Kids Care",
    functionalTitle: "Hypoallergenic · Gentle · Daily Moisturiser",
    category: "OTHER" as const,
    description:
      "A pure, gentle moisturising lotion designed for babies and children. Hypoallergenic and dermatologist-tested. Keeps delicate skin soft, smooth, and nourished all day.",
    howToUse:
      "Apply to clean, dry skin after bathing. Massage gently until fully absorbed. Use daily.",
    ingredientsText:
      "Water, Glycerin, Shea Butter, Petrolatum, Cetearyl Alcohol, Chamomile Extract, Aloe Vera, Panthenol.",
    images: [`${CDN}/niuskintotaleffectsbodylotionNo.5-227ml.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-KIDS-LOT-001",
        size: "320ml",
        priceInCents: 800000,
        salePriceInCents: 720000,
        inventoryCount: 40,
      },
    ],
  },

  // ── Beauty Tools ─────────────────────────────────────────────
  {
    slug: "facial-sheet-mask-3in1",
    name: "Facial Sheet Mask — 3 in 1 (Face, Eyes & Lips)",
    ritualName: "Face Treatment",
    functionalTitle: "Hydrating · Brightening · Weekly Treatment",
    category: "OTHER" as const,
    description:
      "A luxurious 3-in-1 facial sheet mask that covers face, eyes, and lips simultaneously. Deeply hydrates and brightens the complexion in just 15–20 minutes. Perfect as a weekly treatment.",
    howToUse:
      "Cleanse face thoroughly. Place the sheet mask on your face, aligning the eye and lip pieces. Leave for 15–20 minutes. Remove and gently pat remaining serum into skin.",
    ingredientsText:
      "Water, Niacinamide, Hyaluronic Acid, Glycerin, Aloe Vera Extract, Allantoin, Vitamin E.",
    images: [`${CDN}/serum.png`],
    isFeaturedHair: false,
    isFeaturedScent: false,
    variants: [
      {
        sku: "NSC-MASK-001",
        size: "Single Mask",
        priceInCents: 100000,
        salePriceInCents: null,
        inventoryCount: 200,
      },
    ],
  },
];

// ─── Seed Runner ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌿 Starting Niu Skin Cosmetics product seed...\n");

  // Clear existing data in dependency order to avoid FK constraint errors
  console.log("  🗑️  Clearing existing data...");
  await prisma.orderItem.deleteMany();          // references ProductVariant
  await prisma.order.deleteMany();              // references User
  await prisma.wishlistItem.deleteMany();       // references Product
  await prisma.review.deleteMany();             // references Product
  await prisma.productVariant.deleteMany();     // references Product
  await prisma.product.deleteMany();
  console.log("  ✅ Cleared.\n");

  // Insert Niu Skin products
  for (const p of PRODUCTS) {
    const { variants, ...productData } = p;

    const created = await prisma.product.create({
      data: {
        ...productData,
        variants: {
          create: variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            priceInCents: v.priceInCents,
            salePriceInCents: v.salePriceInCents ?? null,
            inventoryCount: v.inventoryCount,
          })),
        },
      },
    });

    console.log(`  ✅ Created: ${created.name}`);
  }

  console.log(`\n🎉 Seeded ${PRODUCTS.length} Niu Skin products successfully.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
