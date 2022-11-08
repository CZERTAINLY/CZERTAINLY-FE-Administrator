import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/roles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

export default function RolesList() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

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

         navigate(`./add`);

      },
      [navigate]

   );


   const onEditRoleUsersClick = useCallback(

      () => {

         if (checkedRows.length !== 1) return;
         navigate(`./roles/users/${checkedRows[0]}`);

      },
      [checkedRows, navigate]

   );


   const onEditRolePermissionsClick = useCallback(

      () => {

         if (checkedRows.length !== 1) return;
         navigate(`./roles/permissions/${checkedRows[0]}`);

      },
      [checkedRows, navigate]

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
         { icon: "user", disabled: checkedRows.length !== 1 || isSystemRoleSelected, tooltip: "Edit role users", onClick: () => { onEditRoleUsersClick() } },
         { icon: "lock", disabled: checkedRows.length !== 1 || isSystemRoleSelected, tooltip: "Edit role permissions", onClick: () => { onEditRolePermissionsClick() } }
      ],
      [checkedRows.length, isSystemRoleSelected, onAddClick, onEditRolePermissionsClick, onEditRoleUsersClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
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
            content: "Role name",
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "roleDescription",
            content: "Role description",
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "systemRole",
            content: "System role",
            sortable: true,
            sort: "asc",
            width: "auto",
            align: "center",
         }
      ],
      []

   );


   const rolesTableData: TableDataRow[] = useMemo(

      () => roles.map(

         role => ({

            id: role.uuid,

            columns: [

               <span style={{ whiteSpace: "nowrap" }}><Link to={`./detail/${role.uuid}`}>{role.name}</Link></span>,

               role.description || "",

               <Badge color={!role.systemRole ? "success" : "danger"}>{role.systemRole ? "Yes" : "No"}</Badge>,

            ]
         })
      ),
      [roles]
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
