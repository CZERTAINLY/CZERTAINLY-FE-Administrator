import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { actions, selectors } from "ducks/users";
import { actions as certActions, selectors as certSelectors } from "ducks/certificates";

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

   const user = useSelector(selectors.user);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);

   const certificate = useSelector(certSelectors.certificateDetail);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         if (!params.id) return;
         dispatch(certActions.clearCertificateDetail());
         dispatch(actions.getDetail({ uuid: params.id }));

      },
      [params.id, dispatch]

   );


   useEffect(

      () => {

         if (!user) return;
         dispatch(certActions.getCertificateDetail({ uuid: user.certificate.uuid }));

      },
      [user, dispatch]

   );


   const onEditClick = useCallback(

      () => {

         history.push(`../../administrators/edit/${user?.uuid}`);

      },
      [user, history]

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

         dispatch(actions.deleteUser({ uuid: user.uuid }));
         setConfirmDelete(false);

      },
      [user, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: user?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(user?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [user, onEditClick, onDisableClick, onEnableClick]

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
            id: "uuid",
            columns: ["UUID", user.uuid]
         },
         {
            id: "username",
            columns: ["Username", user.username]
         },
         {
            id: "firstName",
            columns: ["First name", user.firstName || ""]
         },
         {
            id: "username",
            columns: ["Last name", user.lastName || ""]
         },
         {
            id: "email",
            columns: ["Email", user.email || ""]
         },
         {
            id: "systemUser",
            columns: ["syst", <StatusCircle status={user.systemUser} />]
         },
         {
            id: "enabled",
            columns: ["Administrator Enabled", <StatusBadge enabled={user.enabled} />]
         }

      ],
      [user]

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
                  <CertificateAttributes certificate={certificate} />
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

