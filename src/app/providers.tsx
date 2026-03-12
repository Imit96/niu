"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import type { Session } from "next-auth";

export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    <SessionProvider session={session}>
      {children}
      <Toaster 
        position="top-right" 
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          style: {
            background: "#FAF7F2", // bg-cream
            color: "#4A3F35", // text-earth
            border: "1px solid rgba(74, 63, 53, 0.1)", // border-earth/10
          },
        }} 
      />
    </SessionProvider>
  );
}
