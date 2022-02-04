import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { useHistory } from "react-router";
import { Container, Table, Button } from "reactstrap";

import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-accounts";
import ToolTip from "components/ToolTip";
import {
  MDBBadge,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import {acmeAccountStatus} from "../../../utils/acmeAccount";
import StatusCircle from "../../../components/StatusCircle";

function AcmeAccountDetail() {
  const dispatch = useDispatch();
  const isFetchingAccounts = useSelector(selectors.isFetching);
  const accountDetails = useSelector(selectors.selectSelectedAccount);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAccountId);
  const isRevoking = useSelector(selectors.isDeleting);

  const history = useHistory();
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;

  console.log(accountDetails?.enabled);

  useEffect(() => {
    dispatch(actions.requestAccountDetail(uuid));
  }, [uuid, dispatch]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelDeleteAccount()),
    [dispatch]
  );

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmDeleteAccount(accountDetails?.uuid || "", history));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, accountDetails]);

  const onDeleteAccount = () => {
    dispatch(
      actions.confirmDeleteAccountRequest(accountDetails?.uuid || "", history)
    );
  };

  const onEnableAccount = () => {
    dispatch(actions.requestEnableAccount(accountDetails?.uuid || ""));
  };

  const onDisableAccount = () => {
    dispatch(actions.requestDisableAccount(accountDetails?.uuid || ""));
  };

  const detailsTitle = (
    <div>
      {accountDetails?.status === "valid" ? (
        <div>
          <div className="pull-right mt-n-xs">
            <Button
              className="btn btn-link"
              color="white"
              onClick={onDeleteAccount}
              data-for="revoke"
              data-tip
              disabled={accountDetails?.enabled}
            >
              {accountDetails?.enabled ? (
                <i className="fa fa-times-circle" />
              ) : (
                <i className="fa fa-times-circle" style={{ color: "red" }} />
              )}

              <ToolTip id="revoke" message="Revoke" />
            </Button>

            <Button
              className="btn btn-link"
              color="white"
              onClick={onEnableAccount}
              data-for="enable"
              data-tip
              disabled={accountDetails?.enabled}
            >
              {accountDetails?.enabled ? (
                <i className="fa fa-check" />
              ) : (
                <i className="fa fa-check" style={{ color: "green" }} />
              )}

              <ToolTip id="enable" message="Enable" />
            </Button>

            <Button
              className="btn btn-link"
              color="white"
              onClick={onDisableAccount}
              data-for="disable"
              data-tip
              disabled={!accountDetails?.enabled}
            >
              {!accountDetails?.enabled ? (
                <i className="fa fa-times" />
              ) : (
                <i className="fa fa-times" style={{ color: "red" }} />
              )}

              <ToolTip id="disable" message="Disable" />
            </Button>
          </div>
        </div>
      ) : null}
      <h5>
        ACME Account <span className="fw-semi-bold">Details</span>
      </h5>
    </div>
  );

  let accountStatus = acmeAccountStatus(accountDetails?.status || "");

  return (
    <Container className="themed-container" fluid>
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
              <td>{accountDetails?.uuid}</td>
            </tr>
            <tr>
              <td>Account Id</td>
              <td>{accountDetails?.accountId}</td>
            </tr>
            <tr>
              <td>RA Profile</td>
              <td>
                {accountDetails?.raProfileUuid ? (
                  <Link
                    to={`../../raprofiles/detail/${accountDetails?.raProfileUuid}`}
                  >
                    {accountDetails.raProfileName}
                  </Link>
                ) : (
                  accountDetails?.raProfileName
                )}
              </td>
            </tr>
            <tr>
              <td>ACME Profile</td>
              <td>
                {accountDetails?.acmeProfileUuid ? (
                  <Link
                    to={`../../acmeprofiles/detail/${accountDetails?.acmeProfileUuid}`}
                  >
                    {accountDetails.acmeProfileName}
                  </Link>
                ) : (
                  accountDetails?.acmeProfileName
                )}
              </td>
            </tr>
            <tr>
              <td>Internal State</td>
              <td>
                <StatusBadge enabled={accountDetails?.enabled} />
              </td>
            </tr>
            <tr>
              <td>Account Status</td>
              <td>
                <MDBBadge color={accountStatus[1]}>{accountStatus[0]}</MDBBadge>
              </td>
            </tr>
            <tr>
              <td>Terms of Service Agreed</td>
              <td>{accountDetails?.termsOfServiceAgreed ? <StatusCircle status={true} /> : <StatusCircle status={false} />}</td>
            </tr>
            <tr>
              <td>Contacts</td>
              <td>
                {accountDetails?.contact.map(function (contact) {
                  return <span>{contact}<br/></span>;
                })}
              </td>
            </tr>
          </tbody>
        </Table>
      </Widget>
      <Widget title={"Order Summary"}>
        <Table className="table-hover" size="sm">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Successful Orders</td>
              <td>{accountDetails?.successfulOrders}</td>
            </tr>
            <tr>
              <td>Valid Orders</td>
              <td>{accountDetails?.validOrders}</td>
            </tr>
            <tr>
              <td>Pending Orders</td>
              <td>{accountDetails?.pendingOrders}</td>
            </tr>
            <tr>
              <td>Failed Orders</td>
              <td>{accountDetails?.failedOrders}</td>
            </tr>
            <tr>
              <td>Processing Orders</td>
              <td>{accountDetails?.processingOrders}</td>
            </tr>
          </tbody>
        </Table>
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Account</MDBModalHeader>
        <MDBModalBody>
          You are about to revoke ACME Account. Any new Orders will not be
          processed for this Account. After revoking you cannot re-enable the
          Account.
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="danger" onClick={onConfirmDelete}>
            Yes, Revoke
          </Button>
          <Button color="secondary" onClick={onCancelDelete}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>
      <Spinner active={isFetchingAccounts || isRevoking} />
    </Container>
  );
}

export default AcmeAccountDetail;
