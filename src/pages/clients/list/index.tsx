import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";

import { actions, selectors } from "ducks/clients";

import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";

import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import CustomTable, { CustomTableHeaderColumn } from "components/CustomTable";

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

   const onAddClick = useCallback(() => {
      history.push("/app/clients/add");
   }, [history]);

   const onEnableClick = useCallback(() => {
      dispatch(actions.bulkEnableClients(checkedRows));
   }, [checkedRows, dispatch]);

   const onDisableClick = useCallback(() => {
      dispatch(actions.bulkDisableClients(checkedRows));
   }, [checkedRows, dispatch]);

   const onDeleteConfirmed = useCallback(() => {
      dispatch(actions.bulkDeleteClients(checkedRows));
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
            List of <span className="fw-semi-bold">Clients</span>
         </h5>

      </div>
   );

   const clientTableData = () => {

      return clients.map(

         client => {

            let column: any = {};

            column["name"] = {
               content: client.name,
               styledContent: <Link to={`${path}/detail/${client.uuid}`}>{client.name}</Link>,
               lineBreak: true,
            };

            column["serialNumber"] = {
               content: client.serialNumber,
               lineBreak: true,
            };

            column["clientDn"] = {
               content: client?.certificate?.subjectDn,
               lineBreak: true,
            };

            column["status"] = {
               content: client.enabled ? "enabled" : "disabled",
               styledContent: <StatusBadge enabled={client.enabled} />,
               lineBreak: true,
            };

            return {
               id: client.uuid,
               column: column,
               data: client,
            };

         }

      );


   };

   const clientTableHeader: CustomTableHeaderColumn[] = [
      {
         styledContent: <MDBColumnName columnName="Name" />,
         content: "name",
         sort: false,
         id: "clientName",
         width: "10%",
      },
      {
         styledContent: <MDBColumnName columnName="Serial Number" />,
         content: "serialNumber",
         sort: false,
         id: "clientSerialNumber",
         width: "25%",
      },
      {
         styledContent: <MDBColumnName columnName="Client DN" />,
         content: "clientDn",
         sort: false,
         id: "clientAdminDn",
         width: "35%",
      },
      {
         styledContent: <MDBColumnName columnName="Status" />,
         content: "status",
         sort: false,
         id: "clientStatus",
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
               data={clients}
               headers={clientTableHeader}
               rows={clientTableData()}
            />
         </Widget>

         <MDBModal overflowScroll={false} isOpen={confirmDelete} toggle={() => setConfirmDelete(false)}>

            <MDBModalHeader toggle={() => setConfirmDelete(false)}>
               Delete Client
            </MDBModalHeader>

            <MDBModalBody>
               You are about deleting a client with existing authorizations to RA
               Profiles. If you continue, these authorizations will be deleted as
               well. Is this what you want to do?
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

