import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";

import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { GroupModel } from "models";
import { actions, selectors } from "ducks/groups";
import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";


interface FormValues {
   name: string;
   description: string;
}


export default function GroupForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const match = useMatch("/app/groups/edit/:id");

   const editMode = useMemo(
      () => match?.params.id !== undefined,
      [match]
   );

   const groupSelector = useSelector(selectors.group);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isCreating = useSelector(selectors.isCreating);
   const isUpdating = useSelector(selectors.isUpdating);

   const [group, setGroup] = useState<GroupModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating,
      [isCreating, isFetchingDetail, isUpdating]
   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {
            dispatch(actions.updateGroup({ groupUuid: match!.params.id!, name: values.name, description: values.description }));
         } else {
            dispatch(actions.createGroup({ name: values.name, description: values.description }));
         }

      },
      [dispatch, editMode, match]

   );


   const onCancelClick = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

   );


   useEffect(

      () => {

         if (editMode && groupSelector && groupSelector.uuid !== group?.uuid) {

            setGroup(groupSelector);

         }
      },
      [dispatch, editMode, group?.uuid, groupSelector]

   )


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? group?.name || "" : "",
         description: editMode ? group?.description || "" : "",
      }),
      [editMode, group]
   );


   const title = useMemo(

      () => editMode ? "Edit Group" : "Add Group",
      [editMode]

   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} >

            {({ handleSubmit, pristine, submitting, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>
                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Group Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              id="name"
                              placeholder="Group Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="description" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="description">Group Description</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              id="description"
                              placeholder="Group Description"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={editMode ? "Update" : "Create"}
                           inProgressTitle={editMode ? "Updating..." : "Creating..."}
                           inProgress={submitting}
                           disabled={pristine || submitting || !valid}
                        />

                        <Button color="default" onClick={onCancelClick} disabled={submitting}>
                           Cancel
                        </Button>

                     </ButtonGroup>

                  </div>

               </BootstrapForm>

            )}

         </Form>

      </Widget >

   );

}