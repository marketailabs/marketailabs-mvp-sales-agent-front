import { client } from "../client";
import { getUserByEmail } from "./getUserByEmail";

export async function verifyUserCredits(email: string, token: string) {
  const tokenUser = token.trim().toString();
  const user = await getUserByEmail(email);
  const sanityUserToken = user?.token?.current?.toString();

  if (!user) {
    throw new Error("Email inválido");
  }

  if (sanityUserToken !== tokenUser) {
    throw new Error("Token inválido");
  }

  if (typeof user.credits !== "number" || user.credits <= 0) {
    throw new Error("No tienes créditos disponibles");
  }

  return user;
}

export async function subtractUserCredit(userId: string) {
  const updatedUser = await client
    .patch(userId)
    .dec({ credits: 1 })
    .commit({ autoGenerateArrayKeys: true });

  return updatedUser;
}
