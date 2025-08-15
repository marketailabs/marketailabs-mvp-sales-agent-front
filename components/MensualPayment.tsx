import { Button } from "@/components/ui/button";
import { PaymentsPlan, SanityUser } from "@/types/globalContextTypes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTransition } from "react";
import { toast } from "sonner";

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

  const { credits, price, name, benefits, priceId, description, typeOfPlan } =
    payment;

  // Manejar el pago de créditos
  const handlePayCredit = async () => {
    startTransition(async () => {
      try {
        // Payload para el endpoint de checkout

        const body = {
          price,
          name,
          description,
          typeOfPlan, // "mensual" o "un solo pago"
          planCredits: credits, // cantidad de créditos que otorga el plan
          userData: {
            email: userData.email,
            userId: userData._id,
          },
          priceId: priceId ?? null, // priceId para subscripciones
        };

        // Llamar al endpoint de checkout
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // Manejar errores de la respuesta
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Checkout error: ${errText || res.status}`);
        }

        const data = await res.json(); // { url: session.url }
        const url = data.url;

        if (!url) throw new Error("No se recibió url de Stripe");

        // Redirigir al checkout de Stripe
        window.location.assign(url);
      } catch (error) {
        console.error("Error al crear sesión de checkout:", error);
        // Aquí podés mostrar un toast o UI de error
        toast.error("No se pudo iniciar el pago. Intentá nuevamente.");
      }
    });
  };

  if (accordion) {
    return (
      <AccordionItem value={payment._id} className="border rounded-xl mt-4">
        <AccordionTrigger className="p-4 flex justify-between items-center text-base font-medium">
          <span>{name}</span>
          <span className="w-full text-right">${price}/mes</span>
        </AccordionTrigger>
        <AccordionContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
          <p>{credits} créditos por mes</p>
          <ul className="list-disc pl-5 space-y-1">
            {benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="pt-2">
            <Button
              className="w-full"
              disabled={isPending}
              onClick={handlePayCredit}
            >
              Elegir {name}
            </Button>
          </div>
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
        <p className="text-base font-medium mt-2">${price}/mes</p>
      </div>

      {/* Beneficios */}
      <ul className="flex-1 list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-4">
        {benefits.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>

      {/* Botón */}
      {payment._id === userData.plan?._id ? (
        <Button className="w-full mt-auto" disabled>
          Actualmente activo
        </Button>
      ) : (
        <Button
          className="w-full mt-auto"
          disabled={isPending}
          onClick={handlePayCredit}
        >
          Elegir {name}
        </Button>
      )}
    </div>
  );
};
