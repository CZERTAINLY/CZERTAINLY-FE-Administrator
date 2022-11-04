import { useCallback, useMemo, } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { actions, selectors } from "ducks/compliance-profiles";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";
import { useNavigate } from "react-router-dom";


interface FormValues {
   name: string;
   description: string;
}

function ComplianceProfileForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();


   const isCreating = useSelector(selectors.isCreating);


   const isBusy = useMemo(
      () => isCreating,
      [isCreating]
   );


   const onSubmit = useCallback(
      (values: FormValues) => {
            dispatch(actions.createComplianceProfile({ name: values.name, description: values.description }));
      },
      [dispatch]
   );


   const onCancelClick = useCallback(

      () => {
         navigate(-1);
      },
      [navigate]

   );



   const defaultValues: FormValues = useMemo(
      () => ({
         name: "",
         description: "",
      }),
      []
   );


   return (

      <Widget title="Add Compliance Profile" busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>
                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Profile Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              id="name"
                              placeholder="Compliance Profile Name"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="description">

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="description">Profile Description</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              id="description"
                              placeholder="Compliance Profile Description"
                           />

                        </FormGroup>

                     )}

                  </Field>

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={"Create"}
                           inProgressTitle={"Creating..."}
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

export default ComplianceProfileForm;
