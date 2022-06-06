import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/administrators";


import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import CustomTable, { CustomTableHeaderColumn } from "components/CustomTable";
import { Dialog } from "components/Dialog";

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
   const isEnabling = useSelector(selectors.isEnabling);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isDisabling = useSelector(selectors.isDisabling);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isEnabling || isBulkEnabling || isDisabling || isBulkDisabling;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   useEffect(
      () => {
         dispatch(actions.setCheckedRows([]));
         dispatch(actions.listAdmins());
      },
      [dispatch]
   );

   const onAddClick = useCallback(() => {
      history.push(`${path}/add`);
   }, [history, path]);

   const onEnableClick = useCallback(() => {
      dispatch(actions.bulkEnableAdmins(checkedRows));
   }, [checkedRows, dispatch]);

   const onDisableClick = useCallback(() => {
      dispatch(actions.bulkDisableAdmins(checkedRows));
   }, [checkedRows, dispatch]);

   const onDeleteConfirmed = useCallback(() => {
      dispatch(actions.bulkDeleteAdmins(checkedRows));
      setConfirmDelete(false);
   }, [checkedRows, dispatch]);

   const setCheckedRows = useCallback((rows: string[]) => {
      dispatch(actions.setCheckedRows(rows));
   }, [dispatch]);

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
            List of <span className="fw-semi-bold">Administrators</span>
         </h5>

      </div>
   );

   const adminTableData = () => {

      return administrators.map(

         administrator => {

            let column: any = {};

            column["name"] = {
               content: administrator.name,
               styledContent: <Link to={`${path}/detail/${administrator.uuid}`}>{administrator.name}</Link>,
               lineBreak: true,
            };

            column["username"] = {
               content: administrator.username,
               lineBreak: true,
            };

            column["serialNumber"] = {
               content: administrator.serialNumber,
               lineBreak: true,
            };

            column["adminDn"] = {
               content: administrator.certificate.subjectDn,
               lineBreak: true,
            };

            column["superAdmin"] = {
               content: administrator.role === "superAdministrator" ? "Yes" : "No",
               styledContent: <StatusCircle status={administrator.role === "superAdministrator"} />,
               lineBreak: true,
            };

            column["status"] = {
               content: administrator.enabled ? "enabled" : "disabled",
               styledContent: <StatusBadge enabled={administrator.enabled} />,
               lineBreak: true,
            };

            return {
               id: administrator.uuid,
               column: column,
               data: administrator,
            };

         }

      );

   }


   const adminTableHeader: CustomTableHeaderColumn[] = [
      {
         styledContent: <MDBColumnName columnName="Name" />,
         content: "name",
         sort: false,
         id: "adminName",
         width: "5%",
      },
      {
         styledContent: <MDBColumnName columnName="Username" />,
         content: "username",
         sort: false,
         id: "adminUsername",
         width: "10%",
      },
      {
         styledContent: <MDBColumnName columnName="Serial Number" />,
         content: "serialNumber",
         sort: false,
         id: "adminSerialNumber",
         width: "15%",
      },
      {
         styledContent: <MDBColumnName columnName="Admin DN" />,
         content: "adminDn",
         sort: false,
         id: "adminAdminDn",
         width: "35%",
      },
      {
         styledContent: <MDBColumnName columnName="Super Admin" />,
         content: "superAdmin",
         sort: false,
         id: "adminSuperAdmin",
         width: "5%",
      },
      {
         styledContent: <MDBColumnName columnName="Status" />,
         content: "status",
         sort: false,
         id: "adminStatus",
         width: "10%",
      },
   ];


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               checkedRows={checkedRows}
               onCheckedRowsChanged={setCheckedRows}
               data={administrators}
               headers={adminTableHeader}
               rows={adminTableData()}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Administrator"
            body="You are about to delete an Administrator. Is this what you want to do?"
            toggle={ () => setConfirmDelete(false) }
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
