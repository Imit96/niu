"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import Link from "next/link";
import { createOrderFromCart, confirmOrderPayment } from "../actions/order";

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();
  const [loading, setLoading] = useState(false);

  const handlePaystackCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    try {
       // 1. Persist the pending order in our database 
       const orderRes = await createOrderFromCart(items, total, email);
       if (!orderRes.success) throw new Error("Order creation failed");

       // 2. Initialize Paystack Popup with the local order ID as ref
       const paystackConfig = {
         reference: `ord_${orderRes.orderId}_${new Date().getTime()}`,
         email: email,
         amount: total, // Paystack amount is in kobo/cents
         publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_f9d0b3747d8a40f5a46944055a50c1bce9559af8",
       };

       const handlePaystackSuccessAction = (reference: { reference: string }) => {
         // 3. Confirm the payment serverside and clear cart
         confirmOrderPayment(orderRes.orderId, reference.reference).then(() => {
            clearCart();
            window.location.href = `/checkout/success?order=${orderRes.orderId}`;
         });
       };

       const handlePaystackCloseAction = () => {
         setLoading(false);
         alert("Payment window closed. The order has been saved as Pending.");
       };

       // Import dynamically to avoid SSR window issues
       // @ts-expect-error: Paystack type definitions are not available
       const PaystackPop = (await import("@paystack/inline-js")).default;
       const paystack = new PaystackPop();
       paystack.newTransaction({
         ...paystackConfig,
         onSuccess: handlePaystackSuccessAction,
         onCancel: handlePaystackCloseAction,
       });

    } catch {
       alert("Failed to initiate checkout sequence.");
       setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] bg-stone items-center justify-center px-6">
        <p className="text-earth mb-4">No items to checkout.</p>
        <Link href="/shop"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form Side */}
            <div className="space-y-12">
               <div>
                 <h1 className="text-3xl font-serif text-earth uppercase tracking-widest mb-2">Checkout</h1>
                 <p className="text-earth/70 text-sm">Guest checkout enabled.</p>
               </div>

               <form onSubmit={handlePaystackCheckout} className="space-y-8">
                 {/* Contact */}
                 <div className="space-y-4">
                   <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Contact Information</h2>
                   <Input type="email" placeholder="Email Address" required />
                 </div>

                 {/* Shipping */}
                 <div className="space-y-4">
                   <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Shipping Address</h2>
                   <div className="grid grid-cols-2 gap-4">
                     <Input type="text" placeholder="First Name" required />
                     <Input type="text" placeholder="Last Name" required />
                   </div>
                   <Input type="text" placeholder="Address" required />
                   <Input type="text" placeholder="Apartment, suite, etc. (optional)" />
                   <div className="grid grid-cols-3 gap-4">
                     <Input type="text" placeholder="City" className="col-span-1" required />
                     <Input type="text" placeholder="State/Province" className="col-span-1" required />
                     <Input type="text" placeholder="Postal Code" className="col-span-1" required />
                   </div>
                   <Input type="text" placeholder="Country" defaultValue="Nigeria" required />
                 </div>

                 {/* Payment Simulate */}
                 <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full text-lg" disabled={loading}>
                      {loading ? "Processing..." : `Pay ₦ ${(total / 100).toLocaleString()}`}
                    </Button>
                 </div>
               </form>
            </div>

            {/* Summary Side */}
            <div className="bg-cream/50 p-8 border border-earth/10 sticky top-32 h-fit">
               <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-4 mb-6">Order Summary</h2>
               
               <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                 {items.map(item => (
                   <div key={item.id} className="flex items-center justify-between text-sm">
                     <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-16 bg-stone border border-ash/30" />
                          <span className="absolute -top-2 -right-2 bg-earth text-cream w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{item.quantity}</span>
                        </div>
                        <span className="text-earth font-medium">{item.name} <span className="text-earth/60 font-normal">({item.size})</span></span>
                     </div>
                     <span className="text-earth font-medium">₦ {((item.priceInCents * item.quantity) / 100).toLocaleString()}</span>
                   </div>
                 ))}
               </div>

               <div className="space-y-3 text-sm text-earth/80 pt-6 border-t border-earth/10">
                 <div className="flex justify-between">
                   <span>Subtotal</span>
                   <span>₦ {(total / 100).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Shipping</span>
                   <span>₦ 0</span>
                 </div>
               </div>

               <div className="pt-4 border-t border-earth/10 flex justify-between items-center text-xl font-medium text-earth">
                 <span>Total</span>
                 <span>₦ {(total / 100).toLocaleString()}</span>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
