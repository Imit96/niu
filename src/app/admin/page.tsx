import { auth } from "../../../auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">Dashboard</h1>
        <p className="text-earth/60 mt-2">Welcome back, {session?.user?.name || "Admin"}. Here is what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder Stat Cards */}
        <div className="bg-cream p-6 border border-earth/10 rounded-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-earth/60">Total Products</h3>
          <p className="text-3xl font-serif text-earth mt-2">--</p>
        </div>
        <div className="bg-cream p-6 border border-earth/10 rounded-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-earth/60">Active Orders</h3>
          <p className="text-3xl font-serif text-earth mt-2">--</p>
        </div>
        <div className="bg-cream p-6 border border-earth/10 rounded-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-earth/60">Salon Partners</h3>
          <p className="text-3xl font-serif text-earth mt-2">--</p>
        </div>
      </div>
    </div>
  );
}
