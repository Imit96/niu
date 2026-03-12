import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSalonProfile } from "@/app/actions/salon";
import { SalonApplicationForm } from "./SalonApplicationForm";

export const metadata = {
  title: "Partnership Inquiry | ORIGONÆ",
  description: "Apply to become an ORIGONÆ salon partner and access wholesale pricing.",
};

export default async function SalonApplicationPage() {
  const profile = await getSalonProfile();

  return (
    <div className="flex flex-col w-full bg-sand min-h-screen">
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto space-y-12">

          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest leading-tight">Partnership Inquiry</h1>
            <p className="text-earth/80 font-light leading-relaxed">
              We selectively partner with salons and stylists who share our commitment to intentional luxury and elevated botanical regimens. Please provide your details below for our wholesale team to review.
            </p>
          </div>

          {profile ? (
            /* Already has an application on file */
            <div className="text-center py-16 bg-stone border border-earth/10 space-y-6 px-8">
              {profile.isApproved ? (
                <>
                  <div className="inline-block px-4 py-1.5 bg-bronze/10 border border-bronze/30 text-bronze text-[10px] uppercase tracking-widest font-semibold">
                    Active Partner
                  </div>
                  <h3 className="text-2xl font-serif text-earth">You are an ORIGONÆ Partner.</h3>
                  <p className="text-earth/70 font-light max-w-sm mx-auto leading-relaxed">
                    Your salon partnership is active. Access your dashboard to manage wholesale orders and pricing.
                  </p>
                  <Link href="/salon/dashboard">
                    <Button size="lg" className="mt-4">Enter Salon Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="inline-block px-4 py-1.5 bg-earth/5 border border-earth/20 text-earth/60 text-[10px] uppercase tracking-widest font-semibold">
                    Application Under Review
                  </div>
                  <h3 className="text-2xl font-serif text-earth">Application Received.</h3>
                  <p className="text-earth/70 font-light max-w-sm mx-auto leading-relaxed">
                    We have your application for <span className="text-earth font-medium">{profile.businessName}</span> on file. Our wholesale concierge is reviewing your submission and will contact you shortly.
                  </p>
                  <p className="text-[10px] text-earth/40 uppercase tracking-widest">
                    Questions? <Link href="/contact" className="underline hover:text-bronze transition-colors">Contact our wholesale team</Link>
                  </p>
                </>
              )}
            </div>
          ) : (
            <SalonApplicationForm />
          )}

        </div>
      </section>
    </div>
  );
}
