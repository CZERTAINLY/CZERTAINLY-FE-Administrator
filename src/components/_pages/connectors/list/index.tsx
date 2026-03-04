import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRunOnFinished } from 'utils/common-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Badge from 'components/Badge';
import { actions, selectors } from 'ducks/connectors';

import { TableDataRow, TableHeader } from 'components/CustomTable';
import ForceDeleteErrorTable from 'components/ForceDeleteErrorTable';
import Dialog from 'components/Dialog';
import { WidgetButtonProps } from 'components/WidgetButtons';
import ConnectorForm from '../form';
import PagedList from 'components/PagedList/PagedList';

import { LockWidgetNameEnum } from 'types/user-interface';
import { inventoryStatus } from 'utils/connector';
import { EntityType } from 'ducks/filters';
import { selectors as pagingSelectors } from 'ducks/paging';
import { ApiClients } from '../../../../api';
import { SearchRequestModel } from 'types/certificate';

export default function ConnectorList() {
    const dispatch = useDispatch();

    const checkedRows = useSelector(pagingSelectors.checkedRows(EntityType.CONNECTOR));
    const connectors = useSelector(selectors.connectors);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isForceDeleting = useSelector(selectors.isBulkForceDeleting);
    const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
    const isBulkAuthorizing = useSelector(selectors.isBulkAuthorizing);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isDeleting || isBulkDeleting || isForceDeleting || isBulkReconnecting || isBulkAuthorizing;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);
    const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editingConnectorId, setEditingConnectorId] = useState<string | undefined>(undefined);

    useEffect(() => {
        setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);
    }, [bulkDeleteErrorMessages]);

    useRunOnFinished(isCreating, () => {
        setIsAddModalOpen(false);
    });
    useRunOnFinished(isUpdating, () => {
        setEditingConnectorId(undefined);
    });

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        setEditingConnectorId(undefined);
    }, []);

    const onReconnectClick = useCallback(() => {
        dispatch(actions.bulkReconnectConnectors({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.bulkDeleteConnectors({ uuids: checkedRows }));
    }, [dispatch, checkedRows]);

    const onForceDeleteConfirmed = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.bulkForceDeleteConnectors({ uuids: checkedRows }));
    }, [dispatch, checkedRows]);

    const onAuthorizeConfirmed = useCallback(() => {
        setConfirmAuthorize(false);
        dispatch(actions.bulkAuthorizeConnectors({ uuids: checkedRows }));
    }, [dispatch, checkedRows]);

    const onListCallback = useCallback(
        (filters: SearchRequestModel) => {
            dispatch(actions.clearDeleteErrorMessages());
            dispatch(actions.listConnectors(filters));
        },
        [dispatch],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create',
                onClick: handleOpenAddModal,
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'plug',
                disabled: checkedRows.length === 0,
                tooltip: 'Reconnect',
                onClick: () => {
                    onReconnectClick();
                },
            },
            {
                icon: 'check',
                disabled: checkedRows.length === 0,
                tooltip: 'Approve',
                onClick: () => {
                    setConfirmAuthorize(true);
                },
            },
        ],
        [checkedRows, handleOpenAddModal, onReconnectClick],
    );

    const forceDeleteBody = (
        <ForceDeleteErrorTable
            items={bulkDeleteErrorMessages}
            entityNameSingular="a Connector"
            entityNamePlural="Connectors"
            itemsCount={checkedRows.length}
        />
    );

    const connectorsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'connectorName',
                width: '25%',
            },
            {
                content: 'Ver',
                sortable: true,
                id: 'connectorVersion',
                align: 'center',
                width: '5%',
            },
            {
                content: 'Proxy',
                sortable: true,
                id: 'connectorProxy',
                width: '15%',
            },
            {
                content: 'URL',
                sortable: true,
                id: 'connectorUrl',
            },
            {
                content: 'Status',
                sortable: true,
                id: 'connectorStatus',
                width: '5%',
            },
        ],
        [],
    );

    const connectorList: TableDataRow[] = useMemo(
        () =>
            connectors.map((connector) => {
                const connectorStatus = inventoryStatus(connector.status);

                return {
                    id: connector.uuid,
                    columns: [
                        <span key="name" style={{ whiteSpace: 'nowrap' }}>
                            <Link to={`./detail/${connector.uuid}`}>{connector.name}</Link>
                        </span>,
                        <span key="version" style={{ whiteSpace: 'nowrap' }}>
                            {connector.version || '-'}
                        </span>,
                        <span key="status" style={{ whiteSpace: 'nowrap' }}>
                            coming soon
                        </span>,
                        <span key="url" style={{ whiteSpace: 'nowrap' }}>
                            {connector.url}
                        </span>,
                        <Badge key="badge" style={{ backgroundColor: connectorStatus[1] }}>
                            {connectorStatus[0]}
                        </Badge>,
                    ],
                };
            }),
        [connectors],
    );

    return (
        <div className="space-y-4">
            <PagedList
                entity={EntityType.CONNECTOR}
                headers={connectorsRowHeaders}
                data={connectorList}
                isBusy={isBusy}
                onListCallback={onListCallback}
                getAvailableFiltersApi={useCallback(
                    (apiClients: ApiClients) => apiClients.connectorsV2.getConnectorSearchableFieldInformation(),
                    [],
                )}
                title="Connector Store"
                filterTitle="Connector Filter"
                addHidden
                additionalButtons={buttons}
                pageWidgetLockName={LockWidgetNameEnum.ConnectorStore}
            />

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                ]}
            />

            <Dialog
                isOpen={confirmAuthorize}
                caption={`Approve ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}`}
                body={
                    <span className="text-center">
                        {`You are about to approve ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}. Is this what you want to do?`}
                    </span>
                }
                toggle={() => setConfirmAuthorize(false)}
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmAuthorize(false), body: 'Cancel' },
                    { color: 'primary', onClick: onAuthorizeConfirmed, body: 'Approve' },
                ]}
                noBorder
                icon="check"
            />

            <Dialog
                isOpen={confirmForceDelete}
                caption={`Force Delete ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}`}
                body={forceDeleteBody}
                toggle={() => setConfirmForceDelete(false)}
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                    { color: 'danger', onClick: onForceDeleteConfirmed, body: 'Force delete' },
                ]}
            />

            <Dialog
                isOpen={isAddModalOpen || !!editingConnectorId}
                toggle={handleCloseAddModal}
                caption="Create Connector"
                size="xl"
                body={<ConnectorForm connectorId={editingConnectorId} onCancel={handleCloseAddModal} />}
            />
        </div>
    );
}
