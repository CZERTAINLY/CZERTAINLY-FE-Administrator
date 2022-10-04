import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as userActions, selectors as userSelectors } from "ducks/users";
import { actions as certActions, selectors as certSelectors } from "ducks/certificates";
//import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";

import { UserDetailModel, CertificateModel } from "models";

import { emptyCertificate } from "utils/certificate";
import { validateRequired, composeValidators, validateAlphaNumeric, validateEmail } from "utils/validators";
import CertificateAttributes from "components/CertificateAttributes";
import Dialog from "components/Dialog";
import CertificateUploadDialog from "components/pages/certificates/CertificateUploadDialog";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   username: string;
   firstName: string;
   lastName: string;
   email: string;
   enabled: boolean;
   systemUser: boolean;
   inputType: { value: "upload" | "select" };
   certFile: FileList | undefined;
   certificate: any;
}


function UserForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

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
   const isFetchingCertDetail = useSelector(certSelectors.isFetchingDetail);
   const certificateDetail = useSelector(certSelectors.certificateDetail);

   const isFetchingUserDetail = useSelector(userSelectors.isFetchingDetail);
   const userSelector = useSelector(userSelectors.user);
   const rolesSelector = useSelector(userSelectors.userRoles);

   const isCreatingUser = useSelector(userSelectors.isCreating);
   const isUpdatingUser = useSelector(userSelectors.isUpdating);

   const [loadedCerts, setLoadedCerts] = useState<CertificateModel[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [user, setUser] = useState<UserDetailModel>();
   const [roles, setRoles] = useState<string[]>([]);

   const [optionsForCertificate, setOptionsForCertificte] = useState<{ label: string, value: string }[]>([]);

   const [, setInputTypeValue] = useState<{ label: string, value: string }>(editMode ? optionsForInput[1] : optionsForInput[0]);

   const [selectedCertificate, setSelectedCertificate] = useState<{ label: string, value: string }>();

   const [certUploadDialog, setCertUploadDialog] = useState(false);
   const [certToUpload, setCertToUpload] = useState<CertificateModel>();


   /* Load first page of certificates & all roles available */

   useEffect(

      () => {

         dispatch(
            certActions.listCertificates({
               query: {
                  itemsPerPage: 100,
                  pageNumber: 1,
                  filters: [],
               }
            })
         );

         // dispatch(rolesActions.getRoles({} ));


      },
      [dispatch]

   );

   /* Load user */

   useEffect(

      () => {

         if (params.id && (!userSelector || userSelector.uuid !== params.id)) dispatch(userActions.getDetail({ uuid: params.id }));

      },
      [dispatch, params.id, userSelector]

   );

   /* Copy loaded user to the state */

   useEffect(

      () => {
         if (params.id && userSelector?.uuid === params.id) {

            setUser(userSelector);

         } else {

            if (!user) setUser({
               uuid: "",
               username: "",
               firstName: "",
               lastName: "",
               email: "",
               enabled: false,
               certificate: emptyCertificate,
               roles: [],
               systemUser: false
            });

         }
      },
      [params.id, user, userSelector]

   );


   /* Process cert detail loaded for user */

   useEffect(

      () => {

         if (user && user.certificate && user.certificate.uuid && certificateDetail && certificateDetail.uuid === user.certificate.uuid) {

            const certs = [...loadedCerts];

            const idx = certs.findIndex(c => c.uuid === certificateDetail.uuid);
            if (idx >= 0) certs.splice(idx, 1, certificateDetail);

            setLoadedCerts([certificateDetail, ...loadedCerts]);

            setSelectedCertificate({
               label: certificateDetail.commonName || `( empty ) ( ${certificateDetail.fingerprint} )`,
               value: certificateDetail.uuid,
            });

         }

      },
      [certificateDetail, loadedCerts, user]

   );


   /* Process fetched certs and store them to loaded certs */

   useEffect(

      () => {

         const fpc = certificates.filter(
            pagedCert => !["expired", "revoked", "invalid"].includes(pagedCert.status)
         ).filter(
            pagedCert => loadedCerts.find(loadedCert => loadedCert.uuid === pagedCert.uuid) === undefined
         )

         if (fpc.length === 0) return;

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

      },
      [certificates, currentPage, loadedCerts]

   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(
               userActions.update({
                  uuid: user!.uuid,
                  firstName: values.firstName || undefined,
                  lastName: values.lastName || undefined,
                  email: values.email || undefined,
                  enabled: values.enabled,
                  certificateUuid: values.inputType.value === "select" ? values.certificate ? values.certificate.value : undefined : undefined,
                  certificate: values.inputType.value === "upload" ? certToUpload : undefined
               })
            );

         } else {

            dispatch(
               userActions.create({
                  username: values.username,
                  firstName: values.firstName || undefined,
                  lastName: values.firstName || undefined,
                  email: values.email || undefined,
                  enabled: values.enabled,
                  certificate: values.inputType.value === "upload" ? certToUpload : undefined,
                  certificateUuid: values.inputType.value === "select" ? values.certificate ? values.certificate.value : undefined : undefined,
               })
            );

         }

      },

      [user, certToUpload, dispatch, editMode]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );


   const loadNextCertificates = useCallback(

      () => {

         if (loadedCerts.length === 0) return;

         dispatch(
            certActions.listCertificates({
               query: {
                  itemsPerPage: 100,
                  pageNumber: currentPage,
                  filters: [],
               }
            })
         );

      },
      [dispatch, currentPage, loadedCerts]

   )


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
         username: editMode ? user?.username : "",
         firstName: editMode ? user?.firstName || "" : "",
         lastName: editMode ? user?.lastName : "",
         email: editMode ? user?.email : "",
         enabled: editMode ? user?.enabled : false,
         systemUser: editMode ? user?.systemUser : false,
         inputType: optionsForInput[1],
         certificate: selectedCertificate,
      }),
      [user, editMode, selectedCertificate, optionsForInput]
   );

   return (

      <Widget title={title} busy={isFetchingUserDetail || isFetchingCertsList || isFetchingCertDetail}>

         <Form onSubmit={onSubmit} initialValues={defaultValues}>

            {({ handleSubmit, pristine, submitting, values, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="username" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="username">Username</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              disabled={editMode || user?.systemUser}
                              type="text"
                              placeholder="Username"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  <Field name="firstName" validate={composeValidators(validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="firstName">First Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="First Name"
                              disabled={user?.systemUser}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="lastName" validate={composeValidators(validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="lastName">Last Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Last name"
                              disabled={user?.systemUser}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>
                        </FormGroup>
                     )}
                  </Field>

                  <Field name="email" validate={composeValidators(validateEmail())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="email">Email</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Email address"
                              disabled={user?.systemUser}
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
                              isDisabled={user?.systemUser}
                           />

                        </FormGroup>

                     )}

                  </Field>

                  {values.inputType.value === "upload" ? (

                     <FormGroup>

                        <Label for="certFile">Client Certificate</Label>

                        <div>

                           {

                              certToUpload ? (
                                 <CertificateAttributes certificate={certToUpload} />
                              ) : (
                                 <>
                                    Certificate to be uploaded not selected&nbsp;&nbsp;&nbsp;
                                 </>
                              )

                           }

                           <Button color="secondary" onClick={() => setCertUploadDialog(true)}>Choose File</Button>

                        </div>

                        <FormText color="muted">
                           Upload certificate of client based on which will be
                           authenticated to RA profile.
                        </FormText>

                     </FormGroup>


                  ) : (

                     <Field name="certificate">

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
                                 isDisabled={user?.systemUser}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                  )}

                  <br />

                  <Field name="enabled" type="checkbox">

                     {({ input }) => (

                        <FormGroup check>

                           <Label check>

                              <Input
                                 {...input}
                                 type="checkbox"
                              />

                              &nbsp;&nbsp;&nbsp;Enabled

                           </Label>

                        </FormGroup>

                     )}

                  </Field>

                  <br />

                  <Field name="systemUser" type="checkbox">

                     {({ input }) => (

                        <FormGroup check>
                           <Label check>
                              <Input
                                 {...input}
                                 type="checkbox"
                                 disabled={true}
                              />
                              &nbsp;&nbsp;&nbsp;System user
                           </Label>

                        </FormGroup>
                     )}

                  </Field>

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={submitTitle}
                           inProgressTitle={inProgressTitle}
                           inProgress={submitting || isCreatingUser || isUpdatingUser}
                           disabled={pristine || submitting || isCreatingUser || isUpdatingUser || !valid || values.systemUser}
                        />

                        <Button color="default" onClick={onCancel} disabled={submitting || isCreatingUser || isUpdatingUser}>
                           Cancel
                        </Button>

                     </ButtonGroup>

                  </div>

               </BootstrapForm>
            )}

         </Form>


         <Dialog
            isOpen={certUploadDialog}
            caption={`Choose Certificate`}
            body={
               <CertificateUploadDialog
                  okButtonTitle="Choose"
                  onCancel={() => setCertUploadDialog(false)}
                  onUpload={(data) => {
                     setCertToUpload(data.certificate);
                     setCertUploadDialog(false);
                  }}
               />}
            toggle={() => setCertUploadDialog(false)}
            buttons={[]}
         />


      </Widget>
   )

}

export default UserForm;
