import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge, Button, ButtonGroup, Container, Form as BootstrapForm, FormGroup, Label } from 'reactstrap';
import { Field, Form } from "react-final-form";

import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";

import { actions, selectors } from "ducks/locations";
import { actions as raActions, selectors as raSelectors } from "ducks/ra-profiles";

import { validateRequired } from "utils/validators";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "components/Attributes/AttributeViewer";
import StatusBadge from "components/StatusBadge";
import AttributeEditor from "components/Attributes/AttributeEditor";
import CertificateList from "components/_pages/certificates/list";
import ProgressButton from "components/ProgressButton";
import Spinner from "components/Spinner";
import Select from "react-select";
import { AttributeDescriptorModel } from "types/attributes";


export default function LocationDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { entityId, id } = useParams();

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
   const isSyncing = useSelector(selectors.isSyncing);

   const isFetchingRaProfiles = useSelector(raSelectors.isFetchingList);
   const isFetchingIssuanceAttributes = useSelector(raSelectors.isFetchingIssuanceAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [pushGroupAttributesCallbackAttributes, setPushGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [csrGroupAttributesCallbackAttributes, setCsrGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<boolean>(false);
   const [issueDialog, setIssueDialog] = useState<boolean>(false);
   const [pushDialog, setPushDialog] = useState<boolean>(false);

   const [certCheckedRows, setCertCheckedRows] = useState<string[]>([]);

   const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

   const isBusy = useMemo(
      () => isFetching || isDeleting || isFetchingPushAttributeDescriptors || isFetchingCSRAttributeDescriptors,
      [isFetching, isDeleting, isFetchingPushAttributeDescriptors, isFetchingCSRAttributeDescriptors]
   );


   useEffect(

      () => {

         if (!id || !entityId) return;
         dispatch(actions.getLocationDetail({ entityUuid: entityId!, uuid: id! }));

      },
      [dispatch, id, entityId]

   )

   useEffect(

      () => {

         if (!id || !entityId || !location || !location.uuid) return;

         if(location.enabled) {
            dispatch(actions.getPushAttributes({ entityUuid: entityId, uuid: id }));
            dispatch(actions.getCSRAttributes({ entityUuid: entityId, uuid: id }));
         }

      },
      [dispatch, id, location, entityId]

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
         navigate(`../../../edit/${location.entityInstanceUuid}/${location.uuid}`, { relative: "path" });

      },
      [location, navigate]

   );


   const onEnableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.enableLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onDisableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.disableLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onRemoveConfirmed = useCallback(

      () => {

         if (!location || certCheckedRows.length === 0) return;

         certCheckedRows.forEach(
            certUuid => {
               dispatch(actions.removeCertificate({ entityUuid: location.entityInstanceUuid, locationUuid: location.uuid, certificateUuid: certUuid }));
            }
         );

         setConfirmRemoveDialog(false);
         setCertCheckedRows([]);

      },
      [dispatch, location, certCheckedRows]

   );


   const onRenewClick = useCallback(

      () => {

         if (!location) return;

         for (const certUuid of certCheckedRows) {
            dispatch(actions.autoRenewCertificate({ entityUuid: location.entityInstanceUuid, locationUuid: location.uuid, certificateUuid: certUuid }));
         }

      },
      [certCheckedRows, dispatch, location]

   )


   const onSyncClick = useCallback(

      () => {

         if (!location) return;

         dispatch(actions.syncLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onPushSubmit = useCallback(

      (values: any) => {

         if (selectedCerts.length === 0 || !location) return;

         const attrs = collectFormAttributes("pushAttributes", [...(pushAttributeDescriptors ?? []), ...pushGroupAttributesCallbackAttributes], values);

         selectedCerts.forEach(
            certUuid => {
               dispatch(actions.pushCertificate({ entityUuid: location.entityInstanceUuid, locationUuid: location.uuid, certificateUuid: certUuid, pushRequest: { attributes: attrs }}));
            }
         )

      },
      [dispatch, location, pushAttributeDescriptors, selectedCerts, pushGroupAttributesCallbackAttributes]

   )


   const onIssueSubmit = useCallback(

      (values: any) => {

         if (!location) return;

         const issueAttrs = collectFormAttributes("issueAttributes", [...(issuanceAttributeDescriptors ?? []), ...issueGroupAttributesCallbackAttributes], values);
         const csrAttrs = collectFormAttributes("csrAttributes", [...(csrAttributeDescriptors ?? []), ...csrGroupAttributesCallbackAttributes], values);

         dispatch(actions.issueCertificate({
            entityUuid: location.entityInstanceUuid,
            locationUuid: location.uuid,
             issueRequest: {
                 raProfileUuid: values.raProfile.value.split(":#")[0],
                 csrAttributes: csrAttrs,
                 issueAttributes: issueAttrs
             }
         }));
         setIssueDialog(false);

      },
      [csrAttributeDescriptors, dispatch, issuanceAttributeDescriptors, location, issueGroupAttributesCallbackAttributes, csrGroupAttributesCallbackAttributes]

   )


   const onDeleteConfirmed = useCallback(

      () => {

         if (!location) return;

         dispatch(actions.deleteLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid, redirect: "../" }));
         setConfirmDelete(false);

      },
      [location, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: location?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !location?.enabled || false, tooltip: "Disable", onClick: () => { onDisableClick() } },
      ],
      [location?.enabled, onDisableClick, onEditClick, onEnableClick]

   );


   const locationTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
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
         { icon: "push", disabled: (!(location?.supportMultipleEntries)) && (location ? location.certificates.length > 0 : false), tooltip: "Push", onClick: () => { setPushDialog(true) } },
         { icon: "cubes", disabled: !location?.supportKeyManagement, tooltip: "Issue", onClick: () => { setIssueDialog(true) } },
         { icon: "retweet", disabled: certCheckedRows.length === 0, tooltip: "Renew", onClick: () => { onRenewClick() } },
         { icon: "sync", disabled: false, tooltip: "Sync", onClick: () => { onSyncClick() } }
      ],
      [certCheckedRows.length, location, onRenewClick, onSyncClick]

   );


   const certsTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
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
            align: "center",
            content: "Private Key",
            sortable: true,
         },
         {
            id: "metadata",
            content: "Metadata",
         },
         {
            id: "CSR Detail",
            content: "CSR Detail",
         },

      ],
      []

   );


   const certData: TableDataRow[] = useMemo(

      () => !location ? [] : location.certificates.map(
         cert => ({

            id: cert.certificateUuid,

            columns: [

               <Link to={`../../../certificates/detail/${cert.certificateUuid}`}>{cert.commonName || ("empty")}</Link>,

               cert.withKey ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={cert.metadata} />,

               !cert.csrAttributes ? "" :
                  cert.csrAttributes.length === 0 ? "" :
                     <div style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "20em", overflow: "hidden" }}>
                        {cert.csrAttributes.map(atr => atr.content ? (atr.content as any).value : "").join(", ")}
                     </div>,

            ],

            detailColumns: [

               <></>,
               <></>,
               <></>,
               <></>,

                <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT} metadata={cert.metadata} />,

               !cert.csrAttributes ? "" : cert.csrAttributes.length === 0 ? "" : <CustomTable
                  headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                  data={cert.csrAttributes.map(atr => ({ id: atr.name, columns: [atr.label || atr.name, atr.content ? (atr.content as any).value : ""] }))}
               />

            ]

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

         <Widget title={certsTitle} busy={isRenewingCertificate || isPushingCertificate || isRemovingCertificate || isSyncing || isIssuingCertificate}>

            <br />

            <Label>Location certificates</Label>

            <CustomTable
               headers={certHeaders}
               data={certData}
               hasCheckboxes={true}
               multiSelect={false}
               onCheckedRowsChanged={
                  (rows) => { setCertCheckedRows(rows as string[]) }
               }
               hasDetails={true}
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
            body={(
               <>
                  You are about to remove certificates from the location:<br />

                  {

                     certCheckedRows.map(
                        uuid => {
                           const cert = location?.certificates.find(c => c.certificateUuid === uuid);
                           return cert ? <>{cert.commonName || ("empty")}<br /></> : <></>
                        }
                     )

                  }

                  <br />
                  <br />
                  Is this what you want to do?
               </>
            )}
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
                              groupAttributesCallbackAttributes={pushGroupAttributesCallbackAttributes}
                              setGroupAttributesCallbackAttributes={setPushGroupAttributesCallbackAttributes}
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

                  <Spinner active={isPushingCertificate || isRemovingCertificate} />

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
                                       options={raProfiles.map(p => ({ value: p.uuid + ":#" + p.authorityInstanceUuid, label: p.name }))}
                                       placeholder="Select RA profile"
                                       styles={{ control: (provided) => (meta.touched && meta.invalid ? { ...provided, border: "solid 1px red", "&:hover": { border: "solid 1px red" } } : { ...provided }) }}
                                       onChange={(value) => {
                                          input.onChange(value);
                                          dispatch(raActions.listIssuanceAttributeDescriptors({ authorityUuid: value.value.split(":#")[1], uuid: value.value.split(":#")[0] }));
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
                                    groupAttributesCallbackAttributes={csrGroupAttributesCallbackAttributes}
                                    setGroupAttributesCallbackAttributes={setCsrGroupAttributesCallbackAttributes}
                                 />
                              )}

                           </FormGroup>


                           <FormGroup>

                              <Label>RA Profile Issuance Attributes</Label>

                              {issuanceAttributeDescriptors && (
                                 <AttributeEditor
                                    id="issueAttributes"
                                    attributeDescriptors={issuanceAttributeDescriptors}
                                    groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                    setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
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

                  <Spinner active={isFetchingRaProfiles || isFetchingIssuanceAttributes || isIssuingCertificate || isRemovingCertificate} />

               </>

            }
         />


      </Container>

   )

}
