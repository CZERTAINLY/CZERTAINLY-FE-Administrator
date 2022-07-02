import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import { ConnectorModel } from "models/connectors";
import { AuthorityModel } from "models/authorities";

import { actions as alertActions } from "ducks/alerts";
import { actions as authorityActions, selectors as authoritySelectors } from "ducks/authorities";

import { mutators } from "utils/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes";

import Select from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";


interface FormValues {
   name: string | undefined;
   authorityProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}

export interface Props {
   title: string | JSX.Element;
}

export default function AuthorityForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

   const authoritySelector = useSelector(authoritySelectors.authority);
   const authorityProviders = useSelector(authoritySelectors.authorityProviders);
   const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors);

   const isFetchingAuthorityDetail = useSelector(authoritySelectors.isFetchingDetail);
   const isFetchingAuthorityProviders = useSelector(authoritySelectors.isFetchingAuthorityProviders);
   const isFetchingAttributeDescriptors = useSelector(authoritySelectors.isFetchingAuthorityProviderAttributeDescriptors);
   const isCreating = useSelector(authoritySelectors.isCreating);
   const isUpdating = useSelector(authoritySelectors.isUpdating);

   const [init, setInit] = useState(true);

   const [authority, setAuthority] = useState<AuthorityModel>();
   const [authorityProvider, setAuthorityProvider] = useState<ConnectorModel>();

   const isBusy = useMemo(
      () => isFetchingAuthorityDetail || isFetchingAuthorityProviders || isCreating || isUpdating || isFetchingAttributeDescriptors,
      [isFetchingAuthorityDetail, isFetchingAuthorityProviders, isCreating, isUpdating, isFetchingAttributeDescriptors]
   );

   useEffect(

      () => {

         if (init) {
            dispatch(authorityActions.resetState());
            setInit(false);
         }

         if (editMode && (!authoritySelector || authoritySelector.uuid !== params.id)) {
            dispatch(authorityActions.getAuthorityDetail({ uuid: params.id }));
         }

         if (init) {
            dispatch(authorityActions.listAuthorityProviders());
         }

         if (editMode && authoritySelector?.uuid === params.id) {
            setAuthority(authoritySelector);
         }

      },
      [dispatch, editMode, params.id, authoritySelector, authorityProviders, isFetchingAuthorityProviders, init]

   );

   useEffect(

      () => {

         if (!authorityProvider && editMode && authoritySelector?.uuid === params.id && authorityProviders && authorityProviders.length > 0) {

            const provider = authorityProviders.find(p => p.uuid === authoritySelector.connectorUuid);

            if (provider) {
               setAuthorityProvider(provider);
               dispatch(authorityActions.getAuthorityProviderAttributesDescriptors({ uuid: authoritySelector.connectorUuid, kind: authoritySelector.kind }));
            } else {
               dispatch(alertActions.error("Authority provider not found"));
            }

         }

      },
      [authorityProvider, dispatch, editMode, params.id, authoritySelector, authorityProviders, isFetchingAuthorityProviders]

   );


   const onAuthorityProviderChange = useCallback(

      (event) => {

         dispatch(authorityActions.cleatAuthorityProviderAttributeDescriptors());

         if (!event.value || !authorityProviders) return;
         const provider = authorityProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setAuthorityProvider(provider);

      },
      [dispatch, authorityProviders]

   );


   const onKindChange = useCallback(

      (event) => {

         if (!event.value || !authorityProvider) return;
         dispatch(authorityActions.getAuthorityProviderAttributesDescriptors({ uuid: authorityProvider.uuid, kind: event.value }));

      },
      [dispatch, authorityProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(authorityActions.updateAuthority({
               uuid: params.id,
               attributes: collectFormAttributes("authority", authorityProviderAttributeDescriptors, values)
            }));

         } else {

            dispatch(authorityActions.createAuthority({
               name: values.name!,
               connectorUuid: values.authorityProvider!.value,
               kind: values.storeKind?.value!,
               attributes: collectFormAttributes("authority", authorityProviderAttributeDescriptors, values)
            }));

         }

      },
      [editMode, dispatch, params.id, authorityProviderAttributeDescriptors]
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


   const optionsForAuthorityProviders = useMemo(

      () => authorityProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [authorityProviders]

   );


   const optionsForKinds = useMemo(

      () => authorityProvider?.functionGroups.find(
         fg => fg.functionGroupCode === "authorityProvider"
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [authorityProvider]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? authority?.name || undefined : undefined,
         authorityProvider: editMode ? authority ? { value: authority.connectorUuid, label: authority.connectorName } : undefined : undefined,
         storeKind: editMode ? authority ? { value: authority?.kind, label: authority?.kind } : undefined : undefined,
      }),
      [editMode, authority]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Certification Authority Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Certification Authority Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  {!editMode ? (

                     <Field name="authorityProvider" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="authorityProvider">Authority Provider</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForAuthorityProviders}
                                 placeholder="Select Authority Provider"
                                 onChange={(event) => { onAuthorityProviderChange(event); form.mutators.clearAttributes(); form.mutators.setAttribute("storeKind", undefined); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                  ) : (

                     <Field name="authorityProvider" format={(value) => value ? value.label : ""} validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="authorityProvider">Authority Provider</Label>

                              <Input
                                 {...input}
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
                                 placeholder="Select Key Store Kind"
                                 onChange={(event) => { onKindChange(event); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>Required Field</div>

                           </FormGroup>
                        )}
                     </Field>

                  ) : null}

                  {editMode && authority?.kind ? (

                     <Field name="storeKind" format={(value) => value ? value.label : ""}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Input
                                 {...input}
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

                  {authorityProvider && values.storeKind && authorityProviderAttributeDescriptors && authorityProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Authority Attributes</h6>
                        <hr />

                        <AttributeEditor
                           id="authority"
                           attributeDescriptors={authorityProviderAttributeDescriptors}
                           attributes={authority?.attributes}
                           connectorUuid={authorityProvider.uuid}
                           functionGroup={"authorityProvider"}
                           kind={values.storeKind.value}
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
