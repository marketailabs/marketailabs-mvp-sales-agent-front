import { z } from "zod";

export const messageSchema = z.object({
  email: z
    .string()
    .email("Por favor, ingresa un correo electrónico válido")
    .min(1, "Por favor, ingresa tu correo electrónico"),
  texto: z
    .string()
    .min(1, "Por favor, ingresa tu consulta")
    .refine(
      (value) => {
        const wordCount = value
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length;
        return wordCount >= 200 && wordCount <= 1500;
      },
      {
        message: "El mensaje debe tener entre 200 y 1500 palabras",
      }
    ),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
