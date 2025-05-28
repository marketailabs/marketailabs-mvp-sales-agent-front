import { GoogleGenAI } from "@google/genai";

async function runChat(texto: string, retries = 2): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: `${process.env.GEMINI_API_KEY}`,
  });

  const config = {
    systemInstruction: `Sos un asistente que normaliza textos escritos por usuarios. 
Tu tarea es devolver el mismo texto pero sin errores ortográficos, gramaticales ni abreviaciones. 
NO agregues explicaciones ni comentarios, solo devolvé el texto corregido. 
Si el texto ya está correctamente escrito, devolvelo sin cambios.`,
    responseMimeType: "text/plain",
  };

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
      return runChat(texto, retries - 1);
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
