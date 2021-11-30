import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container, Table } from "reactstrap";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ca-authorities";
import { fieldNameTransform } from "utils/fieldNameTransform";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function AuthorityDetail() {
  const dispatch = useDispatch();
  const authorityDetails = useSelector(selectors.selectAuthorityDetails);
  const isFetchingAuthority = useSelector(selectors.isFetching);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAuthorityId);
  const deleteErrorMessages = useSelector(selectors.selectDeleteAuthorityError);

  const { params } = useRouteMatch();
  const history = useHistory();
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const uuid = (params as any).id as string;
  const allowedAttributeTypeForDetail = [
    "STRING",
    "DROPDOWN",
    "LIST",
    "BOOLEAN",
    "CREDENTIAL",
  ];

  useEffect(() => {
    dispatch(actions.requestAuthorityDetail(uuid));
  }, [uuid, dispatch]);

  useEffect(() => {
    if (deleteErrorMessages?.length > 0) {
      setDeleteErrorModalOpen(true);
    } else {
      setDeleteErrorModalOpen(false);
    }
  }, [deleteErrorMessages]);

  const onConfirmDelete = useCallback(() => {
    dispatch(
      actions.confirmDeleteAuthority(authorityDetails?.uuid || "", history)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps,
  }, [dispatch, authorityDetails]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteAuthority()),
    [dispatch]
  );

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelForceDeleteAuthority());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteAuthority = () => {
    dispatch(
      actions.requestForceDeleteAuthority(authorityDetails?.uuid || "", history)
    );
    setDeleteErrorModalOpen(false);
  };

  const onDeleteAuthority = () => {
    dispatch(
      actions.confirmDeleteAuthorityRequest(authorityDetails?.uuid || "")
    );
  };

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../authorities/edit/${authorityDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit Authority" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={() => onDeleteAuthority()}
          data-for="delete"
          data-tip
        >
          <i className="fa fa-trash" style={{ color: "red" }} />
          <ToolTip id="delete" message="Delete" />
        </Button>
      </div>
      <h5>
        Authority <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const attributeTitle = (
    <h5>
      <span className="fw-semi-bold">Attributes</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
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
              <td>ID</td>
              <td>{authorityDetails?.uuid}</td>
            </tr>
            <tr>
              <td>Authority Name</td>
              <td>{authorityDetails?.name}</td>
            </tr>
            <tr>
              <td>Authority Type</td>
              <td>{authorityDetails?.authorityType}</td>
            </tr>
            <tr>
              <td>Authority Provider Id</td>
              <td>
                {authorityDetails?.connectorUuid || "Connector Not Found"}
              </td>
            </tr>
            <tr>
              <td>Authority Provider Name</td>
              <td>
                {authorityDetails?.connectorUuid ? (
                  <Link
                    to={`../../connectors/detail/${authorityDetails?.connectorUuid}`}
                  >
                    {authorityDetails?.connectorName}
                  </Link>
                ) : (
                  authorityDetails?.connectorName
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Widget>

      <Widget title={attributeTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {authorityDetails?.attributes?.map(function (attribute) {
              if (attribute.name === "credentialId") {
                return (
                  <tr>
                    <td>Credential</td>
                    {}
                    <td>
                      <Link to={`../../credentials/detail/${attribute.value}`}>
                        {attribute.value}
                      </Link>
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr>
                    <td>
                      {attribute.label ||
                        fieldNameTransform[attribute.name] ||
                        attribute.name}
                    </td>
                    {}
                    <td>
                      {allowedAttributeTypeForDetail.includes(
                        attribute.type || "STRING"
                      )
                        ? attribute?.value?.name || attribute.value.toString()
                        : "<" + attribute.type + ">"}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </Table>
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
          <b>
            Failed to delete authority as the authority has some dependent
            profiles. Please find the details below &nbsp;
          </b>
          <br />
          <br />
          {deleteErrorMessages?.map(function (message) {
            return message.message;
          })}
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

      <Spinner active={isFetchingAuthority} />
    </Container>
  );
}

export default AuthorityDetail;
