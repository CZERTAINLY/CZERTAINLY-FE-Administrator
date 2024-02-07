import {
    AuditLogDto,
    AuditLogFilterDto,
    AuditLogFilterModel,
    AuditLogItemDto,
    AuditLogItemModel,
    AuditLogModel,
    PageableDto,
    PageableModel,
} from 'types/auditLogs';

export function transformPageableModelToDto(pageable: PageableModel): PageableDto {
    return { ...pageable };
}

export function transformAuditLogFilterModelToDto(filter: AuditLogFilterModel): AuditLogFilterDto {
    return { ...filter };
}

export function transformAuditLogItemDtoToModel(auditLog: AuditLogItemDto): AuditLogItemModel {
    return { ...auditLog };
}

export function transformAuditLogDtoToModel(auditLog: AuditLogDto): AuditLogModel {
    return {
        ...auditLog,
        items: auditLog.items.map(transformAuditLogItemDtoToModel),
    };
}
