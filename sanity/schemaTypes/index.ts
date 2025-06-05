import { type SchemaTypeDefinition } from "sanity";
import { userType } from "./userType";
import { formType } from "./formType";
import { introType } from "./introType";
import { inputType } from "./inputType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [userType, formType, introType, inputType],
};

export * from "./userType";
export * from "./formType";
export * from "./introType";
export * from "./inputType";
