import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/roles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import { MDBBadge } from "mdbreact";


export default function UserDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const role = useSelector(selectors.role);
   const permissions = useSelector(selectors.permissions);

   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingPermissions = useSelector(selectors.isFetchingPermissions);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         if (!params.id) return;
         dispatch(actions.getDetail({ uuid: params.id }));

      },
      [params.id, dispatch]

   );

   useEffect(

      () => {

         if (!role || role.uuid !== params.id) return;
         dispatch(actions.getPermissions({ uuid: params.id }));

      },
      [role, params.id, dispatch]

   );


   const onEditClick = useCallback(

      () => {

         history.push(`../../roles/edit/${role?.uuid}`);

      },
      [role, history]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!role) return;

         dispatch(actions.delete({ uuid: role.uuid, redirect: `../` }));
         setConfirmDelete(false);

      },
      [role, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: role?.systemRole || false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: role?.systemRole || false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         /*
         { icon: "check", disabled: role?.enabled || role?.systemUser || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(role?.enabled || false) || role?.systemUser || false, tooltip: "Disable", onClick: () => { onDisableClick() } }
         */
      ],
      [role, onEditClick]

   );


   const attributesTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Role <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

   );


   const usersTitle = useMemo(

      () => (

         <h5>
            Assigned <span className="fw-semi-bold">Users</span>
         </h5>

      ),
      []

   );


   const permissionsTitle = useMemo(

      () => (

         <h5>
            Role <span className="fw-semi-bold">Permissions</span>
         </h5>

      ),
      []

   );


   const detailHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "Property",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => !role ? [] : [
         {
            id: "roleName",
            columns: ["Name", role.name]
         },
         {
            id: "description",
            columns: ["Description", role.description || ""]
         },
         {
            id: "systemRole",
            columns: ["System role ", <MDBBadge color={!role.systemRole ? "success" : "danger"}>{role.systemRole ? "Yes" : "No"}</MDBBadge>]
         }
      ],
      [role]

   );


   const usersHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "username",
            content: "Username",
         },
         {
            id: "firstName",
            content: "First name",
         },
         {
            id: "lastName",
            content: "Last name",
         },
         {
            id: "email",
            content: "Email",
         }
      ],
      []

   );


   const usersData: TableDataRow[] = useMemo(

      () => !role ? [] : role.users.map(

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
      [role]

   );


   const permsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "resourceName",
            content: "Resource",
            width: "auto"
         },
         {
            id: "allActionsAllowed",
            content: "All Actions",
            width: "1%",
            align: "center"
         },
         {
            id: "actions",
            content: "Allowed Actions",
            width: "5%"
         },
         {
            id: "denyActions",
            content: "Denied Actions",
            width: "5%"
         },
         {
            id: "noAllowedObjects",
            content: "No. Objects",
            width: "1%",
            align: "center"
         }

      ],

      []

   );


   const permsData: TableDataRow[] = useMemo(

      () => !permissions ? [] : permissions.permissions.resources.map(
         resource => ({
            id: resource.name,
            columns: [
               resource.name,
               <MDBBadge color={!resource.allowAllActions ? "danger" : "success"}>{resource.allowAllActions ? "Yes" : "No"}</MDBBadge>,
               <span style={{whiteSpace: "nowrap"}}>{resource.actions.join(", ")}</span>,
               <></>,
               resource.objects.length.toString()
            ],
            detailColumns: resource.objects.length === 0 ? undefined : [
               <></>,
               resource.objects.map(object => <div key={object.uuid}>{object.uuid}</div>),
               <></>,
               resource.objects.map(object => <div key={object.uuid}>{object.allow.join(",")}</div>),
               resource.objects.map(object => <div key={object.uuid}>{object.deny.join(",")}</div>),
               <></>
            ]
         })
      ),
      [permissions]

   );

   return (

      <Container className="themed-container" fluid>

         <Widget title={attributesTitle} busy={isFetchingDetail}>

            <br />
            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>


         <Widget title={usersTitle} busy={isFetchingDetail}>

            <br />
            <CustomTable
               headers={usersHeaders}
               data={usersData}
            />

         </Widget>


         <Widget title={permissionsTitle} busy={isFetchingDetail || isFetchingPermissions}>

            <br />
            {

               !permissions ? <></> : (

                  <>
                     <p><input type="checkbox" checked={permissions.permissions.allowAllResources} disabled />&nbsp;&nbsp;&nbsp;All resources allowed</p>

                     {
                        permissions.permissions.resources.length === 0 || permissions.permissions.allowAllResources ? <></> : (

                           <>
                              <p>List of allowed resources</p>
                              <CustomTable
                                 headers={permsHeaders}
                                 data={permsData}
                                 hasDetails={true}
                              />
                           </>
                        )
                     }

                  </>

               )

            }


         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Role"
            body="You are about to delete an Role. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

