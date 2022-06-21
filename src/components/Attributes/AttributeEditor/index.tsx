import Widget from "components/Widget";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { AttributeType } from "types/attributes";
import { BooleanAttribute } from "./BooleanAttribute";
import { CredentialAttribute } from "./CredentialAttribute";
import { DateAttribute } from "./DateAttribute";
import { DateTimeAttribute } from "./DateTimeAttribute";
import { FileAttribute } from "./FileAttribute";
import { FloatAttribute } from "./FloatAttribute";
import { IntegerAttribute } from "./IntegerAttribute";
import { JSONAttribute } from "./JSONAttribute";
import { SecretAttribute } from "./SecretAttribute";
import { StringAttribute } from "./StringAttribute";
import { TextAttribute } from "./TextAttribute";
import { TimeAttribute } from "./TimeAttribute";

interface Props {
   attributeDescriptors: AttributeDescriptorModel[];
   attributes?: AttributeModel[];
}


export default function AttributeEditor({
   attributeDescriptors,
   attributes = []
}: Props) {

   const fields: { [key in AttributeType]: Function } = {
      "BOOLEAN": BooleanAttribute,
      "INTEGER": IntegerAttribute,
      "FLOAT": FloatAttribute,
      "STRING": StringAttribute,
      "TEXT": TextAttribute,
      "DATE": DateAttribute,
      "TIME": TimeAttribute,
      "DATETIME": DateTimeAttribute,
      "CREDENTIAL": CredentialAttribute,
      "FILE": FileAttribute,
      "JSON": JSONAttribute,
      "SECRET": SecretAttribute,
   }

   const grouped: { [key: string]: AttributeDescriptorModel[] } = {};

   attributeDescriptors.forEach(
      descriptor => {
         const groupName = descriptor.group || "__";
         grouped[groupName] ? grouped[groupName].push(descriptor) : grouped[groupName] = [descriptor]
      }
   );

   const attrs: JSX.Element[] = [];

   for (const group in grouped) attrs.push(

      <Widget key={group} title={<h6>{group === "__" ? "Ungrouped" : group}</h6>}>

         {
            grouped[group].map(
               descriptor => (
                  <div key={descriptor.name}>
                     {fields[descriptor.type]({
                        descriptor,
                        attribute: attributes.find(attribute => attribute.name === descriptor.name)
                     }) || null}
                  </div>
               )
            )
         }

      </Widget>

   )



   return <>{attrs}</>;

}
