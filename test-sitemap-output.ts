import sitemap from "./src/app/sitemap";

async function run() {
  try {
    const data = await sitemap();
    console.log("Sitemap items length:", data.length);
    console.log("First item:", data[0]);
    console.log("Last item:", data[data.length - 1]);
    const invalidDates = data.filter(d => !(d.lastModified instanceof Date) && isNaN(new Date(d.lastModified as string | Date).getTime()));
    console.log("Invalid dates count:", invalidDates.length);
    const invalidUrls = data.filter(d => !d.url || typeof d.url !== "string" || !d.url.startsWith("http"));
    console.log("Invalid urls count:", invalidUrls.length);
  } catch (err) {
    console.error("Sitemap error:", err);
  }
}
run();
