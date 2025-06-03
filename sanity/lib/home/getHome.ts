import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getHome() {
  const getHomeQuery = defineQuery(`*[_type == "home"][0]{
    _id,
    title,
    parrafo1,
    parrafo2
  }`);

  const homeData = await sanityFetch({ query: getHomeQuery });
  return homeData.data;
}
