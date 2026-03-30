import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Building } from "lucide-react";
import { AdminUserActions } from "./AdminUserActions";

export default async function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await prisma.user.findFirst({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      salonProfile: {
        select: {
          id: true,
          businessName: true,
          isApproved: true,
          contactName: true,
          contactEmail: true,
          phone: true,
          address: true,
          pricingTier: { select: { name: true } },
        },
      },
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          status: true,
          totalInCents: true,
        },
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <Link href="/admin/users" className="text-xs font-semibold text-earth/50 hover:text-bronze flex items-center mb-4 uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" /> Back to Users
        </Link>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest flex items-center gap-4">
          {user.name || "Unnamed User"}
          <span className="text-[10px] bg-earth/10 text-earth px-3 py-1 font-sans rounded-sm">{user.role}</span>
        </h1>
        <p className="text-earth/60 mt-1 text-sm font-light">{user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-cream border border-earth/10 p-6 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-earth/50 font-semibold">Joined</p>
          <p className="text-earth text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-cream border border-earth/10 p-6 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-earth/50 font-semibold">Total Orders</p>
          <p className="text-earth text-lg">{user.orders.length}</p>
        </div>
        <div className="bg-cream border border-earth/10 p-6 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-earth/50 font-semibold">Total Spent</p>
          <p className="text-earth text-lg">
            ₦ {(user.orders.reduce((acc, o) => acc + (o.status === "PAID" || o.status === "DELIVERED" ? o.totalInCents : 0), 0) / 100).toLocaleString()}
          </p>
        </div>
      </div>

      <AdminUserActions userId={user.id} currentEmail={user.email!} />

      {user.salonProfile && (
        <div className="bg-bronze/5 border border-bronze/20 p-8 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-bronze/20 pb-4">
            <Building className="w-5 h-5 text-bronze" />
            <h2 className="text-lg font-serif text-earth uppercase tracking-widest">Salon Partner Profile</h2>
            {user.salonProfile.isApproved ? (
               <span className="ml-auto text-[10px] font-bold bg-green-100 text-green-800 px-2 py-1 uppercase tracking-widest rounded-sm">Approved</span>
            ) : (
               <span className="ml-auto text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 uppercase tracking-widest rounded-sm">Pending</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div><span className="text-earth/50 text-[10px] uppercase font-semibold block">Business Name</span> {user.salonProfile.businessName}</div>
             <div><span className="text-earth/50 text-[10px] uppercase font-semibold block">Pricing Tier</span> {user.salonProfile.pricingTier?.name || "Standard Wholesale"}</div>
             <div><span className="text-earth/50 text-[10px] uppercase font-semibold block">Contact</span> {user.salonProfile.contactName} ({user.salonProfile.contactEmail})</div>
             <div><span className="text-earth/50 text-[10px] uppercase font-semibold block">Phone</span> {user.salonProfile.phone || "—"}</div>
             <div className="md:col-span-2"><span className="text-earth/50 text-[10px] uppercase font-semibold block">Address</span> {user.salonProfile.address}</div>
          </div>
          <div className="mt-4 pt-4 border-t border-bronze/10">
             <Link href={`/admin/salons/${user.salonProfile.id}`} className="text-xs text-bronze hover:text-earth font-semibold uppercase tracking-widest">View Full Application &rarr;</Link>
          </div>
        </div>
      )}

      {/* Orders */}
      <h2 className="text-xl font-serif text-earth border-b border-earth/20 pb-2 mt-12 flex items-center gap-2">
         <Package className="w-5 h-5" /> Order History
      </h2>
      {user.orders.length === 0 ? (
        <p className="text-sm text-earth/50 italic">User has not placed any orders.</p>
      ) : (
        <div className="bg-cream border border-earth/10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone/30 border-b border-earth/10 text-[10px] uppercase tracking-widest text-earth/60">
              <tr>
                <th className="text-left font-semibold p-4">Order ID</th>
                <th className="text-left font-semibold p-4">Date</th>
                <th className="text-left font-semibold p-4">Status</th>
                <th className="text-right font-semibold p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map(order => (
                <tr key={order.id} className="border-b border-earth/5 hover:bg-stone/20 transition-colors">
                  <td className="p-4 font-mono text-bronze"><Link href={`/admin/orders/${order.id}`}>{order.id.slice(-8).toUpperCase()}</Link></td>
                  <td className="p-4 text-earth/80">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4 text-right">₦ {(order.totalInCents / 100).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
