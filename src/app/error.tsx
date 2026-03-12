"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-sand px-6 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif text-earth uppercase tracking-widest">Something went wrong</h2>
      </div>
      <p className="text-earth/70 max-w-md mx-auto text-sm font-light">
        We apologize for the inconvenience. Our team has been notified of the issue.
      </p>
      <div className="pt-4 flex items-center justify-center gap-4">
        <Button 
          onClick={() => reset()} 
          className="bg-earth text-cream hover:bg-earth/90 uppercase tracking-widest text-xs"
        >
          Try Again
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => window.location.href = '/'}
          className="border-earth text-earth hover:bg-earth hover:text-cream uppercase tracking-widest text-xs"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
