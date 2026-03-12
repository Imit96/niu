export default function CartLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-24 pb-16 px-6 max-w-[1440px] mx-auto w-full">
        {/* Title */}
        <div className="h-12 w-96 bg-earth/10 animate-pulse mx-auto mb-12" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-8">
            {/* Column headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-earth/20">
              <div className="col-span-6 h-3 w-16 bg-earth/10 animate-pulse" />
              <div className="col-span-3 h-3 w-16 bg-earth/10 animate-pulse mx-auto" />
              <div className="col-span-3 h-3 w-12 bg-earth/10 animate-pulse ml-auto" />
            </div>

            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-earth/10 pb-6">
                  <div className="col-span-1 md:col-span-6 flex items-center space-x-6">
                    <div className="w-24 h-32 bg-stone animate-pulse border border-ash/30 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-40 bg-earth/10 animate-pulse" />
                      <div className="h-3 w-16 bg-earth/10 animate-pulse" />
                      <div className="h-3 w-12 bg-earth/10 animate-pulse mt-4" />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-3 flex justify-center">
                    <div className="h-10 w-28 bg-stone animate-pulse border border-ash/30" />
                  </div>
                  <div className="col-span-1 md:col-span-3 flex justify-end">
                    <div className="h-5 w-20 bg-earth/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-cream border border-earth/10 p-8 space-y-6">
              <div className="h-6 w-36 bg-earth/10 animate-pulse border-b border-earth/10 pb-4" />
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-earth/10 animate-pulse" />
                  <div className="h-4 w-20 bg-earth/10 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-earth/10 animate-pulse" />
                  <div className="h-4 w-28 bg-earth/10 animate-pulse" />
                </div>
              </div>
              <div className="pt-4 border-t border-earth/10 flex justify-between">
                <div className="h-5 w-12 bg-earth/10 animate-pulse" />
                <div className="h-5 w-24 bg-earth/10 animate-pulse" />
              </div>
              <div className="h-12 w-full bg-earth/20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
