import { AttributeContentModel, AttributeDescriptorModel, AttributeModel } from "models/attributes"
import { useEffect, useMemo } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validatePattern, validateRequired } from "utils/validators";

interface Props {
   descriptor: AttributeDescriptorModel;
   attribute?: AttributeModel;
}

export function FileAttribute({
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
         if (descriptor.validationRegex) vals.push(validatePattern(descriptor.validationRegex));

         return composeValidators.apply(undefined, vals);

      },

      [descriptor.required, descriptor.validationRegex]

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
                           isMulti={descriptor.multiSelect}
                        />

                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>
                     </>

                  ) : (
                     <FormGroup style={{display: "flex"}}>

                        <Input
                           {...input}
                           type={descriptor.visible ? "text" : "hidden"}
                           placeholder={`Select ${descriptor.label} File`}
                           disabled={true}
                           style={{flexGrow: 1}}
                        />
                        &nbsp;

                        <Label className="btn btn-default" for="input-file" style={{width: "auto", whiteSpace: "nowrap"}}>Select file...</Label>

                        <Input
                           id="input-file"
                           type="file"
                           style={{display: "none"}}
                           onChange={(e) => {
                              if (!e.target.files || e.target.files.length === 0) return;
                              const reader = new FileReader();
                              reader.onload = (e) => { console.log(e.target!.result); }
                              reader.readAsDataURL(e.target.files[0]);
                           }}
                        />

                     </FormGroup>
                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

