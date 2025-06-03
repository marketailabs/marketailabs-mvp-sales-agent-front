import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getUserByEmail(email: string) {
  const getUserByEmailQuery = defineQuery(
    `*[_type == "user" && email == $email][0]`
  );

  const user = await sanityFetch({
    query: getUserByEmailQuery,
    params: { email },
  });

  return user.data;
}
