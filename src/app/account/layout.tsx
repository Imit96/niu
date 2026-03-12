"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, Heart, LogOut, Shield, Building } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-sand flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-2 border-earth border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="min-h-screen bg-sand flex flex-col justify-center items-center px-6">
        <h1 className="text-3xl font-serif text-earth mb-4">Please Sign In</h1>
        <Link href="/auth/login" className="px-6 py-3 bg-earth text-cream tracking-widest uppercase text-sm font-semibold hover:bg-earth/90 transition-colors">
          Go to Login
        </Link>
      </div>
    );
  }

  const links = [
    { href: "/account", label: "Profile Details", icon: User },
    { href: "/account/orders", label: "Order History", icon: Package },
    { href: "/account/wishlist", label: "My Wishlist", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-sand pt-32 pb-24 px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
        {/* Sidebar */}
        <aside className="md:col-span-3 lg:col-span-3 space-y-12">
          <div>
            <h1 className="text-3xl font-serif text-earth uppercase tracking-widest leading-none mb-3">My Account</h1>
            <p className="text-earth/70 text-sm font-light">Welcome back, {session.user?.name || "Guest"}</p>
          </div>
          
          <nav className="flex flex-col space-y-2 text-sm tracking-wide text-earth/80 font-medium">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`flex items-center px-4 py-3 rounded-sm transition-colors ${
                    isActive ? "bg-earth/5 text-bronze" : "hover:bg-earth/5 hover:text-earth"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" /> {link.label}
                </Link>
              );
            })}

            {/* Admin & Salon Links separated by a divider */}
            {(session.user?.role === "ADMIN" || session.user?.role === "SALON") && (
              <div className="pt-6 mt-6 border-t border-earth/10 space-y-2">
                <p className="px-4 text-[10px] uppercase tracking-widest text-earth/40 pb-2">Portals</p>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="flex items-center px-4 py-3 rounded-sm text-red-700/80 hover:bg-red-50 hover:text-red-900 transition-colors">
                    <Shield className="w-4 h-4 mr-3" /> Admin Portal
                  </Link>
                )}
                {session.user?.role === "SALON" && (
                  <Link href="/salon/dashboard" className="flex items-center px-4 py-3 rounded-sm text-bronze/80 hover:bg-bronze/10 hover:text-bronze transition-colors">
                    <Building className="w-4 h-4 mr-3" /> Salon Dashboard
                  </Link>
                )}
              </div>
            )}
          </nav>

          <div className="pt-8 border-t border-earth/20">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center px-4 py-3 w-full text-left text-sm text-earth hover:text-bronze transition-colors tracking-widest uppercase font-semibold hover:bg-earth/5 rounded-sm"
            >
              <LogOut className="w-4 h-4 mr-3" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9 lg:col-span-9 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
