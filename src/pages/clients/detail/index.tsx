import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col, Button, Label, ButtonGroup } from "reactstrap";
import Select from "react-select";

import { actions as clientActions, selectors as clientSelectors } from "ducks/clients";
import { actions as raProfileActions, selectors as raProfileSelectors } from "ducks/ra-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";

import StatusBadge from "components/StatusBadge";

import CertificateAttributes from "components/CertificateAttributes";
import ToolTip from "components/ToolTip";
import ProgressButton from "components/ProgressButton";

export default function ClientDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const client = useSelector(clientSelectors.client);
   const authorizedProfiles = useSelector(clientSelectors.authorizedProfiles);
   const raProfiles = useSelector(raProfileSelectors.raProfiles);

   const isFetchingDetail = useSelector(clientSelectors.isFetchingDetail);
   const isFetchingRaProfiles = useSelector(raProfileSelectors.isFetchingList);
   const isDisabling = useSelector(clientSelectors.isDisabling);
   const isEnabling = useSelector(clientSelectors.isEnabling);
   const isFetchingAuthorizedProfiles = useSelector(clientSelectors.isFetchingAuthorizedProfiles);
   const isAuthorizing = useSelector(clientSelectors.isAuthorizing);
   const isUnauthorizing = useSelector(clientSelectors.isUnuthorizing);

   const [selectedProfile, setSelectedProfile] = useState<{ value: string; label: string; } | null>(null);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   useEffect(
      () => {
         if (!params.id) return;
         dispatch(clientActions.getClientDetail(params.id));
         dispatch(clientActions.getAuthorizedProfiles(params.id));
         dispatch(raProfileActions.listRaProfiles());
      },
      [params.id, dispatch]
   );


   const onEditClick = useCallback(
      () => {
         history.push(`../../clients/edit/${client?.uuid}`);
      },
      [client, history]
   )


   const onEnableClick = useCallback(
      () => {
         if (!client) return;
         dispatch(clientActions.enableClient(client.uuid));
      },
      [client, dispatch]
   )


   const onDisableClick = useCallback(
      () => {
         if (!client) return;
         dispatch(clientActions.disableClient(client.uuid));
      }
      , [client, dispatch]
   )


   const onAuthorizeRaProfileClick = useCallback(
      () => {
         if (!client || !selectedProfile) return;
         const raProfile = raProfiles.find(p => p.uuid === selectedProfile.value);
         if (!raProfile) return;
         dispatch(clientActions.authorizeClient({ clientUuid: client.uuid, raProfile }));
      },
      [client, selectedProfile, dispatch, raProfiles]
   )


   const onDeleteConfirmed = useCallback(
      () => {
         setConfirmDelete(false);
         if (!client) return;
         dispatch(clientActions.deleteClient(client.uuid));
      },
      [dispatch, client]
   )


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: client?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(client?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [client, onEditClick, onDisableClick, onEnableClick]
   );


   const attributesTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               Client <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]
   );


   const certificateTitle = useMemo(
      () => (
         <h5>
            Client Certificate <span className="fw-semi-bold">Details</span>
         </h5>
      ),
      []
   );


   const detailHeaders: TableHeader[] = useMemo(
      () => [
         {
            id: "property",
            content: "Property",
         },
         {
            id: "value",
            content: "Value",
         },
      ],
      []
   );


   const detailData: TableDataRow[] = useMemo(

      () => !client ? [] : [
         {
            id: "uuid",
            columns: ["UUID", client.uuid],
         },
         {
            id: "name",
            columns: ["Name", client.name],
         },
         {
            id: "description",
            columns: ["Description", client.description],
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={client.enabled} />],
         }
      ],
      [client]

   )


   const authorizedProfilesHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "name",
            content: "Name",
            sortable: true,
            sort: "asc",
         },
         {
            id: "description",
            content: "Description",
         },
         {
            id: "status",
            content: "Status",
         },
         {
            id: "actions",
            content: "Actions",
         }
      ],
      []
   );


   const authorizedProfilesData: TableDataRow[] = useMemo(

      () => !authorizedProfiles ? [] : authorizedProfiles.map(

         authorizedProfile => ({
            id: authorizedProfile.uuid,
            columns: [
               authorizedProfile.name,
               authorizedProfile.description,
               <StatusBadge enabled={authorizedProfile.enabled} />,
               <Button
                  className="btn btn-link"
                  color="white"
                  data-placement="right"
                  data-for={authorizedProfile?.name}
                  data-tip
                  onClick={() => {
                     dispatch(clientActions.unauthorizeClient({ clientUuid: client!.uuid, raProfile: authorizedProfile }))
                  }
                  }
               >
                  <i className="fa fa-trash" style={{ color: "red" }} />
                  <ToolTip message={`Unauthorize ${authorizedProfile?.name}`} id={authorizedProfile?.name} place="right" />
               </Button>

            ]
         })
      ),
      [authorizedProfiles, dispatch, client]
   )


   const availableProfiles: { value: string; label: string; }[] = useMemo(

      () => raProfiles.filter(
         raProfile => !authorizedProfiles.some(authorizedProfile => authorizedProfile.uuid === raProfile.uuid)
      ).sort(
         (a, b) => a.name.localeCompare(b.name)
      ).map(
         raProfile => (
            { value: raProfile.uuid, label: raProfile.name }
         )
      ),
      [authorizedProfiles, raProfiles]

   );


   useEffect(
      () => {
         if (!availableProfiles || availableProfiles.length === 0) {
            setSelectedProfile(null);
            return;
         }
         setSelectedProfile(availableProfiles[0]);
      },
      [availableProfiles, setSelectedProfile]
   )


   return (

      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>

               <Widget title={attributesTitle} busy={isFetchingDetail || isEnabling || isDisabling}>

                  <CustomTable
                     headers={detailHeaders}
                     data={detailData}
                  />

               </Widget>

            </Col>

            <Col>

               <Widget title={certificateTitle} busy={isFetchingDetail}>
                  <CertificateAttributes certificate={client?.certificate} />
               </Widget>

            </Col>
         </Row>

         <Widget title="Authorized RA Profiles" busy={isFetchingAuthorizedProfiles || isAuthorizing || isUnauthorizing}>

            <CustomTable
               headers={authorizedProfilesHeaders}
               data={authorizedProfilesData}
            />

         </Widget>

         <Widget title="Authorize RA Profile" busy={isFetchingRaProfiles || isUnauthorizing}>

            <Label for="profileselect">Select RA Profile to Authorize</Label>

            <Select
               maxMenuHeight={140}
               name="profileselect"
               options={availableProfiles}
               value={selectedProfile}
               onChange={option => setSelectedProfile(option || null) }
            />

            <br />

            <div className="d-flex justify-content-end">

               <ButtonGroup>

                  <ProgressButton
                     title="Authorize"
                     inProgressTitle="Authorizing..."
                     inProgress={isAuthorizing}
                     disabled={!availableProfiles.length || !selectedProfile}
                     onClick={onAuthorizeRaProfileClick}
                  />

               </ButtonGroup>

            </div>

         </Widget>


         <Dialog
            isOpen={confirmDelete}
            caption="Delete Client"
            body="You are about to delete a client. Is this what you want to do?"
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
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
