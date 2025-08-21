import { type SchemaTypeDefinition } from "sanity";
import { userType } from "./userType";
import { formType } from "./formType";
import { introType } from "./introType";
import { inputType } from "./inputType";
import { plansPaymentType } from "./plansPaymentType";
import { legalSectionType } from "./legalSectionType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    userType,
    formType,
    introType,
    inputType,
    plansPaymentType,
    legalSectionType,
  ],
};

export * from "./userType";
export * from "./formType";
export * from "./introType";
export * from "./inputType";
export * from "./plansPaymentType";
export * from "./legalSectionType";
