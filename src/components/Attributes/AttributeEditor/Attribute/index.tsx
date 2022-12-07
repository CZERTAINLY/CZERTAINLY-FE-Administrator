import { useCallback } from "react";
import { Field, useForm } from "react-final-form";

import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";


import Select from "react-select";

import { composeValidators, validateFloat, validateInteger, validatePattern, validateRequired } from "utils/validators";
import {
    AttributeConstraintType,
    AttributeContentType,
} from "types/openapi";
import { InputType } from "reactstrap/types/lib/Input";
import { DataAttributeModel, RegexpAttributeConstraintModel } from "types/attributes";


interface Props {
   name: string;
   descriptor: DataAttributeModel | undefined;
   options?: { label: string, value: any }[];
}


export function Attribute({
   name,
   descriptor,
   options
}: Props): JSX.Element {

   const form = useForm();


   const onFileLoaded = useCallback(

      (data: ProgressEvent<FileReader>, fileName: string) => {

         const fileInfo = data.target!.result as string;

         const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
         const fileContent = fileInfo.split(",")[1];

         form.mutators.setAttribute(`${name}.value`, fileContent);
         form.mutators.setAttribute(`${name}.fileName`, fileName);
         form.mutators.setAttribute(`${name}.contentType`, contentType);

      },
      [form.mutators, name]

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


   if (!descriptor) return <></>;


   const getFormType = (type: AttributeContentType): InputType => {
       switch (type) {
           case AttributeContentType.Boolean:
               return "checkbox";
           case AttributeContentType.Integer:
           case AttributeContentType.Float:
               return "number";
           case AttributeContentType.String:
           case AttributeContentType.Credential:
           case AttributeContentType.Object:
               return "text";
           case AttributeContentType.Text:
               return "textarea";
           case AttributeContentType.Date:
               return "date";
           case AttributeContentType.Time:
               return "time";
           case AttributeContentType.Datetime:
               return "datetime-local";
           case AttributeContentType.File:
               return "file";
           case AttributeContentType.Secret:
               return "password";
       }
    }

   const buildValidators: any = () => {

      const validators: any[] = [];

      if (descriptor.properties.required) validators.push(validateRequired());
      if (descriptor.contentType === AttributeContentType.Integer) validators.push(validateInteger());
      if (descriptor.contentType === AttributeContentType.Float) validators.push(validateFloat());
      const regexValidator = descriptor.constraints?.find(c => c.type === AttributeConstraintType.RegExp);
        if (regexValidator) {
            validators.push(validatePattern(new RegExp((regexValidator as RegexpAttributeConstraintModel).data ?? "")));
        }

      const composed = composeValidators.apply(undefined, validators);

      return composed;

   };


   const createSelect = (descriptor: DataAttributeModel): JSX.Element => {

      return (

         <Field name={name} validate={buildValidators()} type={getFormType(descriptor.contentType)}>

            {({ input, meta }) => (

               <>

                  {
                     descriptor.properties.visible ? (
                        <Label for={name}>{descriptor.properties.label}{descriptor.properties.required ? " *" : ""}</Label>
                     ) : <></>
                  }

                  <Select
                     {...input}
                     maxMenuHeight={140}
                     menuPlacement="auto"
                     options={options}
                     placeholder={`Select ${descriptor.properties.label}`}
                     styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                     isDisabled={descriptor.properties.readOnly}
                     isMulti={descriptor.properties.multiSelect}
                     isClearable={!descriptor.properties.required}
                  />

                  {
                     descriptor.properties.visible ? (

                        <>
                           <FormText color={descriptor.properties.required ? "dark" : undefined} style={{ marginTop: "0.2em" }}>{descriptor.description}</FormText>

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>
                        </>

                     ) : <></>

                  }


               </>

            )}

         </Field>

      );

   };



   const createFile = (descriptor: DataAttributeModel): JSX.Element => {

      return (

         <>

            {
               descriptor.properties.visible ? (
                  <Label for={`${name}.value`}>{descriptor.properties.label}{descriptor.properties.required ? " *" : ""}</Label>
               ) : <></>
            }

            {!descriptor.properties.visible ? <></> : (

               <div className="border border-light rounded mb-0" style={{ display: "flex", flexWrap: "wrap", padding: "1em", borderStyle: "dashed !important" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>

                  <div style={{ flexGrow: 1 }}>

                     <Label for={`${name}-value`}>File content</Label>

                     <Field name={`${name}.value`} validate={buildValidators()} type={getFormType(descriptor.contentType)}>

                        {({ input, meta }) => (

                           <>

                              <Input
                                 {...input}
                                 id={`${name}-value`}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type={descriptor.properties.visible ? "text" : "hidden"}
                                 placeholder={`Select or drag & drop ${descriptor.properties.label} File`}
                                 readOnly={true}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </>

                        )}


                     </Field>

                     <FormText color={descriptor.properties.required ? "dark" : undefined}>{descriptor.description}</FormText>

                  </div>


                  &nbsp;

                  <div style={{ width: "13rem" }}>

                     <Label for={`${name}-contentType`}>Content type</Label>

                     <Field name={`${name}.contentType`}>

                        {({ input, meta }) => (

                           <Input
                              {...input}
                              id={`${name}-contentType`}
                              type={descriptor.properties.visible ? "text" : "hidden"}
                              placeholder="File not selected"
                              disabled={true}
                              style={{ textAlign: "center" }}
                           />

                        )}

                     </Field>

                  </div>

                  &nbsp;

                  <div style={{ width: "10rem" }}>

                     <Label for={`${name}-fileName`}>File name</Label>

                     <Field name={`${name}.fileName`}>

                        {({ input }) => (

                           <Input
                              {...input}
                              id={`${name}-fileName`}
                              type={descriptor.properties.visible ? "text" : "hidden"}
                              placeholder="File not selected"
                              disabled={true}
                              style={{ textAlign: "center" }}
                           />

                        )}

                     </Field>

                  </div>

                  &nbsp;

                  <div>

                     <Label for={name}>&nbsp;</Label><br />

                     <Label className="btn btn-default" for={name} style={{ margin: 0 }}>Select file...</Label>

                     <Input id={name} type="file" style={{ display: "none" }} onChange={onFileChanged} />

                  </div>

                  <div style={{ flexBasis: "100%", height: 0 }}></div>

                  <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                     Select or Drag &amp; Drop file to Drop Zone.
                  </div>

               </div>
            )}

         </>

      )

   };


   const createInput = (descriptor: DataAttributeModel): JSX.Element => {

      return (

         <Field name={name} validate={buildValidators()} type={getFormType(descriptor.contentType)}>

            {({ input, meta }) => (

               <>

                  {
                     descriptor.properties.visible && descriptor.contentType !== AttributeContentType.Boolean ? (
                        <Label for={name}>{descriptor.properties.label}{descriptor.properties.required ? " *" : ""}</Label>
                     ) : <></>
                  }

                  <Input
                     {...input}
                     id={name}
                     valid={!meta.error && meta.touched}
                     invalid={!!meta.error && meta.touched}
                     type={descriptor.properties.visible ? getFormType(descriptor.contentType) : "hidden"}
                     placeholder={`Enter ${descriptor.properties.label}`}
                     disabled={descriptor.properties.readOnly}
                  />

                  {
                     descriptor.properties.visible && descriptor.contentType === AttributeContentType.Boolean ? (
                        <>&nbsp;<Label for={name}>{descriptor.properties.label}{descriptor.properties.required ? " *" : ""}</Label></>
                     ) : <></>
                  }

                  {
                     descriptor.properties.visible ? (

                        <>
                           <FormText color={descriptor.properties.required ? "dark" : undefined} style={{ marginTop: descriptor.contentType === AttributeContentType.Boolean ? "-0.8em" : "0.2em" }}>{descriptor.description}</FormText>

                           <FormFeedback>{meta.error}</FormFeedback>
                        </>

                     ) : <></>

                  }

               </>

            )}

         </Field >

      );

   };


   const createField = (descriptor: DataAttributeModel): JSX.Element => {

      if (descriptor.properties.list) return createSelect(descriptor);
      if (descriptor.contentType === AttributeContentType.File) return createFile(descriptor);
      return createInput(descriptor);

   };


   return (

      <FormGroup>
         {createField(descriptor)}
      </FormGroup>

   )

}
