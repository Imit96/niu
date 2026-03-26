"use client";

import * as React from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function HomeNewsletterSection() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await subscribeToNewsletter(formData);

    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
      formRef.current?.reset();
    }
  };

  return (
    <section className="py-32 px-6 bg-earth text-cream relative overflow-hidden">
      {/* Decorative stroke lines */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-px h-full bg-cream ml-[10%]" />
        <div className="absolute top-0 left-0 w-px h-full bg-cream ml-[30%]" />
        <div className="absolute top-0 left-0 w-px h-full bg-cream ml-[70%]" />
        <div className="absolute top-0 left-0 w-px h-full bg-cream ml-[90%]" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-bronze uppercase">Enter the Circle</p>
          <h2 className="text-3xl md:text-5xl font-serif uppercase tracking-widest leading-tight">
            The Ritual Begins With Intention.
          </h2>
          <p className="text-lg text-cream/70 font-light leading-relaxed max-w-xl mx-auto">
            Join the ORIGONÆ inner circle. Receive early access to new regimens, editorial dispatches, and the quiet philosophy behind the practice.
          </p>
        </div>

        {status === "success" ? (
          <div className="py-6 border border-cream/20 px-8 inline-block space-y-2">
            <p className="text-sm font-semibold tracking-widest uppercase text-bronze">Welcome to the Circle.</p>
            <p className="text-cream/70 text-sm font-light">Your regimen begins now.</p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            {status === "error" && (
              <p className="text-xs text-bronze/80 text-center col-span-2 -mb-2">{errorMsg}</p>
            )}
            <Input
              type="email"
              name="email"
              placeholder="Your email address"
              className="flex-1 bg-cream/10 border-cream/20 text-cream placeholder:text-cream/40 focus-visible:ring-cream/50 focus-visible:border-transparent h-12 rounded-none"
              required
              disabled={status === "loading"}
            />
            <Button
              type="submit"
              className="bg-cream text-earth hover:bg-stone h-12 rounded-none px-8 shrink-0"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Joining..." : "Join the Circle"}
            </Button>
          </form>
        )}

        <p className="text-[10px] text-cream/30 tracking-widest uppercase">
          No spam. Only ritual.
        </p>
      </div>
    </section>
  );
}
