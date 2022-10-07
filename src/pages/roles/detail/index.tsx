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
import StatusBadge from "components/StatusBadge";

import CertificateAttributes from "components/CertificateAttributes";
import { MDBBadge } from "mdbreact";


export default function UserDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const role = useSelector(selectors.role);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         if (!params.id) return;
         dispatch(actions.getDetail({ uuid: params.id }));

      },
      [params.id, dispatch]

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



   return (

      <Container className="themed-container" fluid>

         <Widget title={attributesTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>


         <Widget title={usersTitle} busy={isFetchingDetail}>
            <CustomTable
               headers={usersHeaders}
               data={usersData}
            />
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

