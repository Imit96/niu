import { getAdminOrders, updateOrderStatus } from "../../actions/admin";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { orders, totalPages } = await getAdminOrders(page);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  const allStatuses = [
    "PENDING",
    "PAID",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Orders
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">
          Monitor payments and manage order fulfilment.
        </p>
      </div>

      <div className="bg-cream border border-earth/10 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-earth/50 text-sm">
            No orders have been placed yet.
          </div>
        ) : (
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-earth/10 bg-stone/30">
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Payment
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-earth/5 hover:bg-stone/20 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-earth font-mono text-xs">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-earth font-medium">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-earth/50 text-xs">
                        {order.user?.email || order.guestEmail || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-earth/70">
                    <div className="space-y-0.5">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <p key={item.id} className="text-xs">
                          {item.variant?.product?.name || "Product"} × {item.quantity}
                        </p>
                      ))}
                      {order.orderItems.length > 2 && (
                        <p className="text-xs text-bronze">
                          +{order.orderItems.length - 2} more
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-earth font-medium">
                    ₦ {(order.totalInCents / 100).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-earth/60 text-xs">
                    {order.paymentMethod || "—"}
                    {order.paymentIntentId && (
                      <p className="text-[10px] text-earth/40 font-mono mt-0.5">
                        {order.paymentIntentId.slice(0, 16)}…
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-earth/60 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <form
                      action={async (formData: FormData) => {
                        "use server";
                        const status = formData.get("status") as string;
                        await updateOrderStatus(
                          order.id,
                          status as "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
                        );
                        revalidatePath("/admin/orders");
                      }}
                    >
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="text-xs border border-earth/20 rounded-sm px-2 py-1 bg-stone text-earth focus:border-bronze focus:outline-none"
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="ml-2 text-xs text-bronze hover:text-earth font-semibold uppercase tracking-wider"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 pt-2">
          {page > 1 && (
            <Link
              href={`/admin/orders?page=${page - 1}`}
              className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1"
            >
              Previous
            </Link>
          )}
          <span className="text-xs text-earth/50">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/orders?page=${page + 1}`}
              className="text-xs uppercase tracking-widest text-earth/60 hover:text-earth border border-earth/20 px-3 py-1"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
