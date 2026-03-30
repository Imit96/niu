import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { FlashSaleBanner } from "@/components/layout/FlashSaleBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { CurrencyRatesProvider } from "@/components/ui/CurrencyRatesProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { auth } from "../../../auth";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { routing } from "@/i18n/routing";
import { notFound, redirect } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "fr" ? "fr_FR" : "en_US";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://origonae.com"),
    title: {
      default: "ORIGONÆ | Luxury Heritage Haircare",
      template: "%s | ORIGONÆ",
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
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "ORIGONÆ | Luxury Heritage Haircare",
      description: "Luxury heritage haircare rooted in broader African traditions.",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "fr")) {
    redirect("/en");
  }

  setRequestLocale(locale);

  const session = await auth();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <Providers session={session}>
          <CurrencyRatesProvider />
          <div className="fixed top-0 left-0 right-0 z-50">
            {/* Banner has higher z than nav so it stays visible when nav slides up */}
            <div className="relative z-[200]">
              <FlashSaleBanner />
            </div>
            <Navbar />
          </div>
          {/* Spacer so non-hero pages start below the fixed navbar */}
          {/* Mobile: row1=h-14 (56px). Desktop: row1=h-16 (64px) + row2=h-10 (40px) = 104px */}
          <div className="h-14 md:h-[104px]" aria-hidden="true" />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </SmoothScroll>
      {process.env.NODE_ENV === "production" && <Analytics />}
      {process.env.NODE_ENV === "production" && <SpeedInsights />}
      {process.env.NODE_ENV === "production" && <GoogleAnalytics />}
      {process.env.NODE_ENV === "production" && <MetaPixel />}
    </NextIntlClientProvider>
  );
}
