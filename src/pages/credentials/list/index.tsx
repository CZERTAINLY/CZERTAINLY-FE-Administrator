import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container, Table } from "reactstrap";

import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/credentials";
import MDBColumnName from "components/MDBColumnName";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import CustomTable from "components/CustomTable";

const { MDBBadge } = require("mdbreact");

function CredentialList() {
  const credentials = useSelector(selectors.selectCredentials);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeletingCredential);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(
    selectors.selectConfirmDeleteCredentialId
  );
  const deleteErrorMessages = useSelector(
    selectors.selectDeleteCredentialError
  );

  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState<(string | number)[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestCredentialsList());
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
    dispatch(actions.confirmBulkDeleteCredential(checkedRows));
    setDuplicateRows(checkedRows);
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmDeleteId]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelDeleteCredential()),
    [dispatch]
  );

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelForceDeleteCredential());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteCredential = (event: any) => {
    dispatch(actions.requestBulkForceDeleteCredential(duplicateRows));
    setDuplicateRows([]);
    setDeleteErrorModalOpen(false);
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
          onClick={(event) => onDeleteCredential(event)}
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
      </div>
      <h5 className="mt-0">
        <span className="fw-semi-bold">Credential Store</span>
      </h5>
    </div>
  );

  const onDeleteCredential = (event: any) => {
    dispatch(actions.confirmBulkDeleteCredentialRequest(checkedRows));
  };

  const credentialList = () => {
    let rows: any = [];
    for (let credential of credentials) {
      let column: any = {};
      column["name"] = {
        content: credential.name,
        styledContent: (
          <Link to={`${path}/detail/${credential.uuid}`}>
            {credential.name}
          </Link>
        ),
        lineBreak: true,
      };
      column["type"] = {
        content: credential.kind,
        styledContent: <MDBBadge color="primary">{credential.kind}</MDBBadge>,
        lineBreak: true,
      };
      column["credentialProvider"] = {
        content: credential.connectorName,
        styledContent: (
          <MDBBadge color="info">{credential.connectorName}</MDBBadge>
        ),
        lineBreak: true,
      };

      rows.push({
        id: credential.uuid,
        column: column,
        data: credential,
      });
    }
    return rows;
  };

  const administratorRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "adminName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Kind" />,
      content: "type",
      sort: false,
      id: "kind",
      width: "20%",
    },
    {
      styledContent: <MDBColumnName columnName="Credential Provider" />,
      content: "credentialProvider",
      sort: false,
      id: "credentialProviderName",
      width: "25%",
    },
  ];

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <br />
        <CustomTable
          checkedRows={checkedRows}
          checkedRowsFunction={setCheckedRows}
          data={credentials}
          headers={administratorRowHeaders}
          rows={credentialList()}
        />
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>
          Delete Credential
        </MDBModalHeader>
        <MDBModalBody>
          You are about deleting a credential. If you continue, these connectors
          with the credentials will fail. Is this what you want to do?
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
        isOpen={deleteErrorModalOpen}
        toggle={onForceDeleteCancel}
      >
        <MDBModalHeader toggle={onForceDeleteCancel}>
          Delete Credential
        </MDBModalHeader>
        <MDBModalBody>
          Failed to delete some of the credentials. Please find the details
          below &nbsp;
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
          <Button color="danger" onClick={onForceDeleteCredential}>
            Force
          </Button>
          <Button color="secondary" onClick={onForceDeleteCancel}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetching || isDeleting || isEditing} />
    </Container>
  );
}

export default CredentialList;
