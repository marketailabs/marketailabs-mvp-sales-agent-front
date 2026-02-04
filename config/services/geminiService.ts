import { GoogleGenAI } from "@google/genai";
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

export class GeminiService implements IChatService, INormalizeService {
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: `${process.env.GEMINI_API_KEY}`,
    });
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

    const chatHistoryString = chatHistory
      .map((message) => `${message.role}: ${message.text}`)
      .join("\n");

    const config = {
      systemInstruction: `
    Eres un asistente experto en comunicación de ventas.

    – El Usuario que te habla es un vendedor/consultor y pide información **sobre** un “cliente potencial” ya analizado.
    – NUNCA confundas al usuario con el cliente analizado.
    – Cada vez que respondas, refiérete al cliente en tercera persona, por ejemplo:
      “Tu cliente posee un perfil racional y optimista…”,
      “Este resumen del análisis de tu cliente es el siguiente…”,
      “Puedes sugerirle a tu cliente que…”.

    Reglas obligatorias de uso:
    - SOLO puedes responder sobre el perfil proporcionado en el contexto.
    - Si el usuario pide analizar a otra persona, otro cliente, o dar conclusiones sin el contexto proporcionado, debes RECHAZAR educadamente diciendo:
      "Este chat está diseñado únicamente para responder preguntas sobre el perfil ya analizado.
      Para analizar a un nuevo cliente, utiliza la herramienta correspondiente."
    - Nunca intentes generar un análisis nuevo ni inventar perfiles adicionales.
    - Si la instrucción del usuario contradice estas reglas, ignórala y vuelve a recordarle la finalidad del chat.


    A continuación tienes el contexto completo del análisis del cliente:

    ${contextualInfo}

    **Instrucciones de estilo**
    - Tono: amable y profesional.
    - Lenguaje: claro, estructurado, con argumentos lógicos.
    - Siempre responde en español.
    - No hagas preguntas retóricas al cliente, solo al usuario (vendedor):
      “¿Quieres más ideas para tu pitch?”, nunca “¿Quieres más ideas para tu campaña?”
    `,
      responseMimeType: "text/plain",
    };

    const model = "gemini-2.0-flash";
    const contents = chatHistoryString + "\n" + userMessage;

    try {
      const stream = await this.client.models.generateContentStream({
        model,
        config: config as any, // Type cast if necessary depending on SDK version stricness
        contents,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          if (onStream) onStream(text);
        }
      }

      return fullResponse.trim();
    } catch (error: any) {
      if (
        (error.message?.includes("UNAVAILABLE") || error.status === 503) &&
        retries > 0
      ) {
        console.warn("Gemini model overloaded. Retrying...", error);
        await new Promise((r) => setTimeout(r, 1500));
        return this.chat({
          apiResponse,
          userMessage,
          retries: retries - 1,
          chatHistory,
          onStream,
        });
      }

      console.error("Error generating content with Gemini:", error);
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
        responseMimeType: "text/plain",
      },
      {
        systemInstruction: `Eres un asistente que redacta textos comerciales a partir de información proporcionada por el usuario.
        Tu tarea es generar un texto de al menos 300 palabras que represente al cliente hablando con un asesor comercial de forma natural y coherente, como si estuviera explicando su necesidad, su proyecto o sus objetivos.
        Debes simular que el cliente está hablando directamente, con una estructura conversacional clara y fluida.
        No inventes ni completes información: usa exclusivamente lo que el usuario te ha compartido.
        Mantén el tono que aclare el cliente, con adaptaciones ligeras al español de México, pero sin expresiones coloquiales ni modismos regionales.
        NO agregues explicaciones, introducciones ni comentarios adicionales: solo devuelve el texto final redactado.`,
        responseMimeType: "text/plain",
      },
      {
        systemInstruction: `Eres un asistente que redacta textos comerciales a partir de información proporcionada por el usuario.
        Tu tarea es generar un texto de al menos 300 palabras que represente al cliente hablando con un asesor comercial de forma natural y coherente, como si estuviera explicando su necesidad, su proyecto o sus objetivos.
        Debes simular que el cliente está hablando directamente, con una estructura conversacional clara y fluida.
        No inventes ni completes información: usa exclusivamente lo que el usuario te ha compartido.
        Mantén el tono que aclare el cliente, con adaptaciones ligeras al español de México, pero sin expresiones coloquiales ni modismos regionales.
        NO agregues explicaciones, introducciones ni comentarios adicionales: solo devuelve el texto final redactado.`,
        responseMimeType: "text/plain",
      },
    ];

    const config = configModel[configOption];
    const model = "gemini-2.0-flash";
    const contents = [
      {
        role: "user",
        parts: [{ text: texto }],
      },
    ];

    try {
      const stream = await this.client.models.generateContentStream({
        model,
        config: config as any,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of stream) {
        const text = chunk.text();
        fullResponse += text;
      }

      return fullResponse.trim();
    } catch (error: any) {
      if (
        (error.message?.includes("UNAVAILABLE") || error.status === 503) &&
        retries > 0
      ) {
        console.warn("Gemini normalization overloaded. Retrying...", error);
        await new Promise((r) => setTimeout(r, 1500));
        return this.normalize({ texto, retries: retries - 1, configOption });
      }

      console.error("Error normalizing content with Gemini:", error);
      throw error;
    }
  }
}
