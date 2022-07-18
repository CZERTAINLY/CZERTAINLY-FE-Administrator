import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/groups";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";


export default function GroupDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const group = useSelector(selectors.group);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getGroupDetail({ uuid: params.id }));

      },
      [params.id, dispatch]

   );


   const onEditClick = useCallback(

      () => {

         history.push(`../../groups/edit/${group?.uuid}`);

      },
      [group, history]

   );



   const onDeleteConfirmed = useCallback(

      () => {

         if (!group) return;

         dispatch(actions.deleteGroup({ uuid: group.uuid }));
         setConfirmDelete(false);

      },
      [group, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      [onEditClick]

   );

   const detailsTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Group <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

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

      () => !group ? [] : [

         {
            id: "uuid",
            columns: ["UUID", group.uuid]
         },
         {
            id: "name",
            columns: ["Name", group.name]
         },
         {
            id: "description",
            columns: ["Description", group.description || ""]
         },

      ],
      [group]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={detailsTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Group"
            body="You are about to delete an Group. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

