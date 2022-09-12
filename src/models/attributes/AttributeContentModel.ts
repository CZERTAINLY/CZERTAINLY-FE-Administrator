import { AttributeValue } from "types/attributes";

export interface AttributeContentModel {
   [key: string]: AttributeValue;
   value: AttributeValue;
}
