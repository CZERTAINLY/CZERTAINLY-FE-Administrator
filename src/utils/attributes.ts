import { AttributeResponse, SimplifiedAttributes } from "models/attributes";

export function attributeSimplifier(attributes: any): SimplifiedAttributes[] {
  return attributes.map(function (attribute: any) {
    return {
      name: attribute.name,
      value: attribute.value,
    } as SimplifiedAttributes;
  });
}
