import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/shop/[id]/AddToCartButton";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StaggerSection, FadeUpDiv } from "@/components/ui/Motion";

export default async function SalonDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "SALON" && session.user.role !== "ADMIN")) {
    redirect("/auth/login");
  }

  const profile = await prisma.salonPartner.findFirst({
    where: { userId: session.user.id },
    include: { pricingTier: true }
  });

  if (!profile || !profile.isApproved) {
    return (
      <div className="min-h-screen bg-sand pt-32 pb-24 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-serif text-earth mb-4">Application Pending</h1>
        <p className="text-earth/70 max-w-md text-center">
          Your salon partnership application is currently under review. 
          You will receive an email once approved to access wholesale pricing.
        </p>
      </div>
    );
  }

  const discountPct = profile.pricingTier?.discountPct || 0;

  const products = await prisma.product.findMany({
    include: {
      variants: {
        orderBy: { priceInCents: 'asc' }
      }
    }
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <StaggerSection className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <FadeUpDiv>
          <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-widest mb-6 border-b border-cream/20 pb-6 inline-block">Wholesale Portal</h1>
        </FadeUpDiv>
        <FadeUpDiv>
          <p className="text-lg text-cream/80 max-w-2xl mx-auto leading-relaxed font-light mb-4 pt-4">
            Welcome back, <span className="font-semibold">{profile.businessName}</span>.<br />
            You are currently on the <span className="font-semibold text-bronze">{profile.pricingTier?.name || "Standard"}</span> tier.
          </p>
        </FadeUpDiv>
        <FadeUpDiv>
          <p className="text-xs text-cream/60 uppercase tracking-widest bg-stone/20 inline-block px-6 py-2 border border-cream/10">
            {discountPct}% wholesale discount applied automatically at checkout
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/account/orders" className="text-xs text-cream/70 uppercase tracking-widest border border-cream/20 px-6 py-3 hover:bg-cream/10 transition-colors">
              Order History
            </Link>
            <Link href="/contact" className="text-xs text-cream/70 uppercase tracking-widest border border-cream/20 px-6 py-3 hover:bg-cream/10 transition-colors">
              Contact Wholesale Team
            </Link>
          </div>
        </FadeUpDiv>
      </StaggerSection>

      <StaggerSection className="py-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => {
            const primaryVariant = product.variants[0];
            if (!primaryVariant) return null;

            const basePrice = primaryVariant.priceInCents;
            const discountedPrice = Math.floor(basePrice * (1 - discountPct / 100));

            return (
              <FadeUpDiv key={product.id} className="group flex flex-col space-y-4 bg-cream/30 p-6 border border-earth/10 hover:border-earth/30 transition-colors">
                <Link href={`/shop/${product.slug}`} className="relative aspect-square overflow-hidden bg-stone border border-ash/30 block mb-2">
                  {product.images?.[0] && product.images[0] !== "Product Image Placeholder" ? (
                    <Image 
                      src={product.images[0]} 
                      alt={product.name} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-earth/40 uppercase tracking-widest font-serif text-xs">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="space-y-2 flex-1">
                  <p className="text-[10px] font-semibold text-bronze uppercase tracking-widest">{product.ritualName || "General"}</p>
                  <h3 className="text-xl font-serif text-earth leading-tight">{product.name}</h3>
                  <p className="text-xs text-earth/70 line-clamp-2">{product.functionalTitle}</p>
                </div>
                <div className="pt-4 border-t border-earth/10 flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    {discountPct > 0 && <span className="text-xs text-earth/50 line-through"><PriceDisplay amountInCents={basePrice} /></span>}
                    <span className="text-lg font-medium text-earth"><PriceDisplay amountInCents={discountedPrice} /></span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] shadow-sm uppercase tracking-widest text-earth/80 bg-stone px-2 py-1 border border-earth/10">{primaryVariant.size}</span>
                  </div>
                </div>
                <div className="pt-4 drop-shadow-sm">
                  <AddToCartButton 
                    id={primaryVariant.id} 
                    productId={product.id}
                    slug={product.slug}
                    name={product.name}
                    priceInCents={primaryVariant.priceInCents}
                    size={primaryVariant.size || ""}
                    image={product.images[0] || ""}
                    inventoryCount={primaryVariant.inventoryCount}
                  />
                </div>
              </FadeUpDiv>
            );
          })}
        </div>
      </StaggerSection>
    </div>
  );
}
