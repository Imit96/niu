import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  // @ts-expect-error adapter typings mismatch with Prisma v6
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    ...authConfig.callbacks,

    async jwt({ token, user, trigger }) {
      // On initial sign-in: seed token from user record
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.id = user.id ?? token.sub ?? "";
        token.passwordVersion =
          (user as { passwordVersion?: number }).passwordVersion ?? 0;
        return token;
      }

      // On subsequent refreshes: validate that the password hasn't been reset
      // since this token was issued. This invalidates sessions across devices
      // when the user resets their password.
      if (trigger !== "signIn" && token.id) {
        const freshUser = await prisma.user.findFirst({
          where: { id: token.id as string },
          select: { passwordVersion: true, role: true },
        });

        if (!freshUser) {
          // User deleted — invalidate session
          return { ...token, invalid: true };
        }

        if (freshUser.passwordVersion !== (token.passwordVersion as number)) {
          // Password was reset — invalidate this token
          return { ...token, invalid: true };
        }

        // Keep role in sync (e.g. after admin promotes a user)
        token.role = freshUser.role;
      }

      return token;
    },

    session({ session, token }) {
      // If the token was invalidated, return a guest session so middleware
      // redirects to sign-in on the next protected-route visit.
      if ((token as { invalid?: boolean }).invalid) {
        return { ...session, user: undefined as never };
      }

      if (session.user) {
        session.user.role = (token.role as string | undefined) ?? "CUSTOMER";
        session.user.id = (token.id as string | undefined) ?? token.sub ?? "";
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY,
      from: "hello@origonae.com",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            passwordVersion: user.passwordVersion,
          };
        }
        return null;
      },
    }),
  ],
});
