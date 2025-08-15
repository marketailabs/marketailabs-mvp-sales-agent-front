import { client } from "../client";
import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getPaymentsPlan() {
  const getPaymentsPlanQuery =
    defineQuery(`*[_type == "plansPayment"] | order(_createdAt asc){
    _id,
    name,
    price,
    description,
    typeOfPlan,
    benefits,
    credits,
    priceId,
  }`);

  const paymentsPlanData = await sanityFetch({ query: getPaymentsPlanQuery });
  return paymentsPlanData.data;
}

/**
 * Asigna/actualiza el plan del usuario en Sanity.
 * - userId: _id del user
 * - planId: _id del documento plan en plansPayment
 * - opts: opcionales: subscriptionId, subscriptionPriceId, subscriptionStatus
 * - options: setCreditsFromPlan -> si true, sincroniza los credits del plan al usuario (replace)
 *
 * Retorna el documento actualizado.
 */
export async function assignPlanToUser(
  userId: string,
  planId: string,
  opts?: {
    subscriptionId?: string | null;
    subscriptionPriceId?: string | null;
    subscriptionStatus?: string | null;
    invoiceId?: string | null; // optional to mark applied invoice
    setCreditsFromPlan?: boolean; // si querés reemplazar credits con los del plan
  }
) {
  const {
    subscriptionId = null,
    subscriptionPriceId = null,
    subscriptionStatus = null,
    invoiceId = null,
    setCreditsFromPlan = false,
  } = opts || {};

  // Traer plan para, opcionalmente, leer sus créditos
  const planDoc = await client.fetch(
    `*[_type == "plansPayment" && _id == $id][0]{_id, credits}`,
    {
      id: planId,
    }
  );

  const patch = client.patch(userId).setIfMissing({ appliedInvoiceIds: [] });

  // set reference plan
  patch.set({ plan: { _type: "reference", _ref: planId } });

  if (subscriptionId) patch.set({ subscriptionId });
  if (subscriptionPriceId) patch.set({ subscriptionPriceId });
  if (subscriptionStatus) patch.set({ subscriptionStatus });

  // si queremos sincronizar credits desde plan (reemplaza)
  if (setCreditsFromPlan && planDoc && typeof planDoc.credits === "number") {
    patch.set({ credits: planDoc.credits });
  }

  // si viene invoiceId, lo agregamos para idempotencia
  if (invoiceId) {
    patch.append("appliedInvoiceIds", [invoiceId]);
  }

  const updated = await patch.commit({ autoGenerateArrayKeys: true });
  return updated;
}

// Obtener un plan de pago por su ID de precio
// (útil para webhooks de Stripe)
export async function getPaymentsPlanByPriceId(priceId: string) {
  if (!priceId) return null;
  const plan = await client.fetch(
    `*[_type == "plansPayment" && priceId == $priceId][0]{_id, name, price, credits, priceId}`,
    { priceId }
  );
  return plan;
}
