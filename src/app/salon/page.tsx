import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Professional Partnerships | Originæ",
  description: "Discover Originæ's B2B salon portal. Elevate your salon experience with our luxury regimen haircare system.",
};

export default function SalonPortalPage() {
  return (
    <div className="flex flex-col w-full bg-cream min-h-screen">
      {/* Hero */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center bg-ink overflow-hidden">
        <div className="absolute inset-0 bg-earth/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
            {/* Dark aesthetic placeholder */}
            <div className="absolute inset-0 border-[20px] border-cream/5 m-6"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase mb-4">Professional Access</p>
          <h1 className="text-4xl md:text-6xl font-serif text-cream uppercase tracking-wide leading-tight mb-8">
            Elevate Your <br className="hidden md:block"/> Practice.
          </h1>
          <Link href="/salon/apply">
             <Button variant="secondary" size="lg" className="border-cream text-cream hover:bg-cream hover:text-earth">Apply for Partnership</Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-sand text-center">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">Premium Positioning</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              Align your salon with a luxury, culturally-rooted brand. Originæ offers a prestige narrative that differentiates your service menu and attracts high-end clientele seeking intentional beauty.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">Wholesale Margins</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              Gain access to exclusive tiered professional pricing. Maximize your retail profitability while offering your clients the exact regimens used during their service.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-earth">Education & Support</h3>
            <p className="text-earth/80 font-light leading-relaxed">
              Partners receive comprehensive ritual training. We provide the historical context, ingredient science, and application techniques required to deliver the true Originæ experience.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy / CTA */}
      <section className="py-24 px-6 bg-earth text-cream text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest leading-tight">Join The Circle of Cultural Architects.</h2>
          <p className="text-lg text-cream/80 font-light leading-loose">
            We review every partnership inquiry meticulously to ensure alignment in luxury standards, salon aesthetics, and client experience. We invite concept salons, luxury texture specialists, and premium retailers to submit their details for consideration.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/salon/apply">
              <Button size="lg" className="w-full sm:w-auto bg-cream text-earth">Begin Application</Button>
            </Link>
            <Link href="/contact">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto border-cream text-cream">Contact Wholesale Team</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
