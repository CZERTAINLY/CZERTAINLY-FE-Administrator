import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import {
  ButtonGroup,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Table,
  Row,
  Col,
  Button,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import {
  actions as clientActions,
  selectors as clientSelectors,
} from "ducks/clients";
import { actions, selectors } from "ducks/ra-profiles";
import { Client } from "models";
import { fieldNameTransform } from "utils/fieldNameTransform";
import ToolTip from "components/ToolTip";
import { AttributeResponse } from "models/attributes";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function RaProfileDetail() {
  const dispatch = useDispatch();
  const allClients = useSelector(clientSelectors.selectClients);
  const isFetchingClients = useSelector(clientSelectors.isFetching);
  const isAuthorizing = useSelector(clientSelectors.isAuthorizingProfile);
  const isEditing = useSelector(selectors.isEditing);
  const isFetchingProfiles = useSelector(selectors.isFetching);
  const profileDetails = useSelector(selectors.selectSelectedProfile);
  const authorizedClientIds = useSelector(selectors.selectAuthorizedClientIds);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteProfileId);

  const history = useHistory();
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;

  const allowedAttributeTypeForDetail = [
    "STRING",
    "NUMBER",
    "DROPDOWN",
    "LIST",
    "BOOLEAN",
    "CREDENTIAL",
  ];

  useEffect(() => {
    dispatch(actions.requestProfileDetail(uuid));
  }, [uuid, dispatch]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelDeleteProfile()),
    [dispatch]
  );

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmDeleteProfile(profileDetails?.uuid || "", history));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, profileDetails]);

  const onDeleteProfile = () => {
    dispatch(
      actions.confirmDeleteProfileRequest(profileDetails?.uuid || "", history)
    );
  };

  const onEnableProfile = () => {
    dispatch(actions.requestEnableProfile(profileDetails?.uuid || ""));
  };

  const onDisableProfile = () => {
    dispatch(actions.requestDisableProfile(profileDetails?.uuid || ""));
  };

  const detailsTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../raprofiles/edit/${profileDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit Ra Profile" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={onDeleteProfile}
          data-for="delete"
          data-tip
          disabled={profileDetails?.enabled}
        >
          {profileDetails?.enabled ? (
            <i className="fa fa-trash" />
          ) : (
            <i className="fa fa-trash" style={{ color: "red" }} />
          )}

          <ToolTip id="delete" message="Delete" />
        </Button>

        <Button
          className="btn btn-link"
          color="white"
          onClick={onEnableProfile}
          data-for="enable"
          data-tip
          disabled={profileDetails?.enabled}
        >
          {profileDetails?.enabled ? (
            <i className="fa fa-check" />
          ) : (
            <i className="fa fa-check" style={{ color: "green" }} />
          )}

          <ToolTip id="enable" message="Enable" />
        </Button>

        <Button
          className="btn btn-link"
          color="white"
          onClick={onDisableProfile}
          data-for="disable"
          data-tip
          disabled={!profileDetails?.enabled}
        >
          {!profileDetails?.enabled ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-times" style={{ color: "red" }} />
          )}

          <ToolTip id="disable" message="Disable" />
        </Button>
      </div>
      <h5>
        RA Profile <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const attributesTitle = (
    <h5>
      RA Profile <span className="fw-semi-bold">Attributes</span>
    </h5>
  );
  const authorizedClientsTitle = (
    <h5>
      List of Authorized <span className="fw-semi-bold">Clients</span>
    </h5>
  );
  const authorizeClientTitle = (
    <h5>
      Authorize new <span className="fw-semi-bold">Client</span>
    </h5>
  );

  const availableClients = useMemo(
    () =>
      allClients.filter(
        (c) => !authorizedClientIds.includes(c.uuid.toString())
      ),
    [allClients, authorizedClientIds]
  );

  const authorizedClients = authorizedClientIds
    .map((uuid) => allClients.find((c) => c.uuid.toString() === uuid))
    .filter(Boolean) as Client[];

  const [authorizedClient, setAuthorizedClient] = useState(
    availableClients[0]?.uuid
  );

  const authorizeClientCallback = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = authorizedClient || availableClients[0]?.uuid;
    dispatch(clientActions.requestAuthorizeProfile(client.toString(), uuid));
  };

  useEffect(() => {
    setAuthorizedClient(availableClients[0]?.uuid);
  }, [availableClients]);

  const getAttributeValue = (attribute: AttributeResponse) => {
    if (allowedAttributeTypeForDetail.includes(attribute.type)) {
      if (attribute.type === "BOOLEAN") {
        return attribute.value ? "Yes" : "No";
      } else {
        if (!["string", "number"].includes(typeof attribute.value)) {
          return attribute.value.name;
        } else {
          return attribute.value;
        }
      }
    } else {
      return "<" + attribute.type + ">";
    }
  };

  return (
    <Container className="themed-container" fluid>
      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget title={detailsTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>UUID</td>
                  <td>{profileDetails?.uuid}</td>
                </tr>
                <tr>
                  <td>RA Profile Name</td>
                  <td>{profileDetails?.name}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{profileDetails?.description}</td>
                </tr>
                <tr>
                  <td>Authority Instance UUID</td>
                  <td>
                    {profileDetails?.authorityInstanceUuid ||
                      "Authority not found"}
                  </td>
                </tr>
                <tr>
                  <td>Authority Instance Name</td>
                  <td>
                    {profileDetails?.authorityInstanceUuid ? (
                      <Link
                        to={`../../authorities/detail/${profileDetails?.authorityInstanceUuid}`}
                      >
                        {profileDetails.authorityInstanceName}
                      </Link>
                    ) : (
                      profileDetails?.authorityInstanceName
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <StatusBadge enabled={profileDetails?.enabled} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>
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
                {profileDetails?.attributes?.map(function (attribute) {
                  return (
                    <tr>
                      <td>
                        {attribute.label ||
                          fieldNameTransform[attribute.name] ||
                          attribute.name}
                      </td>
                      {}
                      <td>{getAttributeValue(attribute)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Widget>
        </Col>
      </Row>

      <Widget title={authorizedClientsTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Client DN</th>
              <th>Client Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authorizedClients?.map((client) => (
              <tr key={client.uuid}>
                <td>
                  <Link to={`../../clients/detail/${client?.uuid}`}>
                    {client?.name}
                  </Link>
                </td>
                <td>{client.certificate?.subjectDn}</td>
                <td>
                  <StatusBadge enabled={client.enabled} />
                </td>
                <td>
                  <Button
                    className="btn btn-link"
                    color="white"
                    data-placement="right"
                    data-for={client?.name}
                    data-tip
                    onClick={() =>
                      dispatch(
                        clientActions.requestUnauthorizeProfile(
                          client.uuid.toString(),
                          uuid
                        )
                      )
                    }
                  >
                    <i className="fa fa-trash" style={{ color: "red" }} />
                    <ToolTip message="Delete" id={client?.name} place="right" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>

      <Widget title={authorizeClientTitle}>
        <Form onSubmit={authorizeClientCallback}>
          <FormGroup>
            <Label for="clientSelect">Select Client to Authorize</Label>
            <Input
              type="select"
              name="clientSelect"
              value={authorizedClient}
              onChange={(event) =>
                setAuthorizedClient((event.target as HTMLInputElement).value)
              }
            >
              {availableClients.map((client) => (
                <option
                  key={client.uuid}
                  value={client.uuid}
                >{`${client.certificate?.subjectDn} (id: ${client.uuid})`}</option>
              ))}
            </Input>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <ButtonGroup>
              <ProgressButton
                title="Authorize"
                inProgressTitle="Authorizing..."
                inProgress={isAuthorizing}
                disabled={!availableClients.length}
              />
            </ButtonGroup>
          </div>
        </Form>
      </Widget>

      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Profile</MDBModalHeader>
        <MDBModalBody>
          You are about to delete RA Profiles which may have existing
          authorizations from clients. If you continue, these authorizations
          will be deleted as well. Is this what you want to do?
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

      <Spinner
        active={
          isFetchingClients || isFetchingProfiles || isEditing || isAuthorizing
        }
      />
    </Container>
  );
}

export default RaProfileDetail;
