/*import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";

import { ButtonGroup, Container, Form, FormGroup, Input, Label, Table, Row, Col, Button } from "reactstrap";
import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";

import { actions, selectors } from "ducks/clients";
//import { selectors as profileSelectors } from "ducks/ra-profiles";
//import { RaProfile } from "models";

import ProgressButton from "components/ProgressButton";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import ToolTip from "components/ToolTip";
import CertificateAttributes from "components/CertificateAttributes";
*/

export default function ClientDetail() {

   return(
      <></>
   );

   /*
  const dispatch = useDispatch();

  const allProfiles = useSelector(profileSelectors.selectProfiles);
  const clientDetails = useSelector(selectors.selectSelectedClient);
  const isEditing = useSelector(selectors.isEditing);
  const isAuthorizing = useSelector(selectors.isAuthorizingProfile);
  const isFetchingClients = useSelector(selectors.isFetching);
  const isFetchingProfiles = useSelector(profileSelectors.isFetching);
  const authorizedProfileIds = useSelector(selectors.selectAuthorizedProfiles);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteClientId);

  const { params } = useRouteMatch();
  const history = useHistory();
  const uuid = (params as any).id as string;

  useEffect(() => {
    dispatch(actions.requestClientDetail(uuid));
  }, [uuid, dispatch]);

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmDeleteClient(clientDetails?.uuid || "", history));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, clientDetails]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelDeleteClient()),
    [dispatch]
  );

  const onDelete = () => {
    dispatch(
      actions.confirmDeleteClientRequest(clientDetails?.uuid || "", history)
    );
  };

  const onEnable = () => {
    dispatch(actions.requestEnableClient(clientDetails?.uuid || ""));
  };

  const onDisable = () => {
    dispatch(actions.requestDisableClient(clientDetails?.uuid || ""));
  };

  const attributesTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link
          to={`../../clients/edit/${clientDetails?.uuid}`}
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
          onClick={onDelete}
          data-for="delete"
          data-tip
          disabled={clientDetails?.enabled}
        >
          {clientDetails?.enabled ? (
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
          disabled={clientDetails?.enabled}
        >
          {clientDetails?.enabled ? (
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
          disabled={!clientDetails?.enabled}
        >
          {!clientDetails?.enabled ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-times" style={{ color: "red" }} />
          )}

          <ToolTip id="disable" message="Disable" />
        </Button>
      </div>
      <h5>
        Client <span className="fw-semi-bold">Attributes</span>
      </h5>
    </div>
  );
  const certificateTitle = (
    <h5>
      Client Certificate <span className="fw-semi-bold">Attributes</span>
    </h5>
  );
  const profilesTitle = (
    <h5>
      List of Authorized <span className="fw-semi-bold">RA Profiles</span>
    </h5>
  );
  const profileTitle = (
    <h5>
      Authorize new <span className="fw-semi-bold">RA Profile</span>
    </h5>
  );

  const availableProfiles = useMemo(
    () =>
      allProfiles.filter(
        (p) => !authorizedProfileIds.includes(p.uuid.toString())
      ),
    [allProfiles, authorizedProfileIds]
  );
  const authorizedProfiles = authorizedProfileIds
    .map((uuid) => allProfiles.find((p) => p.uuid === uuid))
    .filter(Boolean) as RaProfile[];
  const [authorizedProfile, setAuthorizedProfile] = useState(
    availableProfiles[0]?.uuid
  );
  const authorizeProfileCallback = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const profile = authorizedProfile;
    dispatch(actions.requestAuthorizeProfile(uuid, profile.toString()));
  };

  useEffect(
    () => setAuthorizedProfile(availableProfiles[0]?.uuid),
    [availableProfiles]
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
                  <td>UUID</td>
                  <td>{clientDetails?.uuid}</td>
                </tr>
                <tr>
                  <td>Client Name</td>
                  <td>{clientDetails?.name}</td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td>{clientDetails?.description}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <StatusBadge enabled={clientDetails?.enabled} />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>

        <Col>
          <Widget title={certificateTitle}>
            <CertificateAttributes certificate={clientDetails?.certificate} />
          </Widget>
        </Col>
      </Row>

      <Widget title={profilesTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>RA Profile Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authorizedProfiles?.map((profile) => (
              <tr key={profile.uuid}>
                <td>
                  <Link to={`../../raprofiles/detail/${profile?.uuid}`}>
                    {profile?.name}
                  </Link>
                </td>
                <td>{profile.description}</td>
                <td>
                  <StatusBadge enabled={profile.enabled} />
                </td>
                <td>
                  <Button
                    className="btn btn-link"
                    color="white"
                    data-placement="right"
                    data-for={profile?.name}
                    data-tip
                    onClick={() =>
                      dispatch(
                        actions.requestUnauthorizeProfile(
                          uuid,
                          profile.uuid.toString()
                        )
                      )
                    }
                  >
                    <i className="fa fa-trash" style={{ color: "red" }} />
                    <ToolTip
                      message="Delete"
                      id={profile?.name}
                      place="right"
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>

      <Widget title={profileTitle}>
        <Form onSubmit={authorizeProfileCallback}>
          <FormGroup>
            <Label for="profileselect">Select RA Profile to Authorize</Label>
            <Input
              type="select"
              name="profileselect"
              value={authorizedProfile}
              onChange={(event) =>
                setAuthorizedProfile((event.target as HTMLInputElement).value)
              }
            >
              {availableProfiles.map((profile) => (
                <option
                  key={profile.uuid}
                  value={profile.uuid}
                >{`${profile.name} (id: ${profile.uuid})`}</option>
              ))}
            </Input>
          </FormGroup>
          <div className="d-flex justify-content-end">
            <ButtonGroup>
              <ProgressButton
                title="Authorize"
                inProgressTitle="Authorizing..."
                inProgress={isAuthorizing}
                disabled={!availableProfiles.length}
              />
            </ButtonGroup>
          </div>
        </Form>
      </Widget>


         <Dialog

            isOpen={confirmDelete}

            caption="Delete Client"

            body="You are about deleting a client with existing authorizations to RA
            Profiles. If you continue, these authorizations will be deleted as
            well. Is this what you want to do?"

            toggle={ () => setConfirmDelete(false) }

            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}

         />


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

      <Spinner active={isFetchingClients || isFetchingProfiles || isEditing} />
    </Container>
  );
  */

}
