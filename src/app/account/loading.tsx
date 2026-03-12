export default function AccountLoading() {
  return (
    <div className="bg-cream border border-earth/10 p-8 md:p-12 space-y-12 shadow-sm min-h-[500px]">
      <div className="flex justify-between items-center border-b border-earth/20 pb-4">
        <div className="h-8 w-48 bg-earth/10 animate-pulse" />
        <div className="h-9 w-28 bg-earth/10 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-earth/10 animate-pulse" />
            <div className="h-6 w-48 bg-earth/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
