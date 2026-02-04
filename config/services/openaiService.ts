import OpenAI from "openai";
import { IChatService, INormalizeService } from "@/types/services";
import { ApiResponse, ChatMessageJson } from "@/types/chatTypes";

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

export class OpenAIService implements IChatService, INormalizeService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat({
    apiResponse,
    userMessage,
    retries = 2,
    chatHistory,
    onStream,
  }: {
    apiResponse: ApiResponse;
    userMessage: string;
    retries?: number;
    chatHistory: ChatMessageJson[];
    onStream?: (chunk: string) => void;
  }): Promise<string> {
    const contextualInfo = buildContextFromApiResponse(apiResponse);

    const messages: any[] = [
      {
        role: "system",
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
      ...chatHistory
        .filter((m) => !!m.role && !!m.text)
        .map((m) => ({
          role: m.role.toLowerCase() === "ai" ? "assistant" : "user",
          content: m.text,
        })),
      { role: "user", content: userMessage },
    ];

    try {
      const stream = await this.client.chat.completions.stream({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.2,
        max_tokens: 800,
      });

      let fullResponse = "";
      for await (const event of stream) {
        const choice = event.choices?.[0];
        const delta = choice?.delta?.content;
        if (delta) {
          fullResponse += delta;
          if (onStream) onStream(delta);
        }
      }
      return fullResponse.trim();
    } catch (error) {
      if (retries > 0) {
        console.warn("OpenAI error, retrying...", error);
        await new Promise((r) => setTimeout(r, 1500));
        return this.chat({
          apiResponse,
          userMessage,
          retries: retries - 1,
          chatHistory,
          onStream,
        });
      }
      console.error("Error generating content with OpenAI:", error);
      throw error;
    }
  }

  async normalize({
    texto,
    retries = 2,
    configOption,
  }: {
    texto: string;
    retries?: number;
    configOption: number;
  }): Promise<string> {
    const configModel = [
      {
        systemInstruction: `Eres un asistente que revisa textos escritos por usuarios y realiza correcciones ortotipográficas.
        Tu tarea es devolver el mismo texto revisado sin modificar la idea original pero sin errores ortográficos, gramaticales ni abreviaciones.
        NO agregues explicaciones ni comentarios, solo devuelve el texto corregido.
        Si el texto ya está correctamente escrito, no realices cambios.`,
      },
      {
        systemInstruction: `Eres un asistente que redacta textos comerciales a partir de información proporcionada por el usuario.
        Tu tarea es generar un texto de al menos 300 palabras que represente al cliente hablando con un asesor comercial de forma natural y coherente, como si estuviera explicando su necesidad, su proyecto o sus objetivos.
        Debes simular que el cliente está hablando directamente, con una estructura conversacional clara y fluida.
        No inventes ni completes información: usa exclusivamente lo que el usuario te ha compartido.
        Mantén el tono que aclare el cliente, con adaptaciones ligeras al español de México, pero sin expresiones coloquiales ni modismos regionales.
        NO agregues explicaciones, introducciones ni comentarios adicionales: solo devuelve el texto final redactado.`,
      },
      {
        systemInstruction: `Eres un asistente que redacta textos comerciales a partir de información proporcionada por el usuario.
        Tu tarea es generar un texto de al menos 300 palabras que represente al cliente hablando con un asesor comercial de forma natural y coherente, como si estuviera explicando su necesidad, su proyecto o sus objetivos.
        Debes simular que el cliente está hablando directamente, con una estructura conversacional clara y fluida.
        No inventes ni completes información: usa exclusivamente lo que el usuario te ha compartido.
        Mantén el tono que aclare el cliente, con adaptaciones ligeras al español de México, pero sin expresiones coloquiales ni modismos regionales.
        NO agregues explicaciones, introducciones ni comentarios adicionales: solo devuelve el texto final redactado.`,
      },
    ];

    const instruction = configModel[configOption]?.systemInstruction || "";

    try {
      const stream = await this.client.chat.completions.stream({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: texto },
        ],
        temperature: 0.2, // Kept consistent with chatGpt settings or default to low temp for normalization
        max_tokens: 4096, // Increased max tokens for long texts
      });

      let fullResponse = "";
      for await (const event of stream) {
        const choice = event.choices?.[0];
        const delta = choice?.delta?.content;
        if (delta) {
          fullResponse += delta;
        }
      }
      return fullResponse.trim();
    } catch (error) {
      if (retries > 0) {
        console.warn("OpenAI normalization error, retrying...", error);
        await new Promise((r) => setTimeout(r, 1500));
        return this.normalize({ texto, retries: retries - 1, configOption });
      }
      console.error("Error normalizing with OpenAI:", error);
      throw error;
    }
  }
}
