"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "react-hot-toast";
import { checkInventoryAvailable } from "@/app/actions/cartActions";
import { useTranslations } from "next-intl";

interface AddToCartButtonProps {
  id: string; // The variant ID
  productId: string;
  slug: string;
  name: string;
  priceInCents: number;
  size: string;
  image: string;
  inventoryCount: number;
}

export default function AddToCartButton({
  id,
  productId,
  slug,
  name,
  priceInCents,
  size,
  image,
  inventoryCount: initialInventoryCount,
}: AddToCartButtonProps) {
  const t = useTranslations("shop.addToCart");
  const cart = useCartStore();
  const [inventoryCount, setInventoryCount] = useState(initialInventoryCount);
  const [isChecking, setIsChecking] = useState(false);

  const isOutOfStock = inventoryCount <= 0;
  const currentCartQuantity = cart.items.find((i) => i.id === id)?.quantity || 0;
  const isLimitReached = currentCartQuantity >= inventoryCount;

  const handleAddToCart = async () => {
    setIsChecking(true);
    try {
      const { available, inventoryCount: liveCount } = await checkInventoryAvailable(
        id,
        currentCartQuantity + 1
      );

      // Sync local state if inventory changed since page load
      if (liveCount !== inventoryCount) {
        setInventoryCount(liveCount);
      }

      if (!available) {
        toast.error(liveCount === 0 ? t("errorOutOfStock") : t("errorNotEnough"));
        return;
      }

      cart.addItem({
        id,
        productId,
        slug,
        name,
        priceInCents,
        quantity: 1,
        size,
        image: image && image !== "Product Image Placeholder" && image !== "Product Image" ? image : "",
        inventoryCount: liveCount,
      });
      toast.success(t("addedToCart", { name }));
    } catch {
      // Fall back to local check on network error
      cart.addItem({
        id,
        productId,
        slug,
        name,
        priceInCents,
        quantity: 1,
        size,
        image: image && image !== "Product Image Placeholder" && image !== "Product Image" ? image : "",
        inventoryCount,
      });
      toast.success(t("addedToCart", { name }));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full"
      disabled={isOutOfStock || isLimitReached || isChecking}
      onClick={handleAddToCart}
    >
      {isChecking
        ? t("checking")
        : isOutOfStock
        ? t("outOfStock")
        : isLimitReached
        ? t("maxStock")
        : t("addToCart")}
    </Button>
  );
}
