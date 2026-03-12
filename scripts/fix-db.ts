import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const placeholderImage = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop";
const performanceImage = "https://images.unsplash.com/photo-1615397323386-8f3521fd1e67?q=80&w=800&auto=format&fit=crop";

async function fixProducts() {
  console.log("Starting DB copy & imagery cleanup...");
  
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    // Determine realistic data
    const newResonanceData = [
      { timeframe: "Immediately", title: "Vitality Restored", description: "The strand feels remarkably softer and the scalp is unburdened." },
      { timeframe: "14 Days", title: "Strength Rebuilt", description: "Breakage is significantly reduced as the cortex fortifies." },
      { timeframe: "28 Days", title: "Optimal Health", description: "Sustained length retention and a balanced, stimulated scalp environment." }
    ];

    const newFaqData = [
      { question: "Is this safe for color-treated hair?", answer: "Yes, our regimens are formulated with gentle, earth-derived botanicals that carefully preserve color." },
      { question: "How often should I use this?", answer: "We recommend incorporating it into your standard wash day regimen, typically every 7-10 days depending on your texture profile." }
    ];

    const newHowToUse = "Section damp hair into four manageable quadrants. Massage the formulation deeply into the scalp and through lengths. Allow the active botanicals to rest for 15-20 minutes before thoroughly rinsing.";
    
    // Check if images are empty or contain watermark/bad images
    // For simplicity, we assign a beautiful aesthetic sand/botanical placeholder to all if they have bad ones, or just reset them.
    // The audit identified skyline and watermark images on The Growth Regimen and Kalahari Growth Oil
    let newImages = product.images as string[];
    if (newImages.length > 0 && Array.isArray(newImages)) {
       newImages = newImages.map(img => {
          if (img.includes("Prostock-Studio") || img.includes("iStock") || img.includes("skyline") || img.includes("skyscraper")) {
            return placeholderImage;
          }
          return img;
       });
    }

    // Overwrite the specific bad string in performanceMedia if it exists or if it's the specific dev text
    let newPerformanceMedia = product.performanceMedia;
    if (newPerformanceMedia && (newPerformanceMedia.includes("Prostock") || newPerformanceMedia.includes("iStock") || newPerformanceMedia.includes("skyline"))) {
        newPerformanceMedia = performanceImage;
    }
    
    // Find The Performance "developer instructions" and remove it
    if (product.howToUse && product.howToUse.includes("Performance Media URL")) {
       product.howToUse = newHowToUse;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: {
        resonanceData: newResonanceData,
        faqData: newFaqData,
        howToUse: product.howToUse || newHowToUse,
        performanceMedia: newPerformanceMedia || performanceImage,
        images: newImages.length > 0 ? newImages : [placeholderImage],
      }
    });
    
    console.log(`Updated product: ${product.name}`);
  }
  
  console.log("Cleanup complete.");
}

fixProducts()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
