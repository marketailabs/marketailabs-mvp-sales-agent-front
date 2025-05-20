"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { messageSchema, MessageSchemaType } from "../lib/zodSchema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "./ui/form";
import SendInputButton from "./SendInputButton";
import { Textarea } from "./ui/textarea";
import { Check } from "lucide-react";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { toast } from "sonner";
import { sendMessage } from "@/actions/sendMessageAction";

const FormSend = () => {
  const [isPending, startTransition] = useTransition();

  const defaultValues: MessageSchemaType = {
    email: "",
    texto: "",
  };

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = form.handleSubmit((values: MessageSchemaType) =>
    startTransition(async () => {
      try {
        await sendMessage(values);
        toast.success("Mensaje enviado correctamente");
        form.reset();
      } catch (err: Error | unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Error al enviar el mensaje");
        }
      }
    })
  );

  const { errors } = form.formState;

  const resetForm = () => {
    form.reset(defaultValues, {
      keepValues: false,
    });
  };

  const countWords = (text: string) => {
    const words = text.trim().split(/\s+/);
    return words.filter((word) => word.length > 0).length;
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-12">
        <FormField
          name="texto"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mb-1 text-base font-medium flex justify-between items-center font-inter">
                <span className="text-primary">Tu consulta</span>
                <span className="flex items-center gap-1 border border-black rounded-full px-2 py-1 text-sm text-primary shadow-lg bg-background">
                  {countWords(field.value) >= 300 ? (
                    <>
                      <Check className="size-4 text-green-500" />
                      300/300
                    </>
                  ) : (
                    `${countWords(field.value)}/300`
                  )}
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none h-52 text-sm shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)]"
                  placeholder="Escribe tu consulta aquí (300 palabras mínimo)..."
                  {...field}
                />
              </FormControl>
              {errors.texto && (
                <p className="text-red-500 text-sm mt-4">
                  {errors.texto.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <SendInputButton isSubmitting={isPending} resetForm={resetForm}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className="mb-1 text-base font-medium font-inter"
                >
                  <span className="text-primary">Correo Electronico</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full pr-24 rounded-full h-12 shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background"
                    {...field}
                  />
                </FormControl>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-4">
                    {errors.email.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </SendInputButton>
      </form>
    </Form>
  );
};

export default FormSend;
