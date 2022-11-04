import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Container } from "reactstrap";

import { actions, selectors } from "ducks/acme-accounts";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusCircle from "components/StatusCircle";
import StatusBadge from "components/StatusBadge";

import { acmeAccountStatus } from "../acmeAccountStatus";


export default function AcmeAccountDetail() {

   const dispatch = useDispatch();

   const { id, acmeProfileId } = useParams();

   const acmeAccount = useSelector(selectors.account);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);
   const isRevoking = useSelector(selectors.isRevoking);

   const [confirmRevoke, setConfirmRevoke] = useState<boolean>(false);


   useEffect(

      () => {

         if (!id || !acmeProfileId) return;

         dispatch(actions.getAcmeAccount({ acmeProfileUuid: acmeProfileId, uuid: id }));

      },
      [id, dispatch, acmeProfileId]

   )


   const onEnableClick = useCallback(

      () => {

         if (!acmeAccount) return;

         dispatch(actions.enableAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));

      },
      [acmeAccount, dispatch]

   );


   const onDisableClick = useCallback(

      () => {

         if (!acmeAccount) return;

         dispatch(actions.disableAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));

      },
      [acmeAccount, dispatch]

   );


   const onRevokeConfirmed = useCallback(

      () => {
         if (!acmeAccount) return;
         dispatch(actions.revokeAcmeAccount({ acmeProfileUuid: acmeAccount.acmeProfileUuid, uuid: acmeAccount.uuid }));
         setConfirmRevoke(false);
      },
      [acmeAccount, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "cross-circle", disabled: acmeAccount ? acmeAccount.status !== "valid" : true, tooltip: "Revoke", onClick: () => { setConfirmRevoke(true); } },
         { icon: "check", disabled: acmeAccount ? acmeAccount.enabled || acmeAccount.status !== "valid" : true, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: acmeAccount ? !acmeAccount.enabled : true, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [acmeAccount, onEnableClick, onDisableClick]

   );


   const title = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               ACME Account <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

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
         }
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => {

         if (!acmeAccount) return [];

         const accountStatus = acmeAccountStatus(acmeAccount.status);

         return [
            {
               id: "uuid",
               columns: ["UUID", acmeAccount.uuid]
            },
            {
               id: "accountId",
               columns: ["Account Id", acmeAccount.accountId]
            },
            {
               id: "raProfileName",
               columns: ["RA Profile Name", acmeAccount.raProfileName]
            },
            {
               id: "acmeProfileName",
               columns: ["ACME Profile Name", acmeAccount.acmeProfileName]
            },
            {
               id: "internalState",
               columns: ["Internal State", <StatusBadge enabled={acmeAccount.enabled} />]
            },
            {
               id: "accountStatus",
               columns: ["Account Status", <Badge color={accountStatus[1]}>{accountStatus[0]}</Badge>]
            },
            {
               id: "Terms of Service Agreed",
               columns: ["Terms of Service Agreed", <StatusCircle status={acmeAccount.termsOfServiceAgreed} />]
            },
            {
               id: "contacts",
               columns: ["Contacts", <>{acmeAccount.contact.map(contact => <div key={contact}>{contact}</div>)}</>]
            }
         ];

      },
      [acmeAccount]

   );


   const orderHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "orders",
            content: "Orders",
         },
         {
            id: "count",
            content: "Count",
         }
      ],
      []

   );


   const orderData: TableDataRow[] = useMemo(

      () => !acmeAccount ? [] : [

         {
            id: "Succesfull orders",
            columns: ["Succesfull orders", acmeAccount.successfulOrders.toString()]
         },
         {
            id: "Valid orders",
            columns: ["Valid orders", acmeAccount.validOrders.toString()],
         },
         {
            id: "Pendning orders",
            columns: ["Pendning orders", acmeAccount.pendingOrders.toString()],
         },
         {
            id: "Failed orders",
            columns: ["Failed orders", acmeAccount.failedOrders.toString()],
         },
         {
            id: "Processing orders",
            columns: ["Processing orders", acmeAccount.processingOrders.toString()],
         }

      ],
      [acmeAccount]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={title} busy={isFetchingDetail || isEnabling || isDisabling || isRevoking}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Order Summary" busy={isFetchingDetail || isEnabling || isDisabling || isRevoking}>

            <CustomTable
               headers={orderHeaders}
               data={orderData}
            />

         </Widget>

         <Dialog
            isOpen={confirmRevoke}
            caption="Revoke ACME Account"
            body="You are about to revoke an ACME Account. Is this what you want to do?"
            toggle={() => setConfirmRevoke(false)}
            buttons={[
               { color: "danger", onClick: onRevokeConfirmed, body: "Yes, revoke" },
               { color: "secondary", onClick: () => setConfirmRevoke(false), body: "Cancel" },
            ]}
         />

      </Container>

   );

}
