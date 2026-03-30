"use client";

import * as React from "react";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { useCartStore } from "@/lib/store/cartStore";
import { useCurrencyStore, Currency } from "@/lib/store/currencyStore";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Navbar() {
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const items = useCartStore((state) => state.items);
  const { currency, setCurrency } = useCurrencyStore();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      if (currentScrollY < 80) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current + 5) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (isMobileMenuOpen) setIsNavVisible(true);
  }, [isMobileMenuOpen]);

  const cartItemsCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const cartAriaLabel = cartItemsCount > 0
    ? `${t("cart")}, ${cartItemsCount} ${cartItemsCount === 1 ? "item" : "items"}`
    : t("cart");

  const navLinks = [
    { name: t("hair"), href: "/hair" as const },
    { name: t("scent"), href: "/scent" as const },
    { name: t("skin"), href: "/skin" as const },
    { name: t("shop"), href: "/shop" as const },
    { name: t("guides"), href: "/guides" as const },
    { name: t("journal"), href: "/journal" as const },
    { name: t("about"), href: "/about" as const },
  ];

  return (
    <>
      <nav
        style={{ transform: isNavVisible ? "translateY(0)" : "translateY(-100%)", transition: "transform 300ms ease-in-out" }}
        className={`relative w-full z-[100] transition-colors duration-700 ${
          isTransparent
            ? "bg-transparent border-b border-white/10"
            : "bg-white/95 backdrop-blur-md border-b border-ash/10 shadow-sm"
        }`}
      >

        {/* ── Row 1: Hamburger | Logo | Utilities ──
            On mobile: always visible.
            On desktop (md+): collapses when scrolled so Row 2 takes over. */}
        <div className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
          isScrolled ? "md:max-h-0 md:opacity-0 md:pointer-events-none" : "max-h-[68px] opacity-100"
        }`}>
          <div className={`grid grid-cols-3 h-14 md:h-16 items-center max-w-[1440px] mx-auto px-6 md:px-12 transition-colors duration-500 ${
            isTransparent ? "border-b border-white/10" : "border-b border-ash/20"
          }`}>

            {/* Left — hamburger (mobile) */}
            <div className="flex items-center">
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className={`h-6 w-6 transition-colors duration-500 ${isTransparent ? "text-cream" : "text-earth"}`} />
              </button>
            </div>

            {/* Centre — Logo */}
            <Link
              href="/"
              className={`justify-self-center text-2xl md:text-3xl font-semibold tracking-wider font-serif uppercase whitespace-nowrap transition-colors duration-500 ${
                isTransparent ? "text-white" : "text-[#2A2A2A]"
              }`}
            >
              ORIGONÆ
            </Link>

            {/* Right — utilities */}
            <div className="flex items-center justify-end gap-4 lg:gap-5">
              {mounted && (
                <>
                  <div className="hidden md:flex items-center gap-4 lg:gap-5">
                    <LocaleSwitcher />
                    <div className={`flex items-center border-b pb-0.5 transition-colors duration-500 ${
                      isTransparent ? "border-cream/30" : "border-earth/20"
                    }`}>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className={`bg-transparent text-xs font-semibold uppercase tracking-widest focus:outline-none cursor-pointer transition-colors duration-500 ${
                          isTransparent ? "text-cream/80" : "text-earth"
                        }`}
                        aria-label={t("currency")}
                      >
                        <option value="NGN">NGN ₦</option>
                        <option value="USD">USD $</option>
                        <option value="GBP">GBP £</option>
                        <option value="EUR">EUR €</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <Link href="/account" aria-label={t("account")}>
                <User className={`h-5 w-5 hover:text-bronze transition-colors duration-500 ${isTransparent ? "text-cream/80" : "text-earth"}`} />
              </Link>
              <Link href="/cart" aria-label={cartAriaLabel} className="relative group">
                <ShoppingBag className={`h-5 w-5 group-hover:text-bronze transition-colors duration-500 ${isTransparent ? "text-cream/80" : "text-earth"}`} />
                {cartItemsCount > 0 && (
                  <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-bronze text-[8px] text-cream">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Row 2: Nav links (desktop only)
            When scrolled: becomes a full-width compact bar with logo left + nav links center + utilities right.
            When at top: just centered nav links as before. ── */}
        <div className={`hidden md:grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-12 max-w-[1440px] mx-auto transition-[height] duration-200 ease-out ${
          isScrolled ? "h-14" : "h-10"
        }`}>

          {/* Left: Logo — fades in when scrolled */}
          <div className={`transition-opacity duration-150 ${isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <Link
              href="/"
              className="text-xl font-semibold tracking-wider font-serif uppercase text-[#2A2A2A] whitespace-nowrap hover:text-bronze transition-colors"
            >
              ORIGONÆ
            </Link>
          </div>

          {/* Center: Nav links — always visible */}
          <div className="flex items-center gap-1">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <React.Fragment key={link.href}>
                  {i > 0 && (
                    <span className={`text-xs select-none px-1 transition-colors duration-500 ${isTransparent ? "text-cream/20" : "text-earth/20"}`} aria-hidden="true">·</span>
                  )}
                  <Link
                    href={link.href}
                    className={`text-xs font-semibold uppercase tracking-widest transition-all duration-500 px-2 py-1 border-b pb-0.5 hover:text-bronze whitespace-nowrap ${
                      isTransparent
                        ? isActive
                          ? "text-cream border-cream/60"
                          : "text-cream/60 border-transparent hover:border-bronze"
                        : isActive
                          ? "text-earth border-earth"
                          : "text-earth/60 border-transparent hover:border-bronze"
                    }`}
                  >
                    {link.name}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>

          {/* Right: Utilities — fades in when scrolled */}
          <div className={`flex items-center justify-end gap-4 transition-opacity duration-150 ${isScrolled && mounted ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <LocaleSwitcher />
            <div className="flex items-center border-b border-earth/20 pb-0.5">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-xs font-semibold uppercase tracking-widest text-earth focus:outline-none cursor-pointer"
                aria-label={t("currency")}
              >
                <option value="NGN">NGN ₦</option>
                <option value="USD">USD $</option>
                <option value="GBP">GBP £</option>
                <option value="EUR">EUR €</option>
              </select>
            </div>
            <Link href="/account" aria-label={t("account")}>
              <User className="h-5 w-5 text-earth hover:text-bronze transition-colors" />
            </Link>
            <Link href="/cart" aria-label={cartAriaLabel} className="relative group">
              <ShoppingBag className="h-5 w-5 text-earth group-hover:text-bronze transition-colors" />
              {cartItemsCount > 0 && (
                <span aria-hidden="true" className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-bronze text-[8px] text-cream">
                  {cartItemsCount}
                </span>
              )}
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
              id="mobile-menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed bottom-0 left-0 top-0 w-[80%] max-w-sm bg-sand px-6 py-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-serif text-earth uppercase tracking-wider">
                  {t("menu")}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={t("closeMenu")}
                >
                  <X className="h-6 w-6 text-earth" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
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
                  <div className="pt-6 border-t border-earth/20 mt-6 space-y-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-earth/60 mb-2 block">{t("language")}</span>
                      <LocaleSwitcher />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-widest text-earth/60 mb-2 block">{t("currency")}</span>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className="bg-transparent text-base font-semibold uppercase tracking-widest text-earth focus:outline-none cursor-pointer w-full border-b border-earth/20 pb-2"
                        aria-label={t("currency")}
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
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
