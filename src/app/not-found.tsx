import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-sand px-6 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif text-earth uppercase tracking-widest">404</h1>
        <h2 className="text-xl font-serif text-earth uppercase tracking-widest">Page Not Found</h2>
      </div>
      <p className="text-earth/70 max-w-md mx-auto text-sm font-light">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="pt-4">
        <Link href="/">
          <Button variant="secondary" className="border-earth text-earth hover:bg-earth hover:text-cream">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
