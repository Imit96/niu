"use client";

import * as React from "react";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-cream border border-earth/20 p-12 text-center shadow-sm space-y-4">
        <h3 className="text-2xl font-serif text-earth">Message Received.</h3>
        <p className="text-earth/70 font-light max-w-sm mx-auto">
          Thank you for reaching out. Our care team will respond within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs uppercase tracking-widest text-bronze hover:text-earth transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream border border-earth/20 p-8 md:p-12 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-widest text-earth">First Name *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-widest text-earth">Last Name *</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-earth">Email Address *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="inquiryType" className="text-xs font-semibold uppercase tracking-widest text-earth">Subject</label>
          <select
            id="inquiryType"
            name="inquiryType"
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          >
            <option value="order">Order Support</option>
            <option value="product">Product Inquiry</option>
            <option value="press">Press & PR</option>
            <option value="wholesale">Wholesale & Salon</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-xs font-semibold uppercase tracking-widest text-earth">Message *</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-4 bg-earth text-cream uppercase tracking-widest text-xs font-semibold hover:bg-bronze transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending..." : "Send Inquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
