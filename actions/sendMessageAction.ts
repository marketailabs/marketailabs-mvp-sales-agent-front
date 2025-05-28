"use server";

import { messageSchema, type MessageSchemaType } from "@/lib/zodSchema";
import runChat from "@/config/gemini";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `${process.env.NEXT_PUBLIC_BASE_URL}`;

export async function sendMessage(data: MessageSchemaType) {
  console.log("Datos recibidos del formulario sendMessageAction:", data);

  // 1) Validar con Zod
  const result = messageSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      Object.values(result.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  const { texto } = result.data;

  try {
    // 2) Normalizar con Gemini
    const prompt = `${texto}`;
    const textoNormalizado = await runChat(prompt);

    console.log(
      "Enviando al backend con texto limpio sendMessageAction:",
      textoNormalizado
    );

    // 3) Enviar al backend con texto limpio
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: textoNormalizado,
        // email: result.data.email
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error al procesar la solicitud en el servidor"
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Error al enviar el mensaje sendMessageAction:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar tu solicitud"
    );
  }
}
