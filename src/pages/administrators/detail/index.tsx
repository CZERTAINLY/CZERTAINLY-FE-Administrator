import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";
import { Container, Table, Row, Col, Button } from "reactstrap";

import Spinner from "components/Spinner";
import StatusCircle from "components/StatusCircle";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/administrators";
import CertificateAttributes from "components/CertificateAttributes";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function AdministratorDetail() {
  const dispatch = useDispatch();
  const details = useSelector(selectors.selectSelectedAdministrator);
  const isFetching = useSelector(selectors.isFetching);
  const { params } = useRouteMatch();
  const history = useHistory();
  const uuid = (params as any).id as string;

  const [isDeleteAdmin, setIsDeleteAdmin] = useState<boolean>(false);

  useEffect(() => {
    dispatch(actions.requestDetail(uuid));
  }, [uuid, dispatch]);

  const onDelete = () => {
    dispatch(actions.requestDelete(details?.uuid || "", history));
    setIsDeleteAdmin(false);
  };

  const onEnable = () => {
    dispatch(actions.requestEnable(details?.uuid || ""));
  };

  const onDisable = () => {
    dispatch(actions.requestDisable(details?.uuid || ""));
  };

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../administrators/edit/${details?.uuid}`}
          className="btn btn-link"
          data-for="edit"
          data-tip
        >
          <i className="fa fa-pencil-square-o" />
          <ToolTip id="edit" message="Edit" />
        </Link>

        <Button
          className="btn btn-link"
          color="white"
          onClick={() => setIsDeleteAdmin(true)}
          data-for="delete"
          data-tip
          disabled={details?.enabled}
        >
          {details?.enabled ? (
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
          disabled={details?.enabled}
        >
          {details?.enabled ? (
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
          disabled={!details?.enabled}
        >
          {!details?.enabled ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-times" style={{ color: "red" }} />
          )}

          <ToolTip id="disable" message="Disable" />
        </Button>
      </div>
      <h5>
        Administrator <span className="fw-semi-bold">Attributes</span>
      </h5>
    </div>
  );
  const certificateTitle = (
    <h5>
      Administrator Certificate <span className="fw-semi-bold">Attributes</span>
    </h5>
  );

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
                  <td>ID</td>
                  <td>{details?.uuid}</td>
                </tr>
                <tr>
                  <td>Administrator Name</td>
                  <td>{details?.name}</td>
                </tr>
                <tr>
                  <td>Administrator Surname</td>
                  <td>{details?.surname}</td>
                </tr>
                <tr>
                  <td>Administrator Username</td>
                  <td>{details?.username}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{details?.email}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{details?.description}</td>
                </tr>
                <tr>
                  <td>Superadmin</td>
                  <td>
                    <StatusCircle status={details?.superAdmin} />
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <StatusBadge enabled={details?.enabled} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>

        <Col>
          <Widget title={certificateTitle}>
            <CertificateAttributes certificate={details?.certificate} />
          </Widget>
        </Col>
      </Row>

      <MDBModal
        overflowScroll={false}
        isOpen={isDeleteAdmin}
        toggle={() => setIsDeleteAdmin(false)}
      >
        <MDBModalHeader toggle={() => setIsDeleteAdmin(false)}>
          Delete Credential
        </MDBModalHeader>
        <MDBModalBody>
          You are about to delete an Administrator. Is this what you want to do?
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onDelete}>
            Yes, delete
          </Button>
          <Button color="secondary" onClick={() => setIsDeleteAdmin(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetching} />
    </Container>
  );
}

export default AdministratorDetail;
