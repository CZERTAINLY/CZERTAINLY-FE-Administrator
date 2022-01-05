import { SimplifiedAttributes } from "models/attributes";
import { fieldTypeTransform } from "./fieldTypeTransform";

export function attributeSimplifier(attributes: any): SimplifiedAttributes[] {
  return attributes.map(function (attribute: any) {
    return {
      name: attribute.name,
      value:
        fieldTypeTransform[attribute.type] === "number"
          ? Number(attribute.value)
          : attribute.value,
    } as SimplifiedAttributes;
  });
}
