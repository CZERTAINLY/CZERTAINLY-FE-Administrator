import { AttributeDescriptorModel, AttributeModel } from "models/attributes"

interface Props {
   descriptor: AttributeDescriptorModel,
   attribute: AttributeModel
}

export function TimeAttribute({
   descriptor,
   attribute
}: Props): JSX.Element {

   console.log(descriptor, attribute);

   return (

      <>
      timeAttribute
      </>

   )

}
