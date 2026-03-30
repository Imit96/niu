"use client";

import * as React from "react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function FooterNewsletter() {
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
    <div className="flex flex-col space-y-4 md:col-span-1">
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/30 mb-2">Enter The Regimen</h4>
      <p className="text-sm text-cream/50 leading-relaxed mb-4">
        Join the circle to receive exclusive insights into our world, early access to new regimens, and quiet beauty philosophy.
      </p>
      {status === "success" ? (
        <p className="text-sm text-cream/50">You&apos;re on the list. Welcome to the circle.</p>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-3">
          {status === "error" && (
            <p className="text-xs text-red-300">{errorMsg}</p>
          )}
          <Input
            type="email"
            name="email"
            placeholder="Your email address"
            className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50 focus-visible:ring-cream/50 focus-visible:border-transparent"
            required
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full border-cream text-cream hover:bg-cream hover:text-earth"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}
