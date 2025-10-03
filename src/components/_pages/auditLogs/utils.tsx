import { TableHeader } from 'components/CustomTable';
import { auditLogsTypeMapping } from './mapping';
import { getEnumLabel } from 'ducks/enums';
import { Link } from 'react-router';
import { Button } from 'reactstrap';
import { EnumItemDto } from 'types/enums';
import { AuditLogDto } from 'types/openapi';
import { dateFormatter } from 'utils/dateUtil';

/** Helper to render the list of (affiliated) resource objects without duplication */
const renderObjectList = (
    source: AuditLogDto['resource'] | AuditLogDto['affiliatedResource'],
    onLinkClick: () => void,
    keyPrefix: string,
) =>
    source?.objects?.map((object, index) => {
        const mappingType = source?.type ? auditLogsTypeMapping[source.type] : undefined;

        const element =
            object.uuid && mappingType ? (
                <Link onClick={onLinkClick} key={`${object.uuid}-${keyPrefix}-link`} to={`../${mappingType}/detail/${object.uuid}`}>
                    {object.name ?? object.uuid ?? ''}
                </Link>
            ) : (
                <span key={`${object.uuid}-${keyPrefix}-span`}>
                    {object.name ?? ''} {object.uuid ? `(${object.uuid})` : ''}
                </span>
            );

        return (
            <span key={`${object.uuid}-${keyPrefix}-wrapper`}>
                {index > 0 && ', '}
                {element}
            </span>
        );
    });

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
            propertyValue: renderObjectList(auditLog.resource, onLinkClick, 'resource'),
        },
        {
            property: 'Affiliated resource objects',
            propertyValue: renderObjectList(auditLog.affiliatedResource, onLinkClick, 'affiliated'),
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

const renderActor = (actor: AuditLogDto['actor'], actorEnum: Record<string, EnumItemDto>, navigate: (path: string) => void) => {
    const typeLabel = getEnumLabel(actorEnum, actor.type);
    let additional: JSX.Element | string = '';

    if (actor.uuid) {
        const path = `../users/detail/${actor.uuid}`;
        if (actor.name) {
            additional = <Link to={path}> {actor.name}</Link>;
        } else {
            additional = (
                <Button color="white" size="sm" className="p-0 ms-1" onClick={() => navigate(path)}>
                    {' '}
                    <i className="fa fa-circle-arrow-right"></i>
                </Button>
            );
        }
    }

    if (actor.name && !actor.uuid) {
        additional = <span style={{ marginLeft: '5px' }}>{actor.name}</span>;
    }

    return (
        <span style={{ whiteSpace: 'nowrap' }}>
            {typeLabel}
            {additional}
        </span>
    );
};

const renderResource = (
    resource: AuditLogDto['resource'] | AuditLogDto['affiliatedResource'],
    resourceEnum: Record<string, EnumItemDto>,
    navigate: (path: string) => void,
) => {
    if (!resource) {
        return <span style={{ whiteSpace: 'nowrap' }} />;
    }

    const typeLabel = getEnumLabel(resourceEnum, resource.type);
    let additional: JSX.Element | string = '';
    const obj = resource.objects?.[0];

    if (obj) {
        const mappingType = auditLogsTypeMapping[resource.type];
        if (mappingType && obj.uuid) {
            const path = `../${mappingType}/detail/${obj.uuid}`;
            if (obj.name) {
                additional = <Link to={path}> {obj.name}</Link>;
            } else {
                additional = (
                    <Button title="Go to details" color="white" size="sm" className="p-0 ms-1" onClick={() => navigate(path)}>
                        {' '}
                        <i className="fa fa-circle-arrow-right"></i>
                    </Button>
                );
            }
        } else if (!mappingType && obj.name) {
            additional = <span style={{ marginLeft: '5px' }}>{obj.name}</span>;
        }
    }

    return (
        <span style={{ whiteSpace: 'nowrap' }}>
            {typeLabel}
            {additional}
        </span>
    );
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
        return auditLogs.map((log) => ({
            id: log.id,
            columns: [
                '' + log.id,
                <span key={`${log.id}-timestamp`} style={{ whiteSpace: 'nowrap' }}>
                    {dateFormatter(log.timestamp)}
                </span>,
                getEnumLabel(moduleEnum, log.module),
                renderActor(log.actor, actorEnum, navigate),
                getEnumLabel(authMethodEnum, log.actor.authMethod),
                renderResource(log.resource, resourceEnum, navigate),
                renderResource(log.affiliatedResource, resourceEnum, navigate),
                getEnumLabel(operationEnum, log.operation),
                getEnumLabel(operationResultEnum, log.operationResult),
                <Button
                    key={`${log.id}-info-button`}
                    className="btn btn-link p-0 ms-2"
                    color="white"
                    title="Detail"
                    onClick={() => onInfoClick(log)}
                >
                    <i className="fa fa-info" style={{ color: 'auto', marginBottom: '9.5px', marginLeft: '4px', fontSize: '14px' }} />
                </Button>,
            ],
        }));
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
