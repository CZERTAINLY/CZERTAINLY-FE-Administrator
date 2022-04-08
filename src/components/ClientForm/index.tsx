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
} from "utils/validators";
import { actions, selectors } from "ducks/certificates";
import { useDispatch, useSelector } from "react-redux";

export interface DefaultValues {
  name?: string;
  description?: string;
  enabled?: boolean;
}

interface FormValues {
  name: string;
  description: string;
  enabled: boolean;
  certFile: FileList;
  certificateUuid: string;
}

interface Props {
  editMode?: boolean;
  defaultValues?: DefaultValues;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    certFile: File,
    description: string,
    enabled: boolean,
    certificateUuid: string
  ) => void;
}

function ClientForm({
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

  const [clientCerts, setClientCerts] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      actions.requestCertificatesList({
        itemsPerPage: 100,
        pageNumber: 1,
        filters: [],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    let tmpCerts: any = [...clientCerts];
    const existingUuids = tmpCerts.map(function (e: any) {
      return e.uuid;
    });
    for (let i of allCerts) {
      if (!existingUuids.includes(i.uuid)) {
        tmpCerts.push(i);
      }
    }
    setClientCerts(tmpCerts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCerts]);

  const submitCallback = useCallback(
    (values: FormValues) => {
      onSubmit(
        values.name,
        values.certFile && values.certFile[0],
        values.description,
        false,
        certificateUuid
      );
    },
    [onSubmit, certificateUuid]
  );

  const loadNextCertificates = () => {
    if (allCerts.length > 0) {
      dispatch(
        actions.requestCertificatesList({
          itemsPerPage: 100,
          pageNumber: currentPage,
          filters: [],
        })
      );
      setCurrentPage(currentPage + 1);
    }
  };

  const optionsForCertificate = () => {
    let validCertificateOptions = [];
    for (let certificate of clientCerts) {
      if (
        !["EXPIRED", "REVOKED", "INVALID"].includes(
          certificate.status || "UNKNOWN"
        )
      ) {
        validCertificateOptions.push({
          label:
            certificate.commonName ||
            // eslint-disable-next-line
            "( empty )" + " (" + certificate.serialNumber + ")",
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

  const setCertId = (event: any) => {
    setCertificateId(event.value || 0);
  };

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
                <Label for="name">Client Name</Label>
                <Input
                  {...input}
                  valid={!meta.error && meta.touched}
                  invalid={!!meta.error && meta.touched}
                  type="text"
                  placeholder="Client Name"
                  disabled={editMode}
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
                  options={optionsForInput}
                  menuPlacement="auto"
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
                  <Label for="certFile">Upload Client Certificate</Label>
                  <Input
                    {...inputProps}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="file"
                    onChange={(event) => onChange(event.target.files)}
                  />
                  <FormFeedback>{meta.error}</FormFeedback>
                  <FormText color="muted">
                    Upload certificate of client based on which will be
                    authenticated to RA profile.
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
                    onMenuScrollToBottom={loadNextCertificates}
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

export default ClientForm;
