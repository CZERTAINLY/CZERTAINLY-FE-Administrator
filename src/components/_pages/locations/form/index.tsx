import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric } from "utils/validators";

import { LocationModel } from "models/locations";

import { actions as locationActions, selectors as locationSelectors } from "ducks/locations";
import { actions as entityActions, selectors as entitySelectors } from "ducks/entities";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import Select from "react-select/";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";


interface FormValues {
   name: string | undefined;
   description: string | undefined;
   entity: { value: string; label: string } | undefined;
}


export default function EntityForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { entityId, id } = useParams();

   const editMode = useMemo( () => id && entityId ? true : false, [entityId, id] );

   const entities = useSelector(entitySelectors.entities);
   const locationAttributeDescriptors = useSelector(entitySelectors.locationAttributeDescriptors);

   const locationSelector = useSelector(locationSelectors.location);

   const isFetchingLocationDetail = useSelector(locationSelectors.isFetchingDetail);
   const isCreating = useSelector(locationSelectors.isCreating);
   const isUpdating = useSelector(locationSelectors.isUpdating);

   const isFetchingLocationAttributeDescriptors = useSelector(entitySelectors.isFetchingLocationAttributeDescriptors);
   const isFetchingEntities = useSelector(entitySelectors.isFetchingList);


   const [init, setInit] = useState(true);

   const [location, setLocation] = useState<LocationModel>();

   const isBusy = useMemo(
      () => isFetchingLocationDetail || isCreating || isUpdating || isFetchingEntities || isFetchingLocationAttributeDescriptors,
      [isFetchingLocationDetail, isCreating, isUpdating, isFetchingEntities, isFetchingLocationAttributeDescriptors]
   );


   useEffect(

      () => {

         if (init) {
            dispatch(locationActions.resetState());
            dispatch(entityActions.resetState());
            dispatch(entityActions.listEntities());
            setInit(false);
         }

         if (editMode && (!locationSelector || locationSelector.uuid !== id)) {
            dispatch(locationActions.getLocationDetail({ entityUuid: entityId!, uuid: id! }));
         }


         if (editMode && locationSelector?.uuid === id) {
            setLocation(locationSelector);
         }

      },
      [dispatch, editMode, locationSelector, id, init,  entityId]

   );


   useEffect(

      () => {

         if (editMode && location?.uuid === id && entities && entities.length > 0) {
            dispatch(entityActions.listLocationAttributeDescriptors({ entityUuid: location!.entityInstanceUuid }));
         }

      },
      [dispatch, editMode, location, id, entities]

   );


   const onEntityChange = useCallback(

      (event: { value: string }) => {

         if (!event.value) return;
         dispatch(entityActions.listLocationAttributeDescriptors({ entityUuid: event.value }));

      },
      [dispatch]

   );


   const onSubmit = useCallback(

      (values: FormValues, form: any) => {

         if (editMode) {

            dispatch(locationActions.editLocation({
               uuid: id!,
               description: values.description || "",
               enabled: location!.enabled,
               entityUuid: values.entity!.value,
               attributes: collectFormAttributes("location", locationAttributeDescriptors, values),
            }));

         } else {

            dispatch(locationActions.addLocation({
               name: values.name!,
               description: values.description || "",
               enabled: true,
               entityUuid: values.entity!.value,
               attributes: collectFormAttributes("location", locationAttributeDescriptors, values),
            }));

         }

      },
      [dispatch, editMode, location, locationAttributeDescriptors, id]

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


   const optionsForEntities = useMemo(

      () => entities?.map(
         entity => ({
            label: entity.name,
            value: entity.uuid,
         })
      ),
      [entities]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? location?.name || undefined : undefined,
         description: editMode ? location?.description || undefined : undefined,
         entity: editMode ? location ? { value: location.entityInstanceUuid, label: location.entityInstanceName } : undefined : undefined,
      }),
      [editMode, location]
   );


   const title = useMemo(

      () => editMode ? `Edit Location: ${location?.name}` : "Add Location",
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

                           <Label for="name">Location Name</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the Location Name"
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>


                  <Field name="description" validate={composeValidators(validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">Location Description</Label>

                           <Input
                              {...input}
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                              type="text"
                              placeholder="Enter the location description"
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>
                     )}

                  </Field>


                  <Field name="entity" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="entity">Entity</Label>

                           <Select
                              {...input}
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForEntities}
                              placeholder="Select Entity"
                              onChange={(event) => { onEntityChange(event); form.mutators.clearAttributes(); form.mutators.setAttribute("storeKind", undefined); input.onChange(event); }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>


                  {values.entity && locationAttributeDescriptors && locationAttributeDescriptors.length > 0 ? (

                     <>
                        <hr />
                        <h6>Location Attributes</h6>
                        <hr />

                        <AttributeEditor
                           id="location"
                           attributeDescriptors={locationAttributeDescriptors}
                           attributes={location?.attributes}
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
