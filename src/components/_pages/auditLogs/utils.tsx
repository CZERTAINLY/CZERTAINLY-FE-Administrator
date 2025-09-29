import { TableHeader } from 'components/CustomTable';
import { auditLogsTypeMapping } from './mapping';
import { getEnumLabel } from 'ducks/enums';
import { Link } from 'react-router';
import { Button } from 'reactstrap';
import { EnumItemDto } from 'types/enums';
import { AuditLogDto } from 'types/openapi';
import { dateFormatter } from 'utils/dateUtil';

export const createAuditLogDetailData = (
    auditLog: AuditLogDto,
    resourceEnum: {
        [key: string]: EnumItemDto;
    },
    onLinkClick: () => void,
) => {
    return [
        {
            property: 'Timestamp',
            propertyValue: auditLog.timestamp,
        },
        {
            property: 'Logged at',
            propertyValue: auditLog.loggedAt,
        },
        {
            property: 'Resource',
            propertyValue: getEnumLabel(resourceEnum, auditLog.resource.type),
        },
        {
            property: 'Resource objects',
            propertyValue: auditLog.resource.objects?.map((object, index) => {
                const element =
                    object.uuid && auditLogsTypeMapping[auditLog.resource.type] ? (
                        <Link
                            onClick={onLinkClick}
                            key={index}
                            to={`../${auditLogsTypeMapping[auditLog.resource.type]}/detail/${object.uuid}`}
                        >
                            {object.name ?? object.uuid ?? ''}
                        </Link>
                    ) : (
                        <span key={index}>
                            {object.name ?? ''} {object.uuid ? `(${object.uuid})` : ''}
                        </span>
                    );

                return (
                    <span key={index}>
                        {index > 0 && ', '}
                        {element}
                    </span>
                );
            }),
        },
        {
            property: 'Affiliated resource objects',
            propertyValue: auditLog.affiliatedResource?.objects?.map((object, index) => {
                const element =
                    object.uuid && auditLog.affiliatedResource && auditLogsTypeMapping[auditLog.affiliatedResource.type] ? (
                        <Link
                            onClick={onLinkClick}
                            key={index}
                            to={`../${auditLogsTypeMapping[auditLog.affiliatedResource.type]}/detail/${object.uuid}`}
                        >
                            {object.name ?? object.uuid ?? ''}
                        </Link>
                    ) : (
                        <span key={index}>
                            {object.name ?? ''} {object.uuid ? `(${object.uuid})` : ''}
                        </span>
                    );

                return (
                    <span key={index}>
                        {index > 0 && ', '}
                        {element}
                    </span>
                );
            }),
        },
        {
            property: 'Affiliated resource',
            propertyValue: auditLog.affiliatedResource ? getEnumLabel(resourceEnum, auditLog.affiliatedResource.type) : '',
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
    ];
};

export const createAuditLogsList = (
    auditLogs: AuditLogDto[],
    resourceEnum: {
        [key: string]: EnumItemDto;
    },
    moduleEnum: {
        [key: string]: EnumItemDto;
    },
    actorEnum: {
        [key: string]: EnumItemDto;
    },
    authMethodEnum: {
        [key: string]: EnumItemDto;
    },
    operationEnum: {
        [key: string]: EnumItemDto;
    },
    operationResultEnum: {
        [key: string]: EnumItemDto;
    },
    navigate: (path: string) => void,
    onInfoClick: (log: AuditLogDto) => void,
) => {
    if (auditLogs.length === 0) {
        return [];
    } else {
        return auditLogs.map((log) => {
            return {
                id: log.id,

                columns: [
                    '' + log.id,
                    <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(log.timestamp)}</span>,
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
                        {!auditLogsTypeMapping[log.resource.type] && log.resource.objects && log.resource.objects[0]?.name && (
                            <span style={{ marginLeft: '5px' }}>{log.resource.objects[0]?.name ?? ''}</span>
                        )}
                        {log.resource.objects &&
                        log.resource.objects.length > 0 &&
                        log.resource.objects[0]?.uuid &&
                        log.resource.objects[0]?.name &&
                        auditLogsTypeMapping[log.resource.type] ? (
                            <Link to={`../${auditLogsTypeMapping[log.resource.type]}/detail/${log.resource.objects[0].uuid}`}>
                                {' '}
                                {log.resource.objects[0].name}
                            </Link>
                        ) : log.resource.objects &&
                          log.resource.objects.length > 0 &&
                          log.resource.objects[0]?.uuid &&
                          auditLogsTypeMapping[log.resource.type] ? (
                            <Button
                                title="Go to details"
                                color="white"
                                size="sm"
                                className="p-0 ms-1"
                                onClick={() => {
                                    navigate(
                                        `../${auditLogsTypeMapping[log.resource.type]}/detail/${log.resource.objects ? log.resource.objects[0].uuid : ''}`,
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
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {log.affiliatedResource ? getEnumLabel(resourceEnum, log.affiliatedResource.type) : ''}
                        {log.affiliatedResource &&
                            log.affiliatedResource.objects &&
                            log.affiliatedResource.objects[0]?.name &&
                            !auditLogsTypeMapping[log.affiliatedResource.type] && (
                                <span style={{ marginLeft: '5px' }}>{log.affiliatedResource.objects[0]?.name ?? ''}</span>
                            )}
                        {log.affiliatedResource &&
                        log.affiliatedResource.objects &&
                        log.affiliatedResource.objects.length > 0 &&
                        log.affiliatedResource.objects[0]?.uuid &&
                        log.affiliatedResource.objects[0]?.name &&
                        auditLogsTypeMapping[log.affiliatedResource.type] ? (
                            <Link
                                to={`../${auditLogsTypeMapping[log.affiliatedResource.type]}/detail/${log.affiliatedResource.objects[0].uuid}`}
                            >
                                {' '}
                                {log.affiliatedResource.objects[0].name}
                            </Link>
                        ) : log.affiliatedResource &&
                          auditLogsTypeMapping[log.affiliatedResource.type] &&
                          log.affiliatedResource.objects &&
                          log.affiliatedResource.objects.length > 0 &&
                          log.affiliatedResource.objects[0]?.uuid ? (
                            <Button
                                title="Go to details"
                                color="white"
                                size="sm"
                                className="p-0 ms-1"
                                onClick={() => {
                                    navigate(
                                        `../${log.affiliatedResource ? auditLogsTypeMapping[log.affiliatedResource.type] : ''}/detail/${log.affiliatedResource && log.affiliatedResource.objects ? log.affiliatedResource.objects[0].uuid : ''}`,
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
                            onInfoClick(log);
                        }}
                    >
                        <i className="fa fa-info" style={{ color: 'auto', marginBottom: '9.5px', marginLeft: '4px', fontSize: '14px' }} />
                    </Button>,
                ],
            };
        });
    }
};

export const auditLogsRowHeaders: TableHeader[] = [
    {
        content: 'Id',
        align: 'left',
        id: 'id',
        width: '5%',
    },
    {
        content: 'Timestamp',
        align: 'left',
        id: 'timestamp',
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
];

export const auditLogsDetailRowHeaders: TableHeader[] = [
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
];
