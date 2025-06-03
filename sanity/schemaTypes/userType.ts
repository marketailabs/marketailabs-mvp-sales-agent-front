import { User } from "lucide-react";
import { defineField, defineType } from "sanity";

// Función para generar un ID aleatorio en formato XXXX-XXXXXX
const generateProspectorId = () => {
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
        source: () => generateProspectorId(),
        isUnique: () => true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credits",
      title: "Creditos",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
    },
    prepare({ fullName }) {
      return {
        title: fullName,
      };
    },
  },
});
