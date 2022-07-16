import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { Button, Container, Input, Label } from "reactstrap";

import Spinner from "components/Spinner";
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
import CertificateStatusIcon from "../../../components/CertificateStatusIcon";

import { CertificateContentForFile, CertificateDetailResponse } from "models";
import CertificateActions from "components/CertificateActions";
import MDBColumnName from "components/MDBColumnName";
import { dateFormatter } from "utils/dateUtil";
import CertificateSearch from "components/CertificateSearch";
import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";

function CertificateList() {
  const certificates = useSelector(selectors.selectCertificates);
  const isFetching = useSelector(selectors.isFetchingList);
  const isDeleting = useSelector(selectors.isDeletingCertificate);
  const groups = useSelector(groupSelectors.selectGroups);
  const entities = useSelector(entitySelectors.selectEntities);
  const raProfiles = useSelector(profileSelectors.selectProfiles);
  const actionCounter = useSelector(selectors.selectActionCounter);

  const dispatch = useDispatch();
  const { path } = useRouteMatch();
  const history = useHistory();

  const [checkedRows, setCheckedRows]: any = useState([]);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entityModalOpen, setEntityModalOpen] = useState(false);
  const [raProfileModalOpen, setRaProfileModalOpen] = useState(false);
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [selectedGroup, setSelectedGroup]: any = useState("select");
  const [selectedEntity, setSelectedEntity]: any = useState("select");
  const [selectedRaProfile, setSelectedRaProfile]: any = useState("select");
  const [selectedOwner, setSelectedOwner]: any = useState();
  const [uploadedCertificate, setUploadedCertificate]: any = useState("");

  const [inFilter, setInFilter] = useState<any>([]);
  const [allSelect, setAllSelect] = useState<boolean>(false);

  const [certData, setCertData] = useState(
    new Map<string | number, CertificateContentForFile>()
  );

  const checkHandler = (certificate: CertificateDetailResponse) => {
    let updated = [...checkedRows];

    if (updated.includes(certificate.uuid)) {
      const index = updated.indexOf(certificate.uuid);
      updated.splice(index, 1);
    } else {
      updated.push(certificate.uuid);
    }
    setCheckedRows(updated);

    let updatedCert = new Map(certData);
    let certContent = {
      commonName: certificate.commonName,
      serialNumber: certificate.serialNumber,
      certificateContent: certificate.certificateContent || "",
    };
    updatedCert.set(certificate.uuid, certContent);
    setCertData(updatedCert);
  };

  const setUploadedContent = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files != null) {
      let reader = new FileReader();
      reader.onload = function (ev) {
        const content = reader.result || "";
        setUploadedCertificate(Buffer.from(content).toString("base64"));
      };
      reader.readAsArrayBuffer(event.currentTarget.files[0]);
    }
  };
  const onConfirmDelete = () => {
    setDeleteModalOpen(false);
    dispatch(
      actions.requestDeleteBulkCertificate(checkedRows, inFilter, allSelect)
    );
    setCheckedRows([]);
  };

  const onConfirmUpload = () => {
    setUploadModalOpen(false);
    dispatch(actions.requestUploadCertificate(uploadedCertificate, history));
    setUploadedCertificate("");
  };

  const onConfirmUpdateGroup = () => {
    setGroupModalOpen(false);
    dispatch(
      actions.requestUpdateBulkGroup(
        checkedRows,
        selectedGroup,
        inFilter,
        allSelect
      )
    );
  };

  const onConfirmUpdateEntity = () => {
    setEntityModalOpen(false);
    dispatch(
      actions.requestUpdateBulkEntity(
        checkedRows,
        selectedEntity,
        inFilter,
        allSelect
      )
    );
  };

  const onConfirmUpdateRaProfile = () => {
    setRaProfileModalOpen(false);
    dispatch(
      actions.requestUpdateBulkRaProfile(
        checkedRows,
        selectedRaProfile,
        inFilter,
        allSelect
      )
    );
  };

  const onConfirmUpdateOwner = () => {
    setOwnerModalOpen(false);
    dispatch(
      actions.requestOwnerBulkUpdate(
        checkedRows,
        selectedOwner,
        inFilter,
        allSelect
      )
    );
  };

  const buttonActionsTrigger = (
    actionType: "group" | "entity" | "raProfile" | "owner" | "delete" | "upload"
  ) => {
    if (actionType === "group") {
      dispatch(groupActions.requestGroupsList());
      setGroupModalOpen(true);
    } else if (actionType === "entity") {
      dispatch(entityActions.requestEntitiesList());
      setEntityModalOpen(true);
    } else if (actionType === "raProfile") {
      dispatch(profileActions.requestRaProfilesList());
      setRaProfileModalOpen(true);
    } else if (actionType === "delete") {
      setDeleteModalOpen(true);
    } else if (actionType === "upload") {
      setUploadModalOpen(true);
    } else {
      setOwnerModalOpen(true);
    }
  };

  const title = (
    <div>
      <CertificateActions
        checkedRows={checkedRows}
        certData={certData}
        buttonActionsTrigger={buttonActionsTrigger}
      />
      <h5 className="mt-0">
        List of <span className="fw-semi-bold">Certificates</span>
      </h5>
    </div>
  );

  const certificateList = () => {
    let rows: any = [];
    for (let certificate of certificates) {
      let column: any = {};
      column["commonName"] = {
        content: certificate.commonName,
        styledContent: (
          <Link to={`${path}/detail/${certificate.uuid}`}>
            {certificate.commonName || "(empty)"}
          </Link>
        ),
        lineBreak: true,
      };
      column["entity"] = {
        content: certificate.entity?.name || "Unassigned",
        lineBreak: true,
      };
      column["raProfile"] = {
        content: certificate.raProfile?.name || "Unassigned",
        lineBreak: true,
      };
      column["group"] = {
        content: certificate.group?.name || "Unassigned",
        lineBreak: true,
      };
      column["owner"] = {
        content: certificate.owner || "Unassigned",
        lineBreak: true,
      };
      column["notBefore"] = {
        content: dateFormatter(certificate.notBefore),
        lineBreak: true,
      };
      column["notAfter"] = {
        content: dateFormatter(certificate.notAfter),
        lineBreak: true,
      };
      column["serialNumber"] = {
        content: certificate.serialNumber,
        lineBreak: true,
      };

      column["signatureAlgorithm"] = {
        content: certificate.signatureAlgorithm,
        lineBreak: true,
      };
      column["status"] = {
        content: certificate.status,
        styledContent: (
          <CertificateStatusIcon
            status={certificate.status}
            id={certificate.fingerprint || certificate.serialNumber}
          />
        ),
        lineBreak: true,
      };
      column["publicKeyAlgorithm"] = {
        content: certificate.publicKeyAlgorithm,
        lineBreak: true,
      };
      column["fingerprint"] = {
        content: certificate.fingerprint,
        lineBreak: true,
      };
      column["issuerCommonName"] = {
        content: certificate.issuerCommonName,
        lineBreak: true,
      };
      column["uuid"] = {
        content: certificate.uuid,
        lineBreak: true,
      };
      column["certificateType"] = {
        content: certificate.certificateType,
        lineBreak: true,
      };

      rows.push({
        id: certificate.uuid,
        column: column,
        data: certificate,
      });
    }
    return rows;
  };

  const certificateRowHeaders = [
    {
      styledContent: <MDBColumnName columnName="Status" />,
      content: "status",
      sort: false,
      id: "certificateStatus",
      width: "5%",
    },
    {
      styledContent: <MDBColumnName columnName="Common Name" />,
      content: "commonName",
      sort: false,
      id: "certificateCommonName",
      width: "10%",
    },
    {
      styledContent: <MDBColumnName columnName="Valid From" />,
      content: "notBefore",
      sort: false,
      id: "certificateNotBefore",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Expires At" />,
      content: "notAfter",
      sort: false,
      id: "certificateNotAfter",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Entity" />,
      content: "entity",
      sort: false,
      id: "certificateEntity",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Group" />,
      content: "group",
      sort: false,
      id: "certificateGroup",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="RA Profile" />,
      content: "raProfile",
      sort: false,
      id: "certificateRaProfile",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Owner" />,
      content: "owner",
      sort: false,
      id: "certificateOwner",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Serial Number" />,
      content: "serialNumber",
      sort: false,
      id: "certificateSerialNumber",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Signature Algorithm" />,
      content: "signatureAlgorithm",
      sort: false,
      id: "certificateSignatureAlgorithm",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Public Key Algorithm" />,
      content: "publicKeyAlgorithm",
      sort: false,
      id: "certificatePublicKeyAlgorithm",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Issuer Common Name" />,
      content: "issuerCommonName",
      sort: false,
      id: "certificateIssuerCommonName",
      width: "15%",
    },
    {
      styledContent: <MDBColumnName columnName="Certificate Type" />,
      content: "certificateType",
      sort: false,
      id: "certificateTypeName",
      width: "15%",
    },
  ];

  return (
    <Container className="themed-container" fluid>
      <CertificateSearch
        title={title}
        checkedRows={checkedRows}
        checkedRowsFunction={setCheckedRows}
        data={certificates}
        headers={certificateRowHeaders}
        rows={certificateList()}
        sourceCheckHandler={checkHandler}
        allSelectSetter={setAllSelect}
        inFilterSetter={setInFilter}
        actionCounter={actionCounter}
      />

      <MDBModal
        overflowScroll={false}
        isOpen={uploadModalOpen}
        toggle={() => setUploadModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setUploadModalOpen(false)}>
          Upload Certificate
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="certificate">Certificate</Label>
          <Input
            type="file"
            placeholder="Upload certificate file"
            onChange={(event) => setUploadedContent(event)}
          />
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpload}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
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
        overflowScroll={false}
        isOpen={groupModalOpen}
        toggle={() => setGroupModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setGroupModalOpen(false)}>
          Update Group
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Group Name">Group Name</Label>
          <Input
            type="select"
            onChange={(event) =>
              setSelectedGroup(JSON.parse(event.target.value))
            }
          >
            <option key="select" value="select">
              Select
            </option>
            {groups.map(function (provider) {
              return (
                <option key={provider.uuid} value={JSON.stringify(provider)}>
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
          <Button color="secondary" onClick={() => setGroupModalOpen(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={entityModalOpen}
        toggle={() => setEntityModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setEntityModalOpen(false)}>
          Update Entity
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Entity Name">Entity Name</Label>
          <Input
            type="select"
            onChange={(event) =>
              setSelectedEntity(JSON.parse(event.target.value))
            }
          >
            <option key="select" value="select">
              Select
            </option>
            {entities.map(function (provider) {
              return (
                <option key={provider.uuid} value={JSON.stringify(provider)}>
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
          <Button color="secondary" onClick={() => setEntityModalOpen(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={raProfileModalOpen}
        toggle={() => setRaProfileModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setRaProfileModalOpen(false)}>
          Update RA Profile
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Entity Name">RA Profile Name</Label>
          <Input
            type="select"
            onChange={(event) =>
              setSelectedRaProfile(JSON.parse(event.target.value))
            }
          >
            <option key="select" value="select">
              Select
            </option>
            {raProfiles.map(function (provider) {
              return (
                <option key={provider.uuid} value={JSON.stringify(provider)}>
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
          <Button
            color="secondary"
            onClick={() => setRaProfileModalOpen(false)}
          >
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <MDBModal
        overflowScroll={false}
        isOpen={ownerModalOpen}
        toggle={() => setOwnerModalOpen(false)}
      >
        <MDBModalHeader toggle={() => setOwnerModalOpen(false)}>
          Update Owner
        </MDBModalHeader>
        <MDBModalBody>
          <Label for="Owner Name">Owner</Label>
          <Input
            type="text"
            placeholder="Enter the owner name / Email"
            onChange={(event) => setSelectedOwner(event.target.value)}
          ></Input>
        </MDBModalBody>
        <MDBModalFooter>
          <Button color="primary" onClick={onConfirmUpdateOwner}>
            Update
          </Button>
          <Button color="secondary" onClick={() => setOwnerModalOpen(false)}>
            Cancel
          </Button>
        </MDBModalFooter>
      </MDBModal>

      <Spinner active={isFetching || isDeleting} />
    </Container>
  );
}

export default CertificateList;
