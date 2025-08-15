import { z } from "zod";

export const chatSchema = z.object({
  mensaje: z.string().min(1, "El Mensaje es requerido"),
});

export type ChatSchemaType = z.infer<typeof chatSchema>;
