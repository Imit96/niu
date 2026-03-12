"use client";

import { useState } from "react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { WishlistButton } from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

interface Variant {
  id: string;
  size: string | null;
  priceInCents: number;
  salePriceInCents: number | null;
  inventoryCount: number;
}

interface ProductActionsProps {
  variants: Variant[];
  flashSaleDiscountPct?: number | null;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  inWishlist: boolean;
  isLoggedIn: boolean;
}

export default function ProductActions({
  variants,
  flashSaleDiscountPct,
  productId,
  productSlug,
  productName,
  productImage,
  inWishlist,
  isLoggedIn,
}: ProductActionsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = variants[selectedIndex] ?? variants[0];

  if (!selected) {
    return (
      <p className="text-sm text-earth/50 italic">No variants available.</p>
    );
  }

  const basePrice = selected.priceInCents;
  const salePrice = selected.salePriceInCents ?? basePrice;
  const flashPrice = flashSaleDiscountPct
    ? Math.round(basePrice * (1 - flashSaleDiscountPct / 100))
    : basePrice;
  const effectivePrice = Math.min(salePrice, flashPrice);
  const hasDiscount = effectivePrice < basePrice;

  const isLowStock =
    selected.inventoryCount > 0 &&
    selected.inventoryCount <= LOW_STOCK_THRESHOLD;

  return (
    <div className="space-y-4">
      {/* Variant selector — only shown when there are multiple */}
      {variants.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-earth">
            Size / Volume
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={`px-4 py-2 text-sm border transition-colors ${
                  i === selectedIndex
                    ? "border-earth bg-earth text-cream"
                    : "border-earth/30 text-earth hover:border-earth"
                }`}
              >
                {v.size || "Standard"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single-variant size label */}
      {variants.length === 1 && selected.size && (
        <p className="text-sm font-medium tracking-wide uppercase text-earth">
          Size: {selected.size}
        </p>
      )}

      {/* Price */}
      <p className="text-2xl text-earth font-medium">
        {hasDiscount ? (
          <span className="flex items-baseline gap-3">
            <span className="text-bronze">
              <PriceDisplay amountInCents={effectivePrice} />
            </span>
            <span className="text-earth/40 line-through text-lg font-normal">
              <PriceDisplay amountInCents={basePrice} />
            </span>
          </span>
        ) : (
          <PriceDisplay amountInCents={basePrice} />
        )}
      </p>

      {/* Low stock warning */}
      {isLowStock && (
        <p className="text-xs font-semibold tracking-widest uppercase text-clay">
          Only {selected.inventoryCount} left in stock
        </p>
      )}

      {/* Add to cart + wishlist */}
      <div className="flex gap-4">
        <div className="flex-1">
          <AddToCartButton
            id={selected.id}
            productId={productId}
            slug={productSlug}
            name={productName}
            priceInCents={effectivePrice}
            size={selected.size || ""}
            image={productImage}
            inventoryCount={selected.inventoryCount}
          />
        </div>
        <WishlistButton
          productId={productId}
          initialInWishlist={inWishlist}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
