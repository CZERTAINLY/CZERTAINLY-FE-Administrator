import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";

import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/clients";
import MDBColumnName from "components/MDBColumnName";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import CustomTable from "components/CustomTable";

function ClientList() {
  const clients = useSelector(selectors.selectClients);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeletingClient);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteClientId);

  const [checkedRows, setCheckedRows] = useState<string[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestClientsList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmBulkDeleteClient(checkedRows));
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmDeleteId]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteClient()),
    [dispatch]
  );

  const onDelete = () => {
    dispatch(actions.confirmBulkDeleteClientRequest(checkedRows));
  };

  const onEnable = () => {
    dispatch(actions.requestBulkEnableClient(checkedRows));
    setCheckedRows([]);
  };

  const onDisable = () => {
    dispatch(actions.requestBulkDisableClient(checkedRows));
    setCheckedRows([]);
  };

  const title = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link to={`${path}/add`} className="btn btn-link">
          <i className="fa fa-plus" />
        </Link>
        <Button
          className="btn btn-link"
          color="white"
          onClick={onDelete}
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
          onClick={onEnable}
          data-for="enable"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
            <i className="fa fa-check" />
          ) : (
            <i className="fa fa-check" style={{ color: "green" }} />
          )}

          <ToolTip id="enable" message="Enable" />
        </Button>

        <Button
          className="btn btn-link"
          color="white"
          onClick={onDisable}
          data-for="disable"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-times" style={{ color: "red" }} />
          )}

          <ToolTip id="disable" message="Disable" />
        </Button>
      </div>
      <h5 className="mt-0">
        List of <span className="fw-semi-bold">Clients</span>
      </h5>
    </div>
  );

  const getClientList = () => {
    let rows: any = [];
    for (let client of clients) {
      let column: any = {};
      column["name"] = {
        content: client.name,
        styledContent: (
          <Link to={`${path}/detail/${client.uuid}`}>{client.name}</Link>
        ),
        lineBreak: true,
      };
      column["serialNumber"] = {
        content: client.serialNumber,
        lineBreak: true,
      };
      column["clientDn"] = {
        content: client?.certificate?.subjectDn,
        lineBreak: true,
      };
      column["status"] = {
        content: client.enabled ? "enabled" : "disabled",
        styledContent: <StatusBadge enabled={client.enabled} />,
        lineBreak: true,
      };
      rows.push({
        id: client.uuid,
        column: column,
        data: client,
      });
    }
    return rows;
  };

  const clientRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "clientName",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Serial Number" />,
      content: "serialNumber",
      sort: false,
      id: "clientSerialNumber",
      width: "25%",
    },
    {
      styledContent: <MDBColumnName columnName="Client DN" />,
      content: "clientDn",
      sort: false,
      id: "clientAdminDn",
      width: "35%",
    },
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "clientStatus",
      width: "10%",
    },
  ];

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <br />
        <CustomTable
          checkedRows={checkedRows}
          checkedRowsFunction={setCheckedRows}
          data={clients}
          headers={clientRowHeaders}
          rows={getClientList()}
        />
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Client</MDBModalHeader>
        <MDBModalBody>
          You are about deleting a client with existing authorizations to RA
          Profiles. If you continue, these authorizations will be deleted as
          well. Is this what you want to do?
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
      <Spinner active={isFetching || isDeleting || isEditing} />
    </Container>
  );
}

export default ClientList;
