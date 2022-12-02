import { Observable } from 'rxjs';
import { AuditLogOperation, AuditLogOperationStatus, AuditLogSourceTarget } from 'types/auditLogs';

import { PagedDataDTO } from "../_common/pagedDataDTO";
import { FormValues } from "components/_pages/auditLogs/AuditLogsFilters";

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
