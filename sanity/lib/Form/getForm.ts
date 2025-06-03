import { sanityFetch } from "../live";
import { defineQuery } from "groq";

export async function getForms() {
  const getFormsQuery = defineQuery(`*[_type == "form"]{
  _id,
  name,
  "fields": fields[]->{
    _id,
    name,
    titulo,
    placeholder,
    tipo,
    validacion
    // Agrega aquí cualquier otro campo que tengas en tu inputType
  }
}`);

  const forms = await sanityFetch({ query: getFormsQuery });
  return forms.data;
}
