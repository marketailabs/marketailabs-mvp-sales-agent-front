import { client } from "../client";
import { getPaymentsPlanByPriceId } from "../Payments/getPaymentsPlan";

// Restar creditos pomr consulta
export async function subtractUserCredit(userId: string) {
  const updatedUser = await client
    .patch(userId)
    .dec({ credits: 1 })
    .commit({ autoGenerateArrayKeys: true });

  return updatedUser;
}

// Obtener los créditos del usuario y datos del plan
export async function getSanityUser(email: string) {
  const user = await client.fetch(
    `*[_type == "user" && email == $email][0]{
      _id,
      fullName,
      email,
      credits,
      token,
      plan->{_id, name, price, description, typeOfPlan, benefits, credits},
      subscriptionId,
      subscriptionPriceId,
      subscriptionStatus,
      appliedInvoiceIds
    }`,
    { email }
  );
  return user;
}

/**
 * Obtener usuario por _id (útil en webhooks donde tenés userId)
 */
export async function getSanityUserById(id: string) {
  const user = await client.fetch(
    `*[_type == "user" && _id == $id][0]{
      _id,
      fullName,
      email,
      credits,
      token,
      plan->{_id, name, price, description, typeOfPlan, benefits, credits},
      subscriptionId,
      subscriptionPriceId,
      subscriptionStatus,
      appliedInvoiceIds
    }`,
    { id }
  );
  return user;
}

/**
 * Suma los créditos del plan al usuario, en lugar de reemplazar
 */
export async function addPlanCreditsToUser(
  userId: string,
  priceId: string,
  invoiceId?: string
) {
  const plan = await getPaymentsPlanByPriceId(priceId);
  if (!plan || typeof plan.credits !== "number") {
    throw new Error("Plan inválido o sin créditos");
  }

  console.log("UserCredits.ts - Price id del plan: ", priceId);
  console.log("UserCredits.ts - Plan: ", plan);
  console.log("UserCredits.ts - Invoice id: ", invoiceId);

  const patch = client
    .patch(userId)
    .inc({ credits: plan.credits })
    .setIfMissing({ appliedInvoiceIds: [] });

  if (invoiceId) {
    patch.append("appliedInvoiceIds", [invoiceId]);
  }

  const updatedUser = await patch.commit({ autoGenerateArrayKeys: true });
  return updatedUser;
}
