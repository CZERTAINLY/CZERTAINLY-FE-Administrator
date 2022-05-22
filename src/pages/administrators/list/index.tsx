import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";

import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { actions, selectors } from "ducks/administrators";
import MDBColumnName from "components/MDBColumnName";
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";

import CustomTable, { CustomTableHeader } from "components/CustomTable";

function AdministratorsList() {

   const history = useHistory();

   const checkedRows = useSelector(selectors.selectCheckedRows);
   const administrators = useSelector(selectors.selectAdministrators);
   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isBulkDeleting = useSelector(selectors.isBulkDeleting);
   const isUpdating = useSelector(selectors.isUpdating);
   const isEnabling = useSelector(selectors.isEnabling);
   const isBulkEnabling = useSelector(selectors.isBulkEnabling);
   const isDisabling = useSelector(selectors.isDisabing);
   const isBulkDisabling = useSelector(selectors.isBulkDisabling);

   const isBusy = isFetching || isDeleting || isUpdating || isBulkDeleting || isEnabling || isBulkEnabling || isDisabling || isBulkDisabling;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const dispatch = useDispatch();
   const { path } = useRouteMatch();

   useEffect(
      () => {
         dispatch(actions.setCheckedRows([]));
         dispatch(actions.listAdmins());
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const onAddClick = () => {
      history.push("/app/administrators/add");
   }

   const onEnableClick = () => {
      dispatch(actions.bulkEnableAdmin(checkedRows));
   };

   const onDisableClick = () => {
      dispatch(actions.bulkDisableAdmin(checkedRows));
   };

   const onDeleteConfirmed = () => {
      dispatch(actions.bulkDeleteAdmin(checkedRows));
      setConfirmDelete(false);
   };

   const setCheckedRows = (rows: string[]) => {
      dispatch(actions.setCheckedRows(rows));
   }

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

      let rows: any = [];

      for (let administrator of administrators) {

         let column: any = {};

         column["name"] = {
            content: administrator.name,
            styledContent: (
               <Link to={`${path}/detail/${administrator.uuid}`}>
                  {administrator.name}
               </Link>
            ),
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
         rows.push({
            id: administrator.uuid,
            column: column,
            data: administrator,
         });
      }

      return rows;
   };


   const adminTableHeader: CustomTableHeader[] = [
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
               checkedRowsFunction={setCheckedRows}
               data={administrators}
               headers={adminTableHeader}
               rows={adminTableData()}
            />

         </Widget>

         <MDBModal overflowScroll={false} isOpen={confirmDelete} toggle={() => setConfirmDelete(false)}>

            <MDBModalHeader toggle={() => setConfirmDelete(false)}>
               Delete Credential
            </MDBModalHeader>

            <MDBModalBody>
               You are about to delete an Administrator. Is this what you want to do?
            </MDBModalBody>

            <MDBModalFooter>

               <Button color="danger" onClick={onDeleteConfirmed}>
                  Yes, delete
               </Button>

               <Button color="secondary" onClick={() => setConfirmDelete(false)}>
                  Cancel
               </Button>

            </MDBModalFooter>

         </MDBModal>

      </Container>
   );

}

export default AdministratorsList;
