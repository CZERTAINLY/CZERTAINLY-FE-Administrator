import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as clientActions, selectors as clientSelectors } from "ducks/clients";
import { actions as certActions, selectors as certSelectors } from "ducks/certificates";

import { CertificateModel } from "models/certificate";
import { ClientModel } from "models";

import { emptyCertificate } from "utils/certificate";
import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

interface FormValues {
   name: string;
   description: string;
   enabled: boolean;
   certFile: FileList | undefined;
   inputType: { value: "upload" | "select" };
   certificate: any;
}

interface Props {
   title: JSX.Element;
}

const optionsForInput = [
   {
      label: "Upload a new Certificate",
      value: "upload",
   },
   {
      label: "Choose Existing Certificate",
      value: "select",
   },
]

function ClientForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const certSelectRef = useRef<any>();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = params.id !== undefined;

   const isFetchingCertsList = useSelector(certSelectors.isFetchingList);
   const certificates = useSelector(certSelectors.certificates);

   const isFetchingClientDetail = useSelector(clientSelectors.isFetchingDetail);
   const clientSelector = useSelector(clientSelectors.client);

   const isCreating = useSelector(clientSelectors.isCreating);
   const isUpdating = useSelector(clientSelectors.isUpdating);

   const [loadedCerts, setLoadedCerts] = useState<CertificateModel[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [client, setClient] = useState<ClientModel>();

   const [optionsForCertificate, setOptionsForCertificte] = useState<{ label: string, value: string }[]>([]);

   /* Load first page of certificates */

   useEffect(() => {

      dispatch(
         certActions.listCertificates({
            itemsPerPage: 100,
            pageNumber: 1,
            filters: [],
         })
      );

   }, [dispatch]);

   /* Load client or copy it to client state, if it was just loaded */

   useEffect(() => {

      if (params.id && (!clientSelector || clientSelector.uuid !== params.id)) dispatch(clientActions.getClientDetail(params.id));

      if (params.id && clientSelector?.uuid === params.id) {

         setClient(clientSelector);

         // !!!! THIS IS DANGEROUS AND DOES NOT NEED TO BE WORKING EVERYTIME !!!!
         // !!!! IT HAS TO BE HERE AS IT IS CAUSED BY USING SHITTY FINAL-FORM COMPONENT !!!
         // !!!! WHICH DOES NOT ALLOW TO SET A SELECT VALUE ASYNCHRONOUSLY AFTER SOME DATA ARE LOADED !!!
         if (editMode) {

            if (!loadedCerts.find(cert => cert.uuid === clientSelector.certificate.uuid)) {
               setLoadedCerts([...loadedCerts, clientSelector.certificate]);
            }

            certSelectRef.current?.setValue({
               label: clientSelector.certificate.commonName || `( empty ) ( ${clientSelector.certificate.serialNumber} )`,
               value: clientSelector.certificate.uuid,
            });

         }

      } else {

         if (!client) setClient({
            uuid: "",
            serialNumber: "",
            name: "",
            description: "",
            enabled: false,
            certificate: emptyCertificate
         });

      }

      // loadedCerts dependedncy not needed and would cause loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editMode, params.id, client, clientSelector, dispatch]);


   /* Process fetched certs and store them to loaded certs, also add admin cert if not in list */

   useEffect(() => {

      const fpc = certificates.filter(
         pagedCert => loadedCerts.find(loadedCert => loadedCert.uuid === pagedCert.uuid) === undefined
      )

      const certs = [...loadedCerts, ...fpc];

      setLoadedCerts(certs);

      setOptionsForCertificte(

         certs.filter(
            loadedCert => !["expired", "revoked", "invalid"].includes(loadedCert.status || "unknown")
         ).map(
            loadedCert => ({
               label: loadedCert.commonName || `( empty ) ( ${loadedCert.serialNumber} )`,
               value: loadedCert.uuid,
            })
         )

      );

      // loadedCert dependedncy not needed and would cause loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [certificates]);


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(
               clientActions.updateClient({
                  uuid: client!.uuid,
                  description: values.description,
                  certificateUuid: values.inputType.value === "select" ? values.certificate.value : undefined,
                  certificate: values.inputType.value === "upload" ? values.certFile : undefined
               })
            );

         } else {

            dispatch(
               clientActions.createClient({
                  name: values.name,
                  description: values.description,
                  certificateUuid: values.inputType.value === "select" ? values.certificate.value : undefined,
                  certificate: values.inputType.value === "upload" ? values.certFile : undefined
               })
            );

         }

      },
      [client, editMode, dispatch]

   );


   const onCancel = () => {

      history.goBack();

   }


   const loadNextCertificates = () => {

      if (loadedCerts.length === 0) return;

      dispatch(
         certActions.listCertificates({
            itemsPerPage: 100,
            pageNumber: currentPage,
            filters: [],
         })
      );

      setCurrentPage(currentPage + 1);

   };


   const submitTitle = editMode ? "Save" : "Create";

   const inProgressTitle = editMode ? "Saving..." : "Creating...";

   const defaultValues = {
      name: editMode ? client?.name : "",
      inputType: editMode ? optionsForInput[1] : optionsForInput[0]
   }


   return (

      <Widget title={title} busy={isFetchingClientDetail || isFetchingCertsList}>

         <Form onSubmit={onSubmit} initialValues={defaultValues}>

            {({ handleSubmit, pristine, submitting, values }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())} >

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Client Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Client Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  <Field name="inputType">

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="inputType">Input Type</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForInput}
                              placeholder="Select Input Type"
                           />
                        </FormGroup>
                     )}
                  </Field>

                  {values.inputType.value === "upload" ? (

                     <Field name="certFile" validate={editMode ? undefined : validateRequired()}>

                        {({ input: { value, onChange, ...inputProps }, meta }) => (

                           <FormGroup>

                              <Label for="certFile">Upload Client Certificate</Label>

                              <Input
                                 {...inputProps}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="file"
                                 onChange={({ target }) => onChange(target.files)}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                              <FormText color="muted">
                                 Upload certificate of client based on which will be
                                 authenticated to RA profile.
                              </FormText>

                           </FormGroup>

                        )}

                     </Field>

                  ) :
                     (
                        <Field name="certificate">

                           {({ input, meta }) => (

                              <FormGroup>

                                 <Label for="inputType">Certificate</Label>

                                 <Select
                                    {...input}
                                    ref={certSelectRef}
                                    maxMenuHeight={140}
                                    menuPlacement="auto"
                                    options={optionsForCertificate}
                                    placeholder="Select Certificate"
                                    onMenuScrollToBottom={loadNextCertificates}
                                    styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                                 />

                                 <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                              </FormGroup>
                           )}
                        </Field>
                     )}

                  <Field name="description">

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="description">Description</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="textarea"
                              placeholder="Description / Comment"
                           />

                        </FormGroup>

                     )}

                  </Field>

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={submitTitle}
                           inProgressTitle={inProgressTitle}
                           inProgress={submitting || isCreating || isUpdating}
                           disabled={pristine}
                        />

                        <Button color="default" onClick={onCancel} disabled={submitting || isCreating || isUpdating}>
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

export default ClientForm;
