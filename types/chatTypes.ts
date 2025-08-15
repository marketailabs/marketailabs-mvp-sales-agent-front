import { Chat } from "@/lib/prismaClient";

export type ChatType = Chat;

export type ApiResponse = {
  actitud: { negativa: number; positiva: number; resultado: string };
  perfilConsumidor: string;
  enviado: string;
  sesgoVerbal: {
    sesgo: string;
    conteo: Record<string, number>;
    tiempoVerbalDetectado: string;
  };
  recomendacion: string;
  interpretacion: string;
  nivelEmocional: string;
  materialSugerido: {
    tipo: string;
    materiales: string[];
    descripcion: string;
  };
};

export type ChatMessageJson = {
  role: "USER" | "AI";
  text: string;
};

export type ChatMessageDb = {
  id: string;
  chatId: string;
  content: ChatMessageJson;
  createdAt: Date;
};
