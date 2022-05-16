import { Observable } from 'rxjs';

import { PagedDataDTO } from "../.common/PagedDataDTO";

export type AuditLogOperation =
   "CREATE" |
   "DELETE" |
   "CHANGE" |
   "ENABLE" |
   "DISABLE" |
   "AUTH" |
   "REQUEST" |
   "ISSUE" |
   "RENEW" |
   "REVOKE" |
   "RESET" |
   "START" |
   "STOP" |
   "VALIDATE" |
   "CALLBACK" |
   "CONNECT" |
   "FORCE_DELETE" |
   "APPROVE"
;

export type AuditLogOperationStatus =
   "FAILURE" |
   "SUCCESS"
;

export type AuditLogSourceTarget =
   "ACCESS" |
   "ACME_ACCOUNT" |
   "ACME_PROFILE" |
   "ADMINISTRATOR" |
   "ATTRIBUTES" |
   "AUDIT_LOG" |
   "BE" |
   "CA" |
   "CA_INSTANCE" |
   "CERTIFICATE" |
   "CLIENT" |
   "CONNECTOR" |
   "CREDENTIAL" |
   "DISCOVERY" |
   "ENTITY" |
   "END_ENTITY" |
   "END_ENTITY_CERTIFICATE" |
   "END_ENTITY_PROFILE" |
   "FE" |
   "GROUP" |
   "HEALTH" |
   "LOCALHOST" |
   "RA_PROFILE" |
   "STATISTICS"
;

export interface AuditLogDTO {
   id: number;
   author: string;
   created: Date;
   operationStatus: AuditLogOperationStatus;
   origination: AuditLogSourceTarget;
   affected: AuditLogSourceTarget;
   objectIdentifier: string;
   operation: AuditLogOperation;
   additionalData: any;
}

export type PagedAuditLog = PagedDataDTO<AuditLogDTO>;

export interface AuditLogsApi {

   getLogs(page: number, size: number, sort?: string, filters?: { [key: string]: string }): Observable<PagedAuditLog>;

   getObjects(): Observable<string[]>;

   getOperations(): Observable<string[]>;

   getStatuses(): Observable<string[]>;

}
