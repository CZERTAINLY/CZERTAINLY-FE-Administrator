import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel,
   attribute: AttributeModel
}

export function JSONAttribute({
   id,
   descriptor,
   attribute
}: Props): JSX.Element {

   return (

      <>
      jsonAttribute
      </>

   )

}
