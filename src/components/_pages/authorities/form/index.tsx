import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Field, Form } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

import { actions as alertActions } from "ducks/alerts";
import { actions as authorityActions, selectors as authoritySelectors } from "ducks/authorities";
import { actions as connectorActions } from "ducks/connectors";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import Select, { SingleValue } from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import { AuthorityResponseModel } from "types/authorities";
import { ConnectorResponseModel } from "types/connectors";
import { FunctionGroupCode } from "types/openapi";


interface FormValues {
   name: string | undefined;
   authorityProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}


export default function AuthorityForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo(() => !!id, [id]);


   const authoritySelector = useSelector(authoritySelectors.authority);
   const authorityProviders = useSelector(authoritySelectors.authorityProviders);
   const authorityProviderAttributeDescriptors = useSelector(authoritySelectors.authorityProviderAttributeDescriptors);

   const isFetchingAuthorityDetail = useSelector(authoritySelectors.isFetchingDetail);
   const isFetchingAuthorityProviders = useSelector(authoritySelectors.isFetchingAuthorityProviders);
   const isFetchingAttributeDescriptors = useSelector(authoritySelectors.isFetchingAuthorityProviderAttributeDescriptors);
   const isCreating = useSelector(authoritySelectors.isCreating);
   const isUpdating = useSelector(authoritySelectors.isUpdating);


   const [authority, setAuthority] = useState<AuthorityResponseModel>();
   const [authorityProvider, setAuthorityProvider] = useState<ConnectorResponseModel>();


   const isBusy = useMemo(
      () => isFetchingAuthorityDetail || isFetchingAuthorityProviders || isCreating || isUpdating || isFetchingAttributeDescriptors,
      [isFetchingAuthorityDetail, isFetchingAuthorityProviders, isCreating, isUpdating, isFetchingAttributeDescriptors]
   );


   useEffect(

      () => {

         dispatch(authorityActions.resetState());
         dispatch(connectorActions.clearCallbackData());
         dispatch(authorityActions.listAuthorityProviders());

      },
      [dispatch]

   )


   useEffect(

      () => {

         if (editMode && (!authoritySelector || authoritySelector.uuid !== id)) {
            dispatch(authorityActions.getAuthorityDetail({ uuid: id! }));
         }

      },
      [dispatch, editMode, authoritySelector, authorityProviders, isFetchingAuthorityProviders, id]

   );


   useEffect(

      () => {

         if (editMode && authoritySelector?.uuid === id) {
            setAuthority(authoritySelector);
         }

      },
      [authoritySelector, editMode, id]

   )


   useEffect(

      () => {

         if (!authorityProvider && editMode && authoritySelector?.uuid === id && authorityProviders && authorityProviders.length > 0) {

            if (!authoritySelector!.connectorUuid) {
               dispatch(alertActions.error("Authority provider was probably deleted"));
               return;
            }

            const provider = authorityProviders.find(p => p.uuid === authoritySelector!.connectorUuid);

            if (provider) {
               setAuthorityProvider(provider);
               dispatch(authorityActions.getAuthorityProviderAttributesDescriptors({ uuid: authoritySelector!.connectorUuid, kind: authoritySelector!.kind }));
            } else {
               dispatch(alertActions.error("Authority provider not found"));
            }

         }

      },
      [authorityProvider, dispatch, editMode, authoritySelector, authorityProviders, isFetchingAuthorityProviders, id]

   );


   const onAuthorityProviderChange = useCallback(

      (event: SingleValue<{
         label: string | undefined;
         value: string | undefined;
      }>) => {

         if (!event) return;

         dispatch(authorityActions.clearAuthorityProviderAttributeDescriptors());

         if (!event.value || !authorityProviders) return;
         const provider = authorityProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setAuthorityProvider(provider);

      },
      [dispatch, authorityProviders]

   );


   const onKindChange = useCallback(

      (event: SingleValue<{
         label: string | undefined;
         value: string | undefined;
      }>) => {

         if (!event || !event.value || !authorityProvider) return;
         dispatch(authorityActions.getAuthorityProviderAttributesDescriptors({ uuid: authorityProvider.uuid, kind: event.value }));

      },
      [dispatch, authorityProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(authorityActions.updateAuthority({
               uuid: id!,
               attributes: collectFormAttributes("authority", authorityProviderAttributeDescriptors, values),
                customAttributes: []
            }));

         } else {

            dispatch(authorityActions.createAuthority({
               name: values.name!,
               connectorUuid: values.authorityProvider!.value,
               kind: values.storeKind?.value!,
               attributes: collectFormAttributes("authority", authorityProviderAttributeDescriptors, values),
                customAttributes: []
            }));

         }

      },
      [editMode, dispatch, id, authorityProviderAttributeDescriptors]
   );


   const onCancel = useCallback(
      () => {
         navigate(-1);
      },
      [navigate]
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


   const title = useMemo(
      () => editMode ? `Edit authority ${authority?.name}` : "Create new authority",
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
                                 placeholder="Select Kind"
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
                           functionGroupCode={FunctionGroupCode.AuthorityProvider}
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
