export default function CheckoutLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Side */}
          <div className="space-y-12">
            <div className="space-y-2">
              <div className="h-9 w-40 bg-earth/10 animate-pulse" />
              <div className="h-4 w-48 bg-earth/10 animate-pulse" />
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <div className="h-5 w-48 bg-earth/10 animate-pulse border-b border-earth/20 pb-2" />
              <div className="h-12 w-full bg-stone animate-pulse border border-ash/30" />
            </div>

            {/* Shipping */}
            <div className="space-y-4">
              <div className="h-5 w-40 bg-earth/10 animate-pulse border-b border-earth/20 pb-2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-stone animate-pulse border border-ash/30" />
                <div className="h-12 bg-stone animate-pulse border border-ash/30" />
              </div>
              <div className="h-12 w-full bg-stone animate-pulse border border-ash/30" />
              <div className="h-12 w-full bg-stone animate-pulse border border-ash/30" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-12 bg-stone animate-pulse border border-ash/30" />
                <div className="h-12 bg-stone animate-pulse border border-ash/30" />
                <div className="h-12 bg-stone animate-pulse border border-ash/30" />
              </div>
              <div className="h-12 w-full bg-stone animate-pulse border border-ash/30" />
            </div>

            <div className="h-14 w-full bg-earth/20 animate-pulse" />
          </div>

          {/* Summary Side */}
          <div className="bg-cream/50 p-8 border border-earth/10 h-fit space-y-6">
            <div className="h-5 w-36 bg-earth/10 animate-pulse border-b border-earth/20 pb-4" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-stone animate-pulse border border-ash/30" />
                    <div className="h-4 w-28 bg-earth/10 animate-pulse" />
                  </div>
                  <div className="h-4 w-16 bg-earth/10 animate-pulse" />
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-earth/10">
              <div className="flex gap-2">
                <div className="flex-1 h-12 bg-stone animate-pulse border border-ash/30" />
                <div className="w-20 h-12 bg-earth/20 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-earth/10">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-earth/10 animate-pulse" />
                <div className="h-4 w-20 bg-earth/10 animate-pulse" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-earth/10 animate-pulse" />
                <div className="h-4 w-16 bg-earth/10 animate-pulse" />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-earth/10">
              <div className="h-6 w-12 bg-earth/10 animate-pulse" />
              <div className="h-6 w-24 bg-earth/10 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
