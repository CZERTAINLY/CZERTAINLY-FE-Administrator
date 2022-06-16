import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container, Table } from "reactstrap";

import { actions, selectors } from "ducks/connectors";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import { attributeFieldNameTransform } from "models/attributes";
import { FunctionGroupModel } from "models/connectors";
import { inventoryStatus } from "utils/connector";

const { MDBBadge } = require("mdbreact");

function ConnectorList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const connectors = useSelector(selectors.connectors);

   const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isForceDeleting = useSelector(selectors.isBulkForceDeleting);
   const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
   const isBulkAuthorizing = useSelector(selectors.isBulkAuthorizing);


   const isBusy = isFetching || isDeleting || isBulkDeleting || isForceDeleting || isBulkReconnecting || isBulkAuthorizing;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);
   const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);


   useEffect(
      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.listConnectors());
      },
      [dispatch]
   );


   useEffect(
      () => {
         setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);
      },
      [bulkDeleteErrorMessages]
   );


   const onAddClick = useCallback(
      () => {
         history.push(`${path}/add`);
      },
      [history, path]
   );


   const onReconnectClick = useCallback(
      () => {
         dispatch(actions.bulkReconnectConnectors(checkedRows));
      },
      [checkedRows, dispatch]
   );


   const setCheckedRows = useCallback(
      (rows: (string | number)[]) => {
         dispatch(actions.setCheckedRows(rows as string[]));
      },
      [dispatch]
   );


   const onDeleteConfirmed = useCallback(
      () => {
         setConfirmDelete(false);
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkDeleteConnectors(checkedRows));
      },
      [dispatch, checkedRows]
   );


   const onForceDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteConnectors({ uuids: checkedRows }));
      },
      [dispatch, checkedRows]
   );


   const onAuthorizeConfirmed = useCallback(
      () => {
         setConfirmAuthorize(false);
         dispatch(actions.bulkAuthorizeConnectors(checkedRows));
      },
      [dispatch, checkedRows]
   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "plug", disabled: checkedRows.length === 0, tooltip: "Reconnect", onClick: () => { onReconnectClick() } },
         { icon: "check", disabled: checkedRows.length === 0, tooltip: "Authorize", onClick: () => { setConfirmAuthorize(true); } }
      ],
      [checkedRows, onAddClick, onReconnectClick]
   );


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">Connector Store</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const getKinds = useCallback(

      (functionGroups: FunctionGroupModel[]) => {

         return functionGroups.map(

            group => (

               <div key={group.uuid}>

                  {group.kinds.map(

                     kind => (
                        <span key={kind}>
                           <MDBBadge color="secondary" searchvalue={kind}>
                              {kind}
                           </MDBBadge>
                           &nbsp;
                        </span>
                     )

                  )}

               </div>

            )

         )

      },
      []

   );


   const getFunctionGroups = useCallback(

      (functionGroups: FunctionGroupModel[]) => {

         return functionGroups.map(

            group => (

               <div key={group.uuid}>
                  <MDBBadge color="primary" searchvalue={attributeFieldNameTransform[group.name || ""] || group.name}>
                     {attributeFieldNameTransform[group.name || ""] || group.name}
                  </MDBBadge>
               </div>

            )

         )
      },
      []

   );


   const forceDeleteBody = useMemo(

      () => (

         <div>

            <div>Failed to delete {checkedRows.length > 1 ? "Connectors" : "a Connector"}. Please find the details below:</div>

            <Table className="table-hover" size="sm">

               <thead>

                  <tr>
                     <th>
                        <b>Name</b>
                     </th>
                     <th>
                        <b>Dependencies</b>
                     </th>
                  </tr>

               </thead>

               <tbody>

                  {bulkDeleteErrorMessages?.map(
                     message => (
                        <tr>
                           <td>{message.name}</td>
                           <td>{message.message}</td>
                        </tr>
                     )
                  )}

               </tbody>

            </Table >

         </div>

      ),
      [bulkDeleteErrorMessages, checkedRows.length]

   );


   const connectorRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            id: "connectorName",
            width: "15%",
         },
         {
            content: <MDBColumnName columnName="Function Groups" />,
            sortable: true,
            id: "connectorFunctions",
            width: "35%",
         },
         {
            content: <MDBColumnName columnName="Kinds" />,
            sortable: true,
            id: "kinds",
            width: "35%",
         },
         {
            content: <MDBColumnName columnName="URL" />,
            sortable: true,
            id: "connectorUrl",
            width: "30%",
         },
         {
            content: <MDBColumnName columnName="Status" />,
            sortable: true,
            id: "connectorStatus",
            width: "10%",
         },
      ],
      []

   );


   const connectorList: TableDataRow[] = useMemo(

      () => connectors.map(

         connector => {

            const connectorStatus = inventoryStatus(connector.status);

            return {
               id: connector.uuid,
               columns: [
                  <Link to={`${path}/detail/${connector.uuid}`}>{connector.name}</Link>,
                  <>{getFunctionGroups(connector.functionGroups)}</>,
                  <>{getKinds(connector.functionGroups)}</>,
                  <>{connector.url}</>,
                  <MDBBadge color={connectorStatus[1]}>{connectorStatus[0]}</MDBBadge>
               ],
            }
         }

      ),
      [connectors, path, getFunctionGroups, getKinds]

   );


   return (

      <div>
         <Container className="themed-container" fluid>

            <Widget title={title} busy={isBusy}>

               <br />

               <CustomTable
                  headers={connectorRowHeaders}
                  data={connectorList}
                  onCheckedRowsChanged={setCheckedRows}
                  hasCheckboxes={true}
                  hasPagination={true}
                  canSearch={true}
               />

            </Widget>

            <Dialog
               isOpen={confirmDelete}
               caption={`Delete ${checkedRows.length > 1 ? "Connectors" : "a Connector"}`}
               body={`You are about to delete ${checkedRows.length > 1 ? "Connectors" : "a Connector"}. Is this what you want to do?}`}
               toggle={() => setConfirmDelete(false)}
               buttons={[
                  { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                  { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
               ]}
            />

            <Dialog
               isOpen={confirmAuthorize}
               caption={`Authorize ${checkedRows.length > 1 ? "Connectors" : "a Connector"}`}
               body={`You are about to authorize a ${checkedRows.length > 1 ? "Connectors" : "a Connector"}. Is this what you want to do?`}
               toggle={() => setConfirmAuthorize(false)}
               buttons={[
                  { color: "danger", onClick: onAuthorizeConfirmed, body: "Yes, authorize" },
                  { color: "secondary", onClick: () => setConfirmAuthorize(false), body: "Cancel" },
               ]}
            />

            <Dialog
               isOpen={confirmForceDelete}
               caption={`Force Delete ${checkedRows.length > 1 ? "Connectors" : "a Connector"}`}
               body={forceDeleteBody}
               toggle={() => setConfirmForceDelete(false)}
               buttons={[
                  { color: "danger", onClick: onForceDeleteConfirmed, body: "Force delete" },
                  { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
               ]}
            />

         </Container>
      </div>
   );
}

export default ConnectorList;
