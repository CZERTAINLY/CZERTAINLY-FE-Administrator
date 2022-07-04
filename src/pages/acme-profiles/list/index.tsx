import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/acme-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import { MDBBadge } from "mdbreact";

export default function AdministratorsList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.checkedRows);
   const acmeProfiles = useSelector(selectors.acmeProfiles);

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
         dispatch(actions.setCheckedRows({ checkedRows: [] }));
         dispatch(actions.listAcmeProfiles());
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
         dispatch(actions.bulkEnableAcmeProfiles({ uuids: checkedRows }));
      },
      [checkedRows, dispatch]
   );


   const onDisableClick = useCallback(
      () => {
         dispatch(actions.bulkDisableAcmeProfiles({ uuids: checkedRows }));
      },
      [checkedRows, dispatch]
   );


   const onDeleteConfirmed = useCallback(
      () => {
         dispatch(actions.bulkDeleteAcmeProfiles({ uuids: checkedRows }));
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
               List of <span className="fw-semi-bold">ACME Profiles</span>
            </h5>

         </div>
      ),
      [buttons]
   );


   const acmeProfilesnTableHeader: TableHeader[] = useMemo(
      () => [
         {
            id: "name",
            content: <MDBColumnName columnName="Name" />,
            sortable: true,
            sort: "asc",
            width: "10%"
         },
         {
            id: "description",
            content: <MDBColumnName columnName="Description" />,
            sortable: true,
            width: "10%"
         },
         {
            id: "raProfileName",
            content: <MDBColumnName columnName="RA Profile Name" />,
            sortable: true,
            width: "10%",
            align: "center"
         },
         {
            id: "directoryUrl",
            content: <MDBColumnName columnName="Directory URL" />,
            sortable: true,
            width: "auto"
         },
         {
            id: "status",
            content: <MDBColumnName columnName="Status" />,
            align: "center",
            sortable: true,
            width: "7%"
         },
      ],
      []
   );


   const acmeProfilesTableData: TableDataRow[] = useMemo(

      () => acmeProfiles.map(

         acmeProfile => ({

            id: acmeProfile.uuid,

            columns: [

               <Link to={`${path}/detail/${acmeProfile.uuid}`}>{acmeProfile.name}</Link>,

               acmeProfile.description || "",

               <MDBBadge color="info">{acmeProfile.raProfileName}</MDBBadge>,

               acmeProfile.directoryUrl || "",

               <StatusBadge enabled={acmeProfile.enabled} />,

            ]
         })
      ),
      [acmeProfiles, path]
   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={acmeProfilesnTableHeader}
               data={acmeProfilesTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "ACME Profiles" : "an ACME Profile"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "ACME Profiles" : "an ACME Profile"} which may have associated ACME
                   Account(s). When deleted the ACME Account(s) will be revoked. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
