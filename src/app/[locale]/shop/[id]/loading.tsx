export default function ProductDetailLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full bg-stone animate-pulse border border-ash/30" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-20 bg-stone animate-pulse border border-ash/30" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="space-y-8 pt-4">
            <div className="space-y-3">
              <div className="h-3 w-20 bg-earth/10 animate-pulse" />
              <div className="h-10 w-3/4 bg-earth/10 animate-pulse" />
              <div className="h-4 w-1/2 bg-earth/10 animate-pulse" />
            </div>

            <div className="h-8 w-1/3 bg-earth/10 animate-pulse" />

            <div className="space-y-2">
              <div className="h-4 w-full bg-earth/10 animate-pulse" />
              <div className="h-4 w-5/6 bg-earth/10 animate-pulse" />
              <div className="h-4 w-4/5 bg-earth/10 animate-pulse" />
            </div>

            {/* Variant selector skeleton */}
            <div className="space-y-3">
              <div className="h-3 w-16 bg-earth/10 animate-pulse" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-stone animate-pulse border border-ash/30" />
                ))}
              </div>
            </div>

            <div className="h-14 w-full bg-earth/20 animate-pulse mt-6" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-32 space-y-8">
          <div className="h-6 w-64 bg-earth/10 animate-pulse mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] w-full bg-stone animate-pulse border border-ash/30" />
                <div className="h-4 w-3/4 bg-earth/10 animate-pulse" />
                <div className="h-3 w-1/2 bg-earth/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
