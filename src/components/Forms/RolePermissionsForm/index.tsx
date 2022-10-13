import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { Button, ButtonGroup, } from "reactstrap";

import Widget from "components/Widget";
import ProgressButton from "components/ProgressButton";

import { actions as rolesActions, selectors as rolesSelectors } from "ducks/roles";
import { actions as authActions, selectors as authSelectors } from "ducks/auth";


import RolePermissionsEditor from "components/RolePermissionsEdior";
import { SubjectPermissionsModel } from "models";


function RoleForm() {

   const dispatch = useDispatch();
   const history = useHistory();

   const { params } = useRouteMatch<{ id: string }>();
   const roleSelector = useSelector(rolesSelectors.role);
   const rolePermissionsSelector = useSelector(rolesSelectors.permissions);
   const resourcesSelector = useSelector(authSelectors.resources);

   const isFetchingRoleDetail = useSelector(rolesSelectors.isFetchingDetail);
   const isFetchingPermissions = useSelector(rolesSelectors.isFetchingPermissions);
   const isFetchingResources = useSelector(authSelectors.isFetchingResources);

   const isCreatingRole = useSelector(rolesSelectors.isCreating);
   const isUpdatingRole = useSelector(rolesSelectors.isUpdating);

   const [permissions, setPermissions] = useState<SubjectPermissionsModel>();

   /* Load all users, resources and objects */

   useEffect(

      () => {

         dispatch(rolesActions.resetState());
         dispatch(authActions.clearResources());
         dispatch(authActions.getResources());

      },
      [dispatch]

   );

   /* Load role && role permissions */

   useEffect(

      () => {

         if (!params.id || (roleSelector && roleSelector.uuid === params.id)) return;

         dispatch(rolesActions.getDetail({ uuid: params.id }));
         dispatch(rolesActions.getPermissions({ uuid: params.id }));

      },
      [dispatch, params.id, roleSelector]

   );

   /* Set role permissions */

   useEffect(

      () => {

         if (!rolePermissionsSelector || rolePermissionsSelector.uuid !== params.id) return;
         setPermissions(rolePermissionsSelector.permissions);

      },
      [params.id, rolePermissionsSelector]

   );


   const patchPermissions = useCallback(

      (outPerms: SubjectPermissionsModel) => {

         const perms = JSON.parse(JSON.stringify(outPerms));

         const inPerms: SubjectPermissionsModel = rolePermissionsSelector?.permissions || {
            allowAllResources: false,
            resources: []
         };

         for (let i = 0; i < perms.resources.length; i++) {

            const outRes = perms.resources[i];
            const inRes = inPerms.resources.find(res => res.name === outRes.name);

            if (!outRes.objects) continue;

            if (outRes.objects?.length === 0 && (!inRes || (inRes.objects && inRes.objects.length === 0))) {
               delete perms.objects;
               continue;
            }

         }

         return perms;

      },
      [rolePermissionsSelector]

   );


   const onSubmit = useCallback(

      () => {

         const perms = patchPermissions(permissions!);
         dispatch(rolesActions.updatePermissions({ uuid: params.id, permissions: perms }));

      },
      [dispatch, params.id, patchPermissions, permissions]

   )


   const onCancel = useCallback(
      () => {

         history.goBack();

      },
      [history]
   );

   return (

      <>

         <Widget title={`${(roleSelector?.name || "")} Role Permissions`} busy={isFetchingRoleDetail || isFetchingPermissions || isFetchingResources}>

            <RolePermissionsEditor
               resources={resourcesSelector}
               permissions={permissions}
               disabled={roleSelector?.systemRole}
               onPermissionsChanged={(perms) => {
                  setPermissions(perms);
               }}
            />


            <br />

            <div className="d-flex justify-content-end">

               <ButtonGroup>

                  <ProgressButton
                     title="Save"
                     inProgressTitle="Svaing..."
                     inProgress={isCreatingRole || isUpdatingRole}
                     disabled={isCreatingRole || isUpdatingRole || roleSelector?.systemRole}
                     onClick={onSubmit}
                  />

                  <Button color="default" onClick={onCancel} disabled={isCreatingRole || isUpdatingRole}>
                     Cancel
                  </Button>

               </ButtonGroup>

            </div>

         </Widget>

      </>

   )

}

export default RoleForm;
