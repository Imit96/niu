import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    label: "Best Selling",
    sub: "Shop Now",
    href: "/shop",
    image: "/hero.png",
    position: "50% 30%",
  },
  {
    label: "Face & Body",
    sub: "Skin Rituals",
    href: "/skin",
    image: "/ingredient-heritage.png",
    position: "40% 60%",
  },
  {
    label: "Hair Care",
    sub: "Regimens",
    href: "/hair",
    image: "/hero.png",
    position: "60% 30%",
  },
  {
    label: "Complete Sets",
    sub: "Ritual Bundles",
    href: "/bundles",
    image: "/hero.png",
    position: "30% 50%",
  },
  {
    label: "Custom Formula",
    sub: "Your Ritual",
    href: "/shop",
    image: "/ingredient-heritage.png",
    position: "70% 40%",
  },
];

export function CategoryStrip({ className }: { className?: string }) {
  return (
    <div className={cn("flex overflow-x-auto md:grid md:grid-cols-5 scrollbar-none", className)}>
      {CATEGORIES.map((cat, i) => (
        <Link
          key={cat.label}
          href={cat.href}
          className="relative min-w-[44vw] sm:min-w-[35vw] md:min-w-0 h-36 md:h-full overflow-hidden group flex-shrink-0"
          aria-label={`Browse ${cat.label}`}
        >
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 768px) 44vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            style={{ objectPosition: cat.position }}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-500 group-hover:opacity-40 ${
              i % 2 === 0 ? "bg-ink/60" : "bg-earth/65"
            }`}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 md:pb-4 text-center px-2">
            <span className="text-[9px] font-semibold tracking-[0.25em] text-cream/60 uppercase mb-0.5">
              {cat.sub}
            </span>
            <span className="text-[10px] md:text-[11px] font-semibold tracking-[0.2em] text-cream uppercase leading-tight">
              {cat.label}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-bronze scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </Link>
      ))}
    </div>
  );
}
