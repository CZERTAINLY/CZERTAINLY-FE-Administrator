import { AuditLogDTO } from "api/auditLogs";
import { AuditLogModel } from "models";

export function transformAuditLogDTOToModel(auditLog: AuditLogDTO): AuditLogModel {

   return {
      id: auditLog.id,
      author: auditLog.author,
      created: new Date(auditLog.created),
      operationStatus: auditLog.operationStatus,
      origination: auditLog.origination,
      affected: auditLog.origination,
      objectIdentifier: auditLog.objectIdentifier,
      operation: auditLog.operation,
      additionalData: JSON.parse(JSON.stringify(auditLog.additionalData))
   }

}