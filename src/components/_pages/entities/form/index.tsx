import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Field, Form } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

import { actions as alertActions } from "ducks/alerts";
import { actions as entityActions, selectors as entitySelectors } from "ducks/entities";
import { actions as connectorActions } from "ducks/connectors";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import Select from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import { EntityResponseModel } from "types/entities";
import { ConnectorResponseModel } from "types/connectors";
import { FunctionGroupCode } from "types/openapi";


interface FormValues {
   name: string | undefined;
   entityProvider: { value: string; label: string } | undefined;
   storeKind: { value: string; label: string } | undefined;
}


export default function EntityForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo( () => !!id, [id] );

   const entitySelector = useSelector(entitySelectors.entity);
   const entityProviders = useSelector(entitySelectors.entityProviders);
   const entityProviderAttributeDescriptors = useSelector(entitySelectors.entityProviderAttributeDescriptors);

   const isFetchingEntityDetail = useSelector(entitySelectors.isFetchingDetail);
   const isFetchingEntityProviders = useSelector(entitySelectors.isFetchingEntityProviders);
   const isFetchingAttributeDescriptors = useSelector(entitySelectors.isFetchingEntityProviderAttributeDescriptors);
   const isCreating = useSelector(entitySelectors.isCreating);
   const isUpdating = useSelector(entitySelectors.isUpdating);

   const [entity, setEntity] = useState<EntityResponseModel>();
   const [entityProvider, setEntityProvider] = useState<ConnectorResponseModel>();

   const isBusy = useMemo(
      () => isFetchingEntityDetail || isFetchingEntityProviders || isCreating || isUpdating || isFetchingAttributeDescriptors,
      [isFetchingEntityDetail, isFetchingEntityProviders, isCreating, isUpdating, isFetchingAttributeDescriptors]
   );

   useEffect(

      () => {
         dispatch(entityActions.resetState());
         dispatch(connectorActions.clearCallbackData());
         dispatch(entityActions.listEntityProviders());

         if (editMode) {
            dispatch(entityActions.getEntityDetail({ uuid: id! }));
         }
      },
      [dispatch, editMode, id]

   );

   useEffect(

      () => {

         if (editMode && entitySelector?.uuid === id) {
            setEntity(entitySelector);
         }

      },
      [dispatch, editMode, id, entitySelector, entityProviders, isFetchingEntityProviders]

   );

   useEffect(

      () => {

         if (!entityProvider && editMode && entitySelector?.uuid === id && entityProviders && entityProviders.length > 0) {

            if (!entitySelector!.connectorUuid) {
               dispatch(alertActions.error("Entity provider was probably deleted"));
               return;
            }

            const provider = entityProviders.find(p => p.uuid === entitySelector!.connectorUuid);

            if (provider) {
               setEntityProvider(provider);
               dispatch(entityActions.getEntityProviderAttributesDescriptors({ uuid: entitySelector!.connectorUuid, kind: entitySelector!.kind }));
            } else {
               dispatch(alertActions.error("Entity provider not found"));
            }

         }

      },
      [entityProvider, dispatch, editMode, id, entitySelector, entityProviders, isFetchingEntityProviders]

   );


   const onEntityProviderChange = useCallback(

      (event: { value: string }) => {

         dispatch(entityActions.clearEntityProviderAttributeDescriptors());

         if (!event.value || !entityProviders) return;
         const provider = entityProviders.find(p => p.uuid === event.value);

         if (!provider) return;
         setEntityProvider(provider);

      },
      [dispatch, entityProviders]

   );


   const onKindChange = useCallback(

      (event: { value: string }) => {

         if (!event.value || !entityProvider) return;
         dispatch(entityActions.getEntityProviderAttributesDescriptors({ uuid: entityProvider.uuid, kind: event.value }));

      },
      [dispatch, entityProvider]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(entityActions.updateEntity({
               uuid: id!,
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
      [editMode, dispatch, id, entityProviderAttributeDescriptors]
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
         name: editMode ? entity?.name || undefined : undefined,
         entityProvider: editMode ? entity ? { value: entity.connectorUuid, label: entity.connectorName } : undefined : undefined,
         storeKind: editMode ? entity ? { value: entity?.kind, label: entity?.kind } : undefined : undefined,
      }),
      [editMode, entity]
   );


   const title = useMemo(

      () => editMode ? "Edit Entity" : "Create Entity",
      [editMode]

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

                  {editMode && entity?.kind ? (

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
                           attributes={entity?.attributes}
                           connectorUuid={entityProvider.uuid}
                           functionGroupCode={FunctionGroupCode.EntityProvider}
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
