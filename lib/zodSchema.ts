import { z } from "zod";

export const messageSchema = z.object({
  email: z
    .string()
    .email("Por favor, ingresa un correo electrónico válido")
    .min(1, "Por favor, ingresa tu correo electrónico"),
  mensaje: z
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
  token: z
    .string()
    .min(1, "Por favor, ingresa un token")
    .max(22, "El token debe tener un máximo de 20 caracteres"),
});

export type MessageSchemaType = z.infer<typeof messageSchema>;
