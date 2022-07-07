import { useCallback } from "react";
import Widget from "components/Widget";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { AttributeType } from "types/attributes";
import { FunctionGroupCode } from "types/connectors";
import { BooleanAttribute } from "./BooleanAttribute";
import { CredentialAttribute } from "./CredentialAttribute";
import { DateAttribute } from "./DateAttribute";
import { DateTimeAttribute } from "./DateTimeAttribute";
import { FileAttribute } from "./FileAttribute";
import { FloatAttribute } from "./FloatAttribute";
import { IntegerAttribute } from "./IntegerAttribute";
import { JsonAttribute } from "./JsonAttribute";
import { SecretAttribute } from "./SecretAttribute";
import { StringAttribute } from "./StringAttribute";
import { TextAttribute } from "./TextAttribute";
import { TimeAttribute } from "./TimeAttribute";

interface Props {
   id: string;
   attributeDescriptors: AttributeDescriptorModel[];
   attributes?: AttributeModel[];
   authorityUuid?: string;
   connectorUuid?: string;
   functionGroup?: string;
   kind?: string;
}


export default function AttributeEditor({
   id,
   attributeDescriptors,
   attributes = [],
   authorityUuid,
   connectorUuid,
   functionGroup,
   kind
}: Props) {

   const getAttributeComponent  = useCallback(

      (
         type: AttributeType,
         id: string,
         descriptor: AttributeDescriptorModel,
         attribute: AttributeModel | undefined,
      ): JSX.Element => {

         switch (type) {

            case "BOOLEAN":

               return (
                  <BooleanAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            case "INTEGER":

               return (
                  <IntegerAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />)

            case "FLOAT":

               return (
                  <FloatAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />)

            case "STRING":

               return (
                  <StringAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            case "TEXT":

               return (
                  <TextAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            case "DATE":

               return (
                  <DateAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )


            case "TIME":

               return (
                  <TimeAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )


            case "DATETIME":

               return (
                  <DateTimeAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            case "CREDENTIAL":

               return (
                  <CredentialAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attributes.find(attr => attr.name === descriptor.name)}
                     authorityUuid={authorityUuid as string}
                     connectorUuid={connectorUuid as string}
                     functionGroup={functionGroup as FunctionGroupCode}
                     kind={kind as string}
                  />
               )

            case "FILE":

               return (
                  <FileAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attributes.find(attr => attr.name === descriptor.name)}
                  />
               )

            case "JSON":

               return (
                  <JsonAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            case "SECRET":

               return (
                  <SecretAttribute
                     id={id}
                     descriptor={descriptor}
                     attribute={attribute}
                  />
               )

            default:
               return <></>

         }

      },
      [attributes, authorityUuid, connectorUuid, functionGroup, kind]

   )


   const grouped: { [key: string]: AttributeDescriptorModel[] } = {};

   attributeDescriptors.forEach(
      descriptor => {
         const groupName = descriptor.group || "__";
         grouped[groupName] ? grouped[groupName].push(descriptor) : grouped[groupName] = [descriptor]
      }
   );

   const attrs: JSX.Element[] = [];

   for (const group in grouped) attrs.push(

      <Widget key={group} title={<h6>{group === "__" ? "" : group}</h6>}>

         {

            grouped[group].map(

               descriptor => (

                  <div key={descriptor.name}>
                     {getAttributeComponent(descriptor.type, id, descriptor, attributes.find(attr => attr.name === descriptor.name))}
                  </div>

               )

            )

         }

      </Widget>

   )

   return <>{attrs}</>;

}
