"use server";

import { auth } from "@/auth";
import { getSanityUser } from "@/sanity/lib/User/UserCredits";
import { prisma } from "@/lib/prisma";

export async function getSanityUserAction(email: string) {
  try {
    const user = await getSanityUser(email);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el usuario de Sanity");
  }
}

// Obtener los chats del usuario autenticado
export async function getChatsAction(email: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  const chats = await prisma.chat.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return chats;
}

// Cambiar el título de un chat
export async function changeTitleAction(id: string, title: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  // 1) Validar que el usuario sea el propietario del chat
  const chat = await prisma.chat.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!chat) {
    throw new Error("No tienes permisos para cambiar el título de este chat");
  }

  // 2) Actualizar el título del chat
  await prisma.chat.update({
    where: { id, userId: session.user.id },
    data: { title },
  });

  return { success: true };
}

// Borrar un chat
export async function deleteChatAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("No estás autenticado");
  }

  // 1) Validar que el usuario sea el propietario del chat
  const chat = await prisma.chat.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!chat) {
    throw new Error("No tienes permisos para eliminar este chat");
  }

  // 2) Eliminar el chat
  await prisma.chat.delete({
    where: { id, userId: session.user.id },
  });

  return { success: true };
}
