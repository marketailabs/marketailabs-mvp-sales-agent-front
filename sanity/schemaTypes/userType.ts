import { User } from "lucide-react";
import { defineField, defineType } from "sanity";

// Función para generar un ID aleatorio en formato XXXX-XXXXXX
const generateProfilerId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charsNumber = "0123456789";
  const randomPart1 = Array.from(
    { length: 3 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  const randomPart2 = Array.from(
    { length: 3 },
    () => charsNumber[Math.floor(Math.random() * charsNumber.length)]
  ).join("");

  return `${randomPart1}${randomPart2}`;
};

export const userType = defineType({
  name: "user",
  title: "User",
  icon: User,
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Nombre completo",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "token",
      title: "Token",
      type: "slug",
      options: {
        source: () => generateProfilerId(),
        isUnique: () => true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Créditos",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "plan",
      title: "Plan de Pago",
      type: "reference",
      to: [{ type: "plansPayment" }],
      validation: (rule) => rule.required(),
    }),

    // Campo para setear el ultimo reseteo de creditos
    defineField({
      name: "lastCreditsReset",
      title: "Último reseteo de créditos",
      type: "datetime",
    }),

    // Campo para setear si se esta aplicando el plan gratuito
    defineField({
      name: "applyingFreePlan",
      title: "Aplicando plan gratuito",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "changePlan",
      title: "Aplicando Cambio de Plan",
      type: "boolean",
      initialValue: false,
    }),

    // En caso de que el usuario tenga plan se rellenaran estos campos

    defineField({
      name: "customerId",
      title: "Customer ID",
      type: "string",
    }),

    defineField({
      name: "subscriptionId",
      title: "Subscription ID",
      type: "string",
    }),
    defineField({
      name: "subscriptionPriceId",
      title: "Subscription Price ID",
      type: "string",
    }),
    defineField({
      name: "subscriptionStatus",
      title: "Subscription Status",
      type: "string",
    }),
    defineField({
      name: "appliedInvoiceIds",
      title: "Invoices aplicadas",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
      planName: "plan.name",
    },
    prepare({ fullName, planName }) {
      return {
        title: fullName,
        subtitle: planName || "Sin plan",
      };
    },
  },
});
