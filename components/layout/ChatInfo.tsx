import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  AlertCircle,
  Brain,
  BookOpen,
  Lightbulb,
  MessageSquareMoreIcon,
} from "lucide-react";
import { EditChatTitle } from "@/components/EditChatTitle";

import { ApiResponse, ChatType } from "@/types/chatTypes";

interface ChatInfoProps {
  chat: ChatType;
  currentChat: {
    id: string;
    title: string | null;
    updatedAt: Date;
  };
}

export const ChatInfo = ({ chat, currentChat }: ChatInfoProps) => {
  const response = chat.apiResponse as ApiResponse;

  return (
    <section className="container mx-auto px-4 max-w-6xl w-full space-y-4">
      <EditChatTitle
        chatId={currentChat.id}
        initialTitle={currentChat.title || "Sin título"}
      />

      {/* Mensaje del usuario */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="mensaje">
          <AccordionTrigger className="text-base font-semibold">
            <h2 className="flex items-center gap-2">
              <MessageSquareMoreIcon /> Tu mensaje
            </h2>
          </AccordionTrigger>
          <AccordionContent className="bg-muted p-4 rounded-lg">
            <p className="text-muted-foreground">{chat.userMessage}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="single"
        defaultValue="resumen"
        collapsible
        className="w-full"
      >
        <AccordionItem value="resumen">
          <AccordionTrigger className="text-base font-semibold">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Brain className="size-6" /> Resumen del Perfil
            </h2>
          </AccordionTrigger>
          <AccordionContent className="bg-muted p-4 rounded-lg">
            <article className="space-y-4">
              {/* Nivel emocional, actitud y sesgo verbal. */}
              <div className="flex flex-wrap gap-4 gap-y-2 justify-between items-center">
                <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
                  Actitud:
                  <span className="text-muted-foreground font-normal text-sm">
                    {response.actitud.resultado}
                  </span>
                </h3>
                <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
                  Nivel emocional:
                  <span className="text-muted-foreground font-normal text-sm">
                    {response.nivelEmocional}
                  </span>
                </h3>
                <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
                  Sesgo verbal:
                  <span className="text-muted-foreground font-normal text-sm">
                    {response.sesgoVerbal.sesgo}
                  </span>
                </h3>
              </div>

              <div className="space-y-8">
                {/* Interpretación */}
                <div>
                  <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="size-5" /> Interpretación
                  </h2>
                  <p className="text-muted-foreground">
                    {response.interpretacion}
                  </p>
                </div>

                {/* Recomendación */}
                <div>
                  <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="size-5" /> Recomendación
                  </h2>
                  <p className="text-muted-foreground">
                    {response.recomendacion}
                  </p>
                </div>

                {/* Material sugerido */}
                <div>
                  <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="size-5" /> Material sugerido:{" "}
                    {response.materialSugerido.tipo}
                  </h2>

                  <p className="text-muted-foreground mb-2">
                    {response.materialSugerido.descripcion}
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    {response.materialSugerido.materiales.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
