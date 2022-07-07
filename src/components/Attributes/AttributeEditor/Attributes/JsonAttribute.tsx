import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useEffect, useMemo } from "react";
import { FormGroup, FormText, Label } from "reactstrap";
import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validateRequired } from "utils/validators";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel,
   attribute?: AttributeModel
}

export function JsonAttribute({
   id,
   descriptor,
   attribute,
}: Props): JSX.Element {

   const form = useForm();

   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${descriptor.name}:Json${uuid}`;
      },
      [attribute, descriptor.name]

   )

   useEffect(

      () => {

         if (!attribute || !attribute.content) return;

         const attributeValue = descriptor.list

            ?

            descriptor.multiSelect && Array.isArray(attribute.content)

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

         initialValues[`__attribute__${id}__`] = initialValues[`__attribute__${id}__`] || {};
         initialValues[`__attribute__${id}__`][baseFieldId] = attributeValue;

         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__${id}__.${baseFieldId}`, attributeValue);

      },

      [baseFieldId, descriptor, attribute, form, id]
   )


   const options = useMemo(

      () => (Array.isArray(descriptor.content) ? descriptor.content : []).map(

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

         return composeValidators.apply(undefined, vals);

      },

      [descriptor.required]

   );


   return !descriptor ? <></> : (

      <FormGroup row={false}>

         <Field name={`__attribute__${id}__.${baseFieldId}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {descriptor.visible ? (

                     <Label for={`__attribute__${id}__.${baseFieldId}`}>{descriptor.label}</Label>

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

                        <FormText color={descriptor.required ? "dark" : undefined}>{descriptor.required ? "* " : ""}{descriptor.description}</FormText>

                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                     </>

                  ) : (
                     <></>
                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

