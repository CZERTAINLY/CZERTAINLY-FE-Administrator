import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup } from "reactstrap";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import { actions as userActions, selectors as usersSelectors } from "ducks/users";

import MDBColumnName from "components/MDBColumnName";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";



function RoleForm() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();

   const roleSelector = useSelector(rolesSelectors.role);
   const usersSelector = useSelector(usersSelectors.users);

   const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
   const isFetchingUsers = useSelector(usersSelectors.isFetchingList);
   const isUpdatingUsers = useSelector(rolesSelectors.isUpdatingUsers);

   const [assignedUsers, setAssignedUsers] = useState<string[]>([]);

   /* Load all users */

   useEffect(

      () => {

         dispatch(userActions.list());
         dispatch(rolesActions.getDetail({ uuid: params.id }));

      },
      [dispatch, params.id]

   );

   /* Set assigned users */

   useEffect(

      () => {

         if (!roleSelector || roleSelector.uuid !== params.id) return;
         setAssignedUsers(roleSelector.users.map(user => user.uuid));

      },
      [params.id, roleSelector]

   );


   const onSubmit = useCallback(

      () => {

         dispatch(rolesActions.updateUsers({ uuid: params.id, users: assignedUsers }));

      },

      [assignedUsers, dispatch, params.id]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );


   const usersTableHeader: TableHeader[] = useMemo(

      () => [
         {
            id: "userName",
            content: <MDBColumnName columnName="Username" />,
            sortable: true,
            sort: "asc",
            width: "auto",
         },
         {
            id: "firstName",
            content: <MDBColumnName columnName="First Name" />,
            sortable: true,
         },
         {
            id: "lastName",
            content: <MDBColumnName columnName="Last Name" />,
            sortable: true,
         },
         {
            id: "email",
            content: <MDBColumnName columnName="Email" />,
            sortable: true,
         }
      ],
      []

   );


   const usersTableData: TableDataRow[] = useMemo(

      () => usersSelector.map(

         user => ({

            id: user.uuid,

            columns: [

               user.username,

               user.firstName || "",

               user.lastName || "",

               user.email || ""

            ]

         })

      ),

      [usersSelector]

   );


   return (

      <>

         <Widget title={`${(roleSelector?.name || "")} Role Users `} busy={isFetchingRoleDetail || isFetchingUsers}>

            <br />

            <CustomTable
               headers={usersTableHeader}
               data={usersTableData}
               checkedRows={assignedUsers}
               hasCheckboxes={true}
               hasAllCheckBox={false}
               onCheckedRowsChanged={
                  (rows) => {
                     setAssignedUsers(rows as string[])
                  }
               }
            />


            <div className="d-flex justify-content-end">

               <ButtonGroup>

                  <ProgressButton
                     title="Save"
                     inProgressTitle="Saving..."
                     inProgress={isUpdatingUsers}
                     onClick={onSubmit}
                  />

                  <Button color="default" onClick={onCancel} disabled={isUpdatingUsers}>
                     Cancel
                  </Button>

               </ButtonGroup>

            </div>

         </Widget>

      </>

   )

}

export default RoleForm;
