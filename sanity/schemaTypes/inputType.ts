import { defineField, defineType } from "sanity";

export const inputType = defineType({
  name: "input",
  title: "Input",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del Input",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titulo",
      title: "Titulo del Input",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder del Input",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tipo",
      title: "Tipo del Input",
      type: "string",
      options: {
        list: [
          { title: "TextArea", value: "textarea" },
          { title: "Texto", value: "texto" },
          { title: "Email", value: "email" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "validacion",
      title: "Validacion del Input",
      type: "string",
    }),
  ],

  preview: {
    select: {
      name: "name",
    },
    prepare({ name }) {
      return {
        title: name,
      };
    },
  },
});
