import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import { ConnectorModel } from "models/connectors";
import { LocationModel } from "models/locations";

import { actions as alertActions } from "ducks/alerts";
import { actions as locationActions, selectors as locationSelectors } from "ducks/locations";
import { actions as entityActions, selectors as entitySelectors } from "ducks/locations";

import { mutators } from "utils/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes";

import Select from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";


interface FormValues {
   name: string | undefined;
   entityProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}

export interface Props {
   title: string | JSX.Element;
}

export default function EntityForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   );

   const locationAttributeDescriptors = useSelector(entitySelectors.)
   const locationSelector = useSelector(locationSelectors.location);

   const isFetchingLocationDetail = useSelector(locationSelectors.isFetchingDetail);
   const isCreating = useSelector(locationSelectors.isCreating);
   const isUpdating = useSelector(locationSelectors.isUpdating);

   const [init, setInit] = useState(true);

   const [location, setLocation] = useState<LocationModel>();

   const isBusy = useMemo(
      () => isFetchingLocationDetail || isCreating || isUpdating,
      [isFetchingLocationDetail, isCreating, isUpdating]
   );

   useEffect(

      () => {

         if (init) {
            dispatch(locationActions.resetState());
            setInit(false);
         }

         if (editMode && (!locationSelector || locationSelector.uuid !== params.id)) {
            dispatch(locationActions.getLocationDetail({ uuid: params.id }));
         }


         if (editMode && locationSelector?.uuid === params.id) {
            setLocation(locationSelector);
         }

      },
      [dispatch, editMode, locationSelector, params.id, init]

   );

   useEffect(

      () => {

         if (!editMode && locationSelector?.uuid === params.id) {

            /*
            if (!locationSelector.connectorUuid) {
               dispatch(alertActions.error("Entity provider was probably deleted"));
               return;
            }
            */

            const provider = entityProviders.find(p => p.uuid === locationSelector.connectorUuid);

            if (provider) {
               setEntityProvider(provider);
               dispatch(entityActions.getEntityProviderAttributesDescriptors({ uuid: locationSelector.connectorUuid, kind: locationSelector.kind }));
            } else {
               dispatch(alertActions.error("Entity provider not found"));
            }

         }

      },
      [entityProvider, dispatch, editMode, params.id, locationSelector, entityProviders, isFetchingEntityProviders]

   );


   const onEntityProviderChange = useCallback(

      (event) => {

         dispatch(entityActions.clearEntityProviderAttributeDescriptors());

         if (!event.value || !entityProviders) return;
         const provider = entityProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setEntityProvider(provider);

      },
      [dispatch, entityProviders]

   );


   const onKindChange = useCallback(

      (event) => {

         if (!event.value || !entityProvider) return;
         dispatch(entityActions.getEntityProviderAttributesDescriptors({ uuid: entityProvider.uuid, kind: event.value }));

      },
      [dispatch, entityProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(entityActions.updateEntity({
               uuid: params.id,
               attributes: collectFormAttributes("entity", entityProviderAttributeDescriptors, values)
            }));

         } else {

            dispatch(entityActions.addEntity({
               name: values.name!,
               connectorUuid: values.entityProvider!.value,
               kind: values.storeKind?.value!,
               attributes: collectFormAttributes("entity", entityProviderAttributeDescriptors, values)
            }));

         }

      },
      [editMode, dispatch, params.id, entityProviderAttributeDescriptors]
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


   const optionsForEntityProviders = useMemo(

      () => entityProviders?.map(
         provider => ({
            label: provider.name,
            value: provider.uuid,
         })
      ),
      [entityProviders]

   );


   const optionsForKinds = useMemo(

      () => entityProvider?.functionGroups.find(
         fg => fg.functionGroupCode === "entityProvider"
      )?.kinds.map(
         kind => ({
            label: kind,
            value: kind
         })
      ) ?? [],
      [entityProvider]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? location?.name || undefined : undefined,
         entityProvider: editMode ? location ? { value: location.connectorUuid, label: location.connectorName } : undefined : undefined,
         storeKind: editMode ? location ? { value: location?.kind, label: location?.kind } : undefined : undefined,
      }),
      [editMode, location]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, values, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Entity Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Entity Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>

                  {!editMode ? (

                     <Field name="entityProvider" validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="entityProvider">Entity Provider</Label>

                              <Select
                                 {...input}
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForEntityProviders}
                                 placeholder="Select Entity Provider"
                                 onChange={(event) => { onEntityProviderChange(event); form.mutators.clearAttributes(); form.mutators.setAttribute("storeKind", undefined); input.onChange(event); }}
                                 styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                              />

                              <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                           </FormGroup>

                        )}

                     </Field>

                  ) : (

                     <Field name="entityProvider" format={(value) => value ? value.label : ""} validate={validateRequired()}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="entityProvider">Entity Provider</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Entity Provider Name"
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

                  {editMode && location?.kind ? (

                     <Field name="storeKind" format={(value) => value ? value.label : ""}>

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="storeKind">Kind</Label>

                              <Input
                                 {...input}
                                 valid={!meta.error && meta.touched}
                                 invalid={!!meta.error && meta.touched}
                                 type="text"
                                 placeholder="Entity Kind"
                                 disabled={editMode}
                              />

                           </FormGroup>

                        )}

                     </Field>

                  ) : null}

                  {entityProvider && values.storeKind && entityProviderAttributeDescriptors && entityProviderAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Entity Attributes</h6>
                        <hr />

                        <AttributeEditor
                           id="entity"
                           attributeDescriptors={entityProviderAttributeDescriptors}
                           attributes={location?.attributes}
                           connectorUuid={entityProvider.uuid}
                           functionGroupCode={"entityProvider"}
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
