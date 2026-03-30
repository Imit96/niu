"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { X, Minus, Plus, Tag, Info, Zap } from "lucide-react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { useMemo, useEffect } from "react";
import { getVariantCurrentPrices } from "@/app/actions/cartActions";

// Minimum quantity per product to qualify for wholesale pricing
const SALON_MOQ = 2;

interface CartClientProps {
  isSalon: boolean;
  discountPct: number;
  businessName?: string;
  flashSalePct: number;
}

export default function CartClient({ isSalon, discountPct, businessName, flashSalePct }: CartClientProps) {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, syncPrices } = useCartStore();

  // Refresh stale cart prices from DB on mount
  useEffect(() => {
    if (items.length === 0) return;
    getVariantCurrentPrices(items.map((i) => i.id)).then((prices) => {
      if (prices.length > 0) syncPrices(prices);
    }).catch(() => {
      // fail silently — use cached prices
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayItems = useMemo(() => {
    return items.map((i) => {
      // Flash sale applies to base price first
      const flashPrice = flashSalePct > 0
        ? Math.floor(i.priceInCents * (1 - flashSalePct / 100))
        : i.priceInCents;
      const flashApplied = flashSalePct > 0;

      // Wholesale applies on top of flash price for salon MOQ items
      const wholesaleApplied = isSalon && discountPct > 0 && i.quantity >= SALON_MOQ;
      const discountedPrice = wholesaleApplied
        ? Math.floor(flashPrice * (1 - discountPct / 100))
        : flashPrice;

      return { ...i, flashPrice, flashApplied, discountedPrice, wholesaleApplied };
    });
  }, [items, isSalon, discountPct, flashSalePct]);

  const originalTotal = items.reduce((acc, i) => acc + i.priceInCents * i.quantity, 0);
  const subtotal = displayItems.reduce((acc, i) => acc + i.discountedPrice * i.quantity, 0);

  const flashSavings = flashSalePct > 0
    ? displayItems.reduce((acc, i) => acc + (i.priceInCents - i.flashPrice) * i.quantity, 0)
    : 0;
  const wholesaleSavings = displayItems.reduce((acc, i) => {
    if (i.wholesaleApplied) {
      return acc + (i.flashPrice - i.discountedPrice) * i.quantity;
    }
    return acc;
  }, 0);

  const hasAnyDiscount = flashSalePct > 0 || (isSalon && wholesaleSavings > 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col w-full min-h-[60vh] bg-sand items-center justify-center px-6">
        <h1 className="text-3xl font-serif text-earth mb-4 uppercase tracking-widests">{t("title")}</h1>
        <p className="text-earth/70 mb-8">{t("empty")}</p>
        <Link href="/shop">
          <Button size="lg">{t("discoverRegimens")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-earth mb-4 uppercase tracking-widest text-center">{t("title")}</h1>

        {/* Banners */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {flashSalePct > 0 && (
            <span className="flex items-center gap-2 bg-bronze/10 border border-bronze/30 text-bronze text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm">
              <Zap className="w-3 h-3" />
              {t("flashSaleActive", { pct: flashSalePct })}
            </span>
          )}
          {isSalon && (
            <span className="flex items-center gap-2 bg-bronze/10 border border-bronze/30 text-bronze text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-sm">
              <Tag className="w-3 h-3" />
              {t("wholesalePricingActive", { pct: discountPct, name: businessName || "Salon Partner" })}
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-earth/20 text-xs font-semibold tracking-widest uppercase text-bronze">
              <div className="col-span-6">{t("product")}</div>
              <div className="col-span-3 text-center">{t("quantity")}</div>
              <div className="col-span-3 text-right">{t("total")}</div>
            </div>

            <div className="space-y-6">
              {displayItems.map((item) => {
                const belowMoq = isSalon && item.quantity < SALON_MOQ;
                const anyDiscount = item.flashApplied || item.wholesaleApplied;
                return (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-earth/10 pb-6">
                    {/* Product Info */}
                    <div className="col-span-1 md:col-span-6 flex items-center space-x-6">
                      <div className="w-24 h-32 bg-stone border border-ash/30 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-earth/50 uppercase">Image</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Link href={`/shop/${item.slug || item.productId}`} className="text-lg font-serif text-earth hover:text-bronze transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-sm text-earth/70">{item.size}</p>
                        {/* Original price strikethrough when any discount applies */}
                        {anyDiscount && (
                          <p className="text-xs text-earth/40 line-through">
                            <PriceDisplay amountInCents={item.priceInCents} />
                          </p>
                        )}
                        {/* Note when qty=1 for salon partner */}
                        {belowMoq && (
                          <p className="text-[10px] text-bronze/80 flex items-center gap-1 pt-1">
                            <Info className="w-3 h-3 flex-shrink-0" />
                            {t("unlockWholesale", { pct: discountPct })}
                          </p>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-bronze underline underline-offset-4 pt-2 flex items-center"
                        >
                          <X className="w-3 h-3 mr-1" /> {t("remove")}
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
                      {anyDiscount ? (
                        <span className="text-bronze">
                          <PriceDisplay amountInCents={item.discountedPrice * item.quantity} />
                        </span>
                      ) : (
                        <PriceDisplay amountInCents={item.priceInCents * item.quantity} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-cream border border-earth/10 p-8 space-y-6 sticky top-32">
              <h2 className="text-xl font-serif text-earth uppercase tracking-widests border-b border-earth/10 pb-4">{t("orderSummary")}</h2>

              <div className="space-y-3 text-sm text-earth/80">
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  {hasAnyDiscount ? (
                    <span className="text-earth/50 line-through text-xs">
                      <PriceDisplay amountInCents={originalTotal} />
                    </span>
                  ) : (
                    <PriceDisplay amountInCents={subtotal} />
                  )}
                </div>

                {flashSalePct > 0 && (
                  <div className="flex justify-between text-bronze font-semibold">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {t("flashSaleDiscount", { pct: flashSalePct })}</span>
                    <span>– <PriceDisplay amountInCents={flashSavings} /></span>
                  </div>
                )}

                {isSalon && wholesaleSavings > 0 && (
                  <div className="flex justify-between text-bronze font-semibold">
                    <span>{t("wholesaleDiscount", { pct: discountPct })}</span>
                    <span>– <PriceDisplay amountInCents={wholesaleSavings} /></span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t("shippingLabel")}</span>
                  <span className="text-bronze">{t("shippingCalc")}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-earth/10 flex justify-between items-center text-lg font-medium text-earth">
                <span>{t("totalLabel")}</span>
                <span className={hasAnyDiscount ? "text-bronze" : ""}>
                  <PriceDisplay amountInCents={subtotal} />
                </span>
              </div>

              {isSalon && (
                <p className="text-[10px] text-earth/50 leading-relaxed">
                  {t("wholesaleNote", { pct: discountPct })}
                </p>
              )}

              <div className="pt-2">
                <Link href="/checkout" className="w-full inline-block">
                  <Button size="lg" className="w-full">{t("checkout")}</Button>
                </Link>
              </div>

              <p className="text-xs text-center text-earth/60 pt-2">
                {t("taxNote")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
