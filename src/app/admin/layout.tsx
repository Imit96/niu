import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Handshake,
  Star,
  Zap,
  Tag,
  Settings,
  LogOut,
  BookOpen,
  Truck,
  FlaskConical,
  BookMarked,
  Layers,
} from "lucide-react";
import { AdminSidebarLink } from "./AdminSidebarLink";

export const metadata = {
  title: "Admin Portal | ORIGONÆ",
  description: "Manage ORIGONÆ products, orders, and salon partners.",
};

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { name: "Journal", href: "/admin/articles", icon: "BookOpen" },
  { name: "Ingredients", href: "/admin/ingredients", icon: "FlaskConical" },
  { name: "Care Guides", href: "/admin/guides", icon: "BookMarked" },
  { name: "Ritual Bundles", href: "/admin/bundles", icon: "Layers" },
  { name: "Products", href: "/admin/products", icon: "Package" },
  { name: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
  { name: "Users", href: "/admin/users", icon: "Users" },
  { name: "Salon Partners", href: "/admin/salons", icon: "Handshake" },
  { name: "Reviews", href: "/admin/reviews", icon: "Star" },
  { name: "Flash Sales", href: "/admin/flash-sales", icon: "Zap" },
  { name: "Discount Codes", href: "/admin/discounts", icon: "Tag" },
  { name: "Shipping Rates", href: "/admin/shipping-rates", icon: "Truck" },
  { name: "Settings", href: "/admin/settings", icon: "Settings" },
];

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  BookMarked,
  Layers,
  Package,
  ShoppingCart,
  Users,
  Handshake,
  Star,
  Zap,
  Tag,
  Truck,
  Settings,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-sand">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-earth text-cream hidden md:flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-cream/10">
          <Link href="/admin" className="text-xl font-serif tracking-widest uppercase">
            ORIGONÆ Admin
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <AdminSidebarLink key={link.href} href={link.href} name={link.name}>
                <Icon className="h-5 w-5 flex-shrink-0" />
              </AdminSidebarLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <Link
            href="/api/auth/signout"
            className="flex items-center space-x-3 px-4 py-3 rounded-md hover:bg-cream/10 transition-colors text-bronze"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium text-sm">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 bg-cream border-b border-earth/10 flex items-center justify-between px-6 md:hidden">
          <Link href="/admin" className="font-serif tracking-widest uppercase text-earth">
            ORIGONÆ Admin
          </Link>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
