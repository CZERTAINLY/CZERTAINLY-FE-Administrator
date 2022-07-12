import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form, Field } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { Button, ButtonGroup, Form as BootstrapForm, FormFeedback, FormGroup, Input, Label, Row, Col } from "reactstrap";
import Select from "react-select";

import { validateRequired, composeValidators, validateAlphaNumeric, validateCustomIp, validateInteger, validateCustomUrl } from "utils/validators";

import { AcmeProfileModel } from "models/acme-profiles";
import { RaProfileModel } from "models/ra-profiles";

import { actions as acmeProfileActions, selectors as acmeProfileSelectors } from "ducks/acme-profiles";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";

import { mutators } from "utils/attributeEditorMutators";

import Widget from "components/Widget";
import AttributeEditor from "components/Attributes/AttributeEditor";
import ProgressButton from "components/ProgressButton";

import { collectFormAttributes } from "utils/attributes";



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

         if (editMode) {

            dispatch(acmeProfileActions.updateAcmeProfile({
               uuid: params.id,
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
               raProfileUuid: values.raProfile ? values.raProfile.value : undefined,
               issueCertificateAttributes: collectFormAttributes("issuanceAttributes", raProfileIssuanceAttrDescs, values),
               revokeCertificateAttributes: collectFormAttributes("revocationAttributes", raProfileRevocationAttrDescs, values)
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
               termsOfServiceChangeUrl: values.termsChangeUrl,
               termsOfServiceChangeDisable: values.disableOrders,
               requireTermsOfService: values.requireAgreement,
               requireContact: values.requireContact,
               raProfileUuid: values.raProfile ? values.raProfile.value : undefined,
               issueCertificateAttributes: collectFormAttributes("issuanceAttributes", raProfileIssuanceAttrDescs, values),
               revokeCertificateAttributes: collectFormAttributes("revocationAttributes", raProfileRevocationAttrDescs, values)
            }));

         }
      },
      [dispatch, editMode, params.id, raProfileIssuanceAttrDescs, raProfileRevocationAttrDescs]

   );


   const onCancelClick = useCallback(

      () => {
         history.push(`../detail/${params.id}`);
      },
      [history, params.id]

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
         retryInterval: editMode ? acmeProfile?.retryInterval?.toString() || "-1" : "-1",
         orderValidity: editMode ? acmeProfile?.validity?.toString() || "-1" : "-1",
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

            {({ handleSubmit, pristine, submitting, valid }) => (

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
