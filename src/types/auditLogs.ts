import { AuditLogDto as AuditLogDtoOpenApi, AuditLogFilter, AuditLogResponseDto, Pageable } from './openapi';

export type PageableDto = Pageable;
export type PageableModel = PageableDto;

export type AuditLogFilterDto = AuditLogFilter;
export type AuditLogFilterModel = AuditLogFilterDto;

export type AuditLogItemDto = AuditLogDtoOpenApi;
export type AuditLogItemModel = AuditLogItemDto;

export type AuditLogDto = AuditLogResponseDto;
export type AuditLogModel = Omit<AuditLogDto, 'items'> & { items: Array<AuditLogItemModel> };
