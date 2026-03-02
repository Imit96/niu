"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SalonApplicationPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, submit to backend / email service.
    setIsSubmitted(true);
  };

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

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8 bg-stone p-8 md:p-12 border border-earth/10">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="salonName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Salon Name *</label>
                    <Input id="salonName" required placeholder="Your Salon" className="bg-cream border-earth/20 focus-visible:border-bronze" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="stylistName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Primary Contact *</label>
                    <Input id="stylistName" required placeholder="Stylist or Owner Name" className="bg-cream border-earth/20 focus-visible:border-bronze" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Professional Email *</label>
                  <Input id="email" type="email" required placeholder="contact@yoursalon.com" className="bg-cream border-earth/20 focus-visible:border-bronze" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-[10px] font-semibold tracking-widest uppercase text-earth">City & Country *</label>
                  <Input id="location" required placeholder="Lagos, Nigeria" className="bg-cream border-earth/20 focus-visible:border-bronze" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagram" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Salon Instagram Handle</label>
                  <Input id="instagram" placeholder="@yoursalon" className="bg-cream border-earth/20 focus-visible:border-bronze" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Tell Us About Your Salon Philosophy</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="flex w-full rounded-none border border-earth/20 bg-cream px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="We'd love to learn about your space, your current product lines, and your clientele..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full">Submit Application</Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-16 bg-stone border border-earth/10">
              <h3 className="text-2xl font-serif text-earth mb-4">Application Received.</h3>
              <p className="text-earth/80 font-light mb-8 max-w-sm mx-auto">
                Thank you for your interest in Originæ. Our wholesale concierge will review your submission and contact you shortly.
              </p>
              <Button variant="secondary" onClick={() => setIsSubmitted(false)}>Submit Another Inquiry</Button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
