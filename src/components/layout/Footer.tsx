import Link from "next/link";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";
import { getPublicSiteSettings } from "@/app/actions/admin";
import { FooterNewsletter } from "./FooterNewsletter";
import { auth } from "../../../auth";

export async function Footer() {
  const [settings, session] = await Promise.all([getPublicSiteSettings(), auth()]);
  const isSalonOrAdmin = session?.user?.role === "SALON" || session?.user?.role === "ADMIN";

  return (
    <footer className="bg-earth text-cream py-16 px-6 md:px-12 border-t border-earth/20">
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <Link href="/" className="text-3xl font-serif tracking-widest uppercase">
            ORIGONÆ
          </Link>
          <p className="text-sm text-cream/80 max-w-xs leading-relaxed">
            Luxury regimen haircare rooted in broader African heritage. Earthy, modern, and intentional.
          </p>
          <div className="flex space-x-4 pt-4">
            {settings.instagramUrl ? (
              <a href={settings.instagramUrl} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaInstagram className="h-5 w-5" />
              </a>
            ) : null}
            {settings.tiktokUrl ? (
              <a href={settings.tiktokUrl} aria-label="TikTok" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaTiktok className="h-5 w-5" />
              </a>
            ) : null}
            {settings.pinterestUrl ? (
              <a href={settings.pinterestUrl} aria-label="Pinterest" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaPinterest className="h-5 w-5" />
              </a>
            ) : null}
            {settings.twitterUrl ? (
              <a href={settings.twitterUrl} aria-label="Twitter / X" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
            ) : null}
            {settings.youtubeUrl ? (
              <a href={settings.youtubeUrl} aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaYoutube className="h-5 w-5" />
              </a>
            ) : null}
            {settings.facebookUrl ? (
              <a href={settings.facebookUrl} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="hover:text-bronze transition-colors">
                <FaFacebook className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase mb-2">Explore</h4>
          <Link href="/shop" className="text-sm text-cream/80 hover:text-cream transition-colors">Shop All</Link>
          <Link href="/guides" className="text-sm text-cream/80 hover:text-cream transition-colors">Guides</Link>
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
          {isSalonOrAdmin ? (
            <Link href="/salon/dashboard" className="text-sm text-cream/80 hover:text-cream transition-colors">Salon Dashboard</Link>
          ) : (
            <Link href="/salon" className="text-sm text-cream/80 hover:text-cream transition-colors">Become a Salon Partner</Link>
          )}
        </div>

        {/* Newsletter Column */}
        <FooterNewsletter />
      </div>

      <div className="mx-auto max-w-[1440px] mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-cream/60">
        <p>&copy; {new Date().getFullYear()} ORIGONÆ. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
