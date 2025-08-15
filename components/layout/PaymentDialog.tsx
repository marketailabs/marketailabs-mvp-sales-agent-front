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
// import { CreditPayment } from "../CreditPayment";

export const PaymentDialog = () => {
  const { data: session } = useSession();
  const { openPaymentModal, setOpenPaymentModal, paymentsPlan, sanityUser } =
    useGlobalContext();

  if (!session) return null;

  // Filtrar los planes mensuales
  const mensualPayment = paymentsPlan.filter(
    (payment) => payment.typeOfPlan === "mensual"
  );

  // Filtrar los planes de pago de un solo pago (unico pago)
  // const unicoPagoPayment = paymentsPlan.filter(
  //   (payment) => payment.typeOfPlan === "un solo pago"
  // );

  return (
    <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
      <DialogContent className="sm:max-w-5xl p-6 sm:p-8 rounded-2xl shadow-xl bg-background">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Comprar Créditos
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Elegí una opción para continuar
          </p>
        </DialogHeader>

        <Tabs defaultValue="paquetes" className="w-full">
          <TabsList className="w-full mb-4">
            {/* {unicoPagoPayment.length > 0 && (
              <TabsTrigger value="paquetes">Paquetes</TabsTrigger>
            )} */}
            <TabsTrigger value="suscripciones">Planes</TabsTrigger>
          </TabsList>

          {/* Paquetes */}
          {/* {unicoPagoPayment.length > 0 && (
            <TabsContent value="paquetes" className="grid lg:grid-cols-3 gap-4">
              {unicoPagoPayment?.map((payment: PaymentsPlan) => (
                <CreditPayment
                  key={payment._id}
                  payment={payment}
                  userData={sanityUser}
                />
              ))}
            </TabsContent>
          )} */}

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
