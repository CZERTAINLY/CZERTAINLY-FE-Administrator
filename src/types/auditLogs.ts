import { AuditLogDto as AuditLogDtoOpenApi, AuditLogResponseDto } from './openapi';

export type AuditLogItemDto = AuditLogDtoOpenApi;
export type AuditLogItemModel = AuditLogItemDto;
export type AuditLogResponseModel = AuditLogResponseDto;

export type AuditLogDto = AuditLogResponseDto;
export type AuditLogModel = Omit<AuditLogDto, 'items'> & { items: Array<AuditLogItemModel> };
