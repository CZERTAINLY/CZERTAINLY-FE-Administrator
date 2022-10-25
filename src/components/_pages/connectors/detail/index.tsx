import styles from "./connectorDetails.module.scss";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ConnectorHealthModel, FunctionGroupModel } from "models/connectors";
import { AttributeDescriptorModel } from "models/attributes/AttributeDescriptorModel";

import { actions, selectors } from "ducks/connectors";

import Select from "react-select";
import { Badge, Col, Container, Row, Table } from "reactstrap";

import Widget from "components/Widget";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import AttributeDescriptorViewer from "components/Attributes/AttributeDescriptorViewer";
import Dialog from "components/Dialog";
import {attributeFieldNameTransform} from "utils/attributes";
import { inventoryStatus } from "utils/connector";
import { useNavigate, useParams } from "react-router-dom";


export default function ConnectorDetail() {

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const { id } = useParams();

   const connector = useSelector(selectors.connector);
   const health = useSelector(selectors.connectorHealth);
   const attributes = useSelector(selectors.connectorAttributes);

   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingHealth = useSelector(selectors.isFetchingHealth);
   const isFetchingAttributes = useSelector(selectors.isFetchingAttributes);
   const isReconnecting = useSelector(selectors.isReconnecting);
   const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
   const isAuthorizing = useSelector(selectors.isAuthorizing);

   const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

   const [currentFunctionGroup, setFunctionGroup] = useState<FunctionGroupModel | undefined>();
   const [currentFunctionGroupKind, setCurrentFunctionGroupKind] = useState<string>();
   const [currentFunctionGroupKindAttributes, setCurrentFunctionGroupKindAttributes] = useState<AttributeDescriptorModel[] | undefined>();

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
   const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);


   useEffect(

      () => {

         setFunctionGroup(undefined);
         if (id) {
             dispatch(actions.getConnectorDetail({uuid: id}));
             dispatch(actions.getConnectorHealth({uuid: id}));
             dispatch(actions.getConnectorAllAttributesDescriptors({uuid: id}));
         }

      },
      [id, dispatch]

   );


   useEffect(

      () => {

         if (!connector || connector.functionGroups.length === 0) {
            setFunctionGroup(undefined);
            setCurrentFunctionGroupKind(undefined);
            return;
         }

         setFunctionGroup(connector.functionGroups[0]);

         if (connector.functionGroups[0].kinds.length > 0) {
            setCurrentFunctionGroupKind(connector.functionGroups[0].kinds[0]);
         } else {
            setCurrentFunctionGroupKind(undefined);
         }

      },
      [connector]

   );


   useEffect(

      () => {

         let attrs: AttributeDescriptorModel[] | undefined = undefined;

         if (attributes && connector && currentFunctionGroup && currentFunctionGroupKind) {
            const fgAttrs = attributes[currentFunctionGroup.functionGroupCode]
            if (fgAttrs) attrs = fgAttrs[currentFunctionGroupKind];
         }

         setCurrentFunctionGroupKindAttributes(attrs);

      },
      [attributes, connector, currentFunctionGroup, currentFunctionGroupKind]

   );


   const onEditClick = useCallback(

      () => {

         navigate(`../../connectors/edit/${connector?.uuid}`);

      },
      [connector, navigate]

   );


   const onReconnectClick = useCallback(

      () => {

         if (!connector) return;
         dispatch(actions.reconnectConnector({ uuid: connector.uuid }));

      },

      [connector, dispatch]

   );


   const onDeleteConfirmed = useCallback(

      () => {

         if (!connector) return;
         dispatch(actions.deleteConnector({ uuid: connector.uuid }));
         setConfirmDelete(false);

      },
      [connector, dispatch]

   );


   const onAuthorizeConfirmed = useCallback(

      () => {

         if (!connector) return;
         setConfirmAuthorize(false);
         dispatch(actions.authorizeConnector({ uuid: connector.uuid }));

      },
      [dispatch, connector]

   );


   const onForceDeleteConnector = useCallback(

      () => {

         if (!connector) return;
         dispatch(actions.clearDeleteErrorMessages());
         dispatch(actions.bulkForceDeleteConnectors({ uuids: [connector.uuid], successRedirect: `../` }));

      },
      [connector, dispatch]

   )


   const onFunctionGroupChange = useCallback(

      (groupCode: string) => {

         const group = (connector?.functionGroups || []).find(group => group.functionGroupCode === groupCode);
         if (group) setFunctionGroup(group);

      },
      [connector]

   );


   const onFunctionGroupKindChange = useCallback(

      (kind: string) => setCurrentFunctionGroupKind(kind),
      []

   );


   const widgetButtons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "plug", disabled: false, tooltip: "Reconnect", onClick: () => { onReconnectClick() } },
         { icon: "check", disabled: connector ? connector.status === "connected" : false, tooltip: "Approve", onClick: () => { setConfirmAuthorize(true) } }
      ],
      [onEditClick, onReconnectClick, setConfirmDelete, setConfirmAuthorize, connector]

   );


   const attributesTitle = useMemo(

      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={widgetButtons} />
            </div>

            <h5>
               Connector <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ),
      [widgetButtons]

   );


   const attributesHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "property",
            content: "Property"
         },
         {
            id: "value",
            content: "Value"
         },
      ],
      []

   )


   const attributesData: TableDataRow[] = useMemo(

      () => {

         if (!connector) return [];

         const connectorStatus = inventoryStatus(connector.status);

         return [
            {
               id: "uuid",
               columns: ["UUID", connector.uuid]
            },
            {
               id: "name",
               columns: ["Name", connector.name],
            },
            {
               id: "url",
               columns: ["URL", connector.url]
            },
            {
               id: "status",
               columns: ["Status", <Badge color={`${connectorStatus[1]}`}>{connectorStatus[0]}</Badge>]
            },
            {
               id: "authType",
               columns: ["Auth Type", connector.authType]
            }

         ]

      },
      [connector]

   )


   const functionalityHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "functionGroup",
            content: "Function Group"
         },
         {
            id: "kind",
            content: "Kind"
         },
      ],
      []

   )


   const functionalityData: TableDataRow[] = useMemo(

      () => (connector?.functionGroups || []).map(

         functionGroup => (
            {
               id: functionGroup.name,
               columns: [
                  functionGroup.name,
                  <>
                     {functionGroup.kinds?.map(
                        kind => (
                           <div key={kind} className={styles.kind}>
                              <Badge color="secondary">{kind}</Badge>
                           </div>
                        )
                     )}
                  </>
               ]
            }
         )

      ),
      [connector]

   );


   const healthTitle = (

      <div>

         <h5>

            Connector <span className="fw-semi-bold">Health</span>
            &nbsp;&nbsp;&nbsp;&nbsp;

            {
               ["up", "ok", "healthy"].includes(health ? health.status : "unknown")
                  ? <i className="fa fa-check-circle" style={{ color: "green" }} aria-hidden="true" />
                  : ["down", "failed", "notOk", "nok", "nOk"].includes(health ? health.status : "unknown")
                     ? <i className="fa fa-exclamation-circle" style={{ color: "red" }} aria-hidden="true" />
                     : <i className="fa fa-question-circle" style={{ color: "grey" }} aria-hidden="true" />
            }

         </h5>

      </div>

   )


   const healthBody = (parts?: ConnectorHealthModel[]) => {

      if (!parts) return <></>;

      return Object.entries(parts).map(

         ([key, value]) => ["ok", "failed", "down", "nok", "unknown"].includes(value.status)
            ?
            <tr>
               <td>{<Badge color="warning">{key}</Badge>}</td>
               <td>{value.description}</td>
            </tr>

            :
            <tr>
               <td>{<Badge color="success">{key}</Badge>}</td>
               <td>{value.description || "OK"}</td>
            </tr>
      )

   };


   const endPointsHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            sortable: true,
            sort: "asc",
            content: "Name"
         },
         {
            id: "context",
            sortable: true,
            content: "Context"
         },
         {
            id: "method",
            sortable: true,
            content: "Method"
         }
      ],
      []
   )


   const endPointsData: TableDataRow[] = useMemo(

      () => (currentFunctionGroup?.endPoints || []).map(

         endPoint => ({

            id: endPoint.name,
            columns: [
               endPoint.name,
               endPoint.context,
               endPoint.method
            ]

         })
      ),
      [currentFunctionGroup]

   );


   const functionGroupSelectData = connector?.functionGroups?.map(

      group => ({
         label: attributeFieldNameTransform[group?.name || ""] || group?.name,
         value: group.functionGroupCode
      })

   ) || [];


   const functionGroupKinds = currentFunctionGroup?.kinds?.map(
      kind => ({ label: kind, value: kind })
   ) || [];


   return (

      <Container className="themed-container" fluid>

         <Row xs="1" sm="1" md="2" lg="2" xl="2">

            <Col>

               <Widget title={attributesTitle} busy={isFetchingDetail || isBulkReconnecting || isReconnecting || isAuthorizing}>

                  <CustomTable
                     headers={attributesHeaders}
                     data={attributesData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title="Connector Functionality" busy={isFetchingDetail || isReconnecting}>

                  <CustomTable
                     headers={functionalityHeaders}
                     data={functionalityData}
                  />

               </Widget>


               <Widget title={healthTitle} busy={isFetchingHealth}>

                  <Table className="table-hover" size="sm">

                     <tbody>

                        <tr key="healthCheckStatus">
                           <td>Status</td>
                           <td>{health?.status || "unknown"}</td>
                        </tr>

                        {healthBody()}

                     </tbody>

                  </Table>

               </Widget>

            </Col>

         </Row>


         <Widget title="Function Group Details" busy={isFetchingDetail || isReconnecting}>

            <hr />

            <Row xs="1" sm="2" md="3" lg="3" xl="4">

               <Col style={{ display: "inline-block" }}>

                  <Select
                     maxMenuHeight={140}
                     options={functionGroupSelectData}
                     value={{ label: attributeFieldNameTransform[currentFunctionGroup?.name || ""] || currentFunctionGroup?.name, value: currentFunctionGroup?.functionGroupCode }}
                     menuPlacement="auto"
                     onChange={(event) => onFunctionGroupChange(event?.value || "")}
                  />

               </Col>

            </Row>

            &nbsp;

            <Widget title="End Points">

               <CustomTable
                  headers={endPointsHeaders}
                  data={endPointsData}
               />

            </Widget>

            <hr />

            <Widget title="Attributes" busy={isFetchingAttributes}>

               <Row xs="1" sm="2" md="3" lg="3" xl="4">

                  <Col>

                     <Select
                        maxMenuHeight={140}
                        options={functionGroupKinds}
                        value={{ label: currentFunctionGroupKind, value: currentFunctionGroupKind }}
                        placeholder={currentFunctionGroup?.kinds[0]}
                        menuPlacement="auto"
                        key="connectorFunctionGroupKindDropdown"
                        onChange={(event) => onFunctionGroupKindChange(event?.value || "")}
                     />

                  </Col>

               </Row>

               &nbsp;

               <Widget title="End Points">

                  <AttributeDescriptorViewer attributeDescriptors={currentFunctionGroupKindAttributes || []} />

               </Widget>

               &nbsp;

            </Widget>

         </Widget>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete Connector"
            body="You are about to delete an Connector. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={confirmAuthorize}
            caption="Approve Connector"
            body="You are about to approve an Connector. Is this what you want to do?"
            toggle={() => setConfirmAuthorize(false)}
            buttons={[
               { color: "success", onClick: onAuthorizeConfirmed, body: "Yes, approve" },
               { color: "secondary", onClick: () => setConfirmAuthorize(false), body: "Cancel" },
            ]}
         />

         <Dialog
            isOpen={deleteErrorMessage !== ""}
            caption="Delete Connector"
            body={
               <>
                  Failed to delete the connector as the connector has dependent objects.
                  Please find the details below:
                  <br />
                  <br />
                  {deleteErrorMessage}
               </>
            }
            toggle={() => dispatch(actions.clearDeleteErrorMessages())}
            buttons={[
               { color: "danger", onClick: onForceDeleteConnector, body: "Force" },
               { color: "secondary", onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: "Cancel" },
            ]}
         />

      </Container>

   );
}
