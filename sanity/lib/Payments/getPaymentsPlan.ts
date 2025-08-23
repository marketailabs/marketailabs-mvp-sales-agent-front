import { client } from "../client";
import { sanityFetch } from "../live";
import { defineQuery } from "groq";

// Buscar todos los planes
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
      price_id,
    }
  `);

  const paymentsPlanData = await sanityFetch({ query: getPaymentsPlanQuery });
  return paymentsPlanData.data;
}

// Buscar el plan por id
export async function getPaymentsPlanById(id: string | null) {
  if (!id) return null;
  const plan = await client.fetch(
    `*[_type == "plansPayment" && _id == $id][0]{_id, name, price, credits, price_id}`,
    { id }
  );
  return plan;
}

/**
 * Buscar plan por product id (price_id...)
 */
export async function getPaymentsPlanByProductId(productId: string | null) {
  if (!productId) return null;
  const plan = await client.fetch(
    `*[_type == "plansPayment" && price_id == $productId][0]{_id, name, price, credits, price_id}`,
    { productId }
  );
  return plan;
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
    setCreditsFromPlan?: boolean;
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

/**
 *  Asigna el plan gratuito a un usuario
 * @param userId _id del usuario
 * @returns  documento actualizado
 */
export async function assignFreePlanToUser(userId: string) {
  const freePlanId = process.env.NEXT_PUBLIC_FREE_PLAN_ID;
  if (!freePlanId) return null;

  const freePlanDoc = await client.fetch(
    `*[_type == "plansPayment" && _id == $id][0]{_id, credits}`,
    { id: freePlanId }
  );

  const patch = client.patch(userId).set({
    plan: { _type: "reference", _ref: freePlanId },
    credits: freePlanDoc?.credits ?? 0,
    appliedInvoiceIds: [],
  });

  patch.unset([
    "subscriptionId",
    "subscriptionPriceId",
    "subscriptionStatus",
    "customerId",
  ]);

  const updated = await patch.commit({ autoGenerateArrayKeys: true });
  return updated;
}

/**
 * Setea el valor de applyingFreePlan para un usuario
 * @param userId _id del usuario
 * @param value booleano para aplicar o quitar el plan gratuito
 * @returns { success: boolean, user?: any, error?: string }
 */
export async function setApplyingFreePlan(userId: string, value: boolean) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const updatedUser = await client
      .patch(userId)
      .set({ applyingFreePlan: value })
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, user: updatedUser };
  } catch (err: any) {
    console.error("Error en setApplyingFreePlan:", err);
    return { success: false, error: err?.message ?? "Error updating user" };
  }
}

/**
 * Setea el valor de changePlan para un usuario
 * @param userId _id del usuario
 * @param value booleano para aplicar o quitar el plan gratuito
 * @returns { success: boolean, user?: any, error?: string }
 */
export async function setApplyingChangePlan(userId: string, value: boolean) {
  if (!userId) {
    return { success: false, error: "User ID is required" };
  }

  try {
    const updatedUser = await client
      .patch(userId)
      .set({ changePlan: value })
      .commit({ autoGenerateArrayKeys: true });

    return { success: true, user: updatedUser };
  } catch (err: any) {
    console.error("Error en setApplyingChangePlan:", err);
    return { success: false, error: err?.message ?? "Error updating user" };
  }
}
