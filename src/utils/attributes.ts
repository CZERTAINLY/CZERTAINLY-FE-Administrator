import { SimplifiedAttributes } from "models/attributes";
import { fieldTypeTransform } from "./fieldTypeTransform";

export function attributeSimplifier(attributes: any): SimplifiedAttributes[] {
  return attributes
    .map(function (attribute: any) {
      if (attribute.value) {
        return {
          name: attribute.name,
          value:
            fieldTypeTransform[attribute.type] === "number"
              ? Number(attribute.value)
              : attribute.value,
        } as SimplifiedAttributes;
      }
    })
    .filter(notEmpty);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
