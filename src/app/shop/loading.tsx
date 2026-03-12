export default function ShopLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <div className="w-64 h-12 bg-cream/10 animate-pulse mx-auto mb-6"></div>
        <div className="w-96 h-6 bg-cream/10 animate-pulse mx-auto mt-4 px-4"></div>
      </section>

      <section className="py-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4">
              <div className="aspect-[3/4] w-full bg-stone animate-pulse border border-ash/30"></div>
              <div className="h-4 w-1/4 bg-earth/10 animate-pulse mt-2"></div>
              <div className="h-6 w-3/4 bg-earth/10 animate-pulse"></div>
              <div className="h-3 w-full bg-earth/10 animate-pulse"></div>
              <div className="pt-4 flex justify-between justify-end">
                <div className="h-6 w-1/3 bg-earth/10 animate-pulse"></div>
              </div>
              <div className="h-12 w-full bg-earth/10 animate-pulse mt-4"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
