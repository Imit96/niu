export const metadata = {
  title: "Terms of Service | Origin\u00e6",
  description: "Terms and conditions for using the Origin\u00e6 platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">Terms of Service</h1>
          <p className="text-earth/70 font-light">Last Updated: March 2026</p>
        </div>

        <div className="space-y-8 bg-cream p-8 md:p-12 border border-earth/20 text-earth/80 font-light leading-relaxed text-sm md:text-base">
          <p>
            Welcome to Origin\u00e6. By accessing or using our website, purchasing our products, or engaging with our services, you agree to be bound by the following Terms of Service. Please read them carefully.
          </p>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">1. General Conditions</h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks. Credit card information is always encrypted during transfer over networks.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">2. Products and Services</h2>
            <p>
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">3. Accuracy of Billing and Account Information</h2>
            <p>
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">4. Intellectual Property</h2>
            <p>
              All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of Origin\u00e6 or its content suppliers and protected by international copyright laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">5. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at <a href="mailto:legal@origonae.com" className="text-bronze underline">legal@origonae.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
