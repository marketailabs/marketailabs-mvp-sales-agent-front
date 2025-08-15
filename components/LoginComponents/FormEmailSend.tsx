"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/zodSchemas/authSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, MailCheck } from "lucide-react";
import { forgotPasswordAction } from "@/actions/auth-actions";

export const FormEmailSend = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema as any),
    defaultValues: {
      email: "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      // Limpiamos el error y el success
      setSuccess(false);
      setError(null);

      // Llamamos a la acción de enviar el correo de restablecimiento de contraseña
      const result = await forgotPasswordAction(data);

      // Si hay un error, lo seteamos para mostrarlo al usuario
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="bg-green-500/10 p-4 rounded-full mb-4">
          <MailCheck className="size-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          ¡Correo enviado con éxito!
        </h1>
        <p className="text-sm dark:text-neutral-300">
          Te hemos enviado un enlace para restablecer tu contraseña. Revisá tu
          bandeja de entrada o spam.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="email"
                className="mb-1 text-base font-medium font-inter"
              >
                <span className="text-primary">Email</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <FormMessage className="text-red-500">{error}</FormMessage>}

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando correo...
            </>
          ) : (
            "Enviar correo"
          )}
        </Button>
      </form>
    </Form>
  );
};
