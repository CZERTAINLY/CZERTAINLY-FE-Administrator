import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/administrators";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

export default function AdministratorsList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const administrators = useSelector(selectors.administrators);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isUpdating = useSelector(selectors.isUpdating);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isBulkEnabling || isBulkDisabling;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   useEffect(
      () => {
         dispatch(actions.setCheckedRows([]));
         dispatch(actions.listAdmins());
      },
      [dispatch]
   );


   const onAddClick = useCallback(
      () => {
         history.push(`${path}/add`);
      },
      [history, path]
   );


   const onEnableClick = useCallback(
      () => {
         dispatch(actions.bulkEnableAdmins(checkedRows));
      },
      [checkedRows, dispatch]
   );


   const onDisableClick = useCallback(
      () => {
         dispatch(actions.bulkDisableAdmins(checkedRows));
      },
      [checkedRows, dispatch]
   );


   const onDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.bulkDeleteAdmins(checkedRows));
         setConfirmDelete(false);
      },
      [checkedRows, dispatch]
   );


   const setCheckedRows = useCallback(
      (rows: (string | number)[]) => {
         dispatch(actions.setCheckedRows(rows as string[]));
      },
      [dispatch]
   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: checkedRows.length === 0, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: checkedRows.length === 0, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [checkedRows, onAddClick, onEnableClick, onDisableClick]
   );


   const title = useMemo(
      () => (
         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               List of <span className="fw-semi-bold">Administrators</span>
            </h5>

         </div>
      ),
      [buttons]
   );


   const adminTableHeader: TableHeader[] = useMemo(
      () => [
         {
            id: "adminUsername",
            content: <MDBColumnName columnName="Username" />,
            sortable: true,
            sort: "asc",
            width: "10%",
         },
         {
            id: "adminName",
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            width: "5%",
         },
         {
            id: "adminSerialNumber",
            content: <MDBColumnName columnName="Serial Number" />,
            sortable: true,
            width: "15%",
         },
         {
            id: "adminAdminDn",
            content: <MDBColumnName columnName="Admin DN" />,
            sortable: true,
         },
         {
            id: "adminSuperAdmin",
            content: <MDBColumnName columnName="Super Admin" />,
            align: "center",
            sortable: true,
            width: "11%",
         },
         {
            id: "adminStatus",
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            width: "7%",
         },
      ],
      []
   );


   const adminTableData: TableDataRow[] = useMemo(

      () => administrators.map(

         administrator => ({

            id: administrator.uuid,

            columns: [

               <Link to={`${path}/detail/${administrator.uuid}`}>{administrator.username}</Link>,

               administrator.name,

               administrator.serialNumber,

               administrator.certificate.subjectDn,

               <StatusCircle status={administrator.role === "superAdministrator"} />,

               <StatusBadge enabled={administrator.enabled} />,

            ]
         })
      ),
      [administrators, path]
   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={adminTableHeader}
               data={adminTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Administrators" : "an Administrator"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Administrators" : "an Administrator"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
