import { AttributeDescriptorModelNew, AttributeRequestModel, isDataAttribute } from "types/attributes";
import { AttributeContentType } from "types/openapi";

export const attributeFieldNameTransform: { [name: string]: string } = {
   name: "Name",
   credentialProvider: "Credential Provider",
   authorityProvider: "Authority Provider",
   discoveryProvider: "Discovery Provider",
   legacyAuthorityProvider: "Legacy Authority Provider",
   complianceProvider: "Compliance Provider",
   entityProvider: "Entity Provider"
};


export function collectFormAttributes(id: string, descriptors: AttributeDescriptorModelNew[] | undefined, values: Record<string, any>): AttributeRequestModel[] {

   if (!descriptors || !values[`__attributes__${id}__`]) return [];

   const attributes = values[`__attributes__${id}__`];

   const attrs: AttributeRequestModel[] = [];


   for (const attribute in attributes) {

      if (!attributes.hasOwnProperty(attribute)) continue;

      const info = attribute.split(":");

      const attributeName = info[0];
      // const attributeType = info[1];
      const attributeUuid = info.length === 3 ? info[2] : undefined;

      const descriptor = descriptors?.find(d => d.name === attributeName);

      if (!descriptor) continue;
      if (attributes[attribute] === undefined || attributes[attribute] === null) continue;

      let content: any;

      if (isDataAttribute(descriptor)) {

         switch (descriptor.contentType) {


            case AttributeContentType.Boolean:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: attributes[attribute]};

               break;


            case AttributeContentType.Integer:

               if (descriptor.properties.list) {
                  if (Array.isArray(attributes[attribute]))
                     content = attributes[attribute].map((lv: any) => parseInt(lv.value));
                  else
                     content = {value: parseInt(attributes[attribute].value.value)}
               } else {
                  content = {value: parseInt(attributes[attribute])};
               }

               break;


            case AttributeContentType.Float:
               if (descriptor.properties.list) {
                  if (Array.isArray(attributes[attribute]))
                     content = attributes[attribute].map((lv: any) => parseFloat(lv.value));
                  else
                     content = {value: parseFloat(attributes[attribute].value.value)}
               } else {
                  content = {value: parseFloat(attributes[attribute])};
               }
               break;


            case AttributeContentType.String:

               if (descriptor.properties.list) {
                  if (Array.isArray(attributes[attribute]))
                     content = attributes[attribute].map((lv: any) => lv.value);
                  else
                     content = {value: attributes[attribute].value.value};
               } else {
                  content = {value: attributes[attribute]};
               }

               break;


            case AttributeContentType.Text:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: attributes[attribute]};

               break;

            case AttributeContentType.Date:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: new Date(attributes[attribute]).toISOString()};

               break;


            case AttributeContentType.Time:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: attributes[attribute]};

               break;


            case AttributeContentType.Datetime:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: new Date(attributes[attribute]).toISOString()};

               break;


            case AttributeContentType.File:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = attributes[attribute];

               break;


            case AttributeContentType.Secret:

               if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
               content = {value: attributes[attribute]};

               break;


            case AttributeContentType.Credential:

               if (descriptor.properties.list) {
                  if (Array.isArray(attributes[attribute]))
                     content = attributes[attribute].map((lv: any) => lv.value);
                  else
                     content = attributes[attribute].value;
               } else {
                  content = attributes[attribute];
               }

               break;


            case AttributeContentType.Object:

               if (descriptor.properties.list) {
                  if (Array.isArray(attributes[attribute])) {
                     content = attributes[attribute].map((lv: any) => lv.value);
                  } else
                     content = attributes[attribute].value;
               } else {
                  content = attributes[attribute];
               }

               break;


            default:

               continue;

         }

         if (content === undefined || !content.value === undefined) continue;

         const attr: AttributeRequestModel = {
            name: attributeName,
            /*type: descriptor.type,
            label: descriptor.label,*/
            content: Array.isArray(content) ? content : [content],
         }

         if (attributeUuid) attr.uuid = attributeUuid;

         attrs.push(attr);
      }

   }

   return attrs;

}
