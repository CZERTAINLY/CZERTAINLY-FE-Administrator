import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container, Table } from "reactstrap";

import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/connectors";
import { fieldNameTransform } from "utils/fieldNameTransform";
import MDBColumnName from "components/MDBColumnName";
import { FunctionGroup } from "api/connectors";
import ToolTip from "components/ToolTip";

import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import { inventoryStatus } from "utils/connector";
import CustomTable from "components/CustomTable";

const { MDBBadge } = require("mdbreact");

function ConnectorList() {
  const connectors = useSelector(selectors.selectConnectors);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeletingConnector);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteConnectorId);
  const confirmAuthorizeId = useSelector(
    selectors.selectConfirmAuthorizeConnectorId
  );
  const deleteErrorMessages = useSelector(selectors.selectDeleteConnectorError);
  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const [checkedRows, setCheckedRows] = useState<string[]>([]);

  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState<(string | number)[]>([]);

  useEffect(() => {
    dispatch(actions.requestConnectorsList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deleteErrorMessages?.length > 0) {
      setDeleteErrorModalOpen(true);
    } else {
      setDeleteErrorModalOpen(false);
    }
  }, [deleteErrorMessages]);

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmBulkDeleteConnector(checkedRows));
    setDuplicateRows(checkedRows);
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmDeleteId]);

  const onConfirmAuthorize = useCallback(() => {
    dispatch(actions.confirmBulkAuthorizeConnector(checkedRows));
  }, [dispatch, checkedRows]);

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

  const getKindsForDisplay = (kinds: string[]) => {
    return kinds.map(function (kind) {
      return (
        <>
          <MDBBadge color="secondary" searchvalue={kind}>
            {kind}
          </MDBBadge>
          &nbsp;
        </>
      );
    });
  };

  const onDeleteConnector = (event: any) => {
    dispatch(actions.confirmBulkDeleteConnectorRequest(checkedRows));
  };

  const onAuthorizeConnector = (event: any) => {
    dispatch(actions.confirmBulkAuthorizeConnector(checkedRows));
  };

  const onReconnectConnector = () => {
    dispatch(actions.requestBulkReconnectConnector(checkedRows));
    setCheckedRows([]);
  };

  const onForceDeleteConnector = (event: any) => {
    dispatch(actions.requestBulkForceDeleteConnector(duplicateRows));
    setDuplicateRows([]);
    setDeleteErrorModalOpen(false);
  };

  const title = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`${path}/add`}
          className="btn btn-link"
          data-for="add"
          data-tip
        >
          <i className="fa fa-plus" />
          <ToolTip id="add" message="Add new connector" />
        </Link>
        <Button
          className="btn btn-link"
          color="white"
          onClick={(event) => onDeleteConnector(event)}
          data-for="delete"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
            <i className="fa fa-trash" />
          ) : (
            <i className="fa fa-trash" style={{ color: "red" }} />
          )}

          <ToolTip id="delete" message="Delete" />
        </Button>
        <Button
          className="btn btn-link"
          color="white"
          onClick={onReconnectConnector}
          data-for="reconnect"
          data-tip
          disabled={!(checkedRows.length !== 0)}
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
          disabled={!(checkedRows.length !== 0)}
        >
          <i className="fa fa-check" />
          <ToolTip id="authorize" message="Authorize" />
        </Button>
      </div>
      <h5 className="mt-0">
        <span className="fw-semi-bold">Connector Store</span>
      </h5>
    </div>
  );

  const getFunctionGroupTable = (functionGroups: FunctionGroup[]) => {
    return (
      <table style={{ border: "none" }}>
        <tbody>
          {functionGroups.map(function (group) {
            return (
              <tr style={{ border: "none" }}>
                <td style={{ border: "none" }}>
                  <MDBBadge
                    color="primary"
                    searchvalue={
                      fieldNameTransform[group.name || ""] || group.name
                    }
                  >
                    {fieldNameTransform[group.name || ""] || group.name}
                  </MDBBadge>
                </td>
                <td style={{ border: "none" }}>
                  {getKindsForDisplay(group.kinds)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const getFunctionGroupTableContent = (functionGroups: FunctionGroup[]) => {
    return functionGroups.map(function (group) {
      const groupName =
        fieldNameTransform[group.name || ""] || group.name || "";
      const groupKinds = group.kinds.join(" ");

      return groupName + groupKinds;
    });
  };

  const connectorList = () => {
    let rows: any = [];
    for (let connector of connectors) {
      let connectorStatus = inventoryStatus(connector.status || "");
      let column: any = {};
      column["name"] = {
        content: connector.name,
        styledContent: (
          <Link to={`${path}/detail/${connector.uuid}`}>{connector.name}</Link>
        ),
        lineBreak: true,
      };
      column["functions"] = {
        content: getFunctionGroupTableContent(
          connector.functionGroups || []
        ).join(""),
        styledContent: getFunctionGroupTable(connector.functionGroups || []),
        lineBreak: true,
      };
      column["url"] = {
        content: connector.url,
        lineBreak: true,
      };
      column["status"] = {
        content: connector.status,
        styledContent: (
          <MDBBadge color={connectorStatus[1]}>{connectorStatus[0]}</MDBBadge>
        ),
        lineBreak: true,
      };
      rows.push({
        id: connector.uuid,
        column: column,
        data: connector,
      });
    }
    return rows;
  };

  const connectorRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "connectorName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Function Groups & Kinds" />,
      content: "functions",
      sort: false,
      id: "connectorFunctions",
      width: "35%",
    },
    {
      styledContent: <MDBColumnName columnName="URL" />,
      content: "url",
      sort: false,
      id: "connectorUrl",
      width: "30%",
    },
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "connectorStatus",
      width: "10%",
    },
  ];

  return (
    <div>
      <Container className="themed-container" fluid>
        <Widget title={title}>
          <br />
          <CustomTable
            checkedRows={checkedRows}
            checkedRowsFunction={setCheckedRows}
            data={connectors}
            headers={connectorRowHeaders}
            rows={connectorList()}
          />
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
            Failed to delete some of the connectors. Please find the details
            below
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>
                    <b>Name</b>
                  </th>
                  <th>
                    <b>Dependencies</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {deleteErrorMessages?.map(function (message) {
                  return (
                    <tr>
                      <td>{message.name}</td>
                      <td>{message.message}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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

        <Spinner active={isFetching || isDeleting || isEditing} />
      </Container>
    </div>
  );
}

export default ConnectorList;
