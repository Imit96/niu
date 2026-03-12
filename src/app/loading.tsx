export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-sand px-6 text-center">
      <div className="relative w-16 h-16 mb-4">
        {/* Simple elegant CSS spinner */}
        <div className="absolute inset-0 border-2 border-earth/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-earth rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-earth/60 text-xs font-serif uppercase tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  );
}
