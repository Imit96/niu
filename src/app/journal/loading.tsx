export default function JournalLoading() {
  return (
    <div className="flex flex-col w-full bg-sand min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center border-b border-earth/20 bg-cream">
        <div className="h-14 w-80 bg-earth/10 animate-pulse mx-auto mb-6" />
        <div className="h-5 w-96 bg-earth/10 animate-pulse mx-auto" />
        <div className="h-5 w-72 bg-earth/10 animate-pulse mx-auto mt-2" />
      </section>

      {/* Featured Article Skeleton */}
      <section className="py-24 px-6 border-b border-earth/20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="aspect-[4/3] w-full bg-stone animate-pulse border border-ash/30" />
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="h-3 w-20 bg-bronze/20 animate-pulse" />
              <div className="h-3 w-28 bg-earth/10 animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-10 w-full bg-earth/10 animate-pulse" />
              <div className="h-10 w-4/5 bg-earth/10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-earth/10 animate-pulse" />
              <div className="h-4 w-full bg-earth/10 animate-pulse" />
              <div className="h-4 w-3/4 bg-earth/10 animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-earth/10 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-24 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="h-6 w-48 bg-earth/10 animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] w-full bg-stone animate-pulse border border-ash/30" />
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-bronze/20 animate-pulse" />
                  <div className="h-3 w-24 bg-earth/10 animate-pulse" />
                </div>
                <div className="h-7 w-full bg-earth/10 animate-pulse" />
                <div className="h-7 w-2/3 bg-earth/10 animate-pulse" />
                <div className="space-y-1">
                  <div className="h-3 w-full bg-earth/10 animate-pulse" />
                  <div className="h-3 w-5/6 bg-earth/10 animate-pulse" />
                  <div className="h-3 w-4/5 bg-earth/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
