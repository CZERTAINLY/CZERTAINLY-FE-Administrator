import AttributeEditor from "components/Attributes/AttributeEditor";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions as certificateActions, selectors as certificateSelectors } from "ducks/certificates";
import { actions as connectorActions } from "ducks/connectors";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";
import { FormApi } from "final-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Select, { SingleValue } from "react-select";
import { Button, ButtonGroup, Col, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { RaProfileResponseModel } from "types/ra-profiles";
import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { validateRequired } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { Resource } from "../../../../types/openapi";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
   raProfile: SingleValue<{ label: string; value: RaProfileResponseModel }> | null;
   pkcs10: File | null;
   fileName: string;
   contentType: string;
   file: string;
}

export default function CertificateForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const raProfiles = useSelector(raProfileSelectors.raProfiles);
   const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);
    const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

   const issuingCertificate = useSelector(certificateSelectors.isIssuing);

   const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   useEffect(() => {

       dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Certificates));
      dispatch(raProfileActions.listRaProfiles());
      dispatch(connectorActions.clearCallbackData());

   }, [dispatch]);


   const onFileLoaded = useCallback(

      (form: FormApi<FormValues>, data: { target: any; }, fileName: string) => {

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

         const attributes = collectFormAttributes("issuance_attributes", [...(issuanceAttributeDescriptors[values.raProfile.value.uuid] ?? []), ...groupAttributesCallbackAttributes], values);

         dispatch(certificateActions.issueCertificate({
            raProfileUuid: values.raProfile.value.uuid,
            authorityUuid: values.raProfile.value.authorityInstanceUuid,
             signRequest: {
                 pkcs10: values.file,
                 attributes,
                 customAttributes: collectFormAttributes("customCertificate", resourceCustomAttributes, values),
             },

         }));

      },
      [dispatch, issuanceAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes]

   );


   const onRaProfileChange = useCallback(

      (event: SingleValue<{ label: string; value: RaProfileResponseModel }>) => {

         if (!event) return;
          dispatch(connectorActions.clearCallbackData());
          setGroupAttributesCallbackAttributes([]);
         dispatch(certificateActions.getIssuanceAttributes({ raProfileUuid: event.value.uuid, authorityUuid: event.value.authorityInstanceUuid }));

         /*setRaProfUuid(event?.value || "");
         dispatch(actions.requestIssuanceAttributes(event?.value || ""));
         */
      },
      [dispatch]

   );


   const onCancel = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

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

      <Widget title={<h5>Add new <span className="fw-semi-bold">Certificate</span></h5>} busy={issuingCertificate || isFetchingResourceCustomAttributes}>

         <Form initialValues={defaultValues} onSubmit={submitCallback} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, valid, submitting, values, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="raProfile" validate={validateRequired()}>

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

                           <FormFeedback>{meta.error}</FormFeedback>

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

                                       <FormFeedback>{meta.error}</FormFeedback>

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

                            <br />
                            <TabLayout tabs={[
                                {
                                    title: "Connector Attributes",
                                    content:
                                        <AttributeEditor
                                            id="issuance_attributes"
                                            attributeDescriptors={issuanceAttributeDescriptors[values.raProfile.value.uuid] || []}
                                            callbackParentUuid={values.raProfile.value.authorityInstanceUuid}
                                            callbackResource={Resource.RaProfiles}
                                            groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                            setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                        />
                                },
                                {
                                    title: "Custom Attributes",
                                    content: <AttributeEditor
                                        id="customCertificate"
                                        attributeDescriptors={resourceCustomAttributes}
                                        attributes={values.raProfile.value.customAttributes}
                                    />
                                }
                            ]} />


                        </>

                     )

                  }

                  <br />

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title="Create"
                           inProgressTitle="Creating"
                           inProgress={submitting || issuingCertificate}
                           disabled={!valid}
                        />

                        <Button
                           color="default"
                           onClick={onCancel}
                           disabled={submitting}
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
