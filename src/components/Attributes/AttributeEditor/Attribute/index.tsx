import { useCallback } from "react";

import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { AttributeType } from "types/attributes";
import { FunctionGroupCode } from "types/connectors";

import { BooleanAttribute } from "../Attributes/BooleanAttribute";
import { CredentialAttribute } from "../Attributes/CredentialAttribute";
import { DateAttribute } from "../Attributes/DateAttribute";
import { DateTimeAttribute } from "../Attributes/DateTimeAttribute";
import { FileAttribute } from "../Attributes/FileAttribute";
import { FloatAttribute } from "../Attributes/FloatAttribute";
import { IntegerAttribute } from "../Attributes/IntegerAttribute";
import { JsonAttribute } from "../Attributes/JsonAttribute";
import { SecretAttribute } from "../Attributes/SecretAttribute";
import { StringAttribute } from "../Attributes/StringAttribute";
import { TextAttribute } from "../Attributes/TextAttribute";
import { TimeAttribute } from "../Attributes/TimeAttribute";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel | undefined;
   attribute: AttributeModel | undefined;
   callbackValues: any | undefined;
   authorityUuid?: string,
   connectorUuid?: string,
   functionGroup?: FunctionGroupCode,
   kind?: string
}


export function Attribute({
   id,
   descriptor,
   attribute,
   authorityUuid,
   connectorUuid,
   functionGroup,
   kind
}: Props): JSX.Element {


   if (!descriptor) return <></>;


   switch (descriptor.type) {

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
               attribute={attribute}
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
               attribute={attribute}
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

}