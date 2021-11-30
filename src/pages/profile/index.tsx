import React, { useCallback } from "react";
import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Container,
  Form as BootstrapForm,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/auth";
import {
  validateRequired,
  composeValidators,
  validateAlphaNumeric,
  validateEmail,
} from "utils/validators";
import { useHistory } from "react-router";

interface FormValues {
  name: string;
  surname: string;
  username: string;
  email: string;
}

function Profile() {
  const isUpdating = useSelector(selectors.isUpdatingProfile);
  const profile = useSelector(selectors.selectProfile);
  const dispatch = useDispatch();
  const history = useHistory();

  const initialValues: Partial<FormValues> = {
    name: profile?.name,
    surname: profile?.surname,
    username: profile?.username,
    email: profile?.email,
  };

  const onSubmit = useCallback(
    (values: FormValues) => {
      const { name, surname, username, email } = values;
      dispatch(actions.requestUpdateProfile(name, surname, username, email));
    },
    [dispatch]
  );

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">Profile</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <Form onSubmit={onSubmit} initialValues={initialValues}>
          {({ handleSubmit, pristine, submitting, form }) => (
            <BootstrapForm onSubmit={handleSubmit}>
              <Field
                name="name"
                validate={composeValidators(
                  validateRequired(),
                  validateAlphaNumeric()
                )}
              >
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="name">Administrator Name</Label>
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
              <Field
                name="surname"
                validate={composeValidators(
                  validateRequired(),
                  validateAlphaNumeric()
                )}
              >
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="surname">Administrator Surname</Label>
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
              <Field name="username" validate={validateRequired()}>
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="username">Administrator User Name</Label>
                    <Input
                      {...input}
                      valid={!meta.error && meta.touched}
                      invalid={!!meta.error && meta.touched}
                      type="text"
                      placeholder="Administrator User Name"
                      disabled
                    />
                    <FormFeedback>{meta.error}</FormFeedback>
                  </FormGroup>
                )}
              </Field>
              <Field
                name="email"
                validate={composeValidators(
                  validateRequired(),
                  validateEmail()
                )}
              >
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
              <div className="d-flex justify-content-end">
                <ButtonGroup>
                  <Button
                    color="default"
                    onClick={() => history.goBack()}
                    disabled={submitting || isUpdating}
                  >
                    Cancel
                  </Button>
                  <ProgressButton
                    title="Save"
                    inProgressTitle="Saving..."
                    inProgress={submitting || isUpdating}
                    disabled={pristine}
                  />
                </ButtonGroup>
              </div>
            </BootstrapForm>
          )}
        </Form>
      </Widget>
    </Container>
  );
}

export default Profile;
