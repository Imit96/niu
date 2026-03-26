import { StaggerSection, FadeUpDiv, FadeUpSection } from "@/components/ui/Motion";

export const metadata = {
  title: "Shipping & Returns | ORIGONÆ",
  description: "Information regarding domestic and international shipping, and our return policy.",
};

const SHIPPING_SECTIONS = [
  {
    title: "Domestic Shipping",
    body: "We process all orders within 1-2 business days. Standard domestic shipping typically arrives within 3-5 business days from the date of dispatch. Expedited options are available at checkout for an additional fee."
  },
  {
    title: "International Shipping",
    body: "ORIGONÆ ships globally. International orders are processed within 2-3 business days and delivered within 7-14 business days, depending on the destination. Please note that customs duties and taxes are the responsibility of the recipient and are not included in the shipping cost at checkout."
  },
  {
    title: "Returns & Exchanges",
    body: "Due to the artisanal and personal care nature of our formulations, we cannot accept returns on opened products. If a product arrives damaged or if you experience an adverse reaction, please contact our Client Care team within 14 days of delivery. Unopened products in their original packaging may be returned within 30 days for a full refund, minus return shipping costs."
  },
  {
    title: "Tracking Your Ritual",
    body: "Once your regimen has been dispatched, you will receive an email containing tracking information. If your tracking states delivered but you have not received your package, please reach out to us within 48 hours."
  }
];

export default function ShippingPage() {
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">

        <StaggerSection className="text-center space-y-4">
          <FadeUpDiv>
            <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">Shipping & Returns</h1>
          </FadeUpDiv>
          <FadeUpDiv>
            <p className="text-earth/70 font-light">Policies regarding the transit of our regimens.</p>
          </FadeUpDiv>
        </StaggerSection>

        <StaggerSection className="space-y-0 bg-cream border border-earth/20 overflow-hidden">
          {SHIPPING_SECTIONS.map((section, i) => (
            <FadeUpDiv key={i} className="p-8 md:p-12 space-y-4 border-b border-earth/10 last:border-b-0">
              <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">{section.title}</h2>
              <p className="text-earth/80 font-light leading-relaxed">{section.body}</p>
            </FadeUpDiv>
          ))}
        </StaggerSection>

        <FadeUpSection className="text-center pt-4">
          <a href="/contact" className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
            Contact Client Care for Assistance
          </a>
        </FadeUpSection>
      </div>
    </div>
  );
}
