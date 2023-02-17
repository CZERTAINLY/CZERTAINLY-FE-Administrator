import AttributeEditor from "components/Attributes/AttributeEditor";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions as certificateActions, selectors as certificateSelectors } from "ducks/certificates";
import { actions as connectorActions } from "ducks/connectors";
import { actions as keyActions, selectors as keySelectors } from "ducks/cryptographic-keys";
import { actions as cryptographyOperationActions, selectors as cryptographyOperationSelectors } from "ducks/cryptographic-operations";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";
import { actions as tokenProfileActions, selectors as tokenProfileSelectors } from "ducks/token-profiles";
import { FormApi } from "final-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Select, { SingleValue } from "react-select";
import { Button, ButtonGroup, Col, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { CryptographicKeyPairResponseModel } from "types/cryptographic-keys";
import { RaProfileResponseModel } from "types/ra-profiles";
import { TokenProfileResponseModel } from "types/token-profiles";
import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { validateRequired } from "utils/validators";
import { actions as customAttributesActions, selectors as customAttributesSelectors } from "../../../../ducks/customAttributes";
import { transformParseRequestResponseDtoToCertificateResponseDetailModel } from "../../../../ducks/transform/utilsCertificateRequest";
import { actions as utilsCertificateRequestActions, selectors as utilsCertificateRequestSelectors } from "../../../../ducks/utilsCertificateRequest";
import { CertificateDetailResponseModel } from "../../../../types/certificate";
import { KeyType, Resource } from "../../../../types/openapi";
import CertificateAttributes from "../../../CertificateAttributes";
import TabLayout from "../../../Layout/TabLayout";

interface FormValues {
   raProfile: SingleValue<{ label: string; value: RaProfileResponseModel }> | null;
   pkcs10: File | null;
   fileName: string;
   contentType: string;
   file: string;
   uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
   tokenProfile?: SingleValue<{ label: string; value: TokenProfileResponseModel }> | null;
   key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;

}

export default function CertificateForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const raProfiles = useSelector(raProfileSelectors.raProfiles);
   const issuanceAttributeDescriptors = useSelector(certificateSelectors.issuanceAttributes);
   const resourceCustomAttributes = useSelector(customAttributesSelectors.resourceCustomAttributes);
   const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);
   const csrAttributeDescriptors = useSelector(certificateSelectors.csrAttributeDescriptors);
   const signatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.signatureAttributeDescriptors);

   const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

   const keys = useSelector(keySelectors.cryptographicKeyPairs);

   const issuingCertificate = useSelector(certificateSelectors.isIssuing);

   const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
   const [csrAttributesCallbackAttributes, setCsrAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
   const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const parsedCertificateRequest = useSelector(utilsCertificateRequestSelectors.parsedCertificateRequest);
    const [certificate, setCertificate] = useState<CertificateDetailResponseModel | undefined>();

   useEffect(() => {

      dispatch(customAttributesActions.listResourceCustomAttributes(Resource.Certificates));
      dispatch(certificateActions.getCsrAttributes())
      dispatch(raProfileActions.listRaProfiles());
      dispatch(tokenProfileActions.listTokenProfiles({enabled: true}));
      dispatch(connectorActions.clearCallbackData());
       dispatch(utilsCertificateRequestActions.reset());

   }, [dispatch]);

    useEffect(() => {
        setCertificate(parsedCertificateRequest ? transformParseRequestResponseDtoToCertificateResponseDetailModel(parsedCertificateRequest) : undefined);
    }, [parsedCertificateRequest])

   const onFileLoaded = useCallback(

      (form: FormApi<FormValues>, data: { target: any; }, fileName: string) => {

         const fileInfo = data.target!.result as string;

         const contentType = fileInfo.split(",")[0].split(":")[1].split(";")[0];
         const fileContent = fileInfo.split(",")[1];
         dispatch(utilsCertificateRequestActions.parseCertificateRequest(fileContent))

         form.mutators.setAttribute("fileName", fileName);
         form.mutators.setAttribute("contentType", contentType);
         form.mutators.setAttribute("file", fileContent);

      },
      [dispatch]

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
                 csrAttributes: collectFormAttributes("csrAttributes", csrAttributeDescriptors, values),
                 signatureAttributes: collectFormAttributes("signatureAttributes", signatureAttributeDescriptors, values),
                 keyUuid: values.key?.value.uuid,
                 tokenProfileUuid: values.tokenProfile?.value.uuid,
                 customAttributes: collectFormAttributes("customCertificate", resourceCustomAttributes, values),
             },

         }));

      },
      [dispatch, issuanceAttributeDescriptors, groupAttributesCallbackAttributes, resourceCustomAttributes, csrAttributeDescriptors, signatureAttributeDescriptors]

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


   const onTokenProfileChange = useCallback(

      (event: SingleValue<{ label: string; value: TokenProfileResponseModel }>) => {

         if (!event) return;
         dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value.uuid }));
      },
      [dispatch]

   );


   const onKeyChange = useCallback(

      (event: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }>) => {

         if (!event) return;
         if(!event.value.tokenProfileUuid) return;
         if(!event.value.tokenInstanceUuid) return;
         if(event.value.items.filter(e => e.type === KeyType.PrivateKey).length === 0) return;
         dispatch(cryptographyOperationActions.clearSignatureAttributeDescriptors());
         dispatch(cryptographyOperationActions.listSignatureAttributeDescriptors({ 
            uuid: event.value.uuid,
            tokenProfileUuid: event.value.tokenInstanceUuid,
            tokenInstanceUuid: event.value.tokenInstanceUuid,
            keyItemUuid: event.value.items.filter(e => e.type === KeyType.PrivateKey)[0].uuid,
            algorithm: event.value.items.filter(e => e.type === KeyType.PrivateKey)[0].cryptographicAlgorithm,
          }));
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


   const tokenProfileOptions = useMemo(

      () => tokenProfiles.map(

         tokenProfile => ({
            label: tokenProfile.name,
            value: tokenProfile
         })

      ),
      [tokenProfiles]

   );


   const keyOptions = useMemo(

      () => keys.map(

         key => ({
            label: key.name,
            value: key
         })

      ),
      [keys]

   );


   const defaultValues: FormValues = useMemo(

      () => ({
         raProfile: null,
         pkcs10: null,
         fileName: "",
         contentType: "",
         file: "",
      }),
      []

   );


   const inputOptions = useMemo(

      () => ([
               { label: "External", value: true },
               { label: "Existing Key", value: false },
            ]
         ),
      []

   );


   return (

         <Form initialValues={defaultValues} onSubmit={submitCallback} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, valid, submitting, values, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>
                  
                  <Widget title={<h5>Add new <span className="fw-semi-bold">Certificate</span></h5>} busy={issuingCertificate || isFetchingResourceCustomAttributes}>
                  
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

                  <Field name="uploadCsr">

                     {({ input, meta, onChange }) => (

                        <FormGroup>

                           <Label for="uploadCsr">Key Source</Label>
                           <Select
                                 {...input}
                                 id="uploadCsr"
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={inputOptions}
                                 placeholder="Select Key Source"
                                 onChange={e => { input.onChange(e) }}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  </Widget>

                  <Widget title={<h5><span className="fw-semi-bold">Request Properties</span></h5>} busy={issuingCertificate || isFetchingResourceCustomAttributes}>

                     {

                        values.uploadCsr?.value && values.raProfile ? (

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

                            {certificate && <><br /><CertificateAttributes certificate={certificate} /></>}
                         </>


                         ) : <></>

                     }

                     { values.uploadCsr && !values.uploadCsr?.value && values.raProfile ?
                        <>
                        <Field name="tokenProfile" validate={validateRequired()}>

                        {({ input, meta, onChange }) => (

                           <FormGroup>

                              <Label for="tokenProfile">Token Profile</Label>

                              <Select
                                 {...input}
                                 id="tokenProfile"
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={tokenProfileOptions}
                                 placeholder="Select Token Profile"
                                 onChange={e => { onTokenProfileChange(e); input.onChange(e) }}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     { values.tokenProfile ? <Field name="key" validate={validateRequired()}>

                        {({ input, meta, onChange }) => (

                           <FormGroup>

                              <Label for="key">Key</Label>

                              <Select
                                 {...input}
                                 id="key"
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={keyOptions}
                                 placeholder="Select Key"
                                 onChange={e => { onKeyChange(e); input.onChange(e) }}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     : <></>
                     
                     }

                     
      
                     { values.tokenProfile && values.key ? <TabLayout tabs={[
                                {
                                    title: "Request Attributes",
                                    content: (
                                          <AttributeEditor
                                             id="csrAttributes"
                                             attributeDescriptors={csrAttributeDescriptors || []}
                                             groupAttributesCallbackAttributes={csrAttributesCallbackAttributes}
                                             setGroupAttributesCallbackAttributes={setCsrAttributesCallbackAttributes}
                                          />
                                    )
                                 },
                                 {
                                    title: "Signature Attributes",
                                    content: (
                                          <AttributeEditor
                                             id="signatureAttributes"
                                             attributeDescriptors={signatureAttributeDescriptors || []}
                                             groupAttributesCallbackAttributes={signatureAttributesCallbackAttributes}
                                             setGroupAttributesCallbackAttributes={setSignatureAttributesCallbackAttributes}
                                          />
                                    )
                                 }
                              ]}
                           /> : <></>
                           }
                     
                     </>
                     
                     : <></>
                  }

                  </Widget>

                  <Widget title="Other Properties" busy={issuingCertificate || isFetchingResourceCustomAttributes}>

                     <br />
                            <TabLayout tabs={[
                                {
                                    title: "Connector Attributes",
                                    content:
                                        <AttributeEditor
                                            id="issuance_attributes"
                                            attributeDescriptors={issuanceAttributeDescriptors[values.raProfile?.value.uuid || "unknown"] || []}
                                            callbackParentUuid={values.raProfile?.value.authorityInstanceUuid}
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
                                        attributes={values.raProfile?.value.customAttributes}
                                    />
                                }
                            ]} />

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

                  </Widget>

               </BootstrapForm>

            )}

         </Form>

   );
}
