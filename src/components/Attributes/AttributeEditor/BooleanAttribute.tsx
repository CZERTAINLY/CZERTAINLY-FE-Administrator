import { AttributeContentModel, AttributeDescriptorModel, AttributeModel } from "models/attributes"
import { useEffect, useMemo } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validateFloat, validateRequired } from "utils/validators";

interface Props {
   descriptor: AttributeDescriptorModel;
   attribute?: AttributeModel;
}

export function BooleanAttribute({
   descriptor,
   attribute,
}: Props): JSX.Element {

   const form = useForm();

   useEffect(

      () => {

         if (!attribute || !attribute.content) {

            form.mutators.setAttribute(

               `__attribute__${descriptor.name}`,
               descriptor.content
                  ?
                  descriptor.content instanceof Array
                     ?
                     descriptor.content.map(
                        content => ({
                           value: content.value,
                           label: content.value,
                        })
                     )
                     :
                     (descriptor.content as AttributeContentModel).value
                  :
                  undefined
            );

            return;

         }


         form.mutators.setAttribute(`__attribute__${descriptor.name}`,

            descriptor.list

               ?

               descriptor.multiSelect && attribute.content instanceof Array

                  ?

                  attribute.content.map(
                     content => ({
                        value: content.value,
                        label: content.value
                     })
                  )

                  :

                  ({
                     value: (attribute.content as AttributeContentModel).value,
                     label: (attribute.content as AttributeContentModel).value
                  })

               :

               (attribute.content as AttributeContentModel).value

         );

      },

      [descriptor, attribute, form.mutators]
   )

   const options = useMemo(

      () => (descriptor.content instanceof Array ? descriptor.content : []).map(

         content => ({
            value: content.value as string,
            label: content.value as string
         }) as SingleValue<{ value: string; label: string }>,

      ),
      [descriptor.content]
   )

   const validators: any = useMemo(

      () => {

         const vals = [];

         if (descriptor.required) vals.push(validateRequired());
         vals.push(validateFloat());

         return composeValidators.apply(undefined, vals);

      },

      [descriptor.required]

   );


   return !descriptor ? <></> : (

      <FormGroup>

         <Field name={`__attribute__${descriptor.name}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {descriptor.visible ? (

                     <Label for={`__attribute__${descriptor.name}`}>{descriptor.label}</Label>

                  ) : null}

                  {descriptor.list && descriptor.visible ? (

                     <>
                        <Select
                           {...input}
                           maxMenuHeight={140}
                           menuPlacement="auto"
                           options={options}
                           placeholder={`Select ${descriptor.label}`}
                           styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           isDisabled={descriptor.readOnly}
                           isMulti={true}
                        />

                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>
                     </>

                  ) : (
                     <Input
                        {...input}
                        type={descriptor.visible ? "checkbox" : "hidden"}
                        placeholder={`Enter ${descriptor.label}`}
                        disabled={descriptor.readOnly}
                     />
                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

