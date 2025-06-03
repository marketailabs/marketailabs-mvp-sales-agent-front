import { type SchemaTypeDefinition } from "sanity";
import { userType } from "./userType";
import { formType } from "./formType";
import { homeType } from "./homeType";
import { inputType } from "./inputType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, formType, homeType, inputType],
};

export * from "./userType";
export * from "./formType";
export * from "./homeType";
export * from "./inputType";
