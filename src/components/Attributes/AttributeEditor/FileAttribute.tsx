import { AttributeContentModel } from "models/attributes/AttributeContentModel";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useCallback, useEffect, useMemo } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import Select, { SingleValue } from "react-select";
import { Field, useForm } from "react-final-form";
import { composeValidators, validatePattern, validateRequired } from "utils/validators";
import { FileAttributeContentModel } from "models/attributes/FileAttributeContentModel";

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

         form.mutators.setAttribute(`__attribute__${descriptor.name}.file`,

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


   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>, attributeIdentifier: string) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);

         reader.onload = (e) => {
            console.log(e.target!.result);
         }

      },
      []

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


   const createFields = useCallback(

      (
         index: number | undefined,
         attributeName: string,
         attributeUUID: string | undefined,
         attributeData: FileAttributeContentModel | undefined,
         attributeLabel: string,
         isVisible: boolean,
         isReadOnly: boolean,
         validators
      ) => {

         const _uuid = attributeUUID ? `:${attributeUUID}` : "";
         const _index = index ? `[${index}]` : "";

         const attributeIdentifier = `__attribute__.${attributeName}${_uuid}${_index}`;

         return (

            <FormGroup>

               {isVisible ? (<Label for={`${attributeIdentifier}.file`}>{attributeLabel}</Label>) : null}

               <div style={{ display: "flex" }}>

                  <Field name={`${attributeIdentifier}.file`} validate={validators}>

                     {({ input, meta }) => (

                        <Input
                           {...input}
                           type={descriptor.visible ? "text" : "hidden"}
                           placeholder={`Select ${descriptor.label} File`}
                           disabled={true}
                           style={{ flexGrow: 1 }}
                        />

                     )}

                  </Field >

                  &nbsp;

                  <Field name={`${attributeIdentifier}.contentType`} validate={validators}>

                     {({ input }) => (

                        <Input
                           {...input}
                           type={descriptor.visible ? "text" : "hidden"}
                           placeholder="Content Type"
                           style={{ width: "8rem", textAlign: "center" }}
                           disabled={true}
                        />

                     )}

                  </Field>

                  &nbsp;

                  <Field name={`${attributeIdentifier}.fileName`} validate={validators}>

                     {({ input }) => (

                        <Input
                           {...input}
                           type={descriptor.visible ? "text" : "hidden"}
                           placeholder="File Name"
                           style={{ width: "8rem", textAlign: "center" }}
                           disabled={true}
                        />

                     )}

                  </Field>

                  &nbsp;

                  <Label className="btn btn-default" for="input-file" style={{ width: "auto", whiteSpace: "nowrap", display: "block" }}>Select file...</Label>

                  <Input id="input-file" type="file" style={{ display: "none" }} onChange={(e) => onFileChanged(e, attributeIdentifier)} />

               </div>

            </FormGroup>

         )

      },
      []

   )


   return !descriptor ? <></> : (

      <>
         {
            createFields(
               undefined,
               descriptor.name,
               attribute ? attribute.uuid : undefined,
               attribute ? attribute.content as FileAttributeContentModel : undefined,
               descriptor.label,
               descriptor.visible,
               descriptor.readOnly,
               validators
            )
         }
      </>

   )

}

