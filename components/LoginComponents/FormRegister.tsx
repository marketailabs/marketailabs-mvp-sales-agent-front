"use client";

import { z } from "zod";
import { registerSchema } from "@/lib/zodSchemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/actions/auth-actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

/**
 * Formulario de registro
 * @returns Formulario de registro con email, nombre, contraseña y confirmar contraseña
 */

export const FormRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      // Limpiamos el error
      setError(null);

      // Llamamos a la acción de registro
      const result = await registerAction(data);

      // Si hay un error, lo seteamos para mostrarlo al usuario
      if (result.error) {
        setError(result.error);
      } else {
        redirect("/");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="name"
                className="mb-1 text-base font-medium font-inter"
              >
                <span className="text-primary">Nombre</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                htmlFor="password"
                className="mb-1 text-base font-medium font-inter"
              >
                <span className="text-primary">Contraseña</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <FormMessage className="text-red-500">{error}</FormMessage>}

        <Button size="lg" className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Cargando...
            </>
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>
    </Form>
  );
};
