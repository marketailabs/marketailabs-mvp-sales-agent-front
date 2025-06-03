"use server";

import { messageSchema, type MessageSchemaType } from "@/lib/zodSchema";
import runChat from "@/config/gemini";
import baseUrl from "@/lib/baseUrl";
import {
  subtractUserCredit,
  verifyUserCredits,
} from "@/sanity/lib/User/UserCredits";

export async function sendMessage(data: MessageSchemaType) {
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
    // 3) Normalizar con Gemini
    const prompt = `${mensaje}`;
    const textoNormalizado = await runChat(prompt);

    console.log("textoNormalizado", textoNormalizado);

    // 4) Enviar al backend con texto limpio
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: textoNormalizado,
        email: email.trim().toLowerCase(),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Error al procesar la solicitud en el servidor"
      );
    }

    // 5) Restar crédito solo si todo salió bien
    const updatedUser = await subtractUserCredit(user._id);

    return {
      ...(await res.json()),
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
