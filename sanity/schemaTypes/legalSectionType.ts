import { defineType, defineField } from "sanity";

export const legalSectionType = defineType({
  name: "legalSection",
  title: "Legal Section",
  type: "document",
  fields: [
    defineField({
      name: "tabName",
      title: "Nombre de la pestaña",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "effectiveDate",
      title: "Fecha de entrada en vigor",
      type: "date",
    }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Encabezado",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "content",
              title: "Contenido",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
        },
      ],
    }),
  ],
});
