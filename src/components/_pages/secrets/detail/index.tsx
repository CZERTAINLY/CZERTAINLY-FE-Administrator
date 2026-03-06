import AttributeViewer from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import Container from 'components/Container';
import Breadcrumb from 'components/Breadcrumb';
import TabLayout from 'components/Layout/TabLayout';
import EditIcon from 'components/icons/EditIcon';
import Badge from 'components/Badge';

import { actions as secretsActions, selectors as secretsSelectors } from 'ducks/secrets';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as userActions, selectors as userSelectors } from 'ducks/users';
import { actions as groupActions, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';

import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource, SecretState } from 'types/openapi';
import SecretForm from '../form';
import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import { createWidgetDetailHeaders } from 'utils/widget';
import Select from 'components/Select';
import Button from 'components/Button';

function SecretDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const secret = useSelector(secretsSelectors.secret);
    const versions = useSelector(secretsSelectors.versions);
    const isFetchingDetail = useSelector(secretsSelectors.isFetchingDetail);
    const isFetchingVersions = useSelector(secretsSelectors.isFetchingVersions);
    const isDeleting = useSelector(secretsSelectors.isDeleting);
    const isUpdating = useSelector(secretsSelectors.isUpdating);

    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const secretTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretType));
    const secretStateEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretState));

    const users = useSelector(userSelectors.users);
    const groups = useSelector(groupSelectors.certificateGroups);
    const vaultProfiles = useSelector(vaultProfileSelectors.vaultProfiles);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmEnable, setConfirmEnable] = useState(false);
    const [confirmDisable, setConfirmDisable] = useState(false);
    const [isUpdateOwnerOpen, setIsUpdateOwnerOpen] = useState(false);
    const [isUpdateGroupsOpen, setIsUpdateGroupsOpen] = useState(false);
    const [isUpdateVaultProfileOpen, setIsUpdateVaultProfileOpen] = useState(false);
    const [isEditSecretOpen, setIsEditSecretOpen] = useState(false);

    const [ownerUuid, setOwnerUuid] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<{ value: string; label: string }[]>([]);
    const [selectedVaultProfileUuid, setSelectedVaultProfileUuid] = useState('');

    const getFreshSecretDetails = useCallback(() => {
        if (!id) return;
        dispatch(secretsActions.clearSecret());
        dispatch(secretsActions.getSecretDetail({ uuid: id }));
        dispatch(secretsActions.getSecretVersions({ uuid: id }));
        dispatch(userActions.list());
        dispatch(groupActions.listGroups());
        dispatch(vaultProfileActions.listVaultProfiles({ pageNumber: 1, itemsPerPage: 100, filters: [] }));
    }, [dispatch, id]);

    useEffect(() => {
        getFreshSecretDetails();
    }, [getFreshSecretDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!secret) return;
        dispatch(secretsActions.deleteSecret({ uuid: secret.uuid }));
        setConfirmDelete(false);
    }, [dispatch, secret]);

    const onEnableConfirmed = useCallback(() => {
        if (!secret) return;
        dispatch(secretsActions.enableSecret({ uuid: secret.uuid }));
        setConfirmEnable(false);
    }, [dispatch, secret]);

    const onDisableConfirmed = useCallback(() => {
        if (!secret) return;
        dispatch(secretsActions.disableSecret({ uuid: secret.uuid }));
        setConfirmDisable(false);
    }, [dispatch, secret]);

    const handleUpdateOwner = useCallback(() => {
        if (!secret || !ownerUuid) return;
        dispatch(secretsActions.updateSecretObjects({ uuid: secret.uuid, update: { ownerUuid } }));
        setIsUpdateOwnerOpen(false);
        setOwnerUuid('');
    }, [dispatch, ownerUuid, secret]);

    const handleRemoveOwner = useCallback(() => {
        if (!secret) return;
        dispatch(secretsActions.updateSecretObjects({ uuid: secret.uuid, update: { ownerUuid: '' } }));
        setIsUpdateOwnerOpen(false);
        setOwnerUuid('');
    }, [dispatch, secret]);

    const handleUpdateGroups = useCallback(() => {
        if (!secret) return;
        const groupUuids = selectedGroups.map((g) => g.value);
        dispatch(secretsActions.updateSecretObjects({ uuid: secret.uuid, update: { groupUuids } }));
        setIsUpdateGroupsOpen(false);
        setSelectedGroups([]);
    }, [dispatch, secret, selectedGroups]);

    const handleClearGroups = useCallback(() => {
        if (!secret) return;
        dispatch(secretsActions.updateSecretObjects({ uuid: secret.uuid, update: { groupUuids: [] } }));
        setIsUpdateGroupsOpen(false);
        setSelectedGroups([]);
    }, [dispatch, secret]);

    const handleUpdateVaultProfile = useCallback(() => {
        if (!secret || !selectedVaultProfileUuid) return;
        dispatch(
            secretsActions.updateSecretObjects({
                uuid: secret.uuid,
                update: { sourceVaultProfileUuid: selectedVaultProfileUuid },
            }),
        );
        setIsUpdateVaultProfileOpen(false);
        setSelectedVaultProfileUuid('');
    }, [dispatch, secret, selectedVaultProfileUuid]);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'check',
                disabled: !secret || secret.enabled,
                tooltip: 'Enable',
                onClick: () => setConfirmEnable(true),
            },
            {
                icon: 'times',
                disabled: !secret || !secret.enabled,
                tooltip: 'Disable',
                onClick: () => setConfirmDisable(true),
            },
            {
                icon: 'pencil',
                disabled: !secret,
                tooltip: 'Edit',
                onClick: () => {
                    setIsEditSecretOpen(true);
                },
            },
            {
                icon: 'trash',
                disabled: !secret,
                tooltip: 'Delete',
                onClick: () => setConfirmDelete(true),
            },
        ],
        [secret],
    );

    const detailHeaders: TableHeader[] = useMemo(() => createWidgetDetailHeaders(), []);

    const detailData: TableDataRow[] = useMemo(() => {
        if (!secret) return [];

        const sourceVaultProfileVaultUuid =
            vaultProfiles.find((p) => p.uuid === secret.sourceVaultProfile?.uuid)?.vaultInstance?.uuid ?? undefined;

        const rows: TableDataRow[] = [
            {
                id: 'type',
                columns: ['Type', getEnumLabel(secretTypeEnum, secret.type)],
            },
            {
                id: 'state',
                columns: [
                    'State',
                    <Badge key="state" color={secret.state === SecretState.Active ? 'success' : 'secondary'}>
                        {getEnumLabel(secretStateEnum, secret.state)}
                    </Badge>,
                ],
            },
            {
                id: 'vaultProfile',
                columns: [
                    'Vault Profile',
                    secret.sourceVaultProfile ? (
                        sourceVaultProfileVaultUuid ? (
                            <Link
                                to={`/${Resource.VaultProfiles.toLowerCase()}/detail/${sourceVaultProfileVaultUuid}/${secret.sourceVaultProfile.uuid}`}
                            >
                                {secret.sourceVaultProfile.name}
                            </Link>
                        ) : (
                            secret.sourceVaultProfile.name
                        )
                    ) : (
                        'Unassigned'
                    ),
                ],
            },
            {
                id: 'version',
                columns: ['Version', secret.version ? `v${secret.version}` : ''],
            },
            {
                id: 'status',
                columns: [
                    'Status',
                    <Badge key="status" color={secret.enabled ? 'success' : 'danger'}>
                        {secret.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>,
                ],
            },
            {
                id: 'lastUpdate',
                columns: ['Last update', secret.updatedAt ?? ''],
            },
        ];

        return rows;
    }, [secret, vaultProfiles, secretTypeEnum, secretStateEnum]);

    const syncVaultProfilesHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'name', content: 'Name' },
            { id: 'description', content: 'Description' },
        ],
        [],
    );

    const syncVaultProfilesData: TableDataRow[] = useMemo(() => {
        if (!secret || !secret.syncVaultProfiles) return [];

        return secret.syncVaultProfiles.map((profile) => {
            const vaultUuid = vaultProfiles.find((p) => p.uuid === profile.uuid)?.vaultInstance?.uuid ?? undefined;

            return {
                id: profile.uuid,
                columns: [
                    vaultUuid ? (
                        <Link key="name" to={`/${Resource.VaultProfiles.toLowerCase()}/detail/${vaultUuid}/${profile.uuid}`}>
                            {profile.name}
                        </Link>
                    ) : (
                        profile.name
                    ),
                    '',
                ],
            };
        });
    }, [secret, vaultProfiles]);

    const userOptions = useMemo(
        () =>
            users.map((user) => ({
                value: user.uuid,
                label: user.username,
            })),
        [users],
    );

    const groupOptions = useMemo(
        () =>
            (groups ?? []).map((group: any) => ({
                value: group.uuid,
                label: group.name,
            })),
        [groups],
    );

    const vaultProfileOptions = useMemo(
        () =>
            vaultProfiles
                .filter((profile) => profile.enabled)
                .map((profile) => ({
                    value: profile.uuid,
                    label: profile.name,
                })),
        [vaultProfiles],
    );

    const versionsHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'version', content: 'Version' },
            { id: 'createdAt', content: 'Created at' },
            { id: 'fingerprint', content: 'Fingerprint' },
        ],
        [],
    );

    const versionsData: TableDataRow[] = useMemo(
        () =>
            versions.map((v) => ({
                id: v.version.toString(),
                columns: [v.version.toString(), v.createdAt ?? '', v.fingerprint ?? ''],
            })),
        [versions],
    );

    const otherPropertiesHeaders: TableHeader[] = useMemo(
        () => [
            { id: 'attribute', content: 'Attribute' },
            { id: 'value', content: 'Value' },
            { id: 'action', content: 'Action' },
        ],
        [],
    );

    const otherPropertiesData: TableDataRow[] = useMemo(() => {
        const sourceVaultProfileVaultUuid =
            vaultProfiles.find((p) => p.uuid === secret?.sourceVaultProfile?.uuid)?.vaultInstance?.uuid ?? undefined;

        return [
            {
                id: 'uuid',
                columns: ['UUID', secret?.uuid ?? ''],
            },
            {
                id: 'owner',
                columns: [
                    'Owner',
                    secret?.owner ? (
                        <Link to={`/${Resource.Users.toLowerCase()}/detail/${secret.owner.uuid}`}>{(secret.owner as any).name}</Link>
                    ) : (
                        'Unassigned'
                    ),
                    <div key="owner-actions" className="flex">
                        <Button
                            variant="transparent"
                            color="secondary"
                            onClick={() => {
                                setOwnerUuid(secret?.owner?.uuid ?? '');
                                setIsUpdateOwnerOpen(true);
                            }}
                            title="Update Owner"
                        >
                            <EditIcon size={16} />
                        </Button>
                    </div>,
                ],
            },
            {
                id: 'groups',
                columns: [
                    'Groups',
                    secret?.groups && secret.groups.length > 0
                        ? secret.groups.map((g, i) => (
                              <Fragment key={g.uuid}>
                                  <Link to={`/${Resource.Groups.toLowerCase()}/detail/${g.uuid}`}>{g.name}</Link>
                                  {i !== (secret.groups?.length ?? 0) - 1 ? ', ' : ''}
                              </Fragment>
                          ))
                        : 'Unassigned',
                    <div key="groups-actions" className="flex">
                        <Button
                            variant="transparent"
                            color="secondary"
                            onClick={() => {
                                setSelectedGroups(
                                    (secret?.groups ?? []).map((g) => ({
                                        value: g.uuid,
                                        label: g.name,
                                    })),
                                );
                                setIsUpdateGroupsOpen(true);
                            }}
                            title="Update Groups"
                        >
                            <EditIcon size={16} />
                        </Button>
                    </div>,
                ],
            },
            {
                id: 'sourceVaultProfile',
                columns: [
                    'Source Vault profile',
                    secret?.sourceVaultProfile ? (
                        sourceVaultProfileVaultUuid ? (
                            <Link
                                to={`/${Resource.VaultProfiles.toLowerCase()}/detail/${sourceVaultProfileVaultUuid}/${secret.sourceVaultProfile.uuid}`}
                            >
                                {secret.sourceVaultProfile.name}
                            </Link>
                        ) : (
                            secret.sourceVaultProfile.name
                        )
                    ) : (
                        'Unassigned'
                    ),
                    <div key="source-vault-profile-actions" className="flex">
                        <Button
                            variant="transparent"
                            color="secondary"
                            onClick={() => {
                                setSelectedVaultProfileUuid(secret?.sourceVaultProfile?.uuid ?? '');
                                setIsUpdateVaultProfileOpen(true);
                            }}
                            title="Update Source Vault Profile"
                        >
                            <EditIcon size={16} />
                        </Button>
                    </div>,
                ],
            },
        ];
    }, [secret, vaultProfiles]);

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Secrets)} Inventory`, href: `/${Resource.Secrets.toLowerCase()}` },
                    { label: secret?.name || 'Secret Details', href: '' },
                ]}
            />

            <div className="space-y-4">
                <TabLayout
                    tabs={[
                        {
                            title: 'Details',
                            content: (
                                <div className="space-y-4">
                                    <Widget
                                        title="Secret Details"
                                        busy={isFetchingDetail || isDeleting || isUpdating}
                                        widgetButtons={widgetButtons}
                                        titleSize="large"
                                        refreshAction={getFreshSecretDetails}
                                        widgetLockName={LockWidgetNameEnum.CertificateDetailsWidget}
                                        lockSize="large"
                                    >
                                        <CustomTable headers={detailHeaders} data={detailData} />
                                    </Widget>

                                    {secret && (
                                        <Container className="grid gap-6 xl:grid-cols-2 items-start">
                                            <Widget
                                                title="Sync Vault Profiles"
                                                titleSize="large"
                                                refreshAction={getFreshSecretDetails}
                                                widgetLockName={LockWidgetNameEnum.ListOfVaults}
                                                lockSize="large"
                                            >
                                                <CustomTable headers={syncVaultProfilesHeaders} data={syncVaultProfilesData} />
                                            </Widget>

                                            <Widget title="Other Properties" titleSize="large">
                                                <CustomTable headers={otherPropertiesHeaders} data={otherPropertiesData} />
                                            </Widget>
                                        </Container>
                                    )}
                                </div>
                            ),
                        },
                        {
                            title: 'Attributes',
                            content: (
                                <div className="space-y-4">
                                    {secret?.attributes && secret.attributes.length > 0 && (
                                        <AttributeViewer attributes={secret.attributes} />
                                    )}

                                    {secret && (
                                        <CustomAttributeWidget
                                            resource={Resource.Secrets}
                                            resourceUuid={secret.uuid}
                                            attributes={secret.customAttributes}
                                            noBorder
                                        />
                                    )}
                                </div>
                            ),
                        },
                        {
                            title: 'Versions',
                            content: <CustomTable headers={versionsHeaders} data={versionsData} />,
                        },
                    ]}
                />

                <Dialog
                    isOpen={isEditSecretOpen}
                    caption={`Edit "${secret?.name}"`}
                    size="xl"
                    toggle={() => setIsEditSecretOpen(false)}
                    body={
                        secret && (
                            <SecretForm
                                initialSecret={secret}
                                onCancel={() => setIsEditSecretOpen(false)}
                                onSuccess={() => {
                                    setIsEditSecretOpen(false);
                                    getFreshSecretDetails();
                                }}
                            />
                        )
                    }
                />

                <Dialog
                    isOpen={confirmEnable}
                    caption="Enable Secret"
                    body="You are about to enable a Secret. Is this what you want to do?"
                    toggle={() => setConfirmEnable(false)}
                    icon="check"
                    buttons={[
                        { color: 'primary', onClick: onEnableConfirmed, body: 'Enable' },
                        { color: 'secondary', variant: 'outline', onClick: () => setConfirmEnable(false), body: 'Cancel' },
                    ]}
                />

                <Dialog
                    isOpen={confirmDisable}
                    caption="Disable Secret"
                    body="You are about to disable a Secret. Is this what you want to do?"
                    toggle={() => setConfirmDisable(false)}
                    icon="times"
                    buttons={[
                        { color: 'danger', onClick: onDisableConfirmed, body: 'Disable' },
                        { color: 'secondary', variant: 'outline', onClick: () => setConfirmDisable(false), body: 'Cancel' },
                    ]}
                />

                <Dialog
                    isOpen={confirmDelete}
                    caption="Delete Secret"
                    body="You are about to delete a Secret. Is this what you want to do?"
                    toggle={() => setConfirmDelete(false)}
                    icon="delete"
                    buttons={[
                        { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                        { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    ]}
                />

                <Dialog
                    isOpen={isUpdateOwnerOpen}
                    caption="Update Secret Owner"
                    body={
                        <>
                            <Select
                                id="secret-owner-detail"
                                label="Owner"
                                placeholder="Select owner"
                                options={userOptions}
                                value={ownerUuid || ''}
                                onChange={(value) => setOwnerUuid(value as string)}
                            />
                            <Container className="flex-row justify-end modal-footer mt-4" gap={4}>
                                <Button variant="outline" onClick={() => setIsUpdateOwnerOpen(false)} type="button">
                                    Cancel
                                </Button>
                                <Button color="danger" onClick={handleRemoveOwner} type="button">
                                    Remove
                                </Button>
                                <Button color="primary" onClick={handleUpdateOwner} type="button" disabled={!ownerUuid}>
                                    Update
                                </Button>
                            </Container>
                        </>
                    }
                    toggle={() => setIsUpdateOwnerOpen(false)}
                    size="md"
                    buttons={[]}
                />

                <Dialog
                    isOpen={isUpdateGroupsOpen}
                    caption="Update Secret Groups"
                    body={
                        <>
                            <Select
                                id="secret-groups-detail"
                                label="Groups"
                                placeholder="Select groups"
                                options={groupOptions}
                                value={selectedGroups}
                                onChange={(value) => setSelectedGroups((value as { value: string; label: string }[]) || [])}
                                isMulti
                            />
                            <Container className="flex-row justify-end modal-footer mt-4" gap={4}>
                                <Button variant="outline" onClick={() => setIsUpdateGroupsOpen(false)} type="button">
                                    Cancel
                                </Button>
                                <Button color="danger" onClick={handleClearGroups} type="button">
                                    Clear
                                </Button>
                                <Button color="primary" onClick={handleUpdateGroups} type="button" disabled={selectedGroups.length === 0}>
                                    Update
                                </Button>
                            </Container>
                        </>
                    }
                    toggle={() => setIsUpdateGroupsOpen(false)}
                    size="md"
                    buttons={[]}
                />

                <Dialog
                    isOpen={isUpdateVaultProfileOpen}
                    caption="Update Source Vault Profile"
                    body={
                        <>
                            <Select
                                id="secret-vault-profile-detail"
                                label="Source Vault Profile"
                                placeholder="Select vault profile"
                                options={vaultProfileOptions}
                                value={selectedVaultProfileUuid || ''}
                                onChange={(value) => setSelectedVaultProfileUuid(value as string)}
                            />
                            <Container className="flex-row justify-end modal-footer mt-4" gap={4}>
                                <Button variant="outline" onClick={() => setIsUpdateVaultProfileOpen(false)} type="button">
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={handleUpdateVaultProfile}
                                    type="button"
                                    disabled={!selectedVaultProfileUuid}
                                >
                                    Update
                                </Button>
                            </Container>
                        </>
                    }
                    toggle={() => setIsUpdateVaultProfileOpen(false)}
                    size="md"
                    buttons={[]}
                />
            </div>
        </div>
    );
}

export default SecretDetail;
