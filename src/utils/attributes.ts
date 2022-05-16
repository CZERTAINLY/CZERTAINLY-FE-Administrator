import { AttributeDTO } from "api/.common/AttributeDTO";

export enum AttributeFieldNameTransform {
   name = "Name",
   credentialProvider = "Credential Provider",
   authorityProvider = "Authority Provider",
   discoveryProvider = "Discovery Provider",
   legacyAuthorityProvider = "Legacy Authority Provider",
};

export enum AttributeFieldTypeTransform {
   STRING = "text",
   NUMBER = "number",
   SECRET = "password",
   DROPDOWN = "select",
   SELECT = "select",
   LIST = "select",
   FILE = "file",
   BOOLEAN = "checkbox",
   CREDENTIAL = "select"
};


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
