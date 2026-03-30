"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  positions?: string[];
}

export default function ProductGallery({ images, productName, positions }: ProductGalleryProps) {
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
  const activePosition = positions?.[activeIndex] || "center";

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
        <div
          className="absolute inset-0"
          style={{
            transform: isZoomed ? "scale(2.5)" : "scale(1)",
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            transition: "transform 0.2s ease",
            willChange: "transform",
          }}
        >
          <Image
            src={activeImage}
            alt={`${productName} Main View`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: activePosition }}
          />
        </div>
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square bg-stone border cursor-pointer transition-all overflow-hidden
                ${activeIndex === idx ? "border-bronze ring-1 ring-bronze" : "border-ash/30 hover:border-bronze/50"}
              `}
              aria-label={`View ${productName} image ${idx + 1}`}
            >
              {img !== "Product Image Placeholder" ? (
                <Image
                  src={img}
                  alt={`${productName} Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  style={{ objectPosition: positions?.[idx] || "center" }}
                />
              ) : (
                <span className="text-earth/20 text-xs">IMG {idx + 1}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
