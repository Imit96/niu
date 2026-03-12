export default function RitualsLoading() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-sand">
      <section className="pt-32 pb-16 px-6 bg-earth text-cream text-center">
        <div className="w-64 h-12 bg-cream/10 animate-pulse mx-auto mb-6"></div>
        <div className="w-96 h-6 bg-cream/10 animate-pulse mx-auto mt-4 px-4"></div>
      </section>

      <section className="py-24 px-6 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-6">
              <div className="aspect-square w-full bg-stone animate-pulse border border-ash/30" />
              <div className="text-center space-y-3">
                <div className="h-4 w-1/3 bg-earth/10 animate-pulse mx-auto"></div>
                <div className="h-8 w-2/3 bg-earth/10 animate-pulse mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
