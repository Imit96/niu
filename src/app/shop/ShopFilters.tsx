"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense } from "react";

const categories = ["All", "The Cleansing Regimen", "The Growth Regimen", "The Restoration Regimen"];
const textures = ["All", "Oil", "Clay", "Cream", "Mist", "Serum"];

function FilterContent({ activeRitual, activeTexture }: { activeRitual: string; activeTexture: string; }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "All") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze border-b border-earth/20 pb-2">By Regimen</h3>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat}>
              <button 
                onClick={() => router.push(`/shop?${createQueryString("ritual", cat)}`)}
                className={`text-sm tracking-wide transition-colors ${activeRitual === cat ? "text-earth font-semibold" : "text-earth/70 hover:text-bronze"}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-bronze border-b border-earth/20 pb-2">By Texture</h3>
        <ul className="space-y-3">
          {textures.map((tex) => (
            <li key={tex}>
              <button 
                onClick={() => router.push(`/shop?${createQueryString("texture", tex)}`)}
                className={`text-sm tracking-wide transition-colors ${activeTexture === tex ? "text-earth font-semibold" : "text-earth/70 hover:text-bronze"}`}
              >
                {tex}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ShopFilters({
  activeRitual,
  activeTexture
}: {
  activeRitual: string;
  activeTexture: string;
}) {
  return (
    <Suspense fallback={<div className="text-earth/60 text-sm">Loading filters...</div>}>
      <FilterContent activeRitual={activeRitual} activeTexture={activeTexture} />
    </Suspense>
  );
}
