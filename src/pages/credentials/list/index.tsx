import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container, Table } from "reactstrap";

import { actions, selectors } from "ducks/credentials";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";

import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

const { MDBBadge } = require("mdbreact");

function CredentialList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const credentials = useSelector(selectors.credentials);

   const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleteing);
   const isForceBulkDeleting = useSelector(selectors.isForceBulkDeleting);

   const isBusy = isFetching || isDeleting || isBulkDeleting || isForceBulkDeleting;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);


   useEffect(
      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.listCredentials());
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


   const onDeleteConfirmed = useCallback(
      () => {
         setConfirmDelete(false);
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkDeleteCredentials({ uuids: checkedRows }));
      },
      [dispatch, checkedRows]
   );


   const onForceDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteCredentials({ uuids: checkedRows }));
      },
      [dispatch, checkedRows]
   );


   const setCheckedRows = useCallback(
      (rows: (string | number)[]) => {
         dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
      },
      [dispatch]
   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [checkedRows, onAddClick]
   );


   const forceDeleteBody = useMemo(

      () => (

         <div>

            <div>Failed to delete {checkedRows.length > 1 ? "Credentials" : "a Credential"}. Please find the details below:</div>

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


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               <span className="fw-semi-bold">Credential Store</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const credentialRowHeaders: TableHeader[] = useMemo(

      () => [
         {
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            id: "adminName",
            width: "15%",
         },
         {
            content: <MDBColumnName columnName="Kind" />,
            sortable: true,
            id: "kind",
            width: "20%",
            align: "center"
         },
         {
            content: <MDBColumnName columnName="Credential Provider" />,
            sortable: true,
            id: "credentialProviderName",
            width: "25%",
            align: "center"
         },
      ],
      []

   );


   const credenitalsData: TableDataRow[] = useMemo(

      () => credentials.map(

         credential => ({

            id: credential.uuid,
            columns: [

               <Link to={`${path}/detail/${credential.uuid}`}>{credential.name}</Link>,

               <MDBBadge color="primary">{credential.kind}</MDBBadge>,

               <MDBBadge color="info">{credential.connectorName}</MDBBadge>

            ]

         })

      ),

      [credentials, path]

   );


   return (
      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />

            <CustomTable
               headers={credentialRowHeaders}
               data={credenitalsData}
               onCheckedRowsChanged={setCheckedRows}
               hasCheckboxes={true}
               hasPagination={true}
               canSearch={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Credentials" : "a Connector"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Credentials" : "a Credential"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
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
   );
}

export default CredentialList;
