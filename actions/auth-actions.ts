"use server";

import { signIn } from "@/auth";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/zodSchemas/authSchema";
import { sendResetPasswordEmail } from "@/lib/mail";
import { nanoid } from "nanoid";
import { AuthError } from "next-auth";
import { z } from "zod";

import bcrypt from "bcryptjs";

const MAX_ACCOUNTS_PER_IP = 3;

/**
 * Función para hacer el login con los datos del formulario utilizando next-auth
 * @param values - Datos del formulario
 * @returns - Resultado del login
 */
export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    // Haacemos el login con los datos del formulario utilizando next-auth
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};

/**
 * Función para registrar un usuario
 * @param values - Datos del formulario
 * @returns - Resultado del registro
 */
export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    // Parseamos los datos y verificamos si son válidos con zod
    const { success, data } = registerSchema.safeParse(values);

    if (!success) {
      return {
        error: "Datos inválidos",
      };
    }

    // Capturamos la IP del usuario
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

    // Buscar cuántas cuentas se crearon desde esta IP en las últimas 24h
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

    const intentos = await prisma.registroIntento.count({
      where: {
        ip,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (intentos >= MAX_ACCOUNTS_PER_IP) {
      return {
        error: "Demasiadas cuentas creadas desde esta IP. Intenta mañana.",
      };
    }

    // Verificamos si el usuario ya existe
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // Si el usuario ya existe, devolver un error
    if (user) {
      return {
        error: "El usuario ya existe",
      };
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    // En caso de que todo este correcto, creamos el usuario
    await prisma.$transaction([
      prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: passwordHash,
        },
      }),
      prisma.registroIntento.create({
        data: { ip },
      }),
    ]);

    // Hacemos el login con los datos del formulario utilizando next-auth
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.log(error);

    // Si hay un error, lo mostramos al usuario
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Error 500" };
  }
};

/**
 * Función para enviar un correo de restablecimiento de contraseña
 * @param values - Datos del formulario
 * @returns Resultado de la acción
 */
export const forgotPasswordAction = async (
  values: z.infer<typeof forgotPasswordSchema>
) => {
  try {
    const validated = forgotPasswordSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Datos inválidos" };
    }

    const { email } = validated.data;

    // Verificamos que el usuario exista
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "No existe un usuario con ese email" };
    }

    // Eliminamos tokens anteriores
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Creamos el nuevo token
    const token = nanoid();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // Enviamos el email con el token
    const response = await sendResetPasswordEmail(email, token);

    if (!response.success) {
      return { error: "No se pudo enviar el correo" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error en forgotPasswordAction:", error);
    return { error: "Error inesperado, intenta más tarde" };
  }
};

/**
 * Función para restablecer la contraseña de un usuario
 * @param token - Token de verificación
 * @param password - Nueva contraseña
 * @returns Resultado de la acción
 */
export const resetPasswordAction = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  try {
    // Parseamos los datos y verificamos si son válidos con zod
    const validated = resetPasswordSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Datos inválidos" };
    }

    // Desestructuramos los datos
    const { password, confirmPassword } = validated.data;

    // Verificamos si las contraseñas coinciden
    if (password !== confirmPassword) {
      return { error: "Las contraseñas no coinciden" };
    }

    // Buscamos el token en la base de datos
    const token = await prisma.passwordResetToken.findUnique({
      where: {
        token: values.token,
      },
    });

    // Si el token no existe, devolvemos un error
    if (!token) {
      return { error: "Token inválido" };
    }

    // Si el token ha expirado, devolvemos un error
    if (token.expires < new Date()) {
      return { error: "Token expirado" };
    }

    // Buscamos el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: token.userId },
    });

    if (!user) {
      return { error: "Usuario no encontrado" };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizamos la contraseña del usuario
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Eliminamos el token
    await prisma.passwordResetToken.delete({
      where: { id: token.id },
    });

    return { success: true };
  } catch (error) {
    return { error: "Error al restablecer la contraseña" };
  }
};

export const verifyToken = async (token: string) => {
  const tokenData = await prisma.passwordResetToken.findUnique({
    where: {
      token: token,
    },
  });

  if (!tokenData) {
    return { success: false, error: "Token inválido" };
  }

  if (tokenData.expires < new Date()) {
    return { success: false, error: "Token expirado" };
  }

  return { success: true, error: undefined };
};
