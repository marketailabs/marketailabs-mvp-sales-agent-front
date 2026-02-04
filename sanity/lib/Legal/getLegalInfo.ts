import groq from "groq";

export const legalInfoQuery = groq`
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
`;
