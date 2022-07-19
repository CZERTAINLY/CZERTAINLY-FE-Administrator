import { useCallback } from "react";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";
import { Field, useForm } from "react-final-form";
import Select from "react-select";
import { FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { InputType } from "reactstrap/es/Input";
import { AttributeType } from "types/attributes";
import { composeValidators, validateFloat, validateInteger, validatePattern, validateRequired } from "utils/validators";


interface Props {
   name: string;
   descriptor: AttributeDescriptorModel | undefined;
   options?: { label: string, value: any }[];
}


export function Attribute({
   name,
   descriptor,
   options
}: Props): JSX.Element {

   const form = useForm();


   const onFileLoaded = useCallback(

      (data, fileName) => {

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


   const type: { [type in AttributeType]: InputType } = {
      "BOOLEAN": "checkbox",     // not list
      "INTEGER": "number",       // possibly list
      "FLOAT": "number",         // possibly list
      "STRING": "text",          // possibly list
      "TEXT": "textarea",        // not list
      "DATE": "date",            // not list
      "TIME": "time",            // not list
      "DATETIME": "datetime-local",        // not list
      "FILE": "file",            // not list
      "SECRET": "password",      // not list
      "CREDENTIAL": "text",      // list only
      "JSON": "text"             // list only
   }


   const buildValidators: any = () => {

      const validators: any[] = [];

      if (descriptor.required) validators.push(validateRequired());
      if (descriptor.type === "INTEGER") validators.push(validateInteger());
      if (descriptor.type === "FLOAT") validators.push(validateFloat());
      if (descriptor.validationRegex) validators.push(validatePattern(descriptor.validationRegex));

      const composed = composeValidators.apply(undefined, validators);

      return composed;

   };


   const createSelect = (descriptor: AttributeDescriptorModel): JSX.Element => {

      return (

         <Field name={name} validate={buildValidators()} type={type[descriptor.type]}>

            {({ input, meta }) => (

               <>

                  {
                     descriptor.visible ? (
                        <Label for={name}>{descriptor.label}{descriptor.required ? " *" : ""}</Label>
                     ) : <></>
                  }

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

                  {
                     descriptor.visible ? (

                        <>
                           <FormText color={descriptor.required ? "dark" : undefined} style={{ marginTop: "0.2em" }}>{descriptor.description}</FormText>

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>
                        </>

                     ) : <></>

                  }


               </>

            )}

         </Field>

      );

   };



   const createFile = (descriptor: AttributeDescriptorModel): JSX.Element => {

      return (

         <>

            {
               descriptor.visible ? (
                  <Label for={`${name}.value`}>{descriptor.label}{descriptor.required ? " *" : ""}</Label>
               ) : <></>
            }

            {!descriptor.visible ? <></> : (

               <div className="border border-light rounded mb-0" style={{ display: "flex", flexWrap: "wrap", padding: "1em", borderStyle: "dashed !important" }} onDrop={onFileDrop} onDragOver={onFileDragOver}>

                  <div style={{ flexGrow: 1 }}>

                     <Label for={`${name}-value`}>File content</Label>

                     <Field name={`${name}.value`} validate={buildValidators()} type={type[descriptor.type]}>

                        {({ input, meta }) => (

                           <>

                              <Input
                                 {...input}
                                 id={`${name}-value`}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type={descriptor.visible ? "text" : "hidden"}
                                 placeholder={`Select or drag & drop ${descriptor.label} File`}
                                 readOnly={true}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </>

                        )}


                     </Field>

                     <FormText color={descriptor.required ? "dark" : undefined}>{descriptor.description}</FormText>

                  </div>


                  &nbsp;

                  <div style={{ width: "13rem" }}>

                     <Label for={`${name}-contentType`}>Content type</Label>

                     <Field name={`${name}.contentType`}>

                        {({ input, meta }) => (

                           <Input
                              {...input}
                              id={`${name}-contentType`}
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

                     <Label for={`${name}-fileName`}>File name</Label>

                     <Field name={`${name}.fileName`}>

                        {({ input }) => (

                           <Input
                              {...input}
                              id={`${name}-fileName`}
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


   const createInput = (descriptor: AttributeDescriptorModel): JSX.Element => {

      return (

         <Field name={name} validate={buildValidators()} type={type[descriptor.type]}>

            {({ input, meta }) => (

               <>

                  {
                     descriptor.visible && descriptor.type !== "BOOLEAN" ? (
                        <Label for={name}>{descriptor.label}{descriptor.required ? " *" : ""}</Label>
                     ) : <></>
                  }

                  <Input
                     {...input}
                     id={name}
                     valid={!meta.error && meta.touched}
                     invalid={!!meta.error && meta.touched}
                     type={descriptor.visible ? type[descriptor.type] : "hidden"}
                     placeholder={`Enter ${descriptor.label}`}
                     disabled={descriptor.readOnly}
                  />

                  {
                     descriptor.visible && descriptor.type === "BOOLEAN" ? (
                        <>&nbsp;<Label for={name}>{descriptor.label}{descriptor.required ? " *" : ""}</Label></>
                     ) : <></>
                  }

                  {
                     descriptor.visible ? (

                        <>
                           <FormText color={descriptor.required ? "dark" : undefined} style={{ marginTop: descriptor.type === "BOOLEAN" ? "-0.8em" : "0.2em" }}>{descriptor.description}</FormText>

                           <FormFeedback>{meta.error}</FormFeedback>
                        </>

                     ) : <></>

                  }

               </>

            )}

         </Field >

      );

   };


   const createField = (descriptor: AttributeDescriptorModel): JSX.Element => {

      if (descriptor.list) return createSelect(descriptor);
      if (descriptor.type === "FILE") return createFile(descriptor);
      return createInput(descriptor);

   };


   return (

      <FormGroup>
         {createField(descriptor)}
      </FormGroup>

   )

}
