import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getIntro() {
  const getIntroQuery =
    defineQuery(`*[_type == "intro"] | order(_createdAt asc){
      _id,
      title,
      parrafo1,
      parrafo2
    }`);

  const introData = await sanityFetch({ query: getIntroQuery });
  return introData.data;
}
