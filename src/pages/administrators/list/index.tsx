import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { Button, Container } from "reactstrap";

import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import StatusCircle from "components/StatusCircle";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/administrators";
import MDBColumnName from "components/MDBColumnName";
import ToolTip from "components/ToolTip";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import CustomTable from "components/CustomTable";

function AdministratorsList() {
  const administrators = useSelector(selectors.selectAdministrators);
  const isFetching = useSelector(selectors.isFetchingList);
  const isDeleting = useSelector(selectors.isDeleting);
  const isEditing = useSelector(selectors.isEditing);

  const [checkedRows, setCheckedRows] = useState<string[]>([]);
  const [isDeleteAdmin, setIsDeleteAdmin] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();

  useEffect(
    () => {
      dispatch(actions.requestAdministratorsList());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onDelete = () => {
    dispatch(actions.requestBulkDelete(checkedRows));
    setCheckedRows([]);
    setIsDeleteAdmin(false);
  };

  const onEnable = () => {
    dispatch(actions.requestBulkEnable(checkedRows));
    setCheckedRows([]);
  };

  const onDisable = () => {
    dispatch(actions.requestBulkDisable(checkedRows));
    setCheckedRows([]);
  };

  const title = (
    <div>
      <div className="pull-right mt-n-xs">
        <Link to="/app/administrators/add" className="btn btn-link">
          <i className="fa fa-plus" />
        </Link>
        <Button
          className="btn btn-link"
          color="white"
          onClick={() => setIsDeleteAdmin(true)}
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
          onClick={onEnable}
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
          onClick={onDisable}
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
        List of <span className="fw-semi-bold">Administrators</span>
      </h5>
    </div>
  );

  const administratorsList = () => {
    let rows: any = [];
    for (let administrator of administrators) {
      let column: any = {};
      column["name"] = {
        content: administrator.name,
        styledContent: (
          <Link to={`${path}/detail/${administrator.uuid}`}>
            {administrator.name}
          </Link>
        ),
        lineBreak: true,
      };
      column["username"] = {
        content: administrator.username,
        lineBreak: true,
      };
      column["serialNumber"] = {
        content: administrator.serialNumber,
        lineBreak: true,
      };
      column["adminDn"] = {
        content: administrator.certificate.subjectDn,
        lineBreak: true,
      };
      column["superAdmin"] = {
        content: administrator.superAdmin ? "Yes" : "No",
        styledContent: <StatusCircle status={administrator.superAdmin} />,
        lineBreak: true,
      };
      column["status"] = {
        content: administrator.enabled ? "enabled" : "disabled",
        styledContent: <StatusBadge enabled={administrator.enabled} />,
        lineBreak: true,
      };
      rows.push({
        id: administrator.uuid,
        column: column,
        data: administrator,
      });
    }
    return rows;
  };

  const administratorRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Name" />,
      content: "name",
      sort: false,
      id: "adminName",
      width: "5%",
    },
    {
      styledContent: <MDBColumnName columnName="Username" />,
      content: "username",
      sort: false,
      id: "adminUsername",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Serial Number" />,
      content: "serialNumber",
      sort: false,
      id: "adminSerialNumber",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Admin DN" />,
      content: "adminDn",
      sort: false,
      id: "adminAdminDn",
      width: "35%",
    },
    {
      styledContent: <MDBColumnName columnName="Super Admin" />,
      content: "superAdmin",
      sort: false,
      id: "adminSuperAdmin",
      width: "5%",
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
          data={administrators}
          headers={administratorRowHeaders}
          rows={administratorsList()}
        />
      </Widget>

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
      <Spinner active={isFetching || isDeleting || isEditing} />
    </Container>
  );
}

export default AdministratorsList;
