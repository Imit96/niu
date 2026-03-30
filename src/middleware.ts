import createMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { authConfig } from "../auth.config";
import { routing } from "@/i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROLES } from "./lib/constants";

// Edge-safe auth config (no Prisma/bcrypt)
const { auth } = NextAuth(authConfig);
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user as { role?: string } | undefined;

  // Admin routes — require ADMIN role, skip locale routing
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (user.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Salon dashboard — require SALON or ADMIN role
  if (pathname.startsWith("/salon/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== ROLES.SALON && user.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Account and checkout — require authentication
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!user) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req as NextRequest);
});

export const config = {
  // Match all public-facing routes but exclude:
  // - API routes (/api/*)
  // - Next.js internals (_next/*, _vercel/*)
  // - Static files with extensions (*.png, *.ico, etc.)
  // Note: /auth/* is intentionally included so intl locale handling runs for login/register
  // Note: /admin is intentionally included so auth checks run there
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
