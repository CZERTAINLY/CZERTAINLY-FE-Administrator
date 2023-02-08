import AttributeEditor from "components/Attributes/AttributeEditor";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";

import { actions as certificateActions, selectors as certificateSelectors } from "ducks/certificates";
import { actions as connectorActions } from "ducks/connectors";
import { actions as cryptographyOperationActions, selectors as cryptographyOperationSelectors } from "ducks/cryptographic-operations";
import { actions as tokenProfileActions, selectors as tokenProfileSelectors } from "ducks/token-profiles";
import { actions as keyActions, selectors as keySelectors } from "ducks/cryptographic-keys";
import { FormApi } from "final-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Field, Form } from "react-final-form";

import { useDispatch, useSelector } from "react-redux";

import Select, { SingleValue } from "react-select";
import { Button, ButtonGroup, Col, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { validateRequired } from "utils/validators";
import { CryptographicKeyPairResponseModel } from "types/cryptographic-keys";
import { CertificateDetailResponseModel } from "types/certificate";
import { KeyType } from "types/openapi";
import TabLayout from "components/Layout/TabLayout";

interface FormValues {
   pkcs10: File | null;
   fileName: string;
   contentType: string;
   file: string;
   uploadCsr?: SingleValue<{ label: string; value: boolean }> | null;
   tokenProfile?: SingleValue<{ label: string; value: string }> | null;
   key?: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }> | null;

}

interface props {
   onCancel: () => void;
   certificate?: CertificateDetailResponseModel;
}


export default function CertificateRekeyDialog(  { onCancel, certificate }: props) {

   const dispatch = useDispatch();

   const isFetchingCsrAttributes = useSelector(certificateSelectors.isFetchingIssuanceAttributes);
   const isFetchingSignatureAttributes = useSelector(cryptographyOperationSelectors.isFetchingSignatureAttributes);
   const csrAttributeDescriptors = useSelector(certificateSelectors.csrAttributeDescriptors);
   const signatureAttributeDescriptors = useSelector(cryptographyOperationSelectors.signatureAttributeDescriptors);

   const tokenProfiles = useSelector(tokenProfileSelectors.tokenProfiles);

   const keys = useSelector(keySelectors.cryptographicKeyPairs);

   const rekeying = useSelector(certificateSelectors.isRekeying);

   const [csrAttributesCallbackAttributes, setCsrAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
   const [signatureAttributesCallbackAttributes, setSignatureAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   useEffect(() => {

      dispatch(certificateActions.getCsrAttributes())
      dispatch(tokenProfileActions.listTokenProfiles({enabled: true}));
      if(certificate?.key?.tokenProfileUuid) {
         dispatch(keyActions.listCryptographicKeyPairs({tokenProfileUuid: certificate.key.tokenProfileUuid}));
      }
      dispatch(connectorActions.clearCallbackData());

   }, [dispatch, certificate?.key?.tokenProfileUuid, certificate?.key]);


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
         if(!certificate) return;
         if (!certificate.raProfile) return;
         if (!values.uploadCsr?.value && !values.tokenProfile) return;
         if (!values.uploadCsr?.value && !values.key) return;
         if (!certificate.raProfile.authorityInstanceUuid) return;
         if (!values.uploadCsr?.value && values.key?.value.uuid === certificate.key?.uuid) return;

         dispatch(certificateActions.rekeyCertificate({
            uuid: certificate.uuid,
            raProfileUuid: certificate.raProfile.uuid,
            authorityUuid: certificate.raProfile.authorityInstanceUuid,
            rekey : {
                 pkcs10: values.file ? values.file : undefined,
                 csrAttributes: collectFormAttributes("csrAttributes", csrAttributeDescriptors, values),
                 signatureAttributes: collectFormAttributes("signatureAttributes", signatureAttributeDescriptors, values),
                 keyUuid: values.key?.value.uuid || "",
                 tokenProfileUuid: values.tokenProfile?.value || ""  ,
             },

         }));
         onCancel();
      },
      [dispatch, certificate, csrAttributeDescriptors, signatureAttributeDescriptors, onCancel]

   );


   const onTokenProfileChange = useCallback(

      (event: SingleValue<{ label: string; value: string }>) => {

         if (!event) return;
         dispatch(keyActions.listCryptographicKeyPairs({ tokenProfileUuid: event.value }));
      },
      [dispatch]

   );


   const onKeyChange = useCallback(

      (event: SingleValue<{ label: string; value: CryptographicKeyPairResponseModel }>) => {

         if (!event) return;
         if(!event.value.tokenProfileUuid) return;
         if(!event.value.tokenInstanceUuid) return;
         if(event.value.items.filter(e => e.type === KeyType.PrivateKey).length === 0) return;
         dispatch(cryptographyOperationActions.clearSignatureAttributeDescriptors())
         dispatch(cryptographyOperationActions.listSignatureAttributeDescriptors({ 
            uuid: event.value.uuid,
            tokenProfileUuid: event.value.tokenProfileUuid,
            tokenInstanceUuid: event.value.tokenInstanceUuid,
            keyItemUuid: event.value.items.filter(e => e.type === KeyType.PrivateKey)[0].uuid,
            algorithm: event.value.items.filter(e => e.type === KeyType.PrivateKey)[0].cryptographicAlgorithm,
          }));
      },
      [dispatch]

   );


   const tokenProfileOptions = useMemo(

      () => tokenProfiles.map(

         tokenProfile => ({
            label: tokenProfile.name,
            value: tokenProfile.uuid
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
         pkcs10: null,
         fileName: "",
         contentType: "",
         file: "",
         key: certificate?.key ? {
            label: certificate.key.name,
            value: certificate.key
         } : null,
         tokenProfile: certificate?.key?.tokenProfileUuid ? {
            label: certificate.key.tokenProfileName || "",
            value: certificate.key.tokenProfileUuid || ""
         } : null,
      }),
      [certificate?.key]

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

                  <Widget title={<h5>Rekey <span className="fw-semi-bold">Certificate</span></h5>} busy={rekeying || isFetchingCsrAttributes || isFetchingSignatureAttributes}>

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

                  <Widget title={<h5><span className="fw-semi-bold">Request Properties</span></h5>}>
                     {

                        values.uploadCsr?.value && certificate?.raProfile ? (

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

                           </>
                        ) : <></>

                     }

                     { values.uploadCsr && !values.uploadCsr?.value ?
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

                     <Field name="key" validate={validateRequired()}>

                        {({ input, meta, onChange }) => (

                           <FormGroup>

                              <Label for="key">Select Key</Label>

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

                     { values.tokenProfile && values.key ? <TabLayout tabs={[
                                {
                                    title: "Request Attributes",
                                    content: (
                                          <AttributeEditor
                                             id="csrAttributes"
                                             attributeDescriptors={csrAttributeDescriptors || []}
                                             groupAttributesCallbackAttributes={csrAttributesCallbackAttributes}
                                             setGroupAttributesCallbackAttributes={setCsrAttributesCallbackAttributes}
                                             attributes={certificate?.csrAttributes}
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

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title="Rekey"
                           inProgressTitle="Rekeying..."
                           inProgress={submitting || rekeying}
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
