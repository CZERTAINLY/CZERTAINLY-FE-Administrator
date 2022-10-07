import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";
import Select from "react-select";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import users, { actions as userActions, selectors as usersSelectors } from "ducks/users";

import { validateRequired, composeValidators, validateAlphaNumeric, validateEmail } from "utils/validators";

import Dialog from "components/Dialog";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   name: string;
   description: string;
   systemRole: boolean;
}


function RoleForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

   const rolesSelector = useSelector(rolesSelectors.role);
   const usersSelector = useSelector(usersSelectors.users);

   const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
   const isFetchingUsers = useSelector(usersSelectors.isFetchingList);

   const isCreatingRole = useSelector(rolesSelectors.isCreating);
   const isUpdatingRole = useSelector(rolesSelectors.isUpdating);
   const isFetchingPermissions = useSelector(rolesSelectors.isFetchingPermissions);
   const isUpdatingPermissions = useSelector(rolesSelectors.isUpdatingPermissions);

   /* Load all users, resources and objects */

   useEffect(

      () => {

         dispatch(userActions.list());

      },
      [dispatch]

   );

   /* Load role */

   useEffect(

      () => {

         if (params.id && (!rolesSelector || rolesSelector.uuid !== params.id)) dispatch(rolesActions.getDetail({ uuid: params.id }));

      },
      [dispatch, params.id, rolesSelector]

   );

   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {
         }

      },

      [editMode]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );


   const submitTitle = useMemo(
      () => editMode ? "Save" : "Create",
      [editMode]
   );


   const inProgressTitle = useMemo(
      () => editMode ? "Saving..." : "Creating...",
      [editMode]
   )


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? rolesSelector?.name || "" : "",
         description: editMode ? rolesSelector?.description || "" : "",
         systemRole: editMode ? rolesSelector?.systemRole || false : false
      }),
      [editMode, rolesSelector?.name, rolesSelector?.description, rolesSelector?.systemRole]
   );


   const usersTableHeader: TableHeader[] = useMemo(

      () => [
         {
            id: "userName",
            content: <MDBColumnName columnName="Username" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "firstName",
            content: <MDBColumnName columnName="First Name" />,
            sortable: true,
         },
         {
            id: "lastName",
            content: <MDBColumnName columnName="Last Name" />,
            sortable: true,
         },
         {
            id: "email",
            content: <MDBColumnName columnName="Email" />,
            sortable: true,
         }
      ],
      []

   );


   const usersTableData: TableDataRow[] = useMemo(

      () => usersSelector.map(

         user => ({

            id: user.uuid,

            columns: [

               user.username,

               user.firstName || "",

               user.lastName || "",

               user.email || ""

            ]

         })

      ),

      [usersSelector]

   );

   /*

   const hasRolesChanged: boolean = useMemo(

      () => {
         if (!user) return false;

         const usrRoleUuids = user.roles.map(role => role.uuid);

         if (userRoles.length === usrRoleUuids.length && userRoles.length === 0) return true;

         return userRoles.length !== usrRoleUuids.length || userRoles.some(roleUuid => !usrRoleUuids.includes(roleUuid));
      },
      [user, userRoles]

   );

   */


   return (

      <>

         <Widget title={title} busy={isFetchingRoleDetail || isFetchingUsers}>

            <Form onSubmit={onSubmit} initialValues={defaultValues}>

               {({ handleSubmit, pristine, submitting, values, valid }) => (

                  <BootstrapForm onSubmit={handleSubmit}>

                     <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="name">Role Name</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 disabled={editMode || rolesSelector?.systemRole}
                                 type="text"
                                 placeholder="Enter name of the role"
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
                                 placeholder="First Name"
                                 disabled={rolesSelector?.systemRole}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     <br />

                     <Field name="systemRole" type="checkbox">

                        {({ input }) => (

                           <FormGroup check>
                              <Label check>
                                 <Input
                                    {...input}
                                    type="checkbox"
                                    disabled={true}
                                 />
                                 &nbsp;&nbsp;&nbsp;System role
                              </Label>

                           </FormGroup>
                        )}

                     </Field>

                     <br />

                     <p>Assigned Users</p>

                     <CustomTable
                        headers={usersTableHeader}
                        data={usersTableData}
                        /*checkedRows={userRoles}*/
                        hasCheckboxes={true}
                        hasAllCheckBox={false}
                        /*onCheckedRowsChanged={(roles) => {
                           setUserRoles(roles as string[])
                        }}*/
                     />

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting || isCreatingRole || isUpdatingRole}
                              disabled={(pristine) || submitting || isCreatingRole || isUpdatingRole || !valid || values.systemRole}
                           />

                           <Button color="default" onClick={onCancel} disabled={submitting || isCreatingRole || isUpdatingRole}>
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>

                  </BootstrapForm>
               )}

            </Form>

         </Widget>

      </>

   )

}

export default RoleForm;
