"use server";

import { auth } from "@/auth";
import { ApiResponse, ChatMessageJson } from "@/types/chatTypes";
import { chatSchema, ChatSchemaType } from "@/lib/zodSchemas/chatSchema";
import chatGemini from "@/config/chatGemini";
import { prisma } from "@/lib/prisma";

export async function chatAction(
  data: ChatSchemaType,
  apiResponse: ApiResponse,
  chatId: string
) {
  try {
    // 1) Verificar que el usuario esté autenticado
    const session = await auth();

    if (!session?.user) {
      throw new Error("No estás autenticado");
    }

    // obtenemos el id del usuario
    const userId = session.user.id!;

    // 2) Busca el chat existente. (O crea uno si fuese necesario)
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: true,
      },
    });

    if (!chat) throw new Error("Chat no encontrado");

    // 3) Verificar que el chat pertenezca al usuario
    if (chat.userId !== userId) throw new Error("Chat no encontrado");

    // 4) Validar con Zod
    const result = chatSchema.safeParse(data);
    if (!result.success) {
      throw new Error(
        Object.values(result.error.flatten().fieldErrors).flat().join(", ")
      );
    }

    // 5) Guarda el mensaje del usuario
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        content: {
          role: "USER",
          text: data.mensaje,
        },
      },
    });

    // 6) Llama a Gemini
    const aiResponse = await chatGemini({
      apiResponse,
      userMessage: data.mensaje,
      chatHistory: chat.messages as unknown as ChatMessageJson[],
      retries: 2,
    });

    // 7) Guarda la respuesta de la IA
    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        content: {
          role: "AI",
          text: aiResponse,
        },
      },
    });

    return aiResponse;
  } catch (error) {
    console.error("Error al enviar el mensaje chatAction:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar tu solicitud"
    );
  }
}

export async function fetchChatMessages(chatId: string) {
  const dbMessages = await prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });

  const chatHistory = dbMessages.map((msg) => ({
    role: (msg.content as ChatMessageJson).role.toLowerCase() as "user" | "IA",
    content: (msg.content as ChatMessageJson).text as string,
  }));

  return chatHistory;
}

export async function updateChatAction(chatId: string) {
  await prisma.chat.update({
    where: { id: chatId },
    data: { updatedAt: new Date() },
  });
}
