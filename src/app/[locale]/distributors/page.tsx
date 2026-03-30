import { MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeUpDiv, FadeUpSection } from "@/components/ui/Motion";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find a Niu Skin Distributor | Authorised Stores Near You",
  description:
    "Find authorised Niu Skin Cosmetics distributors and retailers across Lagos and Nigeria. Shop online or find a store near you.",
  openGraph: {
    title: "Find a Niu Skin Distributor | Authorised Stores Near You",
    description:
      "Find authorised Niu Skin Cosmetics distributors across Lagos and Nigeria.",
    type: "website",
  },
};

const LAGOS_AREAS = [
  "Lekki / Ajah",
  "Victoria Island / Ikoyi",
  "Surulere / Alimosho",
  "Ikeja / Ojodu",
  "Yaba / Mushin",
  "Badagry / Ojo",
  "Ikorodu / Epe",
];

const NATIONWIDE = [
  { state: "Abuja (FCT)", note: "Available via waybill — 1–2 days" },
  { state: "Port Harcourt (Rivers)", note: "Available via waybill — 2–3 days" },
  { state: "Kano", note: "Available via waybill — 3–4 days" },
  { state: "Ibadan (Oyo)", note: "Available via waybill — 1–2 days" },
  { state: "Benin City (Edo)", note: "Available via waybill — 2–3 days" },
  { state: "Enugu", note: "Available via waybill — 2–3 days" },
  { state: "Warri (Delta)", note: "Available via waybill — 2–3 days" },
  { state: "Owerri (Imo)", note: "Available via waybill — 2–3 days" },
];

export default function DistributorsPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">

      {/* Hero */}
      <section className="py-20 px-6 bg-earth text-cream text-center">
        <FadeUpDiv className="max-w-2xl mx-auto space-y-4">
          <p className="text-[10px] font-bold tracking-[0.35em] text-bronze uppercase">Find Us Near You</p>
          <h1 className="text-4xl md:text-6xl font-serif leading-tight">Find a Niu Skin Store</h1>
          <p className="text-cream/70 text-base font-light leading-relaxed">
            Shop Niu Skin Cosmetics online or find an authorised distributor close to you across Lagos and Nigeria.
          </p>
        </FadeUpDiv>
      </section>

      {/* Notice about distributor pricing */}
      <div className="bg-bronze/10 border-b border-bronze/20 px-6 py-4 text-center">
        <p className="text-sm text-earth/80 max-w-2xl mx-auto">
          <strong>Please note:</strong> Prices from Niu Skin distributors may differ from our official website due to factors like transport costs, handling fees, and distributor markups.
        </p>
      </div>

      {/* Online First CTA */}
      <FadeUpSection className="py-16 px-6 bg-cream border-b border-earth/10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <p className="text-[10px] font-bold tracking-[0.35em] text-clay uppercase">Shop Online — Always Available</p>
            <h2 className="text-2xl md:text-3xl font-serif text-earth">Get the Best Price — Order Directly From Us</h2>
            <p className="text-sm text-earth/60 leading-relaxed">
              Order directly from our website for guaranteed authentic products at our official prices, with nationwide delivery.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href="/shop">
              <Button className="bg-earth text-cream hover:bg-ink whitespace-nowrap">Shop Online Now</Button>
            </Link>
            <a href="https://wa.me/2349060486962" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="border-clay text-clay hover:bg-clay hover:text-cream whitespace-nowrap flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> Order on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </FadeUpSection>

      {/* Lagos Distributors */}
      <FadeUpSection className="py-24 px-6 bg-stone">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.35em] text-clay uppercase">Walk-in Stores</p>
            <h2 className="text-3xl md:text-4xl font-serif text-earth">Lagos Authorised Distributors</h2>
            <p className="text-sm text-earth/60 max-w-xl leading-relaxed">
              Find an authorised Niu Skin distributor in your area of Lagos for same-day pickup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LAGOS_AREAS.map((area) => (
              <div key={area} className="bg-cream p-6 space-y-3 border border-earth/10 rounded-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-clay rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-cream" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-earth">{area}</h3>
                    <p className="text-xs text-earth/50">Authorised distributor available</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/2349060486962"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-clay hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Get exact location on WhatsApp
                </a>
              </div>
            ))}
          </div>

          <div className="bg-earth/5 border border-earth/10 rounded-sm p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="space-y-2 flex-1">
              <p className="font-semibold text-earth">Can't find your area?</p>
              <p className="text-sm text-earth/60">Contact us directly and we will connect you with the nearest authorised distributor in Lagos.</p>
            </div>
            <a href="tel:+2349060486962" className="shrink-0">
              <Button className="bg-earth text-cream hover:bg-ink flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +234 906 048 6962
              </Button>
            </a>
          </div>
        </div>
      </FadeUpSection>

      {/* Outside Lagos / Nationwide */}
      <FadeUpSection className="py-24 px-6 bg-cream border-t border-earth/10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.35em] text-clay uppercase">Nationwide Delivery</p>
            <h2 className="text-3xl md:text-4xl font-serif text-earth">Outside Lagos — Find a Retailer</h2>
            <p className="text-sm text-earth/60 max-w-xl leading-relaxed">
              We have authorised retailers and distributors across Nigeria. Orders outside Lagos are sent via waybill to your regional motor park. Contact us to find the nearest retailer in your state.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NATIONWIDE.map((item) => (
              <div key={item.state} className="bg-stone p-5 space-y-2 border border-earth/10 rounded-sm">
                <h3 className="font-semibold text-earth text-sm">{item.state}</h3>
                <p className="text-xs text-clay font-medium">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-sand border border-earth/10 rounded-sm p-8 flex flex-col md:flex-row items-center gap-8 max-w-3xl">
            <div className="space-y-3 flex-1">
              <h3 className="text-xl font-serif text-earth">Want Doorstep Delivery Outside Lagos?</h3>
              <p className="text-sm text-earth/60 leading-relaxed">
                For doorstep delivery outside Lagos, contact us via phone or WhatsApp. Additional delivery fees apply based on your location.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href="tel:+2349060486962">
                <Button className="bg-earth text-cream hover:bg-ink flex items-center gap-2 w-full">
                  <Phone className="w-4 h-4" /> Call Us
                </Button>
              </a>
              <a href="https://wa.me/2349060486962" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="border-clay text-clay hover:bg-clay hover:text-cream flex items-center gap-2 w-full">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </FadeUpSection>

      {/* CTA to online shop */}
      <section className="py-20 px-6 bg-earth text-cream text-center">
        <FadeUpDiv className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif">Shop Anywhere. Get Genuine Products.</h2>
          <p className="text-cream/70 text-sm font-light leading-relaxed">
            For guaranteed authentic Niu Skin products at the best prices, always shop directly from our website with nationwide delivery.
          </p>
          <Link href="/shop">
            <Button className="bg-bronze text-earth hover:bg-bronze/90 mt-2">
              Shop Online Now
            </Button>
          </Link>
        </FadeUpDiv>
      </section>

    </div>
  );
}
