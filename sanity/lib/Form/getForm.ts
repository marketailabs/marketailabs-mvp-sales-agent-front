import { sanityFetch } from "../live";
import groq, { defineQuery } from "groq";

export const formQuery = groq`*[_type == "form"]{
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
}`;
