import NextAuth from "next-auth";
import { authConfig } from "../auth.config";
import { NextResponse } from "next/server";
import { ROLES } from "./lib/constants";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Admin routes — require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session || session.user?.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Salon Dashboard routes — require SALON or ADMIN role
  if (pathname.startsWith("/salon/dashboard")) {
    if (!session || (session.user?.role !== ROLES.SALON && session.user?.role !== ROLES.ADMIN)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // Account routes — require authenticated session
  if (pathname.startsWith("/account")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/salon/dashboard/:path*"],
};
