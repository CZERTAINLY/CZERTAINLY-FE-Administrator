
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { actions, selectors } from "ducks/connectors";

import { ConnectorHealthModel, FunctionGroupModel } from "models/connectors";

import Select from "react-select";

import cx from "classnames";

import { Button, Col, Container, Row, Table } from "reactstrap";


import Widget from "components/Widget";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import InventoryStatusBadge from "components/ConnectorStatus";


import styles from "./connectorDetails.module.scss";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { AttributeDescriptorModel, attributeFieldNameTransform } from "models/attributes";
import AttributeDescriptorViewer from "components/Attributes/AttributeDescriptorViewer";

const { MDBBadge } = require("mdbreact");


export default function ConnectorDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const connector = useSelector(selectors.connector);
   const health = useSelector(selectors.connectorHealth);
   const attributes = useSelector(selectors.connectorAttributes);

   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingHealth = useSelector(selectors.isFetchingHealth);
   const isFetchingAttributes = useSelector(selectors.isFetchingAttributes)


   const [currentFunctionGroup, setFunctionGroup] = useState<FunctionGroupModel | undefined>();
   const [currentFunctionGroupKind, setCurrentFunctionGroupKind] = useState<string>();
   const [currentFunctionGroupKindAttributes, setCurrentFunctionGroupKindAttributes] = useState<AttributeDescriptorModel[] | undefined>();

   const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
   //const deleteErrorMessages = useSelector(selectors.selectDeleteConnectorError);


   useEffect(
      () => {
         setFunctionGroup(undefined);
         dispatch(actions.getConnectorDetail(params.id));
         dispatch(actions.getConnectorHealth(params.id));
         dispatch(actions.getAllConnectorAttributes(params.id));
      },
      [params.id, dispatch]
   );


   useEffect(
      () => {

         if (!connector || connector.functionGroups.length == 0) {
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


   /*useEffect(() => {
      if (deleteErrorMessages?.length > 0) {
         setDeleteErrorModalOpen(true);
      } else {
         setDeleteErrorModalOpen(false);
      }
   }, [deleteErrorMessages]);

   useEffect(() => {
      if (connector?.functionGroups?.length) {
         dispatch(actions.requestAllAttributeList(uuid));
         setDefaultFunctionGroupValue(connector.functionGroups[0].name);
         selectedFunctionGroupDetails(
            connector.functionGroups[0].functionGroupCode || ""
         );
         setCurrentFunctionGroupKind(connector.functionGroups[0].kinds[0]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [uuid, connector, dispatch]);

   useEffect(() => {
      for (let [key, value] of Object.entries(attributes || {})) {
         if (key === currentFunctionGroupDisplay?.functionGroupCode) {
            for (let [inrKey, inrValue] of Object.entries(value)) {
               if (inrKey === currentFunctionGroupKind) {
                  setCurrentFunctionGroupKindAttributes(inrValue);
               }
            }
         }
      }
   }, [attributes, currentFunctionGroupDisplay, currentFunctionGroupKind]);

   const onConfirmDelete = useCallback(() => {
      dispatch(
         actions.confirmDeleteConnector(connector?.uuid || "", history)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, connector]);

   const onConfirmAuthorize = useCallback(() => {
      dispatch(actions.confirmAuthorizeConnector(connector?.uuid || ""));
   }, [dispatch, connector]);

   const onCancelAuthorize = useCallback(
      () => dispatch(actions.cancelAuthorizeConnector()),
      [dispatch]
   );

   const onForceDeleteCancel = useCallback(() => {
      dispatch(actions.cancelForceDeleteConnector());
      setDeleteErrorModalOpen(false);
   }, [dispatch]);

   const onCancelDelete = useCallback(
      () => dispatch(actions.cancelDeleteConnector()),
      [dispatch]
   );

   const onDeleteConnector = (event: any) => {
      dispatch(
         actions.confirmDeleteConnectorRequest(
            connector?.uuid || "",
            history
         )
      );
   };

   const onAuthorizeConnector = (event: any) => {
      dispatch(actions.confirmAuthorizeConnector(connector?.uuid || ""));
   };

   const onReconnectConnector = () => {
      dispatch(actions.requestReconnectConnector(connector?.uuid || ""));
   };

   const onForceDeleteConnector = (event: any) => {
      dispatch(
         actions.requestForceDeleteConnector(connector?.uuid || "", history)
      );
      setDeleteErrorModalOpen(false);
   };


   const [expandedRowId, setExpandedRowId] = useState<number | string | null>(
      null
   );
*/

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   const onAddClick = useCallback(
      () => {
      },
      []
   );


   const onReconnectClick = useCallback(
      () => {
      },
      []
   );


   const onAuthorizeClick = useCallback(
      () => {
      },
      []
   );


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
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onAddClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "plug", disabled: false, tooltip: "Reconnect", onClick: () => { onReconnectClick() } },
         { icon: "check", disabled: false, tooltip: "Authorize", onClick: () => { onAuthorizeClick() } }
      ], [onAddClick, onReconnectClick, onAuthorizeClick]
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
            id: "adminName",
            content: "Attribute"
         },
         {
            id: "adminUsername",
            content: "Value"
         },
      ],
      []
   )


   const attributesData: TableDataRow[] = useMemo(
      () => {

         if (!connector) return [];

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
               columns: ["Status", <InventoryStatusBadge status={connector?.status} />]
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
                              <MDBBadge color="secondary">{kind}</MDBBadge>
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
               <td>{<MDBBadge color="warning">{key}</MDBBadge>}</td>
               <td>{value.description}</td>
            </tr>

            :
            <tr>
               <td>{<MDBBadge color="success">{key}</MDBBadge>}</td>
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
         label: group.name,
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

               <Widget title={attributesTitle} busy={isFetchingDetail}>

                  <CustomTable
                     headers={attributesHeaders}
                     data={attributesData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title="Connector Functionality" busy={isFetchingDetail}>

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


         <Widget title="Function Group Details" busy={isFetchingDetail}>

            <hr />

            <Row xs="1" sm="2" md="3" lg="3" xl="4">

               <Col style={{ display: "inline-block" }}>

                  <Select
                     key="connectorFunctionGroupDropdown"
                     maxMenuHeight={140}
                     options={functionGroupSelectData}
                     value={{ label: currentFunctionGroup?.name, value: currentFunctionGroup?.functionGroupCode }}
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
                        placeholder={currentFunctionGroup?.kinds[0]}
                        menuPlacement="auto"
                        key="connectorFunctionGroupKindDropdown"
                        onChange={(event) => onFunctionGroupKindChange(event?.value || "")}
                     />

                  </Col>

               </Row>

               &nbsp;

               <Widget title="End Points">

                  <AttributeDescriptorViewer
                     attributeDescriptors={currentFunctionGroupKindAttributes || []}
                     ignoreValueTypes={[]}
                  />

               </Widget>

               &nbsp;

            </Widget>

         </Widget>

         {/*<MDBModal
            overflowScroll={false}
            isOpen={confirmDeleteId !== ""}
            toggle={onCancelDelete}
         >
            <MDBModalHeader toggle={onCancelDelete}>
               Delete Connector
            </MDBModalHeader>
            <MDBModalBody>
               You are about to delete connectors. Is this what you want to do?
            </MDBModalBody>
            <MDBModalFooter>
               <Button color="danger" onClick={onConfirmDelete}>
                  Yes, delete
               </Button>
               <Button color="secondary" onClick={onCancelDelete}>
                  Cancel
               </Button>
            </MDBModalFooter>
         </MDBModal>

         <MDBModal
            overflowScroll={false}
            isOpen={confirmAuthorizeId !== ""}
            toggle={onCancelAuthorize}
         >
            <MDBModalHeader toggle={onCancelAuthorize}>
               Authorize Connector
            </MDBModalHeader>
            <MDBModalBody>
               You are about authorize a connector. Is this what you want to do?
            </MDBModalBody>
            <MDBModalFooter>
               <Button color="success" onClick={onConfirmAuthorize}>
                  Yes, Authorize
               </Button>
               <Button color="secondary" onClick={onCancelAuthorize}>
                  Cancel
               </Button>
            </MDBModalFooter>
         </MDBModal>

         <MDBModal
            overflowScroll={false}
            isOpen={deleteErrorModalOpen}
            toggle={onForceDeleteCancel}
         >
            <MDBModalHeader toggle={onForceDeleteCancel}>
               Delete Connector
            </MDBModalHeader>
            <MDBModalBody>
               Failed to delete the connector as the connector has dependent objects.
               Please find the details below:
               <br />
               <br />
               {deleteErrorMessages?.map(function (message) {
                  return message.message;
               })}
            </MDBModalBody>
            <MDBModalFooter>
               <Button color="danger" onClick={onForceDeleteConnector}>
                  Force
               </Button>
               <Button color="secondary" onClick={onForceDeleteCancel}>
                  Cancel
               </Button>
            </MDBModalFooter>
            </MDBModal>*/}

      </Container>

   );
}
