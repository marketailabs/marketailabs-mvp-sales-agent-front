import { GoogleGenAI } from "@google/genai";

async function runChat(
  texto: string,
  retries = 2,
  configOption: number
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_API_KEY}`,
  });

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
      Tu tarea es generar un texto de al menos 250 palabras que represente al cliente hablando con un asesor comercial de forma natural y coherente, como si estuviera explicando su necesidad, su proyecto o sus objetivos.
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
    // Intenta generar el contenido
    const stream = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullResponse = "";

    // Recorre el stream y concatena el contenido
    for await (const chunk of stream) {
      fullResponse += chunk.text;
    }

    return fullResponse.trim();
  } catch (error: Error | unknown) {
    const isUnavailable =
      error instanceof Error && error.message.includes("UNAVAILABLE");

    // Si el error es UNAVAILABLE, intenta de nuevo
    if (isUnavailable && retries > 0) {
      console.warn("El modelo está sobrecargado. Reintentando...");
      await new Promise((r) => setTimeout(r, 1500));
      return runChat(texto, retries - 1, configOption);
    }

    // Si el error no es UNAVAILABLE, lanza el error
    console.error("Error al generar contenido:", error);
    throw error instanceof Error
      ? error
      : new Error(
          "Ocurrió un error al procesar tu solicitud. Intentalo más tarde."
        );
  }
}

export default runChat;
