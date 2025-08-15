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

// Sumar créditos al usuario
export async function addUserCredit(userId: string, amount: number) {
  try {
    // Transformar el numero a entero por si acaso
    amount = Math.floor(Number(amount));

    await client
      .patch(userId)
      .inc({ credits: amount })
      .commit({ autoGenerateArrayKeys: true });
  } catch (error) {
    console.error("Error al sumar creditos:", error);
    throw error;
  }
}
