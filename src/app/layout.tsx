import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Geist } from "next/font/google";
import "./globals.css";
import { FlashSaleBanner } from "@/components/layout/FlashSaleBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { CurrencyRatesProvider } from "@/components/ui/CurrencyRatesProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "../../auth";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://origonae.com"),
  title: {
    default: "ORIGONÆ | Luxury Heritage Haircare",
    template: "%s | ORIGONÆ"
  },
  description: "Luxury heritage haircare rooted in broader African traditions.",
  openGraph: {
    title: "ORIGONÆ | Luxury Heritage Haircare",
    description: "Luxury heritage haircare rooted in broader African traditions.",
    url: "/",
    siteName: "ORIGONÆ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ORIGONÆ Luxury African Heritage Haircare",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIGONÆ | Luxury Heritage Haircare",
    description: "Luxury heritage haircare rooted in broader African traditions.",
    images: ["/og-image.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased bg-cream text-ink font-sans flex flex-col min-h-screen`}
      >
        <SmoothScroll>
          <Providers session={session}>
            <CurrencyRatesProvider />
            <div className="sticky top-0 z-50">
              <FlashSaleBanner />
              <Navbar />
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
