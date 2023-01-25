import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "components/Attributes/AttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import TokenStatusBadge from "components/TokenStatusBadge";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/tokens";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Label } from "reactstrap";
import TokenActivationDialogBody from "../TokenActivationDialogBody";

export default function TokenDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const token = useSelector(selectors.token);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);
   const isActivating = useSelector(selectors.isActivating);
   const isDeactivating = useSelector(selectors.isDeactivating);
   const isReloading = useSelector(selectors.isReloading);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmDeactivation, setConfirmDeactivation] = useState<boolean>(false);
   const [activateToken, setActivateToken] = useState<boolean>(false);

   const isBusy = useMemo(
      () => isFetching || isDeleting || isActivating || isDeactivating || isReloading,
      [isFetching, isDeleting, isActivating, isDeactivating, isReloading]
   );


   useEffect(

      () => {

         if (!id) return;
         dispatch(actions.resetState());
         dispatch(actions.getTokenDetail({ uuid: id }));
         dispatch(actions.listActivationAttributeDescriptors({ uuid: id}));

      },
      [dispatch, id]

   )


   const onEditClick = useCallback(

      () => {

         if (!token) return;
         navigate(`../../edit/${token.uuid}`, { relative: "path" });

      },
      [token, navigate]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!token) return;

         dispatch(actions.deleteToken({ uuid: token.uuid }));
         setConfirmDelete(false);

      },
      [token, dispatch]

   );

   const onDeactivationConfirmed = useCallback(

      () => {

         if (!token) return;

         dispatch(actions.deactivateToken({ uuid: token.uuid }));
         setConfirmDeactivation(false);

      },
      [token, dispatch]

   );


   const onReload = useCallback(

      () => {

         if (!token) return;

         dispatch(actions.reloadToken({ uuid: token.uuid }));

      },
      [token, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "refresh", disabled: false, tooltip: "Update Status", onClick: () => { onReload() } },
         { icon: "check", disabled: false, tooltip: "Activate", onClick: () => { setActivateToken(true); } },
         { icon: "times", disabled: false, tooltip: "Deactivate", onClick: () => { setConfirmDeactivation(true); } },
      ],
      [onEditClick, onReload]

   );


   const tokenTitle = useMemo(

      () => (

         <div>

            <div className="fa-pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Token <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [buttons]

   );

   const metaTitle = (
      <h5>
         <span className="fw-semi-bold">Meta Data</span>
      </h5>
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

      () => !token ? [] : [

         {
            id: "uuid",
            columns: ["UUID", token.uuid],

         },
         {
            id: "name",
            columns: ["Name", token.name],
         },
         {
            id: "status",
            columns: ["Status", <TokenStatusBadge status={token.status.status}/>],
         },
         {
            id: "cryptographyProviderUUID",
            columns: ["Cryptography Provider UUID", token.connectorUuid || ""],
         },
         {
            id: "cryptographyProviderName",
            columns: ["Cryptography Provider Name", token.connectorName || ""],
         },
         {
            id: "kind",
            columns: ["Kind", token.kind || ""],
         },
         {
            id: "tokenProfiles",
            columns: ["Number of Token Profiles", token.tokenProfiles.toString()],
         }

      ],
      [token]

   );




   return (

      <Container className="themed-container" fluid>

         <Widget title={tokenTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Attributes">

            <br />

             <Label>Token Attributes</Label>
             <AttributeViewer attributes={token?.attributes} />
             <Label>Custom Attributes</Label>
             <AttributeViewer attributes={token?.customAttributes} />

         </Widget>

         <Widget title={metaTitle}>
               <br />
                  <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={token?.metadata}/>
         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Token"
            body="You are about to delete Token. If you continue, objects
                  related to the token will fail. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmDeactivation}
            caption="Deactivate Token"
            body="You are about to deactivate Token. If you continue, objects
                  related to the token not work. Is this what you want to do?"
            toggle={() => setConfirmDeactivation(false)}
            buttons={[
               { color: "danger", onClick: onDeactivationConfirmed, body: "Deactivate" },
               { color: "secondary", onClick: () => setConfirmDeactivation(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={activateToken}
            caption="Activate Token"
            body={TokenActivationDialogBody({ visible: activateToken, onClose: () => setActivateToken(false), tokenUuid: token?.uuid})}
            toggle={() => setActivateToken(false)}
            buttons={[]}
         />

      </Container>
      
   )

}
