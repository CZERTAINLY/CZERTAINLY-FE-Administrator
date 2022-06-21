import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useEffect, useMemo } from "react";
import { FormGroup, Input, Label } from "reactstrap";
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


   useEffect(

      () => {

         if (descriptor.list || descriptor.multiSelect) {
            dispatch(actions.error("Invalid attribute descriptor (secret field can't be multiselect or list"));
            return;
         }

         if (!attribute || !attribute.content || !(attribute.content as AttributeContentModel).value) {
            form.mutators.setAttribute(`__attribute__${descriptor.name}`, undefined);
            return;
         }

         form.mutators.setAttribute(`__attribute__${descriptor.name}`, (attribute.content as AttributeContentModel).value);

      },

      [descriptor, attribute, form.mutators, dispatch]
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

                  <Input
                     {...input}
                     type={descriptor.visible ? "password" : "hidden"}
                     placeholder={`Enter ${descriptor.label}`}
                     disabled={descriptor.readOnly}
                  />

               </>

            )}

         </Field >

      </FormGroup>

   )

}
