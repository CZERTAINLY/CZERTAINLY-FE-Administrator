import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Form as BootstrapForm, Button, Label, ButtonGroup, Container, FormGroup } from 'reactstrap';
import { Field, Form } from "react-final-form";

import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";

import { mutators } from "utils/attributeEditorMutators";

import { actions, selectors } from "ducks/locations";
import { actions as raActions, selectors as raSelectors } from "ducks/ra-profiles";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";
import StatusBadge from "components/StatusBadge";
import AttributeEditor from "components/Attributes/AttributeEditor";
import CertificateList from "pages/certificates/list";
import { collectFormAttributes } from "utils/attributes";
import ProgressButton from "components/ProgressButton";
import Spinner from "components/Spinner";
import Select from "react-select";

import { validateRequired } from "utils/validators";

export default function EntityDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();
   const history = useHistory();

   const location = useSelector(selectors.location);
   const pushAttributeDescriptors = useSelector(selectors.pushAttributeDescriptors);
   const csrAttributeDescriptors = useSelector(selectors.csrAttributeDescriptors);
   const raProfiles = useSelector(raSelectors.raProfiles);
   const issuanceAttributeDescriptors = useSelector(raSelectors.issuanceAttributes);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);
   const isFetchingPushAttributeDescriptors = useSelector(selectors.isFetchingPushAttributeDescriptors);
   const isFetchingCSRAttributeDescriptors = useSelector(selectors.isFetchingCSRAttributeDescriptors);
   const isPushingCertificate = useSelector(selectors.isPushingCertificate);
   const isIssuingCertificate = useSelector(selectors.isIssuingCertificate);
   const isRemovingCertificate = useSelector(selectors.isRemovingCertificate);
   const isRenewingCertificate = useSelector(selectors.isAutoRenewingCertificate);

   const isFetchingRaProfiles = useSelector(raSelectors.isFetchingList);
   const isFetchingIssuanceAttributes = useSelector(raSelectors.isFetchingIssuanceAttributes);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<boolean>(false);
   const [issueDialog, setIssueDialog] = useState<boolean>(false);
   const [pushDialog, setPushDialog] = useState<boolean>(false);

   const [certCheckedRows, setCertCheckedRows] = useState<string[]>([]);

   const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

   const isBusy = useMemo(
      () => isFetching || isDeleting || isPushingCertificate || isRemovingCertificate || isFetchingPushAttributeDescriptors || isFetchingCSRAttributeDescriptors,
      [isFetching, isDeleting, isPushingCertificate, isRemovingCertificate, isFetchingPushAttributeDescriptors, isFetchingCSRAttributeDescriptors]
   );


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getLocationDetail({ uuid: params.id }));
         dispatch(actions.getPushAttributes({ uuid: params.id }));
         dispatch(actions.getCSRAttributes({ uuid: params.id }));

      },
      [dispatch, params.id]

   )


   useEffect(

      () => {

         if (!isPushingCertificate) setPushDialog(false);

      },
      [isPushingCertificate]


   )


   useEffect(

      () => {

         if (!issueDialog) return;

         dispatch(raActions.resetState());
         dispatch(raActions.listRaProfiles());

      },
      [dispatch, issueDialog]

   );


   const onEditClick = useCallback(

      () => {

         if (!location) return;
         history.push(`../../locations/edit/${location.uuid}`);

      },
      [location, history]

   );


   const onEnableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.enableLocation({ uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onDisableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.disableLocation({ uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onRemoveConfirmed = useCallback(

      () => {

         if (!location || certCheckedRows.length === 0) return;

         certCheckedRows.forEach(
            certUuid => {
               dispatch(actions.removeCertificate({ locationUuid: location.uuid, certificateUuid: certUuid }));
            }
         );

         setConfirmRemoveDialog(false);

      },
      [dispatch, location, certCheckedRows]

   );


   const onRenewClick = useCallback(

      () => {

         if (!location) return;

         for (const certUuid of certCheckedRows) {
            dispatch(actions.autoRenewCertificate({ locationUuid: location.uuid, certificateUuid: certUuid }));
         }

      },
      [certCheckedRows, dispatch, location]

   )


   const onPushSubmit = useCallback(

      (values: any) => {

         if (selectedCerts.length === 0 || !location) return;

         const attrs = collectFormAttributes("pushAttributes", pushAttributeDescriptors, values);

         selectedCerts.forEach(
            certUuid => {
               dispatch(actions.pushCertificate({ locationUuid: location.uuid, certificateUuid: certUuid, pushAttributes: attrs }));
            }
         )

      },
      [dispatch, location, pushAttributeDescriptors, selectedCerts]

   )


   const onIssueSubmit = useCallback(

      (values: any) => {

         debugger;
         if (!location) return;

         const issueAttrs = collectFormAttributes("issueAttributes", issuanceAttributeDescriptors, values);
         const csrAttrs = collectFormAttributes("csrAttributes", csrAttributeDescriptors, values);

         dispatch(actions.issueCertificate({
            locationUuid: location.uuid,
            raProfileUuid: values.raProfile.value,
            csrAttributes: csrAttrs,
            issueAttributes: issueAttrs
         }));
         setIssueDialog(false);

      },
      [csrAttributeDescriptors, dispatch, issuanceAttributeDescriptors, location]

   )


   const onDeleteConfirmed = useCallback(

      () => {

         if (!location) return;

         dispatch(actions.deleteLocation({ uuid: location.uuid, redirect: "../" }));
         setConfirmDelete(false);

      },
      [location, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: false, tooltip: "Disable", onClick: () => { onDisableClick() } },
      ],
      [onDisableClick, onEditClick, onEnableClick]

   );


   const locationTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Location <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const certButtons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "trash", disabled: certCheckedRows.length === 0, tooltip: "Remove", onClick: () => { setConfirmRemoveDialog(true); } },
         { icon: "push", disabled: false, tooltip: "Push", onClick: () => { setPushDialog(true) } },
         { icon: "cubes", disabled: false, tooltip: "Issue", onClick: () => { setIssueDialog(true) } },
         { icon: "retweet", disabled: certCheckedRows.length === 0, tooltip: "Renew", onClick: () => { onRenewClick() } }
      ],
      [onRenewClick, certCheckedRows]

   );


   const certsTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={certButtons} />
            </div>

            <h5>
               Location <span className="fw-semi-bold">Certificates</span>
            </h5>

         </div>

      ),
      [certButtons]

   );


   const detailHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "Property",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => !location ? [] : [

         {
            id: "uuid",
            columns: ["UUID", location.uuid],

         },
         {
            id: "name",
            columns: ["Name", location.name],
         },
         {
            id: "description",
            columns: ["Description", location.description || ""],
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={location.enabled} />],
         },
         {
            id: "entityUuid",
            columns: ["Entity UUID", location.entityInstanceUuid],
         },
         {
            id: "entityName",
            columns: ["Entity Name", location.entityInstanceName],
         }

      ],
      [location]

   );


   const certHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "cn",
            content: "Common Name",
            sortable: true,
         },
         {
            id: "pk",
            content: "Private Key",
            sortable: true,
         },
         {
            id: "meta",
            content: "Meta",
         },
         {
            id: "csr",
            content: "CSR attributes",
         }
      ],
      []

   );


   const certData: TableDataRow[] = useMemo(

      () => !location ? [] : location.certificates.map(
         cert => ({
            id: cert.certificateUuid,
            columns: [
               cert.commonName,
               cert.withKey ? "Yes" : "No",
               !cert.metadata ? "" : Object.keys(cert.metadata).length === 0 ? "" : <CustomTable
                  headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                  data={Object.keys(cert.metadata).map(key => ({ id: key, columns: [key, cert.metadata[key].toString()] }))}
               />,
               !cert.csrAttributes ? "" : cert.csrAttributes.length === 0 ? "" : <CustomTable
                  headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                  data={cert.csrAttributes.map(atr => ({ id: atr.name, columns: [atr.label || atr.name, atr.content ? (atr.content as any).value : ""] }))}
               />
            ],
         })
      ),
      [location]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={locationTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Attributes">

            <br />

            <Label>Location Attributes</Label>
            <AttributeViewer attributes={location?.attributes} />

         </Widget>

         <Widget title={certsTitle} busy={isRenewingCertificate}>

            <br />

            <Label>Location certificates</Label>

            <CustomTable
               headers={certHeaders}
               data={certData}
               hasCheckboxes={true}
               onCheckedRowsChanged={
                  (rows) => { setCertCheckedRows(rows as string[]) }
               }
            />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Location"
            body="You are about to delete Location. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={confirmRemoveDialog}
            caption={`Remove ${certCheckedRows.length === 1 ? "certificate" : "certificates"} from the location`}
            body="You are about to remove certificates from the location. Is this what you want to do?"
            toggle={() => setConfirmRemoveDialog(false)}
            buttons={[
               { color: "danger", onClick: onRemoveConfirmed, body: "Yes, remove" },
               { color: "secondary", onClick: () => setConfirmRemoveDialog(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={pushDialog}
            caption="Push certificate to the location"
            toggle={() => setPushDialog(false)}
            buttons={[]}
            size="lg"
            body={

               <>

                  <CertificateList selectCertsOnly={true} multiSelect={false} onCheckedRowsChanged={(certs: (string | number)[]) => setSelectedCerts(certs as string[])} />

                  <Form onSubmit={onPushSubmit} mutators={{ ...mutators() }} >

                     {({ handleSubmit, pristine, submitting, valid }) => (

                        <BootstrapForm onSubmit={handleSubmit}>

                           <AttributeEditor
                              id="pushAttributes"
                              attributeDescriptors={pushAttributeDescriptors!}
                           />

                           <div style={{ textAlign: "right" }}>

                              <ButtonGroup>

                                 <ProgressButton
                                    inProgress={isPushingCertificate}
                                    title="Push"
                                    type="submit"
                                    color="primary"
                                    disabled={pristine || submitting || !valid || selectedCerts.length === 0}
                                    onClick={handleSubmit}
                                 />

                                 <Button type="button" color="secondary" disabled={submitting} onClick={() => setPushDialog(false)}>
                                    Cancel
                                 </Button>

                              </ButtonGroup>

                           </div>

                        </BootstrapForm>

                     )}

                  </Form>

                  <Spinner active={isPushingCertificate} />

               </>

            }
         />


         <Dialog
            isOpen={issueDialog}
            caption="Issue certificate for the location"
            toggle={() => setIssueDialog(false)}
            buttons={[]}
            size="lg"
            body={

               <>

                  <Form onSubmit={onIssueSubmit} mutators={{ ...mutators() }} >

                     {({ handleSubmit, pristine, submitting, valid }) => (

                        <BootstrapForm onSubmit={handleSubmit}>

                           <Field name="raProfile" validate={validateRequired()}>

                              {({ input, meta }) => (

                                 <FormGroup>

                                    <Label for="certificate">RA Profile</Label>

                                    <Select
                                       {...input}
                                       maxMenuHeight={140}
                                       menuPlacement="auto"
                                       options={raProfiles.map(p => ({ value: p.uuid, label: p.name }))}
                                       placeholder="Select RA profile"
                                       styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                                       onChange={(value) => {
                                          input.onChange(value);
                                          dispatch(raActions.listIssuanceAttributeDescriptors({ uuid: value.value }));
                                       }}
                                    />

                                    <div className="invalid-feedback" style={meta.touched && meta.invalid ? { display: "block" } : {}}>{meta.error}</div>

                                 </FormGroup>

                              )}

                           </Field>


                           <FormGroup>

                              <Label>Certificate Signing Request Attributes</Label>

                              {csrAttributeDescriptors && (
                                 <AttributeEditor
                                    id="csrAttributes"
                                    attributeDescriptors={csrAttributeDescriptors}
                                 />
                              )}

                           </FormGroup>


                           <FormGroup>

                              <Label>RA Profile Issuance Attributes</Label>

                              {issuanceAttributeDescriptors && (
                                 <AttributeEditor
                                    id="issueAttributes"
                                    attributeDescriptors={issuanceAttributeDescriptors}
                                 />
                              )}

                           </FormGroup>


                           <div style={{ textAlign: "right" }}>

                              <ButtonGroup>

                                 <ProgressButton
                                    inProgress={isPushingCertificate}
                                    title="Issue"
                                    type="submit"
                                    color="primary"
                                    disabled={pristine || submitting || !valid}
                                    onClick={handleSubmit}
                                 />

                                 <Button type="button" color="secondary" disabled={submitting} onClick={() => setIssueDialog(false)}>
                                    Cancel
                                 </Button>

                              </ButtonGroup>

                           </div>

                        </BootstrapForm>

                     )}

                  </Form>

                  <Spinner active={isFetchingRaProfiles || isFetchingIssuanceAttributes || isIssuingCertificate} />

               </>

            }
         />


      </Container>

   )

}
