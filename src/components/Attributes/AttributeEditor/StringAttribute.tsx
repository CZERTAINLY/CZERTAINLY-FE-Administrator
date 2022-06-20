import { AttributeDescriptorModel, AttributeModel } from "models/attributes"
import { useEffect, useState } from "react";
import Select, { Options } from "react-select";
import { FormGroup, Input, Label } from "reactstrap";

interface Props {
   descriptor: AttributeDescriptorModel,
   attribute: AttributeModel
}

export default function StringAttribute({
   descriptor,
   attribute
}: Props): JSX.Element {

   const [value, setValue] = useState<{ value: string, label: string } | string>();

   useEffect(

      () => {
      },

      [descriptor, attribute]
   )

   console.log(descriptor, attribute);
   console.log(value)

   const options = (descriptor.content instanceof Array ? descriptor.content : []).map(
      content => ({
         value: content.value as string,
         label: content.value as string
      })
   )


   return !descriptor || !descriptor.content ? <></> : (

      <div>

         <FormGroup>

            <Label for={descriptor.name}>{descriptor.label}</Label>

            {
               descriptor.list ? (

                  <Select
                     name={descriptor.name}
                     options={options}
                     value={value}
                  />

               ) : (
                  <Input
                     type="text"
                     name={descriptor.name}
                     value={value as string}
                  />
               )
            }

         </FormGroup>


      </div>

   )

}
