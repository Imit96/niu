import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getGuides, type GuideSummary } from "@/app/actions/content";
import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";

export const revalidate = 3600;

export const metadata = {
  title: "Care Guides | ORIGONÆ",
  description: "Explore our curated care guides for cleansing, hydration, restoration, and sensory elevation — each rooted in heritage formulation.",
};

export default async function CareGuidesPage() {
  const guides = await getGuides();

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      {/* Intro */}
      <StaggerSection className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <FadeUpDiv>
          <h1 className="text-4xl md:text-5xl font-serif uppercase tracking-widest mb-6 border-b border-cream/20 pb-6 inline-block">Care Guides</h1>
        </FadeUpDiv>
        <FadeUpDiv>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light mt-4">
            Beauty is not routine. It is method. Explore our curated guides designed to address the specific needs of your hair and scalp, each deeply rooted in heritage formulation.
          </p>
        </FadeUpDiv>
      </StaggerSection>

      {/* Grid */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col space-y-32">
          {guides.map((guide: GuideSummary, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <StaggerSection key={guide.slug} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-24 group`}>
                <FadeUpDiv className="w-full md:w-1/2">
                  <Link href={`/guides/${guide.slug}`}>
                    <div className="relative aspect-[4/5] bg-stone border border-earth/10 overflow-hidden shadow-sm">
                      <div className="absolute inset-0 bg-earth/5 transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                        <span className="text-earth/30 uppercase tracking-[0.3em] font-serif text-sm px-8 text-center leading-loose">
                          {guide.title}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUpDiv>
                <FadeUpDiv className="w-full md:w-1/2 space-y-6 flex flex-col justify-center">
                  <h2 className="text-sm font-semibold tracking-[0.2em] text-bronze uppercase">Method 0{guide.methodNumber || idx + 1}</h2>
                  <h3 className="text-3xl lg:text-5xl font-serif text-earth leading-tight">{guide.title}</h3>
                  <p className="text-earth/80 text-lg leading-relaxed max-w-md">
                    {guide.description}
                  </p>
                  <div className="pt-6">
                    <Link href={`/guides/${guide.slug}`}>
                      <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
                        Explore the Guide
                      </Button>
                    </Link>
                  </div>
                </FadeUpDiv>
              </StaggerSection>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <StaggerSection className="py-24 px-6 bg-stone text-center border-t border-earth/10">
        <FadeUpDiv className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif text-earth">Need Guidance?</h2>
          <p className="text-earth/70">Speak with our team to discover which method is best suited for your texture and hair goals.</p>
          <Link href="/contact" className="inline-block mt-4 text-bronze uppercase tracking-widest text-sm border-b border-bronze pb-1 hover:text-earth hover:border-earth transition-colors">
            Contact an Expert
          </Link>
        </FadeUpDiv>
      </StaggerSection>
    </div>
  );
}
