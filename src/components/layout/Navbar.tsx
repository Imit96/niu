"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore, Currency } from "@/lib/store/currencyStore";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Guides", href: "/guides" },
  { name: "Ingredients", href: "/ingredients" },
  { name: "Journal", href: "/journal" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const items = useCartStore((state) => state.items);
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when the route formally changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const cartItemsCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <>
      <nav className="w-full border-b border-ash/20 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 md:px-12">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6 text-earth" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors border-b pb-0.5 hover:text-bronze ${
                    isActive 
                      ? "text-earth border-earth" 
                      : "text-earth/80 border-transparent hover:border-bronze"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold tracking-wider text-earth font-serif uppercase"
          >
            ORIGONÆ
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            
            {mounted && (
              <div className="hidden md:flex items-center border-b border-earth/20 pb-0.5">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="bg-transparent text-[10px] font-semibold uppercase tracking-widest text-earth focus:outline-none cursor-pointer"
                  aria-label="Select Currency"
                >
                  <option value="NGN">NGN ₦</option>
                  <option value="USD">USD $</option>
                  <option value="GBP">GBP £</option>
                  <option value="EUR">EUR €</option>
                </select>
              </div>
            )}

            <Link href="/account" aria-label="Account">
              <User className="h-5 w-5 text-earth hover:text-bronze transition-colors" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative group">
              <ShoppingBag className="h-5 w-5 text-earth group-hover:text-bronze transition-colors" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-bronze text-[8px] text-cream">
                {cartItemsCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-in */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed bottom-0 left-0 top-0 w-[80%] max-w-sm bg-sand px-6 py-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-serif text-earth uppercase tracking-wider">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X className="h-6 w-6 text-earth" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-lg font-medium transition-colors ${
                        isActive 
                          ? "text-bronze underline decoration-1 underline-offset-[6px]" 
                          : "text-earth hover:text-bronze"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                
                {mounted && (
                  <div className="pt-6 border-t border-earth/20 mt-6">
                    <span className="text-xs uppercase tracking-widest text-earth/60 mb-2 block">Currency</span>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value as Currency)}
                      className="bg-transparent text-base font-semibold uppercase tracking-widest text-earth focus:outline-none cursor-pointer w-full border-b border-earth/20 pb-2"
                    >
                      <option value="NGN">NGN (₦)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
