"use server";

import {
  assignPlanToUser,
  getPaymentsPlan,
  getPaymentsPlanByPriceId,
} from "@/sanity/lib/Payments/getPaymentsPlan";
import {
  addUserCredit,
  getSanityUser,
  getSanityUserById,
} from "@/sanity/lib/User/UserCredits";

// Obtener los precios de los planes
export const getPrices = async () => {
  try {
    const paymentsPlan = await getPaymentsPlan();

    return paymentsPlan;
  } catch (error) {
    console.error(error);
    return { error: "Error al obtener los precios" };
  }
};

// Añadir créditos al usuario
export const addCreditsToUser = async ({
  userId,
  planCredits,
  email,
}: {
  userId?: string;
  planCredits?: string | number;
  email?: string;
}) => {
  try {
    const amount = Number(planCredits || 0);
    if (isNaN(amount) || amount <= 0) {
      throw new Error("planCredits inválido: " + planCredits);
    }

    // Si userId no existe o no es un _id de Sanity, intenta buscar por email
    let targetUserId = userId;

    if (!targetUserId && email) {
      // Buscar usuario por el email proporcionado
      const user = await getSanityUser(email);
      if (!user) throw new Error("No se encontró usuario con email: " + email);
      targetUserId = user._id;
    }

    // Si aún no tenemos un userId, lanzar error
    if (!targetUserId) {
      throw new Error(
        "No se proporcionó userId ni se encontró usuario por email"
      );
    }

    // Añadir créditos al usuario
    await addUserCredit(targetUserId, amount);
  } catch (error) {
    console.error("addCreditsToUser error:", error);
    return { error: "Error al añadir créditos", detail: String(error) };
  }
};

/**
 * Cambia el plan del usuario en Sanity y suma créditos iniciales (idempotente por invoiceId).
 *
 * data puede incluir:
 * - userId?: string
 * - email?: string
 * - priceId?: string (Stripe price id -> para buscar plan en Sanity)
 * - planId?: string (si ya tenés el _id del plan en Sanity)
 * - planCredits?: number|string (override de credits a sumar)
 * - subscriptionId?: string | null
 * - invoiceId?: string | null  (para idempotencia, optional)
 * - setCreditsFromPlan?: boolean (si querés reemplazar credits por los del plan en vez sumar)
 */
export async function changeUserPlanAndAddCredits(data: {
  userId?: string;
  email?: string;
  priceId?: string | null;
  planId?: string | null;
  planCredits?: number | string | null;
  subscriptionId?: string | null;
  invoiceId?: string | null;
  setCreditsFromPlan?: boolean;
}) {
  const {
    userId,
    email,
    priceId,
    planId,
    planCredits,
    subscriptionId,
    invoiceId,
    setCreditsFromPlan = false,
  } = data;

  // 1) encontrar usuario
  let user = null;
  if (userId) {
    user = await getSanityUserById(userId);
  } else if (email) {
    user = await getSanityUser(email);
  } else {
    throw new Error("Se requiere userId o email");
  }

  if (!user) throw new Error("Usuario no encontrado");

  // 2) si invoiceId ya fue aplicada -> no duplicar
  if (
    invoiceId &&
    Array.isArray(user.appliedInvoiceIds) &&
    user.appliedInvoiceIds.includes(invoiceId)
  ) {
    return { success: true, message: "Invoice ya aplicada previamente", user };
  }

  // 3) resolver plan: si nos dieron priceId intentar buscar plan por priceId, si no usar planId
  let planDoc = null;
  if (priceId) planDoc = await getPaymentsPlanByPriceId(priceId);
  if (!planDoc && planId) {
    // si nos pasaron planId directo
    planDoc = await (async () =>
      await getPaymentsPlanByPriceId(planId))().catch(() => null);
  }

  // 4) determinar creditsToAdd
  let creditsToAdd = 0;
  const cp = Number(planCredits ?? 0);
  if (!isNaN(cp) && cp > 0) creditsToAdd = cp;
  else if (planDoc && typeof planDoc.credits === "number")
    creditsToAdd = planDoc.credits;
  else if (planId) {
    // try fetching plan by id if priceId failed
    const planById = await (async () => {
      const { client } = await import("@/sanity/lib/client"); // adjust import if necessary
      return client.fetch(
        `*[_type == "plansPayment" && _id == $id][0]{_id, credits}`,
        { id: planId }
      );
    })();
    if (planById?.credits) creditsToAdd = planById.credits;
  }

  if (!creditsToAdd || creditsToAdd <= 0) {
    throw new Error("No se pudo determinar creditsToAdd");
  }

  // 5) sumar créditos (usa helper)
  await addUserCredit(user._id, creditsToAdd);

  // 6) asignar plan y metadata en Sanity (assignPlanToUser maneja setIfMissing/appliedInvoiceIds append)
  const targetPlanId = planDoc?._id ?? planId;
  if (targetPlanId) {
    await assignPlanToUser(user._id, targetPlanId as string, {
      subscriptionId: subscriptionId ?? null,
      subscriptionPriceId: priceId ?? null,
      subscriptionStatus: "active",
      invoiceId: invoiceId ?? null,
      setCreditsFromPlan,
    });
  } else {
    // aún así, guarda subscription metadata si existe, y la invoice
    await assignPlanToUser(user._id, user.plan?._id ?? "", {
      subscriptionId: subscriptionId ?? null,
      subscriptionPriceId: priceId ?? null,
      subscriptionStatus: "active",
      invoiceId: invoiceId ?? null,
      setCreditsFromPlan: false,
    });
  }

  // 7) retornar usuario actualizado (re-fetch)
  const updatedUser = await getSanityUserById(user._id);
  return { success: true, user: updatedUser };
}
