import AttributeDescriptorViewer from 'components/Attributes/AttributeDescriptorViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import ConnectorForm from '../form';

import { actions, selectors } from 'ducks/connectors';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions as userInterfaceActions } from 'ducks/user-interface';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Select from 'components/Select';
import Badge from 'components/Badge';
import { AttributeDescriptorModel } from 'types/attributes';
import { FunctionGroupModel } from 'types/connectors';

import { attributeFieldNameTransform } from 'utils/attributes/attributes';
import { inventoryStatus } from 'utils/connector';
import { ConnectorStatus, HealthStatus, PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';

import { LockWidgetNameEnum } from 'types/user-interface';
import Breadcrumb from 'components/Breadcrumb';
import Container from 'components/Container';
import { CircleCheck, CircleAlert, CircleHelp } from 'lucide-react';

export default function ConnectorDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const authTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AuthType));

    const connector = useSelector(selectors.connector);
    const health = useSelector(selectors.connectorHealth);
    const attributes = useSelector(selectors.connectorAttributes);

    const isFetchingAllAttributes = useSelector(selectors.isFetchingAllAttributes);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);
    const isFetchingHealth = useSelector(selectors.isFetchingHealth);
    const isReconnecting = useSelector(selectors.isReconnecting);
    const isBulkReconnecting = useSelector(selectors.isBulkReconnecting);
    const isAuthorizing = useSelector(selectors.isAuthorizing);
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [currentFunctionGroup, setFunctionGroup] = useState<FunctionGroupModel | undefined>();
    const [currentFunctionGroupKind, setCurrentFunctionGroupKind] = useState<string>();
    const [currentFunctionGroupKindAttributes, setCurrentFunctionGroupKindAttributes] = useState<AttributeDescriptorModel[] | undefined>();

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const isUpdating = useSelector(selectors.isUpdating);

    const getFreshConnectorDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getConnectorDetail({ uuid: id }));
    }, [id, dispatch]);

    const getFreshConnectorHealth = useCallback(() => {
        if (!id) return;
        dispatch(actions.getConnectorHealth({ uuid: id }));
    }, [id, dispatch]);

    const getFreshConnectorAttributesDesc = useCallback(() => {
        if (!id) return;
        dispatch(userInterfaceActions.removeWidgetLock(LockWidgetNameEnum.ConnectorAttributes));
        dispatch(actions.getConnectorAllAttributesDescriptors({ uuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        setFunctionGroup(undefined);
        getFreshConnectorDetails();
        getFreshConnectorHealth();
        getFreshConnectorAttributesDesc();
    }, [id, getFreshConnectorDetails, getFreshConnectorHealth, getFreshConnectorAttributesDesc]);

    useEffect(() => {
        if (!connector || connector.functionGroups.length === 0) {
            setFunctionGroup(undefined);
            setCurrentFunctionGroupKind(undefined);
            return;
        }

        setFunctionGroup(connector.functionGroups[0]);

        if (connector.functionGroups[0].kinds.length > 0) {
            setCurrentFunctionGroupKind(connector.functionGroups[0].kinds[0]);
        } else {
            setCurrentFunctionGroupKind(undefined);
        }
    }, [connector]);

    useEffect(() => {
        let attrs: AttributeDescriptorModel[] | undefined = undefined;

        if (attributes && connector && currentFunctionGroup && currentFunctionGroupKind) {
            const fgAttrs = attributes[currentFunctionGroup.functionGroupCode];
            if (fgAttrs) attrs = fgAttrs[currentFunctionGroupKind];
        }

        setCurrentFunctionGroupKindAttributes(attrs);
    }, [attributes, connector, currentFunctionGroup, currentFunctionGroupKind]);

    const wasUpdating = useRef(isUpdating);

    useEffect(() => {
        if (wasUpdating.current && !isUpdating) {
            setIsEditModalOpen(false);
            getFreshConnectorDetails();
        }
        wasUpdating.current = isUpdating;
    }, [isUpdating, getFreshConnectorDetails]);

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
    }, []);

    const onEditClick = useCallback(() => {
        if (!connector) return;
        setIsEditModalOpen(true);
    }, [connector]);

    const onReconnectClick = useCallback(() => {
        if (!connector) return;
        dispatch(actions.reconnectConnector({ uuid: connector.uuid }));
    }, [connector, dispatch]);

    const onDeleteConfirmed = useCallback(() => {
        if (!connector) return;
        dispatch(actions.deleteConnector({ uuid: connector.uuid }));
        setConfirmDelete(false);
    }, [connector, dispatch]);

    const onAuthorizeConfirmed = useCallback(() => {
        if (!connector) return;
        setConfirmAuthorize(false);
        dispatch(actions.authorizeConnector({ uuid: connector.uuid }));
    }, [dispatch, connector]);

    const onForceDeleteConnector = useCallback(() => {
        if (!connector) return;
        dispatch(actions.clearDeleteErrorMessages());
        dispatch(actions.bulkForceDeleteConnectors({ uuids: [connector.uuid], successRedirect: `../../connectors` }));
    }, [connector, dispatch]);

    const onFunctionGroupChange = useCallback(
        (groupCode: string) => {
            const group = (connector?.functionGroups || []).find((group) => group.functionGroupCode === groupCode);
            if (group) setFunctionGroup(group);
        },
        [connector],
    );

    const onFunctionGroupKindChange = useCallback((kind: string) => setCurrentFunctionGroupKind(kind), []);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'plug',
                disabled: false,
                tooltip: 'Reconnect',
                onClick: () => {
                    onReconnectClick();
                },
            },
            {
                icon: 'check',
                disabled: connector ? connector.status === ConnectorStatus.Connected : false,
                tooltip: 'Approve',
                onClick: () => {
                    setConfirmAuthorize(true);
                },
            },
        ],
        [onEditClick, onReconnectClick, setConfirmDelete, setConfirmAuthorize, connector],
    );

    const attributesHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const attributesData: TableDataRow[] = useMemo(() => {
        if (!connector) return [];

        const connectorStatus = inventoryStatus(connector.status);

        return [
            {
                id: 'uuid',
                columns: ['UUID', connector.uuid],
            },
            {
                id: 'name',
                columns: ['Name', connector.name],
            },
            {
                id: 'url',
                columns: ['URL', connector.url],
            },
            {
                id: 'status',
                columns: ['Status', <Badge style={{ backgroundColor: connectorStatus[1] }}>{connectorStatus[0]}</Badge>],
            },
            {
                id: 'authType',
                columns: ['Auth Type', getEnumLabel(authTypeEnum, connector.authType)],
            },
        ];
    }, [connector, authTypeEnum]);

    const functionalityHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'functionGroup',
                content: 'Function Group',
            },
            {
                id: 'kind',
                content: 'Kind',
            },
        ],
        [],
    );

    const functionalityData: TableDataRow[] = useMemo(
        () =>
            (connector?.functionGroups || []).map((functionGroup) => ({
                id: functionGroup.name,
                columns: [
                    functionGroup.name,
                    <>
                        {functionGroup.kinds?.map((kind) => (
                            <div key={kind}>
                                <Badge color="secondary">{kind}</Badge>
                            </div>
                        ))}
                    </>,
                ],
            })),
        [connector],
    );

    const renderStatusBadge = useCallback((status?: HealthStatus) => {
        if (!status) return <Badge color="transparent">Unknown</Badge>;
        switch (status) {
            case HealthStatus.Ok:
                return <Badge color="success">{status}</Badge>;
            case HealthStatus.Nok:
                return <Badge color="danger">{status}</Badge>;
            case HealthStatus.Unknown:
                return <Badge color="transparent">{status}</Badge>;
            default:
                return <Badge color="warning">{status}</Badge>;
        }
    }, []);

    const healthHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'part',
                content: 'Part',
            },
            {
                id: 'status',
                content: 'Status',
            },
            {
                id: 'description',
                content: 'Description',
            },
        ],
        [],
    );

    const healthData: TableDataRow[] = useMemo(() => {
        const data: TableDataRow[] = [
            {
                id: 'overallHealth',
                columns: ['Overall Health', renderStatusBadge(health?.status), health?.description || ''],
            },
        ];

        if (health?.parts) {
            Object.entries(health.parts).forEach(([key, value]) => {
                data.push({
                    id: key,
                    columns: [
                        key,
                        ['ok', 'failed', 'down', 'nok', 'unknown'].includes(value.status) ? (
                            renderStatusBadge(value.status)
                        ) : (
                            <Badge color="success">{value.status || 'OK'}</Badge>
                        ),
                        value?.description || '',
                    ],
                });
            });
        }

        return data;
    }, [health, renderStatusBadge]);

    const healthButtonsNode = (
        <div>
            {['up', 'ok', 'healthy'].includes(health ? health.status : 'unknown') ? (
                <CircleCheck size={24} strokeWidth={3} className="text-[var(--status-success-color)]" />
            ) : ['down', 'failed', 'notOk', 'nok', 'nOk'].includes(health ? health.status : 'unknown') ? (
                <CircleAlert size={24} strokeWidth={3} className="text-[var(--status-danger-color)]" />
            ) : (
                <CircleHelp size={24} strokeWidth={3} className="text-[var(--status-light-gray-color)]" />
            )}
        </div>
    );

    const endPointsHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'name',
                sortable: true,
                sort: 'asc',
                content: 'Name',
            },
            {
                id: 'context',
                sortable: true,
                content: 'Context',
            },
            {
                id: 'method',
                sortable: true,
                content: 'Method',
            },
        ],
        [],
    );

    const endPointsData: TableDataRow[] = useMemo(
        () =>
            (currentFunctionGroup?.endPoints || []).map((endPoint) => ({
                id: endPoint.name,
                columns: [endPoint.name, endPoint.context, endPoint.method],
            })),
        [currentFunctionGroup],
    );

    const functionGroupSelectData =
        connector?.functionGroups?.map((group) => ({
            label: attributeFieldNameTransform[group?.name || ''] || group?.name,
            value: group.functionGroupCode,
        })) || [];

    const functionGroupKinds = currentFunctionGroup?.kinds?.map((kind) => ({ label: kind, value: kind })) || [];

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: `${getEnumLabel(resourceEnum, Resource.Connectors)} Inventory`, href: '/connectors' },
                    { label: 'Connector Details' },
                ]}
            />
            <Container className="md:grid grid-cols-2">
                <Widget
                    title="Connector Details"
                    busy={isFetchingDetail || isBulkReconnecting || isReconnecting || isAuthorizing}
                    widgetButtons={widgetButtons}
                    titleSize="large"
                    refreshAction={getFreshConnectorDetails}
                    widgetLockName={LockWidgetNameEnum.ConnectorDetails}
                    lockSize="large"
                >
                    <CustomTable headers={attributesHeaders} data={attributesData} />
                </Widget>
                <Container>
                    <Widget title="Connector Functionality" busy={isFetchingDetail || isReconnecting} titleSize="large">
                        <CustomTable headers={functionalityHeaders} data={functionalityData} />
                    </Widget>

                    <Widget
                        title="Connector Health"
                        busy={isFetchingHealth}
                        widgetExtraTopNode={healthButtonsNode}
                        titleSize="large"
                        refreshAction={getFreshConnectorHealth}
                    >
                        <CustomTable headers={healthHeaders} data={healthData} />
                    </Widget>
                </Container>
            </Container>

            <Container marginTop>
                {connector && (
                    <CustomAttributeWidget
                        resource={Resource.Connectors}
                        resourceUuid={connector.uuid}
                        attributes={connector.customAttributes}
                    />
                )}

                <Widget title="Function Group Details" busy={isFetchingDetail || isReconnecting} titleSize="large">
                    <Select
                        id="functionGroup"
                        options={functionGroupSelectData}
                        value={currentFunctionGroup?.functionGroupCode || ''}
                        onChange={(value) => onFunctionGroupChange((value as string) || '')}
                    />
                    <Container marginTop>
                        <Widget title="Endpoints" titleSize="large">
                            <CustomTable headers={endPointsHeaders} data={endPointsData} />
                        </Widget>
                        <Widget
                            title="Attributes"
                            busy={isFetchingAllAttributes}
                            titleSize="large"
                            refreshAction={getFreshConnectorAttributesDesc}
                            widgetLockName={LockWidgetNameEnum.ConnectorAttributes}
                            lockSize="large"
                        >
                            <Select
                                id="functionGroupKind"
                                options={functionGroupKinds}
                                value={currentFunctionGroupKind || ''}
                                placeholder={currentFunctionGroup?.kinds[0]}
                                onChange={(value) => onFunctionGroupKindChange((value as string) || '')}
                            />
                            <AttributeDescriptorViewer attributeDescriptors={currentFunctionGroupKindAttributes || []} />
                        </Widget>
                    </Container>
                </Widget>
            </Container>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Connector"
                body="You are about to delete an Connector. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                icon="delete"
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Delete' },
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmAuthorize}
                caption="Approve Connector"
                body="You are about to approve this connector. Is this what you want to do?"
                toggle={() => setConfirmAuthorize(false)}
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => setConfirmAuthorize(false), body: 'Cancel' },
                    { color: 'primary', onClick: onAuthorizeConfirmed, body: 'Yes, approve' },
                ]}
            />

            <Dialog
                isOpen={deleteErrorMessage !== ''}
                caption="Delete Connector"
                body={
                    <>
                        Failed to delete the connector as the connector has dependent objects. Please find the details below:
                        <br />
                        <br />
                        {deleteErrorMessage}
                    </>
                }
                toggle={() => dispatch(actions.clearDeleteErrorMessages())}
                buttons={[
                    { color: 'secondary', variant: 'outline', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                    { color: 'danger', onClick: onForceDeleteConnector, body: 'Force' },
                ]}
            />

            <Dialog
                isOpen={isEditModalOpen}
                toggle={handleCloseEditModal}
                caption="Edit Connector"
                size="xl"
                body={<ConnectorForm connectorId={connector?.uuid} onCancel={handleCloseEditModal} />}
            />
        </div>
    );
}
