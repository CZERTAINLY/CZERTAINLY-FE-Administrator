import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/compliance-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";


export default function ComplianceProfileDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const profile = useSelector(selectors.complianceProfile);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);

   const isFetchingRules = useSelector(selectors.isFetchingRules);
   const rules = useSelector(selectors.rules);

   const isFetchingGroups = useSelector(selectors.isFetchingGroups);
   const groups = useSelector(selectors.groups);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getComplianceProfile({ uuid: params.id }));
         dispatch(actions.listComplianceRules());
         dispatch(actions.listComplianceGroups());

      },
      [params.id, dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!profile) return;

         dispatch(actions.deleteComplianceProfile({ uuid: profile.uuid }));
         setConfirmDelete(false);

      },
      [profile, dispatch]

   );


   const onForceDeleteComplianceProfile = useCallback(

      () => {

         if (!profile) return;

         dispatch(actions.bulkForceDeleteComplianceProfiles({ uuids: [profile.uuid], redirect: `../` }));

      },
      [profile, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      []

   );

   const detailsTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Compliance Profile <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]

   );


   const rulesTitle = useMemo(

      () => (

         <div>

            <h5>
               <span className="fw-semi-bold">Rules</span>
            </h5>

         </div>

      ), [buttons]

   );


   const groupsTitle = useMemo(

      () => (

         <div>
            <h5>
               <span className="fw-semi-bold">Groups</span>
            </h5>

         </div>

      ), []

   );


   const availableRulesTitle = useMemo(

      () => (

         <div>

            <h5>
               <span className="fw-semi-bold">Add Rules</span>
            </h5>

         </div>

      ), []

   );


   const availableGroupsTitle = useMemo(

      () => (

         <div>
            <h5>
               <span className="fw-semi-bold">Add Group</span>
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


   const rulesHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "connectorName",
            content: "Connector Name",
         },
         {
            id: "ruleName",
            content: "Rule Name",
         },
         {
            id: "ruleDescription",
            content: "Rule Description",
         },
         {
            id: "ruleUuid",
            content: "Rule UUID",
         },
      ],
      []

   );


   const availableRulesHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "connectorName",
            content: "Connector",
         },
         {
            id: "connectorKind",
            content: "Kind",
         },
         {
            id: "ruleName",
            content: "Name",
         },
         {
            id: "ruleDescription",
            content: "Description",
         },
         {
            id: "action",
            content: "Action",
         },
      ],
      []

   );


   const availableGroupsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "connectorName",
            content: "Connector",
         },
         {
            id: "connectorKind",
            content: "Kind",
         },
         {
            id: "groupName",
            content: "Name",
         },
         {
            id: "groupDescription",
            content: "Description",
         },
         {
            id: "action",
            content: "Action",
         },
      ],
      []

   );


   const groupHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "connectorName",
            content: "Connector Name",
         },
         {
            id: "groupName",
            content: "Group Name",
         },
         {
            id: "groupDescription",
            content: "Group Description",
         },
         {
            id: "groupUuid",
            content: "Group UUID",
         },
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => !profile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", profile.uuid]
         },
         {
            id: "name",
            columns: ["Name", profile.name]
         },
         {
            id: "description",
            columns: ["Description", profile.description || ""]
         },

      ],
      [profile]

   );


   const rulesData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.rules) return [];

         let data: TableDataRow[] = [];
         for(const connector of profile.rules) {
            for(const rule of connector.rules) {
               data.push({
                  id: `${rule.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     rule.name,
                     rule.description || "",
                     rule.uuid,
                  ]
               });
            }
         }
         return data;
      },
      [profile]

   );


   const groupsData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.groups) return [];

         let data: TableDataRow[] = [];
         for(const connector of profile.groups) {
            for(const group of connector.groups) {
               data.push({
                  id: `${group.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     group.name,
                     group.description || "",
                     group.uuid,
                  ]
               });
            }
         }
         return data;
      },
      [profile]

   );


   const availableRulesData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.rules) return [];

         let data: TableDataRow[] = [];
         for(const connector of rules) {
            for(const rule of connector.rules) {
               data.push({
                  id: `${rule.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     rule.name,
                     rule.description || ""
                  ]
               });
            }
         }
         return data;
      },
      [profile]

   );


   const availableGroupsData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.groups) return [];

         let data: TableDataRow[] = [];
         for(const connector of groups) {
            for(const group of connector.groups) {
               data.push({
                  id: `${group.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     group.name,
                     group.description || "",
                     group.uuid,
                  ]
               });
            }
         }
         return data;
      },
      [profile]

   );

      console.log(rules)
   return (

      <Container className="themed-container" fluid>

         <Widget title={detailsTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title={rulesTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={rulesHeaders}
               data={rulesData}
            />

         </Widget>

         <Widget title={groupsTitle} busy={isFetchingDetail}>

            <CustomTable
               headers={groupHeaders}
               data={groupsData}
               hasPagination={true}
            />

         </Widget>


         <Widget title={availableRulesTitle} busy={isFetchingRules}>

            <CustomTable
               headers={availableRulesHeaders}
               data={availableRulesData}
               hasPagination={true}
            />

         </Widget>

         <Widget title={availableGroupsTitle} busy={isFetchingGroups}>

            <CustomTable
               headers={availableGroupsHeaders}
               data={availableGroupsData}
            />

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Compliance Profile"
            body="You are about to delete a Compliance Profile. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={deleteErrorMessage.length > 0}
            caption="Delete Compliance Profile"
            body={
               <>
                  Failed to delete the Compliance Profile that has dependent objects.
                  Please find the details below:
                  <br />
                  <br />
                  {deleteErrorMessage}
               </>
            }
            toggle={() => dispatch(actions.clearDeleteErrorMessages())}
            buttons={[
               { color: "danger", onClick: onForceDeleteComplianceProfile, body: "Force" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

