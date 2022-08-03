import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { Col, Container, Label, Row } from "reactstrap";

import { actions, selectors } from "ducks/compliance-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import { ComplianceGroupsModel, ComplianceRaProfileModel, ComplianceRulesModel } from "models";
import StatusBadge from "components/StatusBadge";
import AssociateRaProfileDialogBody from "components/pages/compliance-profiles/AssociateRaProfileDialogBody";
import AddRuleWithAttributesDialogBody from "components/pages/compliance-profiles/AddRuleWithAttributesDialogBody";


export default function ComplianceProfileDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const profile = useSelector(selectors.complianceProfile);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);

   const rules = useSelector(selectors.rules);

   const groups = useSelector(selectors.groups);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

   const [displayNewRules, setDisplayNewRules] = useState<boolean>(false);
   const [displayNewGroups, setDisplayNewGroups] = useState<boolean>(false);

   const [addRaProfile, setAddRaProfile] = useState<boolean>(false);
   const [addRuleWithAttributes, setAddRuleWithAttributes] = useState<boolean>(false);
   const [addAttributeRuleDetails, setAddAttributeRuleDetails] = useState<any>();

   const [alreadyAssociatedRuleUuids, setAlreadyAssociatedRuleUuids] = useState<string[]>([]);
   const [alreadyAssociatedGroupUuids, setAlreadyAssociatedGroupUuids] = useState<string[]>([]);


   useEffect(

      () => {

         if (!params.id) return;

         dispatch(actions.getComplianceProfile({ uuid: params.id }));
         dispatch(actions.listComplianceRules());
         dispatch(actions.listComplianceGroups());

      },
      [params.id, dispatch]

   );

   useEffect(

      () => {

         if (!params.id) return;

         let alreadyAssociatedRuleUuidsLcl: string[] = [];
         let alreadyAssociatedGroupUuidsLcl: string[] = [];

         for (let connector of profile?.rules || []) {
            for (let rule of connector.rules) {
               alreadyAssociatedRuleUuidsLcl.push(rule.uuid+"-"+connector.connectorUuid+"-"+connector.kind);
            }
         }

         for (let connector of profile?.groups || []) {
            for (let group of connector.groups) {
               alreadyAssociatedGroupUuidsLcl.push(group.uuid+"-"+connector.connectorUuid+"-"+connector.kind);
            }
         }

         setAlreadyAssociatedRuleUuids(alreadyAssociatedRuleUuidsLcl);
         setAlreadyAssociatedGroupUuids(alreadyAssociatedGroupUuidsLcl);

      },
      [profile]

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

   const onAddRule = useCallback(

      (connectorUuid: string, connectorName: string, kind: string, rule: ComplianceRulesModel, attributes?: any) => {

         if (!profile) return;

         dispatch(actions.addRule({ uuid: profile.uuid, connectorName: connectorName, connectorUuid: connectorUuid, kind: kind, ruleUuid: rule.uuid, description: rule.description, ruleName: rule.name, groupUuid: rule.groupUuid, attributes: attributes }));
      },
      [profile]

   )


   const onAddGroup = useCallback(

      (connectorUuid: string, connectorName: string, kind: string, group: ComplianceGroupsModel) => {

         if (!profile) return;

         dispatch(actions.addGroup({ uuid: profile.uuid, connectorName: connectorName, connectorUuid: connectorUuid, kind: kind, groupUuid: group.uuid, groupName: group.name, description: group.description || "" }));
      },
      [profile]

   )


   const onDeleteRule = useCallback(

      (connectorUuid: string, kind: string, rule: ComplianceRulesModel, attributes?: any) => {

         if (!profile) return;

         dispatch(actions.deleteRule({ uuid: profile.uuid, connectorUuid: connectorUuid, kind: kind, ruleUuid: rule.uuid }));
      },
      [profile]

   )


   const onDeleteGroup = useCallback(

      (connectorUuid: string, kind: string, group: ComplianceGroupsModel) => {

         if (!profile) return;

         dispatch(actions.deleteGroup({ uuid: profile.uuid, connectorUuid: connectorUuid, kind: kind, groupUuid: group.uuid }));
      },
      [profile,dispatch]

   )

   const onDissociateRaProfile = useCallback(

      (raProfileUuid: string) => {

         if (!profile) return;

         dispatch(actions.dissociateRaProfile({ uuid: profile.uuid, raProfileUuids: [raProfileUuid] }));
      },
      [profile, dispatch]

   )


   const onComplianceCheck = useCallback(

      () => {

         
         if (!profile?.uuid) return;

         dispatch(actions.checkCompliance({ uuids: [profile.uuid] }));
      },
      [dispatch]

   )

   


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "check", disabled: false, tooltip: "Check Compliance", onClick: () => { onComplianceCheck(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      ],
      []

   );


   const raProfileButtons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "plus", disabled: false, tooltip: "Associate RA Profile", onClick: () => { setAddRaProfile(true); } },
      ],
      []

   );

   const onAddRuleWithAttributes = (connectorUuid: string, connectorName: string, kind: string, rule: ComplianceRulesModel) => {
      setAddAttributeRuleDetails({
         connectorUuid: connectorUuid,
         connectorName: connectorName,
         kind: kind,
         rule: rule
      });
      setAddRuleWithAttributes(true);
   }

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


   const raProfileTitle = useMemo(

      () => (

         <div>
            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={raProfileButtons} />
            </div>

            <h5>
               <span className="fw-semi-bold">Associated RA Profiles</span>
            </h5>

         </div>

      ), []

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
            id: "connectorKind",
            content: "Connector Kind",
         },
         {
            id: "ruleName",
            content: "Rule Name",
         },
         {
            id: "action",
            content: "Action",
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
            id: "connectorKind",
            content: "Connector Kind",
         },
         {
            id: "groupName",
            content: "Group Name",
         },
         {
            id: "action",
            content: "Action",
         }
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


   const raProfileHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "raProfileName",
            content: "Name",
         },
         {
            id: "status",
            content: "Status",
         },
         {
            id: "action",
            content: "Action",
         }
      ],
      []

   );


   const raProfileData: TableDataRow[] = useMemo(

      () => !profile ? [] : profile.raProfiles.map(

         (raProfile: ComplianceRaProfileModel) => ({

            id: raProfile.uuid,
            columns: [
               raProfile.name,
               <StatusBadge enabled={raProfile.enabled} />,
               <WidgetButtons buttons={[{ icon: "minus-square", disabled: false, tooltip: "Remove", onClick: () => { onDissociateRaProfile(raProfile.uuid); }, additionalTooltipId: raProfile.uuid }]} />
            ]
         })

      ),
      [profile]

   );



   const rulesData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.rules) return [];

         let data: TableDataRow[] = [];
         for (const connector of profile.rules) {
            for (const rule of connector.rules) {
               const buttons: WidgetButtonProps[] = [
                  { icon: "minus-square", disabled: false, tooltip: "Remove", onClick: () => { onDeleteRule(connector.connectorUuid, connector.kind, rule); }, additionalTooltipId: rule.uuid },
                  { icon: "info", disabled: false, tooltip: getRuleTooltip(rule, connector.connectorName, connector.kind), tooltipScheme: "info", onClick: () => { }, additionalTooltipId: rule.uuid },
               ]
               data.push({
                  id: `${rule.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     rule.name,
                     <WidgetButtons buttons={buttons} />
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
         for (const connector of profile.groups) {
            for (const group of connector.groups) {
               const buttons: WidgetButtonProps[] = [
                  { icon: "minus-square", disabled: false, tooltip: "Remove", onClick: () => { onDeleteGroup(connector.connectorUuid, connector.kind, group); }, additionalTooltipId: group.uuid },
                  { icon: "info", disabled: false, tooltip: getRuleTooltip(group, connector.connectorName, connector.kind), tooltipScheme: "info", onClick: () => { }, additionalTooltipId: group.uuid },
               ]
               data.push({
                  id: `${group.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     group.name,
                     <WidgetButtons buttons={buttons} />
                  ]
               });
            }
         }
         return data;
      },
      [profile]

   );

   function getRuleTooltip(rule: ComplianceRulesModel, connectorName: string, connectorKind: string) {
      return <Widget title={rule.name}>
         <CustomTable
            headers={detailHeaders}
            data={[
               {
                  id: "connectorName", columns: ["Connector Name", connectorName]
               },
               {
                  id: "connectorKind", columns: ["Connector Kind", connectorKind]
               },
               {
                  id: "ruleName", columns: ["Rule Name", rule.name]
               },
               {
                  id: "ruleDescription", columns: ["Description", rule.description || ""]
               },
               {
                  id: "groupUuid", columns: ["Group UUID", rule.groupUuid || ""]
               }
            ]}
         />
      </Widget>
   }


   const availableRulesData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.rules) return [];

         let data: TableDataRow[] = [];
         for (const connector of rules) {
            for (const rule of connector.rules) {
               if (alreadyAssociatedRuleUuids.includes(rule.uuid+"-"+connector.connectorUuid+"-"+connector.kind)) continue;
               const buttons: WidgetButtonProps[] = [
                  {
                     icon: "plus",
                     disabled: false,
                     tooltip: "Add",
                     onClick: () => {
                        rule.attributes ?
                           onAddRuleWithAttributes(connector.connectorUuid, connector.connectorName, connector.kind, rule)
                           : onAddRule(connector.connectorUuid, connector.connectorName, connector.kind, rule)
                     },
                     additionalTooltipId: rule.uuid
                  },

                  { icon: "info", disabled: false, tooltip: getRuleTooltip(rule, connector.connectorName, connector.kind), tooltipScheme: "info", onClick: () => { }, additionalTooltipId: rule.uuid },
               ]
               data.push({
                  id: `${rule.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     rule.name,
                     <WidgetButtons buttons={buttons} />
                  ]
               });
            }
         }
         return data;
      },
      [profile, alreadyAssociatedRuleUuids]

   );


   const availableGroupsData: TableDataRow[] = useMemo(

      () => {
         if (!profile) return [];
         if (!profile.groups) return [];

         let data: TableDataRow[] = [];
         for (const connector of groups) {
            for (const group of connector.groups) {
               if (alreadyAssociatedGroupUuids.includes(group.uuid+"-"+connector.connectorUuid+"-"+connector.kind)) continue;
               const buttons: WidgetButtonProps[] = [
                  { icon: "plus", disabled: false, tooltip: "Add", onClick: () => { onAddGroup(connector.connectorUuid, connector.connectorName, connector.kind, group); }, additionalTooltipId: group.uuid },
                  { icon: "info", disabled: false, tooltip: getRuleTooltip(group, connector.connectorName, connector.kind), tooltipScheme: "info", onClick: () => { }, additionalTooltipId: group.uuid },
               ]
               data.push({
                  id: `${group.uuid}-${connector.connectorUuid}`,
                  columns: [
                     connector.connectorName,
                     connector.kind,
                     group.name,
                     <WidgetButtons buttons={buttons} />
                  ]
               });
            }
         }
         return data;
      },
      [profile, alreadyAssociatedGroupUuids]

   );


   return (

      <Container className="themed-container" fluid>


         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title={detailsTitle} busy={isFetchingDetail}>

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />
               </Widget>
            </Col>

            <Col>
               <Widget title={raProfileTitle} busy={isFetchingDetail}>

                  <CustomTable
                     headers={raProfileHeaders}
                     data={raProfileData}
                  />
               </Widget>
            </Col>


         </Row>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={rulesTitle} busy={isFetchingDetail}>

                  <CustomTable
                     headers={rulesHeaders}
                     data={rulesData}
                     hasPagination={true}
                  />

                  <hr />

                  <div>

                     <h5>
                        <span className="fw-semi-bold">Add Rules</span>
                     </h5>

                  </div>

                  <Label for="addNewRuleOption">Check to add more rules</Label>&nbsp;&nbsp;

                  <input id="addNewRuleOption" type="checkbox" onClick={(e) => setDisplayNewRules(e.currentTarget.checked)} />


                  {displayNewRules ?
                     <CustomTable
                        headers={availableRulesHeaders}
                        data={availableRulesData}
                        hasPagination={true}
                        canSearch={true}
                     />
                     : null}

               </Widget>

            </Col>
            <Col>


               <Widget title={groupsTitle} busy={isFetchingDetail}>

                  <CustomTable
                     headers={groupHeaders}
                     data={groupsData}
                     hasPagination={true}
                  />

                  <hr />

                  <div>

                     <h5>
                        <span className="fw-semi-bold" >Add Groups</span>
                     </h5>

                  </div>

                  <Label for="addNewGroupOption">Check to add more groups</Label>&nbsp;&nbsp;

                  <input id="addNewGroupOption" type="checkbox" onClick={(e) => setDisplayNewGroups(e.currentTarget.checked)} />


                  {displayNewGroups ?
                     <CustomTable
                        headers={availableGroupsHeaders}
                        data={availableGroupsData}
                        hasPagination={true}
                        canSearch={true}
                     />
                     : null}

               </Widget>
            </Col>
         </Row>

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

         <Dialog
            isOpen={addRaProfile}
            caption="Associate RA protocol"
            body={AssociateRaProfileDialogBody({ visible: addRaProfile, onClose: () => setAddRaProfile(false), complianceProfileUuid: profile?.uuid, availableRaProfileUuids: profile?.raProfiles.map(e => e.uuid) })}
            toggle={() => setAddRaProfile(false)}
            buttons={[]}
         />


         <Dialog
            isOpen={addRuleWithAttributes}
            caption="Attributes"
            body={AddRuleWithAttributesDialogBody({
               onClose: () => setAddRuleWithAttributes(false), complianceProfileUuid: profile?.uuid,
               connectorUuid: addAttributeRuleDetails?.connectorUuid,
               connectorName: addAttributeRuleDetails?.connectorName,
               kind: addAttributeRuleDetails?.kind,
               ruleUuid: addAttributeRuleDetails?.rule.uuid,
               ruleName: addAttributeRuleDetails?.rule.name,
               ruleDescription: addAttributeRuleDetails?.rule?.description,
               groupUuid: addAttributeRuleDetails?.rule?.groupUuid,
               attributes: addAttributeRuleDetails?.rule?.attributes
            })}
            toggle={() => setAddRuleWithAttributes(false)}
            buttons={[]}
         />

      </Container>
   );


}

