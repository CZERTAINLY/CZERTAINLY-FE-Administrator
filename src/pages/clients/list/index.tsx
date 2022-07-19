import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/clients";

import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

export default function ClientList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const clients = useSelector(selectors.clients);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isDisabling = useSelector(selectors.isDisabling);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isDeleting || isBulkDeleting || isBulkEnabling || isDisabling || isBulkDisabling;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.listClients());

      },

      [dispatch]
   );


   const onAddClick = useCallback(

      () => {

         history.push("/app/clients/add");

      },
      [history]

   );


   const onEnableClick = useCallback(

      () => {

         dispatch(actions.bulkEnableClients({ uuids: checkedRows }));

      },
      [checkedRows, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         dispatch(actions.bulkDisableClients({ uuids: checkedRows }));

      },
      [checkedRows, dispatch]

   );


   const onDeleteClick = useCallback(

      () => {

         setConfirmDelete(true);

      },
      []

   );


   const onDeleteConfirmed = useCallback(

      () => {

         dispatch(actions.bulkDeleteClients({ uuids: checkedRows }));
         setConfirmDelete(false);

      },
      [checkedRows, dispatch]

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
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { onDeleteClick() } },
         { icon: "check", disabled: checkedRows.length === 0, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: checkedRows.length === 0, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [checkedRows, onAddClick, onDeleteClick, onEnableClick, onDisableClick]
   );


   const title = useMemo(

      () => (
         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>


            <h5 className="mt-0">
               List of <span className="fw-semi-bold">Clients</span>
            </h5>

         </div>
      ),
      [buttons]

   );


   const clientTableHeader: TableHeader[] = useMemo(

      () => [
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
         },
         {
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            id: "clientStatus",
            width: "7%",
         },
      ],
      []

   );


   const clientTableData: TableDataRow[] = useMemo(

      () => clients.map(

         client => ({

            id: client.uuid,

            columns: [

               <Link to={`${path}/detail/${client.uuid}`}>{client.name}</Link>,

               client.serialNumber,

               client?.certificate?.subjectDn,

               <StatusBadge enabled={client.enabled} />,

            ]

         })

      ),
      [clients, path]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={clientTableHeader}
               data={clientTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
            />
         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Clients" : "a Client"}`}
            body={`You are about deleting ${checkedRows.length > 1 ? "Clients" : "a Client"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );
}

