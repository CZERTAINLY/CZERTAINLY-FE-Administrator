import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";


export default function CertificateDetail() {

   return (
      <></>
   )

}

/*import {
  Badge,
  Container,
  Input,
  Table,
  Button,
  Label,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/certificates";
import {
  actions as groupActions,
  selectors as groupSelectors,
} from "ducks/group";
import {
  actions as entityActions,
  selectors as entitySelectors,
} from "ducks/entity";
import {
  actions as profileActions,
  selectors as profileSelectors,
} from "ducks/ra-profiles";
import { DiscoveryMeta } from "models";
import { fieldNameTransform } from "utils/fieldNameTransform";
import { useState } from "react";
import { downloadFile, formatPEM } from "utils/commons";
import ToolTip from "../../../components/ToolTip";
import { dateFormatter } from "utils/dateUtil";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import CertificateRevocationForm from "components/CertificateRevokeForm";
import { AttributeResponse } from "models/attributes";
import CertificateRenewForm from "components/CertificateRenewForm";
import CertificateValidationStatus from "components/CertificateValidationStatus";
import CertificateHistoryStatus from "components/CertificateHistoryStatus";
import CertificateStatus from "components/CertificateStatus";

function CertificateDetail() {
  const dispatch = useDispatch();
  const history = useHistory();
  const details = useSelector(selectors.selectCertificateDetails);
  const isFetching = useSelector(selectors.isFetchingDetail);
  const isRevoking = useSelector(selectors.isRevokingCertificate);
  const isRenewing = useSelector(selectors.isRenewingCertificate);
  const isDeleting = useSelector(selectors.isDeletingCertificate);
  const groups = useSelector(groupSelectors.selectGroups);
  const entities = useSelector(entitySelectors.selectEntities);
  const raProfiles = useSelector(profileSelectors.selectProfiles);
  const eventHistory = useSelector(selectors.selectCertificateHistory);

  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const emptyMeta: DiscoveryMeta = {};

  const [assignGroup, setAssignGroup] = useState(false);
  const [assignEntity, setAssignEntity] = useState(false);
  const [assignRaProfile, setAssignRaProfile] = useState(false);
  const [assignOwner, setAssignOwner] = useState(false);
  const [isRevoke, setIsRevoke] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentInfoId, setCurrentInfoId] = useState("");
  const [selectedGroup, setSelectedGroup]: any = useState();
  const [selectedEntity, setSelectedEntity]: any = useState();
  const [selectedRaProfile, setSelectedRaProfile]: any = useState();
  const [selectedOwner, setSelectedOwner]: any = useState();
  const [initialLoaded, setInitialLoaded] = useState(false);

  const onRevokeCancel = useCallback(() => setIsRevoke(false), []);

  const onRevokeSubmit = useCallback(
    (
      raProfileName: string,
      reason: string,
      uuid: string,
      attributes: AttributeResponse[]
    ) => {
      dispatch(
        actions.requestRevokeCertificate(
          raProfileName,
          reason,
          uuid,
          attributes
        )
      );
      setIsRevoke(false);
    },
    [dispatch]
  );

  const onRenewCancel = useCallback(() => setIsRenew(false), []);

  const onRenewSubmit = useCallback(
    (raProfileName: string, uuid: string, pkcs10: File) => {
      dispatch(
        actions.requestRenewCertificate(raProfileName, pkcs10, uuid, history)
      );
      setIsRenew(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const historyTitle = (
    <h5>
      <span className="fw-semi-bold">Certificate Event History</span>
    </h5>
  );

  const onConfirmUpdateGroup = () => {
    if (!selectedGroup) {
      return;
    }
    if (selectedGroup !== details?.group?.name) {
      dispatch(actions.requestUpdateGroup(uuid, selectedGroup));
    }
    setAssignGroup(false);
  };

  const onConfirmUpdateEntity = () => {
    if (!selectedEntity) {
      return;
    }
    if (selectedEntity !== details?.entity?.name) {
      dispatch(actions.requestUpdateEntity(uuid, selectedEntity));
    }
    setAssignEntity(false);
  };

  const onConfirmUpdateRaProfile = () => {
    if (!selectedRaProfile) {
      return;
    }
    if (selectedRaProfile !== details?.raProfile?.name) {
      dispatch(actions.requestUpdateRaProfile(uuid, selectedRaProfile));
    }
    setAssignRaProfile(false);
  };

  const onConfirmUpdateOwner = () => {
    if (selectedOwner !== details?.owner) {
      dispatch(actions.requestOwnerUpdate(uuid, selectedOwner));
    }
    setAssignOwner(false);
  };

  const setEntity = (event: any) => {
    setSelectedEntity(JSON.parse(event.target.value));
  };

  const setRaProfile = (event: any) => {
    setSelectedRaProfile(JSON.parse(event.target.value));
  };

  const setGroup = (event: any) => {
    setSelectedGroup(JSON.parse(event.target.value));
  };

  const setOwner = (event: any) => {
    setSelectedOwner(event.target.value);
  };

  const onConfirmDelete = () => {
    setDeleteModalOpen(false);
    dispatch(actions.confirmDeleteCertificate(details?.uuid || "", history));
  };

  useEffect(() => {
    dispatch(actions.requestCertificateDetail(uuid));
    dispatch(groupActions.requestGroupsList());
    dispatch(entityActions.requestEntitiesList());
    dispatch(profileActions.requestRaProfilesList());
    setInitialLoaded(true);
  }, [uuid, dispatch]);

  useEffect(
    () => {
      if (details?.uuid && initialLoaded) {
        dispatch(actions.requestHistory(details?.uuid));
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, details]
  );

  const fileNameToDownload = details?.commonName + "_" + details?.serialNumber;

  const detailsTitle = (
    <div>
      <div className="pull-right mt-n-xs">
        <Button
          className="btn btn-link"
          onClick={() => setIsRenew(true)}
          data-for="renew"
          data-tip
          disabled={!(details?.raProfile?.name && details?.status === "valid")}
        >
          <i className="fa fa-retweet" />
          <ToolTip id="renew" message="Renew" />
        </Button>
        <Button
          className="btn btn-link"
          onClick={() => setIsRevoke(true)}
          data-for="revoke"
          data-tip
          disabled={!(details?.raProfile?.name && details?.status === "valid")}
        >
          {details?.raProfile?.name && details?.status === "valid" ? (
            <i className="fa fa-minus-square" style={{ color: "red" }} />
          ) : (
            <i className="fa fa-minus-square" />
          )}

          <ToolTip id="revoke" message="Revoke" />
        </Button>
        <Button
          className="btn btn-link"
          onClick={() => setDeleteModalOpen(true)}
          data-for="delete"
          data-tip
        >
          <i className="fa fa-trash" style={{ color: "red" }} />
          <ToolTip id="delete" message="Delete" />
        </Button>
        <UncontrolledButtonDropdown>
          <DropdownToggle
            color="light"
            caret
            size="sm"
            className="btn btn-link"
          >
            <i className="fa fa-download" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={() =>
                downloadFile(
                  formatPEM(details?.certificateContent || ""),
                  fileNameToDownload + ".pem"
                )
              }
            >
              PEM (.pem)
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                downloadFile(
                  Buffer.from(details?.certificateContent || "", "base64"),
                  fileNameToDownload + ".cer"
                )
              }
            >
              DER (.cer)
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      <h5>
        Certificate <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  const attributesTitle = (
    <h5>
      Certificate <span className="fw-semi-bold">Attributes</span>
    </h5>
  );

  const metaTitle = (
    <h5>
      Certificate <span className="fw-semi-bold">Meta Data</span>
    </h5>
  );

  const sanTitle = (
    <h5>
      <span className="fw-semi-bold">Subject Alternative Names</span>
    </h5>
  );

  const validationTitle = (
    <h5>
      <span className="fw-semi-bold">Certificate Validation</span>
    </h5>
  );

  const metaEntry = (): any => {
    const elements: any = [];
    for (let [key, value] of Object.entries(details?.meta || emptyMeta)) {
      elements.push(
        <tr>
          <td>
            <div style={{ wordBreak: "break-all" }}>{key}</div>
          </td>
          <td>
            <div style={{ wordBreak: "break-all" }}>{value}</div>
          </td>
        </tr>
      );
    }
    return elements;
  };

  const sanEntry = (): any => {
    const elements: any = [];
    for (let [key, value] of Object.entries(
      details?.subjectAlternativeNames || emptyMeta
    )) {
      if (value.length > 0 && typeof value !== "string") {
        elements.push(
          <tr>
            <td>{key}</td>
            <td>{value.join(", ")}</td>
          </tr>
        );
      }
    }
    return elements;
  };

  const validationEntry = (): any => {
    const elements: any = [];
    for (let [key, value] of Object.entries(
      details?.certificateValidationResult || emptyMeta
    )) {
      elements.push(
        <tr>
          <td>{key}</td>
          <td>
            <CertificateValidationStatus
              status={value.status}
              id={value.status}
            />
          </td>
          <td>
            <div style={{ wordBreak: "break-all" }}>
              {value.message.split("\n").map((str: string) => (
                <div>
                  {str}
                  <br />
                </div>
              ))}
            </div>
          </td>
        </tr>
      );
    }
    return elements;
  };

  const historyEntry = (): any => {
    return eventHistory.map(function (history) {
      return (
        <tr>
          <td>{dateFormatter(history.created)}</td>
          <td>{history.createdBy}</td>
          <td>{history.event}</td>
          <td>
            <CertificateHistoryStatus status={history.status} />
          </td>
          <td>
            <div style={{ wordBreak: "break-all" }}>{history.message}</div>
          </td>
          <td>
            {history.additionalInformation ? (
              <Button
                color="white"
                data-for={`addInfo${history.uuid}`}
                data-tip
                onClick={() => setCurrentInfoId(history.uuid)}
              >
                <i className="fa fa-info-circle" aria-hidden="true"></i>
                <ToolTip
                  id={`addInfo${history.uuid}`}
                  message="View Additional Information"
                />
              </Button>
            ) : (
              <></>
            )}
          </td>
        </tr>
      );
    });
  };

  const additionalInfoEntry = (): any => {
    let returnList = [];
    const currentHistory = eventHistory.filter(
      (history) => history.uuid === currentInfoId
    );
    for (let [key, value] of Object.entries(
      currentHistory[0]?.additionalInformation
    )) {
      returnList.push(
        <tr>
          <td>{key}</td>
          <td>
            <p
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {value as string}
            </p>
          </td>
        </tr>
      );
    }
    return returnList;
  };

  return (
    <Container className="themed-container" fluid>
      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget title={detailsTitle}>
            <Table className="table-hover" size="sm">
              <tbody>
                <tr>
                  <td>
                    <b>Common Name</b>
                  </td>
                  <td>{details?.commonName}</td>
                </tr>
                <tr>
                  <td>
                    <b>Serial Number</b>
                  </td>
                  <td>
                    <p style={{ wordBreak: "break-all" }}>
                      {details?.serialNumber}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Issuer Common Name</b>
                  </td>
                  <td>{details?.issuerCommonName}</td>
                </tr>
                <tr>
                  <td>
                    <b>Issuer Serial Number</b>
                  </td>
                  <td>{details?.issuerSerialNumber}</td>
                </tr>
                <tr>
                  <td>
                    <b>Issuer DN</b>
                  </td>
                  <td>{details?.issuerDn}</td>
                </tr>
                <tr>
                  <td>
                    <b>Subject DN</b>
                  </td>
                  <td>{details?.subjectDn}</td>
                </tr>
                <tr>
                  <td>
                    <b>Expires At</b>
                  </td>
                  <td>{dateFormatter(details?.notAfter)}</td>
                </tr>
                <tr>
                  <td>
                    <b>Valid From</b>
                  </td>
                  <td>{dateFormatter(details?.notBefore)}</td>
                </tr>
                <tr>
                  <td>
                    <b>Public Key Algorithm</b>
                  </td>
                  <td>{details?.publicKeyAlgorithm}</td>
                </tr>
                <tr>
                  <td>
                    <b>Signature Algorithm</b>
                  </td>
                  <td>{details?.signatureAlgorithm}</td>
                </tr>
                <tr>
                  <td>
                    <b>Status</b>
                  </td>
                  <td>
                    <CertificateStatus
                        status={details?.status}
                        id={details?.status!}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Fingerprint</b>
                  </td>
                  <td>
                    <p style={{ wordBreak: "break-all" }}>
                      {details?.fingerprint}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Fingerprint Algorithm</b>
                  </td>
                  <td>SHA256</td>
                </tr>

                <tr>
                  <td>
                    <b>Key Size</b>
                  </td>
                  <td>{details?.keySize}</td>
                </tr>
                <tr>
                  <td>
                    <b>Key Usage</b>
                  </td>
                  <td>
                    {details?.keyUsage?.map(function (name) {
                      return (
                        <div key={name}>
                          <Badge style={{ backgroundColor: "Metalic Blue" }}>
                            {fieldNameTransform[name || ""] || name}
                          </Badge>
                          &nbsp;
                        </div>
                      );
                    })}
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>Extended Key Usage</b>
                  </td>
                  <td>
                    {details?.extendedKeyUsage?.map(function (name) {
                      return (
                        <div key={name}>
                          <Badge style={{ backgroundColor: "Metalic Blue" }}>
                            {fieldNameTransform[name || ""] || name}
                          </Badge>
                          &nbsp;
                        </div>
                      );
                    })}
                  </td>
                </tr>

                <tr>
                  <td>
                    <b>Basic Constraints</b>
                  </td>
                  <td>{details?.basicConstraints}</td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>
        <Col>
          <Widget title={sanTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>SAN Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>{sanEntry()}</tbody>
            </Table>
          </Widget>
        </Col>
      </Row>

      <Widget title={validationTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Validation Type</th>
              <th>Status</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>{validationEntry()}</tbody>
        </Table>
      </Widget>

      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget title={attributesTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Attribute</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>UUID</b>
                  </td>
                  <td>{details?.uuid}</td>
                  <td> </td>
                </tr>
                <tr>
                  <td>
                    <b>Owner</b>
                  </td>
                  <td>{details?.owner || "Unassigned"}</td>
                  <td>
                    <Button
                      className="btn btn-link"
                      size="sm"
                      color="secondary"
                      data-for="updateOwner"
                      data-tip
                      onClick={() => setAssignOwner(true)}
                    >
                      <i className="fa fa-refresh" />
                      <ToolTip id="updateOwner" message="Update Owner" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Group Name</b>
                  </td>
                  <td>
                    {details?.group ? (
                      <Link to={`../../groups/detail/${details?.group.uuid}`}>
                        {details?.group.name}
                      </Link>
                    ) : (
                      "Unassigned"
                    )}
                  </td>
                  <td>
                    <Button
                      className="btn btn-link"
                      size="sm"
                      color="secondary"
                      data-for="updateGroup"
                      data-tip
                      onClick={() => setAssignGroup(true)}
                    >
                      <i className="fa fa-refresh" />
                      <ToolTip id="updateGroup" message="Update Group" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Entity Name</b>
                  </td>
                  <td>
                    {details?.entity ? (
                      <Link
                        to={`../../entities/detail/${details?.entity.uuid}`}
                      >
                        {details?.entity.name}
                      </Link>
                    ) : (
                      "Unassigned"
                    )}
                  </td>
                  <td>
                    <Button
                      className="btn btn-link"
                      size="sm"
                      color="secondary"
                      data-for="updateEntity"
                      data-tip
                      onClick={() => setAssignEntity(true)}
                    >
                      <i className="fa fa-refresh" />
                      <ToolTip id="updateEntity" message="Update Entity" />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>RA Profile Name</b>
                  </td>
                  <td>{details?.raProfile?.name || "Unassigned"}</td>
                  <td>
                    <Button
                      className="btn btn-link"
                      size="sm"
                      color="secondary"
                      data-for="updateRaProfile"
                      data-tip
                      data-placement="right"
                      onClick={() => setAssignRaProfile(true)}
                    >
                      <i className="fa fa-refresh" />
                      <ToolTip
                        id="updateRaProfile"
                        message="Update RA Profile"
                      />
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Type</b>
                  </td>
                  <td>{details?.certificateType}</td>
                  <td> </td>
                </tr>
              </tbody>
            </Table>
          </Widget>
        </Col>
        <Col>
          <Widget title={metaTitle}>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>{metaEntry()}</tbody>
            </Table>
          </Widget>
        </Col>
      </Row>

      <Widget title={historyTitle}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Event</th>
              <th>Status</th>
              <th>Message</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{historyEntry()}</tbody>
        </Table>
      </Widget>

      <MDBModal
        overflowScroll={false}
        isOpen={assignGroup}
        toggle={() => setAssignGroup(false)}
      >
        <MDBModalHeader toggle={() => setAssignGroup(false)}>
          Update Group
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Group Name">Group Name</Label>
          <Input type="select" onChange={(event) => setGroup(event)}>
            <option key="select" value="select">
              Select
            </option>
            {groups.map(function (provider) {
              return (
                <option key={provider.name} value={JSON.stringify(provider)}>
                  {provider.name}
                </option>
              );
            })}
          </Input>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpdateGroup}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setAssignGroup(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={assignEntity}
        toggle={() => setAssignEntity(false)}
      >
        <MDBModalHeader toggle={() => setAssignEntity(false)}>
          Update Entity
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Entity Name">Entity Name</Label>
          <Input type="select" onChange={(event) => setEntity(event)}>
            <option key="select" value="select">
              Select
            </option>
            {entities.map(function (provider) {
              return (
                <option key={provider.name} value={JSON.stringify(provider)}>
                  {provider.name}
                </option>
              );
            })}
          </Input>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpdateEntity}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setAssignEntity(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={assignRaProfile}
        toggle={() => setAssignRaProfile(false)}
      >
        <MDBModalHeader toggle={() => setAssignRaProfile(false)}>
          Update RA Profile
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Entity Name">RA Profile Name</Label>
          <Input type="select" onChange={(event) => setRaProfile(event)}>
            <option key="select" value="select">
              Select
            </option>
            {raProfiles.map(function (provider) {
              return (
                <option
                  key={provider.name}
                  value={JSON.stringify(provider)}
                  label={provider.name}
                >
                  {provider.name}
                </option>
              );
            })}
          </Input>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpdateRaProfile}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setAssignRaProfile(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={assignOwner}
        toggle={() => setAssignOwner(false)}
      >
        <MDBModalHeader toggle={() => setAssignOwner(false)}>
          Update Owner
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Owner Name">Owner</Label>
          <Input
            type="text"
            placeholder="Enter the owner name / Email"
            onChange={(event) => setOwner(event)}
          ></Input>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpdateOwner}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setAssignOwner(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={isRenew}
        toggle={() => setIsRenew(false)}
      >
        <MDBModalHeader toggle={() => setIsRenew(false)}>
          Renew Certificate
        </MDBModalHeader>
        <MDBModalBody>
          Submit Certificate Renewal Request?
          <br />
          <br />
          <CertificateRenewForm
            raProfileUuid={details?.raProfile?.uuid}
            uuid={details?.uuid || ""}
            isSubmitting={isRenewing}
            onCancel={onRenewCancel}
            onSubmit={onRenewSubmit}
          />
        </MDBModalBody>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={isRevoke}
        toggle={() => setIsRevoke(false)}
      >
        <MDBModalHeader toggle={() => setIsRevoke(false)}>
          Revoke Certificate
        </MDBModalHeader>
        <MDBModalBody>
          You are about to revoke the certificate. This change is irreversible.
          Are you sure to revoke the certificate?
          <br />
          <br />
          <CertificateRevocationForm
            raProfileUuid={details?.raProfile?.uuid}
            uuid={details?.uuid || ""}
            isRevoking={isRevoking}
            onCancel={onRevokeCancel}
            onSubmit={onRevokeSubmit}
          />
        </MDBModalBody>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setDeleteModalOpen(false)}>
          Delete Certificate
        </MDBModalHeader>
        <MDBModalBody>
          You are about to delete the selected certificates. If you continue,
          the action will be irreversible, Is this what you want to do?
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onConfirmDelete}>
            Yes, delete
          </Button>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        size="lg"
        fullHeight
        isOpen={currentInfoId !== ""}
        toggle={() => setCurrentInfoId("")}
      >
        <MDBModalHeader toggle={() => setCurrentInfoId("")}>
          Additional Information
        </MDBModalHeader>
        <MDBModalBody>
          <div>
            <Table className="table-hover" size="sm">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {currentInfoId !== "" ? additionalInfoEntry() : <></>}
              </tbody>
            </Table>
          </div>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="secondary" onClick={() => setCurrentInfoId("")}>
            Close
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetching || isDeleting || isRenewing} />
    </Container>
  );
}

export default CertificateDetail;
*/