import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/clients";

import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import { Dialog } from "components/Dialog";

export default function ClientList() {

   const history = useHistory();

   const checkedRows = useSelector(selectors.checkedRows);
   const clients = useSelector(selectors.clients);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isUpdating = useSelector(selectors.isUpdating);
   const isEnabling = useSelector(selectors.isEnabling);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isDisabling = useSelector(selectors.isDisabling);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isEnabling || isBulkEnabling || isDisabling || isBulkDisabling;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const dispatch = useDispatch();
   const { path } = useRouteMatch();

   useEffect(
      () => {
         dispatch(actions.setCheckedRows([]));
         dispatch(actions.listClients());
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const onAddClick = useCallback(
      () => { history.push("/app/clients/add"); },
      [history]
   );

   const onEnableClick = useCallback(
      () => { dispatch(actions.bulkEnableClients(checkedRows)); },
      [checkedRows, dispatch]
   );

   const onDisableClick = useCallback(
      () => { dispatch(actions.bulkDisableClients(checkedRows)); },
      [checkedRows, dispatch]
   );

   const onDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.bulkDeleteClients(checkedRows));
         setConfirmDelete(false);
      },
      [checkedRows, dispatch]
   );

   const setCheckedRows = useCallback(
      (rows: (string | number)[]) => { dispatch(actions.setCheckedRows(rows as string[])); },
      [dispatch]
   );


   const buttons: WidgetButtonProps[] = [
      { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
      { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      { icon: "check", disabled: checkedRows.length === 0, tooltip: "Enable", onClick: () => { onEnableClick() } },
      { icon: "times", disabled: checkedRows.length === 0, tooltip: "Disable", onClick: () => { onDisableClick() } }
   ]

   const title = (
      <div>

         <div className="pull-right mt-n-xs">
            <WidgetButtons buttons={buttons} />
         </div>


         <h5 className="mt-0">
            List of <span className="fw-semi-bold">Clients</span>
         </h5>

      </div>
   );


   const clientTableHeader: TableHeader[] = [
      {
         content: <MDBColumnName columnName="Name" />,
         sortable: true,
         sort: "asc",
         id: "clientName",
         width: "10%",
      },
      {
         content: <MDBColumnName columnName="Serial Number" />,
         sortable: false,
         id: "clientSerialNumber",
         width: "25%",
      },
      {
         content: <MDBColumnName columnName="Client DN" />,
         sortable: false,
         id: "clientAdminDn",
         width: "35%",
      },
      {
         content: <MDBColumnName columnName="Status" />,
         sortable: true,
         id: "clientStatus",
         width: "10%",
      },
   ];


   const clientTableData: TableDataRow[] = clients.map(

      client => ({

         id: client.uuid,

         columns: [

            <Link to={`${path}/detail/${client.uuid}`}>{client.name}</Link>,

            client.serialNumber,

            client?.certificate?.subjectDn,

            <StatusBadge enabled={client.enabled} />,

         ]

      })

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={clientTableHeader}
               data={clientTableData}
               onCheckedRowsChanged={setCheckedRows}
            />
         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Client"

            body="You are about deleting a client with existing authorizations to RA
            Profiles. If you continue, these authorizations will be deleted as
            well. Is this what you want to do?"

            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );
}
