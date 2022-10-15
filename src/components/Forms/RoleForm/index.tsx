import React, { useCallback, useEffect, useMemo } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   name: string;
   description: string;
}


function RoleForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

   const roleSelector = useSelector(rolesSelectors.role);
   const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);

   useEffect(

      () => {

         if (editMode) dispatch(rolesActions.getDetail({ uuid: params.id }));

      },
      [dispatch, editMode, params.id]

   );

   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(

               rolesActions.update({
                  uuid: params.id,
                  name: values.name,
                  description: values.description,
               })

            );


         } else {

            dispatch(

               rolesActions.create({
                  name: values.name,
                  description: values.description,
               })

            )

         }

      },

      [dispatch, editMode, params.id]

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
         name: editMode ? roleSelector?.name || "" : "",
         description: editMode ? roleSelector?.description || "" : "",
      }),
      [editMode, roleSelector?.description, roleSelector?.name]
   );


   return (

      <>

         <Widget title={title} busy={isFetchingRoleDetail}>

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
                                 disabled={editMode || roleSelector?.systemRole}
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
                                 placeholder="Enter description of the role"
                                 disabled={roleSelector?.systemRole}
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting}
                              disabled={pristine || submitting || roleSelector?.systemRole}
                           />

                           <Button color="default" onClick={onCancel} disabled={submitting}>
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
