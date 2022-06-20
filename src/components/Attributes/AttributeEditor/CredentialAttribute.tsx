import { AttributeDescriptorModel, AttributeModel } from "models/attributes"

interface Props {
   descriptor: AttributeDescriptorModel,
   attribute: AttributeModel
}

export default function CredentialAttribute({
   descriptor,
   attribute
}: Props): JSX.Element {

   console.log(descriptor, attribute);

   return (

      <>
      credentialAttribute
      </>

   )

}
