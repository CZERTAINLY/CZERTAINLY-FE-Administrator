import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Badge from 'components/Badge';
import { actions, selectors } from 'ducks/connectors';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import ConnectorForm from '../form';

import { FunctionGroupModel } from 'types/connectors';
import { LockWidgetNameEnum } from 'types/user-interface';
import { attributeFieldNameTransform } from 'utils/attributes/attributes';
import { inventoryStatus } from 'utils/connector';

export default function ConnectorList() {
    const dispatch = useDispatch();

    const checkedRows = useSelector(selectors.checkedRows);
    const connectors = useSelector(selectors.connectors);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isForceDeleting = useSelector(selectors.isBulkForceDeleting);
    const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
    const isBulkAuthorizing = useSelector(selectors.isBulkAuthorizing);
    const isCreating = useSelector(selectors.isCreating);
    const isUpdating = useSelector(selectors.isUpdating);

    const isBusy = isFetching || isDeleting || isBulkDeleting || isForceDeleting || isBulkReconnecting || isBulkAuthorizing;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);
    const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [editingConnectorId, setEditingConnectorId] = useState<string | undefined>(undefined);

    const getFreshData = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.listConnectors({}));
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);
    }, [bulkDeleteErrorMessages]);

    const wasCreating = useRef(isCreating);
    const wasUpdating = useRef(isUpdating);

    useEffect(() => {
        if (wasCreating.current && !isCreating) {
            setIsAddModalOpen(false);
            getFreshData();
        }
        wasCreating.current = isCreating;
    }, [isCreating, getFreshData]);

    useEffect(() => {
        if (wasUpdating.current && !isUpdating) {
            setEditingConnectorId(undefined);
            getFreshData();
        }
        wasUpdating.current = isUpdating;
    }, [isUpdating, getFreshData]);

    const handleOpenAddModal = useCallback(() => {
        setIsAddModalOpen(true);
    }, []);

    const handleCloseAddModal = useCallback(() => {
        setIsAddModalOpen(false);
        setEditingConnectorId(undefined);
    }, []);

    const onAddClick = useCallback(() => {
        handleOpenAddModal();
    }, [handleOpenAddModal]);

    const onReconnectClick = useCallback(() => {
        dispatch(actions.bulkReconnectConnectors({ uuids: checkedRows }));
    }, [checkedRows, dispatch]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

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

    const getKinds = useCallback((functionGroups: FunctionGroupModel[]) => {
        return functionGroups.map((group) => (
            <div key={group.uuid} style={{ margin: '1px' }}>
                {group.kinds.map((kind) => (
                    <span key={kind}>
                        <Badge color="secondary">{kind}</Badge>
                        &nbsp;
                    </span>
                ))}
            </div>
        ));
    }, []);

    const getFunctionGroups = useCallback(
        (functionGroups: FunctionGroupModel[]) =>
            functionGroups.map((group) => (
                <div key={group.uuid}>
                    <Badge color="primary" style={{ margin: '1px' }}>
                        {attributeFieldNameTransform[group.name || ''] || group.name}
                    </Badge>
                </div>
            )),
        [],
    );

    const forceDeleteBody = useMemo(
        () => (
            <div>
                <div>Failed to delete {checkedRows.length > 1 ? 'Connectors' : 'a Connector'}. Please find the details below:</div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                <b>Name</b>
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                                <b>Dependencies</b>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {bulkDeleteErrorMessages?.map((message) => (
                            <tr className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{message.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                    {message.message}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ),
        [bulkDeleteErrorMessages, checkedRows.length],
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
                content: 'Function Groups',
                align: 'center',
                sortable: true,
                id: 'connectorFunctions',
                width: '15%',
            },
            {
                content: 'Kinds',
                sortable: true,
                id: 'kinds',
                width: '15%',
                align: 'center',
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
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <Link to={`./detail/${connector.uuid}`}>{connector.name}</Link>
                        </span>,

                        <span style={{ whiteSpace: 'nowrap' }}>{getFunctionGroups(connector.functionGroups)}</span>,

                        <span style={{ whiteSpace: 'nowrap' }}>{getKinds(connector.functionGroups)}</span>,

                        <span style={{ whiteSpace: 'nowrap' }}>{connector.url}</span>,

                        <Badge style={{ backgroundColor: connectorStatus[1] }}>{connectorStatus[0]}</Badge>,
                    ],
                };
            }),
        [connectors, getFunctionGroups, getKinds],
    );

    return (
        <div>
            <Widget
                title="Connector Store"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ConnectorStore}
                refreshAction={getFreshData}
                widgetButtons={buttons}
                titleSize="large"
            >
                <CustomTable
                    headers={connectorsRowHeaders}
                    data={connectorList}
                    onCheckedRowsChanged={setCheckedRows}
                    hasCheckboxes={true}
                    hasPagination={true}
                    canSearch={true}
                />
            </Widget>

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
                        {`You are about to approve a ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}. Is this what you want to do?`}
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
