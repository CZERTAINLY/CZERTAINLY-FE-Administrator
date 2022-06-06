import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container, Table } from "reactstrap";

import { actions, selectors } from "ducks/connectors";

import Widget from "components/Widget";
import MDBColumnName from "components/MDBColumnName";

import { inventoryStatus } from "utils/connector";
import CustomTable from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { attributeFieldNameTransform } from "models/attributes";
import { Dialog } from "components/Dialog";
import { FunctionGroupModel } from "models/connectors";

const { MDBBadge } = require("mdbreact");

function ConnectorList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const connectors = useSelector(selectors.connectors);
   const deleteErrorMessages = useSelector(selectors.deleteErrorMessages);

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


   useEffect(() => {
      dispatch(actions.clearDeleteErrorMessages());
      dispatch(actions.listConnectors());
   }, [dispatch]);


   useEffect(() => {
      setConfirmForceDelete(deleteErrorMessages.length > 0);
   }, [deleteErrorMessages]);


   const onAddClick = useCallback(() => {
      history.push(`${""}/add`);
   }, [history]);


   const onReconnectClick = useCallback(
      () => {
         dispatch(actions.bulkReconnectConnectors(checkedRows));
      },
      [checkedRows, dispatch]
   );


   const setCheckedRows = useCallback(
      (rows: string[]) => { dispatch(actions.setCheckedRows(rows)); },
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
         dispatch(actions.bulkForceDeleteConnectors(checkedRows));
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


   const buttons: WidgetButtonProps[] = [
      { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
      { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      { icon: "plug", disabled: checkedRows.length === 0, tooltip: "Reconnect", onClick: () => { onReconnectClick() } },
      { icon: "check", disabled: checkedRows.length === 0, tooltip: "Authorize", onClick: () => { setConfirmAuthorize(true); } }
   ]


   const title = (

      <div>

         <div className="pull-right mt-n-xs">
            <WidgetButtons buttons={buttons} />
         </div>

         <h5 className="mt-0">
            <span className="fw-semi-bold">Connector Store</span>
         </h5>

      </div>

   );


   const getKinds = (functionGroups: FunctionGroupModel[]) => {

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

   };


   const forceDeleteBody = (

      <div>

         <div>Failed to delete some of the connectors. Please find the details below:</div>

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

               {deleteErrorMessages?.map(
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

   )


   const getFunctionGroups = (functionGroups: FunctionGroupModel[]) => {

      return functionGroups.map(

         group => (

            <div key={group.uuid}>
               <MDBBadge color="primary" searchvalue={attributeFieldNameTransform[group.name || ""] || group.name}>
                  {attributeFieldNameTransform[group.name || ""] || group.name}
               </MDBBadge>
            </div>

         )

      )
   }


   const connectorList = () => {
      let rows: any = [];
      for (let connector of connectors) {

         let connectorStatus = inventoryStatus(connector.status || "");
         let column: any = {};

         column["name"] = {
            content: connector.name,
            styledContent: (
               <Link to={`${path}/detail/${connector.uuid}`}>{connector.name}</Link>
            ),
            lineBreak: true,

         };

         column["functions"] = {
            styledContent: getFunctionGroups(connector.functionGroups || []),
            lineBreak: true,
         };

         column["kinds"] = {
            styledContent: getKinds(connector.functionGroups || []),
            lineBreak: true,
         };

         column["url"] = {
            content: connector.url,
            lineBreak: true,
         };

         column["status"] = {
            content: connector.status,
            styledContent: (
               <MDBBadge color={connectorStatus[1]}>{connectorStatus[0]}</MDBBadge>
            ),
            lineBreak: true,
         };

         rows.push({
            id: connector.uuid,
            column: column,
            data: connector,
         });

      }

      return rows;
   };

   const connectorRowHeaders = [
      {
         styledContent: <MDBColumnName columnName="Name" />,
         content: "name",
         sort: false,
         id: "connectorName",
         width: "15%",
      },
      {
         styledContent: <MDBColumnName columnName="Function Groups" />,
         content: "functions",
         sort: false,
         id: "connectorFunctions",
         width: "35%",
      },
      {
         styledContent: <MDBColumnName columnName="Kinds" />,
         content: "kinds",
         sort: false,
         id: "kinds",
         width: "35%",
      },
      {
         styledContent: <MDBColumnName columnName="URL" />,
         content: "url",
         sort: false,
         id: "connectorUrl",
         width: "30%",
      },
      {
         styledContent: <MDBColumnName columnName="Status" />,
         content: "status",
         sort: false,
         id: "connectorStatus",
         width: "10%",
      },
   ];

   return (

      <div>
         <Container className="themed-container" fluid>

            <Widget title={title} busy={isBusy}>

               <br />

               <CustomTable
                  checkedRows={checkedRows}
                  onCheckedRowsChanged={setCheckedRows}
                  data={connectors}
                  headers={connectorRowHeaders}
                  rows={connectorList()}
               />

            </Widget>

            <Dialog
               isOpen={confirmDelete}
               caption="Delete Connector"
               body="You are about to delete connector/s. Is this what you want to do?"
               toggle={() => setConfirmDelete(false)}
               buttons={[
                  { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                  { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
               ]}
            />

            <Dialog
               isOpen={confirmAuthorize}
               caption="Authorize Connector"
               body="You are about to authorize a connector/s. Is this what you want to do?"
               toggle={() => setConfirmAuthorize(false)}
               buttons={[
                  { color: "danger", onClick: onAuthorizeConfirmed, body: "Yes, authorize" },
                  { color: "secondary", onClick: () => setConfirmAuthorize(false), body: "Cancel" },
               ]}
            />

            <Dialog
               isOpen={confirmForceDelete}
               caption="Force Delete Connector"
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
