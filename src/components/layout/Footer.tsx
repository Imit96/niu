"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FaInstagram, FaTiktok, FaPinterest } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-earth text-cream py-16 px-6 md:px-12 border-t border-earth/20">
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <Link href="/" className="text-3xl font-serif tracking-widest uppercase">
            Originæ
          </Link>
          <p className="text-sm text-cream/80 max-w-xs leading-relaxed">
            Luxury regimen haircare rooted in broader African heritage. Earthy, modern, and intentional.
          </p>
          <div className="flex space-x-4 pt-4">
            <a href="#" aria-label="Instagram" className="hover:text-bronze transition-colors">
              <FaInstagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="TikTok" className="hover:text-bronze transition-colors">
              <FaTiktok className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Pinterest" className="hover:text-bronze transition-colors">
              <FaPinterest className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase mb-2">Explore</h4>
          <Link href="/shop" className="text-sm text-cream/80 hover:text-cream transition-colors">Shop All</Link>
          <Link href="/shop" className="text-sm text-cream/80 hover:text-cream transition-colors">Regimens</Link>
          <Link href="/ingredients" className="text-sm text-cream/80 hover:text-cream transition-colors">Ingredient Philosophy</Link>
          <Link href="/journal" className="text-sm text-cream/80 hover:text-cream transition-colors">Journal</Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase mb-2">Client Care</h4>
          <Link href="/contact" className="text-sm text-cream/80 hover:text-cream transition-colors">Contact Us</Link>
          <Link href="/faq" className="text-sm text-cream/80 hover:text-cream transition-colors">FAQ</Link>
          <Link href="/shipping" className="text-sm text-cream/80 hover:text-cream transition-colors">Shipping & Returns</Link>
          <Link href="/terms" className="text-sm text-cream/80 hover:text-cream transition-colors">Terms & Privacy</Link>
        </div>

        {/* Newsletter Column */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <h4 className="text-sm font-semibold tracking-wider uppercase mb-2">Enter The Regimen</h4>
          <p className="text-sm text-cream/80 leading-relaxed mb-4">
            Join the circle to receive exclusive insights into our world, early access to new regimens, and quiet beauty philosophy.
          </p>
          <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-cream/10 border-cream/20 text-cream placeholder:text-cream/50 focus-visible:ring-cream/50 focus-visible:border-transparent" 
              required
            />
            <Button variant="secondary" className="w-full border-cream text-cream hover:bg-cream hover:text-earth">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-cream/60">
        <p>&copy; {new Date().getFullYear()} Originæ. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
