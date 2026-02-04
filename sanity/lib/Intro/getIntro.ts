import groq from "groq";

export const introQuery = groq`*[_type == "intro"] | order(_createdAt asc){
  _id,
  title,
  parrafo1,
  parrafo2
}`;
