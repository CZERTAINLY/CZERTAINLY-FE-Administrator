import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel,
   attribute?: AttributeModel
}

export function DateAttribute({
   id,
   descriptor,
   attribute
}: Props): JSX.Element {

   console.log(descriptor, attribute);

   return (

      <>
      dateAttribute
      </>

   )

}

