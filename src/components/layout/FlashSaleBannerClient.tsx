"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FlashSaleBannerClientProps {
  title: string;
  endsAt: string;
}

export default function FlashSaleBannerClient({ title, endsAt }: FlashSaleBannerClientProps) {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const endDate = new Date(endsAt);

    const updateTimer = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Ending soon");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h remaining`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (dismissed) return null;

  return (
    <div className="relative bg-earth text-cream py-2.5 px-6 text-center text-sm tracking-wider overflow-hidden">
      {/* Subtle shimmer sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
          animation: "flash-sweep 4s ease-in-out infinite",
        }}
      />

      <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-4">
        {/* Live pulse indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-bronze" />
        </span>

        <span className="inline-flex items-center gap-3">
          <span className="hidden sm:inline text-bronze font-semibold uppercase text-[10px] tracking-[0.2em] border border-bronze/40 px-2 py-0.5 animate-pulse">
            Flash Sale
          </span>
          <span className="font-medium">{title}</span>
          {timeLeft && (
            <span className="text-cream/60 text-xs hidden md:inline">— {timeLeft}</span>
          )}
        </span>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>

      <style>{`
        @keyframes flash-sweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
