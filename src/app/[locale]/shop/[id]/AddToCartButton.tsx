"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "react-hot-toast";
import { checkInventoryAvailable } from "@/app/actions/cartActions";

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
        toast.error(liveCount === 0 ? "This product is out of stock." : "Not enough stock available.");
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
      toast.success(`${name} added to cart`);
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
      toast.success(`${name} added to cart`);
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
        ? "Checking..."
        : isOutOfStock
        ? "Out of Stock"
        : isLimitReached
        ? "Max Stock in Cart"
        : "Add to Cart"}
    </Button>
  );
}
