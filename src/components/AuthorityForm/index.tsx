import React, { useCallback, useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import Select from "react-select";
import {
  Button,
  ButtonGroup,
  Form as BootstrapForm,
  FormFeedback,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import DynamicForm from "components/DynamicForm";
import ProgressButton from "components/ProgressButton";
import {
  validateRequired,
  composeValidators,
  validateAlphaNumeric,
} from "utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { actions, selectors } from "ducks/ca-authorities";
import {
  actions as callbackActions,
  selectors as callbackSelectors,
} from "ducks/connectors";

import { AuthorityProviderAttributes } from "api/authorities";
import { ConnectorInfoResponse } from "api/connectors";
import { attributeCombiner } from "utils/commons";
import { AuthorityDetails } from "models";

export interface DefaultValues {
  name?: string;
  kind?: string;
  connectorUuid?: number | string;
  attributes?: any;
}

interface FormValues {
  name: string;
  connectorUuid: string;
  credential: any;
  status: string;
  attributes: any;
  kind: string;
}

interface Props {
  editMode?: boolean;
  defaultValues?: DefaultValues;
  authority?: AuthorityDetails | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    connectorUuid: string,
    credential: any,
    status: string,
    attributes: any,
    kind: string
  ) => void;
}

function AuthorityForm({
  defaultValues,
  editMode,
  authority,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const authorityProviders = useSelector(selectors.selectAuthorityProviders);
  const authorityProviderAttributes = useSelector(
    selectors.selectAuthorityProviderAttributes
  );
  const credentialProviderId = useSelector(
    selectors.selectAuthorityCredentialId
  );
  const existingAuthorityProviderId = useSelector(
    selectors.selectAuthorityConnectorId
  );

  const dispatch = useDispatch();
  const [attributes, setAttributes] = useState(authorityProviderAttributes);
  const [connectorUuid, setConnectorId] = useState<string>();
  const [credential, setCredential]: any = useState(null);
  const [availableKinds, setAvailableKinds] = useState<string[]>();
  const [kind, setKind] = useState<string>();
  const [connectorDetails, setConnectorDetails] =
    useState<ConnectorInfoResponse>();
  const callbackResponse = useSelector(callbackSelectors.callbackResponse);

  const [passAttributes, setPassAttributes] = useState(
    authorityProviderAttributes
  );
  const [passEditAttributes, setPassEditAttributes]: any = useState(
    authorityProviderAttributes
  );
  const [editableAttributes, setEditableAttributes]: any = useState([]);

  useEffect(() => {
    dispatch(actions.requestAuthorityProviderList());
  }, [dispatch]);

  useEffect(() => {
    setPassEditAttributes(defaultValues?.attributes);
  }, [defaultValues]);

  useEffect(() => {
    setPassAttributes(authorityProviderAttributes);
    setPassEditAttributes(authorityProviderAttributes);
    setAttributes(authorityProviderAttributes);
  }, [authorityProviderAttributes]);

  useEffect(() => {
    if (editMode && authority?.uuid) {
      for (let i of authorityProviders) {
        if (i.uuid === authority.connectorUuid) {
          for (let j of connectorDetails?.functionGroups || []) {
            if (
              "authorityProvider" === j.functionGroupCode ||
              "legacyAuthorityProvider" === j.functionGroupCode
            ) {
              dispatch(
                actions.requestAuthorityProviderAttributeList(
                  connectorDetails?.uuid || "",
                  authority.kind,
                  j.functionGroupCode
                )
              );
            }
          }
        }
      }
    }
  }, [authority, editMode, authorityProviders, connectorDetails, dispatch]);

  useEffect(() => {
    const raLength = authority?.attributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        authority?.attributes || [],
        authorityProviderAttributes
      );
      setEditableAttributes(edtAttributes);
      setPassEditAttributes(edtAttributes);
    }
  }, [authorityProviderAttributes, authority, editMode]);

  useEffect(() => {
    if (
      existingAuthorityProviderId &&
      editMode &&
      authorityProviders.length > 0
    ) {
      setConnector(existingAuthorityProviderId);
      setConnectorId(existingAuthorityProviderId);
      setAttributes(defaultValues?.attributes);
      setCredential(credentialProviderId);
      setKind(defaultValues?.kind);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    existingAuthorityProviderId,
    credentialProviderId,
    authorityProviders,
    defaultValues,
  ]);

  function updateAttributes(formAttributes: AuthorityProviderAttributes) {
    let updated =
      attributes?.length !== 0
        ? attributes
        : JSON.parse(JSON.stringify(authorityProviderAttributes));
    let updatedAttributes: AuthorityProviderAttributes[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updatedAttributes.push(formAttributes);
      } else {
        updatedAttributes.push(i);
      }
    }
    setAttributes(updatedAttributes);
  }

  function updateAttributesEdit(formAttributes: AuthorityProviderAttributes) {
    let updated = attributes.length !== 0 ? attributes : editableAttributes;
    let updateAttributes: AuthorityProviderAttributes[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setAttributes(updateAttributes);
  }

  const fetchAttributes = (selectedKind: string) => {
    setKind(selectedKind);
    if (selectedKind !== "select") {
      for (let i of connectorDetails?.functionGroups || []) {
        if (
          "authorityProvider" === i.functionGroupCode ||
          "legacyAuthorityProvider" === i.functionGroupCode
        ) {
          dispatch(
            actions.requestAuthorityProviderAttributeList(
              connectorDetails?.uuid || "",
              selectedKind,
              i.functionGroupCode
            )
          );
        }
      }

      setConnectorId(connectorDetails?.uuid);
    } else {
      setConnectorId("0");
    }
  };

  const fetchAvailableKinds = (providerUuid: string) => {
    for (let i of authorityProviders) {
      if (i.uuid.toString() === providerUuid) {
        setConnector(providerUuid);
        for (let j of i.functionGroups) {
          if (
            j.functionGroupCode === "authorityProvider" ||
            j.functionGroupCode === "legacyAuthorityProvider"
          ) {
            setAvailableKinds(j.kinds);
          }
        }
      }
    }
  };

  const setConnector = (providerUuid: string) => {
    for (let i of authorityProviders) {
      if (i.uuid.toString() === providerUuid.toString()) {
        setConnectorDetails(i);
      }
    }
  };

  const submitCallback = useCallback(
    (values: FormValues) => {
      onSubmit(
        values.name,
        connectorUuid || "",
        null,
        "",
        attributes,
        kind || ""
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSubmit, attributes, connectorUuid, credential, editMode, kind]
  );

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <div>
      <Form initialValues={defaultValues} onSubmit={submitCallback}>
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
                  <Label for="name">Authority Name</Label>
                  <Input
                    {...input}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="text"
                    placeholder="Authority Name"
                    disabled={editMode}
                  />
                  <FormFeedback>{meta.error}</FormFeedback>
                </FormGroup>
              )}
            </Field>

            {!editMode ? (
              <Field name="connectorUuid">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="connectorUuid">Authority Provider</Label>
                    <Select
                      maxMenuHeight={140}
                      menuPlacement="auto"
                      options={authorityProviders?.map(function (provider) {
                        return {
                          label: provider.name,
                          value: provider.uuid,
                        };
                      })}
                      placeholder="Select Authority Provider"
                      onChange={(event) =>
                        fetchAvailableKinds(event?.value.toString() || "")
                      }
                    />
                  </FormGroup>
                )}
              </Field>
            ) : (
              <Field name="connectorUuid">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="connectorUuid">Authority Provider</Label>

                    <Input
                      value={connectorDetails?.name}
                      valid={!meta.error && meta.touched}
                      invalid={!!meta.error && meta.touched}
                      type="text"
                      placeholder="Authority Provider Name"
                      disabled={editMode}
                    />
                  </FormGroup>
                )}
              </Field>
            )}

            {!editMode && availableKinds?.length ? (
              <Field name="authorityKind">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="authorityKind">Kind</Label>
                    <Select
                      maxMenuHeight={140}
                      menuPlacement="auto"
                      options={availableKinds?.map(function (kind) {
                        return {
                          label: kind,
                          value: kind,
                        };
                      })}
                      placeholder="Select Kind"
                      onChange={(event) =>
                        fetchAttributes(event?.value.toString() || "default")
                      }
                    />
                  </FormGroup>
                )}
              </Field>
            ) : null}
            {editMode ? (
              <Field name="connectorKind">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="connectorKind">Connector Kind</Label>
                    <Input
                      value={kind}
                      valid={!meta.error && meta.touched}
                      invalid={!!meta.error && meta.touched}
                      type="text"
                      placeholder="Authority Kind"
                      disabled={editMode}
                    />
                  </FormGroup>
                )}
              </Field>
            ) : null}

            {!editMode && kind ? (
              <DynamicForm
                fieldInfo={
                  connectorUuid !== "0"
                    ? JSON.parse(JSON.stringify(passAttributes))
                    : []
                }
                attributeFunction={updateAttributes}
                actions={callbackActions}
                connectorUuid={connectorUuid}
                callbackSelector={callbackResponse}
                setPassAttribute={setPassAttributes}
              />
            ) : null}
            {editMode && kind ? (
              <DynamicForm
                fieldInfo={passEditAttributes}
                attributeFunction={updateAttributesEdit}
                actions={callbackActions}
                connectorUuid={connectorUuid}
                callbackSelector={callbackResponse}
                setPassAttribute={setPassEditAttributes}
                editMode={true}
              />
            ) : null}
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
                  disabled={!editMode ? pristine : false}
                />
              </ButtonGroup>
            </div>
          </BootstrapForm>
        )}
      </Form>
    </div>
  );
}

export default AuthorityForm;
