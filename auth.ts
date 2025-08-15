/**
 * Configuración de NextAuth para autenticación con Google y Prisma Adapter
 * para persistencia de datos en supabase
 * @returns Configuración de NextAuth
 */

import authConfig from "@/auth.config";

import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Configuración de NextAuth
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
