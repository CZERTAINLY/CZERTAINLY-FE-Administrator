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
import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";

import { UserDetailModel, CertificateModel } from "models";

import { emptyCertificate } from "utils/certificate";
import { validateRequired, composeValidators, validateAlphaNumeric, validateEmail } from "utils/validators";
import CertificateAttributes from "components/CertificateAttributes";
import Dialog from "components/Dialog";
import CertificateUploadDialog from "components/pages/certificates/CertificateUploadDialog";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { MDBBadge } from "mdbreact";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   username: string;
   description: string;
   firstName: string;
   lastName: string;
   email: string;
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


   const userSelector = useSelector(userSelectors.user);
   const rolesSelector = useSelector(rolesSelectors.roles);
   const certificates = useSelector(certSelectors.certificates);
   const certificateDetail = useSelector(certSelectors.certificateDetail);

   const isFetchingUserDetail = useSelector(userSelectors.isFetchingDetail);
   const isFetchingRoles = useSelector(rolesSelectors.isFetchingList);

   const isFetchingCertsList = useSelector(certSelectors.isFetchingList);
   const isFetchingCertDetail = useSelector(certSelectors.isFetchingDetail);

   const isCreatingUser = useSelector(userSelectors.isCreating);
   const isUpdatingUser = useSelector(userSelectors.isUpdating);

   const [loadedCerts, setLoadedCerts] = useState<CertificateModel[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [user, setUser] = useState<UserDetailModel>();

   const [userRoles, setUserRoles] = useState<string[]>([]);

   const [optionsForCertificate, setOptionsForCertificte] = useState<{ label: string, value: string }[]>([]);

   const [, setInputTypeValue] = useState<{ label: string, value: string }>(editMode ? optionsForInput[1] : optionsForInput[0]);

   const [selectedCertificate, setSelectedCertificate] = useState<{ label: string, value: string }>();

   const [certUploadDialog, setCertUploadDialog] = useState(false);
   const [certToUpload, setCertToUpload] = useState<CertificateModel>();


   /* Load first page of certificates & all roles available */

   useEffect(

      () => {

         dispatch(certActions.resetState());
         dispatch(rolesActions.resetState());
         dispatch(userActions.resetState());

         dispatch(
            certActions.listCertificates({
               query: {
                  itemsPerPage: 100,
                  pageNumber: 1,
                  filters: [],
               }
            })
         );

         dispatch(rolesActions.list());

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
            setUserRoles(userSelector.roles.map(role => role.uuid));

         } else {

            if (!user) setUser({
               uuid: "",
               description: "",
               username: "",
               firstName: "",
               lastName: "",
               email: "",
               enabled: false,
               certificate: emptyCertificate,
               roles: [],
               systemUser: false
            });

            setUserRoles([]);

         }
      },
      [params.id, user, userSelector]

   );

   /* Process cert detail loaded for user */

   useEffect(

      () => {

         if (user && user.certificate && user.certificate.uuid && certificateDetail && certificateDetail.uuid === user.certificate.uuid) {

            const certs = [...loadedCerts];

            setSelectedCertificate({
               label: `${certificateDetail.commonName} (${certificateDetail.fingerprint})` || `( empty ) ( ${certificateDetail.fingerprint} )`,
               value: certificateDetail.uuid,
            });

            const idx = certs.findIndex(c => c.uuid === certificateDetail.uuid);
            if (idx >= 0) certs.splice(idx, 1, certificateDetail); else return;

            setLoadedCerts([certificateDetail, ...loadedCerts]);

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
                  label: `${loadedCert.commonName} (${loadedCert.fingerprint})` || `( empty ) ( ${loadedCert.serialNumber} )`,
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
                  description: values.description,
                  firstName: values.firstName || undefined,
                  lastName: values.lastName || undefined,
                  email: values.email || undefined,
                  certificateUuid: values.inputType.value === "select" ? values.certificate ? values.certificate.value : undefined : undefined,
                  certificate: values.inputType.value === "upload" ? certToUpload : undefined,
                  roles: userRoles
               })
            );

         } else {

            dispatch(
               userActions.create({
                  username: values.username,
                  description: values.description,
                  firstName: values.firstName || undefined,
                  lastName: values.firstName || undefined,
                  email: values.email || undefined,
                  enabled: false,
                  certificate: values.inputType.value === "upload" ? certToUpload : undefined,
                  certificateUuid: values.inputType.value === "select" ? values.certificate ? values.certificate.value : undefined : undefined,
                  roles: userRoles
               })
            );

         }

      },

      [user, certToUpload, dispatch, editMode, userRoles]

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
         description: editMode ? user?.description : "",
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


   const rolesTableHeader: TableHeader[] = useMemo(

      () => [
         {
            id: "roleName",
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "roleDescription",
            content: <MDBColumnName columnName="Role description" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "systemRole",
            content: <MDBColumnName columnName="System role" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         }
      ],
      []

   );


   const rolesTableData: TableDataRow[] = useMemo(

      () => rolesSelector.map(

         role => ({

            id: role.uuid,

            columns: [

               role.name,

               role.description || "",

               <MDBBadge color={!role.systemRole ? "success" : "danger"}>{role.systemRole ? "Yes" : "No"}</MDBBadge>,

            ]

         })

      ),

      [rolesSelector]

   );


   const hasRolesChanged: boolean = useMemo(

      () => {
         if (!user) return false;

         const usrRoleUuids = user.roles.map(role => role.uuid);

         if (userRoles.length === usrRoleUuids.length && userRoles.length === 0) return true;

         return userRoles.length !== usrRoleUuids.length || userRoles.some(roleUuid => !usrRoleUuids.includes(roleUuid));
      },
      [user, userRoles]

   );


   return (

      <>

         <Widget title={title} busy={isFetchingUserDetail || isFetchingCertsList || isFetchingCertDetail || isFetchingRoles}>

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

                     <Field name="description" validate={composeValidators(validateAlphaNumeric())}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="description">Description</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Description"
                                 disabled={user?.systemUser}
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
                                    isClearable={true}
                                 />

                                 <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                              </FormGroup>

                           )}

                        </Field>

                     )}

                     <br />

                     <p>Assigned User Roles</p>

                     <CustomTable
                        headers={rolesTableHeader}
                        data={rolesTableData}
                        checkedRows={userRoles}
                        hasCheckboxes={true}
                        hasAllCheckBox={false}
                        onCheckedRowsChanged={(roles) => {
                           setUserRoles(roles as string[])
                        }}
                     />

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting || isCreatingUser || isUpdatingUser}
                              disabled={(pristine && !hasRolesChanged) || submitting || isCreatingUser || isUpdatingUser || !valid || userSelector?.systemUser}
                           />

                           <Button color="default" onClick={onCancel} disabled={submitting || isCreatingUser || isUpdatingUser}>
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>

                  </BootstrapForm>
               )}

            </Form>

         </Widget>


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


      </>

   )

}

export default UserForm;
