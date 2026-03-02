"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { X, Minus, Plus } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] bg-sand items-center justify-center px-6">
        <h1 className="text-3xl font-serif text-earth mb-4 uppercase tracking-widest">Your Regimen Form</h1>
        <p className="text-earth/70 mb-8">Your cart is currently empty.</p>
        <Link href="/shop">
          <Button size="lg">Discover Regimens</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-earth mb-12 uppercase tracking-widest text-center">Your Regimen Form</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-earth/20 text-xs font-semibold tracking-widest uppercase text-bronze">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-earth/10 pb-6">
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center space-x-6">
                    <div className="w-24 h-32 bg-stone border border-ash/30 flex-shrink-0 flex items-center justify-center">
                       <span className="text-[10px] text-earth/50 uppercase">Image</span>
                    </div>
                    <div className="space-y-1">
                      <Link href={`/shop/${item.productId}`} className="text-lg font-serif text-earth hover:text-bronze transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-earth/70">{item.size}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-bronze underline underline-offset-4 pt-2 flex items-center"
                      >
                        <X className="w-3 h-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="col-span-1 md:col-span-3 flex justify-start md:justify-center items-center">
                    <div className="flex items-center border border-earth/20 rounded-sm overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-stone transition-colors text-earth"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-earth">{item.quantity}</span>
                      <button 
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-stone transition-colors text-earth"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 md:col-span-3 text-left md:text-right font-medium text-earth">
                    ₦ {(item.priceInCents * item.quantity / 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
             <div className="bg-cream border border-earth/10 p-8 space-y-6 sticky top-32">
               <h2 className="text-xl font-serif text-earth uppercase tracking-widest border-b border-earth/10 pb-4">Order Summary</h2>
               
               <div className="space-y-3 text-sm text-earth/80">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>₦ {(total / 100).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span className="text-bronze">Calculated at checkout</span>
                 </div>
               </div>

               <div className="pt-4 border-t border-earth/10 flex justify-between items-center text-lg font-medium text-earth">
                 <span>Total</span>
                 <span>₦ {(total / 100).toLocaleString()}</span>
               </div>

               <div className="pt-6">
                 <Link href="/checkout" className="w-full inline-block">
                   <Button size="lg" className="w-full">Proceed to Checkout</Button>
                 </Link>
               </div>
               
               <p className="text-xs text-center text-earth/60 pt-4">
                 Taxes and international shipping calculated at checkout.
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
