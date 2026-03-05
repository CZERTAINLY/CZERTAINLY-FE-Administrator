import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import Dialog from 'components/Dialog';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { ApiClients } from '../../../../api';
import { actions as vaultActions, selectors as vaultSelectors } from 'ducks/vaults';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';

import { SearchRequestModel } from 'types/certificate';
import { LockWidgetNameEnum } from 'types/user-interface';
import { Resource } from 'types/openapi';

import VaultForm from '../form';

export default function VaultsList() {
    const dispatch = useDispatch();

    const vaults = useSelector(vaultSelectors.vaults);
    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.VAULT));

    const isFetchingList = useSelector(vaultSelectors.isFetchingList);
    const isBusy = isFetchingList;

    const [isAddOpen, setIsAddOpen] = useState(false);

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                content: 'Name',
                width: '25%',
            },
            {
                id: 'description',
                content: 'Description',
                width: '35%',
            },
            {
                id: 'connector',
                content: 'Connector',
                width: '25%',
            },
            {
                id: 'features',
                content: 'Features',
                width: '15%',
            },
        ],
        [],
    );

    const rows: TableDataRow[] = useMemo(
        () =>
            vaults.map((vault) => ({
                id: vault.uuid,
                columns: [
                    <Link to={`./detail/${vault.uuid}`}>{vault.name}</Link>,
                    vault.description || '',
                    vault.connector ? (
                        <Link to={`/${Resource.Connectors.toLowerCase()}/detail/${vault.connector.uuid}`}>{vault.connector.name}</Link>
                    ) : (
                        ''
                    ),
                    '--',
                ],
            })),
        [vaults],
    );

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(vaultActions.listVaults(filters)), [dispatch]);
    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Vault',
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
                onDeleteCallback={(uuids) => uuids.forEach((uuid) => dispatch(vaultActions.deleteVault({ uuid: uuid as string })))}
                headers={headers}
                data={rows}
                isBusy={isBusy}
                title="List of Vaults"
                entityNameSingular="Vault"
                entityNamePlural="Vaults"
                filterTitle="Vaults Filter"
                pageWidgetLockName={LockWidgetNameEnum.ListOfVaults}
                getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.vaults.getSearchableFieldInformation(), [])}
                additionalButtons={buttons}
                addHidden
            />

            <Dialog
                isOpen={isAddOpen}
                caption="Create Vault"
                size="xl"
                toggle={() => setIsAddOpen(false)}
                body={<VaultForm onCancel={() => setIsAddOpen(false)} onSuccess={() => setIsAddOpen(false)} />}
            />
        </>
    );
}
