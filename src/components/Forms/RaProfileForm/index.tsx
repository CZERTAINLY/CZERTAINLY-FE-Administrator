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

      (authorityUuid: string, form: FormApi) => {

         form.mutators.clearAttributes();
         if (raProfile) setRaProfile({ ...raProfile, attributes: [] });
         dispatch(authoritiesActions.clearRAProfilesAttributesDescriptors());
         dispatch(authoritiesActions.getRAProfilesAttributesDescriptors({ authorityUuid }));

      },
      [dispatch, raProfile]

   );


   const onCancelClick = useCallback(

      () => {
         history.push(`../detail/${params.id}`);
      },
      [history, params.id]

   );


   const onSubmit = useCallback(

      (values: FormValues) => {

         const attributeValues = collectFormAttributes(
            "ra-profile",
            raProfileAttributeDescriptors,
            values
         );

         return attributeValues;

      },
      [raProfileAttributeDescriptors]

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

                  <Field name="authority">

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
                           />

                        </FormGroup>

                     )}

                  </Field>


                  {!raProfileAttributeDescriptors ? <></> : (
                     <AttributeEditor
                        id="ra-profile"
                        authorityUuid={raProfile?.authorityInstanceUuid}
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

/*
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import { actions, selectors } from "ducks/ra-profiles";
import { RaProfile, RaProfileDetail } from "models";
import { useInputValue } from "utils/hooks";
import {
  actions as callbackActions,
  selectors as callbackSelectors,
} from "ducks/connectors";
import {
  actions as authorityActions,
  selectors as authoritySelectors,
} from "ducks/ca-authorities";
import DynamicForm from "components/DynamicForm";
import { attributeCombiner } from "utils/commons";
import { AttributeResponse } from "models/attributes";

interface Props {
  editMode?: boolean;
  raProfile?: (RaProfile & RaProfileDetail) | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (
    authorityInstanceUuid: string,
    name: string,
    description: string,
    attributes: AttributeResponse[]
  ) => void;
}

function RAProfileForm({
  editMode,
  isSubmitting = false,
  onCancel,
  onSubmit,
  raProfile,
}: Props) {
  const dispatch = useDispatch();

  const authorities = useSelector(authoritySelectors.selectAuthorities);
  const profileAttributes = useSelector(selectors.selectAttributes);
  const callbackResponse = useSelector(callbackSelectors.callbackResponse);

  const [name, setname] = useState(raProfile?.name || "");
  const [description, setDescription] = useState(raProfile?.description || "");
  const [authorityUuid, setAuthorityId] = useState("0");
  const [connectorUuid, setConnectorUuid] = useState("");
  const [caAuthorityName, setCaAuthorityName] = useState("");
  const [editableAttributes, setEditableAttributes]: any = useState([]);
  const [attributes, setAttributes] = useState(profileAttributes);
  const [passAttributes, setPassAttributes] = useState<any>(profileAttributes);
  const [passEditAttributes, setPassEditAttributes] =
    useState(profileAttributes);

  const onname = useInputValue(setname);
  const onDescription = useInputValue(setDescription);

  const onAuthority = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = event.target.value.split(",")[0];
      const connectorUuid = event.target.value.split(",")[1];
      setAuthorityId(id.toString());
      setConnectorUuid(connectorUuid);
      dispatch(actions.requestAttribute(id.toString()));
    },
    [dispatch]
  );

  useEffect(() => {
    setPassAttributes(profileAttributes);
    setAttributes(profileAttributes);
    setPassEditAttributes(profileAttributes);
  }, [profileAttributes]);

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let changedAttributes: AttributeResponse[] = [];
      if (!editMode) {
        changedAttributes = attributes;
      } else {
        for (let i of attributes) {
          if (
            JSON.stringify(editableAttributes).indexOf(JSON.stringify(i)) < 0 ||
            !!i.value
          )
            if (
              typeof i.value === "object" &&
              typeof i.value.id == "undefined"
            ) {
              try {
                i.value = i.value[0];
              } catch {
                console.warn("Non List Items");
              }
            }
          changedAttributes.push(i);
        }
      }
      onSubmit(authorityUuid, name, description, changedAttributes);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authorityUuid, onSubmit, name, description, attributes]
  );

  useEffect(() => {
    dispatch(authorityActions.requestAuthoritiesList());
    if (editMode) {
      if (
        typeof raProfile?.authorityInstanceUuid == "string" ||
        typeof raProfile?.authorityInstanceUuid == "number"
      ) {
        setAuthorityId(raProfile?.authorityInstanceUuid);
        dispatch(actions.requestAttribute(raProfile?.authorityInstanceUuid));
      }
    }
  }, [dispatch, raProfile, editMode]);

  useEffect(() => {
    if (authorities.length > 0) {
      for (let i of authorities) {
        if (
          i?.uuid?.toString() === raProfile?.authorityInstanceUuid?.toString()
        ) {
          setCaAuthorityName(i.name);
        }
      }
    }
  }, [authorities, raProfile]);

  useEffect(() => {
    setname(raProfile?.name || "");
    setDescription(raProfile?.description || "");
  }, [raProfile]);

  useEffect(() => {
    if (editMode && authorities.length > 0) {
      for (let i of authorities) {
        if (i.uuid === raProfile?.authorityInstanceUuid) {
          setConnectorUuid(i.connectorUuid);
        }
      }
    }
  }, [editMode, authorities, raProfile]);

  useEffect(() => {
    const raLength = raProfile?.attributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        raProfile?.attributes || [],
        profileAttributes
      );
      setEditableAttributes(edtAttributes);
      setPassEditAttributes(edtAttributes);
    }
  }, [profileAttributes, raProfile, editMode]);

  function updateAttributes(formAttributes: AttributeResponse) {
    let updated = attributes.length !== 0 ? attributes : profileAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setAttributes(updateAttributes);
  }

  function updateAttributesEdit(formAttributes: AttributeResponse) {
    let updated = attributes.length !== 0 ? attributes : editableAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setAttributes(updateAttributes);
  }

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <Form onSubmit={onFormSubmit}>
      <Row form>
        <Col>
          <FormGroup>
            <Label for="name">RA Profile Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="RA Profile Name"
              value={name}
              onChange={onname}
              disabled={editMode}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Description / Comment"
              value={description}
              onChange={onDescription}
            />
          </FormGroup>
          {!editMode ? (
            <FormGroup>
              <Label for="authority">Select Authority</Label>
              <Input
                type="select"
                name="authority"
                required
                onChange={onAuthority}
              >
                <option key="select" value="select">
                  Select
                </option>
                {Object.values(authorities).map((value) => (
                  <option
                    key={value.name}
                    value={[value.uuid, value.connectorUuid]}
                  >
                    {value.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label for="authority">Select Authority</Label>
              <Input
                type="text"
                name="authority"
                required
                disabled
                value={caAuthorityName}
              />
            </FormGroup>
          )}
          {!editMode ? (
            <DynamicForm
              fieldInfo={
                authorityUuid !== "0"
                  ? JSON.parse(JSON.stringify(passAttributes))
                  : []
              }
              attributeFunction={updateAttributes}
              actions={callbackActions}
              connectorUuid={connectorUuid}
              callbackSelector={callbackResponse}
              setPassAttribute={setPassAttributes}
              authorityUuid={authorityUuid}
            />
          ) : (
            <DynamicForm
              fieldInfo={
                authorityUuid !== "0"
                  ? JSON.parse(JSON.stringify(passEditAttributes))
                  : []
              }
              attributeFunction={updateAttributesEdit}
              editMode={true}
              actions={callbackActions}
              connectorUuid={connectorUuid}
              callbackSelector={callbackResponse}
              setPassAttribute={setPassEditAttributes}
              authorityUuid={authorityUuid}
            />
          )}
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <ButtonGroup>
          <Button color="default" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <ProgressButton
            title={submitTitle}
            inProgressTitle={inProgressTitle}
            inProgress={isSubmitting}
          />
        </ButtonGroup>
      </div>
    </Form>
  );
}

export default RAProfileForm;
*/