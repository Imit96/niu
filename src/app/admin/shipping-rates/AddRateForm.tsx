"use client";

import { useState, useRef } from "react";
import { createShippingRate } from "@/app/actions/shipping";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { NIGERIAN_STATES } from "@/lib/constants";

export function AddRateForm() {
  const [type, setType] = useState<"domestic" | "international">("domestic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createShippingRate(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      formRef.current?.reset();
      setType("domestic");
    }
    setLoading(false);
  };

  const selectClass = "flex w-full rounded-none border border-earth/20 bg-sand px-4 py-3 text-sm text-earth shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-earth";

  return (
    <div className="bg-cream border border-earth/10 p-6 space-y-6">
      <h2 className="text-lg font-serif text-earth border-b border-earth/10 pb-2">Add Shipping Rate</h2>

      {success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3">
          Rate added successfully.
        </p>
      )}
      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display name */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Display Name *</label>
            <Input name="name" placeholder="e.g. Lagos, Default Nigeria, International" required disabled={loading} />
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Type *</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as "domestic" | "international")}
              className={selectClass}
              required
              disabled={loading}
            >
              <option value="domestic">Domestic (Nigeria)</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Region — only for domestic */}
          {type === "domestic" && (
            <div className="space-y-1">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">
                State / Region <span className="text-earth/50">(leave blank for default Nigeria rate)</span>
              </label>
              <select name="region" className={selectClass} disabled={loading}>
                <option value="">All states (default rate)</option>
                {NIGERIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Rate amount */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Rate (₦) *</label>
            <Input name="rateAmount" type="number" step="0.01" min="0" placeholder="e.g. 2500" required disabled={loading} />
          </div>

          {/* Estimated days */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">
              Estimated Delivery <span className="text-earth/50">(optional)</span>
            </label>
            <Input name="estimatedDays" placeholder="e.g. 2-3 business days" disabled={loading} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading ? "Adding..." : "Add Rate"}
          </Button>
        </div>
      </form>
    </div>
  );
}
