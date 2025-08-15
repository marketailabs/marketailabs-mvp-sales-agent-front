import { z } from "zod";

// Función para validar el número de palabras
const validateWordCount = (
  value: string,
  minWords: number,
  maxWords: number
) => {
  const wordCount = value
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
  return wordCount >= minWords && wordCount <= maxWords;
};

export const createMessageSchema = (
  options: { minWords?: number; maxWords?: number } = {}
) => {
  const { minWords = 100, maxWords = 1500 } = options;

  return z.object({
    mensaje: z
      .string()
      .min(1, "Por favor, ingresa tu consulta")
      .refine((value) => validateWordCount(value, minWords, maxWords), {
        message: `El mensaje debe tener entre ${minWords} y ${maxWords} palabras`,
      }),
  });
};

// Esquema por defecto (mantiene la compatibilidad con el código existente)
export const messageSchema = createMessageSchema();
export type MessageSchemaType = z.infer<typeof messageSchema>;
