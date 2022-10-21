import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import { CredentialModel } from "models/credentials";
import { ConnectorModel } from "models/connectors";

import { actions, selectors } from "ducks/credentials";
import { actions as connectorsActions } from "ducks/connectors";

import { collectFormAttributes } from "utils/attributes";
import { mutators } from "utils/attributeEditorMutators";

import Select from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";



interface FormValues {
   name: string | undefined;
   credentialProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
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
   const isCreating = useSelector(selectors.isCreating);
   const isUpdating = useSelector(selectors.isUpdating);

   const [credential, setCredential] = useState<CredentialModel>();
   const [credentialProvider, setCredentialProvider] = useState<ConnectorModel>();

   const isBusy = useMemo(
      () => isFetchingCredentialDetail || isFetchingCredentialProviders || isCreating || isUpdating || isFetchingAttributeDescriptors,
      [isFetchingCredentialDetail, isFetchingCredentialProviders, isCreating, isUpdating, isFetchingAttributeDescriptors]
   );


   useEffect(
      () => {
         dispatch(actions.listCredentialProviders());
         dispatch(connectorsActions.clearCallbackData());

         if (editMode) dispatch(actions.getCredentialDetail({ uuid: params.id }));
      },
      [dispatch, editMode, params.id]
   );


   useEffect(
      () => {

         if (editMode && credentialSelector && credential?.uuid !== credentialSelector.uuid) {
            setCredential(credentialSelector);
         }

      },
      [editMode, credential, credentialSelector]
   );


   useEffect(

      () => {

         if (editMode && credentialProviders && credentialProviders.length > 0 && credential?.uuid === params.id) {

            const provider = credentialProviders.find(p => p.uuid === credential?.connectorUuid);
            if (!provider) return;

            setCredentialProvider(provider);

            dispatch(
               actions.getCredentialProviderAttributesDescriptors({
                  uuid: credential.connectorUuid,
                  kind: credential.kind
               })
            );

         }

      },
      [credential, credentialProviders, dispatch, editMode, params.id]

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
         dispatch(actions.getCredentialProviderAttributesDescriptors({ uuid: credentialProvider.uuid, kind: event.value }));

      },
      [dispatch, credentialProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(actions.updateCredential({
               uuid: params.id,
               attributes: collectFormAttributes("credential", credentialProviderAttributeDescriptors, values)
            }));

         } else {

            dispatch(actions.createCredential({
               name: values.name!,
               connectorUuid: values.credentialProvider!.value,
               kind: values.storeKind?.value!,
               attributes: collectFormAttributes("credential", credentialProviderAttributeDescriptors, values)
            }));

         }

      },
      [editMode, dispatch, params.id, credentialProviderAttributeDescriptors]
   );


   const onCancel = useCallback(
      () => {
         history.goBack();
      },
      [history]
   )


   const submitTitle = useMemo(
      () => editMode ? "Save" : "Create",
      [editMode]
   )


   const inProgressTitle = useMemo(
      () => editMode ? "Saving..." : "Creating...",
      [editMode]
   )


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


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? credential?.name || undefined : undefined,
         credentialProvider: editMode ? credential ? { value: credential.connectorUuid, label: credential.connectorName } : undefined : undefined,
         storeKind: editMode ? credential ? { value: credential?.kind, label: credential?.kind } : undefined : undefined,
      }),
      [editMode, credential]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid }) => (

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
                              placeholder="Enter the Credential Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  {!editMode ? (

                     <Field name="credentialProvider" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="credentialProvider">Credential Provider</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForCredentialProviders}
                                 placeholder="Select Credential Provider"
                                 onChange={(event) => { onCredentialProviderChange(event); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                  ) : (

                     <Field name="credentialProvider" format={(value) => value ? value.label : ""} validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="credentialProvider">Credential Provider</Label>

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

                     <Field name="storeKind" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForKinds}
                                 placeholder="Select Kind"
                                 onChange={(event) => { onKindChange(event); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                           </FormGroup>
                        )}
                     </Field>

                  ) : null}

                  {editMode && credential?.kind ? (

                     <Field name="storeKind" format={(value) => value ? value.label : ""}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Input
                                 {...input}
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

                  {credentialProvider && values.storeKind && credentialProviderAttributeDescriptors && credentialProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Credential Attributes</h6>
                        <hr />


                        <AttributeEditor
                           id="credential"
                           attributeDescriptors={credentialProviderAttributeDescriptors}
                           attributes={credential?.attributes}
                        />
                     </>

                  ) : null}

                  {

                     <div className="d-flex justify-content-end">

                        <ButtonGroup>

                           <ProgressButton
                              title={submitTitle}
                              inProgressTitle={inProgressTitle}
                              inProgress={submitting}
                              disabled={(editMode ? pristine : false) || !valid}
                           />

                           <Button
                              color="default"
                              onClick={onCancel}
                              disabled={submitting}
                           >
                              Cancel
                           </Button>

                        </ButtonGroup>

                     </div>
                  }

               </BootstrapForm>
            )}
         </Form>

      </Widget>

   );

}
