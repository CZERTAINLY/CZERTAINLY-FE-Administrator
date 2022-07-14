import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";

import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import Select from "react-select";

import { mutators } from "utils/attributeEditorMutators";
import { composeValidators, validateAlphaNumeric, validateRequired } from "utils/validators";

import { RaProfileModel } from "models/ra-profiles";

import { actions as raProfilesActions, selectors as raProfilesSelectors } from "ducks/ra-profiles";
import { actions as authoritiesActions, selectors as authoritiesSelectors } from "ducks/authorities";

import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";

import { collectFormAttributes } from "utils/attributes";
import { FormApi } from "final-form";


interface FormValues {
   name: string;
   description: string;
   authority: { value: any; label: string } | undefined;
}

interface Props {
   title: string | JSX.Element;
}

export default function RaProfileForm({
   title
}: Props) {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const editMode = useMemo(
      () => params.id !== undefined,
      [params.id]
   )

   const raProfileSelector = useSelector(raProfilesSelectors.raProfile);

   const authorities = useSelector(authoritiesSelectors.authorities);
   const raProfileAttributeDescriptors = useSelector(authoritiesSelectors.raProfileAttributeDescriptors);

   const isFetchingAuthorityRAProfileAttributes = useSelector(authoritiesSelectors.isFetchingRAProfilesAttributesDescriptors);

   const isFetchingDetail = useSelector(raProfilesSelectors.isFetchingDetail);
   const isCreating = useSelector(raProfilesSelectors.isCreating);
   const isUpdating = useSelector(raProfilesSelectors.isUpdating);

   const [raProfile, setRaProfile] = useState<RaProfileModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating || isFetchingAuthorityRAProfileAttributes,
      [isCreating, isFetchingDetail, isUpdating, isFetchingAuthorityRAProfileAttributes]
   );


   useEffect(

      () => {
         dispatch(authoritiesActions.listAuthorities());
         dispatch(authoritiesActions.clearRAProfilesAttributesDescriptors());
         if (editMode) dispatch(raProfilesActions.getRaProfileDetail({ uuid: params.id }));
      },
      [dispatch, editMode, params.id]

   )


   useEffect(

      () => {

         if (editMode && raProfileSelector && raProfileSelector.uuid !== raProfile?.uuid) {

            setRaProfile(raProfileSelector);
            dispatch(authoritiesActions.getRAProfilesAttributesDescriptors({ authorityUuid: raProfileSelector.authorityInstanceUuid }));

         }
      },
      [authorities, dispatch, editMode, raProfile?.uuid, raProfileSelector]

   )


   const onAuthorityChange = useCallback(

      (authorityUuid: string, form: FormApi<FormValues>) => {

         form.mutators.clearAttributes();
         if (raProfile) setRaProfile({ ...raProfile, attributes: [] });
         dispatch(authoritiesActions.clearRAProfilesAttributesDescriptors());
         dispatch(authoritiesActions.getRAProfilesAttributesDescriptors({ authorityUuid }));

      },
      [dispatch, raProfile]

   );


   const onCancelClick = useCallback(

      () => {
         history.goBack()
      },
      [history,]

   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(
               raProfilesActions.updateRaProfile({
                  profileUuid: params.id,
                  authorityInstanceUuid: values.authority!.value,
                  enabled: raProfile!.enabled,
                  description: values.description,
                  attributes: collectFormAttributes("ra-profile", raProfileAttributeDescriptors, values)
               })
            );

         } else {

            dispatch(
               raProfilesActions.createRaProfile({
                  name: values.name,
                  description: values.description,
                  authorityInstanceUuid: values.authority!.value,
                  attributes: collectFormAttributes("ra-profile", raProfileAttributeDescriptors, values)
               })
            );

         }

      },
      [dispatch, editMode, params.id, raProfile, raProfileAttributeDescriptors]

   );


   const optionsForAuthorities = useMemo(

      () => authorities.map(

         (authority) => ({
            value: authority.uuid,
            label: authority.name
         })
      ),
      [authorities]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? raProfile?.name || "" : "",
         description: editMode ? raProfile?.description || "" : "",
         authority: editMode ? raProfile ? optionsForAuthorities.find(option => option.value === raProfile.authorityInstanceUuid) : undefined : undefined
      }),
      [editMode, optionsForAuthorities, raProfile]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, valid, form }) => (

               <BootstrapForm onSubmit={handleSubmit}>


                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">RA Profile Name</Label>

                           <Input
                              {...input}
                              id="name"
                              type="text"
                              placeholder="Enter RA Profile Name"
                              valid={!meta.touched || !meta.error}
                              invalid={meta.touched && meta.error}
                              disabled={editMode}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="description" validate={composeValidators(validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="description">Description</Label>

                           <Input
                              {...input}
                              id="description"
                              type="textarea"
                              className="form-control"
                              placeholder="Enter Description / Comment"
                              valid={!meta.touched || !meta.error}
                              invalid={meta.touched && meta.error}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

                        </FormGroup>

                     )}

                  </Field>

                  <Field name="authority" validate={validateRequired()}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="authority">Select Authority</Label>

                           <Select
                              {...input}
                              id="authority"
                              maxMenuHeight={140}
                              menuPlacement="auto"
                              options={optionsForAuthorities}
                              placeholder="Select to change RA Profile if needed"
                              onChange={(event: any) => { onAuthorityChange(event.value, form); input.onChange(event) }}
                              styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                           />

                           <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                        </FormGroup>

                     )}

                  </Field>


                  {!raProfileAttributeDescriptors ? <></> : (
                     <AttributeEditor
                        id="ra-profile"
                        authorityUuid={raProfile?.authorityInstanceUuid || form.getFieldState("authority")?.value?.value}
                        attributeDescriptors={raProfileAttributeDescriptors}
                        attributes={raProfile?.attributes}
                     />
                  )}

                  <div className="d-flex justify-content-end">

                     <ButtonGroup>

                        <ProgressButton
                           title={editMode ? "Update" : "Create"}
                           inProgressTitle={editMode ? "Updating..." : "Creating..."}
                           inProgress={submitting}
                           disabled={pristine || submitting || !valid}
                        />

                        <Button color="default" onClick={onCancelClick} disabled={submitting}>
                           Cancel
                        </Button>

                     </ButtonGroup>

                  </div>

               </BootstrapForm>

            )}

         </Form>

      </Widget >

   );

}
