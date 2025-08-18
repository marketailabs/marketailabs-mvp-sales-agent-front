"use server";

import {
  assignPlanToUser,
  getPaymentsPlan,
  getPaymentsPlanByPriceId,
} from "@/sanity/lib/Payments/getPaymentsPlan";

import {
  getSanityUser,
  getSanityUserById,
} from "@/sanity/lib/User/UserCredits";

/**
 * getPrices - obtiene planes desde Sanity
 */
export const getPrices = async () => {
  try {
    const paymentsPlan = await getPaymentsPlan();
    return paymentsPlan;
  } catch (error) {
    console.error(error);
    return { error: "Error al obtener los precios" };
  }
};

/**
 * changeUserPlanAndAddCredits
 *
 * Ahora **SIEMPRE** aplica los créditos como REEMPLAZO (set) en los flujos controlados por Stripe:
 * - Si existe planDoc (priceId -> plan) -> usa assignPlanToUser con setCreditsFromPlan = true (reemplaza)
 * - Si viene planCredits (override) -> setea directamente credits = planCredits (reemplaza)
 * - Si la llamada solo quiere actualizar status/metadata -> actualiza metadata sin tocar credits
 *
 * Idempotencia por invoiceId (appliedInvoiceIds).
 */
export async function changeUserPlanAndAddCredits(data: {
  userId?: string;
  email?: string;
  priceId?: string | null;
  planId?: string | null;
  planCredits?: number | string | null;
  subscriptionId?: string | null;
  invoiceId?: string | null;
  setCreditsFromPlan?: boolean; // lo mantenemos para compatibilidad, pero la lógica principal siempre reemplaza
  subscriptionStatus?: string | null;
  customerId?: string | null;
}) {
  const {
    userId,
    email,
    priceId,
    planId,
    planCredits,
    subscriptionId,
    invoiceId,
    // setCreditsFromPlan = false, // lo ignoramos para el comportamiento por defecto
    subscriptionStatus = null,
    customerId = null,
  } = data;

  // 1) obtener usuario
  let user = null;
  if (userId) user = await getSanityUserById(userId);
  else if (email) user = await getSanityUser(email);
  else throw new Error("Se requiere userId o email");

  if (!user) throw new Error("Usuario no encontrado");

  // 2) idempotencia por invoiceId
  if (
    invoiceId &&
    Array.isArray(user.appliedInvoiceIds) &&
    user.appliedInvoiceIds.includes(invoiceId)
  ) {
    return { success: true, message: "Invoice ya aplicada previamente", user };
  }

  // 3) resolver planDoc (por priceId o planId)
  let planDoc = null;
  if (priceId) planDoc = await getPaymentsPlanByPriceId(priceId);
  if (!planDoc && planId) {
    planDoc = await (async () =>
      await getPaymentsPlanByPriceId(planId))().catch(() => null);
  }

  // 4) Si la intención es SOLO actualizar status/metadata (sin tocar credits)
  const wantsOnlyStatusUpdate =
    !invoiceId && !priceId && !planCredits && !!subscriptionStatus;

  if (wantsOnlyStatusUpdate) {
    const existingPlanId = user.plan?._id ?? planId ?? "";
    await assignPlanToUser(user._id, existingPlanId, {
      subscriptionId: subscriptionId ?? null,
      subscriptionPriceId: priceId ?? null,
      subscriptionStatus: subscriptionStatus ?? null,
      invoiceId: invoiceId ?? null,
      setCreditsFromPlan: false,
      customerId: customerId ?? null,
    });

    const updatedUser = await getSanityUserById(user._id);
    return { success: true, user: updatedUser, message: "Updated status only" };
  }

  // 5) Si existe planDoc (resuelto por priceId/planId) -> REEMPLAZAMOS créditos desde plan
  if (planDoc) {
    const targetPlanId = planDoc._id;
    await assignPlanToUser(user._id, targetPlanId, {
      subscriptionId: subscriptionId ?? null,
      subscriptionPriceId: priceId ?? null,
      subscriptionStatus: subscriptionStatus ?? "active",
      invoiceId: invoiceId ?? null,
      setCreditsFromPlan: true, // REEMPLAZAR con credits del plan
      customerId: customerId ?? null,
    });

    const updatedUser = await getSanityUserById(user._id);
    return { success: true, user: updatedUser };
  }

  // 6) Si no hay planDoc pero viene planCredits explícito -> REEMPLAZAMOS credits al valor indicado
  const cp = Number(planCredits ?? 0);
  if (!isNaN(cp) && cp > 0) {
    const amount = Math.floor(cp);
    const { client } = await import("@/sanity/lib/client");

    const patch = client
      .patch(user._id)
      .setIfMissing({ appliedInvoiceIds: [] });

    // set credits al valor exacto
    patch.set({ credits: amount });

    // metadata asociada
    if (subscriptionId) patch.set({ subscriptionId });
    if (priceId) patch.set({ subscriptionPriceId: priceId });
    if (subscriptionStatus) patch.set({ subscriptionStatus });
    if (customerId) patch.set({ customerId });

    if (invoiceId) patch.append("appliedInvoiceIds", [invoiceId]);

    const updated = await patch.commit({ autoGenerateArrayKeys: true });
    return { success: true, user: updated };
  }

  // 7) Si llegamos acá, no tuvimos forma de determinar qué credits setear -> error
  throw new Error(
    "No se pudo determinar créditos a aplicar (ni plan asociado ni planCredits)."
  );
}
