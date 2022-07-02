import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import { actions, selectors } from "ducks/acme-accounts";

import Widget from "components/Widget";
import WidgetButtons, { WidgetButtonProps } from "components/WidgetButtons";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import StatusCircle from "components/StatusCircle";
import StatusBadge from "components/StatusBadge";
import { MDBBadge } from "mdbreact";
import { acmeAccountStatus } from "utils/acmeAccount";


export default function AcmeAccountDetail() {

   const dispatch = useDispatch();

   const { params } = useRouteMatch<{ id: string }>();

   const acmeAccount = useSelector(selectors.account);
   const isFetchingDetail = useSelector(selectors.isFetchingDetail);
   const isDisabling = useSelector(selectors.isDisabling);
   const isEnabling = useSelector(selectors.isEnabling);
   const isRevoking = useSelector(selectors.isRevoking);

   const [confirmRevoke, setConfirmRevoke] = useState<boolean>(false);


   useEffect(

      () => {
         if (!params.id) return;
         dispatch(actions.getAcmeAccount({ uuid: params.id }));
      },
      [params.id, dispatch]

   )


   const onEnableClick = useCallback(

      () => {
         if (!acmeAccount) return;
         dispatch(actions.enableAcmeAccount({ uuid: acmeAccount.uuid }));
      },
      [acmeAccount, dispatch]

   );


   const onDisableClick = useCallback(

      () => {
         if (!acmeAccount) return;
         dispatch(actions.disableAcmeAccount({ uuid: acmeAccount.uuid }));
      },
      [acmeAccount, dispatch]

   );


   const onRevokeConfirmed = useCallback(

      () => {
         if (!acmeAccount) return;
         dispatch(actions.revokeAcmeAccount({ uuid: acmeAccount.uuid }));
         setConfirmRevoke(false);
      },
      [acmeAccount, dispatch]

   );


   const buttons: WidgetButtonProps[] = useMemo(

      () => [
         { icon: "cross-circle", disabled: acmeAccount ? acmeAccount.status !== "valid" : true, tooltip: "Revoke", onClick: () => { setConfirmRevoke(true); } },
         { icon: "check", disabled: acmeAccount ? acmeAccount.enabled || acmeAccount.status !== "valid" : true, tooltip: "Enable", onClick: () => { onEnableClick() } },
         { icon: "times", disabled: acmeAccount ? !acmeAccount.enabled : true, tooltip: "Disable", onClick: () => { onDisableClick() } }
      ],
      [acmeAccount, onEnableClick, onDisableClick]

   );


   const title = useMemo(

      () => (
         <div>

            <div className="pull-right mt-n-xs">
               <WidgetButtons buttons={buttons} />
            </div>

            <h5 className="mt-0">
               ACME Account <span className="fw-semi-bold">Details</span>
            </h5>

         </div>
      ),
      [buttons]

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
         }
      ],
      []

   );


   const detailData: TableDataRow[] = useMemo(

      () => {

         if (!acmeAccount) return [];

         const accountStatus = acmeAccountStatus(acmeAccount.status);

         return [
            {
               id: "uuid",
               columns: ["UUID", acmeAccount.uuid]
            },
            {
               id: "accountId",
               columns: ["Account Id", acmeAccount.accountId]
            },
            {
               id: "raProfileName",
               columns: ["RA Profile Name", acmeAccount.raProfileName]
            },
            {
               id: "acmeProfileName",
               columns: ["ACME Profile Name", acmeAccount.acmeProfileName]
            },
            {
               id: "internalState",
               columns: ["Internal State", <StatusBadge enabled={acmeAccount.enabled} />]
            },
            {
               id: "accountStatus",
               columns: ["Account Status", <MDBBadge color={accountStatus[1]}>{accountStatus[0]}</MDBBadge>]
            },
            {
               id: "Terms of Service Agreed",
               columns: ["Terms of Service Agreed", <StatusCircle status={acmeAccount.termsOfServiceAgreed} />]
            },
            {
               id: "contacts",
               columns: ["Contacts", <>{acmeAccount.contact.map(contact => <div key={contact}>{contact}</div>)}</>]
            }
         ];

      },
      [acmeAccount]

   );


   const orderHeaders: TableHeader[] = useMemo(

      () => [
         {
            id: "orders",
            content: "Orders",
         },
         {
            id: "count",
            content: "Count",
         }
      ],
      []

   );


   const orderData: TableDataRow[] = useMemo(

      () => !acmeAccount ? [] : [

         {
            id: "Succesfull orders",
            columns: ["Succesfull orders", acmeAccount.successfulOrders.toString()]
         },
         {
            id: "Valid orders",
            columns: ["Valid orders", acmeAccount.validOrders.toString()],
         },
         {
            id: "Pendning orders",
            columns: ["Pendning orders", acmeAccount.pendingOrders.toString()],
         },
         {
            id: "Failed orders",
            columns: ["Failed orders", acmeAccount.failedOrders.toString()],
         },
         {
            id: "Processing orders",
            columns: ["Processing orders", acmeAccount.processingOrders.toString()],
         }

      ],
      [acmeAccount]

   );


   return (
      <Container className="themed-container" fluid>

         <Widget title={title} busy={isFetchingDetail || isEnabling || isDisabling || isRevoking}>

            <CustomTable
               headers={detailHeaders}
               data={detailData}
            />

         </Widget>

         <Widget title="Order Summary" busy={isFetchingDetail || isEnabling || isDisabling || isRevoking}>

            <CustomTable
               headers={orderHeaders}
               data={orderData}
            />

         </Widget>

         <Dialog
            isOpen={confirmRevoke}
            caption="Revoke ACME Account"
            body="You are about to revoke an ACME Account. Is this what you want to do?"
            toggle={() => setConfirmRevoke(false)}
            buttons={[
               { color: "danger", onClick: onRevokeConfirmed, body: "Yes, revoke" },
               { color: "secondary", onClick: () => setConfirmRevoke(false), body: "Cancel" },
            ]}
         />

      </Container>
   );


}

/*import React, { useCallback, useEffect } from "react";
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
import { acmeAccountStatus } from "../../../utils/acmeAccount";
import StatusCircle from "../../../components/StatusCircle";

function AcmeAccountDetail() {
  const dispatch = useDispatch();
  const isFetchingAccounts = useSelector(selectors.isFetching);
  const accountDetails = useSelector(selectors.selectSelectedAccount);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAccountId);
  const isRevoking = useSelector(selectors.isRevoking);

  const history = useHistory();
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;

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
              <td>
                {accountDetails?.termsOfServiceAgreed ? (
                  <StatusCircle status={true} />
                ) : (
                  <StatusCircle status={false} />
                )}
              </td>
            </tr>
            <tr>
              <td>Contacts</td>
              <td>
                {accountDetails?.contact.map(function (contact) {
                  return (
                    <span>
                      {contact}
                      <br />
                    </span>
                  );
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
*/