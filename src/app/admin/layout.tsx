import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, Users, Settings, LogOut } from "lucide-react";

export const metadata = {
  title: "Admin Portal | Originæ",
  description: "Manage Originæ products, orders, and salon partners.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Basic role check - redirect if not ADMIN
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-sand">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-earth text-cream hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-cream/10">
          <Link href="/admin" className="text-xl font-serif tracking-widest uppercase">
            Originæ Admin
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-4">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors">
            <Package className="h-5 w-5" />
            <span className="font-medium text-sm">Products</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors text-cream/50 cursor-not-allowed">
            <Users className="h-5 w-5" />
            <span className="font-medium text-sm">Users</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors text-cream/50 cursor-not-allowed">
            <Settings className="h-5 w-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-cream/10">
          <Link href="/api/auth/signout" className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors text-bronze">
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 bg-cream border-b border-earth/10 flex items-center justify-between px-6 md:hidden">
          <Link href="/admin" className="font-serif tracking-widest uppercase text-earth">
            Originæ Admin
          </Link>
          {/* Mobile menu could go here */}
        </header>
        
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
