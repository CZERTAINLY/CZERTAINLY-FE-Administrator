import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { Button, Container, Table } from "reactstrap";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/credentials";
import { fieldNameTransform } from "utils/fieldNameTransform";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function CredentialDetail() {
  const dispatch = useDispatch();
  const credentialDetails = useSelector(selectors.selectCredentialDetails);
  const isFetchingCredential = useSelector(selectors.isFetching);
  const confirmDeleteId = useSelector(
    selectors.selectConfirmDeleteCredentialId
  );
  const deleteErrorMessages = useSelector(
    selectors.selectDeleteCredentialError
  );

  const { params } = useRouteMatch();
  const history = useHistory();

  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
  const uuid = (params as any).id as string;
  const allowedAttributeTypeForDetail = [
    "STRING",
    "DROPDOWN",
    "LIST",
    "CREDENTIAL",
  ];

  useEffect(() => {
    dispatch(actions.requestCredentialDetail(uuid));
  }, [uuid, dispatch]);

  const onConfirmDelete = useCallback(() => {
    dispatch(
      actions.confirmDeleteCredential(credentialDetails?.uuid || "", history)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, credentialDetails]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelDeleteCredential()),
    [dispatch]
  );

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelForceDeleteCredential());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteCredential = (event: any) => {
    dispatch(
      actions.requestForceDeleteCredential(
        credentialDetails?.uuid || "",
        history
      )
    );
    setDeleteErrorModalOpen(false);
  };

  const onDeleteConnector = () => {
    dispatch(
      actions.confirmDeleteCredentialRequest(
        credentialDetails?.uuid || "",
        history
      )
    );
  };

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../credentials/edit/${credentialDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit Credential" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={() => onDeleteConnector()}
          data-for="delete"
          data-tip
        >
          <i className="fa fa-trash" style={{ color: "red" }} />

          <ToolTip id="delete" message="Delete" />
        </Button>
      </div>
      <h5>
        Credential <span className="fw-semi-bold">Details</span>
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
              <td>{credentialDetails?.uuid}</td>
            </tr>
            <tr>
              <td>Credential Name</td>
              <td>{credentialDetails?.name}</td>
            </tr>
            <tr>
              <td>Type</td>
              <td>{credentialDetails?.credentialType}</td>
            </tr>
            <tr>
              <td>Credential Provider Name</td>
              <td>
                {credentialDetails?.connectorUuid ? (
                  <Link
                    to={`../../connectors/detail/${credentialDetails?.connectorUuid}`}
                  >
                    {credentialDetails?.connectorName}
                  </Link>
                ) : (
                  credentialDetails?.connectorName
                )}
              </td>
            </tr>
            <tr>
              <td>Credential Provider Id</td>
              <td>
                {credentialDetails?.connectorUuid || "Connector Not Found"}
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
            {credentialDetails?.attributes.map(function (attribute) {
              return (
                <tr>
                  <td>
                    {attribute.label ||
                      fieldNameTransform[attribute.name] ||
                      attribute.name}
                  </td>
                  {}
                  <td>
                    {allowedAttributeTypeForDetail.includes(attribute.type)
                      ? attribute.value
                      : "<" + attribute.type + ">"}
                  </td>
                </tr>
              );
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

      <Spinner active={isFetchingCredential} />
    </Container>
  );
}

export default CredentialDetail;
