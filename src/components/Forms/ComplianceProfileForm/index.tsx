import { useCallback, useMemo, } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import ProgressButton from "components/ProgressButton";
import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";
import { actions, selectors } from "ducks/compliance-profiles";
import Widget from "components/Widget";
import { mutators } from "utils/attributeEditorMutators";

interface Props {
   title: JSX.Element;
}

interface FormValues {
   name: string;
   description: string;
}

function ComplianceProfileForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

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
         history.goBack()
      },
      [history]

   );



   const defaultValues: FormValues = useMemo(
      () => ({
         name: "",
         description: "",
      }),
      []
   );


   return (

      <Widget title={title} busy={isBusy}>

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

                  <Field name="description" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

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

                           <FormFeedback>{meta.error}</FormFeedback>

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
