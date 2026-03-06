import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import Dialog from 'components/Dialog';

import { ApiClients } from '../../../../api';
import { actions as vaultProfileActions, selectors as vaultProfileSelectors } from 'ducks/vault-profiles';
import { EntityType } from 'ducks/filters';

import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Resource } from 'types/openapi';
import Badge from 'components/Badge';
import { WidgetButtonProps } from 'components/WidgetButtons';
import VaultProfileForm from '../form';

export default function VaultProfilesList() {
    const dispatch = useDispatch();

    const vaultProfiles = useSelector(vaultProfileSelectors.vaultProfiles);

    const isFetchingList = useSelector(vaultProfileSelectors.isFetchingList);
    const isCreating = useSelector(vaultProfileSelectors.isCreating);
    const isDeleting = useSelector(vaultProfileSelectors.isDeleting);
    const isBusy = isFetchingList || isCreating || isDeleting;

    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleCloseAdd = useCallback(() => setIsAddOpen(false), []);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                width: '25%',
                sortable: true,
            },
            {
                id: 'description',
                content: 'Description',
                width: '35%',
            },
            {
                id: 'vaultInstance',
                content: 'Vault',
                width: '25%',
                sortable: true,
            },
            {
                id: 'status',
                content: 'Status',
                width: '15%',
                sortable: true,
            },
        ],
        [],
    );

    const rows: TableDataRow[] = useMemo(
        () =>
            vaultProfiles.map((profile) => ({
                id: profile.uuid,
                columns: [
                    profile.vaultInstance ? (
                        <Link to={`/${Resource.VaultProfiles.toLowerCase()}/detail/${profile.vaultInstance.uuid}/${profile.uuid}`}>
                            {profile.name}
                        </Link>
                    ) : (
                        profile.name
                    ),
                    profile.description || '',
                    profile.vaultInstance ? (
                        <Link to={`/${Resource.Vaults.toLowerCase()}/detail/${profile.vaultInstance.uuid}`}>
                            {profile.vaultInstance.name}
                        </Link>
                    ) : (
                        ''
                    ),
                    <Badge key="status" color={profile.enabled ? 'success' : 'secondary'}>
                        {profile.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>,
                ],
            })),
        [vaultProfiles],
    );

    const onListCallback = useCallback(
        (filters: SearchRequestModel) => {
            dispatch(vaultProfileActions.listVaultProfiles(filters));
        },
        [dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Vault Profile',
                onClick: () => setIsAddOpen(true),
            },
        ],
        [],
    );

    return (
        <>
            <PagedList
                entity={EntityType.VAULT}
                onListCallback={onListCallback}
                onDeleteCallback={(uuids) =>
                    uuids.forEach((uuid) => {
                        const profile = vaultProfiles.find((p) => p.uuid === uuid);
                        if (profile?.vaultInstance?.uuid) {
                            dispatch(
                                vaultProfileActions.deleteVaultProfile({
                                    vaultUuid: profile.vaultInstance.uuid,
                                    vaultProfileUuid: profile.uuid,
                                }),
                            );
                        }
                    })
                }
                headers={headers}
                data={rows}
                isBusy={isBusy}
                title="Vault Profiles"
                entityNameSingular="Vault Profile"
                entityNamePlural="Vault Profiles"
                filterTitle="Vault Profiles Filter"
                pageWidgetLockName={LockWidgetNameEnum.ListOfVaults}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.vaultProfiles.getSearchableFieldInformation1(),
                    [],
                )}
                additionalButtons={buttons}
                addHidden
            />

            <Dialog
                isOpen={isAddOpen}
                caption="Create Vault Profile"
                size="xl"
                toggle={handleCloseAdd}
                body={<VaultProfileForm onCancel={handleCloseAdd} onSuccess={handleCloseAdd} />}
            />
        </>
    );
}
