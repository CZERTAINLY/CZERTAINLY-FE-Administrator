import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";

import { Form as BootstrapForm, Badge, Button, Col, Container, DropdownItem, DropdownMenu, DropdownToggle, Input, Label, Row, UncontrolledButtonDropdown, ButtonGroup } from "reactstrap";

import { mutators } from "utils/attributeEditorMutators";

import { actions, selectors } from "ducks/certificates";
import { actions as groupAction, selectors as groupSelectors } from "ducks/groups";
import { actions as locationActions, selectors as locationSelectors } from "ducks/locations";
import { actions as raProfileAction, selectors as raProfileSelectors } from "ducks/ra-profiles";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { dateFormatter } from "utils/dateUtil";
import CertificateValidationStatus from "components/pages/certificates/CertificateValidationStatus";
import CertificateStatus from "components/pages/certificates/CertificateStatus";
import ToolTip from "components/ToolTip";
import Select from "react-select";
import { CertificateRevocationReason } from "types/certificate";
import CertificateRenewDialog from "components/pages/certificates/CertificateRenewDialog";
import CertificateEventStatus from "components/pages/certificates/CertificateHistoryStatus";
import { downloadFile, formatPEM } from "utils/certificate";
import MDBColumnName from "components/MDBColumnName";
import { MDBBadge } from "mdbreact";
import StatusBadge from "components/StatusBadge";
import AttributeEditor from "components/Attributes/AttributeEditor";
import Spinner from "components/Spinner";
import ProgressButton from "components/ProgressButton";
import { collectFormAttributes } from "utils/attributes";
import { Form } from "react-final-form";
import CertificateComplianceStatus from "components/pages/certificates/CertificateComplianceStatus";


export default function CertificateDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const certificate = useSelector(selectors.certificateDetail);

   const groups = useSelector(groupSelectors.groups);
   const raProfiles = useSelector(raProfileSelectors.raProfiles);

   const eventHistory = useSelector(selectors.certificateHistory);
   const certLocations = useSelector(selectors.certificateLocations);

   const locations = useSelector(locationSelectors.locations);

   const [groupOptions, setGroupOptions] = useState<{ label: string, value: string }[]>([]);
   const [raProfileOptions, setRaProfileOptions] = useState<{ label: string, value: string }[]>([]);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);
   const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
   const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
   const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
   const isFetchingHistory = useSelector(selectors.isFetchingHistory);
   const isFetchingLocations = useSelector(selectors.isFetchingLocations);
   const isRevoking = useSelector(selectors.isRevoking);
   const isRenewing = useSelector(selectors.isRenewing);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [renew, setRenew] = useState<boolean>(false);
   const [revoke, setRevoke] = useState<boolean>(false);
   const [updateGroup, setUpdateGroup] = useState<boolean>(false);
   const [updateOwner, setUpdateOwner] = useState<boolean>(false);
   const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

   const [currentInfoId, setCurrentInfoId] = useState("");

   const [group, setGroup] = useState<string>();
   const [owner, setOwner] = useState<string>();
   const [raProfile, setRaProfile] = useState<string>();
   const [revokeReason, setRevokeReason] = useState<CertificateRevocationReason>();

   const [locationsCheckedRows, setLocationCheckedRows] = useState<string[]>([]);
   const [selectLocationsCheckedRows, setSelectLocationCheckedRows] = useState<string[]>([]);

   const locationAttributeDescriptors = useSelector(locationSelectors.pushAttributeDescriptors);

   const [addCertToLocation, setAddCertToLocation] = useState<boolean>(false);
   const [confirmRemove, setConfirmRemove] = useState<boolean>(false);

   const isRemovingCertificate = useSelector(locationSelectors.isRemovingCertificate);
   const isPushingCertificate = useSelector(locationSelectors.isPushingCertificate);

   const isFetchingLocationPushAttributeDescriptors = useSelector(locationSelectors.isFetchingPushAttributeDescriptors);


   const isBusy = useMemo(
      () => isFetching || isDeleting || isUpdatingGroup || isUpdatingRaProfile || isUpdatingOwner || isRevoking || isRenewing,
      [isFetching, isDeleting, isUpdatingGroup, isUpdatingRaProfile, isUpdatingOwner, isRevoking, isRenewing]
   );


   useEffect(

      () => {

         if (!params.id) return;
         dispatch(actions.resetState())
         dispatch(actions.getCertificateDetail({ uuid: params.id }));
         dispatch(actions.getCertificateHistory({ uuid: params.id }));

      },
      [dispatch, params.id]

   )

   useEffect(

      () => {

         if (!params.id || !updateGroup) return;
         dispatch(groupAction.listGroups());

      },
      [dispatch, updateGroup, params.id]
   )

   useEffect(

      () => {

         setGroupOptions(groups.map(group => ({ value: group.uuid, label: group.name })));

      },
      [dispatch, groups]
   )

   useEffect(

      () => {

         setRaProfileOptions(raProfiles.map(group => ({ value: group.uuid, label: group.name })));

      },
      [dispatch, raProfiles]
   )



   useEffect(

      () => {

         if (!params.id || !updateGroup) return;
         dispatch(groupAction.listGroups());

      },
      [dispatch, updateGroup, params.id]
   )


   useEffect(

      () => {

         if (!params.id || !revoke) return;
         dispatch(actions.getRevocationAttributes({ raProfileUuid: certificate?.raProfile?.uuid || "" }));

      },
      [dispatch, revoke, params.id, certificate?.raProfile?.uuid]
   )


   useEffect(

      () => {

         if (!params.id || !updateRaProfile) return;
         dispatch(raProfileAction.listRaProfiles());

      },
      [dispatch, updateRaProfile, params.id]

   )


   useEffect(

      () => {

         selectLocationsCheckedRows.length === 0 ?

            dispatch(locationActions.clearPushAttributeDescriptors())
            :
            dispatch(locationActions.getPushAttributes({ uuid: selectLocationsCheckedRows[0] }));

      },
      [dispatch, selectLocationsCheckedRows]

   )


   useEffect(

      () => {

         if (!isPushingCertificate) {
            dispatch(actions.listCertificateLocations({ uuid: params.id }));
            dispatch(locationActions.listLocations());
         }

      },
      [dispatch, isPushingCertificate, params.id]

   )


   useEffect(

      () => {

         if (!isRemovingCertificate) {
            dispatch(actions.listCertificateLocations({ uuid: params.id }));
            dispatch(locationActions.listLocations());
         }

      },
      [dispatch, isRemovingCertificate, params.id]

   )


   const onDeleteConfirmed = useCallback(

      () => {

         if (!certificate) return;

         dispatch(actions.deleteCertificate({ uuid: certificate.uuid }));
         setConfirmDelete(false);

      },
      [certificate, dispatch]

   );

   const onCancelGroupUpdate = useCallback(

      () => {
         setUpdateGroup(false);
         setGroup(undefined);

      },
      [setUpdateGroup, setGroup]
   );

   const onCancelOwnerUpdate = useCallback(

      () => {
         setUpdateOwner(false);
         setOwner(undefined);

      },
      [setUpdateOwner, setOwner]
   );

   const onCancelRaProfileUpdate = useCallback(

      () => {
         setUpdateRaProfile(false);
         setRaProfile(undefined);

      },
      [setUpdateRaProfile, setRaProfile]
   );

   const onComplianceCheck = useCallback(

      () => {

         if (!certificate?.uuid) return;

         dispatch(actions.checkCompliance({ uuids: [certificate.uuid] }));
      },
      [dispatch, certificate?.uuid]

   )


   const onUpdateGroup = useCallback(

      () => {

         if (!certificate || !group) return;

         dispatch(actions.updateGroup({ uuid: certificate.uuid, groupUuid: group }));
         setUpdateGroup(false);

      },
      [certificate, dispatch, group]

   );

   const onUpdateOwner = useCallback(

      () => {

         if (!certificate || !owner) return;

         dispatch(actions.updateOwner({ uuid: certificate.uuid, owner: owner }));
         setUpdateOwner(false);

      },
      [certificate, dispatch, owner]

   );

   const onUpdateRaProfile = useCallback(

      () => {

         if (!certificate || !raProfile) return;

         dispatch(actions.updateRaProfile({ uuid: certificate.uuid, raProfileUuid: raProfile }));
         setUpdateRaProfile(false);

      },
      [certificate, dispatch, raProfile]


   );

   const onRevoke = useCallback(

      () => {

         if (!certificate) return;

         dispatch(actions.revokeCertificate({ uuid: certificate.uuid, reason: revokeReason || 'UNSPECIFIED', attributes: [], raProfileUuid: certificate.raProfile?.uuid || "" }));
         setRevoke(false);

      },
      [certificate, dispatch, revokeReason,]


   );


   const onRenew = useCallback(

      (data: { fileName: string, contentType: string, fileContent: string }) => {

         if (data.fileContent) {

            try {
               dispatch(actions.renewCertificate({ uuid: certificate?.uuid || "", pkcs10: data.fileContent, raProfileUuid: certificate?.raProfile?.uuid || "" }));
            } catch (error) {
            }
         }

         setRenew(false);

      },
      [dispatch, certificate]

   );


   const onAddCertToLocations = useCallback(

      (values) => {

         setAddCertToLocation(false);

         if (selectLocationsCheckedRows.length === 0 || !certificate) return;

         dispatch(
            locationActions.pushCertificate({
               certificateUuid: certificate.uuid,
               locationUuid: selectLocationsCheckedRows[0],
               pushAttributes: collectFormAttributes("locationAttributes", locationAttributeDescriptors, values)
            })
         );

      },
      [selectLocationsCheckedRows, certificate, dispatch, locationAttributeDescriptors]

   );


   const onRemove = useCallback(

      () => {

         if (locationsCheckedRows.length === 0 || !certificate) return;

         setConfirmRemove(false);

         locationsCheckedRows.forEach(
            uuid => {
               dispatch(locationActions.removeCertificate({ certificateUuid: certificate.uuid, locationUuid: uuid }));
            }
         );

      },
      [dispatch, certificate, locationsCheckedRows]

   );


   const fileNameToDownload = certificate?.commonName + "_" + certificate?.serialNumber;

   const downloadDropDown = useMemo(
      () => (

         <UncontrolledButtonDropdown>

            <DropdownToggle
               color="light"
               caret
               className="btn btn-link"
               data-for="download"
               data-tip
            >
               <i className="fa fa-download" aria-hidden="true" />
               <ToolTip id="download" message="Download" />
            </DropdownToggle>

            <DropdownMenu>

               <DropdownItem key="pem" onClick={() => downloadFile(
                  formatPEM(certificate?.certificateContent || ""),
                  fileNameToDownload + ".pem"
               )
               }>
                  PEM (.pem)
               </DropdownItem>

               <DropdownItem key="der" onClick={() => {
                  downloadFile(
                     Buffer.from(certificate?.certificateContent || "", "base64"),
                     fileNameToDownload + ".cer"
                  )
               }}>
                  DER (.cer)
               </DropdownItem>

            </DropdownMenu>

         </UncontrolledButtonDropdown>

      ),
      [certificate, fileNameToDownload,]

   );

   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "retweet", disabled: !certificate?.raProfile || certificate?.status === 'revoked', tooltip: "Renew", onClick: () => { setRenew(true); } },
         { icon: "minus-square", disabled: !certificate?.raProfile || certificate?.status === 'revoked', tooltip: "Revoke", onClick: () => { setRevoke(true); } },
         { icon: "gavel", disabled: !certificate?.raProfile || certificate?.status === 'revoked', tooltip: "Check Compliance", onClick: () => { onComplianceCheck(); } },
         { icon: "download", disabled: false, tooltip: "Download", custom: downloadDropDown, onClick: () => { } },
      ],
      [certificate, downloadDropDown, onComplianceCheck]
   );


   const buttonsLocations: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Push to location", onClick: () => { setSelectLocationCheckedRows([]); setAddCertToLocation(true); } },
         { icon: "trash", disabled: locationsCheckedRows.length === 0, tooltip: "Remove", onClick: () => { setConfirmRemove(true); } },
      ],
      [locationsCheckedRows.length]
   );


   const updateOwnerBody = useMemo(

      () => (

         <div>
            <Label for="Owner Name">Owner</Label>
            <Input
               type="text"
               placeholder="Enter the owner name / Email"
               onChange={(event) => setOwner(event.target.value)}
            ></Input>
         </div>

      ),
      [setOwner]

   );

   const updateGroupBody = useMemo(

      () => {
         return (<div>
            <Select
               maxMenuHeight={140}
               menuPlacement="auto"
               options={groupOptions}
               placeholder={`Select Group`}
               onChange={(event) => setGroup(event?.value)}
            />
         </div>
         )
      },
      [setGroup, groupOptions]

   );


   const updateRaProfileBody = useMemo(

      () => {
         return (<div>
            <Select
               maxMenuHeight={140}
               menuPlacement="auto"
               options={raProfileOptions}
               placeholder={`Select RA Profile`}
               onChange={(event) => setRaProfile(event?.value)}
            />
         </div>
         )
      },
      [setRaProfile, raProfileOptions]

   );


   const revokeBody = useMemo(

      () => {
         let options = [
            {
               "label": "UNSPECIFIED",
               "value": 'UNSPECIFIED'
            },
            {
               "label": "KEY_COMPROMISE",
               "value": 'KEY_COMPROMISE'
            },
            {
               "label": "CA_COMPROMISE",
               "value": 'CA_COMPROMISE'
            },
            {
               "label": "AFFILIATION_CHANGED",
               "value": 'AFFILIATION_CHANGED'
            },
            {
               "label": "SUPERSEDED",
               "value": 'SUPERSEDED'
            },
            {
               "label": "CESSATION_OF_OPERATION",
               "value": 'CESSATION_OF_OPERATION'
            },
            {
               "label": "CERTIFICATE_HOLD",
               "value": 'CERTIFICATE_HOLD'
            },
            {
               "label": "PRIVILEGE_WITHDRAWN",
               "value": 'PRIVILEGE_WITHDRAWN'
            },
            {
               "label": "A_A_COMPROMISE",
               "value": 'A_A_COMPROMISE'
            },
            {
               "label": "REMOVE_FROM_CRL",
               "value": 'REMOVE_FROM_CRL'
            }
         ]

         return (<div>
            <Select
               maxMenuHeight={140}
               menuPlacement="auto"
               options={options}
               placeholder={`Select Revocation Reason`}
               onChange={(event: any) => setRevokeReason(event?.value as CertificateRevocationReason)}
            />

         </div>
         )
      },
      [setRevokeReason]

   );

   const certificateTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Certificate <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

   );

   const metaTitle = (
      <h5>
         <span className="fw-semi-bold">Meta Data</span>
      </h5>
   );

   const validationTitle = (
      <h5>
         <span className="fw-semi-bold">Validation Results</span>
      </h5>
   );
   const sanTitle = (
      <h5>
         <span className="fw-semi-bold">Subject Alternative Names</span>
      </h5>
   );

   const attributesTitle = (
      <h5>
         Certificate <span className="fw-semi-bold">Attributes</span>
      </h5>
   );

   const historyTitle = (
      <h5>
         <span className="fw-semi-bold">Certificate Event History</span>
      </h5>
   );

   const complianceTitle = (
      <h5>
         <span className="fw-semi-bold">Non Compliant Rules</span>
      </h5>
   );

   const locationsTitle = (

      <div>

         <div className="pull-right mt-n-xs">
            <WidgetButtons buttons={buttonsLocations} />
         </div>

         <h5>
            <span className="fw-semi-bold">Certificate Locations</span>
         </h5>

      </div>

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

   const historyHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "time",
            content: "Time",
         },
         {
            id: "user",
            content: "User",
         },
         {
            id: "event",
            content: "Event",
         },
         {
            id: "status",
            content: "Status",
         },
         {
            id: "message",
            content: "Message",
         },
         {
            id: "additionalMessage",
            content: "Additional Message",
         },
      ],
      []

   );

   const historyEntry: TableDataRow[] = useMemo(

      () => !eventHistory ? [] : eventHistory.map(function (history) {

         return (

            {
               "id": history.uuid,
               "columns": [<span style={{ whiteSpace: "nowrap" }}>{dateFormatter(history.created)}</span>,

               history.createdBy,

               history.event,

               <CertificateEventStatus status={history.status} />,

               <div style={{ wordBreak: "break-all" }}>{history.message}</div>,

               history.additionalInformation ? (
                  <Button
                     color="white"
                     data-for={`addInfo${history.uuid}`}
                     data-tip
                     onClick={() => setCurrentInfoId(history.uuid)}
                  >

                     <i className="fa fa-info-circle" aria-hidden="true"></i>

                     <ToolTip
                        id={`addInfo${history.uuid}`}
                        message="View Additional Information"
                     />

                  </Button>
               ) : ""
               ]
            }

         )

      }), [eventHistory]
   );



   const additionalInfoEntry = (): any => {
      let returnList = [];
      if (!currentInfoId) return;
      const currentHistory = eventHistory?.filter(
         (history) => history.uuid === currentInfoId
      );
      for (let [key, value] of Object.entries(
         currentHistory![0]?.additionalInformation
      )) {
         returnList.push(
            <tr>
               <td style={{padding: "0.25em"}}>{key}</td>
               <td style={{padding: "0.25em"}}>
                  <p
                     style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                     }}
                  >
                     {value as string}
                  </p>
               </td>
            </tr>
         );
      }
      return returnList;
   };



   const attributeHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "attribute",
            content: "Attribute",
         },
         {
            id: "value",
            content: "Value",
         },
         {
            id: "action",
            content: "Action",
         }
      ],
      []
   );



   const validationHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "validationType",
            content: "Validation Type",
         },
         {
            id: "status",
            content: "Status",
         },
         {
            id: "message",
            content: "Message",
         }
      ],
      []

   );

   const complianceHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "status",
            content: "Status",
         },
         {
            id: "ruleDescription",
            content: "Rule Description",
         }
      ],
      []
   );


   const complianceData: TableDataRow[] = useMemo(

      () => !certificate ? [] : (certificate.nonCompliantRules || []).map(e => {
         return (
            {
               id: e.ruleDescription,
               columns: [<CertificateComplianceStatus status={e.status} />, e.ruleDescription],
            }
         )
      }
      ),
      [certificate]
   )

   const metaData: TableDataRow[] = useMemo(

      () => !certificate ? [] : Object.entries(certificate.meta || {}).map(function ([key, value]) {
         return (
            {
               id: key,
               columns: [key, value?.toString()],
            }
         )
      }
      ),
      [certificate]
   )

   const attributeData: TableDataRow[] = useMemo(

      () => !certificate ? [] : [
         {
            id: "uuid",
            columns: ["UUID", certificate.uuid],
         },
         {
            id: "owner",
            columns: ["Owner", certificate.owner || "Unassigned",
               <Button
                  className="btn btn-link"
                  size="sm"
                  color="secondary"
                  data-for="updateOwner"
                  data-tip
                  onClick={() => setUpdateOwner(true)}
               >
                  <i className="fa fa-refresh" />
                  <ToolTip id="updateOwner" message="Update Owner" />
               </Button>
            ],
         },
         {
            id: "group",
            columns: ["Group", certificate?.group?.name ? (
               <Link to={`../../groups/detail/${certificate?.group.uuid}`}>
                  {certificate?.group.name}
               </Link>
            ) : "Unassigned",
               <Button
                  className="btn btn-link"
                  size="sm"
                  color="secondary"
                  data-for="updateGroup"
                  data-tip
                  onClick={() => setUpdateGroup(true)}
               >
                  <i className="fa fa-refresh" />
                  <ToolTip id="updateGroup" message="Update Group" />
               </Button>
            ],
         },
         {
            id: "raProfile",
            columns: ["RA Profile", certificate?.raProfile?.name ? (
               <Link to={`../../raProfiles/detail/${certificate?.raProfile.uuid}`}>
                  {certificate?.raProfile.name}
               </Link>
            ) : "Unassigned",
               <Button
                  className="btn btn-link"
                  size="sm"
                  color="secondary"
                  data-for="updateRaProfile"
                  data-tip
                  onClick={() => setUpdateRaProfile(true)}
               >
                  <i className="fa fa-refresh" />
                  <ToolTip id="updateRaProfile" message="Update RA Profile" />
               </Button>
            ],
         },
         {
            id: "type",
            columns: ["Type", certificate.certificateType || ""],
         },
      ],
      [certificate]
   )

   const sanData: TableDataRow[] = useMemo(

      () => {
         let sanList: TableDataRow[] = [];
         for (let [key, value] of Object.entries(certificate?.subjectAlternativeNames || {})) {
            if (value && value.length > 0) {
               sanList.push({
                  id: key,
                  columns: [key, value.join(", ")],
               })
            }
         }
         return sanList
      },
      [certificate]
   )


   const validationData: TableDataRow[] = useMemo(

      () => !certificate ? [] : Object.entries(certificate.certificateValidationResult || {}).map(function ([key, value]) {
         return (
            {
               id: key,
               columns: [
                  key,
                  <CertificateValidationStatus status={value.status} />,
                  <div style={{ wordBreak: "break-all" }}>
                     {value.message.split("\n").map((str: string) => (
                        <div>
                           {str}
                           <br />
                        </div>
                     ))}
                  </div>
               ],
            }
         )
      }
      ),
      [certificate]
   )


   const detailData: TableDataRow[] = useMemo(

      () => !certificate ? [] : [

         {
            id: "commonName",
            columns: ["Common Name", certificate.commonName],

         },
         {
            id: "serialNumber",
            columns: ["Serial Number", certificate.serialNumber]
         },
         {
            id: "issuerCommonName",
            columns: ["Issuer Common Name", certificate.issuerCommonName]
         },
         {
            id: "issuerDN",
            columns: ["Issuer DN", certificate.issuerDn]
         },
         {
            id: "subjectDN",
            columns: ["Subject DN", certificate.subjectDn]
         },
         {
            id: "expiresAt",
            columns: ["Expires At", <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notAfter)}</span>]
         },
         {
            id: "validFrom",
            columns: ["Valid From", <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notBefore)}</span>]
         },
         {
            id: "publicKeyAlgorithm",
            columns: ["Public Key Algorithm", certificate.publicKeyAlgorithm]
         },
         {
            id: "signatureAlgorithm",
            columns: ["Signature Algorithm", certificate.signatureAlgorithm]
         },
         {
            id: "certStatus",
            columns: ["Status", <CertificateStatus status={certificate.status} />]
         },
         {
            id: "complianceStatus",
            columns: ["Compliance Status", <CertificateComplianceStatus status={certificate.complianceStatus || "na"} />]
         },
         {
            id: "fingerprint",
            columns: ["Fingerprint", certificate.fingerprint]
         },
         {
            id: "fingerprintAlgorithm",
            columns: ["Fingerprint Algorithm", "SHA256"],
         },
         {
            id: "keySize",
            columns: ["Key Size", certificate.keySize.toString()]
         },
         {
            id: "keyUsage",
            columns: ["Key Usage",
               (certificate?.keyUsage?.map(function (name) {
                  return (
                     <div key={name}>
                        <Badge style={{ backgroundColor: "Metalic Blue" }}>
                           {name}
                        </Badge>
                        &nbsp;
                     </div>
                  );
               })) || ""
            ]
         },
         {
            id: "extendedKeyUsage",
            columns: ["Extended Key Usage",
               (certificate?.extendedKeyUsage?.map(function (name) {
                  return (
                     <div key={name}>
                        <Badge style={{ backgroundColor: "Metalic Blue" }}>
                           {name}
                        </Badge>
                        &nbsp;
                     </div>
                  );
               })) || ""
            ]
         },
         {
            id: "basicConstraint",
            columns: ["Basic Constraint", certificate.basicConstraints]
         }
      ],
      [certificate]
   );



   const locationsHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            id: "locationName",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Description" />,
            sortable: true,
            id: "locationDescription",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Entity" />,
            sortable: true,
            id: "locationEntity",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Multiple Entires" />,
            align: "center",
            sortable: true,
            id: "multiEntries",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Key Management" />,
            align: "center",
            sortable: true,
            id: "keyMgmt",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            id: "Status",
            width: "15%",
         }
      ],
      []

   );


   const locationsData: TableDataRow[] = useMemo(

      () => !certLocations ? [] : certLocations.map(

         location => ({

            id: location.uuid,

            columns: [

               <Link to={`../../locations/detail/${location.uuid}`}>{location.name}</Link>,

               location.description || "",

               <MDBBadge color="primary" >{location.entityInstanceName}</MDBBadge>,

               location.supportMultipleEntries ? <MDBBadge color="success">Yes</MDBBadge> : <MDBBadge color="danger">No</MDBBadge>,

               location.supportKeyManagement ? <MDBBadge color="success">Yes</MDBBadge> : <MDBBadge color="danger">No</MDBBadge>,

               <StatusBadge enabled={location.enabled} />,

            ]

         })

      ),
      [certLocations]

   );


   const selectLocationsHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            id: "locationName",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Description" />,
            sortable: true,
            id: "locationDescription",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Entity" />,
            sortable: true,
            id: "locationEntity",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Multiple Entires" />,
            align: "center",
            sortable: true,
            id: "multiEntries",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Key Management" />,
            align: "center",
            sortable: true,
            id: "keyMgmt",
            width: "auto",
         },
         {
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            id: "Status",
            width: "15%",
         }
      ],
      []

   );


   const selectLocationsData: TableDataRow[] = useMemo(

      () => !locations ? [] : locations.map(

         location => {

            if (certLocations?.find(cl => cl.uuid === location.uuid)) return undefined;

            return {

               id: location.uuid,

               columns: [

                  location.name,

                  location.description || "",

                  <MDBBadge color="primary" >{location.entityInstanceName}</MDBBadge>,

                  location.supportMultipleEntries ? <MDBBadge color="success">Yes</MDBBadge> : <MDBBadge color="danger">No</MDBBadge>,

                  location.supportKeyManagement ? <MDBBadge color="success">Yes</MDBBadge> : <MDBBadge color="danger">No</MDBBadge>,

                  <StatusBadge enabled={location.enabled} />,

               ]

            }
         }

      ).filter(
         location => location !== undefined
      ) as TableDataRow[],
      [certLocations, locations]

   );

   return (

      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title={certificateTitle} busy={isBusy}>
                  <br />
                  <CustomTable
                     hasPagination={false}
                     headers={detailHeaders}
                     data={detailData}
                  />
               </Widget>
            </Col>
            <Col>
               <Widget title={sanTitle} busy={isBusy}>
                  <br />
                  <CustomTable
                     headers={detailHeaders}
                     data={sanData}
                  />
               </Widget>
            </Col>
         </Row>

         <Widget title={validationTitle} busy={isBusy}>
            <br />
            <CustomTable
               headers={validationHeaders}
               data={validationData}
            />
         </Widget>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title={attributesTitle}>
                  <br />
                  <CustomTable
                     headers={attributeHeaders}
                     data={attributeData}
                  />
               </Widget>
            </Col>
            <Col>
               <Widget title={metaTitle}>
                  <br />
                  <CustomTable
                     headers={detailHeaders}
                     data={metaData}
                  />
               </Widget>
            </Col>
         </Row>

         <Widget title={historyTitle} busy={isFetchingHistory}>
            <br />
            <CustomTable
               headers={historyHeaders}
               data={historyEntry}
            />
         </Widget>


         <Widget title={locationsTitle} busy={isFetchingLocations || isRemovingCertificate || isPushingCertificate}>
            <br />
            <CustomTable
               headers={locationsHeaders}
               data={locationsData}
               hasCheckboxes={true}
               onCheckedRowsChanged={(rows) => setLocationCheckedRows(rows as string[])}
            />
         </Widget>

         {certificate?.nonCompliantRules ? <Widget title={complianceTitle} busy={isFetching}>
            <br />
            <CustomTable
               headers={complianceHeaders}
               data={complianceData}
            />
         </Widget> : null}


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Certificate"
            body="You are about to delete a Certificate. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={updateGroup}
            caption={`Update Group`}
            body={updateGroupBody}
            toggle={() => onCancelGroupUpdate()}
            buttons={[
               { color: "primary", onClick: () => onUpdateGroup(), body: "Update", disabled: true ? group === undefined : false },
               { color: "secondary", onClick: () => onCancelGroupUpdate(), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={updateOwner}
            caption={`Update Owner`}
            body={updateOwnerBody}
            toggle={() => onCancelOwnerUpdate()}
            buttons={[
               { color: "primary", onClick: onUpdateOwner, body: "Update", disabled: true ? owner === undefined : false },
               { color: "secondary", onClick: () => onCancelOwnerUpdate(), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={updateRaProfile}
            caption={`Update RA Profile`}
            body={updateRaProfileBody}
            toggle={() => onCancelRaProfileUpdate()}
            buttons={[
               { color: "primary", onClick: onUpdateRaProfile, body: "Update", disabled: true ? raProfile === undefined : false },
               { color: "secondary", onClick: () => onCancelRaProfileUpdate(), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={renew}
            caption={`Renew Certificate`}
            body={<CertificateRenewDialog onCancel={() => setRenew(false)} onRenew={onRenew} />}
            toggle={() => setRenew(false)}
            buttons={[]}
         />

         <Dialog
            isOpen={revoke}
            caption={`revoke Certificate`}
            body={revokeBody}
            toggle={() => setRevoke(false)}
            buttons={[
               { color: "primary", onClick: onRevoke, body: "Revoke" },
               { color: "secondary", onClick: () => setRevoke(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={currentInfoId !== ""}
            caption={`Additional Information`}
            body={additionalInfoEntry()}
            toggle={() => setCurrentInfoId("")}
            buttons={[]}
            size="lg"
         />

         <Dialog
            isOpen={addCertToLocation}
            caption={`Push certificate to the Location`}
            toggle={() => setAddCertToLocation(false)}
            buttons={[]}
            body={(
               <>

                  <Form onSubmit={(value) => { onAddCertToLocations(value); }} mutators={{ ...mutators() }} >

                     {({ handleSubmit, submitting, valid, }) => (

                        <BootstrapForm onSubmit={handleSubmit}>

                           <Label>Locations</Label>

                           <CustomTable
                              hasPagination={false}
                              headers={selectLocationsHeaders}
                              data={selectLocationsData}
                              hasCheckboxes={true}
                              multiSelect={false}

                              onCheckedRowsChanged={(rows) => setSelectLocationCheckedRows(rows as string[])}
                           />

                           {locationAttributeDescriptors && (

                              <>

                                 <br />
                                 <Label>Location attributes</Label>

                                 <AttributeEditor
                                    id="locationAttributes"
                                    attributeDescriptors={locationAttributeDescriptors}
                                 />

                              </>

                           )}


                           <div className="d-flex justify-content-end">

                              <ButtonGroup>

                                 <ProgressButton
                                    title="Push"
                                    inProgressTitle="Pushing..."
                                    inProgress={submitting}
                                    disabled={selectLocationsCheckedRows.length === 0 || !valid}
                                 />

                                 <Button
                                    color="default"
                                    onClick={() => setAddCertToLocation(false)}
                                    disabled={submitting}
                                 >
                                    Cancel
                                 </Button>

                              </ButtonGroup>

                           </div>


                        </BootstrapForm>

                     )}

                  </Form>

                  <Spinner active={isPushingCertificate || isFetchingLocationPushAttributeDescriptors} />

               </>

            )}
         />

         <Dialog
            isOpen={confirmRemove}
            caption={`Remove Certificate from Location`}
            body={(
               <>
                  You are about to remove a Certificate from selected locations:<br /><br />
                  {
                     locationsCheckedRows.map(
                        uuid => {
                           const loc = certLocations?.find(l => l.uuid === uuid);
                           return loc ? <>{loc.name}<br /></> : <></>
                        }
                     )
                  }
                  <br />
                  Is this what you want to do?
               </>
            )}
            toggle={() => setConfirmRemove(false)}
            buttons={[
               { color: "primary", onClick: onRemove, body: "Remove" },
               { color: "secondary", onClick: () => setConfirmRemove(false), body: "Cancel" },
            ]}
         />

      </Container>

   )

}
