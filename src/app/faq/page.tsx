import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";

export const metadata = {
  title: "Frequently Asked Questions | ORIGONÆ",
  description: "Find answers regarding our regimens, sourcing, and shipping.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Are your products suitable for all hair types?",
      answer: "While ORIGONÆ is rooted in African heritage and particularly supportive of dense, coarse, and coily textures, our formulations focus on foundational scalp health and deep hydration, making them beneficial for all hair architectures."
    },
    {
      question: "Where do you source your ingredients?",
      answer: "We ethically source our key botanicals and minerals, such as our Rhassoul Clay and Kalahari Melon Seed Oil, directly from cooperatives across the African continent, ensuring purity and fair trade practices."
    },
    {
      question: "Do your products contain synthetic fragrances?",
      answer: "No. The Olfactory Regimen and all our product scents are derived entirely from natural essential oils, resins, and absolutes. We prioritize earthy, grounding notes over synthetic florals."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard domestic shipping takes 3-5 business days. International shipping typically takes 7-14 business days depending on the destination and customs processing."
    },
    {
      question: "Can I use the Purifying Clay Wash daily?",
      answer: "We recommend using the Clay Wash 1-2 times per week to gently detoxify without stripping the scalp of its natural lipid barrier."
    }
  ];

  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <StaggerSection className="text-center space-y-4">
          <FadeUpDiv>
            <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">F.A.Q.</h1>
          </FadeUpDiv>
          <FadeUpDiv>
            <p className="text-earth/70 font-light">Questions regarding our philosophy and formulations.</p>
          </FadeUpDiv>
        </StaggerSection>

        <StaggerSection className="space-y-6">
          {faqs.map((faq, index) => (
            <FadeUpDiv key={index} className="bg-cream border border-earth/20 p-6 md:p-8 hover:border-bronze/30 transition-colors duration-300">
              <h3 className="text-lg font-serif text-earth mb-3">{faq.question}</h3>
              <p className="text-earth/80 font-light leading-relaxed">{faq.answer}</p>
            </FadeUpDiv>
          ))}
        </StaggerSection>

        <div className="text-center pt-8 border-t border-earth/20">
          <p className="text-earth/70 font-light mb-4">Still need assistance?</p>
          <a href="/contact" className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
            Contact Client Care
          </a>
        </div>
      </div>
    </div>
  );
}
