export const metadata = {
  title: "Shipping & Returns | Origin\u00e6",
  description: "Information regarding domestic and international shipping, and our return policy.",
};

export default function ShippingPage() {
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">Shipping & Returns</h1>
          <p className="text-earth/70 font-light">Policies regarding the transit of our regimens.</p>
        </div>

        <div className="space-y-12 bg-cream p-8 md:p-12 border border-earth/20">
          <section className="space-y-4">
            <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Domestic Shipping</h2>
            <p className="text-earth/80 font-light leading-relaxed">
              We process all orders within 1-2 business days. Standard domestic shipping typically arrives within 3-5 business days from the date of dispatch. Expedited options are available at checkout for an additional fee.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">International Shipping</h2>
            <p className="text-earth/80 font-light leading-relaxed">
              Origin\u00e6 ships globally. International orders are processed within 2-3 business days and delivered within 7-14 business days, depending on the destination. Please note that customs duties and taxes are the responsibility of the recipient and are not included in the shipping cost at checkout.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Returns & Exchanges</h2>
            <p className="text-earth/80 font-light leading-relaxed">
              Due to the artisanal and personal care nature of our formulations, we cannot accept returns on opened products. If a product arrives damaged or if you experience an adverse reaction, please contact our Client Care team within 14 days of delivery. Unopened products in their original packaging may be returned within 30 days for a full refund, minus return shipping costs.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Tracking Your Ritual</h2>
            <p className="text-earth/80 font-light leading-relaxed">
              Once your regimen has been dispatched, you will receive an email containing tracking information. If your tracking states delivered but you have not received your package, please reach out to us within 48 hours.
            </p>
          </section>
        </div>

        <div className="text-center pt-8">
          <a href="/contact" className="inline-block text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors border-b border-transparent hover:border-earth pb-1">
            Contact Client Care for Assistance
          </a>
        </div>
      </div>
    </div>
  );
}
