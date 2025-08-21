"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/provider/GlobalContext";
import { PaymentsPlan } from "@/types/globalContextTypes";
import { MensualPayment } from "../MensualPayment";

export const PaymentDialog = () => {
  const { data: session } = useSession();
  const { openPaymentModal, setOpenPaymentModal, paymentsPlan, sanityUser } =
    useGlobalContext();

  if (!session) return null;

  // Filtrar y ordenar los planes mensuales por créditos (descendente)
  const mensualPayment = paymentsPlan
    .filter((payment) => payment.typeOfPlan === "mensual")
    .sort((a, b) => a.credits - b.credits);

  return (
    <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
      <DialogContent className="sm:max-w-5xl p-6 sm:p-8 rounded-2xl shadow-xl bg-background">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Actualizar plan
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Elige una opción para continuar. Los créditos no son acumulables y
            pueden ser utilizados dentro del periodo del mes corriente.
          </p>
        </DialogHeader>

        <Tabs defaultValue="paquetes" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="suscripciones">Planes</TabsTrigger>
          </TabsList>

          {/* Planes con Accordion en mobile, info expandida en lg */}
          <TabsContent value="suscripciones" className="grid gap-4">
            {/* Mobile: Acordeón */}
            <div className="lg:hidden">
              <Accordion type="single" collapsible>
                {mensualPayment?.map((payment: PaymentsPlan) => (
                  <MensualPayment
                    key={payment._id}
                    payment={payment}
                    accordion={true}
                    userData={sanityUser}
                  />
                ))}
              </Accordion>
            </div>

            {/* Desktop: Tarjetas extendidas */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {mensualPayment?.map((payment: PaymentsPlan) => (
                <MensualPayment
                  key={payment._id}
                  payment={payment}
                  accordion={false}
                  userData={sanityUser}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
