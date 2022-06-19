import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { actions, selectors } from "ducks/administrators";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusCircle from "components/StatusCircle";
import StatusBadge from "components/StatusBadge";

import CertificateAttributes from "components/CertificateAttributes";


export default function AdministratorDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const administrator = useSelector(selectors.administrator);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(
      () => {
         dispatch(actions.getAdminDetail(params.id));
      },
      [params.id, dispatch]
   );


   const onEditClick = useCallback(
      () => {
         history.push(`../../administrators/edit/${administrator?.uuid}`);
      },
      [administrator, history]
   );


   const onEnableClick = useCallback(
      () => {
         if (!administrator) return;
         dispatch(actions.enableAdmin(administrator.uuid));
      },
      [administrator, dispatch]
   );


   const onDisableClick = useCallback(
      () => {
         if (!administrator) return;
         dispatch(actions.disableAdmin(administrator.uuid));
      },
      [administrator, dispatch]
   );


   const onDeleteConfirmed = useCallback(
      () => {
         if (!administrator) return;
         dispatch(actions.deleteAdmin(administrator.uuid));
         setConfirmDelete(false);
      },
      [administrator, dispatch]
   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: administrator?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(administrator?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [administrator, onEditClick, onDisableClick, onEnableClick]
   );


   const attributesTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Administrator <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]
   );


   const certificateTitle = useMemo(
      () => (
         <h5>
            Administrator Certificate <span className="fw-semi-bold">Details</span>
         </h5>
      ),
      []
   );


   const detailHeaders: TableHeader[] = useMemo(
      () => [
         {
            id: "attribute",
            content: "Attribute",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []
   );


   const detailData: TableDataRow[] = useMemo(

      () => !administrator ? [] : [

         {
            id: "uuid",
            columns: ["UUID", administrator.uuid]
         },
         {
            id: "name",
            columns: ["Name", administrator.name]
         },
         {
            id: "surname",
            columns: ["Surname", administrator.surname]
         },
         {
            id: "username",
            columns: ["Username", administrator.username]
         },
         {
            id: "email",
            columns: ["Email", administrator.email]
         },
         {
            id: "description",
            columns: ["Description", administrator.description]
         },
         {
            id: "superadmin",
            columns: ["Superadmin", <StatusCircle status={administrator?.role === "superAdministrator"} />]
         },
         {
            id: "enabled",
            columns: ["Administrator Enabled", <StatusBadge enabled={administrator.enabled} />]
         },

      ],
      [administrator]

   );


   return (
      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>

               <Widget title={attributesTitle} busy={isFetchingDetail || isEnabling || isDisabling}>

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />

               </Widget>

            </Col>

            <Col>
               <Widget title={certificateTitle} busy={isFetchingDetail}>
                  <CertificateAttributes certificate={administrator?.certificate} />
               </Widget>
            </Col>
         </Row>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Administrator"
            body="You are about to delete an Administrator. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

