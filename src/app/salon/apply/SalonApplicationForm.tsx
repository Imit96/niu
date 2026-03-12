"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { submitSalonApplication } from "@/app/actions/salon";

export function SalonApplicationForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await submitSalonApplication(formData);

    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-16 bg-stone border border-earth/10">
        <h3 className="text-2xl font-serif text-earth mb-4">Application Received.</h3>
        <p className="text-earth/80 font-light mb-8 max-w-sm mx-auto">
          Thank you for your interest in ORIGONÆ. Our wholesale concierge will review your submission and contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-stone p-8 md:p-12 border border-earth/10">
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-sm">
          {errorMsg}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="businessName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Salon / Business Name *</label>
            <Input id="businessName" name="businessName" required placeholder="Your Salon" className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
          <div className="space-y-2">
            <label htmlFor="contactName" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Primary Contact *</label>
            <Input id="contactName" name="contactName" required placeholder="Stylist or Owner Name" className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Professional Email *</label>
            <Input id="contactEmail" name="contactEmail" type="email" required placeholder="contact@yoursalon.com" className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Phone Number</label>
            <Input id="phone" name="phone" placeholder="+234..." className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-[10px] font-semibold tracking-widest uppercase text-earth">City &amp; Country *</label>
          <Input id="address" name="address" required placeholder="Lagos, Nigeria" className="bg-cream border-earth/20 focus-visible:border-bronze" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="instagramHandle" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Instagram Handle</label>
            <Input id="instagramHandle" name="instagramHandle" placeholder="@yoursalon" className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
          <div className="space-y-2">
            <label htmlFor="socialMediaLinks" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Website / TikTok / Other</label>
            <Input id="socialMediaLinks" name="socialMediaLinks" placeholder="https://yoursalon.com or @tiktokhandle" className="bg-cream border-earth/20 focus-visible:border-bronze" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-[10px] font-semibold tracking-widest uppercase text-earth">Tell Us About Your Salon Philosophy</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="flex w-full rounded-none border border-earth/20 bg-cream px-4 py-3 text-sm text-earth shadow-sm placeholder:text-earth/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="We'd love to learn about your space, your current product lines, and your clientele..."
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
