import { ApiResponse, ChatMessageJson } from "@/types/chatTypes";
import OpenAI from "openai";

export type chatGptPropsType = {
  apiResponse: ApiResponse;
  userMessage: string;
  retries?: number;
  chatHistory: ChatMessageJson[];
  onStream?: (chunk: string) => void; // callback opcional para actualizar UI en vivo
};

// Construir contexto
function buildContextFromApiResponse(apiResponse: ApiResponse): string {
  return `
CONTEXTO DEL ANÁLISIS DE PERFIL:

**Perfil del Usuario:**
- Tipo de consumidor: ${apiResponse.perfilConsumidor}
- Nivel emocional: ${apiResponse.nivelEmocional}
- Actitud: ${apiResponse.actitud.resultado}

**Interpretación del Perfil:**
${apiResponse.interpretacion}

**Sesgo Verbal Detectado:**
- Tipo: ${apiResponse.sesgoVerbal?.sesgo}
- Tiempo verbal: ${apiResponse.sesgoVerbal?.tiempoVerbalDetectado}

**Recomendaciones de Comunicación:**
${apiResponse.recomendacion}

**Material Sugerido:**
- Tipo: ${apiResponse.materialSugerido?.tipo}
- Descripción: ${apiResponse.materialSugerido?.descripcion}

---
IMPORTANTE: Utiliza esta información para personalizar tus respuestas según el perfil analizado.
`;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatGpt({
  apiResponse,
  userMessage,
  retries = 2,
  chatHistory,
  onStream,
}: chatGptPropsType): Promise<string> {
  const contextualInfo = buildContextFromApiResponse(apiResponse);

  // Mensajes para la sesión de chat
  const messages = [
    {
      role: "system" as const,
      content: `
Eres un asistente experto en comunicación de ventas. 
Solo responde sobre el perfil proporcionado en el contexto. No inventes información.
${contextualInfo}

Instrucciones:
- Responde en español, profesional y claro.
- No hagas análisis adicionales ni inventes datos.
- Solo responde sobre el cliente analizado.
      `,
    },
    // Filtrar mensajes inválidos y tipado seguro
    ...chatHistory
      .filter((m): m is ChatMessageJson => !!m.role && !!m.text)
      .map((m) => ({
        role: m.role.toLowerCase() === "ai" ? "assistant" : ("user" as const),
        content: m.text,
      })),
    { role: "user" as const, content: userMessage },
  ];

  try {
    const stream = await openai.chat.completions.stream({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
      max_tokens: 800,
    });

    let fullResponse = "";

    // Streaming con tipado seguro
    for await (const event of stream) {
      // Solo procesamos los eventos de tipo "delta"
      const choice = event.choices?.[0];
      const delta = choice?.delta?.content;
      if (delta) {
        fullResponse += delta;
        if (onStream) onStream(delta); // actualización local en tiempo real
      }
    }

    return fullResponse.trim();
  } catch (error: unknown) {
    const isUnavailable =
      error instanceof Error && error.message.includes("UNAVAILABLE");

    if (isUnavailable && retries > 0) {
      console.warn("El modelo está sobrecargado. Reintentando...");
      await new Promise((r) => setTimeout(r, 1500));
      return chatGpt({
        apiResponse,
        userMessage,
        retries: retries - 1,
        chatHistory,
        onStream,
      });
    }

    console.error("Error al generar contenido:", error);
    throw error instanceof Error
      ? error
      : new Error(
          "Ocurrió un error al procesar tu solicitud. Inténtalo más tarde."
        );
  }
}

export default chatGpt;
