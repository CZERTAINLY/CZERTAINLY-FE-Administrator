import { TableDataRow, TableHeader } from "components/CustomTable";

import Dialog from "components/Dialog";
import { WidgetButtonProps } from "components/WidgetButtons";

import { actions, selectors } from "ducks/certificates";
import { EntityType } from "ducks/filters";
import { selectors as pagingSelectors } from "ducks/paging";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectors as enumSelectors } from "ducks/enums";
import { Badge, Container, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";

import PagedList from "components/PagedList/PagedList";
import { dateFormatter } from "utils/dateUtil";
import { AttributeRequestModel } from "../../../../types/attributes";
import { CertificateType, PlatformEnum } from "../../../../types/openapi";
import CertificateComplianceStatusIcon from "../CertificateComplianceStatusIcon";
import CertificateGroupDialog from "../CertificateGroupDialog";
import CertificateOwnerDialog from "../CertificateOwnerDialog";
import CertificateRAProfileDialog from "../CertificateRAProfileDialog";
import CertificateStatus from "../CertificateStatus";
import CertificateUploadDialog from "../CertificateUploadDialog";

interface Props {
    selectCertsOnly?: boolean;
    multiSelect?: boolean;
    onCheckedRowsChanged?: (checkedRows: (string | number)[]) => void;
}

export default function CertificateList({ selectCertsOnly = false, multiSelect = true, onCheckedRowsChanged }: Props) {
    const dispatch = useDispatch();

    const certificates = useSelector(selectors.certificates);
    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.CERTIFICATE));

    const isIssuing = useSelector(selectors.isIssuing);
    const isRevoking = useSelector(selectors.isRevoking);
    const isRenewing = useSelector(selectors.isRenewing);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
    const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
    const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
    const isBulkUpdatingGroup = useSelector(selectors.isBulkUpdatingGroup);
    const isBulkUpdatingRaProfile = useSelector(selectors.isBulkUpdatingRaProfile);
    const isBulkUpdatingOwner = useSelector(selectors.isBulkUpdatingOwner);
    const isUploading = useSelector(selectors.isUploading);
    const certificateTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateType));

    const [upload, setUpload] = useState<boolean>(false);
    const [updateGroup, setUpdateGroup] = useState<boolean>(false);
    const [updateOwner, setUpdateOwner] = useState<boolean>(false);
    const [updateEntity, setUpdateEntity] = useState<boolean>(false);
    const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);

    const isBusy =
        isIssuing ||
        isRevoking ||
        isRenewing ||
        isDeleting ||
        isBulkDeleting ||
        isUpdatingGroup ||
        isUpdatingRaProfile ||
        isUpdatingOwner ||
        isBulkUpdatingGroup ||
        isBulkUpdatingRaProfile ||
        isBulkUpdatingOwner ||
        isUploading;

    useEffect(() => {
        dispatch(actions.clearDeleteErrorMessages());
    }, [dispatch]);

    useEffect(() => {
        if (onCheckedRowsChanged) {
            onCheckedRowsChanged(checkedRows);
        }
    }, [checkedRows, onCheckedRowsChanged]);

    const onUploadClick = useCallback(
        (data: { fileContent: string; customAttributes?: Array<AttributeRequestModel> }) => {
            if (data.fileContent) {
                try {
                    dispatch(actions.uploadCertificate({ certificate: data.fileContent, customAttributes: data.customAttributes ?? [] }));
                } catch (error) {}
            }

            setUpload(false);
        },
        [dispatch],
    );

    const downloadDropDown = useMemo(
        () => (
            <UncontrolledButtonDropdown>
                <DropdownToggle color="light" caret className="btn btn-link" disabled={checkedRows.length === 0} title="Download">
                    <i className="fa fa-download" aria-hidden="true" />
                </DropdownToggle>

                <DropdownMenu>
                    <DropdownItem
                        key="pem"
                        onClick={() => {
                            dispatch(actions.getCertificateContents({ uuids: checkedRows, format: "pem" }));
                        }}
                    >
                        PEM (.pem)
                    </DropdownItem>

                    <DropdownItem
                        key="der"
                        onClick={() => {
                            dispatch(actions.getCertificateContents({ uuids: checkedRows, format: "cer" }));
                        }}
                    >
                        DER (.cer)
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        ),
        [dispatch, checkedRows],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () =>
            selectCertsOnly
                ? []
                : [
                      {
                          icon: "upload",
                          disabled: false,
                          tooltip: "Upload Certificate",
                          onClick: () => {
                              setUpload(true);
                          },
                      },
                      {
                          icon: "group",
                          disabled: checkedRows.length === 0,
                          tooltip: "Update Group",
                          onClick: () => {
                              setUpdateGroup(true);
                          },
                      },
                      {
                          icon: "user",
                          disabled: checkedRows.length === 0,
                          tooltip: "Update Owner",
                          onClick: () => {
                              setUpdateOwner(true);
                          },
                      },
                      // { icon: "cubes", disabled: true, tooltip: "Update Entity", onClick: () => { setUpdateEntity(true) } },
                      {
                          icon: "plug",
                          disabled: checkedRows.length === 0,
                          tooltip: "Update RA Profile",
                          onClick: () => {
                              setUpdateRaProfile(true);
                          },
                      },
                      {
                          icon: "download",
                          disabled: checkedRows.length === 0,
                          tooltip: "Download",
                          custom: downloadDropDown,
                          onClick: () => {},
                      },
                  ],
        [checkedRows.length, downloadDropDown, selectCertsOnly],
    );

    const certificatesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Status",
                //sortable: true,
                align: "center",
                id: "status",
                width: "5%",
            },
            {
                content: "Compliance",
                //sortable: true,
                align: "center",
                id: "compliance",
                width: "5%",
            },
            {
                content: "",
                //sortable: true,
                align: "center",
                id: "keyAvailability",
                width: "1%",
            },
            {
                content: "Common Name",
                //sortable: true,
                id: "commonName",
                width: "10%",
            },
            {
                content: "Valid From",
                //sortable: true,
                //sortType: "date",
                id: "validFrom",
                width: "15%",
            },
            {
                content: "Expires At",
                //sortable: true,
                //sortType: "date",
                id: "expiresAt",
                width: "15%",
            },
            {
                content: "Group",
                //sortable: true,
                id: "group",
                width: "15%",
            },
            {
                content: "RA Profile",
                //sortable: true,
                id: "raProfile",
                width: "15%",
            },
            {
                content: "Owner",
                //sortable: true,
                id: "owner",
                width: "15%",
            },
            {
                content: "Serial number",
                //sortable: true,
                id: "serialNumber",
                width: "15%",
            },
            {
                content: "Signature Algorithm",
                //sortable: true,
                id: "signatureAlgorithm",
                width: "15%",
            },
            {
                content: "Public Key Algorithm",
                //sortable: true,
                id: "publicKeyAlgorithm",
                width: "15%",
            },
            {
                content: "Issuer Common Name",
                //sortable: true,
                id: "issuerCommonName",
                width: "15%",
            },
            {
                content: "Certificate Type",
                //sortable: true,
                id: "certificateType",
                width: "15%",
            },
        ],
        [],
    );

    const certificateList: TableDataRow[] = useMemo(
        () =>
            certificates.map((certificate) => {
                return {
                    id: certificate.uuid,
                    columns: [
                        <CertificateStatus status={certificate.status} asIcon={true} />,
                        <CertificateComplianceStatusIcon
                            status={certificate.complianceStatus}
                            id={`compliance-${certificate.fingerprint || certificate.serialNumber}`}
                        />,
                        certificate.privateKeyAvailability ? <i className="fa fa-key" aria-hidden="true"></i> : "",
                        selectCertsOnly ? (
                            certificate.commonName || "(empty)"
                        ) : (
                            <Link to={`./detail/${certificate.uuid}`}>{certificate.commonName || "(empty)"}</Link>
                        ),
                        certificate.notBefore ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notBefore)}</span> : "",
                        certificate.notAfter ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notAfter)}</span> : "",
                        certificate.group?.name || "Unassigned",
                        <span style={{ whiteSpace: "nowrap" }}>{certificate.raProfile?.name || "Unassigned"}</span>,
                        certificate.owner || "Unassigned",
                        certificate.serialNumber || "",
                        certificate.signatureAlgorithm,
                        certificate.publicKeyAlgorithm,
                        certificate.issuerCommonName || "",
                        certificate.certificateType ? (
                            <Badge color={certificate.certificateType === CertificateType.X509 ? "primary" : "secondary"}>
                                {certificateTypeEnum[certificate.certificateType].label}
                            </Badge>
                        ) : (
                            ""
                        ),
                    ],
                };
            }),
        [certificates, selectCertsOnly, certificateTypeEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.CERTIFICATE}
                listAction={actions.listCertificates}
                onDeleteCallback={(uuids, filters) => dispatch(actions.bulkDelete({ uuids, filters }))}
                getAvailableFiltersApi={useCallback((apiClients) => apiClients.certificates.getSearchableFieldInformation4(), [])}
                additionalButtons={buttons}
                headers={certificatesRowHeaders}
                data={certificateList}
                isBusy={isBusy}
                title="List of Certificates"
                entityNameSingular="Certificate"
                entityNamePlural="Certificates"
                filterTitle="Certificate Inventory Filter"
                multiSelect={multiSelect}
            />

            <Dialog
                isOpen={upload}
                caption={`Upload Certificate`}
                body={<CertificateUploadDialog onCancel={() => setUpload(false)} onUpload={(data) => onUploadClick(data)} />}
                toggle={() => setUpload(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateGroup}
                caption={`Update Group`}
                body={
                    <CertificateGroupDialog
                        uuids={checkedRows}
                        onCancel={() => setUpdateGroup(false)}
                        onUpdate={() => setUpdateGroup(false)}
                    />
                }
                toggle={() => setUpdateGroup(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateOwner}
                caption={`Update Owner`}
                body={
                    <CertificateOwnerDialog
                        uuids={checkedRows}
                        onCancel={() => setUpdateOwner(false)}
                        onUpdate={() => setUpdateOwner(false)}
                    />
                }
                toggle={() => setUpdateOwner(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={updateEntity}
                caption={`Update Entity`}
                body={`Update Entity`}
                toggle={() => setUpdateEntity(false)}
                buttons={[
                    { color: "primary", onClick: () => {}, body: "Update" },
                    { color: "secondary", onClick: () => setUpdateEntity(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={updateRaProfile}
                caption={`Update RA Profile`}
                body={
                    <CertificateRAProfileDialog
                        uuids={checkedRows}
                        onCancel={() => setUpdateRaProfile(false)}
                        onUpdate={() => setUpdateRaProfile(false)}
                    />
                }
                toggle={() => setUpdateRaProfile(false)}
                buttons={[]}
            />
        </Container>
    );
}
