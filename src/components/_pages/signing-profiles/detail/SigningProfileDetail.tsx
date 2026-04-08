import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';

import Breadcrumb from 'components/Breadcrumb';
import Button from 'components/Button';
import ProgressButton from 'components/ProgressButton';
import Container from 'components/Container';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import StatusBadge from 'components/StatusBadge';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import TabLayout from 'components/Layout/TabLayout';

import { actions, selectors } from 'ducks/signing-profiles';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as ilmConfigActions, selectors as ilmConfigSelectors } from 'ducks/ilm-signing-protocol-configurations';
import { actions as tspProfileActions, selectors as tspProfileSelectors } from 'ducks/tsp-profiles';
import Select from 'components/Select';
import AssociateApprovalProfileDialogBody from '../AssociateApprovalProfileDialogBody';

import {
    DigestAlgorithm,
    ManagedSigningType,
    PlatformEnum,
    Resource,
    SigningProtocol,
    SigningScheme,
    SigningWorkflowType,
    StaticKeyManagedSigningDto,
    TimestampingWorkflowDto,
} from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';
import { createWidgetDetailHeaders } from 'utils/widget';

// ─── Label Helpers ────────────────────────────────────────────────────────────

const workflowTypeLabels: Record<SigningWorkflowType, string> = {
    [SigningWorkflowType.Timestamping]: 'Timestamping',
    [SigningWorkflowType.ContentSigning]: 'Content Signing',
    [SigningWorkflowType.RawSigning]: 'Raw Signing',
};

const protocolLabels: Record<SigningProtocol, string> = {
    [SigningProtocol.Tsp]: 'TSP (RFC 3161)',
    [SigningProtocol.IlmSigningProtocol]: 'ILM Signing Protocol',
    [SigningProtocol.CscApi]: 'CSC API v2',
};

const signingSchemeLabels: Record<SigningScheme, string> = {
    [SigningScheme.Managed]: 'Managed',
    [SigningScheme.Delegated]: 'Delegated',
};

const managedSigningTypeLabels: Record<ManagedSigningType, string> = {
    [ManagedSigningType.StaticKey]: 'Static Key',
    [ManagedSigningType.OneTimeKey]: 'One-Time Key',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SigningProfileDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // ── Selectors ──────────────────────────────────────────────────────────────

    const signingProfile = useSelector(selectors.signingProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isEnabling = useSelector(selectors.isEnabling);
    const isDisabling = useSelector(selectors.isDisabling);
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const ilmActivationDetails = useSelector(selectors.ilmActivationDetails);
    const tspActivationDetails = useSelector(selectors.tspActivationDetails);
    const isFetchingIlmActivationDetails = useSelector(selectors.isFetchingIlmActivationDetails);
    const isFetchingTspActivationDetails = useSelector(selectors.isFetchingTspActivationDetails);
    const isActivatingIlm = useSelector(selectors.isActivatingIlm);
    const isDeactivatingIlm = useSelector(selectors.isDeactivatingIlm);
    const isActivatingTsp = useSelector(selectors.isActivatingTsp);
    const isDeactivatingTsp = useSelector(selectors.isDeactivatingTsp);

    const ilmConfigurations = useSelector(ilmConfigSelectors.ilmSigningProtocolConfigurations);
    const tspProfiles = useSelector(tspProfileSelectors.tspProfiles);

    const associatedApprovalProfiles = useSelector(selectors.associatedApprovalProfiles);
    const isFetchingAssociatedApprovalProfiles = useSelector(selectors.isFetchingAssociatedApprovalProfiles);
    const isAssociatingApprovalProfile = useSelector(selectors.isAssociatingApprovalProfile);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));

    // ── Local state ────────────────────────────────────────────────────────────

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDeactivateIlm, setConfirmDeactivateIlm] = useState(false);
    const [confirmDeactivateTsp, setConfirmDeactivateTsp] = useState(false);
    const [activateIlmDialog, setActivateIlmDialog] = useState(false);
    const [activateTspDialog, setActivateTspDialog] = useState(false);
    const [selectedIlmConfigUuid, setSelectedIlmConfigUuid] = useState<string | undefined>(undefined);
    const [selectedTspProfileUuid, setSelectedTspConfigUuid] = useState<string | undefined>(undefined);
    const [associateApprovalProfileDialog, setAssociateApprovalProfileDialog] = useState(false);

    // ── Derived ────────────────────────────────────────────────────────────────

    const isBusy = useMemo(
        () => isFetchingDetail || isDeleting || isEnabling || isDisabling || isAssociatingApprovalProfile,
        [isFetchingDetail, isDeleting, isEnabling, isDisabling, isAssociatingApprovalProfile],
    );

    const timestampingWorkflow = useMemo((): TimestampingWorkflowDto | undefined => {
        if (!signingProfile) return undefined;
        const wf = signingProfile.workflow as TimestampingWorkflowDto;
        return wf?.type === SigningWorkflowType.Timestamping ? wf : undefined;
    }, [signingProfile]);

    const staticKeyScheme = useMemo((): StaticKeyManagedSigningDto | undefined => {
        if (!signingProfile) return undefined;
        const sc = signingProfile.signingScheme as StaticKeyManagedSigningDto;
        return sc?.signingScheme === SigningScheme.Managed && sc?.managedSigningType === ManagedSigningType.StaticKey ? sc : undefined;
    }, [signingProfile]);

    // ── Data fetching ──────────────────────────────────────────────────────────

    const getFreshData = useCallback(() => {
        if (!id) return;
        dispatch(actions.getSigningProfile({ uuid: id }));
        dispatch(actions.getAssociatedApprovalProfiles({ uuid: id }));
        dispatch(actions.getIlmSigningProtocolActivationDetails({ uuid: id }));
        dispatch(actions.getTspActivationDetails({ uuid: id }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    // ── Actions ────────────────────────────────────────────────────────────────

    const onEditClick = useCallback(() => {
        if (!signingProfile) return;
        navigate(`../../${Resource.SigningProfiles.toLowerCase()}/edit/${signingProfile.uuid}`);
    }, [signingProfile, navigate]);

    const onEnableClick = useCallback(() => {
        if (!signingProfile) return;
        dispatch(actions.enableSigningProfile({ uuid: signingProfile.uuid }));
    }, [signingProfile, dispatch]);

    const onDisableClick = useCallback(() => {
        if (!signingProfile) return;
        dispatch(actions.disableSigningProfile({ uuid: signingProfile.uuid }));
    }, [signingProfile, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!signingProfile) return;
        dispatch(actions.deleteSigningProfile({ uuid: signingProfile.uuid }));
        setConfirmDelete(false);
    }, [signingProfile, dispatch]);

    // ── Header buttons ─────────────────────────────────────────────────────────

    const headerButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: onEditClick,
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
            {
                icon: 'check',
                disabled: signingProfile?.enabled ?? true,
                tooltip: 'Enable',
                onClick: onEnableClick,
            },
            {
                icon: 'times',
                disabled: !(signingProfile?.enabled ?? false),
                tooltip: 'Disable',
                onClick: onDisableClick,
            },
        ],
        [signingProfile, onEditClick, onEnableClick, onDisableClick],
    );

    // ── Table headers ──────────────────────────────────────────────────────────

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    // ── Approval profile widget buttons ────────────────────────────────────────

    const approvalProfilesButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Associate Approval Profile',
                onClick: () => setAssociateApprovalProfileDialog(true),
            },
        ],
        [],
    );

    // ── General details ────────────────────────────────────────────────────────

    const generalData: TableDataRow[] = useMemo(
        () =>
            !signingProfile
                ? []
                : [
                      { id: 'uuid', columns: ['UUID', signingProfile.uuid] },
                      { id: 'name', columns: ['Name', signingProfile.name] },
                      { id: 'description', columns: ['Description', signingProfile.description || ''] },
                      { id: 'version', columns: ['Version', String(signingProfile.version)] },
                      { id: 'status', columns: ['Status', <StatusBadge enabled={signingProfile.enabled} />] },
                      {
                          id: 'workflowType',
                          columns: [
                              'Workflow Type',
                              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                  {workflowTypeLabels[(signingProfile.workflow as TimestampingWorkflowDto)?.type] ??
                                      (signingProfile.workflow as TimestampingWorkflowDto)?.type ??
                                      '—'}
                              </span>,
                          ],
                      },
                      {
                          id: 'enabledProtocols',
                          columns: [
                              'Enabled Protocols',
                              signingProfile.enabledProtocols && signingProfile.enabledProtocols.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                      {signingProfile.enabledProtocols.map((p) => (
                                          <span
                                              key={p}
                                              className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                                          >
                                              {protocolLabels[p] ?? p}
                                          </span>
                                      ))}
                                  </div>
                              ) : (
                                  <span className="text-gray-400 text-sm">None</span>
                              ),
                          ],
                      },
                  ],
        [signingProfile],
    );

    // ── Timestamping Workflow ──────────────────────────────────────────────────

    const workflowData: TableDataRow[] = useMemo(() => {
        if (!timestampingWorkflow) return [];
        return [
            {
                id: 'connectorName',
                columns: [
                    'Signature Formatter Connector',
                    timestampingWorkflow.signatureFormatterConnector ? (
                        <Link to={`/${Resource.Connectors.toLowerCase()}/detail/${timestampingWorkflow.signatureFormatterConnector.uuid}`}>
                            {timestampingWorkflow.signatureFormatterConnector.name}
                        </Link>
                    ) : (
                        <span className="text-gray-400 text-sm">Not configured</span>
                    ),
                ],
            },
            {
                id: 'qualifiedTimestamp',
                columns: ['Qualified Timestamp', <StatusBadge enabled={timestampingWorkflow.qualifiedTimestamp ?? false} />],
            },
            {
                id: 'timeQualityConfig',
                columns: [
                    'Time Quality Configuration',
                    timestampingWorkflow.timeQualityConfiguration ? (
                        <span>{timestampingWorkflow.timeQualityConfiguration.uuid ?? 'Configured'}</span>
                    ) : (
                        <span className="text-gray-400 text-sm">Not configured</span>
                    ),
                ],
            },
            {
                id: 'defaultPolicyId',
                columns: [
                    'Default TSA Policy ID',
                    timestampingWorkflow.defaultPolicyId || <span className="text-gray-400 text-sm">—</span>,
                ],
            },
            {
                id: 'allowedPolicyIds',
                columns: [
                    'Allowed TSA Policy IDs',
                    timestampingWorkflow.allowedPolicyIds && timestampingWorkflow.allowedPolicyIds.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {timestampingWorkflow.allowedPolicyIds.map((p) => (
                                <span
                                    key={p}
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                                >
                                    {p}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">All policy IDs accepted</span>
                    ),
                ],
            },
            {
                id: 'allowedDigestAlgorithms',
                columns: [
                    'Allowed Digest Algorithms',
                    timestampingWorkflow.allowedDigestAlgorithms && timestampingWorkflow.allowedDigestAlgorithms.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {timestampingWorkflow.allowedDigestAlgorithms.map((alg: DigestAlgorithm) => (
                                <span
                                    key={alg}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                                >
                                    {alg}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-400 text-sm">All digest algorithms accepted</span>
                    ),
                ],
            },
        ];
    }, [timestampingWorkflow]);

    // ── Signing Scheme ─────────────────────────────────────────────────────────

    const signingSchemeData: TableDataRow[] = useMemo(() => {
        if (!signingProfile) return [];
        const sc = signingProfile.signingScheme as StaticKeyManagedSigningDto;
        const rows: TableDataRow[] = [
            {
                id: 'signingScheme',
                columns: [
                    'Signing Scheme',
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {signingSchemeLabels[sc?.signingScheme as SigningScheme] ?? sc?.signingScheme ?? '—'}
                    </span>,
                ],
            },
        ];

        if (sc?.signingScheme === SigningScheme.Managed) {
            rows.push({
                id: 'managedSigningType',
                columns: [
                    'Managed Signing Type',
                    <span>{managedSigningTypeLabels[sc.managedSigningType as ManagedSigningType] ?? sc.managedSigningType}</span>,
                ],
            });
        }

        if (staticKeyScheme) {
            const cert = staticKeyScheme.certificate;
            rows.push({
                id: 'certificate',
                columns: [
                    'Certificate',
                    cert ? (
                        <Link to={`/${Resource.Certificates.toLowerCase()}/detail/${cert.uuid}`}>
                            {cert.commonName || cert.uuid}
                            {cert.serialNumber ? <span className="ml-2 text-gray-500 text-xs">SN: {cert.serialNumber}</span> : null}
                        </Link>
                    ) : (
                        <span className="text-gray-400 text-sm">—</span>
                    ),
                ],
            });

            if (cert) {
                rows.push(
                    { id: 'certSubjectDn', columns: ['Subject DN', cert.subjectDn || '—'] },
                    { id: 'certPublicKeyAlg', columns: ['Public Key Algorithm', cert.publicKeyAlgorithm || '—'] },
                    {
                        id: 'certValidity',
                        columns: [
                            'Validity',
                            cert.notBefore && cert.notAfter
                                ? `${new Date(cert.notBefore).toLocaleDateString()} – ${new Date(cert.notAfter).toLocaleDateString()}`
                                : '—',
                        ],
                    },
                );
            }
        }

        return rows;
    }, [signingProfile, staticKeyScheme]);

    // ── Protocol activation ────────────────────────────────────────────────────

    const ilmActivationData: TableDataRow[] = useMemo(() => {
        if (!ilmActivationDetails) return [];
        return [
            { id: 'ilmUuid', columns: ['UUID', ilmActivationDetails.uuid] },
            { id: 'ilmName', columns: ['Name', ilmActivationDetails.name] },
            {
                id: 'ilmAvailable',
                columns: ['Available', <StatusBadge enabled={ilmActivationDetails.available} />],
            },
            {
                id: 'ilmUrl',
                columns: [
                    'Signing URL',
                    ilmActivationDetails.signingUrl ? (
                        <a href={ilmActivationDetails.signingUrl} target="_blank" rel="noreferrer">
                            {ilmActivationDetails.signingUrl}
                        </a>
                    ) : (
                        '—'
                    ),
                ],
            },
        ];
    }, [ilmActivationDetails]);

    const tspActivationData: TableDataRow[] = useMemo(() => {
        if (!tspActivationDetails) return [];
        return [
            { id: 'tspUuid', columns: ['UUID', tspActivationDetails.uuid] },
            { id: 'tspName', columns: ['Name', tspActivationDetails.name] },
            {
                id: 'tspAvailable',
                columns: ['Available', <StatusBadge enabled={tspActivationDetails.available} />],
            },
            {
                id: 'tspUrl',
                columns: ['TSP URL', tspActivationDetails.signingUrl ? tspActivationDetails.signingUrl : '—'],
            },
        ];
    }, [tspActivationDetails]);

    // ── Protocols table ────────────────────────────────────────────────────────

    const availableProtocolsHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'name', content: 'Protocol Name', sortable: true, width: '40%', sort: 'asc' },
            { id: 'status', content: 'Status', sortable: true, align: 'center', width: '20%' },
            { id: 'actions', content: 'Actions', align: 'center', width: '40%' },
        ],
        [],
    );

    const availableProtocolsData: TableDataRow[] = useMemo(
        () => [
            {
                id: 'ilm',
                columns: [
                    'ILM Signing Protocol',
                    <StatusBadge enabled={ilmActivationDetails?.available ?? false} />,
                    <ProgressButton
                        type="button"
                        title={ilmActivationDetails?.available ? 'Deactivate' : 'Activate'}
                        inProgressTitle={ilmActivationDetails?.available ? 'Deactivating...' : 'Activating...'}
                        inProgress={isActivatingIlm || isDeactivatingIlm}
                        onClick={() => {
                            if (ilmActivationDetails?.available) {
                                setConfirmDeactivateIlm(true);
                            } else {
                                setSelectedIlmConfigUuid(undefined);
                                dispatch(ilmConfigActions.listIlmSigningProtocolConfigurations());
                                setActivateIlmDialog(true);
                            }
                        }}
                    />,
                ],
                detailColumns: [
                    <></>,
                    <></>,
                    <></>,
                    !ilmActivationDetails?.available ? (
                        <>ILM Signing Protocol is not activated on this profile.</>
                    ) : (
                        <>
                            <b>Protocol settings</b>
                            <br />
                            <br />
                            <CustomTable hasHeader={false} headers={detailHeaders} data={ilmActivationData} />
                        </>
                    ),
                ],
            },
            {
                id: 'tsp',
                columns: [
                    'Timestamping Protocol (TSP)',
                    <StatusBadge enabled={tspActivationDetails?.available ?? false} />,
                    <ProgressButton
                        type="button"
                        title={tspActivationDetails?.available ? 'Deactivate' : 'Activate'}
                        inProgressTitle={tspActivationDetails?.available ? 'Deactivating...' : 'Activating...'}
                        inProgress={isActivatingTsp || isDeactivatingTsp}
                        onClick={() => {
                            if (tspActivationDetails?.available) {
                                setConfirmDeactivateTsp(true);
                            } else {
                                setSelectedTspConfigUuid(undefined);
                                dispatch(tspProfileActions.listTspProfiles());
                                setActivateTspDialog(true);
                            }
                        }}
                    />,
                ],
                detailColumns: [
                    <></>,
                    <></>,
                    <></>,
                    !tspActivationDetails?.available ? (
                        <>Timestamping Protocol is not activated on this profile.</>
                    ) : (
                        <>
                            <b>Protocol settings</b>
                            <br />
                            <br />
                            <CustomTable hasHeader={false} headers={detailHeaders} data={tspActivationData} />
                        </>
                    ),
                ],
            },
        ],
        [
            ilmActivationDetails?.available,
            isActivatingIlm,
            isDeactivatingIlm,
            detailHeaders,
            ilmActivationData,
            tspActivationDetails?.available,
            isActivatingTsp,
            isDeactivatingTsp,
            tspActivationData,
            dispatch,
        ],
    );

    // ── Approval profiles ──────────────────────────────────────────────────────

    const approvalProfileTableHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'name', content: 'Name', sortable: true, width: '40%' },
            { id: 'description', content: 'Description', sortable: false, width: '40%' },
            { id: 'actions', content: 'Actions', align: 'center', width: '20%' },
        ],
        [],
    );

    const approvalProfileData: TableDataRow[] = useMemo(
        () =>
            associatedApprovalProfiles.map((ap) => ({
                id: ap.uuid,
                columns: [
                    <Link to={`/${Resource.ApprovalProfiles.toLowerCase()}/detail/${ap.uuid}`}>{ap.name}</Link>,
                    <span>{ap.description || ''}</span>,
                    <Button
                        variant="outline"
                        color="danger"
                        onClick={() => {
                            if (!signingProfile) return;
                            dispatch(
                                actions.disassociateFromApprovalProfile({
                                    signingProfileUuid: signingProfile.uuid,
                                    approvalProfileUuid: ap.uuid,
                                }),
                            );
                        }}
                    >
                        Remove
                    </Button>,
                ],
            })),
        [associatedApprovalProfiles, signingProfile, dispatch],
    );

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────

    const pageTitle = signingProfile?.name || 'Signing Profile Details';

    return (
        <div>
            <Breadcrumb
                items={[
                    {
                        label: `${getEnumLabel(resourceEnum, Resource.SigningProfiles)} Inventory`,
                        href: `/${Resource.SigningProfiles.toLowerCase()}`,
                    },
                    { label: pageTitle, href: '' },
                ]}
            />

            <Widget widgetLockName={LockWidgetNameEnum.SigningProfileDetails} busy={isBusy} noBorder>
                <TabLayout
                    tabs={[
                        {
                            title: 'Details',
                            content: (
                                <Container className="md:flex-row">
                                    <Widget
                                        title="Signing Profile Details"
                                        widgetButtons={headerButtons}
                                        titleSize="large"
                                        refreshAction={getFreshData}
                                        lockSize="large"
                                        className="w-full md:w-1/2"
                                    >
                                        <CustomTable headers={detailHeaders} data={generalData} />
                                    </Widget>

                                    <Container className="w-full md:w-1/2 flex flex-col">
                                        {signingProfile && (
                                            <CustomAttributeWidget
                                                resource={Resource.SigningProfiles}
                                                resourceUuid={signingProfile.uuid}
                                                attributes={signingProfile.customAttributes}
                                            />
                                        )}

                                        <Widget
                                            title="Approval Profiles"
                                            widgetButtons={approvalProfilesButtons}
                                            busy={isFetchingAssociatedApprovalProfiles}
                                            titleSize="large"
                                            refreshAction={getFreshData}
                                            lockSize="large"
                                            widgetLockName={LockWidgetNameEnum.ListOfApprovalProfiles}
                                        >
                                            <CustomTable headers={approvalProfileTableHeaders} data={approvalProfileData} />
                                        </Widget>
                                    </Container>
                                </Container>
                            ),
                        },
                        {
                            title: 'Workflow',
                            content: (
                                <Widget title="Timestamping Workflow Configuration" titleSize="large">
                                    {workflowData.length > 0 ? (
                                        <CustomTable headers={detailHeaders} data={workflowData} />
                                    ) : (
                                        <p className="text-gray-400 text-sm">No workflow configuration available.</p>
                                    )}
                                </Widget>
                            ),
                        },
                        {
                            title: 'Signing Scheme',
                            content: (
                                <Widget title="Signing Scheme Configuration" titleSize="large">
                                    <CustomTable headers={detailHeaders} data={signingSchemeData} />
                                </Widget>
                            ),
                        },
                        {
                            title: 'Protocols',
                            content: (
                                <Widget
                                    title="Available Protocols"
                                    busy={
                                        isFetchingIlmActivationDetails ||
                                        isFetchingTspActivationDetails ||
                                        isActivatingIlm ||
                                        isDeactivatingIlm ||
                                        isActivatingTsp ||
                                        isDeactivatingTsp
                                    }
                                    titleSize="large"
                                    refreshAction={getFreshData}
                                >
                                    <CustomTable hasDetails={true} headers={availableProtocolsHeaders} data={availableProtocolsData} />
                                </Widget>
                            ),
                        },
                    ]}
                />
            </Widget>

            {/* ── Dialogs ── */}
            <Dialog
                isOpen={confirmDelete}
                caption="Delete Signing Profile"
                body="You are about to delete this Signing Profile. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage.length > 0}
                caption="Delete Signing Profile"
                body={
                    <>
                        Failed to delete the Signing Profile:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    {
                        color: 'secondary',
                        variant: 'outline',
                        onClick: () => dispatch(actions.clearDeleteErrorMessages()),
                        body: 'Close',
                    },
                ]}
            />

            <Dialog
                isOpen={confirmDeactivateIlm}
                caption="Deactivate ILM Signing Protocol"
                body="Are you sure you want to deactivate the ILM Signing Protocol on this Signing Profile?"
                toggle={() => setConfirmDeactivateIlm(false)}
                icon="warning"
                buttons={[
                    {
                        color: 'danger',
                        onClick: () => {
                            if (id) dispatch(actions.deactivateIlmSigningProtocol({ uuid: id }));
                            setConfirmDeactivateIlm(false);
                        },
                        body: 'Deactivate',
                    },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDeactivateIlm(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmDeactivateTsp}
                caption="Deactivate TSP Protocol"
                body="Are you sure you want to deactivate the TSP Protocol on this Signing Profile?"
                toggle={() => setConfirmDeactivateTsp(false)}
                icon="warning"
                buttons={[
                    {
                        color: 'danger',
                        onClick: () => {
                            if (id) dispatch(actions.deactivateTsp({ uuid: id }));
                            setConfirmDeactivateTsp(false);
                        },
                        body: 'Deactivate',
                    },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDeactivateTsp(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={activateIlmDialog}
                caption="Activate ILM Signing Protocol"
                body={
                    <div>
                        <p className="mb-3">Select an ILM Signing Protocol Configuration to activate on this Signing Profile.</p>
                        <Select
                            id="ilmConfigSelect"
                            options={ilmConfigurations.map((c) => ({ value: c.uuid, label: c.name }))}
                            value={selectedIlmConfigUuid ?? ''}
                            onChange={(value) => setSelectedIlmConfigUuid(value as string | undefined)}
                            placeholder="Select ILM configuration"
                        />
                    </div>
                }
                toggle={() => setActivateIlmDialog(false)}
                buttons={[
                    {
                        color: 'primary',
                        disabled: !selectedIlmConfigUuid,
                        onClick: () => {
                            if (id && selectedIlmConfigUuid) {
                                dispatch(
                                    actions.activateIlmSigningProtocol({
                                        signingProfileUuid: id,
                                        ilmSigningProtocolConfigurationUuid: selectedIlmConfigUuid,
                                    }),
                                );
                            }
                            setActivateIlmDialog(false);
                        },
                        body: 'Activate',
                    },
                    { color: 'secondary', variant: 'outline', onClick: () => setActivateIlmDialog(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={activateTspDialog}
                caption="Activate TSP Protocol"
                body={
                    <div>
                        <p className="mb-3">Select a TSP Profile to activate on this Signing Profile.</p>
                        <Select
                            id="tspConfigSelect"
                            options={tspProfiles.map((c) => ({ value: c.uuid, label: c.name }))}
                            value={selectedTspProfileUuid ?? ''}
                            onChange={(value) => setSelectedTspConfigUuid(value as string | undefined)}
                            placeholder="Select TSP configuration"
                        />
                    </div>
                }
                toggle={() => setActivateTspDialog(false)}
                buttons={[
                    {
                        color: 'primary',
                        disabled: !selectedTspProfileUuid,
                        onClick: () => {
                            if (id && selectedTspProfileUuid) {
                                dispatch(actions.activateTsp({ signingProfileUuid: id, tspProfileUuid: selectedTspProfileUuid }));
                            }
                            setActivateTspDialog(false);
                        },
                        body: 'Activate',
                    },
                    { color: 'secondary', variant: 'outline', onClick: () => setActivateTspDialog(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={associateApprovalProfileDialog}
                caption="Associate Approval Profile"
                body={AssociateApprovalProfileDialogBody({
                    visible: associateApprovalProfileDialog,
                    onClose: () => setAssociateApprovalProfileDialog(false),
                    signingProfileUuid: signingProfile?.uuid,
                    alreadyAssociatedUuids: associatedApprovalProfiles.map((ap) => ap.uuid),
                })}
                toggle={() => setAssociateApprovalProfileDialog(false)}
                buttons={[]}
            />
        </div>
    );
}
