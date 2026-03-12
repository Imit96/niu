import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // On sign-in: populate the token from the user object
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.id = user.id ?? token.sub ?? "";
        token.passwordVersion = (user as { passwordVersion?: number }).passwordVersion ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "CUSTOMER";
        session.user.id = (token.id as string | undefined) ?? token.sub ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
