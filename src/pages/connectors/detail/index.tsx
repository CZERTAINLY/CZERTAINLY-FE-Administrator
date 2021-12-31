import cx from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch, Link } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "reactstrap";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/connectors";

import InventoryStatusBadge from "components/ConnectorStatus";
import styles from "./connectorDetails.module.scss";
import { fieldNameTransform } from "utils/fieldNameTransform";
import Select from "react-select";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

const { MDBBadge } = require("mdbreact");

function ConnectorDetail() {
  const dispatch = useDispatch();
  const connectorDetails = useSelector(selectors.selectConnectorDetails);
  const isFetchingConnector = useSelector(selectors.isFetching);
  const selectAttributes = useSelector(selectors.selectAllAttributes);
  const selectConnectorHealth = useSelector(selectors.selectConnectorHealth);
  const { params } = useRouteMatch();
  const history = useHistory();

  const uuid = (params as any).id as string;
  const ignoreValueTypes = ["FILE", "SECRET", "PASSWORD"];

  const [currentFunctionGroupDisplay, setCurrentFunctionGroupDisplay] =
    useState<any>();
  const [defaultFunctionGroupValue, setDefaultFunctionGroupValue] =
    useState<any>();
  const [currentFunctionGroupKind, setCurrentFunctionGroupKind] =
    useState<any>();
  const [
    currentFunctionGroupKindAttributes,
    setCurrentFunctionGroupKindAttributes,
  ] = useState<any>();
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteConnectorId);
  const confirmAuthorizeId = useSelector(
    selectors.selectConfirmAuthorizeConnectorId
  );
  const deleteErrorMessages = useSelector(selectors.selectDeleteConnectorError);
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);

  useEffect(() => {
    dispatch(actions.requestConnectorDetail(uuid));
    dispatch(actions.requestConnectorHealth(uuid));
  }, [uuid, dispatch]);

  useEffect(() => {
    if (deleteErrorMessages?.length > 0) {
      setDeleteErrorModalOpen(true);
    } else {
      setDeleteErrorModalOpen(false);
    }
  }, [deleteErrorMessages]);

  useEffect(() => {
    if (connectorDetails?.functionGroups?.length) {
      dispatch(actions.requestAllAttributeList(uuid));
      setDefaultFunctionGroupValue(connectorDetails.functionGroups[0].name);
      selectedFunctionGroupDetails(
        connectorDetails.functionGroups[0].functionGroupCode || ""
      );
      setCurrentFunctionGroupKind(connectorDetails.functionGroups[0].kinds[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid, connectorDetails, dispatch]);

  useEffect(() => {
    for (let [key, value] of Object.entries(selectAttributes || {})) {
      if (key === currentFunctionGroupDisplay?.functionGroupCode) {
        for (let [inrKey, inrValue] of Object.entries(value)) {
          if (inrKey === currentFunctionGroupKind) {
            setCurrentFunctionGroupKindAttributes(inrValue);
          }
        }
      }
    }
  }, [selectAttributes, currentFunctionGroupDisplay, currentFunctionGroupKind]);

  const onConfirmDelete = useCallback(() => {
    dispatch(
      actions.confirmDeleteConnector(connectorDetails?.uuid || "", history)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, connectorDetails]);

  const onConfirmAuthorize = useCallback(() => {
    dispatch(actions.confirmAuthorizeConnector(connectorDetails?.uuid || ""));
  }, [dispatch, connectorDetails]);

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
        connectorDetails?.uuid || "",
        history
      )
    );
  };

  const onAuthorizeConnector = (event: any) => {
    dispatch(actions.confirmAuthorizeConnector(connectorDetails?.uuid || ""));
  };

  const onReconnectConnector = () => {
    dispatch(actions.requestReconnectConnector(connectorDetails?.uuid || ""));
  };

  const onForceDeleteConnector = (event: any) => {
    dispatch(
      actions.requestForceDeleteConnector(connectorDetails?.uuid || "", history)
    );
    setDeleteErrorModalOpen(false);
  };

  const getAttributesValues = (attributes: any) => {
    if (attributes.value) {
      if (
        typeof attributes.value !== "string" &&
        ["LIST", "list", "array", "ARRAY", "BOOLEAN", "CREDENTIAL"].includes(
          attributes.type
        )
      ) {
        return attributes.value[0];
      } else {
        return attributes.value;
      }
    } else {
      return "";
    }
  };

  const [expandedRowId, setExpandedRowId] = useState<number | string | null>(
    null
  );

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../connectors/edit/${connectorDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit Connector" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={(event) => onDeleteConnector(event)}
          data-for="delete"
          data-tip
        >
          <i className="fa fa-trash" style={{ color: "red" }} />

          <ToolTip id="delete" message="Delete" />
        </Button>
        <Button
          className="btn btn-link"
          color="white"
          onClick={onReconnectConnector}
          data-for="reconnect"
          data-tip
        >
          <i className="fa fa-plug" />
          <ToolTip id="reconnect" message="Reconnect" />
        </Button>
        <Button
          className="btn btn-link"
          color="white"
          data-for="authorize"
          onClick={onAuthorizeConnector}
          data-tip
        >
          <i className="fa fa-check" />
          <ToolTip id="authorize" message="Authorize" />
        </Button>
      </div>
      <h5>
        Connector <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const healthCheckTitle = () => {
    if (["up", "ok", "healthy"].includes(selectConnectorHealth["status"])) {
      return (
        <div>
          <h5>
            Connector <span className="fw-semi-bold">Health</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <i
              className="fa fa-check-circle"
              style={{ color: "green" }}
              aria-hidden="true"
            ></i>
          </h5>
        </div>
      );
    } else if (
      ["down", "failed", "notOk", "nok", "nOk"].includes(
        selectConnectorHealth["status"]
      )
    ) {
      return (
        <div>
          <h5>
            Connector <span className="fw-semi-bold">Health</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <i
              className="fa fa-exclamation-circle"
              style={{ color: "red" }}
              aria-hidden="true"
            ></i>
          </h5>
        </div>
      );
    } else {
      return (
        <div>
          <h5>
            Connector <span className="fw-semi-bold">Health</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <i
              className="fa fa-question-circle"
              style={{ color: "grey" }}
              aria-hidden="true"
            ></i>
          </h5>
        </div>
      );
    }
  };

  const valuesForFunctionalGroup = connectorDetails?.functionGroups?.map(
    function (group) {
      return { label: group.name, value: group.functionGroupCode };
    }
  );

  const selectedFunctionGroupDetails = (groupCode: string) => {
    for (let i of connectorDetails?.functionGroups || []) {
      if (i.functionGroupCode === groupCode) {
        setCurrentFunctionGroupDisplay(i);
      }
    }
  };

  const healthBody = () => {
    let healthRows = [];
    for (let [key, value] of Object.entries(
      selectConnectorHealth.parts || {}
    )) {
      if (["DOWN", "FAILED", "NOTOK", "NOK"].includes(value.status)) {
        healthRows.push(
          <tr>
            <td>{<MDBBadge color="warning">{key}</MDBBadge>}</td>
            <td>{value.description}</td>
          </tr>
        );
      } else {
        healthRows.push(
          <tr>
            <td>{<MDBBadge color="success">{key}</MDBBadge>}</td>
            <td>{value.description || "OK"}</td>
          </tr>
        );
      }
    }
    return healthRows;
  };

  const getEndPoints = () => {
    let endPoints: any = [];
    for (let key of currentFunctionGroupDisplay?.endPoints || []) {
      let searchKey = "";
      if (
        currentFunctionGroupDisplay?.functionGroupCode ===
        "legacyAuthorityProvider"
      ) {
        if (
          key.context.includes("authorityProvider") ||
          key.context.includes(currentFunctionGroupDisplay?.functionGroupCode)
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
          currentFunctionGroupDisplay?.functionGroupCode || "undefined";
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

  const functionGroupKinds = currentFunctionGroupDisplay?.kinds?.map(function (
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
                  <td>{connectorDetails?.uuid}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{connectorDetails?.name}</td>
                </tr>
                <tr>
                  <td>Url</td>
                  <td>{connectorDetails?.url}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <InventoryStatusBadge status={connectorDetails?.status} />
                  </td>
                </tr>
                <tr>
                  <td>Auth Type</td>
                  <td>{connectorDetails?.authType}</td>
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
                {connectorDetails?.functionGroups?.map(function (name, index) {
                  return (
                    <tr>
                      <td>
                        <MDBBadge color="primary">
                          {fieldNameTransform[name.name || ""] || name.name}
                        </MDBBadge>
                      </td>
                      <td>
                        <div>
                          {name.kinds?.map(function (types) {
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
          <Widget title={healthCheckTitle()}>
            <Table className="table-hover" size="sm">
              <tbody>
                <tr key="healthCheckStatus">
                  <td>Status</td>
                  <td>{selectConnectorHealth.status}</td>
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
              maxMenuHeight={140}
              options={valuesForFunctionalGroup}
              placeholder={defaultFunctionGroupValue}
              menuPlacement="auto"
              key="connectorFunctionGroupDropdown"
              onChange={(event) =>
                selectedFunctionGroupDetails(event?.value || "")
              }
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
                placeholder={currentFunctionGroupDisplay?.kinds[0]}
                menuPlacement="auto"
                key="connectorFunctionGroupKindDropdown"
                onChange={(event: any) =>
                  setCurrentFunctionGroupKind(event?.value || "")
                }
              />
            </Col>
          </Row>
          &nbsp;
          <Table className="table-hover" size="sm">
            <thead>
              <tr>
                <th>
                  <b>Name</b>
                </th>

                <th>
                  <b>Required</b>
                </th>
                <th>
                  <b>Default Value</b>
                </th>
                <th>
                  <b>Details</b>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentFunctionGroupKindAttributes?.map(function (
                attribute: any
              ) {
                return (
                  <>
                    <tr>
                      <td>
                        {attribute.label ||
                          fieldNameTransform[attribute.name] ||
                          attribute.name}
                      </td>
                      <td>{attribute.required ? "Yes" : "No"}</td>
                      <td>
                        {ignoreValueTypes.includes(attribute.type)
                          ? "************"
                          : getAttributesValues(attribute)}
                      </td>
                      <td
                        onClick={() =>
                          setExpandedRowId(
                            expandedRowId === attribute.id ? null : attribute.id
                          )
                        }
                      >
                        <span className={styles.showMore}>Show more...</span>
                      </td>
                    </tr>
                    <tr
                      className={cx(styles.detailRow, {
                        [styles.hidden]: expandedRowId !== attribute.id,
                      })}
                    >
                      <td>
                        <div
                          className={cx({
                            [styles.hidden]: expandedRowId !== attribute.id,
                          })}
                        >
                          <p>
                            <b>Name</b>: {attribute.name}
                          </p>
                          <p>
                            <b>Type</b>: {attribute.type}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div
                          className={cx({
                            [styles.hidden]: expandedRowId !== attribute.id,
                          })}
                        >
                          <p>
                            <b>Read Only</b>:{" "}
                            {attribute.readOnly ? "Yes" : "No"}
                          </p>
                          <p>
                            <b>Editable</b>: {attribute.editable ? "Yes" : "No"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div
                          className={cx({
                            [styles.hidden]: expandedRowId !== attribute.id,
                          })}
                        >
                          <p>
                            <b>Visible</b>: {attribute.visible ? "No" : "Yes"}
                          </p>
                          <p>
                            <b>Multiple Value</b>:{" "}
                            {attribute.multiValue ? "Yes" : "No"}
                          </p>
                        </div>
                      </td>
                      <td className={"w-25"}>
                        <div
                          className={cx({
                            [styles.hidden]: expandedRowId !== attribute.id,
                          })}
                        >
                          <p>
                            <b>Description</b>: {attribute.description}
                          </p>
                          <p>
                            <b>Validation Regex</b>: {attribute.validationRegex}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
        </Widget>
      </Widget>

      <MDBModal
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
      </MDBModal>

      <Spinner active={isFetchingConnector} />
    </Container>
  );
}

export default ConnectorDetail;
