"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import toast from "react-hot-toast";

interface BundleProps {
  bundle: {
    id: string;
    name: string;
    priceInCents: number;
    products: Array<{
      id: string;
      slug: string;
      name: string;
      images: string[];
      variants: Array<{
        id: string;
        priceInCents: number;
        size: string | null;
        inventoryCount: number;
      }>;
    }>;
  };
}

export default function AddBundleToCartButton({ bundle }: BundleProps) {
  const { addItem, items } = useCartStore();
  const [adding, setAdding] = useState(false);

  // Check if any product in the bundle is out of stock natively
  const isOutOfStock = bundle.products.some(product => {
    const primaryVariant = product.variants[0];
    if (!primaryVariant) return true; // Missing variant means cannot fulfill bundle
    return primaryVariant.inventoryCount <= 0;
  });

  const handleAddBundle = () => {
    if (isOutOfStock) {
      toast.error("One or more items in this bundle are out of stock.");
      return;
    }

    setAdding(true);
    
    // We iterate through all products in the bundle and add their primary variant.
    // NOTE: In Phase 4, we will need to update the cartStore schema to natively understand "Bundles"
    // to strictly enforce the bundle.priceInCents natively at Checkout. For now, we add the elements.
    try {
      let allAdded = true;
      bundle.products.forEach(product => {
        const primaryVariant = product.variants[0];
        if (primaryVariant) {
           // Check if adding this would exceed inventory in cart
           const existingItem = items.find(i => i.id === primaryVariant.id);
           const currentQty = existingItem ? existingItem.quantity : 0;
           
           if (currentQty >= primaryVariant.inventoryCount) {
             toast.error(`Maximum stock reached for ${product.name}`);
             allAdded = false;
             return;
           }

           addItem({
             id: primaryVariant.id,
             productId: product.id,
             name: product.name,
             priceInCents: primaryVariant.priceInCents,
             slug: product.slug,
             quantity: 1,
             size: primaryVariant.size || "",
             image: product.images?.[0] || "",
             inventoryCount: primaryVariant.inventoryCount,
           });
        }
      });
      
      if (allAdded) {
         toast.success(`${bundle.name} added to bag`);
      }
    } catch (e) {
      toast.error("Failed to add bundle to bag.");
    } finally {
      setTimeout(() => setAdding(false), 500);
    }
  };

  return (
    <Button 
      size="lg" 
      onClick={handleAddBundle}
      disabled={isOutOfStock || adding}
      className="w-full bg-earth text-cream hover:bg-earth/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest font-serif text-sm h-14"
    >
      {adding ? "Adding Regimen..." : isOutOfStock ? "Out of Stock" : `Add Complete Regimen`}
    </Button>
  );
}
