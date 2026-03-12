"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarLinkProps {
  href: string;
  name: string;
  children: React.ReactNode;
}

export function AdminSidebarLink({ href, name, children }: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-3 px-4 py-2.5 rounded-md transition-colors text-sm font-medium",
        isActive
          ? "bg-cream/15 text-cream"
          : "text-cream/60 hover:bg-cream/10 hover:text-cream"
      )}
    >
      {children}
      <span>{name}</span>
    </Link>
  );
}
