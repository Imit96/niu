import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export const metadata = {
  title: "Order History | ORIGONÆ",
  description: "View your past ORIGONÆ orders.",
};

async function getOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await getOrders(session.user.id);

  return (
    <div className="bg-cream border border-earth/10 p-8 md:p-12 space-y-12 shadow-sm min-h-[500px]">
      <div className="border-b border-earth/20 pb-4">
        <h1 className="text-2xl font-serif text-earth uppercase tracking-widest">Order History</h1>
        <p className="text-earth/70 mt-2 text-sm">Review your past purchases and their status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-earth/20 bg-sand/30">
          <p className="text-earth font-serif text-lg mb-4">You haven't placed any orders yet.</p>
          <Link href="/shop" className="text-bronze hover:text-earth uppercase tracking-widest text-xs font-semibold py-2 px-6 border border-bronze hover:border-earth transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-earth/20 text-xs uppercase tracking-widest text-earth/60">
                <th className="py-4 font-medium">Order ID</th>
                <th className="py-4 font-medium">Date</th>
                <th className="py-4 font-medium">Status</th>
                <th className="py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-earth/10 hover:bg-earth/5 transition-colors group">
                  <td className="py-4 pr-4">
                    <Link href={`/account/orders/${order.id}`} className="font-mono text-bronze group-hover:underline underline-offset-4">
                      {order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="py-4 text-earth/80">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded-sm ${
                      order.status === "PAID" ? "bg-green-100 text-green-800" :
                      order.status === "DELIVERED" ? "bg-bronze/20 text-bronze" :
                      order.status === "PENDING" ? "bg-amber-100 text-amber-800" :
                      "bg-earth/10 text-earth"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-earth/90">
                    <PriceDisplay amountInCents={order.totalInCents} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
