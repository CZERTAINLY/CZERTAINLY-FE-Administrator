import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/roles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import MDBColumnName from "components/MDBColumnName";
import StatusBadge from "components/StatusBadge";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import { MDBBadge } from "mdbreact";

export default function RolesList() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { path } = useRouteMatch();

   const checkedRows = useSelector(selectors.rolesListCheckedRows);
   const roles = useSelector(selectors.roles);

   const isFetching = useSelector(selectors.isFetchingList);
   const isDeleting = useSelector(selectors.isDeleting);
   const isUpdating = useSelector(selectors.isUpdating);

   const isBusy = isFetching || isDeleting || isUpdating;

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   useEffect(

      () => {

         dispatch(actions.setRolesListCheckedRows({ checkedRows: [] }));
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


   const onDeleteConfirmed = useCallback(

      () => {

         setConfirmDelete(false);

         checkedRows.forEach(
            uuid => dispatch(actions.delete({ uuid }))
         );

      },
      [checkedRows, dispatch]

   );


   const setCheckedRows = useCallback(

      (rows: (string | number)[]) => {

         dispatch(actions.setRolesListCheckedRows({ checkedRows: rows as string[] }));

      },
      [dispatch]

   );


   const isSystemRoleSelected = useMemo(

      () => {

         return checkedRows.some(uuid => {
            const role = roles.find(role => role.uuid === uuid);
            return role && role.systemRole;
         });

      },
      [checkedRows, roles]

   )


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Create", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: checkedRows.length === 0 || isSystemRoleSelected, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         /*{ icon: "check", disabled: isSystemRoleSelected || !canEnable, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: isSystemRoleSelected || !canDisable, tooltip: "Disable", onClick: () => { onDisableClick() } }*/
      ],
      [checkedRows.length, isSystemRoleSelected, onAddClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               List of <span className="fw-semi-bold">Roles</span>
            </h5>

         </div>

      ),
      [buttons]

   );


   const rolesTableHeader: TableHeader[] = useMemo(

      () => [
         {
            id: "roleName",
            content: <MDBColumnName columnName="Role name" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "roleDescription",
            content: <MDBColumnName columnName="Role description" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "systemRole",
            content: <MDBColumnName columnName="System role" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         }
      ],
      []

   );


   const rolesTableData: TableDataRow[] = useMemo(

      () => roles.map(

         role => ({

            id: role.uuid,

            columns: [

               <span style={{ whiteSpace: "nowrap" }}><Link to={`${path}/detail/${role.uuid}`}>{role.name}</Link></span>,

               role.description || "",

               <MDBBadge color={!role.systemRole ? "success" : "danger"}>{role.systemRole ? "Yes" : "No"}</MDBBadge>,

            ]
         })
      ),
      [roles, path]
   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isBusy}>

            <br />
            <CustomTable
               headers={rolesTableHeader}
               data={rolesTableData}
               onCheckedRowsChanged={setCheckedRows}
               canSearch={true}
               hasCheckboxes={true}
               hasPagination={true}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption={`Delete ${checkedRows.length > 1 ? "Roles" : "an Role"}`}
            body={`You are about to delete ${checkedRows.length > 1 ? "Roles" : "an Role"}. Is this what you want to do?`}
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );

}
