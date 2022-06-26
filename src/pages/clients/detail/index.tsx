import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col, Button, Label, ButtonGroup } from "reactstrap";
import Select from "react-select";

import { actions as clientActions, selectors as clientSelectors } from "ducks/clients";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import StatusBadge from "components/StatusBadge";

import CertificateAttributes from "components/CertificateAttributes";
import ToolTip from "components/ToolTip";
import ProgressButton from "components/ProgressButton";

export default function ClientDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const client = useSelector(clientSelectors.client);
   const authorizedProfiles = useSelector(clientSelectors.authorizedProfiles);
   const raProfiles = useSelector(raProfileSelectors.raProfiles);

   const isFetchingDetail = useSelector(clientSelectors.isFetchingDetail);
   const isFetchingRaProfiles = useSelector(raProfileSelectors.isFetchingList);
   const isDisabling = useSelector(clientSelectors.isDisabling);
   const isEnabling = useSelector(clientSelectors.isEnabling);
   const isFetchingAuthorizedProfiles = useSelector(clientSelectors.isFetchingAuthorizedProfiles);
   const isAuthorizing = useSelector(clientSelectors.isAuthorizing);
   const isUnauthorizing = useSelector(clientSelectors.isUnauthorizing);

   const [selectedProfile, setSelectedProfile] = useState<{ value: string; label: string; } | null>(null);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(
      () => {
         if (!params.id) return;
         dispatch(clientActions.getClientDetail(params.id));
         dispatch(clientActions.getAuthorizedProfiles(params.id));
         dispatch(raProfileActions.listRaProfiles());
      },
      [params.id, dispatch]
   );


   const onEditClick = useCallback(
      () => {
         if (!client) return;
         history.push(`../../clients/edit/${client?.uuid}`);
      },
      [client, history]
   )


   const onEnableClick = useCallback(
      () => {
         if (!client) return;
         dispatch(clientActions.enableClient(client.uuid));
      },
      [client, dispatch]
   )


   const onDisableClick = useCallback(
      () => {
         if (!client) return;
         dispatch(clientActions.disableClient(client.uuid));
      }
      , [client, dispatch]
   )


   const onAuthorizeRaProfileClick = useCallback(
      () => {
         if (!client || !selectedProfile) return;
         const raProfile = raProfiles.find(p => p.uuid === selectedProfile.value);
         if (!raProfile) return;
         dispatch(clientActions.authorizeClient({ clientUuid: client.uuid, raProfile }));
      },
      [client, selectedProfile, dispatch, raProfiles]
   )


   const onDeleteConfirmed = useCallback(
      () => {
         setConfirmDelete(false);
         if (!client) return;
         dispatch(clientActions.deleteClient(client.uuid));
      },
      [dispatch, client]
   )


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: client?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(client?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [client, onEditClick, onDisableClick, onEnableClick]
   );


   const attributesTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Client <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]
   );


   const certificateTitle = useMemo(
      () => (
         <h5>
            Client Certificate <span className="fw-semi-bold">Details</span>
         </h5>
      ),
      []
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

      () => !client ? [] : [
         {
            id: "uuid",
            columns: ["UUID", client.uuid],
         },
         {
            id: "name",
            columns: ["Name", client.name],
         },
         {
            id: "description",
            columns: ["Description", client.description],
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={client.enabled} />],
         }
      ],
      [client]

   )


   const authorizedProfilesHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
            sortable: true,
            sort: "asc",
            width: "0%",
         },
         {
            id: "description",
            content: "Description",
         },
         {
            id: "status",
            content: "Status",
            align: "center",
            width: "0"
         },
         {
            id: "actions",
            content: "Actions",
            align: "center",
            width: "0"
         }
      ],
      []
   );


   const authorizedProfilesData: TableDataRow[] = useMemo(

      () => !authorizedProfiles ? [] : authorizedProfiles.map(

         authorizedProfile => ({
            id: authorizedProfile.uuid,
            columns: [
               authorizedProfile.name,
               authorizedProfile.description,
               <StatusBadge enabled={authorizedProfile.enabled} />,
               <Button
                  className="btn btn-link p-0"
                  color="white"
                  data-placement="right"
                  data-for={authorizedProfile?.name}
                  data-tip
                  onClick={() => {
                     dispatch(clientActions.unauthorizeClient({ clientUuid: client!.uuid, raProfile: authorizedProfile }))
                  }
                  }
               >
                  <i className="fa fa-trash" style={{ color: "red" }} />
                  <ToolTip message={`Unauthorize ${authorizedProfile?.name}`} id={authorizedProfile?.name} place="right" />
               </Button>

            ]
         })
      ),
      [authorizedProfiles, dispatch, client]
   )


   const availableProfiles: { value: string; label: string; }[] = useMemo(

      () => raProfiles.filter(
         raProfile => !authorizedProfiles.some(authorizedProfile => authorizedProfile.uuid === raProfile.uuid)
      ).sort(
         (a, b) => a.name.localeCompare(b.name)
      ).map(
         raProfile => (
            { value: raProfile.uuid, label: raProfile.name }
         )
      ),
      [authorizedProfiles, raProfiles]

   );


   useEffect(
      () => {
         if (!availableProfiles || availableProfiles.length === 0) {
            setSelectedProfile(null);
            return;
         }
         setSelectedProfile(availableProfiles[0]);
      },
      [availableProfiles, setSelectedProfile]
   )


   return (

      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>

               <Widget title={attributesTitle} busy={isFetchingDetail || isEnabling || isDisabling}>

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title={certificateTitle} busy={isFetchingDetail}>
                  <CertificateAttributes certificate={client?.certificate} />
               </Widget>

            </Col>
         </Row>

         <Widget title="Authorized RA Profiles" busy={isFetchingAuthorizedProfiles || isAuthorizing || isUnauthorizing}>

            <CustomTable
               headers={authorizedProfilesHeaders}
               data={authorizedProfilesData}
            />

         </Widget>

         <Widget title="Authorize RA Profile" busy={isFetchingRaProfiles || isUnauthorizing}>

            <Label for="profileselect">Select RA Profile to Authorize</Label>

            <Select
               maxMenuHeight={140}
               name="profileselect"
               options={availableProfiles}
               value={selectedProfile}
               onChange={option => setSelectedProfile(option || null) }
            />

            <br />

            <div className="d-flex justify-content-end">

               <ButtonGroup>

                  <ProgressButton
                     title="Authorize"
                     inProgressTitle="Authorizing..."
                     inProgress={isAuthorizing}
                     disabled={!availableProfiles.length || !selectedProfile}
                     onClick={onAuthorizeRaProfileClick}
                  />

               </ButtonGroup>

            </div>

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Client"
            body="You are about to delete a client. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
