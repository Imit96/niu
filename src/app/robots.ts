import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://origonae.com";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/account/",
        "/api/",
        "/auth/",
        "/checkout",
        "/salon/dashboard",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
