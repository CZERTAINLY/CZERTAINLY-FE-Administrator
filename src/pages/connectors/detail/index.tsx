
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";

import { actions, selectors } from "ducks/connectors";

import { ConnectorHealthModel, FunctionGroupModel } from "models/connectors";

import Select from "react-select";

import cx from "classnames";

import { Button, Col, Container, Row, Table } from "reactstrap";


import Widget from "components/Widget";
import InventoryStatusBadge from "components/ConnectorStatus";


import styles from "./connectorDetails.module.scss";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import { attributeFieldNameTransform } from "models/attributes";

const { MDBBadge } = require("mdbreact");


export default function ConnectorDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const connector = useSelector(selectors.connector);
   const attributes = useSelector(selectors.connectorAttributes);
   const health = useSelector(selectors.connectorHealth);

   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isFetchingHealth = useSelector(selectors.isFetchingHealth);
   const isFetchingAttributes = useSelector(selectors.isFetchingAttributes)

   //const deleteErrorMessages = useSelector(selectors.selectDeleteConnectorError);

   const ignoreValueTypes = ["FILE", "SECRET", "PASSWORD"];

   const [functionGroup, setFunctionGroup] = useState<FunctionGroupModel | undefined>();

   const [currentFunctionGroupKind, setCurrentFunctionGroupKind] = useState<any>();
   const [currentFunctionGroupKindAttributes, setCurrentFunctionGroupKindAttributes] = useState<any>();
   const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);

   useEffect(() => {
      dispatch(actions.getConnectorDetail(params.id));
      dispatch(actions.getConnectorHealth(params.id));
      dispatch(actions.getAllConnectorAttributes(params.id));
   }, [params.id, dispatch]);

   useEffect(() => {

      if (!connector) return;

      if (connector.functionGroups.length > 0) setFunctionGroup(connector.functionGroups[0]);

   }, [connector]);

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

   const onAddClick = () => {
   }

   const onReconnectClick = () => {
   }

   const onAuthorizeClick = () => {
   }

   const buttons: WidgetButtonProps[] = [
      { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onAddClick(); } },
      { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
      { icon: "plug", disabled: false, tooltip: "Reconnect", onClick: () => { onReconnectClick() } },
      { icon: "check", disabled: false, tooltip: "Authorize", onClick: () => { onAuthorizeClick() } }
   ];

   const attributesTitle = (

      <div>

         <div className="pull-right mt-n-xs">
            <WidgetButtons buttons={buttons} />
         </div>

         <h5>
            Connector <span className="fw-semi-bold">Details</span>
         </h5>

      </div>

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

   const valuesForFunctionGroup = connector?.functionGroups?.map(

      group => ({
         label: group.name,
         value: group.functionGroupCode
      })

   ) || [];


   const onFunctionGroupChange = (groupCode: string) => {

      const group = (connector?.functionGroups || []).find(group => group.functionGroupCode === groupCode);
      if (group) setFunctionGroup(group);

   };


   const healthBody = (parts?: ConnectorHealthModel[]) => {

      if (!parts) return <></>;

      return Object.entries(parts).map(

         ([key, value]) => ["ok", "failed", "down", "nok", "unknown"].includes(value.status)
            ? (
               <tr>
                  <td>{<MDBBadge color="warning">{key}</MDBBadge>}</td>
                  <td>{value.description}</td>
               </tr>
            )
            :
            <tr>
               <td>{<MDBBadge color="success">{key}</MDBBadge>}</td>
               <td>{value.description || "OK"}</td>
            </tr>
      )

   };

   const getEndPoints = () => {

      let endPoints: any = [];


      for (let key of functionGroup?.endPoints || []) {
         let searchKey = "";
         if (
            functionGroup?.functionGroupCode ===
            "legacyAuthorityProvider"
         ) {
            if (
               key.context.includes("authorityProvider") ||
               key.context.includes(functionGroup?.functionGroupCode)
            ) {
               endPoints.push(
                  <tr>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.name}</div>
                     </td>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.context}</div>
                     </td>
                     <td>{key.method}</td>
                  </tr>
               );
            }
         } else {
            searchKey =
               functionGroup?.functionGroupCode || "undefined";
            if (key.context.includes(searchKey)) {
               endPoints.push(
                  <tr>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.name}</div>
                     </td>
                     <td>
                        <div style={{ wordBreak: "break-all" }}>{key.context}</div>
                     </td>
                     <td>{key.method}</td>
                  </tr>
               );
            }
         }
      }
      return endPoints;
   };

   const functionGroupKinds = functionGroup?.kinds?.map(function (
      kind: string
   ) {
      return { label: kind, value: kind };
   });

   return (
      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>
               <Widget title={attributesTitle}>
                  <Table className="table-hover" size="sm">
                     <thead>
                        <tr>
                           <th>Attribute</th>
                           <th>Value</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>Id</td>
                           <td>{connector?.uuid}</td>
                        </tr>
                        <tr>
                           <td>Name</td>
                           <td>{connector?.name}</td>
                        </tr>
                        <tr>
                           <td>Url</td>
                           <td>{connector?.url}</td>
                        </tr>
                        <tr>
                           <td>Status</td>
                           <td>
                              <InventoryStatusBadge status={connector?.status} />
                           </td>
                        </tr>
                        <tr>
                           <td>Auth Type</td>
                           <td>{connector?.authType}</td>
                        </tr>
                     </tbody>
                  </Table>
               </Widget>
            </Col>
            <Col>
               <Widget title="Connector Functionality">
                  <Table className="table-hover" size="sm">
                     <thead>
                        <tr>
                           <th>Function Group</th>
                           <th>Kind</th>
                        </tr>
                     </thead>
                     <tbody>
                        {connector?.functionGroups?.map(functionGroup => {
                           return (
                              <tr>
                                 <td>
                                    <MDBBadge color="primary">
                                       {attributeFieldNameTransform[functionGroup.name || ""] || functionGroup.name}
                                    </MDBBadge>
                                 </td>
                                 <td>
                                    <div>
                                       {functionGroup.kinds?.map(function (types) {
                                          return (
                                             <div className={styles.kind}>
                                                <MDBBadge color="secondary">{types}</MDBBadge>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </Table>
               </Widget>

               <Widget title={healthTitle}>
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

         <Widget title="Function Group Details">
            <hr />
            <Row xs="1" sm="2" md="3" lg="3" xl="4">
               <Col style={{ display: "inline-block" }}>
                  <Select
                     key="connectorFunctionGroupDropdown"
                     maxMenuHeight={140}
                     options={valuesForFunctionGroup}
                     value={ { label: functionGroup?.name, value: functionGroup?.functionGroupCode } }
                     menuPlacement="auto"
                     onChange={(event) => onFunctionGroupChange(event?.value || "")}
                  />
               </Col>
            </Row>

            &nbsp;

            <Widget title="End Points">
               <Table className="table-hover" size="sm">
                  <thead>
                     <tr>
                        <th>
                           <b>Name</b>
                        </th>
                        <th>
                           <b>Context</b>
                        </th>
                        <th>
                           <b>Method</b>
                        </th>
                     </tr>
                  </thead>
                  <tbody>{getEndPoints()}</tbody>
               </Table>
            </Widget>
            <hr />
            <Widget title="Attributes">
               <Row xs="1" sm="2" md="3" lg="3" xl="4">
                  <Col>
                     <Select
                        maxMenuHeight={140}
                        options={functionGroupKinds}
                        placeholder={functionGroup?.kinds[0]}
                        menuPlacement="auto"
                        key="connectorFunctionGroupKindDropdown"
                        onChange={(event: any) =>
                           setCurrentFunctionGroupKind(event?.value || "")
                        }
                     />
                  </Col>
               </Row>
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
