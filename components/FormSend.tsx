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
import { GetFormsQueryResult } from "@/sanity.types";

type FormSendProps = {
  formSanity: GetFormsQueryResult;
  formOption?: number;
};

export const FormSend = ({ formSanity, formOption }: FormSendProps) => {
  const { fields } = formSanity[formOption ?? 0];

  const [isPending, startTransition] = useTransition();

  const defaultValues: MessageSchemaType = {
    email: "",
    mensaje: "",
    token: "",
  };

  const form = useForm<MessageSchemaType>({
    resolver: zodResolver(messageSchema),
    defaultValues: defaultValues,
  });

  // Envio del formulario a la API
  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      try {
        let result;

        if (formOption === 0) {
          result = await sendMessage(values, 0);
        } else {
          result = await sendMessage(values, 1);
        }

        toast.success(`Mensaje enviado correctamente! 🎉`, {
          description: `${result.restCredit} créditos restantes`,
        });
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
    <div className="flex flex-col p-8 mx-auto max-w-2xl lg:max-w-4xl">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="mensaje"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-1 text-base font-medium flex justify-between items-center font-inter">
                  <span className="text-primary">{fields![0].titulo}</span>
                  <span className="flex items-center gap-1 border border-black rounded-full px-2 py-1 text-sm text-primary shadow-lg bg-background">
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
                <FormControl>
                  <Textarea
                    className="resize-none h-52 text-sm shadow-[0px_4px_8px_1px_rgba(0,0,0,0.15)] 
      dark:shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background"
                    placeholder={fields![0].placeholder!}
                    {...field}
                  />
                </FormControl>
                {errors.mensaje && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.mensaje.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className="mb-1 text-base font-medium font-inter"
                >
                  <span className="text-primary">{fields![1].titulo}</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="email"
                    placeholder={fields![1].placeholder!}
                    className="w-full rounded-full h-12 shadow-[0px_4px_8px_1px_rgba(0,0,0,0.15)] 
      dark:shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background"
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

          <SendInputButton isSubmitting={isPending} resetForm={resetForm}>
            <FormField
              name="token"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="token"
                    className="mb-1 text-base font-medium font-inter"
                  >
                    <span className="text-primary">{fields![2].titulo}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="token"
                      placeholder={fields![2].placeholder!}
                      className="w-full pr-24 rounded-full h-12 shadow-[0px_4px_8px_1px_rgba(0,0,0,0.15)] 
      dark:shadow-[0px_8px_10px_2px_rgba(0,0,0,0.25)] bg-background"
                      {...field}
                    />
                  </FormControl>
                  {errors.token && (
                    <p className="text-red-500 text-sm mt-4">
                      {errors.token.message}
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
