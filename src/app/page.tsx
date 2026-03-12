import HomeClient from "./HomeClient";
import { getPublicProducts, getFeaturedHairProduct, getFeaturedScentProduct } from "./actions/product";
import { getFeaturedReviews } from "./actions/review";
import { getFeaturedArticle } from "./actions/article";

// Serve from Vercel CDN cache; regenerate in the background every 30 minutes
export const revalidate = 1800;

export default async function HomePage() {
  const [{ products }, featuredReviews, featuredArticle, featuredHairProduct, featuredScentProduct] = await Promise.all([
    getPublicProducts(),
    getFeaturedReviews(3),
    getFeaturedArticle(),
    getFeaturedHairProduct(),
    getFeaturedScentProduct(),
  ]);

  return (
    <HomeClient
      products={products}
      featuredReviews={featuredReviews}
      featuredArticle={featuredArticle}
      featuredHairProduct={featuredHairProduct}
      featuredScentProduct={featuredScentProduct}
    />
  );
}
