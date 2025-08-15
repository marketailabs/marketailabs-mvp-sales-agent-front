import { defineField, defineType } from "sanity";

export const plansPaymentType = defineType({
  name: "plansPayment",
  title: "Planes de Pago",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre del Plan",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Precio del Plan",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción del Plan",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "typeOfPlan",
      title: "Tipo de Plan",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: ["mensual", "un solo pago"],
      },
    }),
    defineField({
      name: "priceId",
      title: "ID del Precio en Stripe (Solo para subscripciones)",
      type: "string",
    }),
    defineField({
      name: "benefits",
      title: "Beneficios del Plan",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "credits",
      title: "Créditos del Plan",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
});
