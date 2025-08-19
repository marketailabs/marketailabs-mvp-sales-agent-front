"use client";

import { cn, formatResponse } from "@/lib/utils";
import { SendInputButton } from "../SendInputButton";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useEffect, useRef, useState, useTransition } from "react";
import { SpeechToText } from "../speechToText";
import { chatSchema, ChatSchemaType } from "@/lib/zodSchemas/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse, ChatType } from "@/types/chatTypes";
import { chatAction2, fetchChatMessages } from "@/actions/chatActions";
import { toast } from "sonner";
import { useGlobalContext } from "@/provider/GlobalContext";
import { ScrollArea } from "../ui/scroll-area";

export const ChatWithIA = ({
  chat,
  chatId,
}: {
  chat: ChatType;
  chatId: string;
}) => {
  const { handleUpdateChatDate } = useGlobalContext();
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "IA"; content: string }[]
  >([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  // Ref al div interno que hace scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch de mensajes al cargar el chat
  useEffect(() => {
    const fetchMessages = async () => {
      const chatMessages = await fetchChatMessages(chatId);
      setChatHistory(
        chatMessages.map(
          (message: { role: "user" | "IA"; content: string }) => ({
            role: message.role === "user" ? "user" : "IA",
            content: message.content,
          })
        )
      );
      setMessagesLoaded(true); // marcamos que terminó de cargar
    };
    fetchMessages();
  }, [chatId]);

  // Scroll al final después de que los mensajes iniciales hayan cargado
  useEffect(() => {
    if (!messagesLoaded) return;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory, messagesLoaded]);

  const defaultValues: ChatSchemaType = { mensaje: "" };
  const form = useForm<ChatSchemaType>({
    resolver: zodResolver(chatSchema),
    defaultValues,
  });
  const { errors } = form.formState;

  const resetForm = () => {
    form.reset(defaultValues, { keepValues: false });
  };

  const onSubmit = form.handleSubmit((values) => {
    const { mensaje } = values;

    // Agregamos mensaje del usuario
    setChatHistory((prev) => [...prev, { role: "user", content: mensaje }]);

    startTransition(async () => {
      try {
        const result = await chatAction2(
          values,
          chat.apiResponse as ApiResponse,
          chatId
        );

        // Agregamos mensaje de la IA
        setChatHistory((prev) => [...prev, { role: "IA", content: result }]);

        resetForm();
        handleUpdateChatDate(chatId);
      } catch (err: Error | unknown) {
        if (err instanceof Error) toast.error(err.message);
        else toast.error("Error al enviar el mensaje");
      }
    });
  });

  return (
    <div className="container mx-auto mt-8 w-full max-w-6xl px-4 space-y-8">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Preguntale a la IA</h2>
        <p className="text-muted-foreground">
          Preguntale a la IA sobre el perfil de tu cliente
        </p>
      </div>

      {/* Chat history */}
      <ScrollArea className="h-[500px] px-4">
        <div ref={scrollContainerRef} className="flex flex-col gap-4">
          {chatHistory.map((message, index) => {
            if (message.role === "user") {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 items-end justify-end ml-16"
                >
                  <p className="font-medium text-muted-foreground">Tú</p>
                  <p className="text-sm bg-muted p-3 rounded-lg rounded-tr-none">
                    {message.content}
                  </p>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col gap-2 mr-16">
                <p className="font-medium text-muted-foreground">Profiler</p>
                <div
                  className="text-sm p-3 bg-muted rounded-lg rounded-tl-none"
                  dangerouslySetInnerHTML={{
                    __html: formatResponse(message.content),
                  }}
                />
              </div>
            );
          })}

          {isPending && (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-muted-foreground">Profiler</p>
              <p className="text-sm p-2 rounded-md animate-pulse">...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Formulario */}
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SendInputButton isSubmitting={isPending} resetForm={resetForm}>
            <FormField
              name="mensaje"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="hidden">Mensaje</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className={cn(
                          "text-sm rounded-full pr-32",
                          isListening && "animate-pulse"
                        )}
                        placeholder="Escribe tu mensaje"
                        {...field}
                      />
                    </FormControl>

                    <SpeechToText
                      isListening={isListening}
                      setIsListening={setIsListening}
                      onText={(spokenText) =>
                        form.setValue(
                          "mensaje",
                          `${form.watch("mensaje")} ${spokenText}`,
                          { shouldValidate: true }
                        )
                      }
                    />
                  </div>

                  {errors.mensaje && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.mensaje.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </SendInputButton>
        </form>
      </Form>
    </div>
  );
};
