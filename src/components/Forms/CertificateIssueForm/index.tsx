import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Col, Form as BootstrapForm, FormFeedback, FormGroup, FormText, Input, Label, Row, } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { validateRequired } from "utils/validators";
import { mutators } from "utils/attributeEditorMutators";

import { actions as certificateActions, selectors as certificateSelectors } from "ducks/certificates";
import { actions as raProfileActions, selectors as raProfileSelectors, } from "ducks/ra-profiles";
import { actions as connectorsActions, selectors as connectorsSelectors } from "ducks/connectors";

import ProgressButton from "components/ProgressButton";

import Select, { SingleValue } from "react-select";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import { RaProfileModel } from "models/ra-profiles";
import { FormApi } from "final-form";
import { collectFormAttributes } from "utils/attributes";


interface FormValues {
   raProfile: SingleValue<{ label: string; value: RaProfileModel }> | null;
   pkcs10: File | null;
   fileName: string;
   contentType: string;
   file: string;
}


interface Props {
   title: JSX.Element | string;
}


function CertificateForm({
   title
}: Props) {

   const history = useHistory();

   const dispatch = useDispatch();

   const raProfiles = useSelector(raProfileSelectors.raProfiles);
   const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);


   useEffect(() => {

      dispatch(raProfileActions.listRaProfiles());

   }, [dispatch]);


   const onFileLoaded = useCallback(

      (form: FormApi<FormValues>, data, fileName) => {

         const fileInfo = data.target!.result as string;

         const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
         const fileContent = fileInfo.split(",")[1];

         form.mutators.setAttribute("fileName", fileName);
         form.mutators.setAttribute("contentType", contentType);
         form.mutators.setAttribute("file", fileContent);

      },
      []

   );


   const onFileChanged = useCallback(

      (e: React.ChangeEvent<HTMLInputElement>, form: FormApi<FormValues>) => {

         if (!e.target.files || e.target.files.length === 0) return;

         const fileName = e.target.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.target.files[0]);
         reader.onload = (data) => onFileLoaded(form, data, fileName);

      },
      [onFileLoaded]

   )


   const onFileDrop = useCallback(

      (e: React.DragEvent<HTMLDivElement>, form: FormApi<FormValues>) => {

         e.preventDefault();

         if (!e.dataTransfer || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

         const fileName = e.dataTransfer.files[0].name;

         const reader = new FileReader();
         reader.readAsDataURL(e.dataTransfer.files[0]);
         reader.onload = (data) => { onFileLoaded(form, data, fileName); }

      },
      [onFileLoaded]

   )


   const onFileDragOver = useCallback(

      (e: React.DragEvent<HTMLInputElement>) => {

         e.preventDefault();
      },
      []

   )


   const submitCallback = useCallback(

      (values: FormValues) => {

         if (!values.raProfile) return;

         const attributes = collectFormAttributes("issuance_attributes", issuanceAttributeDescriptors[values.raProfile.value.uuid], values);

         dispatch(certificateActions.issueCertificate({
            raProfileUuid: values.raProfile.value.uuid,
            pkcs10: values.file,
            attributes
         }));

      },
      [dispatch, issuanceAttributeDescriptors]

   );


   const onRaProfileChange = useCallback(

      (event: SingleValue<{ label: string; value: RaProfileModel }>) => {

         if (!event) return;
         dispatch(certificateActions.getIssuanceAttributes({ raProfileUuid: event.value.uuid }));

         /*setRaProfUuid(event?.value || "");
         dispatch(actions.requestIssuanceAttributes(event?.value || ""));
         */
      },
      [dispatch]

   );


   const onCancel = useCallback(

      () => {
         history.goBack();
      },
      [history]

   );


   const options = useMemo(

      () => raProfiles.map(

         raProfile => ({
            label: raProfile.name,
            value: raProfile
         })

      ),
      [raProfiles]

   );


   const defaultValues: FormValues = useMemo(

      () => ({
         raProfile: null,
         pkcs10: null,
         fileName: "",
         contentType: "",
         file: ""
      }),
      []

   );


   return (

      <Widget title={title}>

         <Form initialValues={defaultValues} onSubmit={submitCallback} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, valid, submitting, values, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="raProfile">

                     {({ input, meta, onChange }) => (

                        <FormGroup>

                           <Label for="raProfile">RA Profile</Label>

                           <Select
                              {...input}
                              id="raProfile"
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={options}
                              placeholder="Select RA Profile"
                              onChange={e => { onRaProfileChange(e); input.onChange(e) }}
                           />

                        </FormGroup>

                     )}

                  </Field>


                  {

                     !values.raProfile ? <></> : (

                        <>

                           <div className="border border-light rounded mb-0" style={{ padding: "1em", borderStyle: "dashed", borderWidth: "2px" }} onDrop={(e) => onFileDrop(e, form)} onDragOver={onFileDragOver}>

                              <Row>

                                 <Col>

                                    <Field name="fileName">

                                       {({ input, meta }) => (

                                          <FormGroup>

                                             <Label for="fileName">File name</Label>

                                             <Input
                                                {...input}
                                                id="fileName"
                                                type="text"
                                                placeholder="File not selected"
                                                disabled={true}
                                                style={{ textAlign: "center" }}
                                             />

                                          </FormGroup>

                                       )}

                                    </Field>

                                 </Col>

                                 <Col>

                                    <Field name="contentType">

                                       {({ input, meta }) => (

                                          <FormGroup>

                                             <Label for="contentType">Content type</Label>

                                             <Input
                                                {...input}
                                                id="contentType"
                                                type="text"
                                                placeholder="File not selected"
                                                disabled={true}
                                                style={{ textAlign: "center" }}
                                             />

                                          </FormGroup>

                                       )}

                                    </Field>

                                 </Col>

                              </Row>

                              <Field name="file" validate={validateRequired()}>

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="fileContent">File content</Label>

                                       <Input
                                          {...input}
                                          id="fileContent"
                                          type="textarea"
                                          rows={6}
                                          placeholder={`Select or drag & drop a certificate File`}
                                          readOnly={true}
                                       />

                                    </FormGroup>

                                 )}

                              </Field>



                              <FormGroup style={{ textAlign: "right" }}>

                                 <Label className="btn btn-default" for="file" style={{ margin: 0 }}>Select file...</Label>

                                 <Input id="file" type="file" style={{ display: "none" }} onChange={(e) => onFileChanged(e, form)} />

                              </FormGroup>

                              <div className="text-muted" style={{ textAlign: "center", flexBasis: "100%", marginTop: "1rem" }}>
                                 Select or Drag &amp; Drop file to Drop Zone.
                              </div>

                           </div>

                           <AttributeEditor
                              id="issuance_attributes"
                              attributeDescriptors={issuanceAttributeDescriptors[values.raProfile.value.uuid] || []}
                              authorityUuid={values.raProfile.value.authorityInstanceUuid}
                           />


                        </>

                     )

                  }

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title="Create"
                           inProgressTitle="Creating"
                           inProgress={submitting}
                           disabled={!valid}
                        />

                        <Button
                           color="default"
                           onClick={onCancel}
                           disabled={submitting || !valid}
                        >
                           Cancel
                        </Button>


                     </ButtonGroup>

                  </div>

               </BootstrapForm>

            )}

         </Form>

      </Widget>

   );
}

export default CertificateForm;
