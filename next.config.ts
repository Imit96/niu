import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline': required by Next.js hydration and GTM tag injection.
              //   Path to remove: add nonce-based CSP via middleware (see Next.js docs).
              // 'unsafe-eval': required by Google Tag Manager (uses eval/Function internally).
              //   Path to remove: drop GTM or host tag scripts directly with SRI hashes.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co https://www.googletagmanager.com https://connect.facebook.net",
              // 'unsafe-inline' for styles: required by Tailwind v4 (runtime CSS-in-JS) and Next.js.
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + all configured remote image hosts + data URIs
              "img-src 'self' data: blob: https://images.unsplash.com https://placehold.co https://res.cloudinary.com https://media.istockphoto.com https://www.facebook.com https://www.google-analytics.com",
              // Connections: self + API hosts
              "connect-src 'self' https://api.paystack.co https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
              // Frames: Paystack inline popup uses an iframe
              "frame-src 'self' https://js.paystack.co https://checkout.paystack.com",
              // Workers
              "worker-src 'self' blob:",
              // Block all object embeds
              "object-src 'none'",
              // Upgrade insecure requests in production
              ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
