import React, { useCallback, useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import {
  Button,
  ButtonGroup,
  Form as BootstrapForm,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import {
  validateRequired,
  composeValidators,
  validateAlphaNumeric,
  validateEmail,
} from "utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { actions, selectors } from "ducks/certificates";

export interface DefaultValues {
  name?: string;
  surname?: string;
  username?: string;
  description?: string;
  enabled?: boolean;
  superAdmin?: boolean;
}

interface FormValues {
  name: string;
  surname: string;
  username: string;
  email: string;
  description: string;
  superAdmin: boolean;
  enabled: boolean;
  certFile: FileList;
}

interface Props {
  editMode?: boolean;
  defaultValues?: DefaultValues;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    surname: string,
    username: string,
    certFile: File,
    description: string,
    enabled: boolean,
    superAdmin: boolean,
    email: string,
    certificateUuid: string
  ) => void;
}

function AdminForm({
  defaultValues,
  editMode,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const [certificateUuid, setCertificateId] = useState<string>("");
  const [certificateOption, setCertificateOption] = useState<string>("Upload");

  const dispatch = useDispatch();
  const allCerts = useSelector(selectors.selectCertificates);

  useEffect(() => {
    dispatch(actions.requestCertificatesList());
  }, [dispatch]);

  const submitCallback = useCallback(
    (values: FormValues) => {
      onSubmit(
        values.name,
        values.surname,
        values.username,
        values.certFile && values.certFile[0],
        values.description,
        false,
        values.superAdmin,
        values.email,
        certificateUuid
      );
    },
    [onSubmit, certificateUuid]
  );

  const setCertId = (event: any) => {
    setCertificateId(event.value || 0);
  };

  const optionsForCertificate = () => {
    let validCertificateOptions = [];
    for (let certificate of allCerts) {
      if (
        !["EXPIRED", "REVOKED", "INVALID"].includes(
          certificate.status || "UNKNOWN"
        )
      ) {
        validCertificateOptions.push({
          label: certificate.commonName + " (" + certificate.serialNumber + ")",
          value: certificate.uuid,
        });
      }
    }
    return validCertificateOptions;
  };

  const optionsForInput = [
    {
      label: "Upload a new Certificate",
      value: "Upload",
    },
    {
      label: "Choose Existing Certificate",
      value: "Existing",
    },
  ];

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <Form onSubmit={submitCallback} initialValues={defaultValues}>
      {({ handleSubmit, pristine, submitting }) => (
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
                  disabled={editMode}
                  type="text"
                  placeholder="Administrator User Name"
                />
                <FormFeedback>{meta.error}</FormFeedback>
              </FormGroup>
            )}
          </Field>
          <Field
            name="email"
            validate={composeValidators(validateRequired(), validateEmail())}
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

          <Field name="Input Type">
            {({ input, meta }) => (
              <FormGroup>
                <Label for="inputType">Input Type</Label>
                <Select
                  maxMenuHeight={140}
                  menuPlacement="auto"
                  options={optionsForInput}
                  placeholder="Select Input Type"
                  defaultValue={{
                    label: "Upload a new Certificate",
                    value: "Upload",
                  }}
                  onChange={(event) =>
                    setCertificateOption(event?.value.toString() || "Upload")
                  }
                />
              </FormGroup>
            )}
          </Field>

          {certificateOption === "Upload" ? (
            <Field
              name="certFile"
              validate={editMode ? undefined : validateRequired()}
            >
              {({ input: { value, onChange, ...inputProps }, meta }) => (
                <FormGroup>
                  <Label for="certFile">Upload Administrator Certificate</Label>
                  <Input
                    {...inputProps}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="file"
                    onChange={(event) => onChange(event.target.files)}
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
            <Field name="certificate">
              {({ input, meta }) => (
                <FormGroup>
                  <Label for="inputType">Certificate</Label>
                  <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={optionsForCertificate()}
                    placeholder="Select Certificate"
                    onChange={(event) => setCertId(event)}
                  />
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
                  &nbsp;Superadmin
                </Label>
              </FormGroup>
            )}
          </Field>

          <div className="d-flex justify-content-end">
            <ButtonGroup>
              <Button
                color="default"
                onClick={onCancel}
                disabled={submitting || isSubmitting}
              >
                Cancel
              </Button>
              <ProgressButton
                title={submitTitle}
                inProgressTitle={inProgressTitle}
                inProgress={submitting || isSubmitting}
                disabled={pristine}
              />
            </ButtonGroup>
          </div>
        </BootstrapForm>
      )}
    </Form>
  );
}

export default AdminForm;
