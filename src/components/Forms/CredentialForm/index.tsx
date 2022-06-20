import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric, validateUrl } from "utils/validators";

import { actions, selectors } from "ducks/credentials";
import { CredentialModel } from "models/credentials";
import Select from "react-select/";
import { ConnectorModel } from "models/connectors";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";


interface FormValues {
   name: string;
   url: string;
   connectorUuid: string;
   kind: string;
}

export interface Props {
   title: string | JSX.Element;
}

export default function CredentialForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );


   const credentialSelector = useSelector(selectors.credential);
   const credentialProviders = useSelector(selectors.credentialProviders);
   const credentialProviderAttributeDescriptors = useSelector(selectors.credentialProviderAttributeDescriptors);

   const isFetchingCredentialDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingCredentialProviders = useSelector(selectors.isFetchingCredentialProviders);
   const isFetchingAttributeDescriptors = useSelector(selectors.isFetchingCredentialProviderAttributeDescriptors);
   const isCreatingCredential = useSelector(selectors.isCreating);
   const isUpdatingCredential = useSelector(selectors.isUpdating);

   const [credential, setCredential] = useState<CredentialModel>();
   const [credentialProvider, setCredentialProvider] = useState<ConnectorModel>();
   const [kind, setKind] = useState<string>();

   const isBusy = useMemo(
      () => isFetchingCredentialDetail || isFetchingCredentialProviders || isCreatingCredential || isUpdatingCredential || isFetchingAttributeDescriptors,
      [isFetchingCredentialDetail, isFetchingCredentialProviders, isCreatingCredential, isUpdatingCredential, isFetchingAttributeDescriptors]
   );

   useEffect(

      () => {

         if (editMode && (!credentialSelector || credentialSelector.uuid !== params.id)) {
            dispatch(actions.getCredentialDetail(params.id));
         }

         if (!credentialProviders) {
            dispatch(actions.listCredentialProviders());
         }

         if (editMode && credentialSelector?.uuid === params.id) {
            setCredential(credentialSelector);
            setKind(credentialSelector.kind);
         }

         if (editMode && credentialSelector?.uuid === params.id && credentialProviders && credentialProviders.length > 0) {
            const provider = credentialProviders.find(p => p.uuid === credentialSelector.connectorUuid);
            if (provider) {
               setCredentialProvider(provider);
               dispatch(actions.listCredentialProviderAttributeDescriptors({ uuid: credentialSelector.connectorUuid, kind: credentialSelector.kind }));
            }
         }



      },
      [dispatch, editMode, params.id, credentialSelector, credentialProviders]

   );


   const onCredentialProviderChange = useCallback(

      (event) => {

         if (!event.value || !credentialProviders) return;
         const provider = credentialProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setCredentialProvider(provider);

      },
      [credentialProviders]

   );


   const onKindChange = useCallback(

      (event) => {

         if (!event.value || !credentialProvider) return;
         setKind(event.value);
         dispatch(actions.listCredentialProviderAttributeDescriptors({ uuid: credentialProvider.uuid, kind: event.value }));

      },
      [dispatch, credentialProvider]

   );



   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(actions.updateCredential({
               uuid: params.id,
               attributes: []
            }));

         } else {

            dispatch(actions.createCredential({
               name: values.name,
               connectorUuid: values.connectorUuid,
               kind: values.kind,
               attributes: []
            }));

         }
      },
      [editMode, dispatch, credential]
   );


   const optionsForCredentialProviders = useMemo(

      () => credentialProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [credentialProviders]

   );


   const optionsForKinds = useMemo(

      () => credentialProvider?.functionGroups.find(
         fg => fg.functionGroupCode === "credentialProvider"
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [credentialProvider]

   );


   const defaultValues = useMemo(
      () => ({
         name: editMode ? credential?.name : "",
         connectorName: editMode ? credential?.connectorName : "",
         test: "qwert"
      }),
      [editMode, credential]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit}>

            {({ handleSubmit, pristine, submitting }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Credential Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Credential Name"
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

                              <Label for="connectorUuid">Credential Provider</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForCredentialProviders}
                                 placeholder="Select Credential Provider"
                                 onChange={(event) => { onCredentialProviderChange(event); input.onChange(event); }}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  ) : (

                     <Field name="connectorName">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="connectorName">Credential Provider</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Credential Name"
                                 disabled={editMode}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  )}

                  {!editMode && optionsForKinds?.length ? (

                     <Field name="connectorKind">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="connectorKind">Kind</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForKinds}
                                 placeholder="Select Kind"
                                 onChange={(event) => { onKindChange(event); input.onChange(event); }}
                              />
                           </FormGroup>
                        )}
                     </Field>

                  ) : null}

                  {editMode && credential?.kind ? (

                     <Field name="connectorKind">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="connectorKind">Kind</Label>

                              <Input
                                 value={credential?.kind}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Credential Kind"
                                 disabled={editMode}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  ) : null}

                  {credentialProvider && kind && credentialProviderAttributeDescriptors && credentialProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Credential Attributes</h6>
                        <hr />


                        <AttributeEditor
                           attributeDescriptors={credentialProviderAttributeDescriptors}
                           attributes={credential?.attributes}
                        />
                     </>

                  ) : null}

                  {/* {!editMode && kind ? (
                     <DynamicForm
                        fieldInfo={
                           connectorUuid !== "0"
                              ? JSON.parse(JSON.stringify(originalAttributes)) || []
                              : []
                        }
                        attributeFunction={updateAttributes}
                        kind=""
                        functionGroup=""
                     />
                  ) : null}
                  {editMode && kind ? (
                     <DynamicForm
                        fieldInfo={JSON.parse(JSON.stringify(editableAttributes))}
                        attributeFunction={updateAttributesEdit}
                        editMode={true}
                        kind=""
                        functionGroup=""
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
                  */}

               </BootstrapForm>
            )}
         </Form>

      </Widget>

   );

}



/*
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
import { actions, selectors } from "ducks/credentials";
import { CredentialProviderAttributes } from "api/credentials";
import { attributeCombiner } from "utils/commons";
import { ConnectorInfoResponse } from "api/connectors";

export interface DefaultValues {
  name?: string;
  kind?: string;
  connectorUuid?: string;
  attributes?: any;
}

interface FormValues {
  name: string;
  kind: string;
  connectorUuid: string;
  attributes: any;
}

interface Props {
  editMode?: boolean;
  defaultValues?: DefaultValues;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    kind: string,
    connectorUuid: string,
    attributes: any
  ) => void;
}

function CredentialForm({
  defaultValues,
  editMode,
  isSubmitting,
  onCancel,
  onSubmit,
}: Props) {
  const credentialProviders = useSelector(selectors.selectCredentialProviders);
  const credentialProviderAttributes = useSelector(
    selectors.selectCredentialProviderAttributes
  );
  const originalAttributes = JSON.parse(
    JSON.stringify(credentialProviderAttributes)
  );
  const dispatch = useDispatch();
  const connectorUuidCred = defaultValues?.connectorUuid || "note";
  const [editableAttributes, setEditableAttributes]: any = useState([]);
  const defaultAttributes = defaultValues?.attributes;
  const [attributes, setAttributes] = useState(credentialProviderAttributes);
  const [connectorUuid, setConnectorId] = useState<string>();
  const [availableKinds, setAvailableKinds] = useState<string[]>();
  const [kind, setKind] = useState<string>();
  const [connectorDetails, setConnectorDetails] =
    useState<ConnectorInfoResponse>();
  // eslint-disable-next-line
  const [providerDefault, setProviderDefault]: any = useState();

  useEffect(() => {
    dispatch(actions.requestCredentialProviderList());
  }, [dispatch]);

  useEffect(() => {
    for (let i of credentialProviders) {
      if (i.uuid.toString() === connectorUuidCred.toString()) {
        setProviderDefault({
          label: i.name,
          value: i.uuid,
        });
      }
    }
  }, [editMode, connectorUuidCred, credentialProviders]);

  useEffect(() => {
    if (
      editMode &&
      connectorUuidCred !== "note" &&
      credentialProviders.length > 0
    ) {
      setConnector(connectorUuidCred);
      setKind(defaultValues?.kind);
      dispatch(
        actions.requestCredentialProviderAttributeList(
          connectorUuidCred,
          "credentialProvider",
          defaultValues?.kind || ""
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorUuidCred, editMode, credentialProviders]);

  useEffect(() => {
    if (credentialProviderAttributes.length > 0 && editMode) {
      setEditableAttributes(
        attributeCombiner(defaultAttributes, credentialProviderAttributes)
      );
    }
  }, [credentialProviderAttributes, defaultAttributes, editMode]);

  function updateAttributes(formAttributes: CredentialProviderAttributes) {
    let updated =
      attributes.length !== 0
        ? attributes
        : JSON.parse(JSON.stringify(credentialProviderAttributes));
    let updateAttributes: CredentialProviderAttributes[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setAttributes(updateAttributes);
  }

  function updateAttributesEdit(formAttributes: CredentialProviderAttributes) {
    let updated =
      attributes.length !== 0
        ? attributes
        : JSON.parse(JSON.stringify(editableAttributes));
    let updateAttributes: CredentialProviderAttributes[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setAttributes(updateAttributes);
  }

  const fetchAvailableKinds = (providerUuid: string) => {
    for (let i of credentialProviders) {
      if (i.uuid.toString() === providerUuid) {
        setConnector(providerUuid);
        for (let j of i.functionGroups) {
          if (j.functionGroupCode === "credentialProvider") {
            setAvailableKinds(j.kinds);
          }
        }
      }
    }
  };

  const setConnector = (providerUuid: string) => {
    for (let i of credentialProviders) {
      if (i.uuid.toString() === providerUuid.toString()) {
        setConnectorDetails(i);
        setProviderDefault({
          label: i.name,
          value: i.uuid,
        });
      }
    }
  };

  const fetchAttributes = (selectedKind: string) => {
    setKind(selectedKind);
    if (selectedKind !== "select") {
      dispatch(
        actions.requestCredentialProviderAttributeList(
          connectorDetails?.uuid || "",
          "credentialProvider",
          selectedKind
        )
      );
      setConnectorId(connectorDetails?.uuid);
    } else {
      setConnectorId("0");
    }
  };

  const submitCallback = useCallback(
    (values: FormValues) => {
      let changedAttributes: CredentialProviderAttributes[] = [];
      if (!editMode) {
        for (let i of attributes) {
          if (
            JSON.stringify(credentialProviderAttributes).indexOf(
              JSON.stringify(i)
            ) < 0
          )
            changedAttributes.push(i);
        }
      } else {
        for (let i of attributes) {
          if (
            JSON.stringify(editableAttributes).indexOf(JSON.stringify(i)) < 0 ||
            !!i.value
          )
            if (
              typeof i.value === "object" &&
              typeof i.value.id === "undefined"
            ) {
              try {
                if (i.value[0] !== "NON_MANDATORY") {
                  i.value = i.value[0];
                } else {
                  i.value = undefined;
                }
              } catch {
                console.warn("Non List Items");
              }
            }
          changedAttributes.push(i);
        }
      }
      let connectorUuidSub = connectorUuid;
      if (editMode) {
        connectorUuidSub = connectorUuidCred;
      }
      onSubmit(
        values.name,
        kind || values.kind,
        connectorUuidSub || "",
        changedAttributes
      );
    },
    [
      onSubmit,
      attributes,
      connectorUuid,
      credentialProviderAttributes,
      editMode,
      connectorUuidCred,
      editableAttributes,
      kind,
    ]
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
                  <Label for="name">Credential Name</Label>
                  <Input
                    {...input}
                    valid={!meta.error && meta.touched}
                    invalid={!!meta.error && meta.touched}
                    type="text"
                    placeholder="Credential Name"
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
                    <Label for="connectorUuid">Credential Provider</Label>
                    <Select
                      maxMenuHeight={140}
                      menuPlacement="auto"
                      options={credentialProviders?.map(function (provider) {
                        return {
                          label: provider.name,
                          value: provider.uuid,
                        };
                      })}
                      placeholder="Select Credential Provider"
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
                    <Label for="connectorUuid">Credential Provider</Label>
                    <Input
                      value={connectorDetails?.name}
                      valid={!meta.error && meta.touched}
                      invalid={!!meta.error && meta.touched}
                      type="text"
                      placeholder="Credential Name"
                      disabled={editMode}
                    />
                  </FormGroup>
                )}
              </Field>
            )}
            {!editMode && availableKinds?.length ? (
              <Field name="connectorKind">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="connectorKind">Kind</Label>
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
            {editMode && kind ? (
              <Field name="connectorKind">
                {({ input, meta }) => (
                  <FormGroup>
                    <Label for="connectorKind">Kind</Label>
                    <Input
                      value={kind}
                      valid={!meta.error && meta.touched}
                      invalid={!!meta.error && meta.touched}
                      type="text"
                      placeholder="Credential Kind"
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
                    ? JSON.parse(JSON.stringify(originalAttributes)) || []
                    : []
                }
                attributeFunction={updateAttributes}
                kind=""
                functionGroup=""
              />
            ) : null}
            {editMode && kind ? (
              <DynamicForm
                fieldInfo={JSON.parse(JSON.stringify(editableAttributes))}
                attributeFunction={updateAttributesEdit}
                editMode={true}
                kind=""
                functionGroup=""
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

export default CredentialForm;*/