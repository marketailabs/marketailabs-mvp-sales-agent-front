import { defineField, defineType } from "sanity";

export const formType = defineType({
  name: "form",
  title: "Formulario",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del Formulario",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "Formulario",
    }),
    defineField({
      name: "fields",
      title: "Campos del Formulario",
      type: "array",
      of: [{ type: "reference", to: { type: "input" } }],
      validation: (rule) =>
        rule.min(1).error("Debes agregar al menos un campo al formulario"),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare({ title }) {
      return {
        title: title || "Formulario",
      };
    },
  },
});
