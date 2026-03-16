import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import Badge from 'components/Badge';
import PagedList from 'components/PagedList/PagedList';
import Dialog from 'components/Dialog';
import { WidgetButtonProps } from 'components/WidgetButtons';
import Select from 'components/Select';
import Container from 'components/Container';
import Button from 'components/Button';

import { ApiClients } from '../../../../api';
import { actions, selectors } from 'ducks/secrets';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as userActions, selectors as userSelectors } from 'ducks/users';
import { actions as groupActions, selectors as groupSelectors } from 'ducks/certificateGroups';
import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';

import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import { PlatformEnum, Resource } from 'types/openapi';

import SecretForm from '../form';
import SecretStateBadge from '../SecretStateBadge';

export default function SecretsList() {
    const dispatch = useDispatch();

    const secrets = useSelector(selectors.secrets);
    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.SECRET));

    const isFetchingList = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isFetchingList || isDeleting || isUpdating;

    const secretTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretType));
    const secretStateEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.SecretState));

    const users = useSelector(userSelectors.users);
    const groups = useSelector(groupSelectors.certificateGroups);
    const vaultProfiles = useSelector(vaultProfileSelectors.vaultProfiles);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOwnerOpen, setIsUpdateOwnerOpen] = useState(false);
    const [isUpdateGroupsOpen, setIsUpdateGroupsOpen] = useState(false);
    const [isUpdateVaultProfileOpen, setIsUpdateVaultProfileOpen] = useState(false);

    const [ownerUuid, setOwnerUuid] = useState<string>('');
    const [selectedGroups, setSelectedGroups] = useState<{ value: string; label: string }[]>([]);
    const [selectedVaultProfileUuid, setSelectedVaultProfileUuid] = useState<string>('');

    useEffect(() => {
        dispatch(userActions.list());
        dispatch(groupActions.listGroups());
        dispatch(vaultProfileActions.listVaultProfiles());
    }, [dispatch]);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                width: '25%',
                sortable: true,
            },
            {
                id: 'type',
                content: 'Type',
                width: '10%',
                sortable: true,
            },
            {
                id: 'state',
                content: 'State',
                width: '10%',
                align: 'center',
                sortable: true,
            },
            {
                id: 'vaultProfile',
                content: 'Vault Profile',
                width: '15%',
                sortable: true,
            },
            {
                id: 'version',
                content: 'Version',
                width: '5%',
                align: 'center',
                sortable: true,
            },
            {
                id: 'owner',
                content: 'Owner',
                width: '15%',
                sortable: true,
            },
            {
                id: 'groups',
                content: 'Groups',
                width: '15%',
                sortable: true,
            },
            {
                id: 'status',
                content: 'Status',
                width: '5%',
                align: 'center',
                sortable: true,
            },
        ],
        [],
    );

    const rows: TableDataRow[] = useMemo(
        () =>
            secrets.map((secret) => ({
                id: secret.uuid,
                columns: [
                    <span key="name" style={{ whiteSpace: 'nowrap' }}>
                        <Link to={`./detail/${secret.uuid}`}>{secret.name}</Link>
                    </span>,
                    getEnumLabel(secretTypeEnum, secret.type),
                    <SecretStateBadge key="state" state={secret.state}>
                        {getEnumLabel(secretStateEnum, secret.state)}
                    </SecretStateBadge>,
                    secret.sourceVaultProfile
                        ? (() => {
                              const profile = vaultProfiles.find((p) => p.uuid === secret.sourceVaultProfile?.uuid);
                              const vaultUuid = profile?.vaultInstance?.uuid;
                              return vaultUuid ? (
                                  <Link
                                      to={`/${Resource.VaultProfiles.toLowerCase()}/detail/${vaultUuid}/${secret.sourceVaultProfile.uuid}`}
                                  >
                                      {secret.sourceVaultProfile.name}
                                  </Link>
                              ) : (
                                  secret.sourceVaultProfile.name
                              );
                          })()
                        : '',
                    secret.version ? secret.version.toString() : '',
                    secret.owner ? <Link to={`../users/detail/${secret.owner.uuid}`}>{secret.owner.name}</Link> : 'Unassigned',
                    secret.groups && secret.groups.length > 0
                        ? secret.groups.map((group, i) => (
                              <Fragment key={group.uuid}>
                                  <Link to={`../groups/detail/${group.uuid}`}>{group.name}</Link>
                                  {secret.groups && i !== secret.groups.length - 1 ? ', ' : ''}
                              </Fragment>
                          ))
                        : 'Unassigned',
                    <Badge key="status" color={secret.enabled ? 'success' : 'danger'}>
                        {secret.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>,
                ],
            })),
        [secrets, secretTypeEnum, secretStateEnum, vaultProfiles],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(actions.listSecrets(filters)), [dispatch]);

    const handleEnableSecrets = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.enableSecret({ uuid: String(uuid) })));
    }, [dispatch, checkedRows]);

    const handleDisableSecrets = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.disableSecret({ uuid: String(uuid) })));
    }, [dispatch, checkedRows]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Secret',
                onClick: () => setIsAddOpen(true),
            },
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Enable selected Secrets',
                onClick: handleEnableSecrets,
            },
            {
                icon: 'times',
                disabled: checkedRows.length === 0,
                tooltip: 'Disable selected Secrets',
                onClick: handleDisableSecrets,
            },
            {
                icon: 'user',
                disabled: checkedRows.length === 0,
                tooltip: 'Update Owner',
                onClick: () => setIsUpdateOwnerOpen(true),
            },
            {
                icon: 'group',
                disabled: checkedRows.length === 0,
                tooltip: 'Update Groups',
                onClick: () => setIsUpdateGroupsOpen(true),
            },
            {
                icon: 'plug',
                disabled: checkedRows.length === 0,
                tooltip: 'Update Source Vault Profile',
                onClick: () => setIsUpdateVaultProfileOpen(true),
            },
        ],
        [checkedRows, handleDisableSecrets, handleEnableSecrets],
    );

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
            groups.map((group) => ({
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

    const handleDeleteSecrets = useCallback(
        (uuids: (string | number)[]) => {
            uuids.forEach((uuid) => dispatch(actions.deleteSecret({ uuid: String(uuid) })));
        },
        [dispatch],
    );

    const handleUpdateOwner = useCallback(() => {
        if (!ownerUuid) return;
        checkedRows.forEach((uuid) => dispatch(actions.updateSecretObjects({ uuid: String(uuid), update: { ownerUuid } })));
        setIsUpdateOwnerOpen(false);
        setOwnerUuid('');
    }, [dispatch, checkedRows, ownerUuid]);

    const handleRemoveOwner = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.updateSecretObjects({ uuid: String(uuid), update: { ownerUuid: '' } })));
        setIsUpdateOwnerOpen(false);
        setOwnerUuid('');
    }, [dispatch, checkedRows]);

    const handleUpdateGroups = useCallback(() => {
        const groupUuids = selectedGroups.map((g) => g.value);
        checkedRows.forEach((uuid) => dispatch(actions.updateSecretObjects({ uuid: String(uuid), update: { groupUuids } })));
        setIsUpdateGroupsOpen(false);
        setSelectedGroups([]);
    }, [dispatch, checkedRows, selectedGroups]);

    const handleClearGroups = useCallback(() => {
        checkedRows.forEach((uuid) => dispatch(actions.updateSecretObjects({ uuid: String(uuid), update: { groupUuids: [] } })));
        setIsUpdateGroupsOpen(false);
        setSelectedGroups([]);
    }, [dispatch, checkedRows]);

    const handleUpdateVaultProfile = useCallback(() => {
        if (!selectedVaultProfileUuid) return;
        checkedRows.forEach((uuid) =>
            dispatch(
                actions.updateSecretObjects({
                    uuid: String(uuid),
                    update: { sourceVaultProfileUuid: selectedVaultProfileUuid },
                }),
            ),
        );
        setIsUpdateVaultProfileOpen(false);
        setSelectedVaultProfileUuid('');
    }, [dispatch, checkedRows, selectedVaultProfileUuid]);

    return (
        <>
            <PagedList
                entity={EntityType.SECRET}
                onListCallback={onListCallback}
                onDeleteCallback={handleDeleteSecrets}
                headers={headers}
                data={rows}
                isBusy={isBusy}
                title="List of Secrets"
                entityNameSingular="Secret"
                entityNamePlural="Secrets"
                filterTitle="Secrets Inventory Filter"
                pageWidgetLockName={LockWidgetNameEnum.ListOfSecrets}
                getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.secrets.getSecretSearchableFields(), [])}
                additionalButtons={buttons}
                addHidden
            />

            <Dialog
                isOpen={isAddOpen}
                caption="Create Secret"
                size="xl"
                toggle={() => setIsAddOpen(false)}
                body={<SecretForm onCancel={() => setIsAddOpen(false)} onSuccess={() => setIsAddOpen(false)} />}
            />

            <Dialog
                isOpen={isUpdateOwnerOpen}
                caption="Update Secret Owner"
                body={
                    <>
                        <Select
                            id="secret-owner"
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
                            id="secret-groups-update"
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
                            id="secret-vault-profile"
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
                            <Button color="primary" onClick={handleUpdateVaultProfile} type="button" disabled={!selectedVaultProfileUuid}>
                                Update
                            </Button>
                        </Container>
                    </>
                }
                toggle={() => setIsUpdateVaultProfileOpen(false)}
                size="md"
                buttons={[]}
            />
        </>
    );
}
