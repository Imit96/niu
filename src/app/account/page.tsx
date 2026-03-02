"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Package, User } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="min-h-screen bg-sand flex flex-col justify-center items-center">
       <div className="w-8 h-8 border-2 border-earth border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="min-h-screen bg-sand flex flex-col justify-center items-center px-6">
        <h1 className="text-3xl font-serif text-earth mb-4">Please Sign In</h1>
        <Link href="/auth/login"><Button>Go to Login</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand pt-24 pb-24 px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Sidebar */}
        <div className="md:col-span-3 space-y-8">
           <div>
             <h1 className="text-3xl font-serif text-earth uppercase tracking-widest leading-none mb-2">My Account</h1>
             <p className="text-earth/70 text-sm">Welcome back, {session.user?.name}</p>
           </div>
           
           <nav className="flex flex-col space-y-4 text-sm tracking-wide text-earth/80">
              <Link href="/account" className="text-bronze font-medium flex items-center">
                <User className="w-4 h-4 mr-3" /> Profile Details
              </Link>
              <Link href="/account/orders" className="hover:text-bronze transition-colors flex items-center">
                <Package className="w-4 h-4 mr-3" /> Order History
              </Link>
              
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="text-red-700 hover:text-red-900 transition-colors flex items-center pt-4 border-t border-earth/10">
                  <span className="w-4 h-4 mr-3 flex items-center justify-center">🛡️</span> Admin Portal
                </Link>
              )}

              {session.user?.role === "SALON" && (
                <Link href="/salon" className="text-bronze hover:text-earth transition-colors flex items-center pt-4 border-t border-earth/10">
                  <span className="w-4 h-4 mr-3 flex items-center justify-center">🏛️</span> Salon Portal
                </Link>
              )}
           </nav>

           <div className="pt-8 border-t border-earth/20">
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-earth hover:text-bronze transition-colors flex items-center uppercase tracking-widest font-semibold"
              >
                Sign Out
              </button>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-9">
           <div className="bg-cream border border-earth/10 p-8 md:p-12 space-y-12 shadow-sm">
              <h2 className="text-2xl font-serif text-earth uppercase tracking-widest border-b border-earth/20 pb-4">Profile Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                   <p className="text-xs uppercase tracking-widest text-earth/50">Name</p>
                   <p className="text-lg text-earth">{session.user?.name}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-xs uppercase tracking-widest text-earth/50">Email</p>
                   <p className="text-lg text-earth">{session.user?.email}</p>
                 </div>
              </div>

              {/* Example of editable state hookup location */}
              <div className="pt-4">
                <Button variant="secondary" size="sm">Edit Details</Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
