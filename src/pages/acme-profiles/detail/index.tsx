import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { Container, Table, Row, Col, Button } from "reactstrap";

import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-profiles";
import { fieldNameTransform } from "utils/fieldNameTransform";
import ToolTip from "components/ToolTip";
import { AttributeResponse } from "models/attributes";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function AcmeProfileDetail() {
  const dispatch = useDispatch();
  const isEditing = useSelector(selectors.isEditing);
  const isFetchingProfiles = useSelector(selectors.isFetching);
  const profileDetails = useSelector(selectors.selectSelectedProfile);
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
          to={`../../acmeprofiles/edit/${profileDetails?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit ACME Profile" />
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
        ACME Profile <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const issueAttributeTitle = <h5>List of Attributes to issue Certificate</h5>;
  const revokeAttributeTitle = (
    <h5>List of Attributes to revoke Certificate</h5>
  );

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
                  <td>Name</td>
                  <td>{profileDetails?.name}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{profileDetails?.description}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <StatusBadge enabled={profileDetails?.enabled} />
                  </td>
                </tr>
                <tr>
                  <td>Website URL</td>
                  <td>{profileDetails?.websiteUrl}</td>
                </tr>
                <tr>
                  <td>Retry Interval</td>
                  <td>{profileDetails?.retryInterval || "30"} (Seconds)</td>
                </tr>
                <tr>
                  <td>Order Validity</td>
                  <td>{profileDetails?.validity || "36000"} (Seconds)</td>
                </tr>
                <tr>
                  <td>Directory URL</td>
                  <td>{profileDetails?.directoryUrl}</td>
                </tr>
              </tbody>
            </Table>
          </Widget>
          <Widget title={"RA Profile"}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RA Profile Name</td>
                  <td>
                    {profileDetails?.raProfile?.name ? (
                      <Link
                        to={`../../raprofiles/detail/${profileDetails?.raProfile.uuid}`}
                      >
                        {profileDetails.raProfile.name}
                      </Link>
                    ) : (
                      profileDetails?.raProfile?.name || "No RA Profile tagged"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>RA Profile UUID</td>
                  <td>{profileDetails?.raProfile?.uuid}</td>
                </tr>
                <tr>
                  <td>RA Profile Status</td>
                  <td>
                    <StatusBadge enabled={profileDetails?.raProfile?.enabled} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>
        <Col>
          <Widget title={"DNS"}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DNS Resolver IP address</td>
                  <td>{profileDetails?.dnsResolverIp || "System Default"}</td>
                </tr>
                <tr>
                  <td>DNS Resolver port number</td>
                  <td>{profileDetails?.dnsResolverPort || "System Default"}</td>
                </tr>
              </tbody>
            </Table>
          </Widget>
          <Widget title={"Terms of Service"}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Terms of Service URL</td>
                  <td>{profileDetails?.termsOfServiceUrl}</td>
                </tr>
                <tr>
                  <td>Changes of Terms of Service URL</td>
                  <td>{profileDetails?.termsOfServiceChangeUrl}</td>
                </tr>
                <tr>
                  <td>
                    Disable new Orders placement? (due to change in Terms of
                    Service)
                  </td>
                  <td>
                    {profileDetails?.termsOfServiceChangeDisable ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Require contact information for new Account</td>
                  <td>{profileDetails?.requireContact ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Require agree to Terms of Service for new Account</td>
                  <td>
                    {profileDetails?.requireTermsOfService ? "Yes" : "No"}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
          <Widget title={issueAttributeTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {profileDetails?.issueCertificateAttributes?.map(function (
                  attribute
                ) {
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
          <Widget title={revokeAttributeTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {profileDetails?.revokeCertificateAttributes?.map(function (
                  attribute
                ) {
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

      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Profile</MDBModalHeader>
        <MDBModalBody>
          You are about to delete ACME Profile which may have associated ACME
          Account(s). When deleted the ACME Account(s) will be revoked.
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

      <Spinner active={isFetchingProfiles || isEditing} />
    </Container>
  );
}

export default AcmeProfileDetail;
