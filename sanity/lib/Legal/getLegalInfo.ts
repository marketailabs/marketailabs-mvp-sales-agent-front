import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getLegalInfo() {
  const getLegalInfoQuery = defineQuery(`
  *[_type == "legalSection"] | order(effectiveDate desc) {
    _id,
    tabName,
    title,
    effectiveDate,
    sections[]{
      heading,
      content
    }
  }
`);

  const legalInfoData = await sanityFetch({ query: getLegalInfoQuery });
  return legalInfoData.data;
}
