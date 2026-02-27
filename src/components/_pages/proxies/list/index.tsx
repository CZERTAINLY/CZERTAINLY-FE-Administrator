import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';

import Badge from 'components/Badge';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Select from 'components/Select';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { actions, selectors } from 'ducks/proxies';
import { LockWidgetNameEnum } from 'types/user-interface';
import { ProxyStatus } from 'types/openapi';

export default function ProxiesList() {
    const dispatch = useDispatch();

    const checkedRows = useSelector(selectors.checkedRows);
    const proxies = useSelector(selectors.proxies);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);

    const isBusy = isFetching || isDeleting;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [filterStatus, setFilterStatus] = useState<ProxyStatus | undefined>(undefined);

    const getFreshData = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.listProxies({ status: filterStatus }));
    }, [dispatch, filterStatus]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    const setCheckedRows = useCallback(
        (rows: (string | number)[]) => {
            dispatch(actions.setCheckedRows({ checkedRows: rows as string[] }));
        },
        [dispatch],
    );

    const onDeleteConfirmed = useCallback(() => {
        setConfirmDelete(false);
        dispatch(actions.clearDeleteErrorMessages());
        // Delete each selected proxy sequentially
        checkedRows.forEach((uuid) => {
            dispatch(actions.deleteProxy({ uuid }));
        });
    }, [dispatch, checkedRows]);

    const proxyStatusFilterOptions = useMemo(
        () => [
            { value: ProxyStatus.Initialized, label: 'Initialized' },
            { value: ProxyStatus.Provisioning, label: 'Provisioning' },
            { value: ProxyStatus.Failed, label: 'Failed' },
            { value: ProxyStatus.WaitingForInstallation, label: 'Waiting For Installation' },
            { value: ProxyStatus.Connected, label: 'Connected' },
            { value: ProxyStatus.Disconnected, label: 'Disconnected' },
        ],
        [],
    );

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'search',
                disabled: false,
                tooltip: 'Filter by Status',
                onClick: () => {},
                custom: (
                    <Select
                        placeholder="Filter by Status"
                        minWidth={200}
                        id="proxyStatus"
                        options={proxyStatusFilterOptions}
                        value={filterStatus || 'Filter by Status'}
                        onChange={(value) => {
                            setFilterStatus(value as ProxyStatus | undefined);
                        }}
                        isClearable
                    />
                ),
            },
            {
                icon: 'trash',
                disabled: checkedRows.length === 0,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [checkedRows, filterStatus, proxyStatusFilterOptions],
    );

    const getProxyStatusColor = useCallback((status: ProxyStatus): string => {
        switch (status) {
            case ProxyStatus.Connected:
                return 'var(--status-success-color)';
            case ProxyStatus.Disconnected:
                return 'var(--status-dark-color)';
            case ProxyStatus.Failed:
                return 'var(--status-danger-color)';
            case ProxyStatus.WaitingForInstallation:
                return 'var(--status-warning-color)';
            case ProxyStatus.Provisioning:
                return 'var(--status-gray-color)';
            case ProxyStatus.Initialized:
            default:
                return 'var(--status-gray-color)';
        }
    }, []);

    const proxiesRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Name',
                sortable: true,
                sort: 'asc',
                id: 'proxyName',
                width: '30%',
            },
            {
                content: 'Description',
                sortable: true,
                id: 'proxyDescription',
                width: '30%',
            },
            {
                content: 'Status',
                sortable: true,
                id: 'proxyStatus',
                width: '20%',
            },
            {
                content: 'Last Activity',
                sortable: true,
                id: 'proxyLastActivity',
                width: '20%',
            },
        ],
        [],
    );

    const proxiesList: TableDataRow[] = useMemo(
        () =>
            proxies.map((proxy) => {
                const statusColor = getProxyStatusColor(proxy.status);
                const statusLabel = proxy.status.charAt(0).toUpperCase() + proxy.status.slice(1);

                return {
                    id: proxy.uuid,
                    columns: [
                        <span style={{ whiteSpace: 'nowrap' }}>
                            <Link to={`./detail/${proxy.uuid}`}>{proxy.name}</Link>
                        </span>,

                        <span style={{ whiteSpace: 'nowrap' }}>{proxy.description || '-'}</span>,

                        <Badge style={{ backgroundColor: statusColor }}>{statusLabel}</Badge>,

                        <span style={{ whiteSpace: 'nowrap' }}>{proxy.lastActivity || '-'}</span>,
                    ],
                };
            }),
        [proxies, getProxyStatusColor],
    );

    return (
        <div>
            <Widget
                dataTestId="proxies-list-widget"
                title="Proxies"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ProxyStore}
                refreshAction={getFreshData}
                widgetButtons={buttons}
                titleSize="large"
            >
                <CustomTable
                    headers={proxiesRowHeaders}
                    data={proxiesList}
                    onCheckedRowsChanged={setCheckedRows}
                    hasCheckboxes={true}
                    hasPagination={true}
                />
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption={`Delete ${checkedRows.length > 1 ? 'Proxies' : 'a Proxy'}`}
                body={`You are about to delete ${checkedRows.length > 1 ? 'Proxies' : 'a Proxy'}. Is this what you want to do?`}
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                ]}
            />
        </div>
    );
}
