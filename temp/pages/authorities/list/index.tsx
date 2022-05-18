import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container, Table } from "reactstrap";

import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ca-authorities";
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

function AuthorityList() {
  const authorities = useSelector(selectors.selectAuthorities);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeletingAuthority);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAuthorityId);
  const deleteErrorMessages = useSelector(selectors.selectDeleteAuthorityError);

  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const [duplicateRows, setDuplicateRows] = useState<(string | number)[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestAuthoritiesList());
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
    dispatch(actions.confirmBulkDeleteAuthority(checkedRows));
    setDuplicateRows(checkedRows);
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps,
  }, [dispatch, confirmDeleteId]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteAuthority()),
    [dispatch]
  );

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelBulkForceDeleteAuthority());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteAuthority = (event: any) => {
    dispatch(actions.requestBulkForceDeleteAuthority(duplicateRows));
    setDuplicateRows([]);
    setDeleteErrorModalOpen(false);
  };

  const onDeleteAuthority = (event: any) => {
    dispatch(actions.confirmBulkDeleteAuthorityRequest(checkedRows));
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
          onClick={(event) => onDeleteAuthority(event)}
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
        <span className="fw-semi-bold">Authority Store</span>
      </h5>
    </div>
  );

  const authoritiesList = () => {
    let rows: any = [];
    for (let authority of authorities) {
      let column: any = {};
      column["name"] = {
        content: authority.name,
        styledContent: (
          <Link to={`${path}/detail/${authority.uuid}`}>{authority.name}</Link>
        ),
        lineBreak: true,
      };
      column["authorityProvider"] = {
        content: authority.connectorName,
        styledContent: (
          <MDBBadge color="info">{authority.connectorName}</MDBBadge>
        ),
        lineBreak: true,
      };
      column["kind"] = {
        content: authority.kind,
        styledContent: <MDBBadge color="secondary">{authority.kind}</MDBBadge>,
        lineBreak: true,
      };
      rows.push({
        id: authority.uuid,
        column: column,
        data: authority,
      });
    }
    return rows;
  };

  const authorityRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "authorityName",
      width: "5%",
    },
    {
      styledContent: <MDBColumnName columnName="Authority Provider" />,
      content: "authorityProvider",
      sort: false,
      id: "adminAuthorityProvider",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Kind" />,
      content: "kind",
      sort: false,
      id: "adminAuthorityType",
      width: "15%",
    },
  ];

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <br />
        <CustomTable
          checkedRows={checkedRows}
          checkedRowsFunction={setCheckedRows}
          data={authorities}
          headers={authorityRowHeaders}
          rows={authoritiesList()}
        />
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>
          Delete Authority
        </MDBModalHeader>
        <MDBModalBody>
          You are about deleting a authority. If you continue, these connectors
          with the authorities will fail. Is this what you want to do?
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
          Delete Authority
        </MDBModalHeader>
        <MDBModalBody>
          Failed to delete some of the authorities. Please find the details
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
          <Button color="danger" onClick={onForceDeleteAuthority}>
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

export default AuthorityList;
