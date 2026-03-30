"use client";

import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useCallback, Suspense, useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

const categories = ["All", "The Cleansing Regimen", "The Growth Regimen", "The Restoration Regimen", "The Olfactory Regimen"];
const textures = ["All", "Oil", "Clay", "Cream", "Mist", "Serum", "Parfum"];

type ProductSuggestion = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  ritualName: string | null;
  functionalTitle: string | null;
  description: string | null;
};

function FilterContent({ activeRitual, activeTexture, suggestions }: { activeRitual: string; activeTexture: string; suggestions: ProductSuggestion[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("shop");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const autocomplete = searchQuery.trim() === "" ? [] : suggestions.filter((product) => {
    const q = searchQuery.toLowerCase();
    const matchName = product.name?.toLowerCase().includes(q) || false;
    const matchDesc = product.description?.toLowerCase().includes(q) || false;
    const matchFunc = product.functionalTitle?.toLowerCase().includes(q) || false;
    return matchName || matchDesc || matchFunc;
  }).slice(0, 5);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "All") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.delete("page"); // reset to page 1 on filter change
      return params.toString();
    },
    [searchParams]
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/shop`);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Search Bar - Always visible */}
      <div className="space-y-4" ref={wrapperRef}>
        <h3 className="hidden md:block text-sm font-semibold tracking-widest uppercase text-bronze border-b border-earth/20 pb-2">Search</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={t("filters.search")}
            className="w-full px-4 py-3 bg-stone/50 border border-earth/20 focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-earth/60 hover:text-earth">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          {/* Autocomplete Dropdown */}
          {showSuggestions && autocomplete.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-cream border border-ash/30 shadow-lg max-h-80 overflow-y-auto">
              <ul className="py-2">
                {autocomplete.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-stone/30 transition-colors"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="relative w-10 h-10 flex-shrink-0 bg-stone/50 overflow-hidden">
                        {p.images?.[0] && p.images[0] !== "Product Image Placeholder" && (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-sm font-serif text-earth truncate">{p.name}</span>
                        <span className="text-xs text-earth/60 uppercase tracking-widest truncate">{p.ritualName || t("pdp.origonaeBase")}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>

      {/* Mobile Filter Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-earth/5 border border-earth/10 text-earth font-semibold tracking-widest uppercase text-sm"
      >
        <span>{t("filters.filterProducts")}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isMobileOpen ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Filter Content - Collapsible on Mobile */}
      <div className={`space-y-8 md:space-y-12 transition-all duration-300 ease-in-out md:block ${isMobileOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100"}`}>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze border-b border-earth/20 pb-2">{t("filters.regimenLabel")}</h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => {
                    router.push(`/shop?${createQueryString("ritual", cat)}`);
                    setIsMobileOpen(false);
                  }}
                  className={`text-sm tracking-wide transition-colors ${activeRitual === cat ? "text-earth font-semibold" : "text-earth/70 hover:text-bronze"}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 pb-4 md:pb-0">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze border-b border-earth/20 pb-2">{t("filters.textureLabel")}</h3>
          <ul className="space-y-3">
            {textures.map((tex) => (
              <li key={tex}>
                <button
                  onClick={() => {
                    router.push(`/shop?${createQueryString("texture", tex)}`);
                    setIsMobileOpen(false);
                  }}
                  className={`text-sm tracking-wide transition-colors ${activeTexture === tex ? "text-earth font-semibold" : "text-earth/70 hover:text-bronze"}`}
                >
                  {tex}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ShopFilters({
  activeRitual,
  activeTexture,
  suggestions,
}: {
  activeRitual: string;
  activeTexture: string;
  suggestions: ProductSuggestion[];
}) {
  const t = useTranslations("shop");
  return (
    <Suspense fallback={<div className="text-earth/60 text-sm">{t("filters.loadingFilters")}</div>}>
      <FilterContent activeRitual={activeRitual} activeTexture={activeTexture} suggestions={suggestions} />
    </Suspense>
  );
}
