import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { FormApi } from "final-form";
import { Form, Field } from "react-final-form";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Row, Col } from "reactstrap";
import Select from "react-select";

import { validateRequired, composeValidators, validateAlphaNumeric, validateCustomIp, validateInteger, validateCustomUrl } from "utils/validators";

import { actions as acmeProfileActions, selectors as acmeProfileSelectors } from "ducks/acme-profiles";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";
import { actions as connectorActions } from "ducks/connectors";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";
import { AcmeProfileResponseModel } from "types/acme-profiles";
import { RaProfileResponseModel } from "types/ra-profiles";
import { AttributeDescriptorModel } from "types/attributes";



interface FormValues {
   name: string;
   description: string;
   dnsIpAddress: string;
   dnsPort: string;
   retryInterval: string;
   orderValidity: string;
   termsUrl: string;
   webSite: string;
   termsChangeUrl: string;
   disableOrders: boolean;
   requireAgreement: boolean;
   requireContact: boolean;
   raProfile: { value: string; label: string } | undefined;
}

export default function AcmeProfileForm() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const editMode = useMemo( () => !!id, [id] );

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

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [revokeGroupAttributesCallbackAttributes, setRevokeGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

   const [acmeProfile, setAcmeProfile] = useState<AcmeProfileResponseModel>();
   const [raProfile, setRaProfile] = useState<RaProfileResponseModel>();


   const isBusy = useMemo(
      () => isFetchingDetail || isCreating || isUpdating,
      [isFetchingDetail, isCreating, isUpdating]
   );


   useEffect(

      () => {

         if (editMode && (!acmeProfileSelector || acmeProfileSelector.uuid !== id)) {
            dispatch(acmeProfileActions.getAcmeProfile({ uuid: id! }));
         }


         if (editMode && acmeProfileSelector && acmeProfileSelector.uuid === id) {
            setAcmeProfile(acmeProfileSelector);
            setRaProfile(acmeProfileSelector.raProfile);
         }

      },
      [dispatch, id, editMode, acmeProfileSelector]

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
            dispatch(raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile.authorityInstanceUuid, uuid: raProfile.uuid }));
            dispatch(raProfileActions.listRevocationAttributeDescriptors({ authorityUuid: raProfile.authorityInstanceUuid, uuid: raProfile.uuid }));
         }

      },
      [dispatch, raProfile]

   )


   const onSubmit = useCallback(

      (values: FormValues) => {

         if (editMode) {

            dispatch(acmeProfileActions.updateAcmeProfile({
               uuid: id!,
                updateAcmeRequest: {
                    description: values.description,
                    dnsResolverIp: values.dnsIpAddress,
                    dnsResolverPort: values.dnsPort,
                    retryInterval: parseInt(values.retryInterval),
                    validity: parseInt(values.orderValidity),
                    termsOfServiceUrl: values.termsUrl,
                    websiteUrl: values.webSite,
                    termsOfServiceChangeUrl: values.termsChangeUrl,
                    termsOfServiceChangeDisable: values.disableOrders,
                    requireTermsOfService: values.requireAgreement,
                    requireContact: values.requireContact,
                    raProfileUuid: values.raProfile ? values.raProfile.value : "NONE",
                    issueCertificateAttributes: collectFormAttributes("issuanceAttributes", [...(raProfileIssuanceAttrDescs ?? []), ...issueGroupAttributesCallbackAttributes], values),
                    revokeCertificateAttributes: collectFormAttributes("revocationAttributes", [...(raProfileRevocationAttrDescs ?? []), ...revokeGroupAttributesCallbackAttributes], values)
                }
            }));

         } else {

            dispatch(acmeProfileActions.createAcmeProfile({
               name: values.name,
               description: values.description,
               dnsResolverIp: values.dnsIpAddress,
               dnsResolverPort: values.dnsPort,
               retryInterval: parseInt(values.retryInterval),
               validity: parseInt(values.orderValidity),
               termsOfServiceUrl: values.termsUrl,
               websiteUrl: values.webSite,
               requireTermsOfService: values.requireAgreement,
               requireContact: values.requireContact,
               raProfileUuid: values.raProfile ? values.raProfile.value : "NONE",
               issueCertificateAttributes: collectFormAttributes("issuanceAttributes", [...(raProfileIssuanceAttrDescs ?? []), ...issueGroupAttributesCallbackAttributes], values),
               revokeCertificateAttributes: collectFormAttributes("revocationAttributes", [...(raProfileRevocationAttrDescs ?? []), ...revokeGroupAttributesCallbackAttributes], values)
            }));

         }
      },
      [dispatch, editMode, id, raProfileIssuanceAttrDescs, raProfileRevocationAttrDescs, issueGroupAttributesCallbackAttributes, revokeGroupAttributesCallbackAttributes]

   );


   const onCancelClick = useCallback(

      () => {
         navigate(`../../detail/${id}`, { relative: "path" });
      },
      [navigate, id]

   );


   const onRaProfileChange = useCallback(

      (form: FormApi<FormValues>, value: string) => {

          dispatch(connectorActions.clearCallbackData());
          setIssueGroupAttributesCallbackAttributes([]);
          setRevokeGroupAttributesCallbackAttributes([]);

         if (!value) {
            setRaProfile(undefined);
            dispatch(raProfileActions.clearIssuanceAttributesDescriptors());
            dispatch(raProfileActions.clearRevocationAttributesDescriptors());
            form.mutators.clearAttributes();
            return;
         }

         setRaProfile(raProfiles.find(p => p.uuid === value) || undefined);

         dispatch(raProfileActions.listIssuanceAttributeDescriptors({ authorityUuid: raProfile?.authorityInstanceUuid || "", uuid: value }));
         dispatch(raProfileActions.listRevocationAttributeDescriptors({ authorityUuid: raProfile?.authorityInstanceUuid || "", uuid: value }));

         if (acmeProfile) {

            setAcmeProfile({
               ...acmeProfile,
               issueCertificateAttributes: [],
               revokeCertificateAttributes: []
            });

         }

      },
      [dispatch, raProfiles, acmeProfile, raProfile?.authorityInstanceUuid]

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
         retryInterval: editMode ? acmeProfile?.retryInterval?.toString() || "30" : "30",
         orderValidity: editMode ? acmeProfile?.validity?.toString() || "36000" : "36000",
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


   const title = useMemo(

      () => editMode ? "Edit ACME Profile" : "Create ACME Profile",
      [editMode]

   );


   return (

      <Widget title={title} busy={isBusy}>

         <Form initialValues={defaultValues} onSubmit={onSubmit} mutators={{ ...mutators<FormValues>() }} >

            {({ handleSubmit, pristine, submitting, valid, form }) => (

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
                              placeholder="Enter Description / Comment"
                              valid={!meta.error && meta.touched}
                              invalid={!!meta.error && meta.touched}
                           />

                           <FormFeedback>{meta.error}</FormFeedback>

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

                           <Field name="webSite" validate={composeValidators((value: string) => validateCustomUrl(value))}>

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
                                 isClearable={true}
                                 onChange={(event: any) => {
                                    onRaProfileChange(form, event ? event.value : undefined); input.onChange(event)
                                 }}
                              />

                           </FormGroup>


                        )}

                     </Field>

                     {!raProfile || !raProfileIssuanceAttrDescs || raProfileIssuanceAttrDescs.length === 0 ? <></> : (

                        <FormGroup>

                           <Label for="issuanceAttributes">Issuance Attributes</Label>

                           <AttributeEditor
                              id="issuanceAttributes"
                              attributeDescriptors={raProfileIssuanceAttrDescs}
                              attributes={acmeProfile?.issueCertificateAttributes}
                              groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                              setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                           />

                        </FormGroup>

                     )}


                     {!raProfile || !raProfileRevocationAttrDescs || raProfileRevocationAttrDescs.length === 0 ? <></> : (

                        <FormGroup>

                           <Label for="revocationAttributes">Revocation Attributes</Label>

                           <AttributeEditor
                              id="revocationAttributes"
                              attributeDescriptors={raProfileRevocationAttrDescs}
                              attributes={acmeProfile?.revokeCertificateAttributes}
                              groupAttributesCallbackAttributes={revokeGroupAttributesCallbackAttributes}
                              setGroupAttributesCallbackAttributes={setRevokeGroupAttributesCallbackAttributes}
                           />


                        </FormGroup>

                     )}

                  </Widget>


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


      </Widget>

   )

}
