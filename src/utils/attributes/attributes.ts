import { AttributeDescriptorModel, AttributeRequestModel, BaseAttributeContentModel, isCustomAttributeModel, isDataAttributeModel } from "types/attributes";
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

export const getAttributeContent = (contentType: AttributeContentType, content: BaseAttributeContentModel[] | undefined) => {

   if (!content) return "Not set";

   const mapping = (content: BaseAttributeContentModel): string | undefined => {
      switch (contentType) {
         case AttributeContentType.Boolean:
            return content.data ? "true" : "false"
         case AttributeContentType.Credential:
         case AttributeContentType.Object:
         case AttributeContentType.File:
            return content.reference;
         case AttributeContentType.Time:
         case AttributeContentType.Date:
         case AttributeContentType.Datetime:
         case AttributeContentType.Float:
         case AttributeContentType.Integer:
         case AttributeContentType.String:
         case AttributeContentType.Text:
            return content.data.toString();
         case AttributeContentType.Secret:
            return "*****";
      }
      return undefined;
   };

   return content.map(content => mapping(content) ?? "Unknown data type").join(", ");
}

const getAttributeFormValue = (contentType: AttributeContentType, item: any) => {
   if (contentType === AttributeContentType.Datetime || contentType === AttributeContentType.Date) {
      return item.value ? new Date(item.value).toISOString() : {data: new Date(item).toISOString()};
   }

   return item.value ?? {data: item}
}

export function collectFormAttributes(id: string, descriptors: AttributeDescriptorModel[] | undefined, values: Record<string, any>): AttributeRequestModel[] {

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

      if (isDataAttributeModel(descriptor) || isCustomAttributeModel(descriptor)) {
            if (Array.isArray(attributes[attribute])) {
               content = attributes[attribute].map((i: any) => getAttributeFormValue(descriptor.contentType, i));
            } else {
               content = getAttributeFormValue(descriptor.contentType, attributes[attribute]);
            }
         //
         // switch (descriptor.contentType) {
         //
         //
         //    case AttributeContentType.Boolean:
         //    case AttributeContentType.Text:
         //    case AttributeContentType.Time:
         //    case AttributeContentType.Secret:
         //
         //       if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
         //       content = {data: !!attributes[attribute]};
         //
         //       break;
         //
         //
         //    case AttributeContentType.Integer:
         //
         //       if (descriptor.properties.list) {
         //          if (Array.isArray(attributes[attribute]))
         //             content = attributes[attribute].map((lv: any) => parseInt(lv.value));
         //          else
         //             content = {value: parseInt(attributes[attribute].value.value)}
         //       } else {
         //          content = {value: parseInt(attributes[attribute])};
         //       }
         //
         //       break;
         //
         //
         //    case AttributeContentType.Float:
         //       if (descriptor.properties.list) {
         //          if (Array.isArray(attributes[attribute]))
         //             content = attributes[attribute].map((lv: any) => parseFloat(lv.value));
         //          else
         //             content = {value: parseFloat(attributes[attribute].value.value)}
         //       } else {
         //          content = {value: parseFloat(attributes[attribute])};
         //       }
         //       break;
         //
         //
         //    case AttributeContentType.String:
         //
         //       if (descriptor.properties.list) {
         //          if (Array.isArray(attributes[attribute]))
         //             content = attributes[attribute].map((lv: any) => lv.value);
         //          else
         //             content = {value: attributes[attribute].value.value};
         //       } else {
         //          content = {value: attributes[attribute]};
         //       }
         //
         //       break;
         //
         //    case AttributeContentType.Date:
         //    case AttributeContentType.Datetime:
         //
         //       if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
         //       content = {value: new Date(attributes[attribute]).toISOString()};
         //
         //       break;
         //
         //    case AttributeContentType.File:
         //
         //       if (descriptor.properties.list || descriptor.properties.multiSelect) continue;
         //       content = attributes[attribute];
         //
         //       break;
         //
         //
         //    case AttributeContentType.Credential:
         //    case AttributeContentType.Object:
         //
         //       if (descriptor.properties.list) {
         //          if (Array.isArray(attributes[attribute]))
         //             content = attributes[attribute].map((lv: any) => lv.value);
         //          else
         //             content = attributes[attribute].value;
         //       } else {
         //          content = attributes[attribute];
         //       }
         //
         //       break;
         //
         //    default:
         //
         //       continue;
         //
         // }

         if (content === undefined || !content.data === undefined) continue;

         const attr: AttributeRequestModel = {
            name: attributeName,
            content: Array.isArray(content) ? content : [content],
         }

         if (attributeUuid) attr.uuid = attributeUuid;

         attrs.push(attr);
      }

   }

   return attrs;

}
