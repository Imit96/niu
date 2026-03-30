import { auth } from "../../../../../../auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Order Details | ORIGONÆ",
};

async function getOrderDetails(orderId: string, userId: string) {
  return prisma.order.findUnique({
    where: { 
      id: orderId,
      userId: userId // Ensure they only see their own order
    },
    include: {
      orderItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [order, t] = await Promise.all([
    getOrderDetails(id, session.user.id),
    getTranslations("account"),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="bg-cream border border-earth/10 p-8 md:p-12 space-y-12 shadow-sm min-h-[500px]">
      <div className="space-y-6 border-b border-earth/20 pb-8">
        <Link href="/account/orders" className="inline-flex items-center text-xs uppercase tracking-widest text-earth/60 hover:text-bronze transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> {t("backToOrders")}
        </Link>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-serif text-earth uppercase tracking-widest">{t("orderDetails")}</h1>
            <p className="font-mono text-bronze mt-2">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
             <p className="text-sm text-earth/70 font-light mb-1">{t("placedOn", { date: format(new Date(order.createdAt), "MMMM d, yyyy") })}</p>
             <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-earth/5 text-earth border border-earth/10">
                {order.status}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <h3 className="text-sm uppercase tracking-widest text-earth font-medium border-b border-earth/10 pb-2">{t("itemsOrdered")}</h3>
          <div className="space-y-6">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-6">
                <div className="w-20 lg:w-24 aspect-[3/4] bg-stone relative border border-ash/30 shrink-0">
                  {item.variant.product.images?.[0] && item.variant.product.images[0] !== "Product Image Placeholder" && (
                    <Image 
                      src={item.variant.product.images[0]} 
                      alt={item.variant.product.name} 
                      fill 
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-serif text-earth text-lg">{item.variant.product.name}</h4>
                  <p className="text-sm text-earth/70 mt-1">{t("size", { size: item.variant.size || "Standard" })}</p>
                  <p className="text-sm text-earth mt-2">{t("qty", { qty: item.quantity })}</p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="text-earth font-medium"><PriceDisplay amountInCents={item.priceAtPurchase} /></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 bg-sand/30 p-6 md:p-8 border border-earth/5 h-fit">
          <h3 className="text-sm uppercase tracking-widest text-earth font-medium pb-2">{t("orderSummaryTitle")}</h3>
          <div className="space-y-3 text-sm text-earth/80">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <PriceDisplay amountInCents={order.totalInCents} />
            </div>
            <div className="flex justify-between">
              <span>{t("shippingLabel")}</span>
              <span>{t("shippingCalc")}</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-earth/10 text-earth font-medium text-lg">
              <span>{t("totalLabel")}</span>
              <PriceDisplay amountInCents={order.totalInCents} />
            </div>
          </div>

          <div className="pt-6 border-t border-earth/10">
            <h4 className="text-xs uppercase tracking-widest text-earth/50 mb-3">{t("shippingDetail")}</h4>
            <div className="text-sm text-earth/80 space-y-1">
              <p className="font-medium text-earth">{order.shippingName || "N/A"}</p>
              <p>{order.shippingAddress || "N/A"}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
