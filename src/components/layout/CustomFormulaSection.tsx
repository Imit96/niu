"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { submitCustomFormulaRequest } from "@/app/actions/custom-formula";
import { ArrowRight } from "lucide-react";

const VALUES_STRIP = [
  "open free",
  "sulfate free",
  "phthalate free",
  "free of mineral oils",
  "free of gmos",
  "cruelty-free",
  "carbon neutral",
  "paraben free"
];

const CATEGORIES = ["Hair", "Skin", "Scent"] as const;
type Category = typeof CATEGORIES[number];

const CONCERNS_BY_CATEGORY: Record<Category, string[]> = {
  Hair: [
    "Hair Growth & Length Retention",
    "Deep Moisture & Hydration",
    "Scalp Health & Clarity",
    "Damage Repair & Restoration",
    "Definition & Hold",
    "Protective Style Prep",
    "Colour-Treated Care",
  ],
  Skin: [
    "Deep Hydration & Nourishment",
    "Brightening & Even Tone",
    "Barrier Repair & Sensitivity",
    "Anti-Ageing & Firmness",
    "Hyperpigmentation & Dark Spots",
  ],
  Scent: [
    "Warm & Earthy",
    "Fresh & Aquatic",
    "Floral & Soft",
    "Spiced & Exotic",
    "Citrus & Luminous",
  ],
};

export function CustomFormulaSection() {
  const shouldReduceMotion = useReducedMotion();
  const [step, setStep] = React.useState(1);
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    category: "" as Category | "",
    concern: "",
    notes: ""
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) return;
    if (step === 2 && !formData.email.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleCategorySelect = (cat: Category) => {
    setFormData(prev => ({ ...prev, category: cat, concern: "" }));
    setStep(4);
  };

  const handleFinalSubmit = async (concern: string) => {
    const updatedData = { ...formData, concern };
    setFormData(updatedData);
    setStatus("loading");
    setErrorMsg("");

    const data = new FormData();
    data.append("name", updatedData.name);
    data.append("email", updatedData.email);
    // Store as "Category: Concern" so existing hairConcern field captures full context
    data.append("hairConcern", updatedData.category ? `${updatedData.category}: ${concern}` : concern);
    data.append("notes", updatedData.notes);

    const result = await submitCustomFormulaRequest(data);
    if (result.error) {
      setStatus("error");
      setErrorMsg(result.error);
    } else {
      setStatus("success");
    }
  };

  const handleRestart = () => {
    setStep(1);
    setStatus("idle");
    setErrorMsg("");
    setFormData({ name: "", email: "", category: "", concern: "", notes: "" });
  };

  const bottleAnimation = shouldReduceMotion
    ? {}
    : { initial: { y: 20, opacity: 0 }, whileInView: { y: 0, opacity: 1 }, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } };

  const stepAnimation = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.35 } };

  const successAnimation = shouldReduceMotion
    ? { initial: {}, animate: {} }
    : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

  const firstName = formData.name.split(" ")[0];
  const activeConcerns = formData.category ? CONCERNS_BY_CATEGORY[formData.category] : [];

  return (
    <section className="py-24 px-6 md:px-12 bg-sand overflow-hidden">
      <div className="max-w-[1440px] mx-auto relative">

        {/* Main Card */}
        <div className="bg-[#F2EFE9] rounded-[2.5rem] md:rounded-[4rem] relative min-h-[520px] lg:min-h-[620px] grid grid-cols-1 lg:grid-cols-2">

          {/* Left — Bottle Visual */}
          <div className="relative h-64 lg:h-full order-last lg:order-first">
            <motion.div
              {...bottleAnimation}
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:left-12 lg:-translate-x-0 w-[280px] md:w-[350px] lg:w-[480px] aspect-square"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/custom-formula-bottle.png"
                  alt="Custom Formula Bottle"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl mix-blend-multiply"
                />
              </div>
            </motion.div>
          </div>

          {/* Right — Conversational Form */}
          <div className="flex flex-col justify-center p-8 md:p-14 lg:p-24 space-y-10">
            <div className="space-y-4">
              <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-earth/60 uppercase">
                Your custom formula awaits
              </p>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    {...successAnimation}
                    className="space-y-4"
                  >
                    <h2 className="text-3xl md:text-5xl font-serif text-earth lowercase leading-tight">
                      your ritual is in the making.
                    </h2>
                    <p className="text-earth/60 font-light max-w-md leading-relaxed text-sm md:text-base">
                      Check your inbox within 48 hours for your personalised formulation proposal.
                    </p>
                    <button
                      onClick={handleRestart}
                      className="text-[10px] uppercase tracking-widest text-earth/40 hover:text-earth transition-colors cursor-pointer focus:outline-none focus:underline"
                    >
                      ← start again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step-${step}`}
                    {...stepAnimation}
                    className="space-y-8"
                  >
                    {/* Step 1: Name */}
                    {step === 1 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-serif text-earth lowercase leading-tight">
                          let&apos;s start with your name
                        </h2>
                        <div className="relative max-w-md group">
                          <label htmlFor="cf-name" className="sr-only">Your name</label>
                          <input
                            id="cf-name"
                            type="text"
                            placeholder="enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleNext()}
                            autoFocus
                            className="w-full bg-white text-earth text-lg md:text-xl py-5 px-8 pr-16 rounded-full border-none focus:ring-2 focus:ring-bronze/30 placeholder:text-earth/20 font-light transition-all shadow-sm hover:shadow-md"
                          />
                          <button
                            onClick={handleNext}
                            aria-label="Continue to next step"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-earth text-cream rounded-full flex items-center justify-center hover:bg-bronze transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:ring-offset-2"
                          >
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Email */}
                    {step === 2 && (
                      <div className="space-y-8">
                        <h2 className="text-3xl md:text-5xl font-serif text-earth lowercase leading-tight">
                          and your email, {firstName}?
                        </h2>
                        <div className="relative max-w-md group">
                          <label htmlFor="cf-email" className="sr-only">Your email address</label>
                          <input
                            id="cf-email"
                            type="email"
                            placeholder="hello@world.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleNext()}
                            autoFocus
                            className="w-full bg-white text-earth text-lg md:text-xl py-5 px-8 pr-16 rounded-full border-none focus:ring-2 focus:ring-bronze/30 placeholder:text-earth/20 font-light transition-all shadow-sm hover:shadow-md"
                          />
                          <button
                            onClick={handleNext}
                            aria-label="Continue to next step"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-earth text-cream rounded-full flex items-center justify-center hover:bg-bronze transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 focus-visible:ring-offset-2"
                          >
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Category Selection */}
                    {step === 3 && (
                      <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-earth lowercase leading-tight">
                          what would you like us to formulate?
                        </h2>
                        <div className="flex flex-wrap gap-3 max-w-md">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => handleCategorySelect(cat)}
                              className="py-3 px-8 bg-white hover:bg-earth hover:text-cream border border-earth/10 text-earth text-sm font-light tracking-wider transition-all rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setStep(2)}
                          className="text-[10px] uppercase tracking-widest text-earth/40 hover:text-earth transition-colors cursor-pointer focus:outline-none focus:underline"
                        >
                          ← back
                        </button>
                      </div>
                    )}

                    {/* Step 4: Concern Selection */}
                    {step === 4 && formData.category && (
                      <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-earth lowercase leading-tight">
                          what is your primary {formData.category.toLowerCase()} concern?
                        </h2>
                        {status === "error" && (
                          <p role="alert" className="text-sm text-bronze">{errorMsg}</p>
                        )}
                        <div className="grid grid-cols-1 gap-2.5 max-w-md">
                          {activeConcerns.map((c) => (
                            <button
                              key={c}
                              onClick={() => handleFinalSubmit(c)}
                              disabled={status === "loading"}
                              className="text-left py-4 px-6 bg-white hover:bg-earth hover:text-cream border border-earth/10 text-earth text-sm font-light transition-all rounded-xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setStep(3)}
                          className="text-[10px] uppercase tracking-widest text-earth/40 hover:text-earth transition-colors cursor-pointer focus:outline-none focus:underline"
                        >
                          ← back
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step indicator */}
            {status !== "success" && (
              <div className="flex gap-1.5" aria-hidden="true">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                      step >= s ? "bg-earth" : "bg-earth/15"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Values Marquee Strip */}
        <div className="mt-12 overflow-hidden py-4 border-t border-earth/10" aria-hidden="true">
          {shouldReduceMotion ? (
            <div className="flex flex-wrap gap-6">
              {VALUES_STRIP.map((v) => (
                <span key={v} className="text-sm font-light text-earth/40 lowercase tracking-wide">
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-12"
            >
              {[...VALUES_STRIP, ...VALUES_STRIP, ...VALUES_STRIP].map((v, i) => (
                <span key={i} className="text-sm font-light text-earth/40 lowercase tracking-wide">
                  {v}
                  <span className="mx-6 opacity-30">—</span>
                </span>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
