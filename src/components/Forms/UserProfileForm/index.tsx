import React, { useCallback, useEffect, useMemo } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { Form, Field } from "react-final-form";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions, selectors } from "ducks/auth";

import { composeValidators, validateAlphaNumeric, validateEmail } from "utils/validators";


interface Props {
   title: JSX.Element;
}

interface FormValues {
   description: string;
   firstName: string;
   lastName: string;
   email: string;
}


function UserProfileForm({ title }: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const profile = useSelector(selectors.profile);

   const isFetchingProfile = useSelector(selectors.isFetchingProfile);
   const isUpdatingProfile = useSelector(selectors.isUpdatingProfile);


   useEffect(

      () => {
         dispatch(actions.getProfile());
      },
      [dispatch]

   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         dispatch(
            actions.updateProfile({
               profile: {
                  description: values.description || undefined,
                  firstName: values.firstName || undefined,
                  lastName: values.lastName || undefined,
                  email: values.email || undefined,
               }
            })
         );

      },
      [dispatch]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );


   const defaultValues = useMemo(
      () => ({
         description: profile?.description || "",
         firstName: profile?.firstName || "",
         lastName: profile?.lastName || "",
         email: profile?.email || "",
      }),
      [profile?.description, profile?.email, profile?.firstName, profile?.lastName]
   );


   return (

      <>

         <Widget title={title} busy={isFetchingProfile || isUpdatingProfile}>

            <Form onSubmit={onSubmit} initialValues={defaultValues}>

               {({ handleSubmit, pristine, submitting, values, valid }) => (

                  <BootstrapForm onSubmit={handleSubmit}>

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
                              />

                              <FormFeedback>{meta.error}</FormFeedback>

                           </FormGroup>

                        )}

                     </Field>


                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title="Save"
                              inProgressTitle={"Saving..."}
                              inProgress={submitting || isFetchingProfile || isUpdatingProfile}
                              disabled={pristine || submitting || isFetchingProfile || isUpdatingProfile|| !valid || profile?.systemUser}
                           />

                           <Button color="default" onClick={onCancel} disabled={submitting || isFetchingProfile || isUpdatingProfile}>
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

export default UserProfileForm;
