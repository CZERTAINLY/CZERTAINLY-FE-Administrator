import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Label } from "reactstrap";

import { actions, selectors } from "ducks/authorities";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";

export default function AuthorityDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const authority = useSelector(selectors.authority);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const isBusy = useMemo(
      () => isFetching || isDeleting,
      [isFetching, isDeleting]
   );


   useEffect(

      () => {

         if (!id) return;
         dispatch(actions.resetState());
         dispatch(actions.getAuthorityDetail({ uuid: id }));

      },
      [dispatch, id]

   )


   const onEditClick = useCallback(

      () => {

         if (!authority) return;
         navigate(`../../edit/${authority.uuid}`, { relative: "path" });

      },
      [authority, navigate]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!authority) return;

         dispatch(actions.deleteAuthority({ uuid: authority.uuid }));
         setConfirmDelete(false);

      },
      [authority, dispatch]

   );


   const onForceDeleteAuthority = useCallback(

      () => {

         if (!authority) return;
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteAuthority({ uuids: [authority.uuid], redirect:`../` }));

      },
      [authority, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [onEditClick]

   );


   const authorityTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Certification Authority <span className="fw-semi-bold">Details</span>
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
         },
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => !authority ? [] : [

         {
            id: "uuid",
            columns: ["UUID", authority.uuid],

         },
         {
            id: "name",
            columns: ["Name", authority.name],
         },
         {
            id: "kind",
            columns: ["Kind", authority.kind],
         },
         {
            id: "authorityProviderUUID",
            columns: ["Authority Provider UUID", authority.connectorUuid],
         },
         {
            id: "authorityProviderName",
            columns: ["Authority Provider Name", authority.connectorName],
         }

      ],
      [authority]

   );




   return (

      <Container className="themed-container" fluid>

         <Widget title={authorityTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Attributes">

            <br />

            <Label>Certification Authority Attributes</Label>
            <AttributeViewer attributes={authority?.attributes} />

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Certification Authority"
            body="You are about to delete Authority. If you continue, connectors
                  related to the authority will fail. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={deleteErrorMessage !== ""}
            caption="Delete Authority"
            body={
               <>
                  Failed to delete the Authority Instance as it has dependent objects.
                  Please find the details below:
                  <br />
                  <br />
                  {deleteErrorMessage}
               </>
            }
            toggle={() => dispatch(actions.clearDeleteErrorMessages())}
            buttons={[
               { color: "danger", onClick: onForceDeleteAuthority, body: "Force" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />


      </Container>

   )

}
