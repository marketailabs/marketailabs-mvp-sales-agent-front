import { Button } from "@/components/ui/button";
import { PaymentsPlan } from "@/types/globalContextTypes";
import { useTransition } from "react";
import { toast } from "sonner";

// Componente para comprar créditos
export const CreditPayment = ({
  payment,
  userData,
}: {
  payment: PaymentsPlan;
  userData: {
    _id: string;
    email: string;
    credits: number;
  };
}) => {
  const [isPending, startTransition] = useTransition();
  const {
    credits: planCredits,
    price,
    name,
    description,
    _id,
    typeOfPlan,
  } = payment;
  const { credits: userCredits, email, _id: userId } = userData;

  // Manejar el pago de créditos
  const handlePayCredit = async () => {
    startTransition(async () => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          price: price,
          name: name,
          description: description,
          _id: _id,
          typeOfPlan: typeOfPlan,
          planCredits: planCredits,
          userData: {
            userCredits,
            email,
            userId,
          },
        }),
      });

      if (!response.ok) {
        toast.error("Error al procesar el pago");
        return;
      }

      const data = await response.json();
      window.location.href = data.url;
    });
  };

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-base font-medium">{planCredits} créditos</p>
        <p className="text-sm text-muted-foreground">Pago único</p>
      </div>
      <Button variant="outline" onClick={handlePayCredit} disabled={isPending}>
        ${price}
      </Button>
    </div>
  );
};
