import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Journal Articles...");

  // Article 1 (Featured)
  await prisma.article.upsert({
    where: { slug: "the-art-of-the-cleanse" },
    update: {},
    create: {
      title: "The Art of the Cleanse",
      slug: "the-art-of-the-cleanse",
      category: "Ritual & Wellness",
      excerpt: "Cleansing is not merely the removal of buildup, but an intentional reset. We explore the historical significance of the hammam and how Atlas Mountain clay fundamentally shifts the scalp's ecosystem.",
      content: `Cleansing is not merely the removal of buildup, but an intentional reset. In a world full of noise, the shower becomes a sanctuary—a space for reflection, breath, and profound purification.

We explore the historical significance of the hammam, a traditional ritual centered around steam and deep purification. For centuries, this communal and deeply personal practice has utilized the earth's natural resources to draw out impurities.

At the heart of this ritual is Atlas Mountain clay (Rhassoul). Unlike stripping detergents, this mineral-rich clay works symbiotically with the scalp's ecosystem. It magnetically draws out heavy metals and product buildup, yet leaves the essential hair lipid layer undisturbed.

The result is texture that feels alive—weightless, voluminous, and utterly refreshed. This is the essence of the Originæ cleansing regimen: returning the crown to its most foundational, vibrant state.`,
      featuredImage: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=1600",
      isFeatured: true,
      datePublished: new Date("2024-08-12T10:00:00Z"),
    }
  });

  // Article 2
  await prisma.article.upsert({
    where: { slug: "science-of-kalahari" },
    update: {},
    create: {
      title: "Decoding the Kalahari Melon",
      slug: "science-of-kalahari",
      category: "Hair Science Simplified",
      excerpt: "Why this desert survivor holds the key to lightweight, deeply penetrative hydration without the risk of follicle blockage.",
      content: `The Kalahari Melon is a masterpiece of evolutionary survival. Thriving in one of the most arid environments on the planet, it has developed an unparalleled mechanism for retaining moisture.

For structured, coiled, and textured hair, hydration is the constant pursuit. Yet, many rich oils sit heavily on the surface, suffocating the follicle and weighing down the strand's natural architecture.

Enter Kalahari Melon Seed Oil. 

With an incredibly high concentration of linoleic acid (up to 70%), it penetrates the hair shaft effortlessly. This means profound, internal restoration without the slick, oily residue associated with traditional heavy sealants. 

It dissolves sebum buildup naturally, allowing the scalp to breathe, making it the perfect botanical hero for our Growth Regimen. It is the paradox of extreme hydration meeting utter weightlessness.`,
      featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=1000",
      isFeatured: false,
      datePublished: new Date("2024-07-28T09:00:00Z"),
    }
  });

  // Article 3
  await prisma.article.upsert({
    where: { slug: "heritage-braiding" },
    update: {},
    create: {
      title: "Geometry of the Crown",
      slug: "heritage-braiding",
      category: "African Heritage Stories",
      excerpt: "The mathematical and spiritual significance woven into traditional West African braiding styles.",
      content: `Braiding is far more than a stylistic choice; it is an ancient language. Across West Africa, the patterns woven into the crown have historically served as maps, social indicators, and expressions of deep spiritual geometry.

The fractal patterns found in traditional styles, such as Fulani braids or Yoruba cornrows, represent mathematical knowledge passed down through generations of women. These styles distribute tension, protect fragile ends from environmental damage, and frame the face as a work of living architecture.

At Originæ, we view these protective styles not just as a means to an end, but as a ritual of preservation. Our nutrient-dense serums are designed to be applied directly to the parts, feeding the scalp while the hair rests in its geometric sanctuaries.

Understanding the heritage behind the braid is to recognize the profound connection between self-care, history, and structural brilliance.`,
      featuredImage: "https://images.unsplash.com/photo-1544928147-79a2dbc1f381?auto=format&fit=crop&q=80&w=1000",
      isFeatured: false,
      datePublished: new Date("2024-07-15T14:30:00Z"),
    }
  });

  // Article 4
  await prisma.article.upsert({
    where: { slug: "minimalism-and-texture" },
    update: {},
    create: {
      title: "Texture as Architecture",
      slug: "minimalism-and-texture",
      category: "Fashion & Culture",
      excerpt: "How modern editorial styling is shifting focus from manipulation to structural exaggeration of natural hair types.",
      content: `For decades, the editorial world viewed texture as something to be tamed, smoothed, or forced into submission. Today, we are witnessing a renaissance: the celebration of natural hair as raw, living architecture.

Minimalism in styling no longer means 'slicked back.' It means creating space for the hair to occupy its natural volume. It is about exaggeration rather than reduction. 

By using products that enhance rather than alter—like our Restorative Baobab Mask—stylists are building shapes that defy gravity. A cloud of an afro. The sharp, defined angles of a short crop. The fluid, heavy drape of locs.

When we stop fighting the strand and start supporting its structural integrity, texture becomes the most powerful accessory a person can wear. It is bold, unapologetic, and fundamentally rooted in self-acceptance.`,
      featuredImage: "https://images.unsplash.com/photo-1621008034070-5c68ee927df4?auto=format&fit=crop&q=80&w=1000",
      isFeatured: false,
      datePublished: new Date("2024-06-03T08:15:00Z"),
    }
  });

  // Article 5
  await prisma.article.upsert({
    where: { slug: "power-of-smoke" },
    update: {},
    create: {
      title: "The Scent of Smoke & Earth",
      slug: "power-of-smoke",
      category: "Ritual & Wellness",
      excerpt: "Unpacking the sensory profile of our core collection, rooted in the grounding aromas of charred wood and wet clay.",
      content: `Scent is the most immediate pathway to memory and mood. When designing the olfactory experience of the Originæ collection, we deliberately moved away from the synthetic, powdery florals that dominate luxury haircare.

Instead, we looked to the earth. 

Our signature profile is built on the grounding notes of petrichor (the smell of rain on dry earth), nuanced with subtle hints of charred wood, distant smoke, and warm amber. 

This is not accidental. The scent of smoke has historically been used in spiritual cleansing rituals across the African continent—from the burning of resins to the smudging of sacred woods. It signals to the nervous system that it is time to slow down, to anchor into the present moment.

When you lather our Purifying Clay Wash, the steam of the shower carries these grounding notes, transforming a routine task into a moment of deep, sensory recalibration.`,
      featuredImage: "https://images.unsplash.com/photo-1601334808389-edcd678619bc?auto=format&fit=crop&q=80&w=1000",
      isFeatured: false,
      datePublished: new Date("2024-05-20T11:00:00Z"),
    }
  });

  console.log("Seeding Journal Articles Complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
