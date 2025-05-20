"use server";

import { messageSchema, type MessageSchemaType } from "@/lib/zodSchema";

export async function sendMessage(data: MessageSchemaType) {
  console.log("Datos recibidos del formulario:", data);

  // 1) Validar con Zod
  const result = messageSchema.safeParse(data);
  if (!result.success) {
    // Lanzar excepción para que Next capture como error 400
    throw new Error(
      Object.values(result.error.flatten().fieldErrors).flat().join(", ")
    );
  }
  const { texto } = result.data;

  // 2) Enviar a servicio externo
  try {
    const res = await fetch(
      "https://mvp-marketai-sales-agent.onrender.com/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto,
          // email: result.data.email
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error en el servicio externo: ${res.statusText}`
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar tu solicitud"
    );
  }
}
