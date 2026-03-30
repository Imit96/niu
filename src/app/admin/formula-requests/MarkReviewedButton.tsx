"use client";

import { useTransition } from "react";
import { markFormulaRequestReviewed } from "@/app/actions/custom-formula";
import { useRouter } from "next/navigation";

export default function MarkReviewedButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMark = () => {
    startTransition(async () => {
      await markFormulaRequestReviewed(id);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleMark}
      disabled={isPending}
      className="text-[10px] uppercase tracking-widest font-semibold text-earth border border-earth/30 px-4 py-2 hover:bg-earth hover:text-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isPending ? "Marking..." : "Mark as Reviewed"}
    </button>
  );
}
