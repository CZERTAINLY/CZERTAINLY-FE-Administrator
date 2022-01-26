import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";
import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-profiles";
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

function AcmeProfileList() {
  const profiles = useSelector(selectors.selectProfiles);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeleting);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteProfileId);
  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestAcmeProfilesList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onConfirmDelete = useCallback(() => {
    dispatch(actions.confirmBulkDeleteProfile(checkedRows));
    setCheckedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmDeleteId]);

  const onCancelDelete = useCallback(
    () => dispatch(actions.cancelBulkDeleteProfile()),
    [dispatch]
  );

  const onDeleteProfile = () => {
    dispatch(actions.confirmBulkDeleteProfileRequest(checkedRows));
  };

  const onEnableProfile = () => {
    dispatch(actions.requestBulkEnableProfile(checkedRows));
    setCheckedRows([]);
  };

  const onDisableProfile = () => {
    dispatch(actions.requestBulkDisableProfile(checkedRows));
    setCheckedRows([]);
  };

  const title = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link to={`${path}/add`} className="btn btn-link">
          <i className="fa fa-plus" />
        </Link>
        <Button
          className="btn btn-link"
          color="white"
          onClick={onDeleteProfile}
          data-for="delete"
          data-tip
          disabled={!(checkedRows.length !== 0)}
        >
          {!(checkedRows.length !== 0) ? (
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
          onClick={onDisableProfile}
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
        List of <span className="fw-semi-bold">RA Profiles</span>
      </h5>
    </div>
  );

  const profilesList = () => {
    let rows: any = [];
    for (let profile of profiles) {
      let column: any = {};
      column["name"] = {
        content: profile.name,
        styledContent: (
          <Link to={`${path}/detail/${profile.uuid}`}>{profile.name}</Link>
        ),
        lineBreak: true,
      };
      column["description"] = {
        content: profile.description,
        lineBreak: true,
      };
      column["raProfileName"] = {
        content: profile.raProfileName || "",
        styledContent: (
          <MDBBadge color="info">{profile.raProfileName || ""}</MDBBadge>
        ),
        lineBreak: true,
      };

      column["directoryUrl"] = {
        content: profile.directoryUrl,
        lineBreak: true,
      };
      column["status"] = {
        content: profile.enabled ? "enabled" : "disabled",
        styledContent: <StatusBadge enabled={profile.enabled} />,
        lineBreak: true,
      };
      rows.push({
        id: profile.uuid,
        column: column,
        data: profile,
      });
    }
    return rows;
  };

  const profileRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "acmeProfileName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Description" />,
      content: "description",
      sort: false,
      id: "acmeProfileDescription",
      width: "20%",
    },
    {
      styledContent: <MDBColumnName columnName="RA Profile Name" />,
      content: "raProfileName",
      sort: false,
      id: "acmeRaProfileName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Directory URL" />,
      content: "directoryUrl",
      sort: false,
      id: "acmeDirectoryUrl",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "acmeProfileStatus",
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
          data={profiles}
          headers={profileRowHeaders}
          rows={profilesList()}
        />
      </Widget>
      <MDBModal
        overflowScroll={false}
        isOpen={confirmDeleteId !== ""}
        toggle={onCancelDelete}
      >
        <MDBModalHeader toggle={onCancelDelete}>Delete Profile</MDBModalHeader>
        <MDBModalBody>
          You are about to delete ACME Profile(s) which may have associated ACME
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
      <Spinner active={isFetching || isDeleting || isEditing} />
    </Container>
  );
}

export default AcmeProfileList;
