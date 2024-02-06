import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Container, Table } from 'reactstrap';

import { actions, selectors } from 'ducks/connectors';

import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { FunctionGroupModel } from 'types/connectors';
import { LockWidgetNameEnum } from 'types/user-interface';
import { attributeFieldNameTransform } from 'utils/attributes/attributes';
import { inventoryStatus } from 'utils/connector';

export default function ConnectorList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const checkedRows = useSelector(selectors.checkedRows);
    const connectors = useSelector(selectors.connectors);

    const bulkDeleteErrorMessages = useSelector(selectors.bulkDeleteErrorMessages);

    const isFetching = useSelector(selectors.isFetchingList);
    const isDeleting = useSelector(selectors.isDeleting);
    const isBulkDeleting = useSelector(selectors.isBulkDeleting);
    const isForceDeleting = useSelector(selectors.isBulkForceDeleting);
    const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
    const isBulkAuthorizing = useSelector(selectors.isBulkAuthorizing);

    const isBusy = isFetching || isDeleting || isBulkDeleting || isForceDeleting || isBulkReconnecting || isBulkAuthorizing;

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);
    const [confirmForceDelete, setConfirmForceDelete] = useState<boolean>(false);

    const getFreshData = useCallback(() => {
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.listConnectors());
    }, [dispatch]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        setConfirmForceDelete(bulkDeleteErrorMessages.length > 0);
    }, [bulkDeleteErrorMessages]);

    const onAddClick = useCallback(() => {
        navigate(`./add`);
    }, [navigate]);

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
                onClick: () => {
                    onAddClick();
                },
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
        [checkedRows, onAddClick, onReconnectClick],
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

                <Table className="table-hover" size="sm">
                    <thead>
                        <tr>
                            <th>
                                <b>Name</b>
                            </th>
                            <th>
                                <b>Dependencies</b>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {bulkDeleteErrorMessages?.map((message) => (
                            <tr>
                                <td>{message.name}</td>
                                <td>{message.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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

                        <Badge color={`${connectorStatus[1]}`}>{connectorStatus[0]}</Badge>,
                    ],
                };
            }),
        [connectors, getFunctionGroups, getKinds],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="Connector Store"
                busy={isBusy}
                widgetLockName={LockWidgetNameEnum.ConnectorStore}
                refreshAction={getFreshData}
                widgetButtons={buttons}
                titleSize="large"
            >
                <br />

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
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmAuthorize}
                caption={`Approve ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}`}
                body={`You are about to approve a ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}. Is this what you want to do?`}
                toggle={() => setConfirmAuthorize(false)}
                buttons={[
                    { color: 'danger', onClick: onAuthorizeConfirmed, body: 'Yes, approve' },
                    { color: 'secondary', onClick: () => setConfirmAuthorize(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmForceDelete}
                caption={`Force Delete ${checkedRows.length > 1 ? 'Connectors' : 'a Connector'}`}
                body={forceDeleteBody}
                toggle={() => setConfirmForceDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onForceDeleteConfirmed, body: 'Force delete' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
