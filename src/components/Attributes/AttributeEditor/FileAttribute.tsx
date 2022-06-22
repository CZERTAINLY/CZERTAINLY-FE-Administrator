import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { AttributeModel } from "models/attributes/AttributeModel";

import { useCallback, useEffect, useMemo } from "react";
import { FormFeedback, FormGroup, Input, Label } from "reactstrap";
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


   const baseFieldId = useMemo(

      () => {
         const uuid = attribute ? `:${attribute.uuid}` : "";
         return `${descriptor.name}:File${uuid}`;
      },
      [attribute, descriptor.name]

   )


   const onFileLoaded = useCallback(

      (data, fileName) => {

         const fileInfo = data.target!.result as string;

         const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
         const fileContent = fileInfo.split(",")[1];

         form.mutators.setAttribute(`__attribute__.${baseFieldId}.value`, fileContent);
         form.mutators.setAttribute(`__attribute__.${baseFieldId}.fileName`, fileName);
         form.mutators.setAttribute(`__attribute__.${baseFieldId}.contentType`, contentType);

      },
      [baseFieldId, form.mutators]

   );



   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const fileName = e.target.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = (data) => onFileLoaded(data, fileName);

      },
      [onFileLoaded]

   )


   const onFileDrop = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(data, fileName); }
      },
      [onFileLoaded]

   )


   const onFileDragOver = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();
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


   const setupAttributeDefaultValues = useCallback(

      () => {


         const fileContent = attribute && (attribute.content as FileAttributeContentModel).value
            ?
            (attribute.content as FileAttributeContentModel).value
            :
            descriptor.content && (descriptor.content as FileAttributeContentModel).value
               ?
               (descriptor.content as FileAttributeContentModel).value
               :
               "";

         const fileName = attribute && (attribute.content as FileAttributeContentModel).fileName
            ?
            (attribute.content as FileAttributeContentModel).fileName
            :
            descriptor.content && (descriptor.content as FileAttributeContentModel).fileName
               ?
               (descriptor.content as FileAttributeContentModel).fileName
               :
               fileContent
                  ?
                  "Unknown"
                  :
                  "";

         const contentType = attribute && (attribute.content as FileAttributeContentModel).contentType
            ?
            (attribute.content as FileAttributeContentModel).contentType
            :
            descriptor.content && (descriptor.content as FileAttributeContentModel).contentType
               ?
               (descriptor.content as FileAttributeContentModel).contentType
               :
               fileContent
                  ?
                  "Unknown"
                  :
                  "";

         const initialValues = { ...form.getState().values };

         initialValues["__attribute__"] = initialValues["__attribute__"] || {};
         initialValues["__attribute__"][baseFieldId] = initialValues["__attribute__"][baseFieldId] || {};
         initialValues["__attribute__"][baseFieldId].value = fileContent;
         initialValues["__attribute__"][baseFieldId].fileName = fileName;
         initialValues["__attribute__"][baseFieldId].contentType = contentType;

         form.setConfig("initialValues", initialValues);

         form.mutators.setAttribute(`__attribute__.${baseFieldId}.value`, fileContent);
         form.mutators.setAttribute(`__attribute__.${baseFieldId}.fileName`, fileName);
         form.mutators.setAttribute(`__attribute__.${baseFieldId}.contentType`, contentType);

      },
      [baseFieldId, descriptor.content, attribute, form]

   )


   useEffect(

      () => {
         setupAttributeDefaultValues();
      },

      [descriptor, attribute, form.mutators, setupAttributeDefaultValues]
   )


   return !descriptor || !descriptor.visible ? <></> : (

      <>

         <FormGroup>

            <Label>{descriptor.label}</Label>

            {!descriptor.visible ? <></> : (
               <div className="border border-light rounded mb-0" style={{ display: "flex", flexWrap: "wrap", padding: "1em", borderStyle: "dashed !important" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>

                  <div style={{ flexGrow: 1 }}>

                     {descriptor.visible ? (<Label for={`__attribute__.${baseFieldId}.value`}>File content</Label>) : null}

                     <Field name={`__attribute__.${baseFieldId}.value`} validate={validators}>

                        {({ input, meta }) => (

                           <>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type={descriptor.visible ? "text" : "hidden"}
                                 placeholder={`Select or drag & drop ${descriptor.label} File`}
                                 readOnly={true}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </>

                        )}

                     </Field >

                  </div>


                  &nbsp;

                  <div style={{ width: "13rem" }}>

                     {descriptor.visible ? (<Label for={`__attribute__.${baseFieldId}.contentType`}>Content type</Label>) : null}

                     <Field name={`__attribute__.${baseFieldId}.contentType`} validate={validators}>

                        {({ input, meta }) => (

                              <Input
                                 {...input}
                                 type={descriptor.visible ? "text" : "hidden"}
                                 placeholder="File not selected"
                                 disabled={true}
                                 style={{ textAlign: "center" }}
                              />

                        )}

                     </Field>

                  </div>

                  &nbsp;

                  <div style={{ width: "10rem" }}>

                     {descriptor.visible ? (<Label for={`__attribute__.${baseFieldId}.contentType`}>File name</Label>) : null}

                     <Field name={`__attribute__.${baseFieldId}.fileName`} validate={validators}>

                        {({ input }) => (

                           <Input
                              {...input}
                              type={descriptor.visible ? "text" : "hidden"}
                              placeholder="File not selected"
                              disabled={true}
                              style={{ textAlign: "center" }}
                           />

                        )}

                     </Field>

                  </div>

                  &nbsp;

                  <div>

                     <Label for="input-file">&nbsp;</Label><br />

                     <Label className="btn btn-default" for="input-file" style={{ margin: 0 }}>Select file...</Label>

                     <Input id="input-file" type="file" style={{ display: "none" }} onChange={onFileChanged} />

                  </div>

                  <div style={{ flexBasis: "100%", height: 0 }}></div>

                  <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                     Select or Drag &amp; Drop file to Drop Zone.
                  </div>

               </div>
            )}

         </FormGroup>

      </>

   )

}

