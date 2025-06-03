import { defineField, defineType } from "sanity";

export const homeType = defineType({
  name: "home",
  title: "Home",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parrafo1",
      title: "Parrafo 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "parrafo2",
      title: "Parrafo 2",
      type: "string",
    }),
  ],
});
