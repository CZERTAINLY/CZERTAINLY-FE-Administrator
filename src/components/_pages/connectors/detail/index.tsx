import AttributeDescriptorViewer from 'components/Attributes/AttributeDescriptorViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/connectors';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Select from 'react-select';
import { Badge, Col, Container, Row, Table } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';
import { FunctionGroupModel } from 'types/connectors';

import { attributeFieldNameTransform } from 'utils/attributes/attributes';
import { inventoryStatus } from 'utils/connector';
import { ConnectorStatus, HealthStatus, PlatformEnum, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';

import { LockWidgetNameEnum } from 'types/user-interface';
import styles from './connectorDetails.module.scss';

export default function ConnectorDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const deleteErrorMessage = useSelector(selectors.deleteErrorMessage);

    const [currentFunctionGroup, setFunctionGroup] = useState<FunctionGroupModel | undefined>();
    const [currentFunctionGroupKind, setCurrentFunctionGroupKind] = useState<string>();
    const [currentFunctionGroupKindAttributes, setCurrentFunctionGroupKindAttributes] = useState<AttributeDescriptorModel[] | undefined>();

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmAuthorize, setConfirmAuthorize] = useState<boolean>(false);

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

    const onEditClick = useCallback(() => {
        if (!connector) return;
        navigate(`../../edit/${connector.uuid}`, { relative: 'path' });
    }, [connector, navigate]);

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
                columns: ['Status', <Badge color={`${connectorStatus[1]}`}>{connectorStatus[0]}</Badge>],
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
                            <div key={kind} className={styles.kind}>
                                <Badge color="secondary">{kind}</Badge>
                            </div>
                        ))}
                    </>,
                ],
            })),
        [connector],
    );

    const healthButtonsNode = (
        <div>
            <h5>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {['up', 'ok', 'healthy'].includes(health ? health.status : 'unknown') ? (
                    <i className="fa fa-check-circle" style={{ color: 'green' }} aria-hidden="true" />
                ) : ['down', 'failed', 'notOk', 'nok', 'nOk'].includes(health ? health.status : 'unknown') ? (
                    <i className="fa fa-exclamation-circle" style={{ color: 'red' }} aria-hidden="true" />
                ) : (
                    <i className="fa fa-question-circle" style={{ color: 'grey' }} aria-hidden="true" />
                )}
            </h5>
        </div>
    );

    const renderStatusBadge = useCallback((status?: HealthStatus) => {
        if (!status) return <Badge color="light">Unknown</Badge>;
        switch (status) {
            case HealthStatus.Ok:
                return <Badge color="success">{status}</Badge>;
            case HealthStatus.Nok:
                return <Badge color="danger">{status}</Badge>;
            case HealthStatus.Unknown:
                return <Badge color="light">{status}</Badge>;
            default:
                return <Badge color="warning">{status}</Badge>;
        }
    }, []);

    const healthBody = useCallback(() => {
        if (!health?.parts) return <></>;

        return Object.entries(health?.parts).map(([key, value]) =>
            ['ok', 'failed', 'down', 'nok', 'unknown'].includes(value.status) ? (
                <tr>
                    <td>{key}</td>
                    <td>{renderStatusBadge(value.status)}</td>
                    <td>{value?.description || ''}</td>
                </tr>
            ) : (
                <tr>
                    <td>{key}</td>
                    <td>
                        <Badge color="success">{value.status || 'OK'}</Badge>
                    </td>
                    <td>{value?.description || ''}</td>
                </tr>
            ),
        );
    }, [health, renderStatusBadge]);

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
        <Container className="themed-container" fluid>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
                <Col>
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
                </Col>

                <Col>
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
                        <Table className="table-hover" size="sm">
                            <thead>
                                <tr>
                                    <th>Part</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key="healthCheckStatus">
                                    <td className="fw-bold">Overall Health</td>
                                    <td>{renderStatusBadge(health?.status)}</td>
                                    <td>{health?.description || ''}</td>
                                </tr>
                                {healthBody()}
                            </tbody>
                        </Table>
                    </Widget>
                </Col>
            </Row>

            {connector && (
                <CustomAttributeWidget
                    resource={Resource.Connectors}
                    resourceUuid={connector.uuid}
                    attributes={connector.customAttributes}
                />
            )}

            <Widget title="Function Group Details" busy={isFetchingDetail || isReconnecting} titleSize="large">
                <hr />
                <Row xs="1" sm="2" md="3" lg="3" xl="4">
                    <Col style={{ display: 'inline-block' }}>
                        <Select
                            maxMenuHeight={140}
                            options={functionGroupSelectData}
                            value={{
                                label: attributeFieldNameTransform[currentFunctionGroup?.name || ''] || currentFunctionGroup?.name,
                                value: currentFunctionGroup?.functionGroupCode,
                            }}
                            menuPlacement="auto"
                            onChange={(event) => onFunctionGroupChange(event?.value || '')}
                        />
                    </Col>
                </Row>
                &nbsp;
                <Widget title="Endpoints" titleSize="large">
                    <CustomTable headers={endPointsHeaders} data={endPointsData} />
                </Widget>
                <hr />
                <Widget
                    title="Attributes"
                    busy={isFetchingAllAttributes}
                    titleSize="large"
                    refreshAction={getFreshConnectorAttributesDesc}
                    widgetLockName={LockWidgetNameEnum.ConnectorAttributes}
                    lockSize="large"
                >
                    <Row xs="1" sm="2" md="3" lg="3" xl="4">
                        <Col>
                            <Select
                                maxMenuHeight={140}
                                options={functionGroupKinds}
                                value={{ label: currentFunctionGroupKind, value: currentFunctionGroupKind }}
                                placeholder={currentFunctionGroup?.kinds[0]}
                                menuPlacement="auto"
                                key="connectorFunctionGroupKindDropdown"
                                onChange={(event) => onFunctionGroupKindChange(event?.value || '')}
                            />
                        </Col>
                    </Row>
                    &nbsp;
                    <Widget>
                        <AttributeDescriptorViewer attributeDescriptors={currentFunctionGroupKindAttributes || []} />
                    </Widget>
                    &nbsp;
                </Widget>
            </Widget>

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Connector"
                body="You are about to delete an Connector. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmAuthorize}
                caption="Approve Connector"
                body="You are about to approve an Connector. Is this what you want to do?"
                toggle={() => setConfirmAuthorize(false)}
                buttons={[
                    { color: 'success', onClick: onAuthorizeConfirmed, body: 'Yes, approve' },
                    { color: 'secondary', onClick: () => setConfirmAuthorize(false), body: 'Cancel' },
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
                    { color: 'danger', onClick: onForceDeleteConnector, body: 'Force' },
                    { color: 'secondary', onClick: () => dispatch(actions.clearDeleteErrorMessages()), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
