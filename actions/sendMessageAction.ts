"use server";

import {
  messageSchema,
  type MessageSchemaType,
} from "@/lib/zodSchemas/formAnalizeSchema";
import normalizarGemini from "@/config/normalizarGemini";
import { subtractUserCredit } from "@/sanity/lib/User/UserCredits";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function sendMessage(
  data: MessageSchemaType,
  configOption: number,
  sanityUser: {
    credits: number;
    email: string;
    token: string;
    _id: string;
  },
) {
  // 1) Verificar que el usuario esté autenticado
  const session = await auth();

  if (!session?.user) {
    throw new Error("No estás autenticado");
  }

  // obtenemos el id del usuario
  const userId = session.user.id!;

  // 2) Validar con Zod
  const result = messageSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      Object.values(result.error.flatten().fieldErrors).flat().join(", "),
    );
  }

  // 3) Validar con Sanity que el usuario existe, el token sea correcto y que tenga créditos
  const { mensaje } = result.data;

  // 3.1) Validar que el usuario tenga créditos
  if (sanityUser.credits <= 0) {
    throw new Error("No tienes créditos disponibles");
  }

  try {
    // 4) Normalizar o Realizar una redacción de cliente con Gemini
    const prompt = `${mensaje}`;
    const textoEntregado = await normalizarGemini(prompt, 2, configOption);

    // 5) Enviar al backend con texto limpio
    const analyzeRes = await fetch(`${process.env.API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: textoEntregado,
        email: sanityUser.email.trim().toLowerCase(),
      }),
    });

    if (!analyzeRes.ok) {
      const errorData = await analyzeRes.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error en el servicio externo: ${analyzeRes.statusText}`,
      );
    }

    const analyzeData = await analyzeRes.json();

    // 6) Restar crédito solo si todo salió bien
    const updatedUser = await subtractUserCredit(sanityUser._id);

    // 7) Crear un chat en la base de datos
    const chat = await prisma.chat.create({
      data: {
        userId: userId,
        userMessage: mensaje,
        apiResponse: analyzeData,
        title: "Análisis de Perfil - " + new Date().toLocaleDateString(),
      },
    });

    // 8) Devolver todo + el ID del chat para redirigir a la página de chat
    return {
      restCredit: updatedUser.credits,
      chatId: chat.id,
    };
  } catch (error) {
    console.error("Error al enviar el mensaje sendMessageAction:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar tu solicitud",
    );
  }
}
