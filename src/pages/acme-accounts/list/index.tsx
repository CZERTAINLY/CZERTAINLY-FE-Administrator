import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";
import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-accounts";
import MDBColumnName from "components/MDBColumnName";
import {
  MDBBadge,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import ToolTip from "components/ToolTip";
import CustomTable from "components/CustomTable";

function AcmeAccountList() {
  const accounts = useSelector(selectors.selectAccounts);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeleting);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteAccountId);
  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestAcmeAccountList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmBulkDeleteAccount(checkedRows));
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmDeleteId]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteAccount()),
    [dispatch]
  );

  const onDeleteAccount = () => {
    dispatch(actions.confirmBulkDeleteAccountRequest(checkedRows));
  };

  const onEnableAccount = () => {
    dispatch(actions.requestBulkEnableAccount(checkedRows));
    setCheckedRows([]);
  };

  const onDisableAccount = () => {
    dispatch(actions.requestBulkDisableAccount(checkedRows));
    setCheckedRows([]);
  };

  const title = (
    <div>
      <div className="pull-right mt-n-xs">
        <Button
          className="btn btn-link"
          color="white"
          onClick={onDeleteAccount}
          data-for="revoke"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
            <i className="fa fa-battery-empty" />
          ) : (
            <i className="fa fa-battery-empty" style={{ color: "red" }} />
          )}

          <ToolTip id="revoke" message="Revoke" />
        </Button>

        <Button
          className="btn btn-link"
          color="white"
          onClick={onEnableAccount}
          data-for="enable"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
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
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
            <i className="fa fa-times" />
          ) : (
            <i className="fa fa-times" style={{ color: "red" }} />
          )}

          <ToolTip id="disable" message="Disable" />
        </Button>
      </div>
      <h5 className="mt-0">
        List of <span className="fw-semi-bold">ACME Accounts</span>
      </h5>
    </div>
  );

  const accountsList = () => {
    let rows: any = [];
    for (let account of accounts) {
      let column: any = {};
      column["accountId"] = {
        content: account.accountId,
        styledContent: (
          <Link to={`${path}/detail/${account.uuid}`}>{account.accountId}</Link>
        ),
        lineBreak: true,
      };
      column["acmeProfileName"] = {
        content: account.acmeProfileName,
        styledContent: (
          <MDBBadge color="info">{account.acmeProfileName}</MDBBadge>
        ),
        lineBreak: true,
      };
      column["raProfileName"] = {
        content: account.raProfileName,
        styledContent: (
          <MDBBadge color="info">{account.raProfileName}</MDBBadge>
        ),
        lineBreak: true,
      };
      column["enabled"] = {
        content: account.enabled ? "enabled" : "disabled",
        styledContent: <StatusBadge enabled={account.enabled} />,
        lineBreak: true,
      };
      column["status"] = {
        content: account.status,
        lineBreak: true,
      };
      column["totalOrders"] = {
        content: account.totalOrders.toString(),
        lineBreak: true,
      };
      rows.push({
        id: account.uuid,
        column: column,
        data: account,
      });
    }
    return rows;
  };

  const accountRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Account Id" />,
      content: "accountId",
      sort: false,
      id: "accountId",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="ACME Profile Name" />,
      content: "acmeProfileName",
      sort: false,
      id: "acmeProfileName",
      width: "20%",
    },
    {
      styledContent: <MDBColumnName columnName="RA Profile Name" />,
      content: "raProfileName",
      sort: false,
      id: "raProfileName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Enabled" />,
      content: "enabled",
      sort: false,
      id: "enabled",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "status",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Total Orders" />,
      content: "totalOrders",
      sort: false,
      id: "totalOrders",
      width: "10%",
    },
  ];

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <br />
        <CustomTable
          checkedRows={checkedRows}
          checkedRowsFunction={setCheckedRows}
          data={accounts}
          headers={accountRowHeaders}
          rows={accountsList()}
        />
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Account</MDBModalHeader>
        <MDBModalBody>
          You are about to Revoke ACME Account that may still be used by some
          ACME clients. Deleting these accounts will invalidate the account.
          Existing orders from this account will not be disturbed however, any
          orders which are not yet completed will be deactivated.
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
      <Spinner active={isFetching || isDeleting} />
    </Container>
  );
}

export default AcmeAccountList;
