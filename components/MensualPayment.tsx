import { Button } from "@/components/ui/button";
import { PaymentsPlan, SanityUser } from "@/types/globalContextTypes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

// Accordion (mobile)s
export const MensualPayment = ({
  payment,
  accordion,
  userData,
}: {
  payment: PaymentsPlan;
  accordion: boolean;
  userData: SanityUser;
}) => {
  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);

  const { credits, price, name, benefits, priceId, description } = payment;

  // Manejar el pago de créditos
  const handleAssignFreePlan = async () => {
    startTransition(async () => {
      try {
        const freePlanId = "9080a077-b426-478d-9e08-1eeb5fe9ca07";
        await fetch("/api/assign-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
            planId: freePlanId,
            setCreditsFromPlan: false,
          }),
        });
        toast.success("Ahora estás en el Plan Gratuito");
      } catch (err) {
        console.error(err);
        toast.error("No se pudo actualizar al plan gratuito.");
      }
    });
  };

  const handlePaySubscription = async () => {
    // Si es plan gratuito, abrimos alert-dialog
    if (!priceId) {
      setOpenDialog(true);
      return;
    }

    // Plan con precio: pasar por Stripe
    startTransition(async () => {
      try {
        const body = {
          name,
          description,
          planCredits: credits,
          userData: {
            email: userData.email,
            userId: userData._id,
          },
          priceId,
        };

        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Checkout error");
        const data = await res.json();
        if (!data.url) throw new Error("No se recibió url de Stripe");
        window.location.assign(data.url);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo iniciar el pago.");
      }
    });
  };

  const AlertFreePlan = () => {
    return (
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar cambio a plan gratuito
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de cambiar al Plan Gratuito. Esto reemplazará tu
              plan actual y créditos. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOpenDialog(false);
                handleAssignFreePlan();
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  if (accordion) {
    return (
      <AccordionItem value={payment._id} className="border rounded-xl mt-4">
        <AccordionTrigger className="p-4 flex justify-between items-center text-base font-medium">
          <span>{name}</span>
          {priceId && (
            <span className="w-full text-right">MXN {price}/mes</span>
          )}
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
          <p>{priceId && <>{credits} créditos / mes</>}</p>
          <ul className="list-disc pl-5 space-y-1">
            {benefits && benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <div className="pt-2">
            <Button
              className="w-full mt-2"
              disabled={isPending || payment._id === userData.plan?._id}
              onClick={handlePaySubscription}
            >
              {payment._id === userData.plan?._id
                ? "Actualmente activo"
                : `Elegir ${name}`}
            </Button>
          </div>

          {/* AlertDialog solo para plan gratuito */}
          {!priceId && <AlertFreePlan />}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <div className="border rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="mb-4 space-y-1">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">
          {priceId && <>{credits} créditos / mes</>}
        </p>
        {priceId && (
          <p className="text-base font-medium mt-2">MXN {price}/mes</p>
        )}
      </div>

      {/* Beneficios */}
      <ul className="flex-1 list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
        {benefits && benefits.map((b) => <li key={b}>{b}</li>)}
      </ul>

      {/* Botón */}
      <Button
        className="w-full mt-2"
        disabled={isPending || payment._id === userData.plan?._id}
        onClick={handlePaySubscription}
      >
        {payment._id === userData.plan?._id
          ? "Actualmente activo"
          : `Elegir ${name}`}
      </Button>

      {/* AlertDialog solo para plan gratuito */}
      {!priceId && <AlertFreePlan />}
    </div>
  );
};
