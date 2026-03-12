"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { addToWishlist, removeFromWishlist } from "../../actions/wishlist";
import { toast } from "react-hot-toast";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist: boolean;
  isLoggedIn: boolean;
}

export function WishlistButton({ productId, initialInWishlist, isLoggedIn }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to save items to your wishlist.");
      return;
    }

    startTransition(async () => {
      // Optimistic update
      setInWishlist(!inWishlist);

      const action = inWishlist ? removeFromWishlist : addToWishlist;
      const result = await action(productId);

      if (result.error) {
        // Revert on error
        setInWishlist(inWishlist);
        toast.error(result.error);
      } else {
        toast.success(result.message || "Wishlist updated.");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-3 border border-earth transition-colors flex items-center justify-center shrink-0 ${
        inWishlist ? "bg-earth text-cream" : "bg-transparent text-earth hover:bg-earth/5"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
    </button>
  );
}
