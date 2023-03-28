import CertificateAttributes from "components/CertificateAttributes";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { actions as certActions, selectors as certSelectors } from "ducks/certificates";

import { actions, selectors } from "ducks/users";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Container } from "reactstrap";
import { Resource } from "../../../../types/openapi";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";

export default function UserDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const user = useSelector(selectors.user);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingRoles = useSelector(selectors.isFetchingRoles);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);

   const certificate = useSelector(certSelectors.certificateDetail);
   const isFetchingCertificateDetail = useSelector(certSelectors.isFetchingDetail);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         if (!id) return;
         dispatch(certActions.clearCertificateDetail());
         dispatch(actions.getDetail({ uuid: id }));
         dispatch(actions.getRoles({ uuid: id }));

      },
      [dispatch, id]

   );


   useEffect(

      () => {

         if (!user || !user.certificate || !user.certificate.uuid || user.uuid !== id) return;
         dispatch(certActions.getCertificateDetail({ uuid: user.certificate.uuid }));

      },
      [user, dispatch, id]

   );


   const onEditClick = useCallback(

      () => {

         navigate(`../../edit/${user?.uuid}`, { relative: "path"});

      },
      [navigate, user]

   );


   const onEnableClick = useCallback(

      () => {

         if (!user) return;

         dispatch(actions.enable({ uuid: user.uuid }));

      },
      [user, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         if (!user) return;

         dispatch(actions.disable({ uuid: user.uuid }));

      },
      [user, dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!user) return;

         dispatch(actions.deleteUser({ uuid: user.uuid, redirect: `../../` }));
         setConfirmDelete(false);

      },
      [user, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: user?.systemUser || false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: user?.systemUser || false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: user?.enabled || user?.systemUser || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(user?.enabled || false) || user?.systemUser || false, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [user, onEditClick, onDisableClick, onEnableClick]

   );


   const attributesTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               User <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

   );


   const certificateTitle = useMemo(

      () => (

         <h5>
            User Certificate <span className="fw-semi-bold">Details</span>
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

      () => !user ? [] : [
         {
            id: "username",
            columns: ["Username", user.username]
         },
         {
            id: "description",
            columns: ["Description", user.description || ""]
         },
         {
            id: "firstName",
            columns: ["First name", user.firstName || ""]
         },
         {
            id: "lastName",
            columns: ["Last name", user.lastName || ""]
         },
         {
            id: "email",
            columns: ["Email", user.email || ""]
         },
         {
            id: "systemUser",
            columns: ["System user", <Badge color={!user.systemUser ? "success" : "danger"}>{user.systemUser ? "Yes" : "No"}</Badge>]
         },
         {
            id: "enabled",
            columns: ["Status", <StatusBadge enabled={user.enabled} />]
         },
         {
            id: "roles",
            columns: ["Roles", user.roles?.map((role) => role.name).join(", ") || ""]
         }
      ],
      [user]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={attributesTitle} busy={isFetchingDetail || isFetchingRoles || isEnabling || isDisabling}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>


         <Widget title={certificateTitle} busy={isFetchingDetail || isFetchingCertificateDetail}>
            <CertificateAttributes certificate={certificate} />
         </Widget>

          {user && <CustomAttributeWidget resource={Resource.Users} resourceUuid={user.uuid} attributes={user.customAttributes} />}

         <Dialog
            isOpen={confirmDelete}
            caption="Delete User"
            body="You are about to delete an User. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

