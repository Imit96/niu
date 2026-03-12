import Link from "next/link";
import { getAdminStats, getRecentOrders } from "../actions/admin";
import {
  Package,
  ShoppingCart,
  Users,
  Handshake,
  Star,
  TrendingUp,
  AlertTriangle,
  Clock,
  BarChart2,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const recentOrders = await getRecentOrders(5);

  const statCards = [
    {
      label: "Total Products",
      value: stats.productCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.orderCount,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      label: "All-Time Revenue",
      value: `₦ ${(stats.totalRevenueCents / 100).toLocaleString()}`,
      icon: TrendingUp,
      href: "/admin/orders",
    },
    {
      label: "Avg. Order Value",
      value: `₦ ${(stats.avgOrderValueCents / 100).toLocaleString()}`,
      icon: BarChart2,
      href: "/admin/orders",
    },
    {
      label: "Registered Users",
      value: stats.userCount,
      icon: Users,
      href: "/admin/users",
    },
    {
      label: "Pending Salons",
      value: stats.pendingSalonCount,
      icon: Handshake,
      href: "/admin/salons",
      highlight: stats.pendingSalonCount > 0,
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviewCount,
      icon: Star,
      href: "/admin/reviews",
      highlight: stats.pendingReviewCount > 0,
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };

  const hasAlerts = stats.lowStockVariantCount > 0 || stats.unshippedOldOrderCount > 0;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">
          Dashboard
        </h1>
        <p className="text-earth/60 mt-2 text-sm">
          Overview of your store activity.
        </p>
      </div>

      {/* Alerts */}
      {hasAlerts && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-earth/50">Alerts</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {stats.lowStockVariantCount > 0 && (
              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-sm hover:bg-amber-100 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>{stats.lowStockVariantCount}</strong> product variant{stats.lowStockVariantCount !== 1 ? "s" : ""} low on stock (≤5 units)
                </span>
              </Link>
            )}
            {stats.unshippedOldOrderCount > 0 && (
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-sm hover:bg-red-100 transition-colors"
              >
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>{stats.unshippedOldOrderCount}</strong> paid order{stats.unshippedOldOrderCount !== 1 ? "s" : ""} unshipped for over 3 days
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Revenue Trend */}
      <div className="bg-cream border border-earth/10 p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-earth/50">Revenue — Last 7 Days</p>
          <p className="text-2xl font-serif text-earth mt-1">
            ₦ {(stats.revenueLastSevenDaysCents / 100).toLocaleString()}
          </p>
        </div>
        {stats.revenueTrendPct !== null && (
          <div className={`text-sm font-medium ${stats.revenueTrendPct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {stats.revenueTrendPct >= 0 ? "+" : ""}{stats.revenueTrendPct}% vs prior 7 days
          </div>
        )}
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`group bg-cream p-6 border rounded-sm transition-all hover:shadow-md ${
              card.highlight
                ? "border-bronze/40 ring-1 ring-bronze/20"
                : "border-earth/10"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-earth/60">
                  {card.label}
                </h3>
                <p className="text-3xl font-serif text-earth mt-2">
                  {card.value}
                </p>
              </div>
              <card.icon
                className={`h-6 w-6 ${
                  card.highlight ? "text-bronze" : "text-earth/30"
                } group-hover:text-bronze transition-colors`}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif text-earth uppercase tracking-widest">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-bronze hover:underline underline-offset-4"
          >
            View All
          </Link>
        </div>

        <div className="bg-cream border border-earth/10 overflow-hidden">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-earth/50 text-sm">
              No orders yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-earth/10 bg-stone/30">
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-earth/60">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-earth/5 hover:bg-stone/20 transition-colors"
                  >
                    <td className="py-3 px-4 text-earth font-medium">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-earth/80">
                      {order.user?.name || order.guestEmail || "Guest"}
                    </td>
                    <td className="py-3 px-4 text-earth/60">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-earth font-medium">
                      ₦ {(order.totalInCents / 100).toLocaleString()}
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
