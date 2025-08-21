import { Button } from "@/components/ui/button";
import { PaymentsPlan, SanityUser } from "@/types/globalContextTypes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FreePlanAlert } from "./FreePlanAlert";
import { useGlobalContext } from "@/provider/GlobalContext";

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
  const { getSanityUser } = useGlobalContext();
  const [isPending, startTransition] = useTransition();
  const [openDialog, setOpenDialog] = useState(false);

  const { credits, price, name, benefits, price_id, description } = payment;

  // Manejar el pago de créditos
  const handleAssignFreePlan = async () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/assign-free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
          }),
        });

        if (!res.ok) {
          throw new Error("No se pudo actualizar al plan gratuito.");
        }

        await getSanityUser();

        toast.success("Ahora estás en el Plan Gratuito", {
          description: "Los cambios pueden tardar en aplicarse",
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo actualizar al plan gratuito.");
      }
    });
  };

  const handlePaySubscription = async () => {
    // Si es plan gratuito, abrimos alert-dialog
    if (!price_id) {
      setOpenDialog(true);
      return;
    }

    // Plan con precio: pasar por Stripe
    startTransition(async () => {
      try {
        const body = {
          price_id,
          planCredits: credits,
          userData: {
            email: userData.email,
            userId: userData._id,
          },
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

  if (accordion) {
    return (
      <AccordionItem value={payment._id} className="border rounded-xl mt-4">
        <AccordionTrigger className="p-4 flex justify-between items-center text-base font-medium">
          <p className="w-full">{name}</p>

          {price_id && (
            <span className="w-full text-right">MXN {price}/mes</span>
          )}
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
          <p>{credits} créditos / mes</p>

          <p className="text-base text-muted-foreground">{description}</p>

          <ul className="list-disc pl-5 space-y-1">
            {benefits && benefits.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <div className="pt-2">
            <Button
              className="w-full mt-2"
              disabled={isPending || payment._id === userData.plan?._id}
              onClick={handlePaySubscription}
            >
              {isPending
                ? "Actualizando..."
                : payment._id === userData.plan?._id
                ? "Actualmente activo"
                : `Elegir ${name}`}
            </Button>
          </div>

          {/* AlertDialog solo para plan gratuito */}
          {!price_id && (
            <FreePlanAlert
              handleFreePlan={handleAssignFreePlan}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />
          )}
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
          {credits} créditos / mes
        </p>
        {price_id && (
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
        {isPending
          ? "Actualizando..."
          : payment._id === userData.plan?._id
          ? "Actualmente activo"
          : `Elegir ${name}`}
      </Button>

      {/* AlertDialog solo para plan gratuito */}
      {!price_id && (
        <FreePlanAlert
          handleFreePlan={handleAssignFreePlan}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
    </div>
  );
};
