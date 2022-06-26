import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
};


export const attributeFieldTypeTransform: { [name: string]: string } = {
   BOOLEAN: "checkbox",
   INTEGER: "number",
   FLOAT: "number",
   STRING: "string",
   TEXT: "textarea",
   DATE: "date",
   TIME: "time",
   DATETIME: "datetime",
   FILE: "file",
   SECRET: "password",
   CREDENTIAL: "select",
   JSON: "select"
};


export function collectFormAttributes(descriptors: AttributeDescriptorModel[] | undefined, values: Record<string, any>): AttributeModel[] {

   if (!descriptors || !values["__attribute__"]) return [];

   const attributes = values["__attribute__"];

   const attrs: AttributeModel[] = [];

   for (const attribute in attributes) {

      if (!attributes.hasOwnProperty(attribute)) continue;

      const info = attribute.split(":");

      const attributeName = info[0];
      // const attributeType = info[1];
      const attributeUuid = info.length === 3 ? info[2] : undefined;

      const descriptor = descriptors?.find(d => d.name === attributeName);

      if (!descriptor) continue;
      if (!attributes[attribute]) continue;

      let content: any;

      switch (descriptor.type) {

         case "BOOLEAN":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "INTEGER":
            if (descriptor.list) {
               if (attributes[attribute] instanceof Array)
                  content = attributes[attribute].map((lv: any) => ({ value: lv.value }));
               else
                  content = { value: attributes[attribute].value }
            } else {
               content = { value: attributes[attribute] };
            }
            break;

         case "FLOAT":
            if (descriptor.list) {
               if (attributes[attribute] instanceof Array)
                  content = attributes[attribute].map((lv: any) => ({ value: lv.value }));
               else
                  content = { value: attributes[attribute].value }
            } else {
               content = { value: attributes[attribute] };
            }
            break;

         case "STRING":
            if (descriptor.list) {
               if (attributes[attribute] instanceof Array)
                  content = attributes[attribute].map((lv: any) => ({ value: lv.value }));
               else
                  content = { value: attributes[attribute].value }
            } else {
               content = { value: attributes[attribute] };
            }
            break;

         case "TEXT":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "DATE":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "TIME":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "DATETIME":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "FILE":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = attributes[attribute];
            break;

         case "SECRET":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "CREDENTIAL":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         case "JSON":
            if (descriptor.list || descriptor.multiSelect) continue;
            content = { value: attributes[attribute] };
            break;

         default:
            continue;

      }

      if (!content || !content.value) continue;

      const attr: AttributeModel = {
         name: attributeName,
         /*type: descriptor.type,
         label: descriptor.label,*/
         content: content,
      }

      if (attributeUuid) attr.uuid = attributeUuid;

      attrs.push(attr);

   }

   return attrs;

}