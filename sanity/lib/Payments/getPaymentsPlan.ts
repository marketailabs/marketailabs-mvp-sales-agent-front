import { client } from "../client";
import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getPaymentsPlan() {
  const getPaymentsPlanQuery = defineQuery(`
    *[_type == "plansPayment"] | order(_createdAt asc){
      _id,
      name,
      price,
      description,
      typeOfPlan,
      benefits,
      credits,
      priceId,
    }
  `);

  const paymentsPlanData = await sanityFetch({ query: getPaymentsPlanQuery });
  return paymentsPlanData.data;
}

/**
 * Asigna/actualiza el plan del usuario en Sanity.
 * - userId: _id del user
 * - planId: _id del documento plan en plansPayment
 * - opts: opcionales: subscriptionId, subscriptionPriceId, subscriptionStatus, customerId
 * - options: setCreditsFromPlan -> si true, reemplaza los credits del user con los del plan
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
    invoiceId?: string | null;
    setCreditsFromPlan?: boolean; // reemplaza credits con los del plan
    customerId?: string | null;
  }
) {
  const {
    subscriptionId = null,
    subscriptionPriceId = null,
    subscriptionStatus = null,
    invoiceId = null,
    setCreditsFromPlan = false,
    customerId = null,
  } = opts || {};

  // Traer plan si hace falta setear credits
  let planDoc: { _id: string; credits: number } | null = null;
  if (planId && setCreditsFromPlan) {
    planDoc = await client.fetch(
      `*[_type == "plansPayment" && _id == $id][0]{_id, credits}`,
      { id: planId }
    );
  }

  const patch = client.patch(userId).setIfMissing({ appliedInvoiceIds: [] });

  // referencia al plan
  if (planId) {
    patch.set({ plan: { _type: "reference", _ref: planId } });
  }

  if (subscriptionId) patch.set({ subscriptionId });
  if (subscriptionPriceId) patch.set({ subscriptionPriceId });
  if (subscriptionStatus) patch.set({ subscriptionStatus });
  if (customerId) patch.set({ customerId });

  // credits -> se reemplazan (no se suman nunca)
  if (setCreditsFromPlan && planDoc && typeof planDoc.credits === "number") {
    patch.set({ credits: planDoc.credits });
  }

  // registrar invoiceId si viene
  if (invoiceId) {
    patch.append("appliedInvoiceIds", [invoiceId]);
  }

  const updated = await patch.commit({ autoGenerateArrayKeys: true });
  return updated;
}

// Obtener un plan de pago por su priceId (para Stripe webhooks)
export async function getPaymentsPlanByPriceId(priceId: string) {
  if (!priceId) return null;
  const plan = await client.fetch(
    `*[_type == "plansPayment" && priceId == $priceId][0]{_id, name, price, credits, priceId}`,
    { priceId }
  );

  console.log("getPaymentsPlanByPriceId -> plan:", plan);

  return plan;
}
