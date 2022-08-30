import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";

import { Container, Label } from "reactstrap";

import { actions, selectors } from "ducks/locations";

import Widget from "components/Widget";
import Dialog from "components/Dialog";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeViewer from "components/Attributes/AttributeViewer";
import StatusBadge from "components/StatusBadge";

export default function EntityDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();
   const history = useHistory();

   const location = useSelector(selectors.location);

   const isFetching = useSelector(selectors.isFetchingDetail);
   const isDeleting = useSelector(selectors.isDeleting);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const isBusy = useMemo(
      () => isFetching || isDeleting,
      [isFetching, isDeleting]
   );


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getLocationDetail({ uuid: params.id }));

      },
      [dispatch, params.id]

   )


   const onEditClick = useCallback(

      () => {

         if (!location) return;
         history.push(`../../locations/edit/${location.uuid}`);

      },
      [location, history]

   );


   const onEnableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.enableLocation({ uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onDisableClick = useCallback(

      () => {

         if (!location) return;
         dispatch(actions.disableLocation({ uuid: location.uuid }));

      },
      [dispatch, location]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!location) return;

         dispatch(actions.deleteLocation({ uuid: location.uuid, redirect: "../" }));
         setConfirmDelete(false);

      },
      [location, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: false, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [onDisableClick, onEditClick, onEnableClick]

   );


   const entityTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Location <span className="fw-semi-bold">Details</span>
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

      () => !location ? [] : [

         {
            id: "uuid",
            columns: ["UUID", location.uuid],

         },
         {
            id: "name",
            columns: ["Name", location.name],
         },
         {
            id: "description",
            columns: ["Description", location.description || ""],
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={location.enabled} />],
         },
         {
            id: "entityUuid",
            columns: ["Entity UUID", location.entityInstanceUuid],
         },
         {
            id: "entityName",
            columns: ["Entity Name", location.entityInstanceName],
         }

      ],
      [location]

   );


   const certHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "cn",
            content: "Common Name",
         },
         {
            id: "sn",
            content: "Serial Number",
         },
         {
            id: "pk",
            content: "Private Key",
         },
         {
            id: "csr",
            content: "CSR attributes",
         }
      ],
      []

   );


   const certData: TableDataRow[] = useMemo(

      () => !location ? [] : location.certificates.map(
         cert => ({
            id: cert.certificateUuid,
            columns: [
               cert.commonName,
               cert.serialNumber,
               cert.withKey ? "Yes" : "No",
               !cert.csrAttributes ? "" : <CustomTable
                  headers={[{ id: "name", content: "Name" }, { id: "value", content: "Value" }]}
                  data={cert.csrAttributes.map(atr => ({ id: atr.name, columns: [ atr.label || atr.name, atr.content ? (atr.content as any).value : "" ] }))}
               />
            ],
         })
      ),
      [location]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={entityTitle} busy={isBusy}>

            <br />

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Attributes">

            <br />

            <Label>Location Attributes</Label>
            <AttributeViewer attributes={location?.attributes} />

         </Widget>

         <Widget title="Certificates">

            <br />

            <Label>Location certificates</Label>
            <CustomTable
               headers={certHeaders}
               data={certData}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Entity"
            body="You are about to delete Entity. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>

   )

}
