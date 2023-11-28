import { Buffer } from "buffer";
import AttributeEditor from "components/Attributes/AttributeEditor";
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from "components/Attributes/AttributeViewer";
import ComplianceRuleAttributeViewer from "components/Attributes/ComplianceRuleAttributeViewer";
import CustomTable, { TableDataRow, TableHeader } from "components/CustomTable";
import Dialog from "components/Dialog";
import ProgressButton from "components/ProgressButton";
import Spinner from "components/Spinner";
import StatusBadge from "components/StatusBadge";
import { actions as alertActions } from "ducks/alerts";
import { actions as utilsActuatorActions, selectors as utilsActuatorSelectors } from "ducks/utilsActuator";

import Widget from "components/Widget";
import { WidgetButtonProps } from "components/WidgetButtons";
import { actions as groupAction, selectors as groupSelectors } from "ducks/certificateGroups";
import { actions as userAction, selectors as userSelectors } from "ducks/users";

import { actions, selectors } from "ducks/certificates";
import { actions as connectorActions } from "ducks/connectors";
import { actions as locationActions, selectors as locationSelectors } from "ducks/locations";
import { actions as raProfileAction, selectors as raProfileSelectors } from "ducks/ra-profiles";
import { selectors as settingSelectors } from "ducks/settings";

import {
    CertificateState as CertStatus,
    CertificateValidationStatus,
    DownloadCertificateChainCertificateFormatEnum,
} from "../../../../types/openapi";

import { selectors as enumSelectors, getEnumLabel } from "ducks/enums";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Form } from "react-final-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

import { actions as raProfilesActions, selectors as raProfilesSelectors } from "ducks/ra-profiles";
import {
    Badge,
    Form as BootstrapForm,
    Button,
    ButtonGroup,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Label,
    Row,
    UncontrolledButtonDropdown,
} from "reactstrap";
import { AttributeDescriptorModel } from "types/attributes";
import { ClientCertificateRevocationDtoReasonEnum, ComplianceStatus, Resource } from "types/openapi";
import { mutators } from "utils/attributes/attributeEditorMutators";
import { collectFormAttributes } from "utils/attributes/attributes";
import { downloadFile, formatPEM } from "utils/certificate";

import { PlatformEnum } from "types/openapi";
import { dateFormatter } from "utils/dateUtil";
import CustomAttributeWidget from "../../../Attributes/CustomAttributeWidget";
import TabLayout from "../../../Layout/TabLayout";
import Asn1Dialog from "../Asn1Dialog/Asn1Dialog";
import CertificateRekeyDialog from "../CertificateRekeyDialog";
import CertificateRenewDialog from "../CertificateRenewDialog";

import cx from "classnames";
import FlowChart, { CustomNode } from "components/FlowChart";
import { transformCertifacetObjectToNodesAndEdges } from "ducks/transform/certificates";
import { Edge } from "reactflow";
import { LockWidgetNameEnum } from "types/widget-locks";
import { DeviceType, useDeviceType } from "utils/common-hooks";
import CertificateStatus from "../CertificateStatus";
import styles from "./certificateDetail.module.scss";

interface ChainDownloadSwitchState {
    isDownloadTriggered: boolean;
    certificateFormat?: DownloadCertificateChainCertificateFormatEnum;
}

export default function CertificateDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const certificate = useSelector(selectors.certificateDetail);
    const certificateChain = useSelector(selectors.certificateChain);
    const certificateChainDownloadContent = useSelector(selectors.certificateChainDownloadContent);

    const groups = useSelector(groupSelectors.certificateGroups);
    const raProfiles = useSelector(raProfileSelectors.raProfiles);
    const users = useSelector(userSelectors.users);

    const eventHistory = useSelector(selectors.certificateHistory);
    const certLocations = useSelector(selectors.certificateLocations);
    const approvals = useSelector(selectors.approvals);

    const validationResult = useSelector(selectors.validationResult);

    const locations = useSelector(locationSelectors.locations);

    const [groupAttributesCallbackAttributes, setGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [certificateNodes, setCertificateNodes] = useState<CustomNode[]>([]);
    const [certificateEdges, setCertificateEdges] = useState<Edge[]>([]);
    const [chainDownloadSwitch, setTriggerChainDownload] = useState<ChainDownloadSwitchState>({ isDownloadTriggered: false });
    const [copyCertificateChainPEMTrigger, setCopyCertificateChainPEMTrigger] = useState<boolean>(false);

    const [isFlowTabOpenend, setIsFlowTabOpenend] = useState<boolean>(false);
    const [groupOptions, setGroupOptions] = useState<{ label: string; value: string }[]>([]);
    const [raProfileOptions, setRaProfileOptions] = useState<{ label: string; value: string }[]>([]);
    const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
    const [certificateRevokeReasonOptions, setCertificateRevokeReasonOptions] = useState<{ label: string; value: string }[]>([]);
    const raProfileSelected = useSelector(raProfilesSelectors.raProfile);
    const certificateRequestFormatEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateRequestFormat));
    const certificateTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateType));
    const certificateRevocationReason = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateRevocationReason));
    const certificateValidationCheck = useSelector(enumSelectors.platformEnum(PlatformEnum.CertificateValidationCheck));

    const isFetchingApprovals = useSelector(selectors.isFetchingApprovals);
    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdatingRaProfile = useSelector(selectors.isUpdatingRaProfile);
    const isUpdatingGroup = useSelector(selectors.isUpdatingGroup);
    const isUpdatingOwner = useSelector(selectors.isUpdatingOwner);
    const isFetchingHistory = useSelector(selectors.isFetchingHistory);
    const isFetchingLocations = useSelector(selectors.isFetchingLocations);
    const isRevoking = useSelector(selectors.isRevoking);
    const isRenewing = useSelector(selectors.isRenewing);
    const isRekeying = useSelector(selectors.isRekeying);
    const isFetchingValidationResult = useSelector(selectors.isFetchingValidationResult);
    const isFetchingCertificateChain = useSelector(selectors.isFetchingCertificateChain);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [renew, setRenew] = useState<boolean>(false);
    const [rekey, setRekey] = useState<boolean>(false);
    const [revoke, setRevoke] = useState<boolean>(false);
    const [updateGroup, setUpdateGroup] = useState<boolean>(false);
    const [updateOwner, setUpdateOwner] = useState<boolean>(false);
    const [updateRaProfile, setUpdateRaProfile] = useState<boolean>(false);
    const deviceType = useDeviceType();
    const [currentInfoId, setCurrentInfoId] = useState("");

    const [group, setGroup] = useState<string>();
    const [ownerUuid, setOwnerUuid] = useState<string>();
    const [raProfile, setRaProfile] = useState<string>();
    const [raProfileAuthorityUuid, setRaProfileAuthorityUuid] = useState<string>();
    const [revokeReason, setRevokeReason] = useState<ClientCertificateRevocationDtoReasonEnum>();

    const [locationsCheckedRows, setLocationCheckedRows] = useState<string[]>([]);
    const [selectLocationsCheckedRows, setSelectLocationCheckedRows] = useState<string[]>([]);

    const [locationToEntityMap, setLocationToEntityMap] = useState<{ [key: string]: string }>({});

    const locationAttributeDescriptors = useSelector(locationSelectors.pushAttributeDescriptors);

    const [addCertToLocation, setAddCertToLocation] = useState<boolean>(false);
    const [confirmRemove, setConfirmRemove] = useState<boolean>(false);

    const isRemovingCertificate = useSelector(locationSelectors.isRemovingCertificate);
    const isPushingCertificate = useSelector(locationSelectors.isPushingCertificate);

    const isFetchingLocationPushAttributeDescriptors = useSelector(locationSelectors.isFetchingPushAttributeDescriptors);

    const isBusy = useMemo(
        () =>
            isFetching ||
            isDeleting ||
            isUpdatingGroup ||
            isUpdatingRaProfile ||
            isUpdatingOwner ||
            isRevoking ||
            isRenewing ||
            isRekeying ||
            isFetchingCertificateChain ||
            isFetchingApprovals,
        [
            isFetching,
            isDeleting,
            isUpdatingGroup,
            isUpdatingRaProfile,
            isUpdatingOwner,
            isRevoking,
            isRenewing,
            isRekeying,
            isFetchingCertificateChain,
            isFetchingApprovals,
        ],
    );

    const downloadCertificateChainContent = useCallback(
        (certificateFormat: DownloadCertificateChainCertificateFormatEnum) => {
            if (!certificate) return;
            dispatch(
                actions.downloadCertificateChain({
                    certificateFormat: certificateFormat,
                    uuid: certificate.uuid,
                    withEndCertificate: true,
                }),
            );
            setTriggerChainDownload({ isDownloadTriggered: true, certificateFormat: certificateFormat });
        },
        [certificate],
    );

    const transformCertificate = useCallback(() => {
        const { nodes, edges } = transformCertifacetObjectToNodesAndEdges(
            certificate,
            users,
            certLocations,
            raProfileSelected,
            certificateChain,
        );
        setCertificateNodes(nodes);
        setCertificateEdges(edges);
    }, [certificate, users, certLocations, raProfileSelected, certificateChain]);

    useEffect(() => {
        if (!certificateChainDownloadContent || !chainDownloadSwitch.isDownloadTriggered) return;

        if (chainDownloadSwitch.certificateFormat === DownloadCertificateChainCertificateFormatEnum.Pem) {
            downloadFile(formatPEM(certificateChainDownloadContent.content ?? ""), fileNameToDownload + "_chain" + ".pem");
        } else {
            downloadFile(Buffer.from(certificateChainDownloadContent.content ?? "", "base64"), fileNameToDownload + "_chain" + ".p7b");
        }

        setTriggerChainDownload({ isDownloadTriggered: false });
    }, [certificateChainDownloadContent, chainDownloadSwitch]);

    useEffect(() => {
        transformCertificate();
    }, [transformCertificate]);
    const health = useSelector(utilsActuatorSelectors.health);
    const settings = useSelector(settingSelectors.platformSettings);

    const getFreshRaProfileDetail = useCallback(() => {
        if (!id || !certificate?.raProfile?.authorityInstanceUuid) return;
        dispatch(
            raProfilesActions.getRaProfileDetail({
                authorityUuid: certificate.raProfile.authorityInstanceUuid,
                uuid: certificate.raProfile.uuid,
            }),
        );
    }, [id, dispatch, certificate]);

    useEffect(() => {
        if (!id) return;
        getFreshRaProfileDetail();
    }, [dispatch, id, certificate]);

    useEffect(() => {
        if (!settings?.utils.utilsServiceUrl) return;
        dispatch(utilsActuatorActions.health());
    }, [dispatch, settings]);

    const getFreshCertificateHistory = useCallback(() => {
        if (!id) return;
        dispatch(actions.getCertificateHistory({ uuid: id }));
    }, [dispatch, id]);

    const getFreshCertificateLocations = useCallback(() => {
        if (!id || isPushingCertificate || isRemovingCertificate) return;

        dispatch(actions.listCertificateLocations({ uuid: id }));
        dispatch(locationActions.listLocations({}));
    }, [dispatch, isPushingCertificate, isRemovingCertificate, id]);

    const getFreshApprovalList = useCallback(() => {
        if (!id) return;
        dispatch(actions.listCertificateApprovals({ uuid: id, paginationRequestDto: {} }));
    }, [dispatch, id]);

    const getCertificateChainDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.getCertificateChain({ uuid: id, withEndCertificate: false }));
    }, [dispatch, id]);

    useEffect(() => {
        if (!id && isFlowTabOpenend) return;
        getCertificateChainDetails();
    }, [isFlowTabOpenend, id]);

    useEffect(() => {
        getFreshCertificateLocations();
    }, [getFreshCertificateLocations]);

    const getFreshCertificateDetail = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getCertificateDetail({ uuid: id }));
        dispatch(actions.getCertificateHistory({ uuid: id }));
        getFreshApprovalList();
        getFreshCertificateLocations();
    }, [dispatch, id]);

    useEffect(() => {
        getFreshCertificateDetail();
    }, [getFreshCertificateDetail, id]);

    const getFreshCertificateValidations = useCallback(() => {
        // TODO: Add toast for no certificate
        if (!certificate) return;
        if (certificate.state === CertStatus.Requested) return;
        dispatch(actions.getCertificateValidationResult({ uuid: certificate.uuid }));
    }, [dispatch, certificate]);

    useEffect(() => {
        getFreshCertificateValidations();
    }, [getFreshCertificateValidations]);

    useEffect(() => {
        if (!certificate || !locations || locations.length === 0) return;

        let locationToEntityMapLocal: { [key: string]: string } = {};

        for (const location of locations) {
            locationToEntityMapLocal[location.uuid] = location.entityInstanceUuid;
        }

        setLocationToEntityMap(locationToEntityMapLocal);
    }, [certificate, locations]);

    useEffect(() => {
        setGroupOptions(groups.map((group) => ({ value: group.uuid, label: group.name })));
    }, [dispatch, groups]);

    useEffect(() => {
        setUserOptions(
            users.map((user) => ({
                value: user.uuid,
                label: `${user.firstName ? user.firstName + " " : ""}${user.lastName ? user.lastName + " " : ""}(${user.username})`,
            })),
        );
    }, [dispatch, users]);

    useEffect(() => {
        setRaProfileOptions(raProfiles.map((group) => ({ value: group.uuid + ":#" + group.authorityInstanceUuid, label: group.name })));
    }, [dispatch, raProfiles]);

    useEffect(() => {
        if (!certificateRevocationReason) return;
        const certificateRevokeReasonOptions = Object.keys(certificateRevocationReason)
            .map((key) => ({
                value: certificateRevocationReason[key].code,
                label: certificateRevocationReason[key].label,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        setCertificateRevokeReasonOptions(certificateRevokeReasonOptions);
    }, [dispatch, certificateRevocationReason]);

    const getGroupList = useCallback(() => {
        if (!id) return;
        dispatch(groupAction.listGroups());
    }, [dispatch, id]);

    const getUserList = useCallback(() => {
        if (!id) {
            return;
        }
        dispatch(userAction.list());
    }, [dispatch, id]);

    useEffect(() => {
        if (!id || !revoke) return;
        dispatch(
            actions.getRevocationAttributes({
                raProfileUuid: certificate?.raProfile?.uuid || "",
                authorityUuid: certificate?.raProfile?.authorityInstanceUuid || "",
            }),
        );
    }, [dispatch, revoke, id, certificate?.raProfile?.uuid, certificate?.raProfile?.authorityInstanceUuid]);

    const getRaProfileList = useCallback(() => {
        if (!id) return;
        dispatch(raProfileAction.listRaProfiles());
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(connectorActions.clearCallbackData());
        setGroupAttributesCallbackAttributes([]);

        selectLocationsCheckedRows.length === 0
            ? dispatch(locationActions.clearPushAttributeDescriptors())
            : dispatch(
                  locationActions.getPushAttributes({
                      uuid: selectLocationsCheckedRows[0],
                      entityUuid: locationToEntityMap[selectLocationsCheckedRows[0]],
                  }),
              );
    }, [dispatch, locationToEntityMap, selectLocationsCheckedRows]);

    const onDeleteConfirmed = useCallback(() => {
        if (!certificate) return;

        dispatch(actions.deleteCertificate({ uuid: certificate.uuid }));
        setConfirmDelete(false);
    }, [certificate, dispatch]);

    const onCancelGroupUpdate = useCallback(() => {
        setUpdateGroup(false);
        setGroup(undefined);
    }, [setUpdateGroup, setGroup]);

    const onCancelOwnerUpdate = useCallback(() => {
        setUpdateOwner(false);
        setOwnerUuid(undefined);
    }, [setUpdateOwner, setOwnerUuid]);

    const onCancelRaProfileUpdate = useCallback(() => {
        setUpdateRaProfile(false);
        setRaProfile(undefined);
    }, [setUpdateRaProfile, setRaProfile]);

    const onComplianceCheck = useCallback(() => {
        if (!certificate?.uuid) return;

        dispatch(actions.checkCompliance({ certificateUuids: [certificate.uuid] }));
    }, [dispatch, certificate?.uuid]);

    const onUpdateGroup = useCallback(() => {
        if (!certificate || !group) return;

        dispatch(actions.updateGroup({ uuid: certificate.uuid, updateGroupRequest: { groupUuid: group } }));
        setUpdateGroup(false);
    }, [certificate, dispatch, group]);

    const onUpdateOwner = useCallback(() => {
        if (!certificate || !ownerUuid || !users) {
            return;
        }
        const user = users.find((u) => u.uuid === ownerUuid);
        if (!user) {
            return;
        }

        dispatch(actions.updateOwner({ uuid: certificate.uuid, user, updateOwnerRequest: { ownerUuid: ownerUuid } }));
        setUpdateOwner(false);
    }, [certificate, dispatch, ownerUuid, users]);

    const onUpdateRaProfile = useCallback(() => {
        if (!certificate || !raProfile) return;

        dispatch(
            actions.updateRaProfile({
                uuid: certificate.uuid,
                updateRaProfileRequest: { raProfileUuid: raProfile },
                authorityUuid: raProfileAuthorityUuid || "",
            }),
        );
        setUpdateRaProfile(false);
    }, [certificate, dispatch, raProfile, raProfileAuthorityUuid]);

    const onRevoke = useCallback(() => {
        if (!certificate) return;

        dispatch(
            actions.revokeCertificate({
                uuid: certificate.uuid,
                revokeRequest: { reason: revokeReason || ClientCertificateRevocationDtoReasonEnum.Unspecified, attributes: [] },
                raProfileUuid: certificate.raProfile?.uuid || "",
                authorityUuid: certificate.raProfile?.authorityInstanceUuid || "",
            }),
        );
        setRevoke(false);
    }, [certificate, dispatch, revokeReason]);

    const onRenew = useCallback(
        (data: { fileContent?: string }) => {
            dispatch(
                actions.renewCertificate({
                    uuid: certificate?.uuid || "",
                    renewRequest: { pkcs10: data.fileContent ? data.fileContent : undefined },
                    raProfileUuid: certificate?.raProfile?.uuid || "",
                    authorityUuid: certificate?.raProfile?.authorityInstanceUuid || "",
                }),
            );

            setRenew(false);
        },
        [dispatch, certificate],
    );

    const onAddCertToLocations = useCallback(
        (values: { locationAttributes: Record<string, any> }) => {
            setAddCertToLocation(false);

            if (selectLocationsCheckedRows.length === 0 || !certificate) return;

            dispatch(
                locationActions.pushCertificate({
                    certificateUuid: certificate.uuid,
                    locationUuid: selectLocationsCheckedRows[0],
                    entityUuid: locationToEntityMap[selectLocationsCheckedRows[0]],
                    pushRequest: {
                        attributes: collectFormAttributes(
                            "locationAttributes",
                            [...(locationAttributeDescriptors ?? []), ...groupAttributesCallbackAttributes],
                            values,
                        ),
                    },
                }),
            );
        },
        [
            selectLocationsCheckedRows,
            certificate,
            dispatch,
            locationAttributeDescriptors,
            locationToEntityMap,
            groupAttributesCallbackAttributes,
        ],
    );

    const onRemove = useCallback(() => {
        if (locationsCheckedRows.length === 0 || !certificate) return;

        setConfirmRemove(false);

        locationsCheckedRows.forEach((uuid) => {
            dispatch(
                locationActions.removeCertificate({
                    certificateUuid: certificate.uuid,
                    locationUuid: uuid,
                    entityUuid: locationToEntityMap[uuid],
                }),
            );
        });
    }, [dispatch, certificate, locationsCheckedRows, locationToEntityMap]);

    const fileNameToDownload = certificate?.commonName + "_" + certificate?.serialNumber;

    const downloadDropDown = useMemo(
        () => (
            <UncontrolledButtonDropdown disabled={!certificate?.certificateContent}>
                <DropdownToggle color="light" caret className="btn btn-link" title="Download Certificate">
                    <i className="fa fa-download" aria-hidden="true" />
                </DropdownToggle>

                <DropdownMenu>
                    <div className="d-flex">
                        <DropdownItem
                            key="pem"
                            onClick={() => downloadFile(formatPEM(certificate?.certificateContent ?? ""), fileNameToDownload + ".pem")}
                        >
                            PEM (.pem)
                        </DropdownItem>
                        <i
                            className={cx("fa fa-copy", styles.copyButton)}
                            onClick={() => {
                                if (!certificate?.certificateContent) return;
                                navigator.clipboard
                                    .writeText(formatPEM(certificate?.certificateContent ?? ""))
                                    .then(() => dispatch?.(alertActions.success?.("Certificate content was copied to clipboard")))
                                    .catch(() => dispatch?.(alertActions.error?.("Failed to copy certificate content to clipboard")));
                            }}
                        />
                    </div>
                    <DropdownItem
                        key="der"
                        onClick={() =>
                            downloadFile(Buffer.from(certificate?.certificateContent ?? "", "base64"), fileNameToDownload + ".cer")
                        }
                    >
                        DER (.cer)
                    </DropdownItem>
                    <DropdownItem
                        key="chainPem"
                        onClick={() => {
                            downloadCertificateChainContent(DownloadCertificateChainCertificateFormatEnum.Pem);
                        }}
                    >
                        PEM with chain (.pem)
                    </DropdownItem>

                    <DropdownItem
                        key="pkcs7"
                        onClick={() => {
                            downloadCertificateChainContent(DownloadCertificateChainCertificateFormatEnum.Pkcs7);
                        }}
                    >
                        PKCS#7 with chain (.p7b)
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        ),
        [certificate, fileNameToDownload],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "trash",
                disabled: false,
                tooltip: "Delete",
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: "cubes",
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Requested,
                tooltip: "Issue",
                onClick: () => {
                    dispatch(
                        actions.issueCertificateNew({
                            certificateUuid: certificate?.uuid ?? "",
                            raProfileUuid: certificate?.raProfile?.uuid ?? "",
                            authorityUuid: certificate?.raProfile?.authorityInstanceUuid ?? "",
                        }),
                    );
                },
            },
            {
                icon: "retweet",
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued,
                tooltip: "Renew",
                onClick: () => {
                    setRenew(true);
                },
            },
            {
                icon: "rekey",
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued,
                tooltip: "Rekey",
                onClick: () => {
                    setRekey(true);
                },
            },
            {
                icon: "minus-square",
                disabled: !certificate?.raProfile || certificate?.state !== CertStatus.Issued,
                tooltip: "Revoke",
                onClick: () => {
                    setRevoke(true);
                },
            },
            {
                icon: "gavel",
                disabled: !certificate?.raProfile || !certificate?.certificateContent,
                tooltip: "Check Compliance",
                onClick: () => {
                    onComplianceCheck();
                },
            },
            {
                icon: "download",
                disabled: !certificate?.certificateContent,
                custom: !certificate?.certificateContent ? undefined : downloadDropDown,
                onClick: () => {},
            },
        ],
        [certificate, downloadDropDown, onComplianceCheck, dispatch],
    );

    const downloadCSRDropDown = useMemo(
        () => (
            <UncontrolledButtonDropdown>
                <DropdownToggle color="light" caret className="btn btn-link" title="Download">
                    <i className="fa fa-download" aria-hidden="true" />
                </DropdownToggle>

                <DropdownMenu>
                    <div className="d-flex">
                        <DropdownItem
                            key="pem"
                            onClick={() =>
                                downloadFile(
                                    formatPEM(certificate?.certificateRequest?.content ?? "", true),
                                    fileNameToDownload + "_CSR" + ".pem",
                                )
                            }
                        >
                            PEM (.pem)
                        </DropdownItem>
                        <i
                            className={cx("fa fa-copy", styles.copyButton)}
                            onClick={() => {
                                if (!certificate?.certificateRequest?.content) return;
                                navigator.clipboard
                                    .writeText(formatPEM(certificate?.certificateRequest?.content ?? "", true))
                                    .then(() => dispatch?.(alertActions.success?.("Certificate request content was copied to clipboard")))
                                    .catch(
                                        () => dispatch?.(alertActions.error?.("Failed to copy certificate request content to clipboard")),
                                    );
                            }}
                        />
                    </div>

                    <DropdownItem
                        key="req"
                        onClick={() =>
                            downloadFile(
                                Buffer.from(certificate?.certificateRequest?.content ?? "", "base64"),
                                fileNameToDownload + "_CSR" + ".req",
                            )
                        }
                    >
                        REQ (.req)
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledButtonDropdown>
        ),
        [certificate, fileNameToDownload],
    );

    const buttonsCSR: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "download",
                disabled: false,
                tooltip: "Download CSR",
                custom: downloadCSRDropDown,
                onClick: () => {},
            },
        ],
        [downloadCSRDropDown],
    );

    const buttonsLocations: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: "plus",
                disabled: false,
                tooltip: "Push to location",
                onClick: () => {
                    setSelectLocationCheckedRows([]);
                    setAddCertToLocation(true);
                },
            },
            {
                icon: "trash",
                disabled: locationsCheckedRows.length === 0,
                tooltip: "Remove",
                onClick: () => {
                    setConfirmRemove(true);
                },
            },
        ],
        [locationsCheckedRows.length],
    );

    const updateOwnerBody = useMemo(
        () => (
            <div>
                <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={userOptions}
                    placeholder={`Select Owner`}
                    onChange={(event) => setOwnerUuid(event?.value)}
                />
            </div>
        ),
        [setOwnerUuid, userOptions],
    );

    const updateGroupBody = useMemo(() => {
        return (
            <div>
                <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={groupOptions}
                    placeholder={`Select Group`}
                    onChange={(event) => setGroup(event?.value)}
                />
            </div>
        );
    }, [setGroup, groupOptions]);

    const updateRaAndAuthorityState = useCallback((value: string) => {
        setRaProfile(value.split(":#")[0]);
        setRaProfileAuthorityUuid(value.split(":#")[1]);
    }, []);

    const updateRaProfileBody = useMemo(() => {
        return (
            <div>
                <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={raProfileOptions}
                    placeholder={`Select RA Profile`}
                    onChange={(event) => updateRaAndAuthorityState(event?.value || "")}
                />
            </div>
        );
    }, [raProfileOptions, updateRaAndAuthorityState]);

    const revokeBody = useMemo(() => {
        return (
            <div>
                <Select
                    maxMenuHeight={140}
                    menuPlacement="auto"
                    options={certificateRevokeReasonOptions}
                    placeholder={`Select Revocation Reason`}
                    onChange={(event: any) => setRevokeReason(event?.value as ClientCertificateRevocationDtoReasonEnum)}
                />
            </div>
        );
    }, [setRevokeReason, certificateRevokeReasonOptions]);

    const certificateTitle = useMemo(
        () => (certificate?.state === CertStatus.Requested ? "CSR Properties" : "Certificate Properties"),
        [certificate?.state],
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
            },
        ],
        [],
    );

    const historyHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "time",
                content: "Time",
            },
            {
                id: "user",
                content: "User",
            },
            {
                id: "event",
                content: "Event",
            },
            {
                id: "status",
                content: "Status",
            },
            {
                id: "message",
                content: "Message",
            },
            {
                id: "additionalMessage",
                content: "Additional Message",
            },
        ],
        [],
    );

    const historyEntry: TableDataRow[] = useMemo(
        () =>
            !eventHistory
                ? []
                : eventHistory.map(function (history) {
                      return {
                          id: history.uuid,
                          columns: [
                              <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(history.created)}</span>,

                              history.createdBy,

                              history.event,

                              <CertificateStatus status={history.status} />,

                              <div style={{ wordBreak: "break-all" }}>{history.message}</div>,

                              history.additionalInformation ? (
                                  <Button color="white" onClick={() => setCurrentInfoId(history.uuid)} title="Show Additional Information">
                                      <i className="fa fa-info-circle" aria-hidden="true"></i>
                                  </Button>
                              ) : (
                                  ""
                              ),
                          ],
                      };
                  }),
        [eventHistory],
    );

    const additionalInfoEntry = (): any => {
        let returnList = [];

        if (!currentInfoId) return;

        const currentHistory = eventHistory?.filter((history) => history.uuid === currentInfoId);

        for (let [key, value] of Object.entries(currentHistory![0]?.additionalInformation ?? {})) {
            returnList.push(
                <tr>
                    <td style={{ padding: "0.25em" }}>{key}</td>
                    <td style={{ padding: "0.25em" }}>
                        <p
                            style={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-all",
                            }}
                        >
                            {JSON.stringify(value)}
                        </p>
                    </td>
                </tr>,
            );
        }

        return returnList;
    };

    const propertiesHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "attribute",
                content: "Attribute",
            },
            {
                id: "value",
                content: "Value",
            },
            {
                id: "action",
                content: "Action",
            },
        ],
        [],
    );

    const validationHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "validationType",
                content: "Validation check",
            },
            {
                id: "status",
                content: "Status",
            },
            {
                id: "message",
                content: "Message",
                width: "70%",
            },
        ],
        [],
    );

    const relatedCertificatesHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "name",
                content: "Common Name",
            },
            {
                id: "serial",
                content: "Serial Number",
            },
            {
                id: "valid",
                content: "Valid From",
            },
            {
                id: "expires",
                content: "Expires At",
            },
            {
                id: "status",
                content: "Status",
            },
        ],
        [],
    );

    const complianceHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: "status",
                content: "Status",
            },
            {
                id: "ruleDescription",
                content: "Rule Description",
            },
        ],
        [],
    );

    const complianceData: TableDataRow[] = useMemo(
        () =>
            !certificate
                ? []
                : (certificate.nonCompliantRules || []).map((e) => ({
                      id: e.ruleDescription,
                      columns: [<CertificateStatus status={e.status} />, e.ruleDescription],
                      detailColumns:
                          !e.attributes || e.attributes.length === 0
                              ? undefined
                              : [<></>, <></>, <ComplianceRuleAttributeViewer attributes={e.attributes} hasHeader={false} />],
                  })),
        [certificate],
    );

    const propertiesData: TableDataRow[] = useMemo(() => {
        return !certificate
            ? []
            : [
                  {
                      id: "uuid",
                      columns: ["UUID", certificate.uuid, ""],
                  },
                  {
                      id: "sourceCertificateUuid",
                      columns: [
                          "Source Certificate UUID",
                          certificate.sourceCertificateUuid ? (
                              <Link to={`../certificates/detail/${certificate.sourceCertificateUuid}`}>
                                  {certificate.sourceCertificateUuid}
                              </Link>
                          ) : (
                              ""
                          ),
                      ],
                  },
                  {
                      id: "owner",
                      columns: [
                          "Owner",
                          certificate?.ownerUuid ? (
                              <Link to={`../../users/detail/${certificate.ownerUuid}`}>{certificate.owner ?? "Unassigned"}</Link>
                          ) : (
                              certificate.owner ?? "Unassigned"
                          ),
                          <Button
                              className="btn btn-link"
                              size="sm"
                              color="secondary"
                              onClick={() => {
                                  setOwnerUuid(undefined);
                                  getUserList();
                                  setUpdateOwner(true);
                              }}
                              title="Update Owner"
                          >
                              <i className="fa fa-pencil-square-o" />
                          </Button>,
                      ],
                  },
                  {
                      id: "group",
                      columns: [
                          "Group",
                          certificate?.group?.name ? (
                              <Link to={`../../groups/detail/${certificate?.group.uuid}`}>{certificate?.group.name}</Link>
                          ) : (
                              "Unassigned"
                          ),
                          <Button
                              className="btn btn-link"
                              size="sm"
                              color="secondary"
                              onClick={() => {
                                  getGroupList();
                                  setUpdateGroup(true);
                              }}
                              title="Update Group"
                          >
                              <i className="fa fa-pencil-square-o" />
                          </Button>,
                      ],
                  },
                  {
                      id: "raProfile",
                      columns: [
                          "RA Profile",
                          certificate?.raProfile?.name ? (
                              <Link
                                  to={`../../raProfiles/detail/${certificate?.raProfile.authorityInstanceUuid}/${certificate?.raProfile.uuid}`}
                              >
                                  {certificate?.raProfile.name}
                              </Link>
                          ) : (
                              "Unassigned"
                          ),
                          <Button
                              className="btn btn-link"
                              size="sm"
                              color="secondary"
                              onClick={() => {
                                  getRaProfileList();
                                  setUpdateRaProfile(true);
                              }}
                              title="Update RA Profile"
                          >
                              <i className="fa fa-pencil-square-o" />
                          </Button>,
                      ],
                  },
                  {
                      id: "type",
                      columns: ["Type", certificate.certificateType || "", ""],
                  },
              ];
    }, [certificate]);

    const sanData: TableDataRow[] = useMemo(() => {
        let sanList: TableDataRow[] = [];
        for (let [key, value] of Object.entries(certificate?.subjectAlternativeNames || {})) {
            if (value && Array.isArray(value) && value.length > 0) {
                sanList.push({
                    id: key,
                    columns: [key, value.join(", ")],
                });
            }
        }
        return sanList;
    }, [certificate]);

    const csrPropertiesData: TableDataRow[] = useMemo(() => {
        return certificate?.certificateRequest
            ? [
                  {
                      id: "commonName",
                      columns: ["Common Name", certificate?.certificateRequest?.commonName || ""],
                  },
                  {
                      id: "certificateType",
                      columns: [
                          "Certificate Type",
                          certificate?.certificateRequest?.certificateType
                              ? getEnumLabel(certificateTypeEnum, certificate?.certificateRequest?.certificateType)
                              : "",
                      ],
                  },
                  {
                      id: "certificateRequestFormat",
                      columns: [
                          "Certificate Request Format",
                          certificate?.certificateRequest?.certificateRequestFormat
                              ? getEnumLabel(certificateRequestFormatEnum, certificate?.certificateRequest?.certificateRequestFormat)
                              : "",
                      ],
                  },
                  {
                      id: "publicKeyAlgorithm",
                      columns: ["Public Key Algorithm", certificate?.certificateRequest?.publicKeyAlgorithm || ""],
                  },
                  {
                      id: "signatureAlgorithm",
                      columns: ["Signature Algorithm", certificate?.certificateRequest?.signatureAlgorithm || ""],
                  },
                  {
                      id: "subjectDn",
                      columns: ["Subject DN", certificate?.certificateRequest?.subjectDn || ""],
                  },
                  {
                      id: "asn1RequestStructure",
                      columns: [
                          "ASN.1 Structure",
                          certificate?.certificateRequest?.content ? (
                              <Asn1Dialog content={certificate?.certificateRequest?.content} isCSR={true} />
                          ) : (
                              <>n/a</>
                          ),
                      ],
                  },
              ]
            : [];
    }, [certificate?.certificateRequest, certificateRequestFormatEnum, certificateTypeEnum]);

    const validationData: TableDataRow[] = useMemo(
        () =>
            !certificate && validationResult?.validationChecks
                ? []
                : Object.entries(validationResult?.validationChecks || {}).map(function ([key, value]) {
                      return {
                          id: key,
                          columns: [
                              getEnumLabel(certificateValidationCheck, key),
                              value?.status ? <CertificateStatus status={value.status} /> : "",
                              <div style={{ wordBreak: "break-all" }}>
                                  {value.message?.split("\n").map((str: string, i) => (
                                      <div key={i}>
                                          {str}
                                          <br />
                                      </div>
                                  ))}
                              </div>,
                          ],
                      };
                  }),
        [certificate, validationResult],
    );

    const relatedCertificatesData: TableDataRow[] = useMemo(
        () =>
            !certificate?.relatedCertificates
                ? []
                : certificate.relatedCertificates.map((c) => ({
                      id: c.uuid,
                      columns: [
                          <Link to={`../certificates/detail/${c.uuid}`}>{c.commonName}</Link>,
                          c.serialNumber ?? "",
                          c.notBefore ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(c.notBefore)}</span> : "",
                          c.notAfter ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(c.notAfter)}</span> : "",
                          <CertificateStatus status={c.state} />,
                      ],
                  })),
        [certificate?.relatedCertificates],
    );

    const detailData: TableDataRow[] = useMemo(() => {
        const certDetail = !certificate
            ? []
            : [
                  {
                      id: "commonName",
                      columns: [<span style={{ whiteSpace: "nowrap" }}>Common Name</span>, certificate.commonName],
                  },
                  {
                      id: "serialNumber",
                      columns: ["Serial Number", certificate.serialNumber || ""],
                  },
                  {
                      id: "key",
                      columns: [
                          "Key",
                          certificate.key && certificate.key.tokenInstanceUuid ? (
                              <Link to={`../keys/detail/${certificate.key?.tokenInstanceUuid}/${certificate.key?.uuid}`}>
                                  {certificate.key?.name}
                              </Link>
                          ) : (
                              ""
                          ),
                      ],
                  },
                  {
                      id: "issuerCommonName",
                      columns: [
                          "Issuer Common Name",
                          certificate?.issuerCommonName && certificate?.issuerCertificateUuid ? (
                              <Link to={`../certificates/detail/${certificate.issuerCertificateUuid}`}>{certificate.issuerCommonName}</Link>
                          ) : certificate?.issuerCommonName ? (
                              certificate.issuerCommonName
                          ) : (
                              ""
                          ),
                      ],
                  },
                  {
                      id: "issuerDN",
                      columns: ["Issuer DN", certificate.issuerDn || ""],
                  },
                  {
                      id: "subjectDN",
                      columns: ["Subject DN", certificate.subjectDn],
                  },
                  {
                      id: "validFrom",
                      columns: [
                          "Valid From",
                          certificate.notBefore ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notBefore)}</span> : "",
                      ],
                  },
                  {
                      id: "expiresAt",
                      columns: [
                          "Expires At",
                          certificate.notAfter ? <span style={{ whiteSpace: "nowrap" }}>{dateFormatter(certificate.notAfter)}</span> : "",
                      ],
                  },
                  {
                      id: "publicKeyAlgorithm",
                      columns: ["Public Key Algorithm", certificate.publicKeyAlgorithm],
                  },
                  {
                      id: "signatureAlgorithm",
                      columns: ["Signature Algorithm", certificate.signatureAlgorithm],
                  },
                  {
                      id: "certState",
                      columns: ["State", <CertificateStatus status={certificate.state} />],
                  },
                  {
                      id: "validationStatus",
                      columns: [
                          "Validation Status",
                          validationResult?.resultStatus ? (
                              <CertificateStatus status={validationResult?.resultStatus} />
                          ) : (
                              <CertificateStatus status={CertificateValidationStatus.NotChecked} />
                          ),
                      ],
                  },
                  {
                      id: "complianceStatus",
                      columns: ["Compliance Status", <CertificateStatus status={certificate.complianceStatus || ComplianceStatus.Na} />],
                  },
                  {
                      id: "fingerprint",
                      columns: ["Fingerprint", certificate.fingerprint || ""],
                  },
                  {
                      id: "fingerprintAlgorithm",
                      columns: ["Fingerprint Algorithm", "SHA256"],
                  },
                  {
                      id: "keySize",
                      columns: ["Key Size", certificate.keySize.toString()],
                  },
                  {
                      id: "keyUsage",
                      columns: [
                          "Key Usage",
                          certificate?.keyUsage?.map(function (name) {
                              return (
                                  <div key={name} style={{ margin: "1px" }}>
                                      <Badge>{name}</Badge>
                                      &nbsp;
                                  </div>
                              );
                          }) || "",
                      ],
                  },
                  {
                      id: "extendedKeyUsage",
                      columns: [
                          "Extended Key Usage",
                          certificate?.extendedKeyUsage?.map(function (name) {
                              return (
                                  <div key={name} style={{ margin: "1px" }}>
                                      <Badge>{name}</Badge>
                                      &nbsp;
                                  </div>
                              );
                          }) || "",
                      ],
                  },
                  {
                      id: "basicConstraint",
                      columns: ["Basic Constraint", certificate.basicConstraints],
                  },
              ];
        if (certificate?.state !== CertStatus.Requested) {
            certDetail.push({
                id: "asn1structure",
                columns: ["ASN.1 Structure", certificate ? <Asn1Dialog content={certificate.certificateContent} /> : <>n/a</>],
            });
        }
        return certDetail;
    }, [certificate, health, validationResult]);

    const locationsHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "locationName",
                width: "auto",
            },
            {
                content: "Description",
                sortable: true,
                id: "locationDescription",
                width: "auto",
            },
            {
                content: "Entity",
                sortable: true,
                id: "locationEntity",
                width: "auto",
            },
            {
                content: "Multiple Entires",
                align: "center",
                sortable: true,
                id: "multiEntries",
                width: "auto",
            },
            {
                content: "Key Management",
                align: "center",
                sortable: true,
                id: "keyMgmt",
                width: "auto",
            },
            {
                content: "State",
                align: "center",
                sortable: true,
                id: "state",
                width: "15%",
            },
            {
                content: "Validation Status",
                align: "center",
                sortable: true,
                id: "validationStatus",
                width: "15%",
            },
        ],
        [],
    );

    const locationsData: TableDataRow[] = useMemo(
        () =>
            !certLocations
                ? []
                : certLocations.map((location) => ({
                      id: location.uuid,

                      columns: [
                          <Link to={`../../locations/detail/${location.entityInstanceUuid}/${location.uuid}`}>{location.name}</Link>,

                          location.description || "",

                          <Badge color="primary">{location.entityInstanceName}</Badge>,

                          location.supportMultipleEntries ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                          location.supportKeyManagement ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                          certificate?.state ? <CertificateStatus status={certificate?.state} /> : "",

                          certificate?.validationStatus ? <CertificateStatus status={certificate?.validationStatus} /> : "",
                      ],
                  })),
        [certLocations],
    );

    const selectLocationsHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: "Name",
                sortable: true,
                sort: "asc",
                id: "locationName",
                width: "auto",
            },
            {
                content: "Description",
                sortable: true,
                id: "locationDescription",
                width: "auto",
            },
            {
                content: "Entity",
                sortable: true,
                id: "locationEntity",
                width: "auto",
            },
            {
                content: "Multiple Entires",
                align: "center",
                sortable: true,
                id: "multiEntries",
                width: "auto",
            },
            {
                content: "Key Management",
                align: "center",
                sortable: true,
                id: "keyMgmt",
                width: "auto",
            },
            {
                content: "Status",
                align: "center",
                sortable: true,
                id: "Status",
                width: "15%",
            },
        ],
        [],
    );

    const selectLocationsData: TableDataRow[] = useMemo(
        () =>
            !locations
                ? []
                : (locations
                      .map((location) => {
                          if (certLocations?.find((cl) => cl.uuid === location.uuid)) return undefined;

                          return {
                              id: location.uuid,

                              columns: [
                                  location.name,

                                  location.description || "",

                                  <Badge color="primary">{location.entityInstanceName}</Badge>,

                                  location.supportMultipleEntries ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                                  location.supportKeyManagement ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                                  <StatusBadge enabled={location.enabled} />,
                              ],
                          };
                      })
                      .filter((location) => location !== undefined) as TableDataRow[]),
        [certLocations, locations],
    );

    const approvalsHeader: TableHeader[] = useMemo(
        () => [
            {
                id: "approvalUUID",
                content: "Approval UUID ",
                sort: "asc",
            },
            {
                id: "approvalProfile",
                content: "Approval Profile",
            },
            {
                id: "status",
                content: "Status",
            },
            {
                id: "requestedBy",
                content: "Requested By",
            },
            {
                id: "resource",
                content: "Resource",
            },

            {
                id: "action",
                content: "Action",
            },

            {
                id: "createdAt",
                content: "Created At",
            },

            {
                id: "closedAt",
                content: "Closed At",
            },
        ],
        [],
    );

    const approvalsTableData: TableDataRow[] = useMemo(() => {
        const data = approvals || [];

        return data.map((approval) => ({
            id: approval.approvalUuid,
            columns: [
                <Link to={`../../../approvals/detail/${approval.approvalUuid}`}>{approval.approvalUuid}</Link>,
                <Link to={`../../../approvalprofiles/detail/${approval.approvalProfileUuid}`}>{approval.approvalProfileName}</Link>,
                (
                    <>
                        <StatusBadge textStatus={approval.status} />
                    </>
                ) || "",
                approval.creatorUsername || "",
                approval.resource || "",
                approval.resourceAction || "",
                approval.createdAt ? dateFormatter(approval.createdAt) : "",
                approval.closedAt ? dateFormatter(approval.closedAt) : "",
            ],
        }));
    }, [approvals, navigate]);

    const defaultViewport = useMemo(
        () => ({
            zoom: 0.5,
            x: deviceType === DeviceType.Tablet ? -50 : deviceType === DeviceType.Mobile ? -150 : 300,
            y: 0,
        }),
        [deviceType],
    );

    return (
        <Container className={cx("themed-container", styles.certificateContainer)} fluid>
            <TabLayout
                tabs={[
                    {
                        title: "Details",
                        content: (
                            <Widget>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget
                                            title={certificateTitle}
                                            busy={isBusy}
                                            widgetButtons={buttons}
                                            titleSize="large"
                                            lockSize="large"
                                            widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                                            refreshAction={getFreshCertificateDetail}
                                        >
                                            <br />
                                            <CustomTable hasPagination={false} headers={detailHeaders} data={detailData} />
                                        </Widget>
                                    </Col>

                                    <Col>
                                        <Widget title="Subject Alternative Names" busy={isBusy} titleSize="large">
                                            <br />
                                            <CustomTable headers={detailHeaders} data={sanData} />
                                        </Widget>

                                        <Widget title="Other Properties" titleSize="large">
                                            <br />
                                            <CustomTable headers={propertiesHeaders} data={propertiesData} />
                                        </Widget>
                                    </Col>
                                </Row>
                            </Widget>
                        ),
                    },
                    {
                        title: "Request",
                        hidden: !certificate?.certificateRequest?.content,
                        content: (
                            <Widget>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget
                                            widgetButtons={buttonsCSR}
                                            title="Properties"
                                            busy={isBusy}
                                            titleSize="large"
                                            lockSize="large"
                                            refreshAction={getFreshCertificateDetail}
                                        >
                                            <br />
                                            <CustomTable headers={detailHeaders} data={csrPropertiesData} />
                                        </Widget>
                                    </Col>

                                    <Col>
                                        <Widget title="Request Attributes" busy={isBusy} titleSize="large">
                                            <br />
                                            <AttributeViewer
                                                viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE}
                                                attributes={certificate?.certificateRequest?.attributes}
                                            />
                                        </Widget>

                                        <Widget title="Signature attributes" titleSize="large">
                                            <br />
                                            <AttributeViewer
                                                viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE}
                                                attributes={certificate?.certificateRequest?.signatureAttributes}
                                            />
                                        </Widget>
                                    </Col>
                                </Row>
                            </Widget>
                        ),
                    },
                    {
                        title: "Attributes",
                        content: (
                            <Widget>
                                <Widget title="Metadata" titleSize="large" widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}>
                                    <br />
                                    <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={certificate?.metadata} />
                                </Widget>

                                {certificate?.certificateRequest?.attributes && certificate.certificateRequest.attributes.length > 0 ? (
                                    <Widget title="CSR" titleSize="large" busy={isBusy}>
                                        <AttributeViewer attributes={certificate.certificateRequest.attributes} />
                                    </Widget>
                                ) : null}

                                {certificate?.issueAttributes && certificate.issueAttributes.length > 0 ? (
                                    <Widget title="Issue Attributes" titleSize="large" busy={isBusy}>
                                        <AttributeViewer attributes={certificate.issueAttributes} />
                                    </Widget>
                                ) : null}

                                {certificate?.revokeAttributes && certificate.revokeAttributes.length > 0 ? (
                                    <Widget title="Revoke Attributes" titleSize="large" busy={isBusy}>
                                        <AttributeViewer attributes={certificate.revokeAttributes} />
                                    </Widget>
                                ) : null}

                                {certificate && (
                                    <CustomAttributeWidget
                                        resource={Resource.Certificates}
                                        resourceUuid={certificate.uuid}
                                        attributes={certificate.customAttributes}
                                    />
                                )}
                            </Widget>
                        ),
                    },
                    {
                        title: "Validation",
                        hidden: !certificate?.certificateContent,
                        content: (
                            <Widget>
                                <Widget
                                    title="Validation Status"
                                    busy={isFetchingValidationResult}
                                    titleSize="large"
                                    refreshAction={certificate && getFreshCertificateValidations}
                                    widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                                >
                                    <br />
                                    <CustomTable
                                        headers={validationHeaders}
                                        data={[
                                            ...validationData,
                                            {
                                                id: "validationtStatus",
                                                columns: [
                                                    <span className="fw-bold">Validation Result</span>,
                                                    validationResult?.resultStatus ? (
                                                        <CertificateStatus status={validationResult?.resultStatus}></CertificateStatus>
                                                    ) : (
                                                        <></>
                                                    ),
                                                    <></>,
                                                ],
                                            },
                                        ]}
                                    />
                                </Widget>
                                <Widget
                                    title="Compliance Status"
                                    busy={isFetching}
                                    titleSize="large"
                                    lockSize="normal"
                                    widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                                >
                                    <br />
                                    <CustomTable headers={complianceHeaders} data={complianceData} hasDetails={true} />
                                </Widget>
                            </Widget>
                        ),
                    },
                    {
                        title: "Approvals",
                        content: (
                            <Widget>
                                <Widget
                                    title="Certificate Approvals"
                                    busy={isFetchingApprovals}
                                    titleSize="large"
                                    refreshAction={getFreshApprovalList}
                                >
                                    <br />
                                    <CustomTable headers={approvalsHeader} data={approvalsTableData} />
                                </Widget>
                            </Widget>
                        ),
                    },
                    {
                        title: "Locations",
                        content: (
                            <Widget>
                                <Widget
                                    title="Certificate Locations"
                                    busy={isFetchingLocations || isRemovingCertificate || isPushingCertificate}
                                    widgetButtons={buttonsLocations}
                                    titleSize="large"
                                    refreshAction={getFreshCertificateLocations}
                                    widgetLockName={LockWidgetNameEnum.CertificationLocations}
                                >
                                    <br />
                                    <CustomTable
                                        headers={locationsHeaders}
                                        data={locationsData}
                                        hasCheckboxes={true}
                                        onCheckedRowsChanged={(rows) => setLocationCheckedRows(rows as string[])}
                                    />
                                </Widget>
                            </Widget>
                        ),
                    },
                    {
                        title: "History",
                        content: (
                            <Widget>
                                <Widget
                                    title="Event History"
                                    busy={isFetchingHistory}
                                    titleSize="large"
                                    refreshAction={getFreshCertificateHistory}
                                    widgetLockName={LockWidgetNameEnum.CertificateEventHistory}
                                >
                                    <br />
                                    <CustomTable headers={historyHeaders} data={historyEntry} hasPagination={true} />
                                </Widget>
                            </Widget>
                        ),
                    },
                    {
                        title: "Flow",
                        onClick: () => {
                            setIsFlowTabOpenend(true);
                            getCertificateChainDetails();
                        },
                        content: certificateNodes.length ? (
                            <FlowChart
                                busy={isBusy}
                                flowChartTitle="Certificate Flow"
                                flowChartEdges={certificateEdges}
                                flowChartNodes={certificateNodes}
                                defaultViewport={defaultViewport}
                            />
                        ) : (
                            // Todo: Add a placeholder for the flow chart
                            <></>
                        ),
                    },
                    {
                        title: "Related Certificates",
                        hidden: !certificate?.relatedCertificates?.length,
                        content: (
                            <Widget>
                                <Widget
                                    title="Related Certificates"
                                    titleSize="large"
                                    widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                                >
                                    <br />
                                    <CustomTable headers={relatedCertificatesHeaders} data={relatedCertificatesData} />
                                </Widget>
                            </Widget>
                        ),
                    },
                ]}
            />

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Certificate"
                body="You are about to delete a Certificate. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: "danger", onClick: onDeleteConfirmed, body: "Yes, delete" },
                    { color: "secondary", onClick: () => setConfirmDelete(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={updateGroup}
                caption={`Update Group`}
                body={updateGroupBody}
                toggle={() => onCancelGroupUpdate()}
                buttons={[
                    { color: "primary", onClick: () => onUpdateGroup(), body: "Update", disabled: true ? group === undefined : false },
                    { color: "secondary", onClick: () => onCancelGroupUpdate(), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={updateOwner}
                caption={`Update Owner`}
                body={updateOwnerBody}
                toggle={() => onCancelOwnerUpdate()}
                buttons={[
                    { color: "primary", onClick: onUpdateOwner, body: "Update", disabled: true ? ownerUuid === undefined : false },
                    { color: "secondary", onClick: () => onCancelOwnerUpdate(), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={updateRaProfile}
                caption={`Update RA Profile`}
                body={updateRaProfileBody}
                toggle={() => onCancelRaProfileUpdate()}
                buttons={[
                    { color: "primary", onClick: onUpdateRaProfile, body: "Update", disabled: true ? raProfile === undefined : false },
                    { color: "secondary", onClick: () => onCancelRaProfileUpdate(), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={renew}
                caption={`Renew Certificate`}
                body={
                    <CertificateRenewDialog
                        onCancel={() => setRenew(false)}
                        onRenew={onRenew}
                        allowWithoutFile={certificate?.privateKeyAvailability || false}
                    />
                }
                toggle={() => setRenew(false)}
                buttons={[]}
            />

            <Dialog
                size="lg"
                isOpen={rekey}
                caption={`Rekey Certificate`}
                body={<CertificateRekeyDialog onCancel={() => setRekey(false)} certificate={certificate} />}
                toggle={() => setRekey(false)}
                buttons={[]}
            />

            <Dialog
                isOpen={revoke}
                caption={`Revoke Certificate`}
                body={revokeBody}
                toggle={() => setRevoke(false)}
                buttons={[
                    { color: "primary", onClick: onRevoke, body: "Revoke" },
                    { color: "secondary", onClick: () => setRevoke(false), body: "Cancel" },
                ]}
            />

            <Dialog
                isOpen={currentInfoId !== ""}
                caption={`Additional Information`}
                body={additionalInfoEntry()}
                toggle={() => setCurrentInfoId("")}
                buttons={[]}
                size="lg"
            />

            <Dialog
                isOpen={addCertToLocation}
                caption={`Push certificate to the Location`}
                toggle={() => setAddCertToLocation(false)}
                buttons={[]}
                body={
                    <>
                        <Form
                            onSubmit={(values: any) => {
                                onAddCertToLocations(values);
                            }}
                            mutators={{ ...mutators() }}
                        >
                            {({ handleSubmit, submitting, valid }) => (
                                <BootstrapForm onSubmit={handleSubmit}>
                                    <Label>Locations</Label>

                                    <CustomTable
                                        hasPagination={false}
                                        headers={selectLocationsHeaders}
                                        data={selectLocationsData}
                                        hasCheckboxes={true}
                                        multiSelect={false}
                                        onCheckedRowsChanged={(rows) => setSelectLocationCheckedRows(rows as string[])}
                                    />

                                    <br />

                                    <TabLayout
                                        tabs={[
                                            {
                                                title: "Location Attributes",
                                                content: locationAttributeDescriptors ? (
                                                    <AttributeEditor
                                                        id="locationAttributes"
                                                        attributeDescriptors={locationAttributeDescriptors}
                                                        groupAttributesCallbackAttributes={groupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setGroupAttributesCallbackAttributes}
                                                    />
                                                ) : (
                                                    <></>
                                                ),
                                            },
                                        ]}
                                    />

                                    <div className="d-flex justify-content-end">
                                        <ButtonGroup>
                                            <ProgressButton
                                                title="Push"
                                                inProgressTitle="Pushing..."
                                                inProgress={submitting}
                                                disabled={selectLocationsCheckedRows.length === 0 || !valid}
                                            />

                                            <Button color="default" onClick={() => setAddCertToLocation(false)} disabled={submitting}>
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </BootstrapForm>
                            )}
                        </Form>

                        <Spinner active={isPushingCertificate || isFetchingLocationPushAttributeDescriptors} />
                    </>
                }
            />

            <Dialog
                isOpen={confirmRemove}
                caption={`Remove Certificate from Location`}
                body={
                    <>
                        You are about to remove a Certificate from selected locations:
                        <br />
                        <br />
                        {locationsCheckedRows.map((uuid) => {
                            const loc = certLocations?.find((l) => l.uuid === uuid);
                            return loc ? (
                                <>
                                    {loc.name}
                                    <br />
                                </>
                            ) : (
                                <></>
                            );
                        })}
                        <br />
                        Is this what you want to do?
                    </>
                }
                toggle={() => setConfirmRemove(false)}
                buttons={[
                    { color: "primary", onClick: onRemove, body: "Remove" },
                    { color: "secondary", onClick: () => setConfirmRemove(false), body: "Cancel" },
                ]}
            />
        </Container>
    );
}
