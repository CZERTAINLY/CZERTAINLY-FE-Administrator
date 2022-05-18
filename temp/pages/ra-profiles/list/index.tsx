import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";
import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ra-profiles";
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

function RaProfileList() {
  const profiles = useSelector(selectors.selectProfiles);
  const isFetching = useSelector(selectors.isFetching);
  const isDeleting = useSelector(selectors.isDeleting);
  const isEditing = useSelector(selectors.isEditing);
  const confirmDeleteId = useSelector(selectors.selectConfirmDeleteProfileId);
  const [checkedRows, setCheckedRows] = useState<(string | number)[]>([]);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(actions.requestRaProfilesList());
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

  const getProtocolsForDisplay = (protocols: string[]) => {
    return protocols.map(function (protocol) {
      return (
        <>
          <MDBBadge color="secondary" searchvalue={protocol}>
            {protocol}
          </MDBBadge>
          &nbsp;
        </>
      );
    });
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
      column["authority"] = {
        content: profile.authorityInstanceName,
        styledContent: (
          <MDBBadge color="info">{profile.authorityInstanceName}</MDBBadge>
        ),
        lineBreak: true,
      };
      column["description"] = {
        content: profile.description,
        lineBreak: true,
      };
      column["enabledProtocols"] = {
        content: getProtocolsForDisplay(profile.enabledProtocols || []).join(
          ""
        ),
        styledContent: getProtocolsForDisplay(profile.enabledProtocols || []),
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
      id: "raProfileName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Description" />,
      content: "description",
      sort: false,
      id: "raProfileDescription",
      width: "20%",
    },
    {
      styledContent: <MDBColumnName columnName="Authority" />,
      content: "authority",
      sort: false,
      id: "raProfileAuthority",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Enabled Protocols" />,
      content: "enabledProtocols",
      sort: false,
      id: "enabledProtocols",
      width: "20%",
    },
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "adminStatus",
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
          You are about to delete RA Profiles which may have existing
          authorizations from clients. If you continue, these authorizations
          will be deleted as well. Is this what you want to do?
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

export default RaProfileList;
