import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as adminActions, selectors as adminSelectors } from "ducks/administrators";
import { actions as certActions, selectors as certSelectors } from "ducks/certificates";

import { AdministratorModel, CertificateModel } from "models";

import { emptyCertificate } from "utils/certificate";
import { validateRequired, composeValidators, validateAlphaNumeric, validateEmail } from "utils/validators";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   name: string;
   surname: string;
   username: string;
   email: string;
   description: string;
   superAdmin: boolean;
   enabled: boolean;
   certFile: FileList | undefined;
   inputType: { value: "upload" | "select" };
   certificate: any;
}


function AdminForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = params.id !== undefined;

   const optionsForInput = useMemo(
      () => [
         {
            label: "Upload a new Certificate",
            value: "upload",
         },
         {
            label: "Choose Existing Certificate",
            value: "select",
         },
      ],
      []
   );


   const isFetchingCertsList = useSelector(certSelectors.isFetchingList);
   const certificates = useSelector(certSelectors.certificates);

   const isFetchingAdminDetail = useSelector(adminSelectors.isFetchingDetail);
   const administratorSelector = useSelector(adminSelectors.admininistrator);

   const isCreatingAdmin = useSelector(adminSelectors.isCreating);
   const isUpdatingAdmin = useSelector(adminSelectors.isUpdating);

   const [loadedCerts, setLoadedCerts] = useState<CertificateModel[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [administrator, setAdministrator] = useState<AdministratorModel>();

   const [optionsForCertificate, setOptionsForCertificte] = useState<{ label: string, value: string }[]>([]);

   const [, setInputTypeValue] = useState<{ label: string, value: string }>(editMode ? optionsForInput[1] : optionsForInput[0]);

   const [selectedCertificate, setSelectedCertificate] = useState<{ label: string, value: string }>();

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

   /* Load administrator or copy it to administrator state, if it was just loaded */

   useEffect(() => {

      if (params.id && (!administratorSelector || administratorSelector.uuid !== params.id)) dispatch(adminActions.getAdminDetail(params.id));

      if (params.id && administratorSelector?.uuid === params.id) {

         setAdministrator(administratorSelector);

         if (editMode) {

            if (administrator && administrator.certificate && administrator.certificate.uuid && !loadedCerts.find(cert => cert.uuid === administrator.certificate.uuid)) {

               const certs = [administrator.certificate, ...loadedCerts];

               setLoadedCerts(certs);

               setOptionsForCertificte(certs.map(loadedCert => ({
                  label: loadedCert.commonName || `( empty ) ( ${loadedCert.serialNumber} )`,
                  value: loadedCert.uuid,
               })))

            }

            setSelectedCertificate({
               label: administratorSelector.certificate.commonName || `( empty ) ( ${administratorSelector.certificate.serialNumber} )`,
               value: administratorSelector.certificate.uuid,
            });

         }

      } else {

         if (!administrator) setAdministrator({
            uuid: "",
            serialNumber: "",
            username: "",
            name: "",
            surname: "",
            description: "",
            email: "",
            role: "administrator",
            enabled: false,
            certificate: emptyCertificate
         });

      }

      // loadedCerts dependedncy not needed and would cause loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [editMode, params.id, administrator, administratorSelector, dispatch]);


   /* Process fetched certs and store them to loaded certs */

   useEffect(() => {

      const fpc = certificates.filter(
         pagedCert => !["expired", "revoked", "invalid"].includes(pagedCert.status)
      ).filter(
         pagedCert => loadedCerts.find(loadedCert => loadedCert.uuid === pagedCert.uuid) === undefined
      )

      const certs = [...loadedCerts, ...fpc];

      setLoadedCerts(certs);

      setOptionsForCertificte(

         certs.map(
            loadedCert => ({
               label: loadedCert.commonName || `( empty ) ( ${loadedCert.serialNumber} )`,
               value: loadedCert.uuid,
            })
         )

      );

      setCurrentPage(currentPage + 1);

      // loadedCert dependedncy not needed and would cause loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [certificates]);


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(
               adminActions.updateAdmin({
                  uuid: administrator!.uuid,
                  username: values.username,
                  name: values.name,
                  surname: values.surname,
                  email: values.email,
                  role: values.superAdmin ? "superAdministrator" : "administrator",
                  description: values.description,
                  certificateUuid: values.inputType.value === "select" ? values.certificate.value : undefined,
                  certificate: values.inputType.value === "upload" ? values.certFile : undefined
               })
            );

         } else {

            dispatch(
               adminActions.createAdmin({
                  username: values.username,
                  name: values.name,
                  surname: values.surname,
                  email: values.email,
                  role: values.superAdmin ? "superAdministrator" : "administrator",
                  description: values.description,
                  certificate: values.inputType.value === "upload" ? values.certFile : undefined,
                  certificateUuid: values.inputType.value === "select" ? values.certificate.value : undefined
               })
            );

         }

      },

      [administrator, dispatch, editMode]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );


   const loadNextCertificates = () => {

      if (loadedCerts.length === 0) return;

      dispatch(
         certActions.listCertificates({
            itemsPerPage: 100,
            pageNumber: currentPage,
            filters: [],
         })
      );

   };


   const submitTitle = useMemo(
      () => editMode ? "Save" : "Create",
      [editMode]
   );


   const inProgressTitle = useMemo(
      () => editMode ? "Saving..." : "Creating...",
      [editMode]
   )


   const defaultValues = useMemo(
      () => ({
         name: editMode ? administrator?.name || "" : "",
         surname: editMode ? administrator?.surname : "",
         username: editMode ? administrator?.username : "",
         email: editMode ? administrator?.email : "",
         superAdmin: editMode ? administrator?.role === "superAdministrator" || false : false,
         inputType: optionsForInput[1],
         certificate: selectedCertificate,
         description: editMode ? administrator?.description || "" : "",
      }),
      [administrator, editMode, selectedCertificate, optionsForInput]
   );

   return (

      <Widget title={title} busy={isFetchingAdminDetail || isFetchingCertsList}>

         <Form onSubmit={onSubmit} initialValues={defaultValues}>

            {({ handleSubmit, pristine, submitting, values }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="username" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="username">User Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              disabled={editMode}
                              type="text"
                              placeholder="Administrator User Name"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">First Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Administrator Name"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="surname" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="surname">Last Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Administrator Surname"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>
                        </FormGroup>
                     )}
                  </Field>

                  <Field name="email" validate={composeValidators(validateRequired(), validateEmail())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="email">Administrator Email</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Administrator Email"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="inputType">

                     {({ input }) => (

                        <FormGroup>

                           <Label for="inputType">Input Type</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForInput}
                              placeholder="Select Input Type"
                              onChange={(e) => { setInputTypeValue(e); input.onChange(e) }}
                           />

                        </FormGroup>

                     )}

                  </Field>

                  {values.inputType.value === "upload" ? (

                     <Field name="certFile" validate={editMode ? undefined : validateRequired()}>

                        {({ input: { value, onChange, ...inputProps }, meta }) => (

                           <FormGroup>

                              <Label for="certFile">Upload Administrator Certificate</Label>

                              <Input
                                 {...inputProps}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="file"
                                 onChange={({ target }) => onChange(target.files)}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                              <FormText color="muted">
                                 Upload certificate of administrator based on which will be
                                 authenticated.
                              </FormText>

                           </FormGroup>
                        )}

                     </Field>

                  ) : (

                     <Field name="certificate" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="certificate">Certificate</Label>

                              <Select
                                 {...input}
                                 //ref={certSelectRef}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForCertificate}
                                 placeholder="Select Certificate"
                                 onMenuScrollToBottom={loadNextCertificates}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

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

                  {/*<Field name="enabled" type="checkbox">*/}
                  {/*  {({ input }) => (*/}
                  {/*    <FormGroup check>*/}
                  {/*      <Label check>*/}
                  {/*        <Input*/}
                  {/*          {...input}*/}
                  {/*          type="checkbox"*/}
                  {/*        />*/}
                  {/*        &nbsp;Enabled*/}
                  {/*      </Label>*/}
                  {/*    </FormGroup>*/}
                  {/*  )}*/}
                  {/*</Field>*/}

                  <Field name="superAdmin" type="checkbox">

                     {({ input }) => (

                        <FormGroup check>

                           <Label check>
                              <Input {...input} type="checkbox" />
                              Superadmin
                           </Label>

                        </FormGroup>
                     )}

                  </Field>

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={submitTitle}
                           inProgressTitle={inProgressTitle}
                           inProgress={submitting || isCreatingAdmin || isUpdatingAdmin}
                           disabled={pristine}
                        />

                        <Button color="default" onClick={onCancel} disabled={submitting || isCreatingAdmin || isUpdatingAdmin}>
                           Cancel
                        </Button>

                     </ButtonGroup>

                  </div>

               </BootstrapForm>
            )}

         </Form>



      </Widget>
   )

}

export default AdminForm;
