import { AuditLogDto, AuditLogItemDto, AuditLogItemModel, AuditLogModel } from 'types/auditLogs';

export function transformAuditLogItemDtoToModel(auditLog: AuditLogItemDto): AuditLogItemModel {
    return { ...auditLog };
}

export function transformAuditLogDtoToModel(auditLog: AuditLogDto): AuditLogModel {
    return {
        ...auditLog,
        items: auditLog.items.map(transformAuditLogItemDtoToModel),
    };
}
