import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";

import { Container, Label, Row, Col, Button } from "reactstrap";
import Select from "react-select";

import { actions as clientActions, selectors as clientSelectors } from "ducks/clients";
import { actions as raProfilesActions, selectors as raProfilesSelectors } from "ducks/ra-profiles";

import AcmeProtocolActiovationDialogBody from "./AcmeProtocolActiovationDialogBody";

import Widget from "components/Widget";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import ProgressButton from "components/ProgressButton";
import ToolTip from "components/ToolTip";
import classNames from "classnames";


export default function RaProfileDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();
   const history = useHistory();

   const clients = useSelector(clientSelectors.clients);

   const isFetchingClients = useSelector(clientSelectors.isFetchingList);

   const isAuthorizingClient = useSelector(clientSelectors.isAuthorizing);
   const isUnauthorizing = useSelector(clientSelectors.isUnauthorizing);


   const raProfile = useSelector(raProfilesSelectors.raProfile);
   const acmeDetails = useSelector(raProfilesSelectors.acmeDetails);
   const raProfileAuthorizedClientUuids = useSelector(raProfilesSelectors.authorizedClients);

   const isFetchingProfile = useSelector(raProfilesSelectors.isFetchingDetail);
   const isFetchingAuthorizedClients = useSelector(raProfilesSelectors.isFetchingAuthorizedClients);
   const isFetchingAttributes = useSelector(raProfilesSelectors.isFetchingAttributes);
   const isFetchingAcmeDetails = useSelector(raProfilesSelectors.isFetchingAcmeDetails);

   const isDeleting = useSelector(raProfilesSelectors.isDeleting);
   const isEnabling = useSelector(raProfilesSelectors.isEnabling);
   const isDisabling = useSelector(raProfilesSelectors.isDisabling);
   const isActivatingAcme = useSelector(raProfilesSelectors.isActivatingAcme);
   const isDeactivatingAcme = useSelector(raProfilesSelectors.isDeactivatingAcme);


   const [clientToAuthorize, setClientToAuthorize] = useState<{ value: string; label: string; } | null>(null);

   const [authorizedClientsDataState, setAuthorizedClientsDataState] = useState<TableDataRow[]>([]);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const [activateAcmeDialog, setActivateAcmeDialog] = useState(false);

   const [confirmDeactivateAcme, setConfirmDeactivateAcme] = useState<boolean>(false);


   const isBusy = useMemo(
      () => isFetchingProfile || isDeleting || isEnabling || isDisabling,
      [isFetchingProfile, isDeleting, isEnabling, isDisabling]
   )


   const isWorkingWithProtocol = useMemo(
      () => isActivatingAcme || isDeactivatingAcme || isFetchingAcmeDetails,
      [isActivatingAcme, isDeactivatingAcme, isFetchingAcmeDetails]
   )


   useEffect(

      () => {
         if (!params.id) return;
         dispatch(raProfilesActions.getRaProfileDetail({ uuid: params.id }));
         dispatch(raProfilesActions.listIssuanceAttributeDescriptors({ uuid: params.id }));
         dispatch(raProfilesActions.listRevocationAttributes({ uuid: params.id }));
         dispatch(raProfilesActions.getAcmeDetails({ uuid: params.id }));
      },
      [params.id, dispatch]

   )


   useEffect(

      () => {
         if (isAuthorizingClient || isUnauthorizing) return;
         dispatch(raProfilesActions.listAuthorizedClients({ uuid: params.id }));
         dispatch(clientActions.listClients());
         setClientToAuthorize(null);
      },
      [dispatch, isAuthorizingClient, isUnauthorizing, params.id]

   )


   const onEditClick = useCallback(

      () => {
         if (!raProfile) return;
         history.push(`../../raprofiles/edit/${raProfile?.uuid}`);
      },
      [history, raProfile]

   );


   const onEnableClick = useCallback(
      () => {

         if (!raProfile) return;
         dispatch(raProfilesActions.enableRaProfile({ uuid: raProfile.uuid }));
      },
      [dispatch, raProfile]

   );


   const onDisableClick = useCallback(

      () => {
         if (!raProfile) return;
         dispatch(raProfilesActions.disableRaProfile({ uuid: raProfile.uuid }));
      },
      [dispatch, raProfile]

   );


   const onAuthorizeClientClick = useCallback(

      () => {
         if (!raProfile || !clientToAuthorize) return;
         dispatch(clientActions.authorizeClient({ clientUuid: clientToAuthorize.value, raProfile }))
      },
      [dispatch, raProfile, clientToAuthorize]

   )


   const onDeleteConfirmed = useCallback(

      () => {
         if (!raProfile) return;
         dispatch(raProfilesActions.deleteRaProfile({ uuid: raProfile.uuid }));
      },
      [dispatch, raProfile]

   )


   const onDeactivateAcmeConfirmed = useCallback(

      () => {
         if (!raProfile) return;
         dispatch(raProfilesActions.deactivateAcme({ uuid: raProfile.uuid }));
         setConfirmDeactivateAcme(false);
      },
      [dispatch, raProfile]

   )


   const openAcmeActivationDialog = useCallback(

      () => {
         setActivateAcmeDialog(true);
      },
      []

   )


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: raProfile?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(raProfile?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [raProfile, onEditClick, onDisableClick, onEnableClick]
   );


   const raProfileTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               RA Profile <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]
   );


   const availableClients: { value: string; label: string; }[] = useMemo(

      () =>

         !raProfileAuthorizedClientUuids

            ?
            [] :
            clients.filter(
               client => !raProfileAuthorizedClientUuids.some(authorizedClientUuid => client.uuid === authorizedClientUuid)
            ).sort(
               (a, b) => a.name.localeCompare(b.name)
            ).map(
               client => (
                  { value: client.uuid, label: client.name }
               )
            ),

      [clients, raProfileAuthorizedClientUuids]

   );


   useEffect(

      () => {
         if (!availableClients || availableClients.length === 0) {
            setClientToAuthorize(null);
            return;
         }
         setClientToAuthorize(availableClients[0]);
      },
      [availableClients, setClientToAuthorize]

   )


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

      () => !raProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", raProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", raProfile.name]
         },
         {
            id: "description",
            columns: ["Description", raProfile.description || ""]
         },
         {
            id: "enabled",
            columns: ["Enabled", <StatusBadge enabled={raProfile!.enabled} />,
            ]
         },
         {
            id: "authorityUuid",
            columns: ["Authority Instance UUID", raProfile.authorityInstanceUuid]
         },
         {
            id: "authorityName",
            columns: ["Authority Instance Name", raProfile.authorityInstanceName]
         }

      ],
      [raProfile]

   )


   const authorizedClientsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Client Name",
            sortable: true,
            sort: "asc",
            width: "auto"
         },
         {
            id: "dn",
            content: "Client DN",
            sortable: true,
            width: "auto"
         },
         {
            id: "status",
            content: "Status",
            sortable: true,
            align: "center",
            width: "0"
         },
         {
            id: "actions",
            content: "Actions",
            align: "center",
            width: "0"
         },
      ],
      []

   );


   const authorizedClientsData: TableDataRow[] = useMemo(

      () => !raProfileAuthorizedClientUuids || !clients || raProfileAuthorizedClientUuids.length === 0 || clients.length === 0 || !raProfile
         ?
         []
         :
         raProfileAuthorizedClientUuids.map(

            uuid => {

               const client = clients.find(c => c.uuid === uuid);

               return ({
                  id: client!.uuid,
                  columns: [

                     <Link to={`../../clients/detail/${client!.uuid}`}>{client!.name}</Link>,

                     client!.certificate.subjectDn,

                     <StatusBadge enabled={client!.enabled} />,

                     <Button
                        className="btn btn-link p-0"
                        color="white"
                        data-placement="right"
                        data-for={client?.name}
                        data-tip
                        onClick={() => {
                           dispatch(clientActions.unauthorizeClient({ clientUuid: client!.uuid, raProfile }))
                        }}
                     >
                        <i className="fa fa-trash" style={{ color: "red" }} />
                        <ToolTip message={`Unauthorize ${client?.name}`} id={client!.name} place="right" />
                     </Button>

                  ]
               })

            }

         ),
      [dispatch, clients, raProfileAuthorizedClientUuids, raProfile]

   );


   // this is helper to prevent "blinking" of the table when the data is being fetched
   useEffect(

      () => {
         if (!isFetchingAuthorizedClients) setAuthorizedClientsDataState(authorizedClientsData);
      },
      [isFetchingAuthorizedClients, authorizedClientsData]

   )


   const acmeProfileHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "",
         },
         {
            id: "value",
            content: "",
         },
      ],
      []

   )


   const acmeProfileData: TableDataRow[] = useMemo(

      () => !acmeDetails ? [] : [
         {
            id: "uuid",
            columns: [
               "UUID",
               acmeDetails.uuid || "",
            ]
         },
         {
            id: "name",
            columns: [
               "Name",
               acmeDetails.name || "",
            ]
         },
         {
            id: "Directory URL",
            columns: [
               "Directory URL",
               acmeDetails.directoryUrl || "",
            ]
         }
      ],

      [acmeDetails]

   )


   const availableProtocolsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Protocol name",
            sortable: true,
            width: "10%",
            sort: "asc"
         },
         {
            id: "status",
            content: "Status",
            sortable: true,
            align: "center",
            width: "10%"
         },
         {
            id: "actions",
            content: "Actions",
            align: "center",
            width: "10%"
         },
      ],
      []

   );


   const availableProtocolsData: TableDataRow[] = useMemo(

      () => [
         {
            id: "acme",
            columns: [
               "ACME",
               <StatusBadge enabled={acmeDetails ? acmeDetails.acmeAvailable ? true : false : undefined} />,
               <ProgressButton
                  className="btn btn-primary btn-sm"
                  type="button"
                  title={acmeDetails?.acmeAvailable ? "Deactivate" : "Activate"}
                  inProgressTitle={acmeDetails?.acmeAvailable ? "Deactivating..." : "Activating..."}
                  inProgress={isActivatingAcme || isDeactivatingAcme}
                  onClick={
                     () => acmeDetails?.acmeAvailable
                        ?
                        setConfirmDeactivateAcme(true)
                        :
                        openAcmeActivationDialog()
                  }
               />

            ],
            detailColumns: [
               <></>,
               <></>,
               <></>,

               !acmeDetails || !acmeDetails.acmeAvailable ? <>ACME is not active</> :

                  <>
                     <b>Protocol settings</b><br /><br />
                     <CustomTable
                        hasHeader={false}
                        headers={acmeProfileHeaders}
                        data={acmeProfileData}
                     />

                     {acmeDetails && acmeDetails.issueCertificateAttributes && acmeDetails.issueCertificateAttributes.length > 0 ? (
                        <>
                           <b>Settings for certificate issuing</b><br /><br />
                           <AttributeViewer hasHeader={false} attributes={acmeDetails?.issueCertificateAttributes} />
                        </>
                     ) : <></>}

                     {acmeDetails && acmeDetails.revokeCertificateAttributes && acmeDetails.revokeCertificateAttributes.length > 0 ? (
                        <>
                           <b>Settings for certificate revocation</b><br /><br />
                           <AttributeViewer hasHeader={false} attributes={acmeDetails?.revokeCertificateAttributes} />
                        </>
                     ) : <></>}

                  </>,

            ],
         }
      ],
      [acmeDetails, isActivatingAcme, isDeactivatingAcme, acmeProfileHeaders, acmeProfileData, openAcmeActivationDialog]

   );


   return (

      <Container className="themed-container" fluid>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={raProfileTitle} busy={isBusy}>

                  <br />

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title="Attributes" busy={isBusy || isFetchingAttributes}>

                  {

                     !raProfile || !raProfile.attributes || raProfile.attributes.length === 0 ? <></> : (
                        <>
                           <br />
                           <Label>RA profile Attributes</Label>
                           <AttributeViewer attributes={raProfile?.attributes} />
                        </>
                     )
                  }

               </Widget>

            </Col>

         </Row>


         <Widget title="Authorized Clients" busy={isFetchingAuthorizedClients || isFetchingClients || isAuthorizingClient || isUnauthorizing}>

            <br />

            <CustomTable
               headers={authorizedClientsHeaders}
               data={authorizedClientsDataState}
            />

            <Label>Authorize a client</Label>

            <div style={{ display: "flex" }}>

               <div style={{ flexGrow: 1 }}>
                  <Select
                     maxMenuHeight={140}
                     menuPlacement="auto"
                     value={clientToAuthorize}
                     options={availableClients}
                     placeholder="Select a client to authorize..."
                     onChange={(e: any) => { setClientToAuthorize(e) }}
                  />
               </div>

               &nbsp;

               <ProgressButton
                  title="Authorize"
                  inProgressTitle="Authorizing..."
                  inProgress={isAuthorizingClient}
                  disabled={clientToAuthorize === null}
                  onClick={onAuthorizeClientClick}
               />

            </div>

         </Widget>


         <Widget title="Available protocols" busy={isBusy || isWorkingWithProtocol}>

            <br />

            <CustomTable
               hasDetails={true}
               headers={availableProtocolsHeaders}
               data={availableProtocolsData}
            />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Client"
            body="You are about to delete RA Profiles which may have existing
                  authorizations from clients. If you continue, these authorizations
                  will be deleted as well. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={confirmDeactivateAcme}
            caption="Deactivate ACME"
            body="You are about to deactivate ACME protocol for the RA profile. Is this what you want to do?"
            toggle={() => setConfirmDeactivateAcme(false)}
            buttons={[
               { color: "danger", onClick: onDeactivateAcmeConfirmed, body: "Yes, deactivate" },
               { color: "secondary", onClick: () => setConfirmDeactivateAcme(false), body: "Cancel" },
            ]}
         />


         <Dialog
            isOpen={activateAcmeDialog}
            caption="Activate ACME protocol"
            body={AcmeProtocolActiovationDialogBody({ visible: activateAcmeDialog, onClose: () => setActivateAcmeDialog(false), raProfileUuid: raProfile?.uuid })}
            toggle={() => setActivateAcmeDialog(false)}
            buttons={[]}
         />


      </Container >

   )

}
