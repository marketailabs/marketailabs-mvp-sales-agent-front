"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  getSanityUserById,
  getUserByCustomerId,
} from "@/sanity/lib/User/UserCredits";
import {
  assignPlanToUser,
  getPaymentsPlan,
  getPaymentsPlanByProductId,
  setApplyingFreePlan,
} from "@/sanity/lib/Payments/getPaymentsPlan";
import { getUserByEmail } from "@/sanity/lib/User/getUserByEmail";

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
 *  handleCancelStripeSubscription
 */
export const handleCancelStripeSubscription = async (
  subscriptionId: string
) => {
  try {
    const canceledSubscription = await stripe.subscriptions.cancel(
      subscriptionId
    );

    console.log(
      "handleCancelStripeSubscription - Subscripcion cancelada: ",
      canceledSubscription
    );

    return canceledSubscription;
  } catch (error) {
    console.error("Error al cancelar:", error);
    return { error: "Error al cancelar la suscripción" };
  }
};

/**
 * Maneja checkout.session.completed
 * - Recibe sessionObj (Stripe.Checkout.Session)
 */
export async function handleCheckoutSessionCompleted(
  sessionObj: Stripe.Checkout.Session
) {
  console.log("Iniciando handleCheckoutSessionCompleted");

  // intentamos sacar userId desde metadata
  const metadataUserId = sessionObj.metadata?.userId ?? null;
  const customerId =
    typeof sessionObj.customer === "string"
      ? sessionObj.customer
      : sessionObj.customer?.id ?? null;
  const subscriptionId =
    typeof sessionObj.subscription === "string"
      ? sessionObj.subscription
      : sessionObj.subscription?.id ?? null;

  // Si no recibimos subscription id, intentar obtener con la session (fetch)
  let subscription: Stripe.Subscription | null = null;
  if (subscriptionId) {
    subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });
  } else {
    // A veces session incluye subscription como objeto; usarlo si existe
    // en caso contrario abandonamos la parte de subscription.
  }

  // Obtener priceId principal (primer item)
  const priceId =
    subscription?.items?.data?.[0]?.price?.id ??
    sessionObj.metadata?.resolvedPriceId ??
    null;
  const status = subscription?.status ?? "unknown";

  // Buscar plan en Sanity por priceId
  const plan = await getPaymentsPlanByProductId(priceId);

  console.log("handleCheckoutSessionCompleted - plan: ", plan);

  // Determinar userId: preferimos metadata.userId, si no buscar por customerId
  let userDoc = null;
  if (metadataUserId) {
    userDoc = await getSanityUserById(metadataUserId);
  } else if (customerId) {
    userDoc = await getUserByCustomerId(customerId);
  }

  console.log("handleCheckoutSessionCompleted - userDoc: ", userDoc);

  // Si encontramos usuario, aseguramos que no tenga el flag de plangratuito y actualizar con datos de la subscripción
  const userId = userDoc?._id ?? null;
  await setApplyingFreePlan(userId, false);

  if (userDoc) {
    await assignPlanToUser(userDoc._id, plan?._id ?? null, {
      subscriptionId: subscriptionId ?? null,
      subscriptionPriceId: priceId ?? null,
      subscriptionStatus: status ?? null,
      customerId: customerId ?? null,
      setCreditsFromPlan: true,
    });
  } else {
    console.warn(
      "handleCheckoutSessionCompleted: no se encontró usuario para session",
      {
        metadataUserId,
        customerId,
      }
    );
  }

  return;
}

/**
 * Maneja invoice.paid
 * - Cuando llega un invoice.paid se debe aplicar (una sola vez) los créditos del plan al usuario.
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  let subscriptionId: string | null = null;

  // ⚡️ fallback para casos raros
  if (
    !subscriptionId &&
    (invoice as any).parent?.subscription_details?.subscription
  ) {
    subscriptionId = (invoice as any).parent.subscription_details.subscription;
  }

  if (!subscriptionId) {
    console.warn("invoice.paid sin subscriptionId", invoice.id);
    return;
  }

  // Recuperar la suscripción de Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  console.log("HandleInvoicePaid - subscription: ", subscription);

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const status = subscription.status;

  console.log(
    "HandleInvoicePaid - Buscando usuario de sanity por customerId: ",
    customerId
  );

  // --- Paso 1: buscar por customerId ---
  let userDoc = await getUserByCustomerId(customerId);

  // --- Paso 2: si no existe, buscar por email del metadata ---
  if (!userDoc && subscription.metadata?.email) {
    console.log(
      "HandleInvoicePaid - fallback por email:",
      subscription.metadata.email
    );
    userDoc = await getUserByEmail(subscription.metadata.email);
  }

  // --- Paso 3: si no existe, buscar por userId del metadata ---
  if (!userDoc && subscription.metadata?.userId) {
    console.log(
      "HandleInvoicePaid - fallback por userId:",
      subscription.metadata.userId
    );
    userDoc = await getSanityUserById(subscription.metadata.userId);
  }

  if (!userDoc) {
    console.error(
      "Usuario no encontrado para invoice",
      invoice.id,
      "customerId:",
      customerId
    );
    return;
  }

  console.log("HandleInvoicePaid - userDoc encontrado:", userDoc);

  // Buscar plan asociado al priceId
  const plan = await getPaymentsPlanByProductId(priceId ?? "");
  if (!plan) {
    console.error("No plan found for priceId", priceId);
    return;
  }

  // Asignar créditos y actualizar datos en Sanity
  await assignPlanToUser(userDoc._id, plan._id, {
    subscriptionId,
    subscriptionPriceId: priceId,
    subscriptionStatus: status,
    setCreditsFromPlan: true,
  });

  console.log(
    `✅ Créditos asignados al user ${userDoc._id} por invoice ${invoice.id}`
  );
}

/**
 * Maneja customer.subscription.updated / deleted
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  eventType: string
) {
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;
  const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
  const metadataUserId = subscription.metadata?.userId ?? null;

  let userDoc = null;
  if (metadataUserId) {
    userDoc = await getSanityUserById(metadataUserId);
  } else if (customerId) {
    userDoc = await getUserByCustomerId(customerId);
  }

  if (!userDoc) {
    console.warn("handleSubscriptionUpdated: no se encontró usuario", {
      subscriptionId,
      customerId,
      metadataUserId,
    });
    return;
  }

  // Si el usuario está aplicando el plan gratuito, ignoramos los eventos de deleted
  if (
    userDoc.applyingFreePlan &&
    eventType === "customer.subscription.deleted"
  ) {
    console.log(
      "Evento cancelado ignorado por aplicación de plan gratuito",
      userDoc._id
    );
    // podemos resetear el flag si queremos
    await setApplyingFreePlan(userDoc._id, false);
    return;
  }

  // Actualizar referencia del plan si priceId cambiò (buscar plan por priceId)
  const plan = await getPaymentsPlanByProductId(priceId);

  await assignPlanToUser(userDoc._id, plan?._id ?? null, {
    subscriptionId,
    subscriptionPriceId: priceId ?? null,
    subscriptionStatus: status ?? null,
    customerId: customerId ?? null,
    setCreditsFromPlan: false, // no setear créditos solo por actualizar
  });

  console.log(
    "Subscription updated applied to user:",
    userDoc._id,
    "status:",
    status
  );
}
