import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

import { actions, selectors } from "ducks/acme-profiles";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusBadge from "components/StatusBadge";
import AttributeViewer from "components/Attributes/AttributeViewer";


export default function AdministratorDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const history = useHistory();

   const acmeProfile = useSelector(selectors.acmeProfile);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);

   const [confirmDelete, setConfirmDelete] = useState<boolean>(false);


   const isBusy = useMemo(
      () => isFetchingDetail || isDisabling || isEnabling,
      [isFetchingDetail, isDisabling, isEnabling]
   );


   useEffect(
      () => {
         if (!params.id) return;
         dispatch(actions.getAcmeProfile({ uuid: params.id }));
      },
      [params.id, dispatch]
   );


   const onEditClick = useCallback(
      () => {
         history.push(`../../acmeprofiles/edit/${acmeProfile?.uuid}`);
      },
      [acmeProfile, history]
   );


   const onEnableClick = useCallback(
      () => {
         if (!acmeProfile) return;
         dispatch(actions.enableAcmeProfile({ uuid: acmeProfile.uuid }));
      },
      [acmeProfile, dispatch]
   );


   const onDisableClick = useCallback(
      () => {
         if (!acmeProfile) return;
         dispatch(actions.disableAcmeProfile({ uuid: acmeProfile.uuid }));
      },
      [acmeProfile, dispatch]
   );


   const onDeleteConfirmed = useCallback(
      () => {
         if (!acmeProfile) return;
         dispatch(actions.deleteAcmeProfile({ uuid: acmeProfile.uuid }));
         setConfirmDelete(false);
      },
      [acmeProfile, dispatch]
   );


   const buttons: WidgetButtonProps[] = useMemo(
      () => [
         { icon: "pencil", disabled: false, tooltip: "Edit", onClick: () => { onEditClick(); } },
         { icon: "trash", disabled: false, tooltip: "Delete", onClick: () => { setConfirmDelete(true); } },
         { icon: "check", disabled: acmeProfile?.enabled || false, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: !(acmeProfile?.enabled || false), tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [acmeProfile, onEditClick, onDisableClick, onEnableClick]
   );


   const detailsTitle = useMemo(
      () => (

         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5>
               ACME Profile <span className="fw-semi-bold">Details</span>
            </h5>

         </div>

      ), [buttons]
   );


   const tableHeader: TableHeader[] = useMemo(
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


   const acmeProfileDetailData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", acmeProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", acmeProfile.name]
         },
         {
            id: "description",
            columns: ["Description", acmeProfile.description || ""]
         },
         {
            id: "status",
            columns: ["Username", <StatusBadge enabled={acmeProfile.enabled} />]
         },
         {
            id: "websiteUrl",
            columns: ["Website URL", acmeProfile.websiteUrl || "N/A"]
         },
         {
            id: "retryInterval",
            columns: ["Retry Interval", `${acmeProfile.retryInterval || "N/A"} (seconds)`]
         },
         {
            id: "orderValidity",
            columns: ["Order Validity", `${acmeProfile.validity || "N/A"} (seconds)`]
         },
         {
            id: "directoryUrl",
            columns: ["Dierectory URL", acmeProfile.directoryUrl || "N/A"]
         },

      ],
      [acmeProfile]

   );


   const raProfileDetailData: TableDataRow[] = useMemo(

      () => !acmeProfile || !acmeProfile.raProfile ? [] : [

         {
            id: "uuid",
            columns: ["UUID", acmeProfile.raProfile.uuid]
         },
         {
            id: "name",
            columns: ["Name", acmeProfile.raProfile.name]
         },
         {
            id: "status",
            columns: ["Status", <StatusBadge enabled={acmeProfile.raProfile.enabled} />]
         },

      ],
      [acmeProfile]

   );


   const dnsData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "dnsResolverIpAddress",
            columns: ["DNS Resolver IP Address", acmeProfile.dnsResolverIp || "N/A"]
         },
         {
            id: "dnsResolverPort",
            columns: ["DNS Resolver Port", acmeProfile.dnsResolverPort || "N/A"]
         }

      ],
      [acmeProfile]

   );


   const termsOfServiceData: TableDataRow[] = useMemo(

      () => !acmeProfile ? [] : [

         {
            id: "termsOfServiceUrl",
            columns: ["Terms of Service URL", acmeProfile.termsOfServiceUrl || "N/A"]
         },
         {
            id: "changesToTermsOfServiceUrl",
            columns: ["Changes of Terms of Service URL", acmeProfile.termsOfServiceChangeUrl || "N/A"]
         },
         {
            id: "disableNewOrderPlacement",
            columns: ["Disable new Order placement? (due to change in Terms Of Service)", acmeProfile.termsOfServiceChangeDisable !== undefined ? acmeProfile.termsOfServiceChangeDisable ? "Yes" : "No" : "N/A"]
         },
         {
            id: "requireContact",
            columns: ["Require Contact information for new Accounts?", acmeProfile.requireContact !== undefined ? acmeProfile.requireContact ? "Yes" : "No" : "N/A"]
         },
         {
            id: "requireAgreement",
            columns: ["Require Agreement for new Accounts?", acmeProfile.requireTermsOfService !== undefined ? acmeProfile.requireTermsOfService ? "Yes" : "No" : "N/A"]
         }

      ],
      [acmeProfile]

   );


   return (

      <Container className="themed-container" fluid>
         <Row xs="1" sm="1" md="2" lg="2" xl="2">
            <Col>

               <Widget title={detailsTitle} busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={acmeProfileDetailData}
                  />

               </Widget>


               <Widget title="RA Profile" busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={raProfileDetailData}
                  />

               </Widget>

            </Col>

            <Col>
               <Widget title="DNS" busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={dnsData}
                  />

               </Widget>

               <Widget title="Terms of Service" busy={isBusy}>

                  <CustomTable
                     headers={tableHeader}
                     data={termsOfServiceData}
                  />

               </Widget>

               <Widget title="List of Attributes to Issue Certificate" busy={isBusy}>

                  <AttributeViewer
                     attributes={acmeProfile?.issueCertificateAttributes}
                  />

               </Widget>


               <Widget title="List of Attributes to Revoke Certificate" busy={isBusy}>

                  <AttributeViewer
                     attributes={acmeProfile?.revokeCertificateAttributes}
                  />

               </Widget>

            </Col>

         </Row>

         <Dialog
            isOpen={confirmDelete}
            caption="Delete ACME Pro"
            body="You are about to delete ACME Profile which may have associated ACME
                  Account(s). When deleted the ACME Account(s) will be revoked."
            toggle={() => setConfirmDelete(false)}
            buttons={[
               { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
               { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

/*
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { Container, Table, Row, Col, Button } from "reactstrap";

import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-profiles";
import { FieldNameTransform } from "utils/attributes/fieldNameTransform";
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
  const deleteErrorMessages = useSelector(selectors.selectDeleteProfileError);

  const history = useHistory();
  const { params } = useRouteMatch();
  const [deleteErrorModalOpen, setDeleteErrorModalOpen] = useState(false);
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

  useEffect(() => {
    if (deleteErrorMessages?.length > 0) {
      setDeleteErrorModalOpen(true);
    } else {
      setDeleteErrorModalOpen(false);
    }
  }, [deleteErrorMessages]);

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

  const onForceDeleteCancel = useCallback(() => {
    dispatch(actions.cancelBulkForceDeleteProfile());
    setDeleteErrorModalOpen(false);
  }, [dispatch]);

  const onForceDeleteProfile = () => {
    dispatch(
      actions.requestBulkForceDeleteProfile(
        [profileDetails?.uuid || ""] || [],
        true,
        history
      )
    );
    setDeleteErrorModalOpen(false);
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
                          FieldNameTransform[attribute.name] ||
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
                          FieldNameTransform[attribute.name] ||
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

      <MDBModal
        overflowScroll={false}
        isOpen={deleteErrorModalOpen}
        toggle={onForceDeleteCancel}
      >
        <MDBModalHeader toggle={onForceDeleteCancel}>
          Delete ACME Profile
        </MDBModalHeader>
        <MDBModalBody>
          <b>
            Failed to delete ACME Profiles it has some dependent RA Profiles.
            Please find the details below &nbsp;
          </b>
          <br />
          <br />
          {deleteErrorMessages?.map(function (message) {
            return message.message;
          })}
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onForceDeleteProfile}>
            Force
          </Button>
          <Button color="secondary" onClick={onForceDeleteCancel}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetchingProfiles || isEditing} />
    </Container>
  );
}

export default AcmeProfileDetail;
*/