export const metadata = {
  title: "Privacy Policy | Origin\u00e6",
  description: "How Origin\u00e6 collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-sand min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif text-earth uppercase tracking-widest">Privacy Policy</h1>
          <p className="text-earth/70 font-light">Last Updated: March 2026</p>
        </div>

        <div className="space-y-8 bg-cream p-8 md:p-12 border border-earth/20 text-earth/80 font-light leading-relaxed text-sm md:text-base">
          <p>
            At Origin\u00e6, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from origonae.com.
          </p>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">1. Personal Information We Collect</h2>
            <p>
              When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">2. How We Use Your Information</h2>
            <p>
              We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">3. Sharing Your Information</h2>
            <p>
              We share your Personal Information with third parties to help us use your Personal Information, as described above. We use modern, secure e-commerce platforms and payment gateways that are fully compliant with global data protection standards.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">4. Your Rights</h2>
            <p>
              If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif text-lg text-earth uppercase tracking-widest">5. Contact Us</h2>
            <p>
              For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:privacy@origonae.com" className="text-bronze underline">privacy@origonae.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
