"use client";

import { useForm } from "react-hook-form";
import {
  createMessageSchema,
  MessageSchemaType,
} from "../lib/zodSchemas/formAnalizeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "./ui/form";
import { SendInputButton } from "./SendInputButton";
import { Textarea } from "./ui/textarea";
import { Check } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/actions/sendMessageAction";
import { GetFormsQueryResult } from "@/sanity.types";
import { SpeechToText } from "./speechToText";
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/provider/GlobalContext";
import { useRouter } from "next/navigation";

type FormSendProps = {
  formSanity: GetFormsQueryResult;
  formOption?: number;
};

export const FormSend = ({ formSanity, formOption }: FormSendProps) => {
  const { getSanityUser, isLoggedIn, setOpenLoginModal, sanityUser, getChats } =
    useGlobalContext();
  const [isListening, setIsListening] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { fields } = formSanity[formOption ?? 0];

  const router = useRouter();

  // Obtener el campo de texto (textarea) y su validación
  const textareaField = fields?.find((field) => field.tipo === "textarea");
  const minWords = textareaField?.validacion
    ? Number(textareaField.validacion)
    : 100;

  // Crear el esquema con la validación dinámica
  const messageSchema = createMessageSchema({
    minWords,
    maxWords: 1500,
  });

  const defaultValues: MessageSchemaType = {
    mensaje: "",
  };

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: defaultValues,
  });

  // Envio del formulario a la API
  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      try {
        if (!isLoggedIn) {
          setOpenLoginModal(true);
          toast.error("Debes iniciar sesión para enviar mensajes");
          return;
        }

        let result;

        if (formOption === 0) {
          result = await sendMessage(values, 0, sanityUser);
        } else {
          result = await sendMessage(values, 1, sanityUser);
        }

        // Obtener los chats
        getChats();

        router.push(`/chat/${result.chatId}`);

        // Redirigir a la página de chat
        toast.success(`Análisis enviado correctamente! 🎉`, {
          description: `${result.restCredit} créditos restantes`,
        });

        getSanityUser();
      } catch (err: Error | unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Error al enviar el mensaje");
        }
      }
    })
  );

  // Validaciones del formulario
  const { errors } = form.formState;

  const resetForm = () => {
    form.reset(defaultValues, {
      keepValues: false,
    });
  };

  // Conteo de palabras
  const countWords = (text: string) => {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  };

  return (
    <div className="flex flex-col p-8 mx-auto w-full max-w-6xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <SendInputButton isSubmitting={isPending} resetForm={resetForm}>
            <FormField
              name="mensaje"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="mb-1 text-base font-medium flex justify-between items-center font-inter">
                    <span className="text-primary">{fields![0].titulo}</span>
                    <span className="flex items-center gap-1 border border-input dark:bg-input/30 rounded-full px-2 py-1 text-sm text-primary shadow-lg bg-background">
                      {countWords(field.value) >=
                      Number(fields![0].validacion) ? (
                        <>
                          <Check className="size-4 text-green-500" />
                          {fields![0].validacion}/{fields![0].validacion}
                        </>
                      ) : (
                        `${countWords(field.value)}/${fields![0].validacion}`
                      )}
                    </span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Textarea
                        className={cn(
                          "resize-none h-64 text-sm",
                          isListening && "animate-pulse"
                        )}
                        placeholder={fields![0].placeholder!}
                        {...field}
                      />
                    </FormControl>

                    {formOption! >= 1 && (
                      <SpeechToText
                        isListening={isListening}
                        setIsListening={setIsListening}
                        onText={(spokenText) =>
                          form.setValue(
                            "mensaje",
                            `${form.watch("mensaje")} ${spokenText}`,
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                      />
                    )}
                  </div>

                  {errors.mensaje && (
                    <p className="absolute bottom-0 text-red-500 text-sm mt-2">
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
