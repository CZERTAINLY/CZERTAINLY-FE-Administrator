import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/users";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

export default function UsersList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.usersListCheckedRows);
   const users = useSelector(selectors.users);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isUpdating = useSelector(selectors.isUpdating);

   const isBusy = isFetching || isDeleting || isUpdating;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   useEffect(

      () => {

         dispatch(actions.setUserListCheckedRows({ checkedRows: [] }));
         dispatch(actions.list());

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

         checkedRows.forEach(
            uuid => dispatch(actions.enable({ uuid }))
         );

      },
      [checkedRows, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         checkedRows.forEach(
            uuid => dispatch(actions.disable({ uuid }))
         );

      },
      [checkedRows, dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         setConfirmDelete(false);

         checkedRows.forEach(
            uuid => dispatch(actions.deleteUser({ uuid }))
         );

      },
      [checkedRows, dispatch]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {

         dispatch(actions.setUserListCheckedRows({ checkedRows: rows as string[] }));

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
            id: "username",
            content: <MDBColumnName columnName="Username" />,
            sortable: true,
            sort: "asc",
            width: "10%",
         },
         {
            id: "firstName",
            content: <MDBColumnName columnName="First name" />,
            sortable: true,
            width: "5%",
         },
         {
            id: "lastName",
            content: <MDBColumnName columnName="Last name" />,
            sortable: true,
            width: "5%",
         },
         {
            id: "email",
            content: <MDBColumnName columnName="Email" />,
            sortable: true,
         },
         {
            id: "systemUser",
            content: <MDBColumnName columnName="System user" />,
            align: "center",
            sortable: true,
            width: "7%",
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

      () => users.map(

         user => ({

            id: user.uuid,

            columns: [

               <span style={{ whiteSpace: "nowrap" }}><Link to={`${path}/detail/${user.uuid}`}>{user.username}</Link></span>,

               user.firstName || "",

               user.lastName || "",

               user.email || "",

               <StatusCircle status={user.systemUser} />,

               <StatusBadge enabled={user.enabled} />,

            ]
         })
      ),
      [users, path]
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
