import { AttributeDTO } from "api/_common/attributeDTO";

export function attributeSimplifier(attributes: AttributeDTO[]): AttributeDTO[] {

   return attributes.map<AttributeDTO>(

      attribute => {
         return {
            name: attribute.name,
            value: attribute.value,
         }
      }

   ).filter(
      attribute => attribute.value !== null && attribute.value !== undefined
   );

}
