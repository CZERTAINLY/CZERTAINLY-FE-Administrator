import Widget from "components/Widget";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";
import { FunctionGroupCode } from "types/connectors";
import { Attribute } from "./Attribute";


interface Props {
   id: string;
   attributeDescriptors: AttributeDescriptorModel[];
   attributes?: AttributeModel[];
   authorityUuid?: string;
   connectorUuid?: string;
   functionGroup?: FunctionGroupCode;
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

                     <Attribute
                        id={id}
                        descriptor={descriptor}
                        attribute={attributes.find(a => a.name === descriptor.name)}
                        callbackValues={undefined}
                        authorityUuid={authorityUuid}
                        connectorUuid={connectorUuid}
                        functionGroup={functionGroup}
                        kind={kind}
                     />

                  </div>

               )

            )

         }

      </Widget>

   )

   return <>{attrs}</>;

}
