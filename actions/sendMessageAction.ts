"use server";

import { messageSchema, type MessageSchemaType } from "@/lib/zodSchema";
import runChat from "@/config/gemini";
import {
  subtractUserCredit,
  verifyUserCredits,
} from "@/sanity/lib/User/UserCredits";

export async function sendMessage(
  data: MessageSchemaType,
  configOption: number
) {
  // 1) Validar con Zod
  const result = messageSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      Object.values(result.error.flatten().fieldErrors).flat().join(", ")
    );
  }

  // 2) Validar con Sanity que el usuario existe, el token sea correcto y que tenga créditos
  const { mensaje, email, token } = result.data;

  const user = await verifyUserCredits(email, token);

  try {
    // 3) Normalizar o Realizar una redacción de cliente con Gemini
    const prompt = `${mensaje}`;
    const textoEntregado = await runChat(prompt, 2, configOption);

    console.log("textoEntregado", textoEntregado);

    // 4) Enviar al backend con texto limpio
    const analyzeRes = await fetch(`${process.env.API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: textoEntregado,
        email: email.trim().toLowerCase(),
      }),
    });

    if (!analyzeRes.ok) {
      const errorData = await analyzeRes.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Error en el servicio externo: ${analyzeRes.statusText}`
      );
    }

    // 5) Restar crédito solo si todo salió bien
    const updatedUser = await subtractUserCredit(user._id);

    return {
      ...(await analyzeRes.json()),
      restCredit: updatedUser.credits,
    };
  } catch (error) {
    console.error("Error al enviar el mensaje sendMessageAction:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al procesar tu solicitud"
    );
  }
}
