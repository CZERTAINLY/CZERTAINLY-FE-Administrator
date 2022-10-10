import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/auth";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";


export default function ProfileDetail() {

   const dispatch = useDispatch();
   const history = useHistory();

   const profile = useSelector(selectors.profile);
   const isFetchingDetail = useSelector(selectors.isFetchingProfile);

   useEffect(

      () => {
         dispatch(actions.getProfile());
      },
      [dispatch]

   );


   const onEditClick = useCallback(

      () => {

         history.push(`./edit`);

      },
      [history]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: profile?.systemUser || false, tooltip: "Edit", onClick: () => { onEditClick(); } },
      ],
      [profile, onEditClick]

   );


   const attributesTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               User <span className="fw-semi-bold">Details</span>
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

      () => !profile ? [] : [
         {
            id: "username",
            columns: ["Username", profile.username]
         },
         {
            id: "description",
            columns: ["Description", profile.description || ""]
         },
         {
            id: "firstName",
            columns: ["First name", profile.firstName || ""]
         },
         {
            id: "lastName",
            columns: ["Last name", profile.lastName || ""]
         },
         {
            id: "email",
            columns: ["Email", profile.email || ""]
         }
      ],
      [profile]

   );


   return (

      <Container className="themed-container" fluid>

         <Widget title={attributesTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

      </Container>

   );


}

