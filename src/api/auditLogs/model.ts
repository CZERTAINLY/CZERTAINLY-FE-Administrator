import { Observable } from 'rxjs';

import { PagedDataDTO } from "../.common/PagedDataDTO";

export interface AuditLogDTO {
   id: number;
   author: string;
   created: Date;
   operationStatus: number;
   origination: string;
   affected: string;
   objectIdentifier: string;
   operation: number;
   additionalData: any;
}

export type PagedAuditLog = PagedDataDTO<AuditLogDTO>;

export interface AuditLogsApi {

   getLogs(page: number, size: number, sort?: string, filters?: { [key: string]: string }): Observable<PagedAuditLog>;

   getObjects(): Observable<string[]>;

   getOperations(): Observable<string[]>;

   getStatuses(): Observable<string[]>;

}
