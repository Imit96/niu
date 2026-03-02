"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";

interface AddToCartButtonProps {
  id: string; // The variant ID
  productId: string;
  name: string;
  priceInCents: number;
  size: string;
  image: string;
}

export default function AddToCartButton({
  id,
  productId,
  name,
  priceInCents,
  size,
  image
}: AddToCartButtonProps) {
  const cart = useCartStore();

  return (
    <Button 
      size="lg" 
      className="w-full" 
      onClick={() => {
        cart.addItem({
          id, // use variant ID as unique cart item id
          productId,
          name,
          priceInCents,
          quantity: 1,
          size,
          image: image || "Product Image"
        });
      }}
    >
      Add to Regimen (Cart)
    </Button>
  );
}
