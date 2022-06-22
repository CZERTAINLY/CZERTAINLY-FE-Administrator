import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useEffect, useMemo } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { Field, useForm } from "react-final-form";
import { composeValidators, validatePattern, validateRequired } from "utils/validators";
import { useDispatch } from "react-redux";
import { actions } from "ducks/alerts";

interface Props {
   descriptor: AttributeDescriptorModel;
   attribute?: AttributeModel;
}

export function SecretAttribute({
   descriptor,
   attribute,
}: Props): JSX.Element {

   const form = useForm();
   const dispatch = useDispatch();

   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${descriptor.name}:Secret${uuid}`;
      },
      [attribute, descriptor.name]

   )

   useEffect(

      () => {

         if (descriptor.list || descriptor.multiSelect) {
            dispatch(actions.error("Invalid attribute descriptor (secret field can't be multiselect or list"));
            return;
         }

         if (!attribute || !attribute.content || !(attribute.content as AttributeContentModel).value) {
            form.mutators.setAttribute(`__attribute__.${baseFieldId}`, undefined);
            return;
         }

         const initialValues = { ...form.getState().values };
         initialValues[`__attribute__`] = initialValues[`__attribute__`] || {};
         initialValues[`__attribute__`][baseFieldId] = (attribute.content as AttributeContentModel).value;
         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__.${baseFieldId}`, (attribute.content as AttributeContentModel).value);

      },

      [baseFieldId, descriptor, attribute, form, dispatch]
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

         <Field name={`__attribute__.${baseFieldId}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {descriptor.visible ? (

                     <Label for={`__attribute__.${baseFieldId}`}>{descriptor.label}</Label>

                  ) : null}

                  <Input
                     {...input}
                     valid={!meta.error && meta.touched}
                     invalid={!!meta.error && meta.touched}
                     type={descriptor.visible ? "password" : "hidden"}
                     placeholder={`Enter ${descriptor.label}`}
                     disabled={descriptor.readOnly}
                  />

                  <FormFeedback>{meta.error}</FormFeedback>

               </>

            )}

         </Field >

      </FormGroup>

   )

}
