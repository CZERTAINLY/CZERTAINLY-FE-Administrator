import { useEffect, useMemo } from "react";
import { FormGroup, FormText, Label } from "reactstrap";

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
   attribute?: AttributeModel,
   authorityUuid: string,
   connectorUuid: string,
   functionGroup: FunctionGroupCode,
   kind: string
}


export function CredentialAttribute({
   id,
   descriptor,
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
         return `${descriptor.name}:Credential${uuid}`;
      },
      [attribute, descriptor.name]

   )

   useEffect(

      () => {

         if ((descriptor.content && !Array.isArray(descriptor.content)) || !descriptor.list || descriptor.multiSelect || (!descriptor.content && !descriptor.callback)) {
            dispatch(alertActions.error(`Attribute descriptor ${descriptor.name} is invalid`));
            return;
         }

         if (attribute && Array.isArray(attribute.content)) {
            dispatch(alertActions.error(`Attribute ${descriptor.name} has invalid content`));
            return;
         }

         if (descriptor.callback) {

            dispatch(
               connectorActions.callback({
                  connectorUuid,
                  functionGroup,
                  kind,
                  attributeDescriptor: descriptor,
               })
            )

         }

         const initialValues = { ...form.getState().values };

         initialValues[`__attribute__${id}__`] = initialValues[`__attribute__${id}__`] || {};
         initialValues[`__attribute__${id}__`][baseFieldId] = (attribute?.content) && (!Array.isArray(attribute.content)) ? { label: attribute.content.value, value: attribute.content } : undefined;

         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__${id}__.${baseFieldId}`, (attribute?.content) && (!Array.isArray(attribute.content)) ? { label: attribute.content.value, value: attribute.content } : undefined);

      },

      [baseFieldId, descriptor, attribute, form, id, dispatch, connectorUuid, functionGroup, kind]
   )


   const options = useMemo(

      () => {

         const key = authorityUuid
            ?
            `${authorityUuid}-${descriptor.name}`
            :
            `${connectorUuid}-${functionGroup}-${kind}-${descriptor.name}`;
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

         return (Array.isArray(descriptor.content) ? descriptor.content : []).map(

            content => ({
               value: content,
               label: content.value as string
            }) as SingleValue<{ value: any; label: string }>,

         )

      },
      [descriptor.content, descriptor.name, authorityUuid, baseFieldId, callbackValues, connectorUuid, form, functionGroup, id, kind]

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

                  {!descriptor.list || !descriptor.visible ? <></> : (

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

                        <FormText color={ descriptor.required ? "dark" : undefined }>{descriptor.required ? "* " : ""}{descriptor.description}</FormText>

                     </>

                  )}

               </>

            )}

         </Field >

      </FormGroup>

   )

}

