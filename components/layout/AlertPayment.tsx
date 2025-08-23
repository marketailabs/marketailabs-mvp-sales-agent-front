// AlertPayment.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

interface AlertPaymentProps {
  subscriptionStatus: string | null;
}

export function AlertPayment({ subscriptionStatus }: AlertPaymentProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (subscriptionStatus === "past_due") {
      setOpen(true);
    }
  }, [subscriptionStatus]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md rounded-2xl shadow-lg border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
            🚨 Aviso por falta de pago
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-gray-700 dark:text-gray-200">
            Detectamos una <span className="font-semibold">falta de pago</span>{" "}
            en tu cuenta. Por favor realiza el pago para seguir utilizando la
            aplicación.
            <br />
            También puedes cambiar al plan gratuito si no deseas continuar con
            tu suscripción.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            Más tarde
          </AlertDialogCancel>
          <AlertDialogAction className="rounded-xl bg-red-600 text-white hover:bg-red-700">
            Ir a pagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
