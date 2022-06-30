import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useDispatch } from "react-redux";

import { actions as alertActions } from "ducks/alerts";

import { useEffect, useMemo } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { Field, useForm } from "react-final-form";
import { composeValidators, validateInteger, validateRequired } from "utils/validators";
import { AttributeContentModel } from "models/attributes/AttributeContentModel";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel;
   attribute?: AttributeModel;
}

export function IntegerAttribute({
   id,
   descriptor,
   attribute,
}: Props): JSX.Element {

   const dispatch = useDispatch();

   const form = useForm();

   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${descriptor.name}:Integer${uuid}`;
      },
      [attribute, descriptor.name]

   )

   useEffect(

      () => {

         if ((descriptor.content && Array.isArray(descriptor.content)) || descriptor.list || descriptor.multiSelect || (!descriptor.content && !descriptor.callback)) {
            dispatch(alertActions.error(`Attribute descriptor ${descriptor.name} is invalid`));
            return;
         }

         if (descriptor.callback) {
            dispatch(alertActions.error(`Attribute descriptor ${descriptor.name} callback not expected`));
            return;
         }

         if (attribute && Array.isArray(attribute.content)) {
            dispatch(alertActions.error(`Attribute ${descriptor.name} has invalid content`));
            return;
         }

         const initialValues = { ...form.getState().values };

         const initialValue = (attribute?.content as AttributeContentModel)?.value || descriptor.content?.value || undefined;

         initialValues[`__attribute__${id}__`] = initialValues[`__attribute__${id}__`] || {};
         initialValues[`__attribute__${id}__`][baseFieldId] = initialValue;

         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__${id}__.${baseFieldId}`, initialValue);

      },

      [descriptor, attribute, form.mutators, id, form, baseFieldId, dispatch]
   )


   const validators: any = useMemo(

      () => {

         const vals = [];

         if (descriptor.required) vals.push(validateRequired());
         vals.push(validateInteger());

         return composeValidators.apply(undefined, vals);

      },

      [descriptor.required]

   );


   return !descriptor ? <></> : (

      <FormGroup>

         <Field name={`__attribute__${id}__.${baseFieldId}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {descriptor.visible ? (

                     <Label for={`__attribute__${id}__.${baseFieldId}`}>&nbsp;{descriptor.label}</Label>

                  ) : null}

                  <Input
                     {...input}
                     id={`__attribute__${id}__.${baseFieldId}`}
                     type={descriptor.visible ? "text" : "hidden"}
                     valid={!meta.error && meta.touched}
                     invalid={!!meta.error && meta.touched}
                  />

                  <FormFeedback>{meta.error}</FormFeedback>

               </>

            )}

         </Field >

      </FormGroup>

   )

}

