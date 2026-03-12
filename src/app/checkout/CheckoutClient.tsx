"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useState, useEffect, useTransition, useMemo } from "react";
import Link from "next/link";
import { createOrderFromCart, confirmOrderPayment } from "../actions/order";
import { validateDiscountCode } from "../actions/discount";
import { saveAbandonedCartAction } from "../actions/cartActions";
import { toast } from "react-hot-toast";
import { NIGERIAN_STATES } from "@/lib/constants";
import type { ShippingRate } from "../actions/shipping";

interface FlashSaleInfo {
  title: string;
  discountPct: number;
}

export function CheckoutClient({ shippingRates, flashSale }: { shippingRates: ShippingRate[]; flashSale: FlashSaleInfo | null }) {
  const { items, getCartTotal, clearCart } = useCartStore();
  const baseSubtotal = getCartTotal();

  // Only save abandoned cart once per session — avoids spamming DB on repeated blur events
  const [cartSaved, setCartSaved] = useState(false);
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email && email.includes("@") && items.length > 0 && !cartSaved) {
      setCartSaved(true);
      saveAbandonedCartAction(email, null, JSON.stringify(items));
    }
  };

  const [salonDiscountPct, setSalonDiscountPct] = useState(0);
  useEffect(() => {
    import("../actions/salon").then(({ getSalonProfile }) => {
      getSalonProfile().then(profile => {
        if (profile?.isApproved && profile.pricingTier) {
          setSalonDiscountPct(profile.pricingTier.discountPct);
        }
      });
    });
  }, []);

  // Flash sale applied automatically for all eligible users (guests + customers + eligible salons)
  const flashSaleDiscountInCents = flashSale
    ? Math.floor(baseSubtotal * (flashSale.discountPct / 100))
    : 0;
  const subtotalAfterFlash = flashSale ? baseSubtotal - flashSaleDiscountInCents : baseSubtotal;

  const subtotal = salonDiscountPct > 0
    ? Math.floor(subtotalAfterFlash * (1 - salonDiscountPct / 100))
    : subtotalAfterFlash;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Discount State
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amountInCents: number; type: string } | null>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Shipping State
  const [isInternational, setIsInternational] = useState(false);
  const [selectedState, setSelectedState] = useState("Lagos");

  const selectedShippingRate = useMemo<ShippingRate | null>(() => {
    if (isInternational) {
      return shippingRates.find(r => r.type === "international") || null;
    }
    const stateRate = shippingRates.find(
      r => r.type === "domestic" && r.region === selectedState
    );
    if (stateRate) return stateRate;
    return shippingRates.find(r => r.type === "domestic" && !r.region) || null;
  }, [isInternational, selectedState, shippingRates]);

  const shippingFeeInCents = selectedShippingRate?.rateInCents || 0;

  const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY;

  // Inventory Check
  const outOfStockItems = items.filter(item => item.quantity > item.inventoryCount);
  const hasStockIssue = outOfStockItems.length > 0;

  const handleApplyDiscount = async () => {
    setDiscountError(null);
    if (!discountCode.trim()) return;

    setIsValidatingDiscount(true);
    const formData = new FormData();
    formData.append("code", discountCode);
    formData.append("cartTotalInCents", subtotal.toString());

    const result = await validateDiscountCode(formData);
    if (result.success && result.data) {
      setAppliedDiscount({
        code: result.data.code,
        amountInCents: result.data.discountAmountInCents,
        type: result.data.type,
      });
      toast.success(`Discount applied: ${result.data.type}`);
    } else {
      setDiscountError(result.error || "Invalid code");
      setAppliedDiscount(null);
    }
    setIsValidatingDiscount(false);
  };

  const handlePaystackCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!paystackKey) {
      setError("Payment system is not configured. Please contact support.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const shippingData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      address: formData.get("address") as string,
      phone: (formData.get("phone") as string) || undefined,
      apartment: (formData.get("apartment") as string) || undefined,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
    };

    try {
      const discountedSubtotal = appliedDiscount
        ? subtotal - appliedDiscount.amountInCents
        : subtotal;
      const finalTotalInCents = discountedSubtotal + shippingFeeInCents;

      const orderRes = await createOrderFromCart(
        items,
        finalTotalInCents,
        shippingData,
        appliedDiscount?.code,
        selectedShippingRate?.id
      );

      if (!orderRes || (orderRes as any).error || !orderRes.orderId) {
        const errCode = (orderRes as any)?.error;
        const errMsg = (orderRes as any)?.message || "Failed to create order";
        setError(errCode === "STALE_CART" ? "__STALE_CART__" : errMsg);
        setLoading(false);
        return;
      }

      // Sanity check for Public Key vs Secret Key
      if (!paystackKey.startsWith("pk_")) {
        throw new Error("Invalid Payment Configuration: NEXT_PUBLIC_PAYSTACK_KEY must be a Public Key (pk_...), but it looks like a Secret Key or is malformed.");
      }

      // Initialize Paystack inline popup
      const paystackConfig = {
        key: paystackKey,
        email: shippingData.email,
        amount: finalTotalInCents,
        currency: "NGN",
        reference: orderRes.orderId,
        metadata: {
          custom_fields: [
            { display_name: "Order ID", variable_name: "order_id", value: orderRes.orderId },
            { display_name: "Customer Name", variable_name: "customer_name", value: `${shippingData.firstName} ${shippingData.lastName}` },
          ],
        },
      };

      const handlePaystackSuccessAction = (reference: { reference: string }) => {
        confirmOrderPayment(orderRes.orderId, reference.reference).then(() => {
          clearCart();
          window.location.href = `/checkout/success?order=${orderRes.orderId}`;
        }).catch(() => {
          setError("Payment verification in progress. You will receive a confirmation email shortly.");
          setLoading(false);
        });
      };

      const handlePaystackCloseAction = () => {
        setLoading(false);
        setError("Payment window closed. Your order has been saved as pending.");
      };

      // @ts-expect-error: Paystack inline-js has no official type declarations
      const PaystackPop = (await import("@paystack/inline-js")).default;
      const paystack = new PaystackPop();
      paystack.newTransaction({
        ...paystackConfig,
        onSuccess: handlePaystackSuccessAction,
        onCancel: handlePaystackCloseAction,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate checkout.");
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

  const discountedSubtotal = appliedDiscount ? subtotal - appliedDiscount.amountInCents : subtotal;
  const finalCartTotal = discountedSubtotal + shippingFeeInCents;

  const selectClass = "w-full px-4 py-3 bg-sand border border-earth/20 text-sm text-earth focus:outline-none focus:border-earth rounded-none";

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

            {error && error !== "__STALE_CART__" && (
              <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm">{error}</div>
            )}

            {error === "__STALE_CART__" && (
              <div className="bg-clay/10 border border-clay/30 text-clay p-4 text-sm space-y-3">
                <p className="font-semibold">Your cart contains outdated product data.</p>
                <p className="text-clay/80">One or more items in your cart no longer match our database. Please clear your cart and re-add your items.</p>
                <button
                  type="button"
                  onClick={() => { clearCart(); setError(null); }}
                  className="px-4 py-2 bg-clay text-cream text-xs font-bold uppercase tracking-widest hover:bg-clay/90 transition-colors"
                >
                  Clear Cart & Start Over
                </button>
              </div>
            )}

            <form onSubmit={handlePaystackCheckout} className="space-y-8">
              {/* Contact */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Contact Information</h2>
                <Input name="email" type="email" placeholder="Email Address" required onBlur={handleEmailBlur} />
                <Input name="phone" type="tel" placeholder="Mobile Number (for delivery updates)" />
              </div>

              {/* Shipping */}
              <div className="space-y-4">
                <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-2">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input name="firstName" type="text" placeholder="First Name" required />
                  <Input name="lastName" type="text" placeholder="Last Name" required />
                </div>
                <Input name="address" type="text" placeholder="Street Address" required />
                <Input name="apartment" type="text" placeholder="Apartment, suite, etc. (optional)" />

                {/* Destination type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">Delivery Destination</label>
                  <select
                    value={isInternational ? "international" : "domestic"}
                    onChange={(e) => setIsInternational(e.target.value === "international")}
                    className={selectClass}
                  >
                    <option value="domestic">Nigeria (Domestic)</option>
                    <option value="international">Outside Nigeria (International)</option>
                  </select>
                </div>

                {isInternational ? (
                  <>
                    {/* International: free-text country + state */}
                    <Input name="country" type="text" placeholder="Country" required />
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="city" type="text" placeholder="City" required />
                      <Input name="state" type="text" placeholder="State / Region (optional)" />
                    </div>
                    <Input name="postalCode" type="text" placeholder="Postal Code" required />
                  </>
                ) : (
                  <>
                    {/* Domestic: hidden country + state dropdown */}
                    <input type="hidden" name="country" value="Nigeria" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-earth">State *</label>
                        <select
                          name="state"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className={selectClass}
                          required
                        >
                          {NIGERIAN_STATES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <Input name="city" type="text" placeholder="City" required />
                    </div>
                    <Input name="postalCode" type="text" placeholder="Postal Code (optional)" />
                  </>
                )}

                {/* Shipping rate info */}
                {selectedShippingRate ? (
                  <div className="bg-cream border border-earth/10 px-4 py-3 text-sm text-earth flex justify-between items-center">
                    <span>{selectedShippingRate.name}{selectedShippingRate.estimatedDays ? ` — ${selectedShippingRate.estimatedDays}` : ""}</span>
                    <span className="font-medium"><PriceDisplay amountInCents={selectedShippingRate.rateInCents} /></span>
                  </div>
                ) : isInternational ? (
                  <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                    International shipping to your region is not yet available online.{" "}
                    <Link href="/contact" className="underline underline-offset-2 font-medium hover:text-amber-900">
                      Contact us
                    </Link>{" "}
                    to arrange a custom shipping quote.
                  </div>
                ) : null}
              </div>

              {/* Payment */}
              <div className="pt-4 space-y-4">
                {hasStockIssue && (
                  <div className="bg-clay/10 border border-clay/30 text-clay px-4 py-3 text-sm">
                    Some items in your cart exceed available stock. Please reduce the quantity.
                  </div>
                )}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg uppercase tracking-widest"
                  disabled={loading || isPending || hasStockIssue || (isInternational && !selectedShippingRate)}
                >
                  {loading || isPending
                    ? "Processing..."
                    : <span className="flex items-center justify-center gap-1.5 break-normal">Pay <PriceDisplay amountInCents={finalCartTotal} /></span>
                  }
                </Button>
              </div>
            </form>
          </div>

          {/* Summary Side */}
          <div className="bg-cream/50 p-8 border border-earth/10 sticky top-32 h-fit">
            <h2 className="text-lg font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-4 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {(() => {
                const hasDiscount = salonDiscountPct > 0 || !!appliedDiscount;
                const discountRatio = hasDiscount && baseSubtotal > 0
                  ? discountedSubtotal / baseSubtotal
                  : 1;
                return items.map(item => {
                  const originalPrice = item.priceInCents * item.quantity;
                  const discountedPrice = hasDiscount
                    ? Math.round(originalPrice * discountRatio)
                    : originalPrice;
                  return (
                    <div key={`${item.productId}-${item.id}`} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-16 bg-stone border border-ash/30 shrink-0" />
                          <span className="absolute -top-2 -right-2 bg-earth text-cream w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{item.quantity}</span>
                        </div>
                        <span className="text-earth font-medium">{item.name} <span className="text-earth/60 font-normal">({item.size})</span></span>
                      </div>
                      <div className="text-right">
                        {hasDiscount ? (
                          <>
                            <div className="text-earth font-medium"><PriceDisplay amountInCents={discountedPrice} /></div>
                            <div className="text-earth/40 line-through text-xs"><PriceDisplay amountInCents={originalPrice} /></div>
                          </>
                        ) : (
                          <span className="text-earth font-medium"><PriceDisplay amountInCents={originalPrice} /></span>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Discount code */}
            <div className="pt-6 border-t border-earth/10 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  disabled={!!appliedDiscount || isValidatingDiscount}
                  className="flex-1 bg-transparent border border-earth/20 px-4 py-3 text-sm text-earth focus:border-earth outline-none uppercase placeholder:normal-case disabled:opacity-50"
                />
                {appliedDiscount ? (
                  <button
                    type="button"
                    onClick={() => { setAppliedDiscount(null); setDiscountCode(""); }}
                    className="px-6 py-3 text-xs uppercase tracking-widest text-earth bg-earth/5 hover:bg-earth/10 transition-colors"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={isValidatingDiscount || !discountCode.trim()}
                    className="px-6 py-3 bg-earth text-cream text-xs uppercase tracking-widest hover:bg-earth/90 transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                )}
              </div>
              {discountError && <p className="text-red-600 text-xs">{discountError}</p>}
              {appliedDiscount && <p className="text-green-700 text-xs">Code {appliedDiscount.code} applied ({appliedDiscount.type})</p>}
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm text-earth/80 pt-6 mt-6 border-t border-earth/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className={(flashSale || salonDiscountPct > 0) ? "line-through opacity-50" : ""}>
                  <PriceDisplay amountInCents={baseSubtotal} />
                </span>
              </div>
              {flashSale && (
                <div className="flex justify-between text-bronze font-medium">
                  <span>Flash Sale ({flashSale.discountPct}% — {flashSale.title})</span>
                  <span>-<PriceDisplay amountInCents={flashSaleDiscountInCents} /></span>
                </div>
              )}
              {salonDiscountPct > 0 && (
                <>
                  <div className="flex justify-between text-earth font-medium">
                    <span>Wholesale Discount ({salonDiscountPct}%)</span>
                    <span>-<PriceDisplay amountInCents={subtotalAfterFlash - subtotal} /></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discounted Subtotal</span>
                    <span><PriceDisplay amountInCents={subtotal} /></span>
                  </div>
                </>
              )}
              {appliedDiscount && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({appliedDiscount.code})</span>
                  <span>-<PriceDisplay amountInCents={appliedDiscount.amountInCents} /></span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping{selectedShippingRate?.estimatedDays ? ` (${selectedShippingRate.estimatedDays})` : ""}</span>
                {shippingFeeInCents > 0
                  ? <PriceDisplay amountInCents={shippingFeeInCents} />
                  : <span className="text-earth/60">—</span>
                }
              </div>
            </div>

            <div className="flex justify-between items-center text-earth pt-4 mt-4 border-t border-earth/10">
              <span className="font-serif text-lg tracking-widest uppercase">Total</span>
              <span className="font-medium text-xl"><PriceDisplay amountInCents={finalCartTotal} /></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
