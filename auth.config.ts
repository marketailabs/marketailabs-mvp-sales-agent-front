/**
 * Exportar la configuración de NextAuth para autenticación con Google, credenciales y Prisma Adapter
 * @returns Configuración de NextAuth
 */

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "@/lib/zodSchemas/authSchema";
import prisma from "@/lib/prisma";
import { createSanityUser } from "@/sanity/lib/User/createSanityUser";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: async (profile) => {
        // Creamos el usuario en Sanity si no existe en la base de datos
        const sanityUser = await createSanityUser({
          name: profile.name,
          email: profile.email,
        });

        if (sanityUser.success) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          };
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    Credentials({
      authorize: async (credentials) => {
        const { success, data } = loginSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Credenciales inválidas");
        }

        // Verificamos si el usuario existe en la base de datos
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // Verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        // Creamos el usuario en Sanity si no existe en la base de datos
        const sanityUser = await createSanityUser({
          name: user.name,
          email: user.email,
        });

        if (sanityUser.success) {
          return user;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
