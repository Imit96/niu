import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials"; 
import bcrypt from "bcryptjs";
import { prisma } from "./src/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // @ts-expect-error adapter tyings mismatch with new Prisma v6
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    // Placeholder - usually EmailProvider or Google is here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
         if (!credentials?.email || !credentials?.password) {
            return null;
         }
         
         const user = await prisma.user.findFirst({
           where: { email: credentials.email as string }
         });

         if (!user || !user.password) {
           return null;
         }

         const passwordsMatch = await bcrypt.compare(
           credentials.password as string,
           user.password
         );
         
         if (passwordsMatch) {
            return { id: user.id, name: user.name, email: user.email, role: user.role };
         }
         return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
