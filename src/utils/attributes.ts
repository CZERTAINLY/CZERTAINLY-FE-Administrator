import { AttributeDescriptorDTO, AttributeDTO } from "api/.common/AttributeDTO";

export enum FieldNameTransform {
   name = "Name",
   credentialProvider = "Credential Provider",
   authorityProvider = "Authority Provider",
   discoveryProvider = "Discovery Provider",
   legacyAuthorityProvider = "Legacy Authority Provider",
};

export enum FieldTypeTransform {
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


export function attributeSimplifier(attributes: AttributeDescriptorDTO[]): AttributeDTO[] {

   return attributes.map<AttributeDTO>(

      attribute => {
         return {
            name: attribute.name,
            value: (FieldTypeTransform[attribute.type] === "number" ? Number(attribute.value) : attribute.value),
         }
      }

   ).filter(
      attribute => attribute.value !== null && attribute.value !== undefined
   );

}
