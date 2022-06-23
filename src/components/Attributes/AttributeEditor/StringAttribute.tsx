import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useEffect, useMemo } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validatePattern, validateRequired } from "utils/validators";

interface Props {
   descriptor: AttributeDescriptorModel;
   attribute?: AttributeModel;
}

export function StringAttribute({
   descriptor,
   attribute,
}: Props): JSX.Element {

   const form = useForm();

   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${descriptor.name}:String${uuid}`;
      },
      [attribute, descriptor.name]

   )

   useEffect(

      () => {

         if (!attribute || !attribute.content) return;

         const attributeValue = descriptor.list

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

         const initialValues = { ...form.getState().values };
         initialValues[`__attribute__`] = initialValues[`__attribute__`] || {};
         initialValues[`__attribute__`][baseFieldId] = attributeValue;
         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__.${baseFieldId}`, attributeValue);

      },

      [baseFieldId, descriptor, attribute, form]
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

      <FormGroup row={false}>

         <Field name={`__attribute__.${baseFieldId}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {descriptor.visible ? (

                     <Label for={`__attribute__.${baseFieldId}`}>{descriptor.label}</Label>

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
                           isClearable={!descriptor.required}
                        />

                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                     </>

                  ) : (
                     <>

                        <Input
                           {...input}
                           valid={!meta.error && meta.touched}
                           invalid={!!meta.error && meta.touched}
                           type={descriptor.visible ? "text" : "hidden"}
                           placeholder={`Enter ${descriptor.label}`}
                           disabled={descriptor.readOnly}
                        />

                        <FormFeedback>{meta.error}</FormFeedback>

                     </>
                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

