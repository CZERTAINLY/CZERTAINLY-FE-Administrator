import { actions as auditLogActions, selectors } from 'ducks/auditLogs';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { EntityType, selectors as filterSelectors } from 'ducks/filters';
import { actions as userInterfaceActions } from '../../../ducks/user-interface';

import { useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Container } from 'reactstrap';
import { dateFormatter } from 'utils/dateUtil';

import { ApiClients } from 'api';
import { WidgetButtonProps } from 'components/WidgetButtons';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { LockWidgetNameEnum } from 'types/user-interface';
import { SearchRequestModel } from 'types/certificate';
import PagedList from 'components/PagedList/PagedList';
import { PlatformEnum } from 'types/openapi/models';

import { AuditLogItemModel } from 'types/auditLogs';

type AuditLogDetailItem = {
    property: string;
    propertyValue: string;
};

function AuditLogs() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auditLogs = useSelector(selectors.auditLogs);
    const currentFilters = useSelector(filterSelectors.currentFilters(EntityType.AUDIT_LOG));

    const isFetchingPageData = useSelector(selectors.isFetchingPageData);
    const isPurging = useSelector(selectors.isPurging);
    const isExporting = useSelector(selectors.isExporting);

    // enum selectors
    const moduleEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Module));
    const actorEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ActorType));
    const authMethodEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.AuthMethod));
    const resourceEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const operationEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Operation));
    const operationResultEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.OperationResult));

    const isBusy = isFetchingPageData || isPurging || isExporting;

    const onListCallback = useCallback((filters: SearchRequestModel) => dispatch(auditLogActions.listAuditLogs(filters)), [dispatch]);

    const purgeCallback = useCallback(() => dispatch(auditLogActions.purgeLogs(currentFilters)), [dispatch, currentFilters]);

    const exportCallback = useCallback(() => dispatch(auditLogActions.exportLogs(currentFilters)), [dispatch, currentFilters]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'download',
                disabled: false,
                tooltip: 'Export Audit logs',
                onClick: () => {
                    exportCallback();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Purge Audit logs',
                onClick: () => {
                    purgeCallback();
                },
            },
        ],
        [exportCallback, purgeCallback],
    );

    const createAuditLogDetailData = useCallback(
        (auditLog: AuditLogItemModel): AuditLogDetailItem[] => [
            {
                property: 'Resource',
                propertyValue: getEnumLabel(resourceEnum, auditLog.resource.type),
            },
            {
                property: 'Resource UUIDs',
                propertyValue: auditLog.resource.uuids?.join(', ') ?? '',
            },
            {
                property: 'Resource names',
                propertyValue: auditLog.resource.names?.join(', ') ?? '',
            },
            {
                property: 'Affiliated resource',
                propertyValue: auditLog.affiliatedResource ? getEnumLabel(resourceEnum, auditLog.affiliatedResource.type) : '',
            },
            {
                property: 'Affiliated resource UUIDs',
                propertyValue: auditLog.affiliatedResource?.uuids?.join(', ') ?? '',
            },
            {
                property: 'Affiliated resource names',
                propertyValue: auditLog.affiliatedResource?.names?.join(', ') ?? '',
            },
            {
                property: 'Request method',
                propertyValue: auditLog.source?.method ?? '',
            },
            {
                property: 'Request path',
                propertyValue: auditLog.source?.path ?? '',
            },
            {
                property: 'Request IP address',
                propertyValue: auditLog.source?.ipAddress ?? '',
            },
            {
                property: 'Message',
                propertyValue: auditLog.message ?? '',
            },
            {
                property: 'Operation data',
                propertyValue: JSON.stringify(auditLog.operationData, null, 3),
            },
            {
                property: 'Additional data',
                propertyValue: JSON.stringify(auditLog.additionalData, null, 3),
            },
        ],
        [resourceEnum],
    );

    const createAuditLogDetailRows = (a: AuditLogDetailItem) => ({
        id: a.property,
        columns: [a.property, a.propertyValue],
    });

    const auditLogsDetailRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Property',
                align: 'left',
                id: 'property',
                width: '25%',
            },
            {
                content: 'Value',
                align: 'left',
                id: 'value',
            },
        ],
        [],
    );

    const auditLogsRowHeaders: TableHeader[] = useMemo(
        () => [
            {
                content: 'Id',
                align: 'left',
                id: 'id',
                width: '5%',
            },
            {
                content: 'Logged at',
                align: 'left',
                id: 'loggedAt',
                width: '5%',
            },
            {
                content: 'Module',
                align: 'left',
                id: 'module',
                width: '5%',
            },
            {
                content: 'Actor',
                align: 'left',
                id: 'actor',
                width: '10%',
            },
            {
                content: 'Auth method',
                align: 'left',
                id: 'authMethod',
                width: '5%',
            },
            {
                content: 'Resource',
                align: 'left',
                id: 'resource',
                width: '10%',
            },
            {
                content: 'Affiliated resource',
                align: 'left',
                id: 'affiliatedResource',
                width: '10%',
            },
            {
                content: 'Operation',
                align: 'center',
                id: 'operation',
                width: '5%',
            },
            {
                content: 'Operation result',
                align: 'center',
                id: 'operationResult',
                width: '5%',
            },
            {
                content: '',
                id: 'moreInfo',
                width: '2%',
            },
        ],
        [],
    );

    const auditLogsList: TableDataRow[] = useMemo(
        () =>
            auditLogs.map((log) => {
                return {
                    id: log.id,

                    columns: [
                        '' + log.id,
                        <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(log.loggedAt)}</span>,
                        getEnumLabel(moduleEnum, log.module),
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {getEnumLabel(actorEnum, log.actor.type)}
                            {log.actor.uuid && log.actor.name ? (
                                <Link to={`../users/detail/${log.actor.uuid}`}> {log.actor.name}</Link>
                            ) : log.actor.uuid ? (
                                <Button
                                    color="white"
                                    size="sm"
                                    className="p-0 ms-1"
                                    onClick={() => {
                                        navigate(`../users/detail/${log.actor.uuid}`);
                                    }}
                                >
                                    {' '}
                                    <i className="fa fa-circle-arrow-right"></i>
                                </Button>
                            ) : (
                                ''
                            )}
                        </span>,
                        getEnumLabel(authMethodEnum, log.actor.authMethod),
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {getEnumLabel(resourceEnum, log.resource.type)}
                            {log.resource.uuids && log.resource.uuids.length > 0 && log.resource.names && log.resource.names.length > 0 ? (
                                <Link to={`../${log.resource.type}/detail/${log.resource.uuids[0]}`}> {log.resource.names[0]}</Link>
                            ) : log.resource.uuids && log.resource.uuids.length > 0 ? (
                                <Button
                                    color="white"
                                    size="sm"
                                    className="p-0 ms-1"
                                    onClick={() => {
                                        navigate(`../${log.resource.type}/detail/${log.resource.uuids ? log.resource.uuids[0] : ''}`);
                                    }}
                                >
                                    {' '}
                                    <i className="fa fa-circle-arrow-right"></i>
                                </Button>
                            ) : (
                                ''
                            )}
                        </span>,
                        <span style={{ whiteSpace: 'nowrap' }}>
                            {log.affiliatedResource ? getEnumLabel(resourceEnum, log.affiliatedResource.type) : ''}
                            {log.affiliatedResource &&
                            log.affiliatedResource.uuids &&
                            log.affiliatedResource.uuids.length > 0 &&
                            log.affiliatedResource.names &&
                            log.affiliatedResource.names.length > 0 ? (
                                <Link to={`../${log.affiliatedResource.type}/detail/${log.affiliatedResource.uuids[0]}`}>
                                    {' '}
                                    {log.affiliatedResource.names[0]}
                                </Link>
                            ) : log.affiliatedResource && log.affiliatedResource.uuids && log.affiliatedResource.uuids.length > 0 ? (
                                <Button
                                    color="white"
                                    size="sm"
                                    className="p-0 ms-1"
                                    onClick={() => {
                                        navigate(
                                            `../${log.affiliatedResource ? log.affiliatedResource.type : ''}/detail/${log.affiliatedResource && log.affiliatedResource.uuids ? log.affiliatedResource.uuids[0] : ''}`,
                                        );
                                    }}
                                >
                                    {' '}
                                    <i className="fa fa-circle-arrow-right"></i>
                                </Button>
                            ) : (
                                ''
                            )}
                        </span>,
                        getEnumLabel(operationEnum, log.operation),
                        getEnumLabel(operationResultEnum, log.operationResult),
                        <Button
                            className="btn btn-link p-0 ms-2"
                            color="white"
                            title="Detail"
                            key={`detail${log.id}`}
                            onClick={() => {
                                dispatch(
                                    userInterfaceActions.showGlobalModal({
                                        content: (
                                            <CustomTable
                                                headers={auditLogsDetailRowHeaders}
                                                data={createAuditLogDetailData(log).map(createAuditLogDetailRows)}
                                            />
                                        ),
                                        isOpen: true,
                                        showCloseButton: true,
                                        title: 'Audit log detail',
                                        size: 'xl',
                                    }),
                                );
                            }}
                        >
                            <i
                                className="fa fa-info"
                                style={{ color: 'auto', marginBottom: '9.5px', marginLeft: '4px', fontSize: '14px' }}
                            />
                        </Button>,
                        // log.operationData ? <span className={styles.showMore}>Show more...</span> : 'None',
                        // log.additionalData ? <span className={styles.showMore}>Show more...</span> : 'None',
                    ],
                };
            }),
        [
            auditLogs,
            navigate,
            moduleEnum,
            actorEnum,
            authMethodEnum,
            resourceEnum,
            operationEnum,
            operationResultEnum,
            auditLogsDetailRowHeaders,
            createAuditLogDetailData,
            dispatch,
        ],
    );

    return (
        <Container className="themed-container" fluid>
            <PagedList
                entity={EntityType.AUDIT_LOG}
                onListCallback={onListCallback}
                getAvailableFiltersApi={useCallback((apiClients: ApiClients) => apiClients.auditLogs.getSearchableFieldInformation5(), [])}
                addHidden={true}
                hasCheckboxes={false}
                additionalButtons={buttons}
                headers={auditLogsRowHeaders}
                data={auditLogsList}
                hasDetails={false}
                isBusy={isBusy}
                title="Audit logs"
                entityNameSingular="an Audit log"
                entityNamePlural="Audit logs"
                filterTitle="Audit logs Filter"
                pageWidgetLockName={LockWidgetNameEnum.AuditLogs}
            />
        </Container>
    );
}

export default AuditLogs;
