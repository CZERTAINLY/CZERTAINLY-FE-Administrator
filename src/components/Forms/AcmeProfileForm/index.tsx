import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, FormText, Row, Col } from "reactstrap";

import { validateRequired, composeValidators, validateAlphaNumeric, validateCustomIp, validateInteger, validateCustomUrl } from "utils/validators";

import { AcmeProfileModel } from "models/acme-profiles";
import { RaProfileModel } from "models/ra-profiles";

import { actions as acmeProfileActions, selectors as acmeProfileSelectors } from "ducks/acme-profiles";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";

import { collectFormAttributes } from "utils/attributes";
import { mutators } from "utils/attributeEditorMutators";

import Select from "react-select";
import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";

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
   );

   const acmeProfileSelector = useSelector(acmeProfileSelectors.acmeProfile);
   const raProfiles = useSelector(raProfileSelectors.raProfiles);
   const raProfileIssuanceAttrDescs = useSelector(raProfileSelectors.issuanceAttributes);
   const raProfileRevocationAttrDescs = useSelector(raProfileSelectors.revocationAttributes);

   const isFetchingDetail = useSelector(acmeProfileSelectors.isFetchingDetail);
   const isCreating = useSelector(acmeProfileSelectors.isCreating);
   const isUpdating = useSelector(acmeProfileSelectors.isUpdating);

   const isFetchingRaProfilesList = useSelector(raProfileSelectors.isFetchingList);
   const isFetchingIssuanceAttributes = useSelector(raProfileSelectors.isFetchingIssuanceAttributes);
   const isFetchingRevocationAttributes = useSelector(raProfileSelectors.isFetchingRevocationAttributes);

   const [acmeProfile, setAcmeProfile] = useState<AcmeProfileModel>();
   const [raProfile, setRaProfile] = useState<RaProfileModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating,
      [isFetchingDetail, isCreating, isUpdating]
   );


   useEffect(

      () => {

         if (editMode && (!acmeProfileSelector || acmeProfileSelector.uuid !== params.id)) {
            dispatch(acmeProfileActions.getAcmeProfile({ uuid: params.id }));
         }


         if (editMode && acmeProfileSelector?.uuid === params.id) {
            setAcmeProfile(acmeProfileSelector);
         }

      },
      [dispatch, params.id, editMode, acmeProfileSelector]

   );


   useEffect(

      () => {
         dispatch(raProfileActions.listRaProfiles());
      },
      [dispatch]

   );


   useEffect(

      () => {

         if (raProfile) {
            dispatch(raProfileActions.listIssuanceAttributeDescriptors({ uuid: raProfile.uuid }));
            dispatch(raProfileActions.listRevocationAttributeDescriptors({ uuid: raProfile.uuid }));
         }

         if (acmeProfile) {
            setRaProfile(acmeProfile.raProfile);
         }

      },
      [dispatch, raProfile, acmeProfile]

   )


   const onSubmit = useCallback(

      (values: FormValues) => {
      },
      []

   );


   const onRaProfileChange = useCallback(

      (value: string) => {

         dispatch(raProfileActions.listIssuanceAttributeDescriptors({ uuid: value }));
         dispatch(raProfileActions.listRevocationAttributeDescriptors({ uuid: value }));

      },
      [dispatch]

   );


   const optionsForRaProfiles = useMemo(

      () => raProfiles.map(

         raProfile => ({
            value: raProfile.uuid,
            label: raProfile.name
         })

      ),
      [raProfiles]

   );


   const defaultValues: FormValues = useMemo(
      () => ({
         name: editMode ? acmeProfile?.name || "" : "",
         description: editMode ? acmeProfile?.description || "" : "",
         dnsIpAddress: editMode ? acmeProfile?.dnsResolverIp || "" : "",
         dnsPort: editMode ? acmeProfile?.dnsResolverPort || "" : "",
         retryInterval: editMode ? acmeProfile?.retryInterval || -1 : -1,
         orderValidity: editMode ? acmeProfile?.validity || -1 : -1,
         termsUrl: editMode ? acmeProfile?.termsOfServiceUrl || "" : "",
         webSite: editMode ? acmeProfile?.websiteUrl || "" : "",
         termsChangeUrl: editMode ? acmeProfile?.termsOfServiceChangeUrl || "" : "",
         disableOrders: editMode ? acmeProfile?.termsOfServiceChangeDisable || false : false,
         requireAgreement: editMode ? acmeProfile?.requireTermsOfService || false : false,
         requireContact: editMode ? acmeProfile?.requireContact || false : false,
         raProfile: editMode ? acmeProfile?.raProfile ? optionsForRaProfiles.find(raProfile => raProfile.value === acmeProfile.raProfile?.uuid) : undefined : undefined
      }),
      [editMode, acmeProfile, optionsForRaProfiles]
   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >


            {({ handleSubmit, pristine, submitting, values, valid }) => (

               <BootstrapForm onSubmit={handleSubmit}>

                  <Field name="name" validate={composeValidators(validateRequired(), validateAlphaNumeric())}>

                     {({ input, meta }) => (

                        <FormGroup>

                           <Label for="name">ACME Profile Name</Label>

                           <Input
                              {...input}
                              id="name"
                              type="text"
                              placeholder="ACME Profile Name"
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
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
                              placeholder="Description / Comment"
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                           />

                        </FormGroup>

                     )}

                  </Field>


                  <Widget title="Challenge Configuration">

                     <Row xs="1" sm="1" md="2" lg="2" xl="2">

                        <Col>

                           <Field name="dnsIpAddress" validate={composeValidators((value: string) => validateCustomIp(value))}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="dnsIpAddress">DNS Resolver IP address</Label>

                                    <Input
                                       {...input}
                                       id="dnsIpAddress"
                                       type="text"
                                       placeholder="Enter DNS Resolver IP address. If not provided system default will be used"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>

                        <Col>

                           <Field name="dnsPort" validate={composeValidators(validateInteger())}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="dnsPort">DNS Resolver port number</Label>

                                    <Input
                                       {...input}
                                       id="dnsPort"
                                       type="number"
                                       placeholder="Enter DNS Resolver port number"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>

                     </Row>


                     <Row xs="1" sm="1" md="2" lg="2" xl="2">

                        <Col>

                           <Field name="retryInterval" validate={composeValidators(validateInteger())}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="retryInterval">Retry Interval (In seconds)</Label>

                                    <Input
                                       {...input}
                                       id="retryInterval"
                                       type="number"
                                       placeholder="Enter Retry Interval"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>

                        <Col>

                           <Field name="orderValidity" validate={composeValidators(validateInteger())}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="orderValidity">Order Validity (In seconds)</Label>

                                    <Input
                                       {...input}
                                       id="orderValidity"
                                       type="number"
                                       placeholder="Enter Order Validity"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>

                     </Row>

                  </Widget>


                  <Widget title="Terms of Service Configuration">

                     <Row xs="1" sm="1" md="2" lg="2" xl="2">

                        <Col>

                           <Field name="termsUrl" validate={composeValidators((value: string) => validateCustomUrl(value))}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="termsUrl">Terms of Service URL</Label>

                                    <Input
                                       {...input}
                                       id="termsUrl"
                                       type="text"
                                       placeholder="Enter Terms of Service URL"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>

                        <Col>

                           <Field name="webSite">

                              {({ input, meta }) => (


                                 <FormGroup>

                                    <Label for="websiteUrl">Website URL</Label>

                                    <Input
                                       {...input}
                                       id="websiteUrl"
                                       type="text"
                                       placeholder="Enter Website URL"
                                       valid={!meta.error && meta.touched}
                                       invalid={!!meta.error && meta.touched}
                                    />

                                    <FormFeedback>{meta.error}</FormFeedback>

                                 </FormGroup>

                              )}

                           </Field>

                        </Col>
                     </Row>

                     {!editMode ? <></> : (

                        <Row xs="1" sm="1" md="2" lg="2" xl="2">

                           <Col>

                              <Field name="termsChangeUrl" validate={composeValidators((value: string) => validateCustomUrl(value))}>

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <Label for="termsChangeUrl">Changes of Terms of Service URL</Label>

                                       <Input
                                          {...input}
                                          id="termsChangeUrl"
                                          type="text"
                                          name="termsOfServiceChangeUrl"
                                          placeholder="Enter Changes of Terms of Service URL"
                                          valid={!meta.error && meta.touched}
                                          invalid={!!meta.error && meta.touched}
                                       />

                                       <FormFeedback>{meta.error}</FormFeedback>

                                    </FormGroup>

                                 )}

                              </Field>

                           </Col>

                           <Col className="align-items-center">

                              <Field name="disableOrders" type="checkbox">

                                 {({ input, meta }) => (

                                    <FormGroup>

                                       <br />
                                       <br />

                                       <Input
                                          {...input}
                                          id="disableOrders"
                                          type="checkbox"
                                       />

                                       <Label for="disableOrders">
                                          &nbsp;Disable new Orders (Changes in Terms of Service)
                                       </Label>

                                    </FormGroup>

                                 )}

                              </Field>

                           </Col>

                        </Row>

                     )}

                     <Field name="requireAgreement" type="checkbox">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Input
                                 {...input}
                                 id="requireAgreement"
                                 type="checkbox"
                              />

                              <Label for="requireAgreement">
                                 &nbsp;Require agree on Terms Of Service for new account
                              </Label>

                           </FormGroup>

                        )}

                     </Field>

                     <Field name="requireContact" type="checkbox">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Input
                                 {...input}
                                 id="requireContact"
                                 type="checkbox"
                              />

                              <Label for="requireContact">
                                 &nbsp;Require contact information for new Accounts
                              </Label>

                           </FormGroup>

                        )}

                     </Field>

                  </Widget>


                  <Widget title="RA Profile Configuration" busy={isFetchingRaProfilesList || isFetchingIssuanceAttributes || isFetchingRevocationAttributes}>

                     <Field name="raProfile">

                        {({ input, meta }) => (

                           <FormGroup>

                              <Label for="raProfile">Default RA Profile</Label>

                              <Select
                                 {...input}
                                 id="raProfile"
                                 maxMenuHeight={140}
                                 menuPlacement="auto"
                                 options={optionsForRaProfiles}
                                 placeholder="Select to change RA Profile if needed"
                                 onChange={(event: any) => { onRaProfileChange(event.value); input.onChange(event) }}
                              />

                           </FormGroup>


                        )}

                     </Field>

                     {!raProfileIssuanceAttrDescs || !raProfileIssuanceAttrDescs || raProfileIssuanceAttrDescs.length === 0 ? <></> : (

                        <FormGroup>

                           <Label for="issuanceAttributes">Issuance Attributes</Label>

                           <AttributeEditor
                              id="issuanceAttributes"
                              attributeDescriptors={raProfileIssuanceAttrDescs}
                              attributes={acmeProfile?.issueCertificateAttributes}
                           />

                        </FormGroup>

                     )}


                     {!raProfileIssuanceAttrDescs || !raProfileRevocationAttrDescs || raProfileRevocationAttrDescs.length === 0 ? <></> : (

                        <FormGroup>

                           <Label for="revocationAttributes">Revocation Attributes</Label>

                           <AttributeEditor
                              id="revocationAttributes"
                              attributeDescriptors={raProfileRevocationAttrDescs}
                              attributes={acmeProfile?.issueCertificateAttributes}
                           />


                        </FormGroup>

                     )}

                  </Widget>


               </BootstrapForm>

            )}

         </Form>


      </Widget>

   )

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
import Select from "react-select";
import { useInputValue } from "utils/hooks";
import { actions as callbackActions } from "ducks/connectors";
import {
  actions as raActions,
  selectors as raSelectors,
} from "ducks/ra-profiles";
import DynamicForm from "components/DynamicForm";
import { attributeCombiner } from "utils/commons";
import { AttributeResponse } from "models/attributes";
import {
  AcmeProfileDTO,
  AcmeProfileListItemDTO,
} from "api/acme-profile";
import Widget from "components/Widget";
import {
  validateCustomIp,
  validateCustomPort,
  validateCustomUrl,
} from "utils/validators";

interface Props {
  editMode?: boolean;
  acmeProfile?: (AcmeProfileListItemDTO & AcmeProfileDTO) | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeDisable: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    requireContact: boolean,
    requireTermsOfService: boolean,
    termsOfServiceChangeUrl: string
  ) => void;
}

function AcmeProfileForm({
  editMode,
  isSubmitting = false,
  onCancel,
  onSubmit,
  acmeProfile,
}: Props) {
  const dispatch = useDispatch();

  const raProfiles = useSelector(raSelectors.selectProfiles);

  const selectIssueAttributes = useSelector(
    raSelectors.selectIssuanceAttributes
  );
  const selectRevokeAttributes = useSelector(
    raSelectors.selectRevocationAttributes
  );

  // const callbackResponse = useSelector(callbackSelectors.callbackResponse);

  const [name, setName] = useState(acmeProfile?.name || "");
  const [description, setDescription] = useState(
    acmeProfile?.description || ""
  );
  const [raProfileUuid, setRaProfileUuid] = useState("");
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState("");
  const [dnsResolverIp, setDnsResolverIp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [dnsResolverPort, setDnsResolverPort] = useState("");
  const [retryInterval, setRetryInterval] = useState("30");
  const [validity, setValidity] = useState("36000");
  const [requireContact, setInsistContact] = useState(false);
  const [requireTermsOfService, setInsistTermsOfServiceUrl] = useState(false);
  const [termsOfServiceChangeDisable, setTermsOfServiceChangeDisable] =
    useState(false);

  const [issueEditableAttributes, setIssueEditableAttributes]: any = useState(
    []
  );
  const [issueAttributes, setIssueAttributes] = useState(selectIssueAttributes);
  const [passIssueAttributes, setIssuePassAttributes] = useState<any>(
    selectIssueAttributes
  );
  const [passIssueEditAttributes, setIssuePassEditAttributes] = useState(
    selectIssueAttributes
  );

  const [revokeEditableAttributes, setRevokeEditableAttributes]: any = useState(
    []
  );
  const [revokeAttributes, setRevokeAttributes] = useState(
    selectRevokeAttributes
  );
  const [passRevokeAttributes, setRevokePassAttributes] = useState<any>(
    selectRevokeAttributes
  );
  const [passRevokeEditAttributes, setRevokePassEditAttributes] = useState(
    selectRevokeAttributes
  );
  const [raProfileOptions, setRaProfileOptions] = useState<any>();
  const [termsOfServiceChangeUrl, setChangeTermsOfServiceUrl] = useState<any>();

  const onName = useInputValue(setName);
  const onDescription = useInputValue(setDescription);
  const onWebsiteUrl = useInputValue(setWebsiteUrl);
  const onTermsAndService = useInputValue(setTermsOfServiceUrl);
  const onDnsResolver = useInputValue(setDnsResolverIp);
  const onDnsResolverPort = useInputValue(setDnsResolverPort);
  const onRetryInterval = useInputValue(setRetryInterval);
  const onValidity = useInputValue(setValidity);
  const onChangeTermsOfServiceUrl = useInputValue(setChangeTermsOfServiceUrl);

  const onRaProfile = useCallback(
    (id: string) => {
      if (id !== "NONE") {
        dispatch(raActions.requestIssuanceAttributes(id.toString()));
        dispatch(raActions.requestRevokeAttributes(id.toString()));
        setRaProfileUuid(id.toString());
      } else {
        setIssueAttributes([]);
        setRevokeAttributes([]);
        setRaProfileUuid("NONE");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(raActions.requestRaProfilesList());
  }, [dispatch]);

  useEffect(() => {
    setIssuePassAttributes(selectIssueAttributes);
    setIssueAttributes(selectIssueAttributes);
    setIssuePassEditAttributes(selectIssueAttributes);
  }, [selectIssueAttributes]);

  useEffect(() => {
    setRevokePassAttributes(selectRevokeAttributes);
    setRevokeAttributes(selectRevokeAttributes);
    setRevokePassEditAttributes(selectRevokeAttributes);
  }, [selectRevokeAttributes]);

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let changedIssueAttributes: AttributeResponse[] = [];
      let changedRevokeAttributes: AttributeResponse[] = [];
      if (!editMode) {
        changedIssueAttributes = issueAttributes;
      } else {
        for (let i of issueAttributes) {
          if (
            JSON.stringify(issueEditableAttributes).indexOf(JSON.stringify(i)) <
              0 ||
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
          changedIssueAttributes.push(i);
        }
      }

      if (!editMode) {
        changedRevokeAttributes = revokeAttributes;
      } else {
        for (let i of revokeAttributes) {
          if (JSON.stringify(revokeEditableAttributes).indexOf(JSON.stringify(i) ) < 0 || !!i.value)
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
          changedRevokeAttributes.push(i);
        }
      }
      onSubmit(
        name,
        description,
        termsOfServiceUrl,
        dnsResolverIp,
        dnsResolverPort,
        raProfileUuid,
        websiteUrl,
        Number(retryInterval),
        termsOfServiceChangeDisable,
        Number(validity),
        changedIssueAttributes,
        changedRevokeAttributes,
        requireContact,
        requireTermsOfService,
        termsOfServiceChangeUrl
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      description,
      termsOfServiceUrl,
      dnsResolverIp,
      dnsResolverPort,
      raProfileUuid,
      retryInterval,
      termsOfServiceChangeDisable,
      validity,
      issueAttributes,
      revokeAttributes,
      websiteUrl,
      requireContact,
      requireTermsOfService,
      termsOfServiceChangeUrl,
    ]
  );

  useEffect(() => {
    if (editMode) {
      setName(acmeProfile?.name || "");
      setDescription(acmeProfile?.description || "");
      setRaProfileUuid(acmeProfile?.raProfileUuid || "");
      setTermsOfServiceUrl(acmeProfile?.termsOfServiceUrl || "");
      setDnsResolverIp(acmeProfile?.dnsResolverIp || "");
      setDnsResolverPort(acmeProfile?.dnsResolverPort || "");
      setRetryInterval(acmeProfile?.retryInterval?.toString() || "");
      setValidity(acmeProfile?.validity?.toString() || "");
      setTermsOfServiceChangeDisable(
        acmeProfile?.termsOfServiceChangeDisable || false
      );
      setInsistContact(acmeProfile?.requireContact || false);
      setInsistTermsOfServiceUrl(acmeProfile?.requireTermsOfService || false);
      setWebsiteUrl(acmeProfile?.websiteUrl || "");
      setChangeTermsOfServiceUrl(acmeProfile?.termsOfServiceChangeUrl || "");

      var raProf: any = [];
      if (acmeProfile?.raProfile?.name) {
        raProf.push({
          label: acmeProfile?.raProfile?.name,
          value: acmeProfile?.raProfile?.uuid,
        });
      }
      raProf.push({ label: "NONE", value: "NONE" });
      for (let i of raProfiles) {
        if (i.uuid !== acmeProfile?.raProfile?.uuid) {
          raProf.push({ label: i.name, value: i.uuid });
        }
      }
      setRaProfileOptions(raProf);
      setRaProfileUuid(acmeProfile?.raProfile?.uuid || "NONE");
    }
  }, [acmeProfile, raProfiles, editMode]);

  useEffect(() => {
    const raLength = acmeProfile?.issueCertificateAttributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        acmeProfile?.issueCertificateAttributes || [],
        selectIssueAttributes
      );
      setIssueEditableAttributes(edtAttributes);
      setIssuePassEditAttributes(edtAttributes);
    }
  }, [selectIssueAttributes, acmeProfile, editMode]);

  function updateAttributes(formAttributes: AttributeResponse) {
    let updated =
      issueAttributes.length !== 0 ? issueAttributes : selectIssueAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setIssueAttributes(updateAttributes);
  }

  function updateAttributesEdit(formAttributes: AttributeResponse) {
    let updated =
      issueAttributes.length !== 0 ? issueAttributes : issueEditableAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setIssueAttributes(updateAttributes);
  }

  useEffect(() => {
    const raLength = acmeProfile?.revokeCertificateAttributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        acmeProfile?.revokeCertificateAttributes || [],
        selectRevokeAttributes
      );
      setRevokeEditableAttributes(edtAttributes);
      setRevokePassEditAttributes(edtAttributes);
    }
  }, [selectRevokeAttributes, acmeProfile, editMode]);

  function updateRevokeAttributes(formAttributes: AttributeResponse) {
    let updated =
      revokeAttributes.length !== 0 ? revokeAttributes : selectRevokeAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setRevokeAttributes(updateAttributes);
  }

  function updateRevokeAttributesEdit(formAttributes: AttributeResponse) {
    let updated =
      revokeAttributes.length !== 0
        ? issueAttributes
        : revokeEditableAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setRevokeAttributes(updateAttributes);
  }

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <Form onSubmit={onFormSubmit}>
      <Row form>
        <Col>
          <FormGroup>
            <Label for="name">ACME Profile Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="RA Profile Name"
              value={name}
              onChange={onName}
              disabled={editMode}
              invalid={name.length === 0}
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

          <Widget title="Challenge Configuration">
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="dnsResolverIp">DNS Resolver IP address</Label>
                  <Input
                    type="text"
                    name="dnsResolverIp"
                    placeholder="DNS Resolver IP address. If not provided system default will be used"
                    value={dnsResolverIp}
                    onChange={onDnsResolver}
                    valid={validateCustomIp(dnsResolverIp)}
                    invalid={
                      dnsResolverIp ? !validateCustomIp(dnsResolverIp) : false
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="dnsResolverPort">DNS Resolver port number</Label>
                  <Input
                    type="number"
                    name="dnsResolverPort"
                    placeholder="DNS Resolver port number"
                    value={dnsResolverPort}
                    onChange={onDnsResolverPort}
                    valid={validateCustomPort(dnsResolverPort)}
                    invalid={
                      dnsResolverPort
                        ? !validateCustomPort(dnsResolverPort)
                        : false
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="retryInterval">Retry Interval (In seconds)</Label>
                  <Input
                    type="number"
                    name="retryInterval"
                    placeholder="Retry Interval"
                    value={retryInterval}
                    onChange={onRetryInterval}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="validity">Order Validity (In seconds)</Label>
                  <Input
                    type="number"
                    name="validity"
                    placeholder="Order Validity"
                    value={validity}
                    onChange={onValidity}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Widget>

          <Widget title="Terms of Service Configuration">
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="termsOfServiceUrl">Terms of Service URL</Label>
                  <Input
                    type="text"
                    name="termsOfServiceUrl"
                    placeholder="Terms of Service URL"
                    value={termsOfServiceUrl}
                    onChange={onTermsAndService}
                    valid={validateCustomUrl(termsOfServiceUrl)}
                    invalid={
                      termsOfServiceUrl
                        ? !validateCustomUrl(termsOfServiceUrl)
                        : false
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="websiteUrl">Website URL</Label>
                  <Input
                    type="text"
                    name="websiteUrl"
                    placeholder="Website URL"
                    value={websiteUrl}
                    onChange={onWebsiteUrl}
                    valid={validateCustomUrl(websiteUrl)}
                    invalid={
                      websiteUrl ? !validateCustomUrl(websiteUrl) : false
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            {editMode ? (
              <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
                  <FormGroup>
                    <Label for="termsOfServiceChangeUrl">
                      Changes of Terms of Service URL
                    </Label>
                    <Input
                      type="text"
                      name="termsOfServiceChangeUrl"
                      placeholder="Changes of Terms of Service URL"
                      value={termsOfServiceChangeUrl}
                      onChange={onChangeTermsOfServiceUrl}
                      valid={validateCustomUrl(termsOfServiceChangeUrl)}
                      invalid={
                        termsOfServiceChangeUrl
                          ? !validateCustomUrl(termsOfServiceChangeUrl)
                          : false
                      }
                    />
                  </FormGroup>
                </Col>
                <Col className="align-items-center">
                  <FormGroup>
                    <input
                      type="checkbox"
                      name="termsOfServiceChangeDisable"
                      defaultChecked={acmeProfile?.termsOfServiceChangeDisable}
                      onChange={(event) =>
                        setTermsOfServiceChangeDisable(event.target.checked)
                      }
                    />
                    <Label for="termsOfServiceChangeDisable">
                      &nbsp;Disable new Orders (Changes in Terms of Service)
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
            <FormGroup>
              <input
                type="checkbox"
                name="requireTermsOfService"
                defaultChecked={acmeProfile?.requireTermsOfService}
                onChange={(event) =>
                  setInsistTermsOfServiceUrl(event.target.checked)
                }
              />
              <Label for="requireTermsOfService">
                &nbsp;Require agree on Terms Of Service for new account
              </Label>
            </FormGroup>

            <FormGroup>
              <input
                type="checkbox"
                name="requireContact"
                defaultChecked={acmeProfile?.requireContact}
                onChange={(event) => setInsistContact(event.target.checked)}
              />
              <Label for="requireContact">
                &nbsp;Require contact information for new Accounts
              </Label>
            </FormGroup>
          </Widget>

          <Widget title="RA Profile Configuration">
            <FormGroup>
              <Label for="raProfile">Default RA Profile</Label>
              {!editMode ? (
                <Select
                  maxMenuHeight={140}
                  menuPlacement="auto"
                  options={raProfiles
                    ?.map(function (provider) {
                      return {
                        label: provider.name,
                        value: provider.uuid,
                      };
                    })
                    .concat({ label: "NONE", value: "NONE" })}
                  placeholder="Select RA Profile. If not selected, ACME Profile will be created without RA Profile"
                  onChange={(event) => onRaProfile(event?.value || "")}
                />
              ) : (
                <Select
                  maxMenuHeight={140}
                  menuPlacement="auto"
                  options={raProfileOptions}
                  placeholder="Select to change RA Profile if needed"
                  onChange={(event: any) => onRaProfile(event?.value || "")}
                />
              )}
            </FormGroup>

            {!editMode ? (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passIssueAttributes))
                    : []
                }
                attributeFunction={updateAttributes}
                actions={callbackActions}
                setPassAttribute={setIssuePassAttributes}
              />
            ) : (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passIssueEditAttributes))
                    : []
                }
                attributeFunction={updateAttributesEdit}
                editMode={true}
                actions={callbackActions}
                setPassAttribute={setIssuePassEditAttributes}
              />
            )}

            {!editMode ? (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passRevokeAttributes))
                    : []
                }
                attributeFunction={updateRevokeAttributes}
                actions={callbackActions}
                setPassAttribute={setRevokePassAttributes}
              />
            ) : (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passRevokeEditAttributes))
                    : []
                }
                attributeFunction={updateRevokeAttributesEdit}
                editMode={true}
                actions={callbackActions}
                setPassAttribute={setRevokePassEditAttributes}
              />
            )}
          </Widget>
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
            disabled={isSubmitting || name === ""}
          />
        </ButtonGroup>
      </div>
    </Form>
  );
}

export default AcmeProfileForm;
*/