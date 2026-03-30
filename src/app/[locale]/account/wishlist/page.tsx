import { getWishlist } from "@/app/actions/wishlist";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

export const metadata = {
  title: "My Wishlist | ORIGONÆ",
  description: "View your saved ORIGONÆ regimens.",
};

export default async function WishlistPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/login");
  }

  const { success, items } = await getWishlist();

  if (!success) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-earth text-lg mb-4">We encountered an issue loading your wishlist.</p>
        <Link href="/account" className="text-bronze hover:underline underline-offset-4">Return to Account</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-earth/20 pb-4">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest">My Wishlist</h1>
        <p className="text-earth/70 mt-2">Your saved products.</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-earth/20 bg-cream/30">
          <p className="text-earth font-serif text-xl mb-6">Your wishlist is empty.</p>
          <Link href="/shop" className="px-8 py-3 bg-earth text-cream uppercase tracking-widest text-sm hover:bg-earth/90 transition-colors">
            Discover Regimens
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const product = item.product;
            const primaryVariant = product.variants[0];
            const priceNode = primaryVariant ? <PriceDisplay amountInCents={primaryVariant.priceInCents} /> : "Unavailable";
            const image = product.images?.[0] !== "Product Image Placeholder" ? product.images?.[0] : null;

            return (
              <Link href={`/shop/${product.slug || product.id}`} key={item.id} className="group flex flex-col space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone border border-ash/30 group-hover:border-bronze transition-colors">
                  {image ? (
                    <Image 
                      src={image} 
                      alt={product.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="w-1/3 aspect-[1/2] border border-earth/20 rounded-full flex flex-col justify-center items-center text-center opacity-50 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] tracking-widest uppercase text-earth/50">Image Placeholder</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-sm font-serif text-earth uppercase tracking-wide">{product.name}</h3>
                  <div className="text-earth/70 text-sm flex items-center justify-center gap-1">{primaryVariant?.size ? `Size: ${primaryVariant.size} - ` : ""}{priceNode}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
