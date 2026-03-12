"use client";

import { deleteShippingRate } from "@/app/actions/shipping";

export function DeleteRateButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (!confirm("Delete this shipping rate?")) return;
    await deleteShippingRate(id);
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest"
    >
      Delete
    </button>
  );
}
