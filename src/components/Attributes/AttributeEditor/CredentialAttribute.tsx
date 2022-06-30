import { useEffect, useMemo } from "react";
import { FormGroup, Label } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";

import { selectors as connectorSelectors, actions as connectorActions } from "ducks/connectors";
import { actions as alertActions } from "ducks/alerts";

import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validateRequired } from "utils/validators";
import { FunctionGroupCode } from "types/connectors";

interface Props {
   id: string;
   descriptor: AttributeDescriptorModel,
   attribute: AttributeModel,
   authorityUuid: string,
   connectorUuid: string,
   functionGroup: FunctionGroupCode,
   kind: string
}

export function CredentialAttribute({
   id,
   descriptor: attributeDescriptor,
   attribute,
   authorityUuid,
   connectorUuid,
   functionGroup,
   kind
}: Props): JSX.Element {

   const dispatch = useDispatch();

   const form = useForm();

   const callbackValues = useSelector(connectorSelectors.callbackData);

   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${attributeDescriptor.name}:Credential${uuid}`;
      },
      [attribute, attributeDescriptor.name]

   )

   useEffect(

      () => {

         if (!attribute || !attribute.content) return;

         if ((attributeDescriptor.content && !Array.isArray(attributeDescriptor.content)) || !attributeDescriptor.list || attributeDescriptor.multiSelect || (!attributeDescriptor.content && !attributeDescriptor.callback)) {
            dispatch(alertActions.error(`Attribute descriptor ${attributeDescriptor.name} is invalid`));
            return;
         }

         if (Array.isArray(attribute.content)) {
            dispatch(alertActions.error(`Attribute ${attributeDescriptor.name} has invalid content`));
            return;
         }

         if (attributeDescriptor.callback) {

            dispatch(
               connectorActions.callback({
                  connectorUuid,
                  functionGroup,
                  kind,
                  attributeDescriptor,
               })
            )

         }

         const initialValues = { ...form.getState().values };

         initialValues[`__attribute__${id}__`] = initialValues[`__attribute__${id}__`] || {};
         initialValues[`__attribute__${id}__`][baseFieldId] = { label: attribute.content.value, value: attribute.content };

         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__${id}__.${baseFieldId}`, { label: attribute.content.value, value: attribute.content });

      },

      [baseFieldId, attributeDescriptor, attribute, form, id, dispatch, connectorUuid, functionGroup, kind]
   )


   const options = useMemo(

      () => {

         const key = authorityUuid
            ?
            `${authorityUuid}-${attributeDescriptor.name}`
            :
            `${connectorUuid}-${functionGroup}-${kind}-${attributeDescriptor.name}`;
         ;

         if (callbackValues[key]) {

            const values: { value: any, label: string }[] = callbackValues[key].map(
               (option: any) => ({
                  value: option,
                  label: option.value,
               })
            );

            const currentValue = form.getFieldState(`__attribute__${id}__.${baseFieldId}`)?.value

            if (currentValue) {

               const newValue = values.find(value => value.label === currentValue.label);

               if (newValue) {

                  const initialValues = form.getState().values;

                  initialValues[`__attribute__${id}__`] = initialValues[`__attribute__${id}__`] || {};
                  initialValues[`__attribute__${id}__`][baseFieldId] = newValue;

                  form.setConfig("initialValues", initialValues);
                  form.mutators.setAttribute(`__attribute__${id}__.${baseFieldId}`, newValue);

               }

            }

            return values;

         }

         return (Array.isArray(attributeDescriptor.content) ? attributeDescriptor.content : []).map(

            content => ({
               value: content,
               label: content.value as string
            }) as SingleValue<{ value: any; label: string }>,

         )

      },
      [attributeDescriptor.content, attributeDescriptor.name, authorityUuid, baseFieldId, callbackValues, connectorUuid, form, functionGroup, id, kind]

   )


   const validators: any = useMemo(

      () => {

         const vals = [];

         if (attributeDescriptor.required) vals.push(validateRequired());

         return composeValidators.apply(undefined, vals);

      },

      [attributeDescriptor.required]

   );


   return !attributeDescriptor ? <></> : (

      <FormGroup row={false}>

         <Field name={`__attribute__${id}__.${baseFieldId}`} validate={validators}>

            {({ input, meta }) => (

               <>

                  {attributeDescriptor.visible ? (

                     <Label for={`__attribute__${id}__.${baseFieldId}`}>{attributeDescriptor.label}</Label>

                  ) : null}

                  {!attributeDescriptor.list || !attributeDescriptor.visible ? <></> : (

                     <>
                        <Select
                           {...input}
                           maxMenuHeight={140}
                           menuPlacement="auto"
                           options={options}
                           placeholder={`Select ${attributeDescriptor.label}`}
                           styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           isDisabled={attributeDescriptor.readOnly}
                           isMulti={attributeDescriptor.multiSelect}
                           isClearable={!attributeDescriptor.required}
                        />

                        <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                     </>

                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

