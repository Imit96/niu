"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { parseImageTransform, transformStyle } from "@/lib/image-transform";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  positions?: string[];
}

export default function ProductGallery({ images, productName, positions }: ProductGalleryProps) {
  const t = useTranslations("shop.gallery");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const hasImages = images && images.length > 0 && images[0] !== "Product Image Placeholder";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  };

  if (!hasImages) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-[4/5] bg-stone border border-ash/30 w-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-sm">
            Product Image Hero
          </div>
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex] ?? images[0];
  const activeTransform = parseImageTransform(positions?.[activeIndex]);

  return (
    <div className="space-y-4">
      {/* Main Large Image — hover to magnify */}
      <div
        className="relative aspect-[4/5] bg-stone border border-ash/30 w-full overflow-hidden"
        style={{ cursor: isZoomed ? "zoom-out" : "zoom-in" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Hover-zoom wrapper */}
        <div
          className="absolute inset-0"
          style={{
            transform: isZoomed ? "scale(2.5)" : "scale(1)",
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            transition: "transform 0.2s ease",
            willChange: "transform",
          }}
        >
          {/* Crop-position wrapper */}
          <div style={transformStyle(activeTransform)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage}
              alt={t("mainView", { productName })}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => {
            const thumbTransform = parseImageTransform(positions?.[idx]);
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square bg-stone border cursor-pointer transition-all overflow-hidden
                  ${activeIndex === idx ? "border-bronze ring-1 ring-bronze" : "border-ash/30 hover:border-bronze/50"}
                `}
                aria-label={t("viewImage", { productName, index: idx + 1 })}
              >
                {img !== "Product Image Placeholder" ? (
                  <div style={transformStyle(thumbTransform)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={t("thumbnail", { productName, index: idx + 1 })}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-earth/20 text-xs">IMG {idx + 1}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
