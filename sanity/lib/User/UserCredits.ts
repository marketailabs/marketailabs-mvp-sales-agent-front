import { client } from "../client";

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
      lastCreditsReset,
      applyingFreePlan,
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
      lastCreditsReset,
      applyingFreePlan,
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
 * buscar usuario por customerId en Sanity
 */
export async function getUserByCustomerId(customerId: string) {
  if (!customerId) return null;
  const user = await client.fetch(
    `*[_type == "user" && customerId == $customerId][0]{_id, email, customerId, subscriptionId, appliedInvoiceIds, applyingFreePlan}`,
    { customerId }
  );
  return user || null;
}
